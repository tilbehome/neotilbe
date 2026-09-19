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
        if(data.method==='Fetch.requestPaused') {
            const r=data.params.request,u=new URL(r.url);
            const permitted=r.method==='GET'&&!/\/(admin|client)(\/|$)|logout|signout|addcart|removecart|completepayment/i.test(u.pathname);
            send(permitted?'Fetch.continueRequest':'Fetch.failRequest',permitted?{requestId:data.params.requestId}:{requestId:data.params.requestId,errorReason:'BlockedByClient'}).catch(()=>{});
            return;
        }
        const request = pending.get(data.id);
        if (!request) return;
        pending.delete(data.id);
        if (data.error) request.reject(new Error(data.error.message));
        else request.resolve(data.result);
    };
    await send('Network.enable');
    await send('Fetch.enable',{patterns:[{urlPattern:'*',requestStage:'Request'}]});


    fs.mkdirSync('artifacts/live-reference',{recursive:true});
    const url=process.env.REFERENCE_URL||'https://tilbehome.com/';
    assert(/^https:\/\/(www\.)?tilbehome\.com\//.test(url));
    const label=process.env.REFERENCE_LABEL||'home';
    assert(/^[a-z-]+$/.test(label));
    const report={requestedURL:url,timestamp:new Date().toISOString(),context:'Fresh anonymous profile, no admin/preview. POST and client/admin endpoints blocked. Reference only, not repaired branch.',views:[]};
    for(const width of [375,1440]) {
        await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
        await send('Page.navigate',{url});
        for(let i=0;i<100;i++){await delay(200);const r=await send('Runtime.evaluate',{returnByValue:true,expression:'document.readyState'});if(r.result.value==='complete')break;}
        const state=await send('Runtime.evaluate',{returnByValue:true,expression:'({url:location.href,title:document.title,height:document.documentElement.scrollHeight,productLinks:[...document.querySelectorAll(".card-product a.c-p-i-link")].slice(0,3).map(a=>a.href),text:document.body.innerText.slice(0,160),links:[...document.querySelectorAll("a[href]")].map(a=>({text:a.textContent.trim().slice(0,60),url:a.href})).filter(a=>/-p-|\\/urun\\/|-c-|giris|login|uye|hesabim/.test(a.url)).slice(0,300)})'});
        const height=Math.min(state.result.value.height,14000);
        const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height,scale:1}});
        const file='artifacts/live-reference/'+label+'-'+width+'.png';fs.writeFileSync(file,Buffer.from(shot.data,'base64'));
        const viewport=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
        const viewportFile='artifacts/live-reference/'+label+'-'+width+'-viewport.png';fs.writeFileSync(viewportFile,Buffer.from(viewport.data,'base64'));
        report.views.push({width,captureHeight:height,file,viewportFile,...state.result.value,visuallyInspected:false});
    }
    fs.writeFileSync('artifacts/live-reference/'+label+'.json',JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
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
