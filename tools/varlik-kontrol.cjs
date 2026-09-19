// Read-only local asset decoding/contact sheets. Not storefront visual acceptance.
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


    await send('Emulation.setDeviceMetricsOverride', {width:1000,height:1000,deviceScaleFactor:1,mobile:false});
    const inventory=JSON.parse(read('docs/tema-envanteri.json'));
    const files=inventory.filter(r=>/\.(png|jpe?g|webp|gif|svg)$/.test(r.file));
    const mime={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',svg:'image/svg+xml'};
    const output=path.join(root,'artifacts','asset-contact');fs.mkdirSync(output,{recursive:true});
    const records=[];
    for(let offset=0;offset<files.length;offset+=24){
        const batch=files.slice(offset,offset+24).map(f=>({...f,src:'data:'+mime[path.extname(f.file).slice(1)]+';base64,'+fs.readFileSync(path.join(root,f.file)).toString('base64')}));
        const result=await send('Runtime.evaluate',{awaitPromise:true,returnByValue:true,expression:'('+ (async function(batch){
            document.head.innerHTML='<style>body{margin:8px;font:10px sans-serif;background:#ddd}main{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}figure{margin:0;background:white;height:155px;padding:2px;overflow:hidden}img{display:block;width:100%;height:126px;object-fit:contain;background:#f5f5f5}figcaption{overflow-wrap:anywhere}</style>';
            document.body.innerHTML='<main></main>';
            return Promise.all(batch.map(async f=>{const box=document.createElement('figure'),img=new Image(),caption=document.createElement('figcaption');img.src=f.src;caption.textContent=f.file;box.append(img,caption);document.querySelector('main').append(box);let error=null;try{await img.decode();}catch(e){error=e.message;}return {file:f.file,bytes:f.bytes,width:img.naturalWidth,height:img.naturalHeight,decodeError:error,storefrontVerified:false};}));
        }).toString()+')('+JSON.stringify(batch)+')'});
        assert(!result.exceptionDetails,JSON.stringify(result.exceptionDetails));records.push(...result.result.value);
        const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(output,'sheet-'+(offset/24+1)+'.png'),Buffer.from(shot.data,'base64'));
    }
    fs.writeFileSync(path.join(root,'docs/varlik-kontrol.json'),JSON.stringify({method:'offline browser image decode; thumbnails require separate human inspection',records},null,2)+'\n');
    console.log(JSON.stringify({images:records.length,failed:records.filter(r=>r.decodeError),sheets:Math.ceil(records.length/24),output}));
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>{if(socket&&socket.readyState===WebSocket.OPEN){socket.send(JSON.stringify({id:++sequence,method:'Browser.close'}));socket.close();}browser.kill();});
