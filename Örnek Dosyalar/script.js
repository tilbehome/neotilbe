/* ════════════════════════════════════════════════════════════════
   TILBE HOME — HEADER v5 · script.js
   ────────────────────────────────────────────────────────────────
   1. Skeleton loader (min 400ms)
   2. Menu + sidebar controls
   3. Cart mini-preview + demo add-to-cart
   4. Full-screen mobile search
   5. Voice search (Web Speech API)
   6. Event delegation (data-action / data-focus-action)
   7. Recent searches (localStorage, XSS-safe DOM build)
   8. Hide-on-scroll-down sticky header
   ════════════════════════════════════════════════════════════════ */

/* ═══ 1. SKELETON LOADER ═══ */
(function () {
  var skel = document.getElementById('skelWrap');
  if (!skel) return;
  var start = Date.now();
  var MIN = 400;
  function hide() {
    var elapsed = Date.now() - start;
    var delay = Math.max(0, MIN - elapsed);
    setTimeout(function () {
      requestAnimationFrame(function () { skel.classList.add('done'); });
    }, delay);
  }
  if (document.readyState === 'complete') hide();
  else window.addEventListener('load', hide);
})();

/* ═══ 2. MENU + SIDEBAR ═══ */
function resetHeaderVisible() {
  var s = document.getElementById('stickyHeader');
  if (s) s.setAttribute('data-scroll-state', window.scrollY < 100 ? 'top' : 'visible');
}
function openCatMenu() {
  closeAccMenu();
  document.getElementById('msOverlay').classList.add('show');
  document.getElementById('msMenuCat').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCatMenu() {
  document.getElementById('msMenuCat').classList.remove('open');
  document.getElementById('msOverlay').classList.remove('show');
  document.body.style.overflow = '';
  document.querySelectorAll('.ms-sub').forEach(function (s) { s.classList.remove('open'); });
  resetHeaderVisible();
}
function openAccMenu() {
  closeCatMenu();
  document.getElementById('msOverlay').classList.add('show');
  document.getElementById('msMenuAcc').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeAccMenu() {
  document.getElementById('msMenuAcc').classList.remove('open');
  document.getElementById('msOverlay').classList.remove('show');
  document.body.style.overflow = '';
  resetHeaderVisible();
}
function closeAll() { closeCatMenu(); closeAccMenu(); }
function openSub(id) { var el = document.getElementById('sub-' + id); if (el) el.classList.add('open'); }
function closeSub(id) { var el = document.getElementById('sub-' + id); if (el) el.classList.remove('open'); }

/* ═══ 3. CART MINI-PREVIEW — Premium ═══ */
var FREE_SHIP_THRESHOLD = 500;
var SHIP_COST = 39.90;
var INSTALLMENT_COUNT = 12;

var demoProducts = [
  { name: 'Paslanmaz Çelik 3\'lü Pratik Rende Seti',   price: 149.90, oldPrice: 179.90, icon: 'i-utensils', stock: 8,  rating: 4.8, reviews: 327,  delivery: 'Yarın kargoda' },
  { name: 'Cam Demlikli Çaydanlık — 1.2L Buzlu Cam',   price: 289.00, oldPrice: 349.00, icon: 'i-flame',    stock: 3,  rating: 4.9, reviews: 189,  delivery: 'Yarın kargoda' },
  { name: 'Fonksiyonlu Paslanmaz Yağdanlık',           price: 79.50,  oldPrice: null,   icon: 'i-sparkles', stock: 15, rating: 4.6, reviews: 1240, delivery: 'Aynı gün kargo' },
  { name: 'Hasır Düzenleyici Sepet Seti (3\'lü)',      price: 199.90, oldPrice: 249.90, icon: 'i-package',  stock: 5,  rating: 4.7, reviews: 512,  delivery: '2 gün içinde' },
  { name: 'Silikon Streç Kapak 6\'lı Set',             price: 59.90,  oldPrice: null,   icon: 'i-leaf',     stock: 20, rating: 4.5, reviews: 845,  delivery: 'Aynı gün kargo' },
  { name: 'Termos — Çift Cidarlı 500ml',               price: 189.00, oldPrice: 229.00, icon: 'i-star',     stock: 2,  rating: 4.9, reviews: 672,  delivery: 'Yarın kargoda' }
];

var cartItems = [];  // [{product, qty, isFav}]
var lastRemoved = null;   // {item, index}
var undoTimer = null;

function fmtPrice(n) { return n.toFixed(2).replace('.', ',') + ' TL'; }
function setText(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; }
function setHidden(id, hidden) { var el = document.getElementById(id); if (el) el.hidden = hidden; }

function calcSummary() {
  var subtotal = 0, saving = 0;
  cartItems.forEach(function (it) {
    subtotal += it.product.price * it.qty;
    if (it.product.oldPrice) saving += (it.product.oldPrice - it.product.price) * it.qty;
  });
  var shipping = cartItems.length === 0 ? 0 : (subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIP_COST);
  var total = subtotal + shipping;
  return { subtotal: subtotal, saving: saving, shipping: shipping, total: total };
}

/* XSS-safe DOM builder — premium cart item */
function buildUrgencyRow(p) {
  var msgs = [];
  if (p.stock && p.stock <= 3) {
    msgs.push({ cls: 'stock', icon: '#i-flame', text: 'Son ' + p.stock + ' ürün' });
  }
  if (p.reviews && p.reviews > 500) {
    var viewers = 8 + (p.reviews % 17);
    msgs.push({ cls: 'views', icon: '#i-head', text: 'Bugün ' + viewers + ' kişi inceledi' });
  }
  if (p.delivery && p.delivery.indexOf('gün') === -1) {
    msgs.push({ cls: 'fast', icon: '#i-zap', text: 'Hızlı teslimat' });
  }
  if (!msgs.length) return null;

  var wrap = document.createElement('div');
  wrap.className = 'h-cpd-item-urgency';

  msgs.forEach(function (m, i) {
    var span = document.createElement('span');
    span.className = 'h-cpd-item-urgency-msg h-cpd-item-urgency-msg--' + m.cls + (i === 0 ? ' is-active' : '');
    span.appendChild(svgUse('ic', m.icon));
    span.appendChild(document.createTextNode(m.text));
    wrap.appendChild(span);
  });

  if (msgs.length > 1) startUrgencyRotation(wrap, msgs.length);
  return wrap;
}

function startUrgencyRotation(wrap, count) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var idx = 0;
  var id = setInterval(function () {
    if (!document.body.contains(wrap)) { clearInterval(id); return; }
    var items = wrap.children;
    items[idx].classList.remove('is-active');
    idx = (idx + 1) % count;
    items[idx].classList.add('is-active');
  }, 3000);
}

function buildCartItem(it, idx) {
  var p = it.product;
  var el = document.createElement('div');
  el.className = 'h-cpd-item';

  // Image + discount badge
  var img = document.createElement('div');
  img.className = 'h-cpd-item-img';
  img.appendChild(svgUse('ic', '#' + p.icon));
  if (p.oldPrice) {
    var pct = Math.round((1 - p.price / p.oldPrice) * 100);
    var badge = document.createElement('span');
    badge.className = 'h-cpd-item-disc';
    badge.textContent = '-%' + pct;
    img.appendChild(badge);
  }
  el.appendChild(img);

  // Info column
  var info = document.createElement('div');
  info.className = 'h-cpd-item-info';

  var name = document.createElement('div');
  name.className = 'h-cpd-item-n';
  name.textContent = p.name;
  info.appendChild(name);

  // Meta row — yıldız · teslimat · [stock]
  var meta = document.createElement('div');
  meta.className = 'h-cpd-item-meta';
  if (p.rating) {
    var rate = document.createElement('span');
    rate.className = 'h-cpd-item-rate';
    rate.appendChild(svgUse('ic ic--solid', '#i-star'));
    var rt = document.createElement('strong');
    rt.textContent = p.rating.toFixed(1);
    rate.appendChild(rt);
    if (p.reviews) {
      var rv = document.createElement('span');
      rv.className = 'h-cpd-item-rate-c';
      rv.textContent = '(' + p.reviews + ')';
      rate.appendChild(rv);
    }
    meta.appendChild(rate);
  }
  if (p.delivery) {
    var dly = document.createElement('span');
    dly.className = 'h-cpd-item-dly';
    dly.appendChild(svgUse('ic', '#i-truck'));
    dly.appendChild(document.createTextNode(p.delivery));
    meta.appendChild(dly);
  }
  if (meta.children.length) info.appendChild(meta);

  // Aciliyet satırı — stok ≤ 5 ürünlerde canlı dönüşen mesajlar
  if (p.stock && p.stock <= 5) {
    var urgency = buildUrgencyRow(p);
    if (urgency) info.appendChild(urgency);
  }

  // Bottom row: qty SOL · fav ortada · fiyat SAĞDA (column, price + oldPrice)
  var actions = document.createElement('div');
  actions.className = 'h-cpd-item-actions';

  var leftGroup = document.createElement('div');
  leftGroup.className = 'h-cpd-item-lg';

  var qty = document.createElement('div');
  qty.className = 'h-cpd-qty';
  qty.appendChild(qtyBtn('−', 'decQty', idx, 'Azalt', false));
  var qv = document.createElement('span');
  qv.className = 'h-cpd-qty-val';
  qv.textContent = it.qty;
  qty.appendChild(qv);
  var incDisabled = p.stock && it.qty >= p.stock;
  qty.appendChild(qtyBtn('+', 'incQty', idx, 'Arttır', incDisabled));
  leftGroup.appendChild(qty);

  var fav = document.createElement('button');
  fav.type = 'button';
  fav.className = 'h-cpd-item-fav' + (it.isFav ? ' is-fav' : '');
  fav.setAttribute('aria-label', it.isFav ? 'Favoriden çıkar' : 'Favorilere ekle');
  fav.dataset.action = 'favItem';
  fav.dataset.arg = String(idx);
  fav.appendChild(svgUse('ic' + (it.isFav ? ' ic--solid' : ''), '#i-heart'));
  leftGroup.appendChild(fav);

  actions.appendChild(leftGroup);

  // Fiyat kolonu — sağa align, price üstte / oldPrice altta
  var priceBox = document.createElement('div');
  priceBox.className = 'h-cpd-item-price';
  var price = document.createElement('span');
  price.className = 'h-cpd-item-p';
  price.textContent = fmtPrice(p.price * it.qty);
  priceBox.appendChild(price);
  if (p.oldPrice) {
    var old = document.createElement('span');
    old.className = 'h-cpd-item-old';
    old.textContent = fmtPrice(p.oldPrice * it.qty);
    priceBox.appendChild(old);
  }
  actions.appendChild(priceBox);

  info.appendChild(actions);
  el.appendChild(info);

  // Remove button (absolute top-right)
  var rm = document.createElement('button');
  rm.type = 'button';
  rm.className = 'h-cpd-item-rm';
  rm.setAttribute('aria-label', 'Kaldır');
  rm.dataset.action = 'removeCartItem';
  rm.dataset.arg = String(idx);
  rm.appendChild(svgUse('ic', '#i-close'));
  el.appendChild(rm);

  return el;
}

function qtyBtn(txt, action, idx, aria, disabled) {
  var b = document.createElement('button');
  b.type = 'button';
  b.textContent = txt;
  b.dataset.action = action;
  b.dataset.arg = String(idx);
  b.setAttribute('aria-label', aria);
  if (disabled) b.disabled = true;
  return b;
}

/* Popüler ürün öneri item'ı — boş sepet state'inde gösterilir */
function buildRecItem(p, idx) {
  var el = document.createElement('div');
  el.className = 'h-cpd-rec';

  var img = document.createElement('div');
  img.className = 'h-cpd-rec-img';
  img.appendChild(svgUse('ic', '#' + p.icon));
  if (p.oldPrice) {
    var pct = Math.round((1 - p.price / p.oldPrice) * 100);
    var disc = document.createElement('span');
    disc.className = 'h-cpd-rec-disc';
    disc.textContent = '-%' + pct;
    img.appendChild(disc);
  }
  el.appendChild(img);

  var info = document.createElement('div');
  info.className = 'h-cpd-rec-info';
  var n = document.createElement('div');
  n.className = 'h-cpd-rec-n';
  n.textContent = p.name;
  info.appendChild(n);
  var priceRow = document.createElement('div');
  priceRow.className = 'h-cpd-rec-price';
  var pr = document.createElement('span');
  pr.className = 'h-cpd-rec-p';
  pr.textContent = fmtPrice(p.price);
  priceRow.appendChild(pr);
  if (p.oldPrice) {
    var old = document.createElement('span');
    old.className = 'h-cpd-rec-old';
    old.textContent = fmtPrice(p.oldPrice);
    priceRow.appendChild(old);
  }
  info.appendChild(priceRow);
  el.appendChild(info);

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'h-cpd-rec-btn';
  btn.setAttribute('aria-label', 'Sepete ekle');
  btn.dataset.action = 'addRec';
  btn.dataset.arg = String(idx);
  btn.appendChild(svgUse('ic', '#i-bag'));
  el.appendChild(btn);

  return el;
}

function renderRecs() {
  var container = document.getElementById('cartRecs');
  if (!container) return;
  container.textContent = '';
  // Top 3 öneri — demoProducts'tan
  demoProducts.slice(0, 3).forEach(function (p, i) {
    container.appendChild(buildRecItem(p, i));
  });
}

/* Cross-sell — sepette OLMAYAN demoProducts ürünlerinden 3 öneri */
function renderXsell() {
  var track = document.getElementById('cartXsellTrack');
  var section = document.getElementById('cartXsell');
  if (!track || !section) return;
  track.textContent = '';
  var inCart = cartItems.map(function (it) { return it.product; });
  var candidates = demoProducts.filter(function (p) { return inCart.indexOf(p) === -1; });
  candidates.slice(0, 3).forEach(function (p) {
    var realIdx = demoProducts.indexOf(p);
    track.appendChild(buildXsellCard(p, realIdx));
  });
  if (!track.children.length) section.hidden = true;
}

function buildXsellCard(p, idx) {
  var el = document.createElement('div');
  el.className = 'h-cpd-xsell-card';

  var img = document.createElement('div');
  img.className = 'h-cpd-xsell-card-img';
  img.appendChild(svgUse('ic', '#' + p.icon));
  el.appendChild(img);

  var n = document.createElement('div');
  n.className = 'h-cpd-xsell-card-n';
  n.textContent = p.name;
  el.appendChild(n);

  var b = document.createElement('div');
  b.className = 'h-cpd-xsell-card-b';
  var pr = document.createElement('span');
  pr.className = 'h-cpd-xsell-card-p';
  pr.textContent = fmtPrice(p.price);
  b.appendChild(pr);

  var add = document.createElement('button');
  add.type = 'button';
  add.className = 'h-cpd-xsell-card-add';
  add.setAttribute('aria-label', p.name + ' sepete ekle');
  add.dataset.action = 'addRec';
  add.dataset.arg = String(idx);
  add.appendChild(svgUse('ic', '#i-bag'));
  b.appendChild(add);

  el.appendChild(b);
  return el;
}

function svgUse(cls, href) {
  var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('class', cls);
  var u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  u.setAttribute('href', href);
  s.appendChild(u);
  return s;
}

function renderCartPreview() {
  var body = document.getElementById('cartPreviewBody');
  var empty = document.getElementById('cartPreviewEmpty');
  var count = document.getElementById('cartPreviewCount');
  var ship = document.getElementById('cartFreeShip');
  if (!body) return;

  var totalQty = cartItems.reduce(function (a, it) { return a + it.qty; }, 0);
  count.textContent = totalQty + ' ürün';

  // Empty state — Bugünün Fırsatı + Son baktıkların göster, checkout butonlarını gizle
  if (!cartItems.length) {
    body.textContent = '';
    body.appendChild(empty);
    setHidden('cartFreeShip', true);
    setHidden('cartSummary', true);
    setHidden('cartTrust', true);
    setHidden('cartFoot', true);
    setHidden('cartDeal', false);
    setHidden('cartXsell', true);
    if (typeof window.renderRecentProducts === 'function') window.renderRecentProducts();
    return;
  }

  // Dolu sepet
  setHidden('cartFreeShip', false);
  setHidden('cartSummary', false);
  setHidden('cartTrust', false);
  setHidden('cartFoot', false);
  setHidden('cartDeal', true);
  setHidden('cartRecent', true);
  setHidden('cartXsell', false);
  renderXsell();

  // Render items
  body.textContent = '';
  cartItems.forEach(function (it, i) { body.appendChild(buildCartItem(it, i)); });

  var s = calcSummary();

  // Free shipping progress
  var shipFill = document.getElementById('cartShipFill');
  var shipMsg = document.getElementById('cartShipMsg');
  if (shipFill && shipMsg && ship) {
    var pct = Math.min(100, (s.subtotal / FREE_SHIP_THRESHOLD) * 100);
    shipFill.style.width = pct + '%';
    if (s.subtotal >= FREE_SHIP_THRESHOLD) {
      ship.classList.add('is-won');
      shipMsg.textContent = '';
      shipMsg.appendChild(document.createTextNode('Tebrikler! '));
      var b = document.createElement('strong');
      b.textContent = 'Ücretsiz kargo';
      shipMsg.appendChild(b);
      shipMsg.appendChild(document.createTextNode(' kazandınız 🎁'));
    } else {
      ship.classList.remove('is-won');
      shipMsg.textContent = '';
      shipMsg.appendChild(document.createTextNode('Ücretsiz kargoya '));
      var b2 = document.createElement('strong');
      b2.textContent = fmtPrice(FREE_SHIP_THRESHOLD - s.subtotal);
      shipMsg.appendChild(b2);
      shipMsg.appendChild(document.createTextNode(' kaldı'));
    }
  }

  // Summary
  setText('cartSubtotal', fmtPrice(s.subtotal));
  setHidden('cartSavingRow', s.saving <= 0);
  setText('cartSaving', '-' + fmtPrice(s.saving));
  setText('cartShipping', s.shipping === 0 ? 'ÜCRETSİZ' : fmtPrice(s.shipping));
  setText('cartPreviewTotal', fmtPrice(s.total));
  setText('cartInstallmentAmount', fmtPrice(s.total / INSTALLMENT_COUNT));
}

/* ═══ Cart actions ═══ */
function demoAddToCart() {
  if (cartItems.length >= demoProducts.length) return;
  var p = demoProducts[cartItems.length];
  cartItems.push({ product: p, qty: 1, isFav: false });
  bounceCartIcon();
  updateCartUI();
}

function addRec(arg) {
  var idx = Number(arg);
  var p = demoProducts[idx];
  if (!p) return;
  // Aynı ürün zaten sepetteyse qty arttır
  var existing = null;
  for (var i = 0; i < cartItems.length; i++) {
    if (cartItems[i].product === p) { existing = cartItems[i]; break; }
  }
  if (existing) {
    if (p.stock && existing.qty >= p.stock) return;
    existing.qty++;
  } else {
    cartItems.push({ product: p, qty: 1, isFav: false });
  }
  bounceCartIcon();
  updateCartUI();
}

function incQty(arg) {
  var idx = Number(arg);
  var it = cartItems[idx];
  if (!it) return;
  if (it.product.stock && it.qty >= it.product.stock) return;
  it.qty++;
  updateCartUI();
}

function decQty(arg) {
  var idx = Number(arg);
  var it = cartItems[idx];
  if (!it) return;
  if (it.qty <= 1) { removeCartItem(arg); return; }
  it.qty--;
  updateCartUI();
}

function removeCartItem(arg) {
  var idx = Number(arg);
  var removed = cartItems[idx];
  if (!removed) return;
  cartItems.splice(idx, 1);
  lastRemoved = { item: removed, index: idx };
  showUndo(removed.product.name);
  updateCartUI();
}

function showUndo(name) {
  var bar = document.getElementById('cartUndo');
  var txt = document.getElementById('cartUndoTxt');
  if (!bar || !txt) return;
  var trimmed = name.length > 30 ? name.slice(0, 28) + '…' : name;
  txt.textContent = trimmed + ' kaldırıldı';
  bar.hidden = false;
  bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
  if (undoTimer) clearTimeout(undoTimer);
  undoTimer = setTimeout(hideUndo, 4000);
}

function hideUndo() {
  var bar = document.getElementById('cartUndo');
  if (bar) bar.hidden = true;
  lastRemoved = null;
  if (undoTimer) { clearTimeout(undoTimer); undoTimer = null; }
}

function undoRemove() {
  if (!lastRemoved) { hideUndo(); return; }
  var idx = Math.min(lastRemoved.index, cartItems.length);
  cartItems.splice(idx, 0, lastRemoved.item);
  hideUndo();
  updateCartUI();
}

function favItem(arg) {
  var idx = Number(arg);
  var it = cartItems[idx];
  if (!it) return;
  it.isFav = !it.isFav;
  renderCartPreview();
}

function bounceCartIcon() {
  var wrap = document.getElementById('cartTgl');
  if (!wrap) return;
  wrap.classList.add('cart-bounce');
  setTimeout(function () { wrap.classList.remove('cart-bounce'); }, 600);
}

/* Badge sayı count-up — eski değerden yeni değere animasyonlu geçiş */
function animateBadge(el, to) {
  if (!el) return;
  var from = parseInt(el.textContent, 10) || 0;
  if (from === to) return;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || Math.abs(to - from) > 30) {
    el.textContent = to;
    el.classList.remove('is-counting'); void el.offsetWidth; el.classList.add('is-counting');
    return;
  }
  var DURATION = 320;
  var startTime = null;
  el.classList.remove('is-counting'); void el.offsetWidth; el.classList.add('is-counting');
  function step(ts) {
    if (startTime === null) startTime = ts;
    var p = Math.min(1, (ts - startTime) / DURATION);
    var eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = to;
  }
  requestAnimationFrame(step);
}

