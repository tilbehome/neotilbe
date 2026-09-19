# Tilbe Header v5 — Mini Sepet Hover Geliştirmesi

> **Hedef dosyalar:** `tilbe-header-v5.html`, `style.css`, `script.js`
> **Kapsam:** Mini sepet preview'e (`#cartPreview`) 4 yeni özellik. Header'ın geri kalanı DEĞİŞMEZ.
> **Bu bir statik demo.** Twig syntax / `{% raw %}` EKLEME. Veri kaynağı mevcut `cartItems` array'i ve `demoProducts`.
> **Kurallar:** `:has()` kullanma. `prefers-reduced-motion` tüm animasyonlarda devre dışı. Kalıcı `will-change` ekleme. Mevcut `id`'ler ve platform class'ları (`addCart`, `userProductFavourite`, `#cartWrap`, `#cartBadge`, `#cartTotal`, `data-cart-*`) sabit kalır.

---

## BAĞLAM

`tilbe-header-v5.html` içinde mini sepet preview yapısı (satır 222-296):
- `#cartPreview` paneli → `.h-cpd-head` · `#cartFreeShip` (kargo progress) · `#cartPreviewBody` (ürün listesi / boş state) · `#cartSummary` (özet) · `#cartTrust` (rozetler) · `#cartLoyalty` (boş sepet CTA) · `#cartFoot` (checkout butonları)

`script.js` ilgili fonksiyonlar:
- `cartItems` array (satır 79) — `[{product, qty, isFav}]`
- `demoProducts` array (satır 70-77) — 6 demo ürün, her biri `{name, price, oldPrice, icon, stock, rating, reviews, delivery}`
- `buildCartItem(it, idx)` (satır 97) — XSS-safe DOM ile sepet satırı kurar
- `buildRecItem(p, idx)` (satır 229) — öneri kartı kurar
- `renderCartPreview()` (satır 297) — tüm paneli render eder, dolu/boş state'i `setHidden` ile yönetir
- `removeCartItem(arg)` (satır 413) · `incQty` · `decQty` · `addRec` · `favItem`
- `updateCartUI()` (satır 434) — badge + total günceller, `renderCartPreview` çağırır
- Event delegation: `ACTIONS` objesi (satır 498), `data-action` pattern

4 özellik ekleyeceğiz: **(1) Cross-sell şeridi**, **(2) Undo silme**, **(3) Canlı stok aciliyeti**, **(4) Tutar count-up**.

---

# ÖZELLİK 1 — Cross-sell şeridi ("Bunu da ekle")

**Amaç:** Dolu sepette, ürün listesi ile özet arasına tek satırlık yatay kaydırmalı öneri şeridi. Sepette OLMAYAN `demoProducts` ürünlerinden 3 tanesi, hızlı `+` ile eklenebilir. AOV artırır.

## HTML — `tilbe-header-v5.html`

`#cartPreviewBody` (satır 240-253) kapanışından SONRA, `#cartSummary` (satır 256) ÖNCESİNE ekle:

```html
<!-- Cross-sell: dolu sepette öneri şeridi -->
<div class="h-cpd-xsell" id="cartXsell" hidden>
  <div class="h-cpd-xsell-h">
    <svg class="ic"><use href="#i-sparkles"/></svg>
    <span>Bunları da sepetine ekle</span>
  </div>
  <div class="h-cpd-xsell-track" id="cartXsellTrack"></div>
</div>
```

## CSS — `style.css`

`.h-cpd-item-rm` kuralından (satır 330) sonra, özet stillerinden önce ekle:

