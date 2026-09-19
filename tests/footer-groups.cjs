// Offline browser checks: Node >= 22 and an installed Chromium browser.
// No packages, Qukasoft server, credentials or customer data are used.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const browserPath = process.env.BROWSER_PATH || [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe'
].find(p => fs.existsSync(p));
assert(browserPath, 'Set BROWSER_PATH to an installed Chromium browser');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'tilbe-platform-01-'));
const browser = spawn(browserPath, [
    '--headless=new', '--remote-debugging-port=0', '--no-first-run',
    '--no-default-browser-check', '--disable-background-networking',
    '--user-data-dir=' + profile, 'about:blank'
], { windowsHide: true, stdio: 'ignore' });
let socket;
let sequence = 0;
const pending = new Map();
function send(method, params = {}) {
    return new Promise((resolve, reject) => {
        const id = ++sequence;
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params }));
    });
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    const portFile = path.join(profile, 'DevToolsActivePort');
    for (let i = 0; !fs.existsSync(portFile) && i < 100; i++) await delay(100);
    assert(fs.existsSync(portFile), 'Browser debugging port unavailable');
    const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
    const pages = await (await fetch('http://127.0.0.1:' + port + '/json')).json();
    socket = new WebSocket(pages.find(p => p.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
        socket.onopen = resolve;
        socket.onerror = reject;
    });
    socket.onmessage = event => {
        const data = JSON.parse(event.data);
        const request = pending.get(data.id);
        if (!request) return;
        pending.delete(data.id);
        if (data.error) request.reject(new Error(data.error.message));
        else request.resolve(data.result);
    };
    await send('Network.enable');
    await send('Network.setBlockedURLs', { urls: ['http://*', 'https://*'] });


    const source=read('canlitema/assets/scripts.js');
    const start=source.indexOf('function mobileFooterToggle('),end=source.indexOf('$(document).ready',start);
    const footer=read('canlitema/moduller/footer.twig');
    const titles=[...footer.matchAll(/<button type="button" class="title text-left footer-group-toggle"[^>]*>[\s\S]*?<\/button>/g)].map(m=>m[0].replace(/\{\{[\s\S]*?\}\}/g,'Fixture title'));
    assert.equal(titles.length,3);
    const html='<footer><div class="bb"><div class="info">'+titles.map((b,i)=>b+'<div class="fs f'+(i+1)+'" id="tilbe-footer-group-'+(i+1)+'"><a href="#local">Footer link '+(i+1)+'</a></div>').join('')+'</div></div></footer>';
    const expression=async js=>{const r=await send('Runtime.evaluate',{expression:js,returnByValue:true});assert(!r.exceptionDetails,JSON.stringify(r.exceptionDetails));return r.result.value;};
    await send('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:false});
    await expression('document.body.innerHTML='+JSON.stringify(html));
    await expression(read('Platform Dosyaları/template-assets/plugins/bootstrap.js').split('\n')[1]);
    await expression(source.slice(start,end));await delay(50);
    await expression('document.querySelector(".footer-group-toggle").focus()');
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
    assert.equal(await expression('document.querySelector(".footer-group-toggle").getAttribute("aria-expanded")'),'false');
    assert.equal(await expression('getComputedStyle(document.querySelector(".f1")).display'),'none');
    assert.notEqual(await expression('getComputedStyle(document.querySelector(".f2")).display'),'none');
    await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
    await expression('window.dispatchEvent(new Event("resize"))');
    assert.notEqual(await expression('getComputedStyle(document.querySelector(".f1")).display'),'none');
    assert.equal(await expression('document.querySelector(".footer-group-toggle").disabled'),true);
    await send('Emulation.setDeviceMetricsOverride',{width:991,height:900,deviceScaleFactor:1,mobile:false});
    await expression('window.dispatchEvent(new Event("resize"));document.querySelector(".footer-group-toggle").click()');
    assert.equal(await expression('getComputedStyle(document.querySelector(".f1")).display'),'none');
    console.log('PASS native Enter, isolated footer group, desktop restoration, 991px boundary.');
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
}).finally(async () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ id: ++sequence, method: 'Browser.close' }));
        socket.close();
    }
    browser.kill();
});