function updateCartUI() {
  var totalQty = cartItems.reduce(function (a, it) { return a + it.qty; }, 0);
  var s = calcSummary();
  var badge = document.getElementById('cartBadge');
  var total = document.getElementById('cartTotal');
  if (badge) animateBadge(badge, totalQty);
  if (total) total.textContent = fmtPrice(s.total);
  document
    .querySelectorAll('.m-bn-bw .h-badge, .m-act .h-badge')
    .forEach(function (b) { animateBadge(b, totalQty); });

  // Navbar "Hızlı Bitir" CTA — sadece sepette ürün varken görünür
  var navCta = document.getElementById('navCheckoutCta');
  var navCtaAmt = document.getElementById('navCheckoutAmt');
  if (navCta) navCta.hidden = totalQty === 0;
  if (navCtaAmt) navCtaAmt.textContent = fmtPrice(s.total);

  renderCartPreview();
}

/* ═══ 4. FULL-SCREEN SEARCH ═══ */
function openFsSearch() {
  document.getElementById('fsSearch').classList.add('open');
  setTimeout(function () {
    var inp = document.getElementById('fsInput');
    if (inp) inp.focus();
  }, 300);
  document.body.style.overflow = 'hidden';
}
function closeFsSearch() {
  document.getElementById('fsSearch').classList.remove('open');
  document.body.style.overflow = '';
  resetHeaderVisible();
}