```css
/* ═══ Cross-sell şeridi ═══ */
.h-cpd-xsell{padding:12px 18px;border-top:1px solid var(--border2);background:#FCFBF9}
.h-cpd-xsell-h{display:flex;align-items:center;gap:6px;margin-bottom:9px}
.h-cpd-xsell-h .ic{font-size:13px;color:var(--gold)}
.h-cpd-xsell-h span{font-size:10.5px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.06em}
.h-cpd-xsell-track{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding-bottom:2px}
.h-cpd-xsell-track::-webkit-scrollbar{display:none}
.h-cpd-xsell-card{flex:0 0 132px;display:flex;flex-direction:column;gap:5px;padding:8px;background:var(--white);border:1px solid var(--border2);border-radius:10px;transition:border-color .15s,box-shadow .15s;position:relative}
.h-cpd-xsell-card:hover{border-color:var(--border);box-shadow:0 2px 8px rgba(17,17,17,.05)}
.h-cpd-xsell-card-img{width:100%;height:64px;border-radius:7px;background:linear-gradient(135deg,#FFF8F3,#FFEFE2);display:flex;align-items:center;justify-content:center;color:var(--accent);font-size:22px}
.h-cpd-xsell-card-n{font-size:10.5px;font-weight:500;color:var(--ink2);line-height:1.3;letter-spacing:-.005em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:27px}
.h-cpd-xsell-card-b{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:1px}
.h-cpd-xsell-card-p{font-size:12px;font-weight:700;color:var(--ink);letter-spacing:-.01em}
.h-cpd-xsell-card-add{width:26px;height:26px;border:none;background:var(--accent);color:var(--white);border-radius:7px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:background .15s,transform .15s}
.h-cpd-xsell-card-add:hover{background:var(--accent-h);transform:scale(1.08)}
.h-cpd-xsell-card-add:active{transform:scale(.94)}
.h-cpd-xsell-card-add .ic{font-size:13px;stroke-width:2}
```

## JS — `script.js`

### Yeni fonksiyon — `renderRecs` fonksiyonundan (satır 278) sonra ekle:

```js
/* Cross-sell — sepette OLMAYAN demoProducts ürünlerinden 3 öneri */
function renderXsell() {
  var track = document.getElementById('cartXsellTrack');
  if (!track) return;
  track.textContent = '';
  // Sepetteki ürünleri bul
  var inCart = cartItems.map(function (it) { return it.product; });
  var candidates = demoProducts.filter(function (p) { return inCart.indexOf(p) === -1; });
  candidates.slice(0, 3).forEach(function (p) {
    var realIdx = demoProducts.indexOf(p);
    track.appendChild(buildXsellCard(p, realIdx));
  });
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
  add.dataset.action = 'addRec';      // mevcut addRec fonksiyonunu yeniden kullan
  add.dataset.arg = String(idx);
  add.appendChild(svgUse('ic', '#i-bag'));
  b.appendChild(add);

  el.appendChild(b);
  return el;
}
```

> `addRec` zaten `demoProducts[idx]`'i sepete ekliyor ve `updateCartUI` çağırıyor (satır 376-393). Yeni action gerekmez — `data-action="addRec"` mevcut handler'a düşer.

### `renderCartPreview` içine bağla (satır 297-365):

Dolu sepet bloğunda (satır 320-329 civarı, `setHidden('cartFoot', false)` satırlarının yanına):
```js
  // Dolu sepet
  setHidden('cartFreeShip', false);
  setHidden('cartSummary', false);
  setHidden('cartTrust', false);
  setHidden('cartFoot', false);
  setHidden('cartLoyalty', true);
  setHidden('cartXsell', false);     // ← EKLE
  renderXsell();                     // ← EKLE
```

Boş sepet bloğunda (satır 308-317, `setHidden` çağrılarının yanına):
```js
  if (!cartItems.length) {
    body.textContent = '';
    body.appendChild(empty);
    renderRecs();
    setHidden('cartFreeShip', true);
    setHidden('cartSummary', true);
    setHidden('cartTrust', true);
    setHidden('cartFoot', true);
    setHidden('cartLoyalty', false);
    setHidden('cartXsell', true);    // ← EKLE
    return;
  }
```

> **Edge case:** Tüm 6 demo ürün sepete eklenirse `candidates` boş kalır. `renderXsell` track'i boş bırakır — `h-cpd-xsell` görünür ama içi boş. Bunu önlemek için `renderXsell` sonunda: `if (!track.children.length) setHidden('cartXsell', true);` ekle.

---

# ÖZELLİK 2 — Undo (geri al) silme

