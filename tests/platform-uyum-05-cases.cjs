const assert = require('node:assert/strict');
exports.payload = read => {
    const template = read('canlitema/video-listeleme.twig');
    assert(!/function (openModal|closeModal)|id="videoModal"|id="videoIframe"/.test(template));
    const markup = template.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
    const profile = read('canlitema/moduller/urunler/profil.twig');
    const scripts = [...profile.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
    const timer = scripts.find(s => s.includes('function getTurkeyTime'));
    assert(timer && timer.includes('if (!root.isConnected) return'));
    const forms = ['uyelik/hizli_giris_kutusu','uyelik/uyelik_formu','hesap/alt_sayfalar/adres_bilgilerim',
        'hesap/alt_sayfalar/eposta_sifre','hesap/alt_sayfalar/uyelik_bilgilerim','statik_sayfalar/alt_sayfalar/iletisim',
        'hesap/alt_sayfalar/bayilik_bilgilerim','hesap/alt_sayfalar/yeni_destek_bildirimi',
        'hesap/alt_sayfalar/destek_bildirimi_detay','statik_sayfalar/alt_sayfalar/havale_bildirim','hesap/alt_sayfalar/siparis_takip']
        .map(name => read('canlitema/moduller/' + name + '.twig').replace(/\{%[\s\S]*?%\}/g, '')
            .replace(/\{\{[\s\S]*?\}\}/g, 'fixture'));
    const favorite = read('canlitema/moduller/urunler/kart_favori_listesi.twig');
    assert(favorite.includes('kullaniciFavoriListesi()') && favorite.includes('favori.ID == urun.ID'));
    const card = (id, saved) => favorite.slice(favorite.indexOf('<div class='))
        .replace(/\{\{ urun.ID \}\}/g, id)
        .replace("{{ kartFavoride ? 'd-none' : 'd-block' }}", saved ? 'd-none' : 'd-block')
        .replace("{{ kartFavoride ? 'd-block' : 'd-none' }}", saved ? 'd-block' : 'd-none');
    const category = read('canlitema/moduller/kategoriler/sayfalama.twig');
    assert.equal((category.match(/name="smart-cat-siralama"/g) || []).length, 1);
    assert(category.includes("sayfaBilgileri('aranan')|e('js')"));
    const query = "O'Neil </script> [test]";
    const jsFixture = [...query].map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('');
    const categoryScript = category.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]
        .replace(/\{\{\s*sayfaBilgileri\('aranan'\)[\s\S]*?\}\}/, jsFixture).replace(/\{\{[\s\S]*?\}\}/g, 'fixture');
    assert(!read('canlitema/moduller/statik_sayfalar/alt_sayfalar/havale_bildirim.twig').includes('ActiveActionStatus'));
    assert(!read('canlitema/moduller/statik_sayfalar/404.twig').includes('itemprop="url"'));
    const voucher = read('canlitema/moduller/hediye_ceki/kart.twig').replace(/\{%[\s\S]*?%\}/g, '')
        .replace(/\{\{ hediye_ceki.ID \}\}/g, '21').replace(/\{\{[\s\S]*?\}\}/g, 'fixture');
    const shipping = read('canlitema/moduller/odeme/bilgiler/kargo_icerik.twig').replace(/<script[\s\S]*?<\/script>/g, '')
        .replace(/\{%[\s\S]*?%\}/g, '').replace(/\{\{ firma.ID \}\}/g, '21')
        .replace(/\{\{[\s\S]*?\}\}/g, '');
    return { markup, voucher, shipping, smartbanner: read('canlitema/assets/smartbanner.js'), script: read('canlitema/assets/video-gallery.js'), timer, forms, categoryScript, query,
        cards: card('21', false) + card('21', false) + card('99', true) };
};
exports.run = async function (p, check) {
    document.body.innerHTML = p.shipping;
    let shipmentChanges = 0;
    const shipment = document.querySelector('[name="shipment_method"]');
    $(shipment).on('change', () => { shipmentChanges++; });
    shipment.click();
    check(shipmentChanges === 1, 'Shipment radio native click emits one change');
    document.querySelector('.method .price').click();
    check(shipmentChanges === 2 && shipment.checked, 'Shipment row click still selects and dispatches once');
    document.body.innerHTML = '<meta name="google-play-app" content="app-id=local.fixture">';
    const transition = $.fn.emulateTransitionEnd || function () { return this; };
    $.fn.emulateTransitionEnd = transition;
    (0, eval)(p.smartbanner);
    $.smartbanner.Constructor.prototype.getCookie = () => null;
    const banner = new $.smartbanner.Constructor({force:'android', scale:1, layer:true, speedIn:0, speedOut:0,
        title:'<img id="unsafe-banner-node" src="x">', author:'Fixture', pushSelector:'body'});
    check(!document.getElementById('unsafe-banner-node') && document.querySelector('.sb-info strong').textContent.includes('<img'),
        'Smartbanner treats title as text instead of HTML');
    check($.fn.emulateTransitionEnd === transition && document.body.style.paddingTop !== '',
        'Smartbanner preserves existing transition helper and applies configured push target');
    banner.hide(); document.body.style.paddingTop = '';
    document.body.innerHTML = '<div data-help-entry-id="7"></div>';
    let scrolled = 0;
    document.querySelector('[data-help-entry-id]').scrollIntoView = () => { scrolled++; };
    window.location.hash = 'accordion-head-7';
    await new Promise(resolve => setTimeout(resolve, 20));
    check(scrolled > 0, 'Legacy help fragment reaches the new instance-scoped heading');
    window.location.hash = '';
    document.body.innerHTML = p.voucher;
    const copied = [];
    window.copyElement = id => { if (!document.getElementById(id)) throw new Error('Missing copy target'); copied.push(id); };
    document.querySelector('.btn-copy').click();
    check(copied.length === 1 && copied[0] === 'voucher-code-21', 'Voucher copy dispatches once to its existing target');
    document.body.innerHTML = '<div class="video"><video></video><button></button></div><div class="video"><video></video><button></button></div>';
    const videos = document.querySelectorAll('video'), buttons = document.querySelectorAll('button');
    let plays = 0;
    videos[0].play = () => { throw new Error('Wrong video selected'); };
    videos[1].play = () => { plays++; return Promise.reject(new Error('Blocked playback')); };
    tilbePlayProductVideo(buttons[1]);
    await new Promise(resolve => setTimeout(resolve, 0));
    check(plays === 1 && !buttons[1].disabled && buttons[1].style.display !== 'none', 'Product video failure leaves its own retry button available');
    videos[1].play = () => { plays++; return Promise.resolve(); };
    tilbePlayProductVideo(buttons[1]);
    tilbePlayProductVideo(buttons[1]);
    await new Promise(resolve => setTimeout(resolve, 0));
    check(plays === 2 && videos[1].controls && buttons[1].style.display === 'none' && !videos[0].controls,
        'Product video success uses own player and avoids repeated pending play');
    document.body.innerHTML = p.markup + p.markup;
    (0, eval)(p.script);
    (0, eval)(p.script);
    const galleries = document.querySelectorAll('[data-tilbe-video-gallery]');
    const triggers = [...galleries].map(g => g.querySelector('[data-video-src]'));
    const dialogs = [...galleries].map(g => g.querySelector('[data-tilbe-video-dialog]'));
    document.body.classList.add('modal-open');
    triggers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    check(!dialogs[0].hidden && dialogs[1].hidden && document.activeElement.hasAttribute('data-video-close'), 'Video keyboard opens only own dialog and focuses close');
    triggers[1].click();
    check(dialogs[0].hidden && !dialogs[0].querySelector('iframe').hasAttribute('src') && !dialogs[1].hidden, 'Second gallery closes and unloads first player');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    check(dialogs[1].hidden && document.activeElement === triggers[1] && !document.body.classList.contains('tilbe-video-open') && document.body.classList.contains('modal-open'), 'Video Escape restores focus and preserves external scroll lock');
    triggers[0].click(); dialogs[0].click();
    check(dialogs[0].hidden && !dialogs[0].querySelector('iframe').hasAttribute('src'), 'Video backdrop unloads player');
    triggers[0].click();
    const platformAlert = document.createElement('div');
    platformAlert.className = 'swal-overlay--show-modal';
    platformAlert.innerHTML = '<button>Platform error</button>';
    document.body.appendChild(platformAlert);
    platformAlert.firstChild.focus();
    check(document.activeElement === platformAlert.firstChild, 'Gallery yields focus to platform SweetAlert');
    document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape', bubbles:true}));
    check(!dialogs[0].hidden, 'Platform error Escape does not close underlying gallery');
    platformAlert.remove(); dialogs[0].click();
    triggers[1].click(); galleries[1].remove();
    await new Promise(resolve => setTimeout(resolve, 0));
    check(!document.body.classList.contains('tilbe-video-open'), 'Removing open gallery releases its own scroll lock');
    document.body.classList.remove('modal-open');
    for (const html of p.forms) {
        document.body.innerHTML = html;
        const labels = [...document.querySelectorAll('label[for^="tilbe-"]')];
        check(labels.length > 0 && labels.every(label => label.control), 'Form labels resolve: ' + labels[0].htmlFor);
    }
    document.body.innerHTML = '<div class="campaignTimerDiv"></div>';
    (0, eval)(p.timer);
    check(!window.getTurkeyTime && !window.updateCountdown, 'Shipment timer missing markup is safe and functions remain private');
    document.body.innerHTML = p.cards;
    let request, alert, modal;
    window.ajaxFormGate = (...args) => { request = args; };
    window.LANG_HELPER = { error: 'Error', errorMsg: 'Error', ok: 'OK' };
    window.showAlert = value => { alert = value; };
    window.showNativeModal = name => { modal = name; };
    const cards = [...document.querySelectorAll('[data-favourite-product-id="21"]')];
    cards[0].querySelector('.add-favorite').click();
    request[5]({ status: 'error', message: 'Fixture failure' });
    check(alert && cards.every(c => c.querySelector('.add-favorite').classList.contains('d-block')), 'Favorite error preserves visible state');
    request[5]({ status: 'auth' });
    check(modal === 'loginPage', 'Guest favorite delegates login prompt to platform');
    request[5]({ status: 'success' });
    check(cards.every(c => c.querySelector('.remove-favorite').classList.contains('d-block')), 'Favorite add synchronizes repeated product cards');
    cards[1].querySelector('.remove-favorite').click();
    request[5]({ status: 'success' });
    check(cards.every(c => c.querySelector('.add-favorite').classList.contains('d-block')) &&
        document.querySelector('[data-favourite-product-id="99"] .remove-favorite').classList.contains('d-block'),
        'Favorite remove synchronizes matching cards without changing another product');
    document.body.innerHTML = '<div class="p-g-mod-t-20"><div class="col-list-p-v-1 col-md-4 keep-state"></div></div>';
    let categoryData;
    window.smartCategoryFilters = data => { categoryData = data; };
    (0, eval)(p.categoryScript);
    await new Promise(resolve => setTimeout(resolve, 20));
    check(categoryData.k === p.query && document.querySelector('.col-list-p-v-1').classList.contains('keep-state'),
        'Category escaped query fixture preserved and responsive update retains non-grid state');
};