/* ═══ 5. VOICE SEARCH ═══ */
function openVoice() {
  var m = document.getElementById('voiceModal');
  var t = document.getElementById('voiceText');
  m.classList.add('show');
  t.textContent = 'Buyrun, Sizi Dinliyorum...';
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    t.textContent = 'Tarayıcınız sesli aramayı desteklemiyor';
    return;
  }
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var r = new SR();
  r.lang = 'tr-TR';
  r.continuous = false;
  r.interimResults = true;
  r.onresult = function (e) {
    var tx = '';
    for (var i = e.resultIndex; i < e.results.length; i++) tx += e.results[i][0].transcript;
    t.textContent = tx || 'Buyrun, Sizi Dinliyorum...';
    if (e.results[e.resultIndex].isFinal) {
      setTimeout(function () {
        closeVoice();
        var inp = document.getElementById('dsi') || document.getElementById('fsInput');
        if (inp) { inp.value = tx; inp.focus(); }
      }, 500);
    }
  };
  r.onerror = function () { t.textContent = 'Ses algılanamadı, tekrar deneyin'; };
  try { r.start(); } catch (ex) { t.textContent = 'Mikrofon erişimi reddedildi'; }
}
function closeVoice() {
  var m = document.getElementById('voiceModal');
  if (m) m.classList.remove('show');
}

