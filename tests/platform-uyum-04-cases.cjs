const assert = require('node:assert/strict');
exports.payload = read => {
    const footer = read('canlitema/moduller/footer.twig');
    const script = footer.match(/<script>([\s\S]*?)<\/script>/)[1];
    const start = footer.indexOf('<div class="tilbehomeMobilMenu456-container">');
    const markup = footer.slice(start, footer.indexOf('<script>', start))
        .replace(/\{%[\s\S]*?%\}/g, '').replace(/\{\{[\s\S]*?\}\}/g, 'fixture');
    const flash = read('canlitema/ozel-moduller/flash-urunler-hots.twig');
    assert(!/set sold|set viewer|data-sold|data-viewer/.test(flash));
    assert(!footer.includes('updateViewerText'));
    assert(footer.includes('aria-label="E-posta adresiniz"'));
    const stock = flash.slice(flash.indexOf('<div class="conversion-block'), flash.indexOf('</a>', flash.indexOf('<div class="conversion-block')));
    const render = require('./platform-uyum-02-cases.cjs').conditionFixture;
    const stockStates = [true, false].map(available => render(stock, { 'urun.stok > 0': available }));
    assert(stockStates[0].includes('Stokta') && !stockStates[0].includes('Stokta yok'));
    assert(stockStates[1].includes('Stokta yok'));
    return { markup, script, stockStates };
};
exports.run = function (p, check) {
    document.body.innerHTML = p.markup;
    (0, eval)(p.script);
    (0, eval)(p.script);
    const trigger = document.querySelector('#tilbehomeMobilMenu456-kategori-btn a');
    const dialog = document.querySelector('.thkm456-container');
    const close = dialog.querySelector('.thkm456-close');
    document.body.classList.add('hidden-scroll', 'modal-open');
    trigger.click();
    check(document.activeElement === close && trigger.getAttribute('aria-expanded') === 'true' &&
        document.body.classList.contains('tilbe-category-open'), 'Category opens with focus and its own scroll lock');
    const links = dialog.querySelectorAll('a[href]');
    links[links.length - 1].focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    check(document.activeElement === close, 'Category Tab wraps inside dialog');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    check(document.activeElement === trigger && dialog.getAttribute('aria-hidden') === 'true' &&
        !document.body.classList.contains('tilbe-category-open') && document.body.classList.contains('hidden-scroll') &&
        document.body.classList.contains('modal-open'), 'Category Escape restores trigger and preserves external locks');
    trigger.click();
    dialog.querySelector('.thkm456-backdrop').click();
    check(!dialog.classList.contains('active'), 'Category backdrop closes dialog');
    document.body.classList.remove('hidden-scroll', 'modal-open');
    for (const html of p.stockStates) {
        document.body.innerHTML = html;
        check(document.querySelector('.conversion-text-inner').textContent.trim().startsWith('Stokta'),
            'Flash stock state renders without a random counter');
    }
};
