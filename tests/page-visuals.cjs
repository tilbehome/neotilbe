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


    const report=JSON.parse(read('docs/full-page-fixtures.json'));
    const css=read('Platform Dosyaları/template-assets/plugins/bootstrap.soft.min.css')+read('Platform Dosyaları/template-assets/style.min.css')+read('canlitema/assets/style.css');
    const placeholder='data:image/svg+xml;base64,'+Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="#eee"/><text x="30" y="100">Yerel gorsel ornegi</text></svg>').toString('base64');
    for(const page of report.pages.filter(p=>p.rendered)) {
        page.views=[];
        for(const width of [375,768,1440]) {
            await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
            let html=read('artifacts/full-pages/'+page.name+'.html');
            html=html.replace(/<img\b([^>]*?)src="([^"]*)"/gi,(all,attrs,url)=>{
                let local=url.startsWith('__theme__')?url.slice(9):url.includes('/theme/___shuttle/')?url.split('/theme/___shuttle/')[1]:null;
                if(local) {local=path.resolve(root,'canlitema',local.replace(/^\//,''));if(local.startsWith(path.join(root,'canlitema')+path.sep)&&fs.existsSync(local)&&fs.statSync(local).isFile()) {const ext=path.extname(local).slice(1);url='data:image/'+(ext==='svg'?'svg+xml':ext==='jpg'?'jpeg':ext)+';base64,'+fs.readFileSync(local).toString('base64');}else url=placeholder;} else url=placeholder;
                return '<img'+attrs+'src="'+url+'"';
            });
            html=html.replace('<body','<style>'+css+'</style><style>*{animation:none!important;transition:none!important}[data-local-notice]{background:#fff3cd;color:#222;margin:0;padding:8px}</style><body');
            await send('Page.setDocumentContent',{frameId:(await send('Page.getFrameTree')).frameTree.frame.id,html});
            await send('Runtime.evaluate',{awaitPromise:true,expression:'Promise.all([...document.images].map(i=>i.decode().catch(()=>null)))'});
            const measured=await send('Runtime.evaluate',{returnByValue:true,expression:'({height:document.documentElement.scrollHeight,footerTextColor:document.querySelector("footer .contact-item span")?getComputedStyle(document.querySelector("footer .contact-item span")).color:null,documentWidth:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll("body *")].filter(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width&&s.position!=="fixed"&&(r.right>innerWidth+2||r.left< -2)}).slice(0,25).map(e=>({tag:e.tagName,class:e.className,left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right}))})'});
            const height=Math.min(measured.result.value.height,16000);
            const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height,scale:1}});
            fs.writeFileSync('artifacts/full-pages/'+page.name+'-'+width+'.png',Buffer.from(shot.data,'base64'));
            page.views.push({width,...measured.result.value,captureHeight:height,visualInspected:false});
        }
    }
    fs.writeFileSync('docs/full-page-fixtures.json',JSON.stringify(report,null,2)+'\n');
    console.log('Captured local page compositions; inspection pending. No platform transactions or full-page acceptance.');
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
