// Deliberately limited fixture rendering; this is NOT a Twig implementation.
const assert = require('node:assert/strict');
function conditionFixture(source, conditions, values = {}) {
    const stack = [];
    let active = true;
    let result = '';
    for (const token of source.split(/(\{%[\s\S]*?%\})/)) {
        const command = token.match(/^\{%\s*(if|else|endif)\b([\s\S]*?)%\}$/);
        if (command) {
            const expression = command[2].trim();
            if (command[1] === 'if') {
                assert(Object.hasOwn(conditions, expression), 'Unknown fixture condition: ' + expression);
                stack.push({ parent: active, value: conditions[expression] });
                active = active && conditions[expression];
            } else if (command[1] === 'else') {
                const current = stack.at(-1);
                active = current.parent && !current.value;
            } else { active = stack.pop().parent; }
        } else if (active && !token.startsWith('{%')) result += token;
    }
    assert.equal(stack.length, 0);
    return result.replace(/\{\{([\s\S]*?)\}\}/g, (_, expression) => values[expression.trim()] ?? 'fixture');
}
exports.conditionFixture = conditionFixture;
exports.payload = read => {
    const profile = read('canlitema/moduller/urunler/profil.twig').replaceAll('\r\n', '\n');
    assert(profile.includes("onclick=\"window.location.href=this.getAttribute('data-search-url')\""));
    assert(profile.includes("sayfaBilgileri('kategori').adi | url_encode"));
    const start = profile.indexOf('<li>\n    <div class="price-container-pc">');
    assert(start >= 0);
    const price = profile.slice(start, profile.indexOf('</li>', start) + 5);
    const fixtures = [];
    for (const enabled of [false, true]) for (const available of [false, true]) {
        const markup = conditionFixture(price, {
            "sayfaBilgileri('indirim')": true,
            "sayfaBilgileri('indirimli_fiyatlar').sabit_indirim.aktif and temaAyarlari('urun_profili','sabit_indirim')": false,
            "temaAyarlari('urun_profili','baslayan_taksitle')": enabled,
            'taksit_bilgisi': available,
            "ayarlar('havale_indirim_miktari') > 0 and temaAyarlari('urun_profili','havale_indirimi')": true
        }, { 'taksit_bilgisi.vade': '6', 'taksit_bilgisi.aylik': '123,45 TL' });
        let depth = 0;
        for (const tag of markup.matchAll(/<\/?div\b[^>]*>/g)) {
            depth += tag[0].startsWith('</') ? -1 : 1;
            assert(depth >= 0, 'Unexpected closing div in price fixture');
        }
        assert.equal(depth, 0, 'Unclosed div in price fixture');
        fixtures.push({ markup, hasInstallment: enabled && available });
    }
    const address = read('canlitema/moduller/odeme/bilgiler/adres.twig');
    const tc = address.match(/\{% if ayarlar\('tc_alani_zorunlu_mu'\) %\}[\s\S]*?\{% endif %\}/);
    assert(tc, 'TC field must follow platform setting');
    const tcFixtures = [false, true].map(required => ({ required,
        markup: conditionFixture(tc[0], { "ayarlar('tc_alani_zorunlu_mu')": required }) }));
    const cart = read('canlitema/moduller/sepet/liste.twig');
    assert(cart.includes('productId = sepet.urun.ID'));
    const row = cart.match(/<tr class="cart-product-row[\s\S]*?<\/tr>/)[0];
    let divDepth = 0;
    for (const tag of row.matchAll(/<\/?div\b[^>]*>/g)) divDepth += tag[0].startsWith('</') ? -1 : 1;
    assert.equal(divDepth, 0, 'Cart row containers must be closed');
    assert(cart.includes('data-quantity-type="{{ sepet.birim }}"'));
    assert(!cart.includes('Flash İndirim Uygulanmıştır') && !cart.includes('10 + (sepet.urun.ID'));
    assert(!read('canlitema/assets/urun-fav-sayma-eklenti.js').includes('Math.random'));
    const order = read('canlitema/moduller/statik_sayfalar/alt_sayfalar/siparis_takip.twig');
    assert(!order.includes('OrderProcessing') && !order.includes('schema.org/Order"'));
    assert(order.includes('onsubmit="return orderDetailForm(this, \'.order-detail-response\')"'));
    assert(read('canlitema/moduller/odeme/bilgiler/kargo_icerik.twig').includes('{{ firma.ucret }}'));
    assert(read('canlitema/moduller/sepet/ozet.twig').includes('-{{ ozet.indirim.tutar }}'));
    const header = read('canlitema/moduller/header.twig');
    const search = header.match(/<form[^>]*data-smart-mobile-product-search-image[^>]*>[\s\S]*?<\/form>/);
    assert(search);
    assert.equal((search[0].match(/<button\b/g) || []).length, (search[0].match(/<\/button>/g) || []).length);
    return { fixtures, tcFixtures, search: search[0].replace(/\{\{[\s\S]*?\}\}/g, '/arama') };
};
