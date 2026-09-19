# Search Typo Suggest — Entegrasyon Kılavuzu

Bu dosya, `tilbe-header-v5.html` demo dosyasına "şunu mu demek istediniz" 
özelliğini eklemek için gereken tüm dosyaları ve adımları içerir.

## Dosyalar

- `search-terms.json` (3.8 KB) — 241 benzersiz arama terimi
- `search-suggest.js` (5.4 KB) — Levenshtein algoritması + Türkçe normalizer + UI
- `search-suggest.css` (2.1 KB) — Öneri bloğunun stili
- Toplam: **~11.3 KB** (gzip sonrası ~4 KB)

## Bağımlılık

- **YOK.** Fuse.js dahil hiçbir kütüphane kullanılmıyor.
- Levenshtein algoritması 40 satır saf JS olarak yazıldı.
- Türkçe karakter normalizer kendi implementasyonu.

## Ne zaman öneri gösterilir?

- Kullanıcı en az 3 karakter yazmış olmalı
- Prefix eşleşmesi yoksa (kullanıcı doğru yazmaya başlamamış)
- Tam eşleşme yoksa
- Fuzzy match distance ≤ 2 karakter olmalı (3 harfli arama → 1, 6+ harfli → 2)

## Ne zaman öneri gösterilmez?

- 3 karakterden kısa arama (`rn` → öneri yok)
- Prefix match var (`rend` yazıldığında → "rende" zaten matches, öneri yok)
- Tam eşleşme var (`rende` yazıldı → öneri yok)
- Hiçbir yakın terim yok (`xyzabc` → öneri yok, kullanıcı boş sonuç sayfasına gider)

## Test senaryoları

| Kullanıcı yazdı | Beklenen öneri |
|---|---|
| `rnde` | `rende` |
| `bardg` | `bardak` |
| `saklma kabi` | `saklama kabı` |
| `cayda` | `çaydanlık` (prefix match eder — öneri yok) |
| `cayd` | `çaydanlık` (prefix match — öneri yok) |
| `sekersiz` | *(listede olmadığı için öneri yok)* |
| `temso` | `termos` |
| `cizme` | *(listede yok, öneri yok)* |
| `rende` | *(tam eşleşme, öneri yok)* |
| `re` | *(çok kısa, öneri yok)* |
| `xyzabc` | *(hiçbir yakın terim yok, öneri yok)* |

---

## Claude Code Prompt (copy-paste için)