**Amaç:** Ürün silinince satır hemen kaybolmasın; panelin altında 4 saniyelik "Ürün kaldırıldı — Geri al" şeridi belirsin. Yanlış silmeyi kurtarır.

## HTML — `tilbe-header-v5.html`

`#cartPreview` panelinin EN SONUNA, `#cartFoot` (satır 294) kapanışından sonra, `</div>` (satır 295, `#cartPreview` kapanışı) ÖNCESİNE ekle:

```html
<!-- Undo şeridi -->
<div class="h-cpd-undo" id="cartUndo" hidden>
  <svg class="ic"><use href="#i-rotate"/></svg>
  <span class="h-cpd-undo-txt" id="cartUndoTxt">Ürün kaldırıldı</span>
  <button class="h-cpd-undo-btn" type="button" data-action="undoRemove">Geri Al</button>
</div>
```

## CSS — `style.css`

Cross-sell stillerinden sonra ekle:

```css
/* ═══ Undo şeridi ═══ */
.h-cpd-undo{display:flex;align-items:center;gap:9px;padding:11px 18px;background:var(--ink);color:var(--white);
  font-size:11.5px;font-weight:500;letter-spacing:-.005em;
  animation:undoIn .25s var(--ease)}
.h-cpd-undo .ic{font-size:14px;color:var(--white);opacity:.7;flex-shrink:0}
.h-cpd-undo-txt{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.h-cpd-undo-btn{border:none;background:rgba(255,255,255,.14);color:var(--white);font-family:var(--font);
  font-size:11px;font-weight:700;padding:5px 12px;border-radius:999px;cursor:pointer;flex-shrink:0;
  transition:background .15s}
.h-cpd-undo-btn:hover{background:rgba(255,255,255,.26)}
@keyframes undoIn{0%{transform:translateY(8px);opacity:0}100%{transform:translateY(0);opacity:1}}
```

## JS — `script.js`

### State + zamanlayıcı — `cartItems` tanımının (satır 79) altına ekle:

```js
var lastRemoved = null;         // {item, index}
var undoTimer = null;
```

### `removeCartItem` fonksiyonunu değiştir (satır 413-417):

Mevcut:
```js
function removeCartItem(arg) {
  var idx = Number(arg);
  cartItems.splice(idx, 1);
  updateCartUI();
}
```

Değiştir:
```js
function removeCartItem(arg) {
  var idx = Number(arg);
  var removed = cartItems[idx];
  if (!removed) return;
  cartItems.splice(idx, 1);
  // Undo için sakla
  lastRemoved = { item: removed, index: idx };
  showUndo(removed.product.name);
  updateCartUI();
}

function showUndo(name) {
  var bar = document.getElementById('cartUndo');
  var txt = document.getElementById('cartUndoTxt');
  if (!bar || !txt) return;
  txt.textContent = name.length > 32 ? name.slice(0, 30) + '…' : name;
  txt.textContent = txt.textContent + ' kaldırıldı';
  bar.hidden = false;
  // retrigger animasyon
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
```

### `ACTIONS` objesine ekle (satır 498-517 arası):

```js
  undoRemove: undoRemove,
```

### `cartActions` listesine ekle (satır 532):

Mevcut:
```js
var cartActions = ['removeCartItem', 'incQty', 'decQty', 'favItem', 'demoAddToCart', 'addRec'];
```
Değiştir:
```js
var cartActions = ['removeCartItem', 'incQty', 'decQty', 'favItem', 'demoAddToCart', 'addRec', 'undoRemove'];
```

> Böylece `undoRemove` tıklaması `preventDefault` + `stopPropagation` alır, sepet hover'ı kapanmaz.

> **Edge case:** Sepet tamamen boşalınca `renderCartPreview` boş state'e geçer ve `#cartUndo` `#cartPreview` içinde kaldığı için görünür kalabilir. Boş state bloğuna (Özellik 1'de düzenlediğimiz yer) `setHidden('cartUndo', ...)` EKLEME — undo'nun boş sepette de görünmesi İSTENEN davranış (son ürünü geri almak için). Sadece `hideUndo` timer'ı veya manuel undo ile kapansın.

---

# ÖZELLİK 3 — Canlı stok aciliyeti

