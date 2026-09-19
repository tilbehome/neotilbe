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

    const template = read('canlitema/moduller/uyelik/giris_yap.twig');
    assert(!/function\s+userLogin\s*\(/.test(template), 'Theme must not override userLogin');
    assert(!template.includes('remember-me'), 'No invented remember-me field');
    const platform = read('Platform Dosyaları/template-assets/scripts.min.js');
    const start = platform.indexOf('function userLogin(');
    assert(start >= 0);
    const login = platform.slice(start, platform.indexOf('function ', start + 9));
    const fixture = template.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
        .replace(/\{%[\s\S]*?%\}/g, '').replace(/\{\{\s*returnUrl\(\)\s*\}\}/g, '/odeme')
        .replace(/\{\{[\s\S]*?\}\}/g, '');
    const payload = {
        fixture,
        templateScripts: [...template.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]),
        jquery: read('Platform Dosyaları/template-assets/plugins/bootstrap.js').split('\n')[1],
        login,
        theme: read('canlitema/assets/scripts.js'),
        css: read('Platform Dosyaları/template-assets/plugins/bootstrap.soft.min.css') +
            read('Platform Dosyaları/template-assets/style.min.css') + read('canlitema/assets/style.css')
    };
    const result = await send('Runtime.evaluate', {
        awaitPromise: true, returnByValue: true,
        expression: '(' + (async function (p) {
            const results = [];
            function check(condition, label) {
                if (!condition) throw new Error(label);
                results.push(label);
            }
            document.head.innerHTML = '';
            const style = document.createElement('style');
            style.textContent = p.css;
            document.head.appendChild(style);
            document.body.innerHTML = p.fixture + '<button class="btn-sidebar-menu"></button>' +
                '<button class="mobile-menu-close"></button><button class="btn-sidebar-user"></button>' +
                '<div class="op-black"></div><nav class="sidebar-menu-type-2"></nav><nav class="sidebar-menu"></nav>' +
                '<nav class="sidebar-user"></nav>';
            (0, eval)(p.jquery);
            (0, eval)(p.login);
            const platformLogin = window.userLogin;
            p.templateScripts.forEach(script => (0, eval)(script));
            check(window.userLogin === platformLogin, 'Platform userLogin identity preserved');
            let request;
            window.ajaxFormGate = (...args) => { request = args; };
            const form = document.querySelector('.login-form');
            check(form.onsubmit() === false, 'Login submit remains platform AJAX path');
            check(request[0] === 'POST' && request[1] === 'User' && request[2] === 'login' &&
                request[3] === form && request[4] === true, 'Original platform form dispatch preserved');
            check(new FormData(form).get('returnUrl') === '/odeme', 'returnUrl retained');
            let modal;
            window.showNativeModal = (...args) => { modal = args; };
            request[5]({ status: 'two_factor', message: 'synthetic-test-hash' });
            check(modal[0] === 'user2FactorLogin', 'Reference platform two-factor callback retained');

            const icons = [...document.querySelectorAll('.toggle-password')];
            const fields = [...document.querySelectorAll('input.password')];
            check(icons.length === 3 && fields.length === 3, 'Login/register/repeat fields present');
            for (let i = 0; i < icons.length; i++) {
                icons[i].click();
                check(fields.every((field, j) => field.type === (i === j ? 'text' : 'password')) &&
                    icons[i].classList.contains('fa-eye-slash'), 'Password isolation ' + i);
                icons[i].click();
                check(fields.every(field => field.type === 'password') &&
                    icons[i].classList.contains('fa-eye'), 'Password hide ' + i);
            }
            (0, eval)(p.theme);
            await new Promise(resolve => setTimeout(resolve, 50));
            const click = selector => document.querySelector(selector).click();
            const active = selector => document.querySelector(selector).classList.contains('active');
            const locked = () => document.body.classList.contains('tilbe-sidebar-open');
            const shown = () => document.querySelector('.op-black').classList.contains('show');
            for (const closer of ['.mobile-menu-close', '.op-black']) {
                click('.btn-sidebar-menu');
                check(active('.sidebar-menu-type-2') && active('.sidebar-menu') && shown() && locked() &&
                    getComputedStyle(document.body).overflow === 'hidden', 'Open before ' + closer);
                click(closer);
                check(!active('.sidebar-menu-type-2') && !active('.sidebar-menu') && !shown() && !locked() &&
                    document.querySelector('.op-black').classList.contains('hide'), 'Close via ' + closer);
            }
            click('.mobile-menu-close');
            check(!shown() && !locked(), 'Repeated close is idempotent');
            click('.btn-sidebar-menu');
            click('.btn-sidebar-user');
            click('.op-black');
            check(active('.sidebar-user') && !active('.sidebar-menu-type-2') && shown() && locked(),
                'Backdrop closes menu while preserving open account panel');
            click('.op-black');
            check(!active('.sidebar-user') && !shown() && !locked(), 'Account-only backdrop closes account');
            click('.btn-sidebar-user');
            click('.btn-sidebar-menu');
            click('.mobile-menu-close');
            check(active('.sidebar-user') && shown() && locked(), 'X preserves account panel lock');
            click('.btn-sidebar-user');
            for (const externalClass of ['hidden-scroll', 'modal-open']) {
                document.body.classList.add(externalClass);
                click('.btn-sidebar-menu');
                click('.mobile-menu-close');
                check(document.body.classList.contains(externalClass) && !locked() &&
                    getComputedStyle(document.body).overflow === 'hidden', 'Existing lock preserved: ' + externalClass);
                document.body.classList.remove(externalClass);
                click('.btn-sidebar-menu');
                document.body.classList.add(externalClass);
                click('.op-black');
                check(document.body.classList.contains(externalClass) && !locked(),
                    'Lock acquired after menu open preserved: ' + externalClass);
                document.body.classList.remove(externalClass);
            }
            check(getComputedStyle(document.body).overflow !== 'hidden', 'Scrolling restored without external lock');
            return results;
        }).toString() + ')(' + JSON.stringify(payload) + ')'
    });
    assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
    console.log(result.result.value.map(label => 'PASS ' + label).join('\n'));
    console.log('Passed:', result.result.value.length, '(offline browser; platform/server behavior not certified)');
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
