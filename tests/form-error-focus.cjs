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


    const expr=async js=>{const r=await send('Runtime.evaluate',{expression:js,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
    await expr('document.body.innerHTML='+JSON.stringify('<form><input name="email"><button type="button" id="save">Save</button></form>'));
    await expr(read('Platform Dosyaları/template-assets/plugins/bootstrap.js'));
    const source=read('canlitema/assets/scripts.js');
    const a=source.indexOf('function showAlert('),b=source.indexOf('function ',a+10);
    await expr('var swal_alert_timer=0;'+source.slice(a,b));
    const platform=read('Platform Dosyaları/template-assets/scripts.min.js');
    const x=platform.indexOf('function ajaxFormGate('),y=platform.indexOf('function showNativeModalWithPrefix',x);
    await expr('var SITE_CONFIG={token:"fixture",baseUrl:"https://invalid.local",accept:"fixture"};var LANG_HELPER={error:"Error",errorMsg:"Try again",ok:"OK"};function toType(x){return typeof x};function showBaseLoader(){};function hideBaseLoader(){};var ajaxOptions;$.ajax=function(o){ajaxOptions=o;};'+platform.slice(x,y));
    await expr('document.getElementById("save").focus();ajaxFormGate("POST","User","updateUserInfo",document.querySelector("form"));ajaxOptions.success(JSON.stringify({status:"error",message:"Local validation error"}))');
    await delay(100);
    const state=await expr('({dialog:!!document.querySelector(".swal-modal"),text:document.querySelector(".swal-text")?.textContent,active:document.activeElement.className,role:document.querySelector(".swal-modal")?.getAttribute("role")})');
    console.log(JSON.stringify(state));
    assert.equal(state.text,'Local validation error');
    assert(state.active.includes('swal-button--confirm'));
    await expr('document.querySelector(".swal-button").click()');await delay(100);
    assert.equal(await expr('document.activeElement.id'),'save','Error dismissal restores submit control focus');
    await expr('ajaxFormGate("POST","User","updateUserInfo",document.querySelector("form"));ajaxOptions.error({},"error","")');
    await delay(50);
    assert.equal(await expr('document.querySelector(".swal-text").textContent'),'Try again');
    await expr('document.querySelector(".swal-button").click()');await delay(50);
    assert.equal(await expr('document.activeElement.id'),'save');
    await expr('var received;showAlert({text:"Choose",buttonList:{confirm:{text:"Cart",value:"cart"}}},function(value){received=value})');
    await delay(50);
    await expr('document.querySelector(".swal-button--confirm").click()');await delay(50);
    assert.equal(await expr('received'),'cart','Existing callback value preserved');
    await expr('showAlert({text:"Error",buttonTitle:"OK"});document.body.insertAdjacentHTML("beforeend",\'<div class="modal show"><input id="other-modal-input"></div>\');document.getElementById("other-modal-input").focus()');
    await expr('document.querySelector(".swal-button").click()');await delay(50);
    assert.equal(await expr('document.activeElement.id'),'other-modal-input','Other open modal keeps focus');
    console.log('PASS reference library and ajaxFormGate with stubbed responses: server/network error focus, callback value and another modal. Not Qukasoft acceptance.');
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