**Amaç:** Ürün satırındaki statik "Son 3 adet" etiketini, fade-transition ile dönüşen canlı social-proof mesajlarıyla zenginleştir. Trendyol-tarzı — her mesajın kendi rengi/ikonu.

## Mevcut durum

`buildCartItem` (satır 149-154) şu an stok ≤ 3 ise tek statik etiket basıyor:
```js
if (p.stock && p.stock <= 3) {
  var stk = document.createElement('span');
  stk.className = 'h-cpd-item-stock';
  stk.textContent = 'Son ' + p.stock + ' adet';
  meta.appendChild(stk);
}
```

## İstenen

Stok ≤ 5 olan ürünlerde, meta satırının ALTINA ayrı bir "aciliyet" satırı. İçinde 2-3 mesaj sırayla fade ile dönüşür (3 sn aralık). Mesajlar üründen türetilir:
- `stock <= 3` → "🔥 Son {stock} ürün" (kırmızı)
- `reviews > 500` → "👁 Bugün {N} kişi inceledi" (mavi) — N = `reviews` mod ile sahte ama tutarlı sayı
- `delivery` içeriyor "gün" değil → "⚡ Hızlı teslimat" (yeşil)

## HTML

HTML değişikliği yok — satır JS'le kuruluyor.

## CSS — `style.css`

`.h-cpd-item-stock` kuralından (satır 310) sonra ekle:

```css
/* ═══ Canlı stok aciliyeti — fade-transition mesajlar ═══ */
.h-cpd-item-urgency{position:relative;height:15px;margin-top:2px;overflow:hidden}
.h-cpd-item-urgency-msg{position:absolute;inset:0;display:inline-flex;align-items:center;gap:4px;
  font-size:9.5px;font-weight:600;letter-spacing:.005em;line-height:1;
  opacity:0;transform:translateY(4px);transition:opacity .4s var(--ease),transform .4s var(--ease)}
.h-cpd-item-urgency-msg.is-active{opacity:1;transform:translateY(0)}
.h-cpd-item-urgency-msg .ic{font-size:11px;stroke-width:1.8}
.h-cpd-item-urgency-msg--stock{color:var(--danger)}
.h-cpd-item-urgency-msg--views{color:var(--info)}
.h-cpd-item-urgency-msg--fast{color:var(--success)}
```

## JS — `script.js`

### `buildCartItem` içinde — mevcut stok bloğunu (satır 149-154) DEĞİŞTİR:

```js
  // Aciliyet satırı — stok ≤ 5 ürünlerde canlı dönüşen mesajlar
  if (p.stock && p.stock <= 5) {
    var urgency = buildUrgencyRow(p);
    if (urgency) info.appendChild(urgency); // meta'dan SONRA, info'ya ayrı satır
  }
```

> **DİKKAT:** Eski kod `meta.appendChild(stk)` yapıyordu — aciliyet satırı artık `meta` içine DEĞİL, `info` içine meta'dan sonra ayrı satır olarak giriyor. `info.appendChild(meta)` satırı (satır 155) ile `info.appendChild(actions)` (satır 201) arasına yerleşmeli. Kodu ona göre sırala: meta eklendikten sonra urgency, sonra actions.

### Yeni fonksiyon — `buildCartItem`'dan önce ekle:

```js
function buildUrgencyRow(p) {
  var msgs = [];
  if (p.stock && p.stock <= 3) {
    msgs.push({ cls: 'stock', icon: '#i-flame', text: 'Son ' + p.stock + ' ürün' });
  }
  if (p.reviews && p.reviews > 500) {
    // tutarlı sahte sayı — reviews'tan türet (8-24 arası)
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

  // Tek mesajsa rotasyon yok
  if (msgs.length > 1) startUrgencyRotation(wrap, msgs.length);
  return wrap;
}

/* Mesajları 3 sn aralıkla döndürür. Interval'i wrap'e bağlar ki temizlenebilsin. */
function startUrgencyRotation(wrap, count) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // statik kal
  var idx = 0;
  var id = setInterval(function () {
    // wrap DOM'dan koptuysa interval'i temizle (sepet yeniden render edildi)
    if (!document.body.contains(wrap)) { clearInterval(id); return; }
    var items = wrap.children;
    items[idx].classList.remove('is-active');
    idx = (idx + 1) % count;
    items[idx].classList.add('is-active');
  }, 3000);
}
```