/* ═══ 6. EVENT DELEGATION ═══ */
var ACTIONS = {
  openVoice: openVoice,
  closeVoice: closeVoice,
  openCatMenu: openCatMenu,
  closeCatMenu: closeCatMenu,
  openAccMenu: openAccMenu,
  closeAccMenu: closeAccMenu,
  closeAll: closeAll,
  openSub: openSub,
  closeSub: closeSub,
  openFsSearch: openFsSearch,
  closeFsSearch: closeFsSearch,
  rsClear: function () { if (window.rsClear) window.rsClear(); },
  demoAddToCart: demoAddToCart,
  addRec: addRec,
  undoRemove: undoRemove,
  removeCartItem: removeCartItem,
  incQty: incQty,
  decQty: decQty,
  favItem: favItem
};

document.addEventListener('click', function (e) {
  // Close notifications dropdown when clicking outside its wrapper
  if (!e.target.closest('.h-nw')) {
    var nDrop = document.getElementById('nDrop');
    if (nDrop) nDrop.classList.remove('is-open');
  }
  // Delegated data-action
  var el = e.target.closest('[data-action]');
  if (!el) return;
  var action = el.dataset.action;
  var handler = ACTIONS[action];
  if (!handler) return;
  // Prevent default on anchors + cart-internal actions (no navigation)
  var cartActions = ['removeCartItem', 'incQty', 'decQty', 'favItem', 'demoAddToCart', 'addRec', 'undoRemove'];
  if (el.tagName === 'A' || cartActions.indexOf(action) !== -1) e.preventDefault();
  if (cartActions.indexOf(action) !== -1) e.stopPropagation();
  handler(el.dataset.arg);
});

