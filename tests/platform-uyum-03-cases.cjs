const assert = require('node:assert/strict');
exports.payload = read => {
    const platform = read('Platform Dosyaları/template-assets/scripts.min.js');
    const extract = name => {
        const start = platform.indexOf('function ' + name + '(');
        assert(start >= 0);
        return platform.slice(start, platform.indexOf('function ', start + 9));
    };
    const theme = read('canlitema/assets/scripts.js');
    assert(!theme.includes("'shipmentFile'"));
    const summary = read('canlitema/moduller/sepet/ozet.twig');
    assert(!/kargoLimit|kargoLimit -|toplam \/|set toplam/.test(summary));
    for (const key of ['ucretsiz_kargo', 'kalan_tutar_goster', 'kalan_tutar']) {
        assert(summary.includes("ucretsizKargoLimitleri('" + key + "')"));
    }
    const { conditionFixture } = require('./platform-uyum-02-cases.cjs');
    const shipping = [];
    for (const file of ['moduller/sepet/ozet.twig', 'moduller/odeme/ozet_icerik.twig', 'sepette-kargo-mesaj-pc.twig']) {
        const source = read('canlitema/' + file);
        assert(!/kargoLimit|kargo_limiti|sepet.fiyat \*/.test(source));
        const block = file.includes('ozet') ? source.slice(source.indexOf('{# Shipping'), source.indexOf(file.includes('odeme') ? '<hr>' : '        <table')) : source;
        for (const [free, remainder] of [[true, false], [false, true], [false, false]]) {
            const html = conditionFixture(block, {
                'kargoUcretsiz or kargoKalanGoster': free || remainder,
                'kargoUcretsiz': free, 'not kargoUcretsiz': !free
            }, { "ucretsizKargoLimitleri('kalan_tutar')": '1.234,56 EUR' });
            assert.equal(html.includes('1.234,56 EUR'), !free && remainder);
            assert.equal(html.includes('<div'), free || remainder);
            shipping.push({ html, free, remainder });
        }
    }
    const profile = read('canlitema/moduller/urunler/profil.twig');
    const select = profile.match(/<select class="form-control d-block"[\s\S]*?<\/li>/)[0];
    const value = `Boy's [L] "özel"`;
    const escape = s => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
    const variant = '<li class="variant">' + select.replace(/\{%[\s\S]*?%\}/g, '')
        .replace(/\{\{\s*var.deger(?:\s*\|\s*e)?\s*\}\}/g, escape(value))
        .replace(/\{\{\s*index\s*\}\}/g, '1').replace(/\{\{[\s\S]*?\}\}/g, 'false');
    assert(!read('canlitema/moduller/urunler/hizli_sepet_kutusu.twig').includes("'{{ var.deger }}',"));
    const favorites = read('canlitema/moduller/hesap/alt_sayfalar/favori_listem.twig');
    assert(favorites.includes('<tr data-user-product-id="{{ favori.ID }}">'));
    for (const file of ['sifre_yenileme', 'sifremi_unuttum']) {
        const source = read('canlitema/moduller/uyelik/' + file + '.twig');
        for (const input of source.matchAll(/<input[^>]*placeholder=[^>]*>/g)) assert(input[0].includes('aria-label='));
    }
    const video = read('canlitema/video-listeleme.twig');
    assert(video.includes('<swiper-container init="false"'));
    return { payment: extract('completePaymentStep'), favorite: extract('userProductFavourite'), variant, value, shipping,
        videoInit: video.match(/<script>([\s\S]*?)<\/script>/)[1] };
};
exports.run = async function (p, check) {
    for (const state of p.shipping) {
        document.body.innerHTML = state.html;
        if (state.remainder && document.body.textContent.includes('EUR TL')) throw new Error('Currency duplicated');
    }
    check(true, 'Shipping components preserve platform-formatted remainder and hidden/free states (fixture)');
    // Actual reference functions; requests are intercepted and never sent.
    (0, eval)(p.payment);
    (0, eval)(p.favorite);
    window.showBaseLoader = () => {};
    window.isFunction = name => typeof window[name] === 'function';
    const requests = [];
    window.ajaxFormGate = (...args) => requests.push(args);
    document.body.innerHTML = '<form data-payment-box-form="address-info"><input name="name" value="Fixture"></form>' +
        '<form data-payment-box-form="shipping-template"><input type="file" id="orderShipmentfile"></form>';
    const data = new DataTransfer();
    data.items.add(new File(['fixture'], 'fixture.txt', { type: 'text/plain' }));
    document.querySelector('#orderShipmentfile').files = data.files;
    window.completePaymentStep(1);
    check(requests.length === 1 && requests[0][2] === 'complete' &&
        requests[0][3].get('shipment_file').name === 'fixture.txt' && requests[0][3].get('name') === 'Fixture',
        'Reference checkout dispatches one request containing shipment and address');
    document.body.innerHTML = '<table><tr data-user-product-id="1"><td>A</td></tr><tr data-user-product-id="2"><td>B</td></tr></table>';
    window.userProductFavourite('remove', 1, 'account');
    requests.at(-1)[5]({ status: 'success' });
    check(!document.querySelector('[data-user-product-id="1"]') && document.querySelector('[data-user-product-id="2"]'),
        'Reference favorite success removes only matching account row');
    document.body.innerHTML = '<ul>' + p.variant + p.variant + '</ul>';
    window.PRODUCT_PAGE_DATA = {};
    const calls = [];
    window.changeProductPageVariant = (...args) => calls.push(args);
    const selects = document.querySelectorAll('select');
    selects[1].value = p.value;
    selects[1].dispatchEvent(new Event('change'));
    check(calls.length === 1 && calls[0][3] === p.value && !selects[0].value,
        'Variant quote/bracket value reaches platform handler within selected group');
    document.body.innerHTML = '<div class="tilbe-bv04kf-categoray"><swiper-container init="false"></swiper-container><swiper-container init="false"></swiper-container></div>';
    (0, eval)(p.videoInit);
    (0, eval)(p.videoInit);
    check([...document.scripts].filter(s => s.src.includes('swiper-element-bundle')).length === 1,
        'Repeated video module schedules one existing-library load');
    customElements.define('swiper-container', class extends HTMLElement {
        initialize() { this.initialized = true; this.calls = (this.calls || 0) + 1; }
    });
    await Promise.resolve();
    check([...document.querySelectorAll('swiper-container')].every(e => e.calls === 1 && e.breakpoints[320].slidesPerView === 2),
        'Video waits for custom element and initializes each once (element stub)');
};
