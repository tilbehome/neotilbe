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


    const source=read('canlitema/assets/product-video-popup.js');
    const html=read('canlitema/moduller/urunler/resim_alani_tipi/carousel_sol.twig');
    const fixture=html.slice(html.indexOf('<div id="video-button-container-987"'));
    const expression=async js=>{const r=await send('Runtime.evaluate',{expression:js,returnByValue:true});assert(!r.exceptionDetails,JSON.stringify(r.exceptionDetails));return r.result.value;};
    await expression('document.body.innerHTML='+JSON.stringify('<div class="product-body"><iframe src="https://www.youtube.com/embed/local"></iframe>'+fixture+'</div>'));
    await expression(source);await expression(source);
    assert.equal(await expression('document.getElementById("video-button-container-987").style.display'),'block');
    await expression('document.body.classList.add("modal-open");document.getElementById("video-button-987").click()');
    await expression('var style=document.createElement("style");style.textContent='+JSON.stringify(read('canlitema/assets/style.css'))+';document.head.appendChild(style)');
    fs.mkdirSync('artifacts/product-popup',{recursive:true});
    for(const width of [375,768,1440,844]) {
        await send('Emulation.setDeviceMetricsOverride',{width,height:width===844?390:900,deviceScaleFactor:1,mobile:false});
        assert.equal(await expression('[document.getElementById("close-popup-987"),document.querySelector("#video-container-987 iframe")].every(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.left>=0&&r.bottom<=innerHeight&&r.right<=innerWidth})'),true,'Popup controls must fit viewport');
        const shot=await send('Page.captureScreenshot',{format:'png'});
        fs.writeFileSync('artifacts/product-popup/'+width+'.png',Buffer.from(shot.data,'base64'));
    }
    assert.equal(await expression('document.activeElement.id'),'close-popup-987');
    assert.equal(await expression('document.querySelectorAll("#video-container-987 iframe").length'),1);
    await expression('document.getElementById("close-popup-987").click()');
    assert.equal(await expression('document.querySelectorAll("#video-container-987 iframe").length'),0);
    assert.equal(await expression('document.activeElement.id'),'video-button-987');
    assert.equal(await expression('document.body.classList.contains("modal-open")'),true);
    assert.equal(await expression('document.body.classList.contains("tilbe-product-video-open")'),false);
    await expression('document.getElementById("video-button-987").click();document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}))');
    assert.equal(await expression('document.getElementById("video-popup-987").hidden'),true);
    await expression('document.getElementById("video-button-987").click();document.getElementById("video-popup-987").click()');
    assert.equal(await expression('document.getElementById("video-popup-987").hidden'),true);
    await expression('document.getElementById("video-button-987").click();document.getElementById("video-popup-987").remove()');
    await delay(20);
    assert.equal(await expression('document.body.classList.contains("tilbe-product-video-open")'),false);
    await expression('document.body.innerHTML='+JSON.stringify('<iframe src="https://www.youtube.com/embed/unrelated"></iframe><div class="product-profile-1">'+fixture+'</div>'));
    await expression(source);
    assert.equal(await expression('document.getElementById("video-button-container-987").style.display'),'none');
    assert.equal(await expression('document.getElementById("video-button-container-988").style.display'),'block');
    console.log('PASS existing popup X/backdrop/Escape, focus restore, own scroll lock, cleanup, duplicate load and unrelated iframe isolation. Cross-origin player keyboard not certified.');
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