document.addEventListener('focusin', function (e) {
  var el = e.target.closest('[data-focus-action]');
  if (!el) return;
  var action = el.dataset.focusAction;
  if (ACTIONS[action]) ACTIONS[action]();
});

/* ═══ 6a. DIRECT LISTENERS (non-delegated) ═══ */
// Notifications toggle on touch
var nTgl = document.getElementById('nTgl');
if (nTgl) {
  nTgl.addEventListener('click', function (e) {
    if (window.matchMedia('(hover:none)').matches) {
      e.preventDefault();
      document.getElementById('nDrop').classList.toggle('is-open');
    }
  });
}

// Cart toggle — fallback to Stella sidebar if available
var cartTgl = document.getElementById('cartTgl');
if (cartTgl) {
  cartTgl.addEventListener('click', function (e) {
    if (typeof showCartBox === 'function') {
      e.preventDefault();
      showCartBox();
    }
  });
}

// Voice modal backdrop click
var voiceModal = document.getElementById('voiceModal');
if (voiceModal) {
  voiceModal.addEventListener('click', function (e) {
    if (e.target === this) closeVoice();
  });
}

// Initial cart render — defer to next tick so all IIFEs (including renderRecentProducts) initialize
setTimeout(renderCartPreview, 0);

/* ═══ 7. RECENT SEARCHES (localStorage) ═══ */
(function () {
  var KEY = 'tilbe_recent_searches';
  var MAX = 6;

  function load() {
    try { var d = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(d) ? d : []; }
    catch (e) { return []; }
  }
  function save(arr) {
    try { localStorage.setItem(KEY, JSON.stringify(arr.slice(0, MAX))); } catch (e) { /* quota */ }
  }

  function buildItem(q, isMobile) {
    var wrap = document.createElement('div');
    wrap.className = isMobile ? 'fs-hi' : 'h-shi';
    wrap.setAttribute('data-q', q);
    var inner = document.createElement('div');
    var clock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    clock.setAttribute('class', isMobile ? 'ic' : 'ic hi');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#i-clock');
    clock.appendChild(use);
    inner.appendChild(clock);
    inner.appendChild(document.createTextNode(' ' + q));
    wrap.appendChild(inner);
    var rm = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    rm.setAttribute('class', isMobile ? 'ic fs-rm' : 'ic hr');
    rm.setAttribute('data-rm', '1');
    var useX = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    useX.setAttribute('href', '#i-close');
    rm.appendChild(useX);
    wrap.appendChild(rm);
    return wrap;
  }

  function renderInto(container, isMobile, emptyCls) {
    container.textContent = '';
    var arr = load();
    if (!arr.length) {
      var e = document.createElement('div');
      e.className = emptyCls;
      e.textContent = 'Henüz arama yapılmadı';
      container.appendChild(e);
      return;
    }
    arr.forEach(function (q) { container.appendChild(buildItem(q, isMobile)); });
  }

  function render() {
    var dk = document.getElementById('recentDesktop');
    if (dk) renderInto(dk, false, 'h-sh-empty');
    var mb = document.getElementById('recentMobile');
    if (mb) renderInto(mb, true, 'fs-sh-empty');
  }

  function onRecentClick(e) {
    var rm = e.target.closest('[data-rm]');
    var item = e.target.closest('[data-q]');
    if (!item) return;
    var q = item.getAttribute('data-q');
    if (rm) {
      e.stopPropagation();
      e.preventDefault();
      window.rsRemove(q);
      return;
    }
    window.rsTrigger(q);
  }
  ['recentDesktop', 'recentMobile'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', onRecentClick);
  });

  window.rsAdd = function (q) {
    q = (q || '').trim();
    if (!q) return;
    var arr = load().filter(function (x) { return x.toLowerCase() !== q.toLowerCase(); });
    arr.unshift(q);
    save(arr);
    render();
  };
  window.rsRemove = function (q) {
    save(load().filter(function (x) { return x !== q; }));
    render();
  };
  window.rsClear = function () { save([]); render(); };
  window.rsTrigger = function (q) {
    var inp = document.getElementById('dsi') || document.getElementById('fsInput');
    if (inp) { inp.value = q; inp.focus(); }
    window.rsAdd(q);
  };

  // Form submit (desktop .h-sf + mobile .m-sf)
  document.addEventListener('submit', function (e) {
    if (e.target && (e.target.classList.contains('h-sf') || e.target.classList.contains('m-sf'))) {
      e.preventDefault();
      var inp = e.target.querySelector('input[type="search"]');
      if (inp && inp.value.trim()) window.rsAdd(inp.value);
    }
  });

  // Mobile full-screen input — Enter key (no form)
  var fs = document.getElementById('fsInput');
  if (fs) {
    fs.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && this.value.trim()) {
        e.preventDefault();
        window.rsAdd(this.value);
      }
    });
  }

  // Seed demo data on first visit
  if (!load().length) {
    save(['pratik rendeler', 'saklama kabı', 'termos']);
  }

  render();
})();

