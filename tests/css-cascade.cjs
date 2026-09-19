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


    const before = require('node:child_process').execFileSync('C:/Program Files/Git/cmd/git.exe', ['show','67e49d6:canlitema/assets/style.css'], {maxBuffer:2e6}).toString();
    const after = read('canlitema/assets/style.css');
    const fixture = '<main class="corporate-wrapper"><h1 class="corporate-h1">CSS kar??la?t?rma ?rne?i</h1><div class="corporate-feature-grid"><div class="corporate-feature-card">Uzun hizmet ba?l???</div><div class="service-item">Hizmet a??klamas?</div></div><div class="corporate-info-2col"><div class="info-column">??erik</div></div><div class="corporate-market-block"><div class="market-links">Ba?lant?lar</div><div class="social-links-corporate">Sosyal ba?lant?lar</div></div><section class="product-profile-1"><div class="profile-ust-baslik">?r?n ba?l???</div><div class="product-short-desc">Uzun ?r?n a??klamas?</div></section><div class="ppriceg-right">1.299,90 TL</div><div class="pbc-item99">Bilgi</div><div class="cstm-manset-block">Man?et</div><div class="product-buttons-container"><button class="btn-custom">Sepete ekle</button></div><button class="video-btn-988" disabled>Video</button><div class="shipment-methods"><div class="method">Kargo</div></div><div class="payment-cart-summary-1"><span class="final-vergi-dahil-text">Vergiler dahil</span></div></main>';
    const foundation = read('Platform Dosyaları/template-assets/plugins/bootstrap.soft.min.css') + read('Platform Dosyaları/template-assets/style.min.css');
    const results = [];
    for (const width of [320,375,600,601,768,769,991,992,993,1200,1440]) {
        await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
        const snapshots=[];
        for(const source of [before,after]) {
            await send('Page.setDocumentContent',{frameId:(await send('Page.getFrameTree')).frameTree.frame.id,html:'<!doctype html><meta charset="utf-8"><style>'+foundation+source+'</style><style>*{transition:none!important;animation:none!important}</style>'+fixture});
            const state=await send('Runtime.evaluate',{returnByValue:true,expression:'[...document.querySelectorAll("main,main *")].map(el=>{const s=getComputedStyle(el);return [...s].map(p=>[p,s.getPropertyValue(p)]);})'});
            snapshots.push(state.result.value);
        }
        assert.deepEqual(snapshots[1],snapshots[0],'Cascade changed at '+width);
        results.push({width,allComputedPropertiesEqual:true});
    }
    fs.writeFileSync('docs/css-cascade-results.json',JSON.stringify({baseline:'67e49d6',networkBlocked:true,scope:'Synthetic affected selectors, reference CSS before theme CSS; not full page or Qukasoft',results},null,2)+'\n');
    console.log('PASS: affected selector computed styles unchanged at 11 boundary widths.');
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