> **Bellek sızıntısı önemli:** `renderCartPreview` her çağrıldığında `body.textContent = ''` ile eski satırlar siliniyor (satır 328) ve `buildCartItem` yeniden çalışıyor. Eski `setInterval`'ler kalır. Çözüm: `startUrgencyRotation` içindeki `if (!document.body.contains(wrap))` kontrolü interval'i kendi kendine temizler — bu yeterli. Daha agresif istersen `renderCartPreview` başında global bir interval listesi temizle, ama `contains` kontrolü pratikte yeterli.

> `#i-head` ve `#i-zap` ikonları sprite'ta mevcut (HTML satır 41, ve `i-zap` top bar'da kullanılıyor). Doğrula — yoksa `#i-star` / `#i-flame` fallback kullan.

---

# ÖZELLİK 4 — Tutar count-up animasyonu

**Amaç:** Adet değişince / ürün eklenince-çıkınca özet rakamları (Ara Toplam, Toplam) ve taksit tutarı anında zıplamasın — eski değerden yeni değere yumuşakça saysın.

## Mevcut durum

`renderCartPreview` sonunda (satır 359-364):
```js
setText('cartSubtotal', fmtPrice(s.subtotal));
setHidden('cartSavingRow', s.saving <= 0);
setText('cartSaving', '-' + fmtPrice(s.saving));
setText('cartShipping', s.shipping === 0 ? 'ÜCRETSİZ' : fmtPrice(s.shipping));
setText('cartPreviewTotal', fmtPrice(s.total));
setText('cartInstallmentAmount', fmtPrice(s.total / INSTALLMENT_COUNT));
```

## JS — yeni fonksiyon

`fmtPrice` fonksiyonundan (satır 81) sonra ekle:

```js
/* Para count-up — eski TL değerinden yeni değere animasyonlu geçiş.
   el.textContent "149,90 TL" formatında — sayıyı parse eder, anime eder, fmtPrice ile yazar. */
function animatePrice(id, toValue) {
  var el = document.getElementById(id);
  if (!el) return;
  // Mevcut metinden sayıyı çek: "1.249,90 TL" → 1249.90
  var raw = el.textContent.replace(/[^\d,]/g, '').replace(/\./g, '').replace(',', '.');
  var from = parseFloat(raw) || 0;
  if (Math.abs(from - toValue) < 0.01) { el.textContent = fmtPrice(toValue); return; }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = fmtPrice(toValue);
    return;
  }
  var DURATION = 380;
  var startTime = null;
  function step(ts) {
    if (startTime === null) startTime = ts;
    var p = Math.min(1, (ts - startTime) / DURATION);
    var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    var current = from + (toValue - from) * eased;
    el.textContent = fmtPrice(current);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = fmtPrice(toValue);
  }
  requestAnimationFrame(step);
}
```

## JS — `renderCartPreview` sonunu değiştir (satır 359-364):

```js
  // Summary — count-up ile
  animatePrice('cartSubtotal', s.subtotal);
  setHidden('cartSavingRow', s.saving <= 0);
  setText('cartSaving', '-' + fmtPrice(s.saving));   // indirim satırı statik kalabilir
  setText('cartShipping', s.shipping === 0 ? 'ÜCRETSİZ' : fmtPrice(s.shipping));
  animatePrice('cartPreviewTotal', s.total);
  animatePrice('cartInstallmentAmount', s.total / INSTALLMENT_COUNT);
```

> İlk render'da (sepet boşken `0,00 TL` → ilk ürün) `from = 0` olur, count-up 0'dan başlar — istenen davranış.

> Eğer Görev "Estetik & Mikro-etkileşim" prompt'undaki `animateBadge` zaten eklendiyse, `animatePrice` onunla çakışmaz — ayrı fonksiyon, ayrı id'ler. İkisi birlikte çalışır.