/* ═══ 7b. FOOTER — Back to top button ═══ */
(function () {
  var btn = document.getElementById('fTop');
  if (!btn) return;
  var THRESHOLD = 400;
  var ticking = false;
  function update() {
    var show = window.scrollY > THRESHOLD;
    btn.classList.toggle('is-visible', show);
    if (show) btn.hidden = false;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  btn.addEventListener('click', function () {
    var prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });
})();

/* ═══ 8. HIDE-ON-SCROLL-DOWN ═══ */
(function () {
  var root = document.getElementById('stickyHeader');
  if (!root) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var lastY = window.scrollY;
  var ticking = false;
  var DELTA_THRESHOLD = 5;
  var SHOW_AT_TOP = 100;

  function isMenuOpen() {
    return document.body.style.overflow === 'hidden' ||
           document.querySelector('.ms-menu.open') ||
           document.querySelector('.fs-search.open') ||
           document.querySelector('.vm.show');
  }

  function update() {
    var currentY = window.scrollY;
    var delta = currentY - lastY;

    if (isMenuOpen()) {
      ticking = false;
      lastY = currentY;
      return;
    }

    if (Math.abs(delta) < DELTA_THRESHOLD) {
      ticking = false;
      return;
    }

    var newState;
    if (currentY < SHOW_AT_TOP) newState = 'top';
    else if (delta > 0) newState = 'hidden';
    else newState = 'visible';

    if (newState !== root.getAttribute('data-scroll-state')) {
      root.setAttribute('data-scroll-state', newState);
    }

    lastY = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();

/* ═══ 9. NOTIFICATION — canlı zaman + empty state ═══ */
(function () {
  var list = document.getElementById('nDropList');
  if (!list) return;

  // Türkçe kısaltma — Intl.RelativeTimeFormat'tan kısa bir format türetiriz
  function fmtRelative(deltaSec) {
    var abs = Math.abs(deltaSec);
    if (abs < 60) return 'şimdi';
    if (abs < 3600) return Math.round(abs / 60) + 'dk';
    if (abs < 86400) return Math.round(abs / 3600) + 'sa';
    if (abs < 604800) return Math.round(abs / 86400) + 'g';
    if (abs < 2592000) return Math.round(abs / 604800) + 'hf';
    if (abs < 31536000) return Math.round(abs / 2592000) + 'ay';
    return Math.round(abs / 31536000) + 'y';
  }

  // Aria için tam metin — okuyucu/tooltip ihtiyacı
  var rtfFull = null;
  try {
    if (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat) {
      rtfFull = new Intl.RelativeTimeFormat('tr', { numeric: 'auto', style: 'long' });
    }
  } catch (e) { rtfFull = null; }

  function fmtFull(deltaSec) {
    if (!rtfFull) return fmtRelative(deltaSec);
    var abs = Math.abs(deltaSec);
    var sign = deltaSec < 0 ? -1 : 1;
    if (abs < 60) return rtfFull.format(sign * Math.round(abs), 'second');
    if (abs < 3600) return rtfFull.format(sign * Math.round(abs / 60), 'minute');
    if (abs < 86400) return rtfFull.format(sign * Math.round(abs / 3600), 'hour');
    if (abs < 2592000) return rtfFull.format(sign * Math.round(abs / 86400), 'day');
    if (abs < 31536000) return rtfFull.format(sign * Math.round(abs / 2592000), 'month');
    return rtfFull.format(sign * Math.round(abs / 31536000), 'year');
  }

  // data-ts: bildirim oluşturma anının "şimdiden farkı" saniye cinsinden (negatif = geçmiş).
  // İlk yüklemede ts'leri gerçek bir başlangıç anına sabitleriz, sonra "şimdi - origin"
  // ile tazeleriz. Böylece sayfa açık kaldıkça "2 sa" → "2 sa 1 dk" → "3 sa" gibi ilerler.
  var pageOrigin = Date.now();

  function tick() {
    var items = list.querySelectorAll('.h-ndi-time[data-ts]');
    var elapsedSinceLoad = (Date.now() - pageOrigin) / 1000;
    items.forEach(function (el) {
      var baseTs = parseFloat(el.getAttribute('data-ts')) || 0;
      var delta = baseTs - elapsedSinceLoad; // negatif = geçmiş
      el.textContent = fmtRelative(delta);
      el.setAttribute('title', fmtFull(delta));
    });
    toggleEmpty();
  }

  function toggleEmpty() {
    var empty = document.getElementById('nDropEmpty');
    if (!empty) return;
    var visibleItems = list.querySelectorAll('.h-ndi:not([hidden])').length;
    empty.hidden = visibleItems > 0;
  }

  // İlk render
  tick();
  // Her 60 saniyede bir tazele
  setInterval(tick, 60000);

  // "Tümünü okundu işaretle" → unread sınıfını temizle (mevcut görsel davranış)
  var markAllBtn = document.querySelector('.h-ndh-a');
  if (markAllBtn) {
    markAllBtn.addEventListener('click', function () {
      list.querySelectorAll('.h-ndi--unread').forEach(function (el) {
        el.classList.remove('h-ndi--unread');
      });
      // Bell dot'unu da gizle
      var dot = document.querySelector('.h-bell-dot');
      if (dot) dot.style.display = 'none';
    });
  }
})();

/* ═══ 10. CART PREVIEW — Bugünün Fırsatı countdown + Son baktıkların ═══ */
(function () {
  /* Countdown — gün sonuna kadar geri sayım */
  var cdEl = document.getElementById('cartDealCountdown');
  if (cdEl) {
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function tickCountdown() {
      var now = new Date();
      var end = new Date(now);
      end.setHours(23, 59, 59, 999);
      var ms = end - now;
      if (ms < 0) ms = 0;
      var h = Math.floor(ms / 3600000);
      var m = Math.floor((ms % 3600000) / 60000);
      var s = Math.floor((ms % 60000) / 1000);
      cdEl.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
      // Son 1 saatte aciliyet vurgusu
      if (h === 0) cdEl.classList.add('is-urgent');
      else cdEl.classList.remove('is-urgent');
    }
    tickCountdown();
    setInterval(tickCountdown, 1000);
  }

  /* Son baktıkların — localStorage + demo fallback */
  var KEY = 'tilbe_recent_products';
  var MAX = 6;

  function loadRecent() {
    try { var d = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(d) ? d : []; }
    catch (e) { return []; }
  }

  // İlk yüklemede demo fallback — gerçek görüntülenmiş ürün yoksa
  // demoProducts'tan birkaç ürünü "son baktığın" gibi göster.
  (function seedDemoIfEmpty() {
    var existing = loadRecent();
    if (existing.length) return;
    if (typeof demoProducts === 'undefined' || !demoProducts.length) return;
    // 2, 3, 4, 5 indexli demo ürünleri seed et (1 zaten "Bugünün Fırsatı")
    var seed = [2, 3, 4, 5].filter(function (i) { return i < demoProducts.length; });
    try { localStorage.setItem(KEY, JSON.stringify(seed)); } catch (e) {}
  })();

  function buildRecentItem(productIdx) {
    if (typeof demoProducts === 'undefined') return null;
    var p = demoProducts[productIdx];
    if (!p) return null;
    var wrap = document.createElement('a');
    wrap.className = 'h-cpd-recent-item';
    wrap.href = 'https://www.tilbehome.com/tumu-c-0';
    wrap.setAttribute('aria-label', p.name + ' — ' + fmtPrice(p.price));

    var thumb = document.createElement('div');
    thumb.className = 'h-cpd-recent-thumb';
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'ic');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#' + p.icon);
    svg.appendChild(use);
    thumb.appendChild(svg);

    var name = document.createElement('div');
    name.className = 'h-cpd-recent-name';
    name.textContent = p.name;

    var price = document.createElement('div');
    price.className = 'h-cpd-recent-price';
    price.textContent = fmtPrice(p.price);

    wrap.appendChild(thumb);
    wrap.appendChild(name);
    wrap.appendChild(price);
    return wrap;
  }

  window.renderRecentProducts = function () {
    var container = document.getElementById('cartRecentList');
    var section = document.getElementById('cartRecent');
    if (!container || !section) return;
    var arr = loadRecent().slice(0, MAX);
    container.textContent = '';
    if (!arr.length) { section.hidden = true; return; }
    var anyRendered = false;
    arr.forEach(function (idx) {
      var el = buildRecentItem(idx);
      if (el) { container.appendChild(el); anyRendered = true; }
    });
    section.hidden = !anyRendered;
  };

  // Sayfa açılışında ilk render — cart boş ise zaten renderCartPreview da çağırır
  if (typeof renderCartPreview === 'function') renderRecentProducts();

  // Genişletilebilirlik: dışarıdan "son görüntülenen" ekleme için global API
  window.rpAdd = function (idx) {
    if (typeof idx !== 'number') return;
    var arr = loadRecent().filter(function (x) { return x !== idx; });
    arr.unshift(idx);
    try { localStorage.setItem(KEY, JSON.stringify(arr.slice(0, MAX))); } catch (e) {}
    renderRecentProducts();
  };
})();
