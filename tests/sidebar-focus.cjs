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
    const expression=async js=>{const r=await send('Runtime.evaluate',{expression:js,returnByValue:true});assert(!r.exceptionDetails,JSON.stringify(r.exceptionDetails));return r.result.value;};
    await send('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:false});
    const html='<button id="open" class="btn-sidebar-menu">Menu</button><button id="user" class="btn-sidebar-user">Account</button><button id="outside">Outside</button><div class="op-black"></div><nav class="sidebar-menu-type-2"><button class="mobile-menu-close">Close</button><a id="menu-link" href="#local">Link</a></nav><nav class="sidebar-user"><button class="btn-sidebar-user">Close account</button><a href="#local">Account link</a></nav>';
    await expression('document.body.innerHTML='+JSON.stringify(html));
    const css=read('Platform Dosyaları/template-assets/plugins/bootstrap.soft.min.css')+read('Platform Dosyaları/template-assets/style.min.css')+read('canlitema/assets/style.css');
    await expression('document.head.innerHTML='+JSON.stringify('<style>'+css+'</style>'));
    await expression(read('Platform Dosyaları/template-assets/plugins/bootstrap.js').split('\n')[1]);
    await expression(source.slice(0,source.indexOf('function showLoader')));await delay(50);
    await expression('document.querySelector("#outside").focus();document.querySelector("#menu-link").focus()');
    assert.equal(await expression('document.activeElement.id'),'outside','Closed offscreen menu must not take keyboard focus');
    await expression('document.querySelector("#open").click()');
    assert.equal(await expression('!!document.activeElement.closest(".sidebar-menu-type-2")'),true);
    const key=async(name,code,modifiers=0)=>{await send('Input.dispatchKeyEvent',{type:'keyDown',key:name,code:name,windowsVirtualKeyCode:code,modifiers});await send('Input.dispatchKeyEvent',{type:'keyUp',key:name,code:name,windowsVirtualKeyCode:code,modifiers});};
    await expression('document.querySelector("#menu-link").focus()');await key('Tab',9);
    assert.equal(await expression('document.activeElement.classList.contains("mobile-menu-close")'),true);
    await key('Escape',27);assert.equal(await expression('document.activeElement.id'),'open');
    assert.equal(await expression('document.body.classList.contains("tilbe-sidebar-open")'),false);
    await expression('document.querySelector("#user").click();document.querySelector("#open").click();document.querySelector(".mobile-menu-close").click()');
    assert.equal(await expression('!!document.activeElement.closest(".sidebar-user")'),true);
    assert.equal(await expression('document.body.classList.contains("tilbe-sidebar-open")'),true);
    await expression(`document.body.insertAdjacentHTML("beforeend",'<div class="modal show" style="display:block"><button id="modal-button">Modal</button></div>');document.querySelector("#modal-button").focus()`);
    await key('Escape',27);assert.equal(await expression('document.activeElement.id'),'modal-button');
    assert.equal(await expression('document.querySelector(".sidebar-user").classList.contains("active")'),true);
    // Compare the promo wrapper before/after removal from invalid UL content, using rendered Twig.
    const rendered=read('artifacts/full-pages/content.html');
    await expression('document.body.innerHTML=new DOMParser().parseFromString('+JSON.stringify(rendered)+',"text/html").querySelector(".sidebar-menu-type-2").outerHTML;document.querySelector("nav").classList.add("active")');
    for(const width of [375,768]) {
        await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
        const result=await expression(`(()=>{
            const promo=document.querySelector('.mms-12345'),list=document.querySelector('.categories>ul');
            const snapshot=()=>[promo,...promo.querySelectorAll('*')].map(el=>{const c=getComputedStyle(el),r=el.getBoundingClientRect();return {css:Object.fromEntries([...c].map(k=>[k,c.getPropertyValue(k)])),size:[r.x,r.y,r.width,r.height]};});
            list.prepend(promo);const before=snapshot();list.before(promo);return JSON.stringify(before)===JSON.stringify(snapshot());
        })()`);
        assert.equal(result,true,'Promo style/geometry must remain unchanged at '+width);
        fs.mkdirSync(path.join(root,'artifacts/sidebar'),{recursive:true});
        const shot=await send('Page.captureScreenshot',{format:'png'});
        fs.writeFileSync(path.join(root,'artifacts/sidebar/menu-'+width+'.png'),Buffer.from(shot.data,'base64'));
    }
    console.log('PASS closed menu focus exclusion, open focus, Tab loop, Escape return and another panel/modal preservation. Offline fixture only.');
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
