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



    const expression=async js=>{const r=await send('Runtime.evaluate',{expression:js,returnByValue:true,awaitPromise:true});assert(!r.exceptionDetails,JSON.stringify(r.exceptionDetails));return r.result.value;};
    await send('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:false});
    await expression('document.head.innerHTML='+JSON.stringify('<meta name="google-play-app" content="app-id=local.fixture"><style>'+read('canlitema/assets/smartbanner.css')+'</style>'));
    await expression(read('Platform Dosyaları/template-assets/plugins/bootstrap.js'));
    await expression(read('canlitema/assets/smartbanner.js'));
    await expression('$.smartbanner.Constructor.prototype.getCookie=()=>null');
    for(const layer of [true,false]) {
        await expression('document.documentElement.style.marginTop="5px";document.body.style="margin-top:17px;padding-top:13px";document.body.innerHTML="<main>Local content</main>"');
        await expression('window.bannerFixture=new $.smartbanner.Constructor({force:"android",scale:1,layer:'+layer+',speedIn:0,speedOut:0,title:"Tilbe Home",author:"Local",pushSelector:"body"})');
        await expression('new Promise(resolve=>bannerFixture.hide(resolve))');
        const state=await expression('({padding:getComputedStyle(document.body).paddingTop,margin:getComputedStyle(document.body).marginTop,animated:document.body.classList.contains("sb-animation")})');
        assert.equal(state.padding,'13px','Banner must restore target padding');
        assert.equal(state.margin,'17px','Banner must restore target margin');
        assert.equal(state.animated,false,'Transition class must be removed from actual push target');
    }
    console.log('PASS Smartbanner actual push target spacing and transition cleanup for layer on/off; real reference library, no network.');
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