```
GÖREV: tilbe-header-v5.html demo dosyasına "şunu mu demek istediniz" 
(typo correction) özelliği ekle.

──────────────────────────────────────────────
HEDEF DOSYA
──────────────────────────────────────────────
/mnt/user-data/uploads/tilbe-header-v5.html (1593 satır)

──────────────────────────────────────────────
SAĞLANAN DOSYALAR
──────────────────────────────────────────────
- search-terms.json   → 241 arama terimi (JSON array)
- search-suggest.js   → Ana logic (Levenshtein + normalizer + UI)
- search-suggest.css  → Öneri bloğu stili

──────────────────────────────────────────────
BU GÖREV NE DEĞİLDİR
──────────────────────────────────────────────
- Qukasoft dönüşümü değil. Sadece tek HTML dosyası.
- Fuse.js veya başka kütüphane eklenmeyecek.
- Mevcut arama fonksiyonunu (localStorage history, popular searches) 
  bozmayacak.
- Mega menu, voice search, mobile sidebar davranışına dokunulmayacak.

──────────────────────────────────────────────
UYGULAMA ADIMLARI
──────────────────────────────────────────────

1) CSS EKLE
   Dosyada `<style>` bloğunun sonuna (12. SCROLL BEHAVIOUR section'ı 
   varsa ondan SONRA, `</style>`'dan ÖNCE) search-suggest.css içeriğini 
   yapıştır. Yorum satırı olarak bölümü işaretle:
   
   /* ═══ 13. SEARCH TYPO SUGGEST ═══ */

2) TERM LİSTESİNİ GÖMLE
   `</body>` kapanışından ÖNCE, mevcut <script>'lerden de önce, 
   yeni bir <script> bloğu ekle:
   
   <script>
   window.TILBE_SEARCH_TERMS = [ ...search-terms.json içeriği... ];
   </script>

3) ANA JS'İ EKLE
   Adım 2'deki script bloğundan SONRA, search-suggest.js içeriğini 
   ayrı bir <script> bloğunda yapıştır:
   
   <script>
   /* search-suggest.js içeriği */
   </script>

4) MEVCUT JS'İ DEĞİŞTİRME
   rsAdd, rsRemove, rsClear, rsTrigger fonksiyonlarına dokunma. 
   search-suggest.js zaten rsAdd varsa çağırır (typeof kontrolü var).

──────────────────────────────────────────────
TEST ADIMLARI
──────────────────────────────────────────────

Dosya açıldıktan sonra, arama kutusuna sırayla yaz ve dropdown'ı izle:

1. "rnde"         → "rende" önerisi çıkmalı
2. "rende"        → öneri ÇIKMAMALI (tam eşleşme)
3. "re"           → öneri ÇIKMAMALI (çok kısa)
4. "rend"         → öneri ÇIKMAMALI (prefix match)
5. "bardg"        → "bardak" önerisi
6. "cayda"        → öneri ÇIKMAMALI (prefix match → çaydanlık)
7. "temso"        → "termos" önerisi
8. "xyzabc"       → öneri ÇIKMAMALI (hiçbir match yok)
9. Öneriye tıkla  → /arama?k=rende adresine yönlendirilmeli
10. Öneriye tıkla → "Son Aramalar"da "rende" görünmeli (history eklendi)

Mobile test:
- Mobile boyutunda aç (viewport < 992px)
- Hamburger yanındaki arama ikonuna bas → full-screen arama aç
- "rnde" yaz → .fs-body'nin en üstünde öneri çıkmalı

──────────────────────────────────────────────
PRE-WRITE GATE REPORT
──────────────────────────────────────────────

Kod yazmadan ÖNCE bildir:
1. HTML dosyasının satır sayısı + byte
2. CSS ekleme satır aralığı
3. JS ekleme satır aralığı  
4. Term JSON boyutu (byte, terim sayısı)
5. Potansiyel risk: "mevcut arama davranışıyla çakışma ihtimali var mı?"

ONAY BEKLE.

──────────────────────────────────────────────
EXECUTION REPORT
──────────────────────────────────────────────

Kod uygulandıktan sonra:
1. Değişen satır aralıkları
2. Dosya boyutu değişimi
3. Linting hataları (varsa)
4. Manuel test listesi — yukarıdaki 10 senaryo
```

---

## Manuel entegrasyon (Claude Code kullanmıyorsan)

### Adım 1: CSS'i ekle

`tilbe-header-v5.html` dosyasını aç. `</style>` etiketinden hemen önce 
(line ~654 civarı) bu yorumu ve CSS'i yapıştır:

```css
/* ═══ 13. SEARCH TYPO SUGGEST ═══ */
/* search-suggest.css içeriği buraya */
```

### Adım 2: Term listesini göm

`</body>` etiketinden hemen önce yeni bir `<script>` bloğu:

```html
<script>
window.TILBE_SEARCH_TERMS = ["Acil","adaptör","Aksesuar", ... ];
</script>
```

JSON array içeriğini search-terms.json'dan kopyala.

### Adım 3: JS'i ekle

Term script'inden sonra, başka bir `<script>` bloğunda search-suggest.js 
içeriğini yapıştır.

### Adım 4: Test et

Dosyayı tarayıcıda aç, arama kutusuna `rnde` yaz, dropdown açılınca 
üstte "rende" önerisi görmelisin.

---

## Sorun giderme

**Öneri hiç çıkmıyor?**
- DevTools Console'da `window.tilbeSearch.indexSize()` çalıştır. 200+ olmalı.
- `window.TILBE_SEARCH_TERMS.length` — 241 olmalı.
- `window.tilbeSearch.findBestMatch('rnde')` — `{match: 'rende', distance: 1}` dönmeli.

**Yanlış öneri çıkıyor?**
- Term listesinde o kelime var mı? Varsa normalize sonrası aynı görünüyor mu?
- Örnek: `window.tilbeSearch.normalize('rende')` → `'rende'` olmalı
- Örnek: `window.tilbeSearch.normalize('Şeker')` → `'seker'` olmalı

**Stil bozuk görünüyor?**
- `--accent`, `--ink`, `--border2`, `--accent-l`, `--white` CSS variable'ları 
  tanımlı olmalı. Mevcut v5'te tanımlı, problem olmamalı.