---

# prefers-reduced-motion (ZORUNLU)

`style.css`'teki mevcut `@media (prefers-reduced-motion: reduce)` bloğunun (satır 770-780) içine ekle:

```css
  .h-cpd-undo{animation:none !important}
  .h-cpd-item-urgency-msg{transition:none !important;transform:none !important}
  .h-cpd-xsell-card,.h-cpd-xsell-card-add{transition:none !important}
```

> JS tarafı: `animatePrice`, `startUrgencyRotation` zaten `matchMedia` ile reduced-motion kontrolü yapıyor — count-up atlanır, mesaj rotasyonu durur (ilk mesaj statik kalır).

---

# YAPMA — kapsam dışı

- ❌ Twig syntax / `{% raw %}` — bu statik demo, veri `cartItems`/`demoProducts`'tan
- ❌ Mevcut `id`, platform class'ları, `data-cart-*` attribute'larını değiştirme
- ❌ Sepet özet HESAPLAMA mantığını (`calcSummary`) değiştirme — sadece görüntüleme katmanı
- ❌ Boş sepet öneri sistemini (`renderRecs`, `#cartLoyalty`) değiştirme — o ayrı kalsın, cross-sell SADECE dolu sepette
- ❌ Renk paleti — `--accent`, `--gold`, `--danger`, `--info`, `--success`, `--ink` token'larını kullan
- ❌ Yeni kütüphane / dosya
- ❌ Header'ın geri kalanına (top bar, nav, search, mobil) dokunma

---

# KONTROL LİSTESİ

**Cross-sell:**
- [ ] Dolu sepette ürün listesi ile özet arasında "Bunları da ekle" şeridi görünüyor
- [ ] Şeritte sepette OLMAYAN 3 ürün, yatay kaydırılabilir
- [ ] `+` butonu ürünü sepete ekliyor, eklenen ürün şeritten çıkıyor (re-render)
- [ ] Tüm ürünler sepetteyse şerit gizleniyor (boş kalmıyor)
- [ ] Boş sepette cross-sell görünmüyor (sadece mevcut `#cartLoyalty` + `renderRecs`)

**Undo:**
- [ ] Ürün silinince panel altında siyah "… kaldırıldı — Geri Al" şeridi beliriyor
- [ ] "Geri Al" → ürün eski konumuna geri dönüyor, şerit kapanıyor
- [ ] 4 saniye sonra şerit otomatik kapanıyor
- [ ] Undo tıklaması sepet hover'ını kapatmıyor (`stopPropagation` çalışıyor)
- [ ] Arka arkaya 2 silme → ikinci silmede timer sıfırlanıyor, son silinen geri alınıyor

**Canlı stok aciliyeti:**
- [ ] Stok ≤ 5 ürünlerde meta satırı altında aciliyet satırı var
- [ ] Birden fazla mesaj varsa 3 sn aralıkla fade ile dönüşüyor
- [ ] Her mesaj kendi renginde (stok=kırmızı, görüntüleme=mavi, hızlı=yeşil)
- [ ] Sepet re-render edilince eski `setInterval`'ler kendini temizliyor (bellek sızıntısı yok — `document.body.contains` kontrolü)
- [ ] Tek mesajlı ürünlerde rotasyon yok, statik

**Tutar count-up:**
- [ ] Adet +/− → Ara Toplam, Toplam, taksit tutarı yumuşakça sayıyor
- [ ] İlk ürün eklenince 0'dan başlıyor
- [ ] "ÜCRETSİZ" kargo metni bozulmuyor (sadece sayısal alanlar anime)

**Genel:**
- [ ] `prefers-reduced-motion: reduce` → count-up yok, undo animasyonu yok, mesaj rotasyonu durmuş (ilk mesaj görünür), her şey fonksiyonel
- [ ] `:has()` kullanılmadı, kalıcı `will-change` yok
- [ ] Konsolda hata yok; mevcut sepet özellikleri (qty, fav, remove, progress bar, checkout) bozulmadı
- [ ] Demo "Sepete ürün ekle" linki hâlâ çalışıyor, 4 özellik birlikte sorunsuz
