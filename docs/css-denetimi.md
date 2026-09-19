# Gold CSS incelemesi — 19 Eylül 2026

Başlangıç: `67e49d6`, `canlitema/assets/style.css`, **313.245 bayt**. Kanıtlı temizlik sonrası **311.774 bayt** (1.471 bayt azalma). Gold tasarımı korundu; Shuttle CSS'iyle değiştirilmedi. Platform/orijinal dosyalarına dokunulmadı.

## Yöntem ve sınır

Dosyanın tamamı css-tree 3.1.0 AST ayrıştırıcısıyla tarandı: başlangıçta 2.307, sonra 2.295 stil kuralı; ayrıştırma hatası yok. Değer dilbilgisi kontrolü ayrıca yapıldı; parse başarısı geçerli değer veya doğru görünüm demek değildir. `tools/css-denetim.cjs` salt okunur araçtır. `CSS_TREE_PATH`, tema dışında tutulan css-tree 3.1.0 `dist/csstree.js` dosyasını göstermelidir; araca ait bağımlılık mağazaya eklenmez. Araç otomatik silme yapmaz. Aynı medya koşulunun ayrı bloklarını karşılaştırır; seçici listesinin tamamının, değerlerin ve önem derecelerinin eşit olmasını arar.

Orijinal `orjinaltema/assets/style.css`, `Platform Dosyaları/template-assets/style.min.css` ve `plugins/bootstrap.soft.min.css` de ayrıştırılıp karşılaştırıldı. `sablon.twig:4` platform head bloğunu çağırır; tema CSS'i kendi head bloğunda smartbanner.css sonrasında gelir. Platformun head dışında/en son eklediği kaynaklar ve canlı sıra henüz görülmedi. Yerel deneyde referans Bootstrap → platform → tema sırası kullanıldı; bunun canlı sırayla aynı olduğu iddia edilmez.

Tam dosya mekanik incelemesi, bütün seçicilerin bütün sayfalarda görsel kabulü değildir. Özellikle AJAX/modül ayarlarıyla gelen HTML ve aktif ayar dalları görülmeden kullanılmama sonucu çıkarılmadı.

## Kaldırılanlar ve kanıt

Kesin başlangıç satırları, seçiciler, medya koşulları ve kalan sonraki satırlar [css-temizlik-kaniti.json](css-temizlik-kaniti.json) içinde. Satırlar başlangıç commit'ine aittir.

| Bileşen / eski konum | Neden ve işlem | Davranış / bağlantı |
|---|---|---|
| Kurumsal içerik, 608–651 | 992/600 px kapsamındaki 7 tam kural ve sosyal bağlantı `text-align` bildirimi, 889–931'de aynı kapsam/değerlerle tekrar ediyordu; önceki kopyalar kaldırıldı | `.corporate-*`, `.service-item`, `.info-column` sınıfları korunur. Platform içerik veya özel blokta gelebileceği için bileşen silinmedi |
| Manşet, 9478/9871/10041; 9933 | `.cstm-manset-block` için 991 px altında üç tam kopya ve ek `max-height:250px` tekrarı kaldırıldı; son 10055 kuralı kaldı | `flash-urun.twig:1`; diğer padding/görünüm kuralları yerinde |
| Ürün açıklaması, 7363–7364 | Aynı seçici/768 px koşulundaki sonraki font-size ve line-height korundu | `moduller/urunler/profil.twig`; marj kuralı silinmedi |
| Ürün düğmeleri, 13740 | Sonraki aynı kapsamlı font-size korundu | `profil.twig` `.product-buttons-container`; padding değişikliği varsayılıp birleştirilmedi |
| Kargo, 4958 | Aynı kuralın sonundaki önemli border-bottom tarafından ezilen `border-bottom:none!important` kaldırıldı | `moduller/odeme/bilgiler/kargo_icerik.twig`; platformun `.shipment-methods .method` bağlantısı korunur |
| Video düğmesi, 13854 | Aynı kuralın sonundaki `background:#ccc` tarafından ezilen gradient kaldırıldı | `resim_alani_tipi/carousel_sol.twig` devre dışı düğmesi; gri görünüm aynı |
| Ürün/fiyat/bilgi, 7259/7407/7556/7601/10226 | Geçersiz `position:left` ve `align-items:left` kaldırıldı; yerine tahmini konum/hizalama yazılmadı | Tarayıcının zaten yok saydığı değerler; geçerli mevcut cascade korunur |
| Ödeme özeti, 14778 | Sonraki koşulsuz 12 px tanımıyla gereksizleşen medya kuralı kaldırıldı | `moduller/sepet/ozet.twig`, `moduller/odeme/ozet.twig` |
| Ödeme özeti, 14792 | Geçersiz `max-width:768x` bloğu kaldırıldı. `px` yapılsa bile üç özelliği sonraki 991/1200 px blokları eziyor | Yeni mobil boşluk tasarımı icat edilmedi; hesaplama/form/ödeme kodu değişmedi |

`!important` 201'den 200'e indi; yalnız aynı kuralda kesin ezilen bildirim kaldırıldı. Bütün önem kurallarını kaldırmak hedef değildi.

## Korunanlar / doğrulama gerektirenler

| Grup | İncelenen bağlantı / kalan risk | Kesin sonraki kontrol |
|---|---|---|
| Genel yapı | `body,html` overflow-x:hidden; body transition; global `a:hover`, `.alert-info`, `.service-item`, `.info-column` | Tam sayfalarda scrollWidth ve kırpılan öğeler; blokların yan yana kullanımında kalıtım/kontrast. Sınıflar adı genel diye silinmedi |
| Header/menü | `header.desktop`, `.mega-menu`, `.thkm456-menu`, `header.twig`, `mega_menu.twig`, scripts.js; platform Bootstrap dropdown ve tema focus-within | Mobil menü/hesap/modal birlikteyken z-index, odak, kaydırma; gerçek fontlarla uzun kategori. `display:flex` → `-webkit-box` ve vendor yedekleri korundu |
| Ürün kartları | `.card-product`, platform favori/sepete ekle seçicileri, kart/kat-ozel-kart.twig | Gerçek ürün görseli, font, Swiper ve ayar dalları; tek kart kabulü tam kategori kabulü değildir |
| Ürün detayı | Profil, galeriler, `.ppriceg-right` min-width:300px, `.product-buttons-container` farklı padding değerleri | 320 px uzun fiyat/varyant/metin, stok dışı, modal, bütün galeri tipleri; farklı değerler otomatik tekrar sayılmadı |
| Sepet/ödeme | `.payment-cart-summary-1`, `.shipment-methods`, `.discount-section`; ref scripts.min.js seçim/özeti platformdan getiriyor | Hata/dolu/boş sepet, uzun kargo ve kupon yanıtı; hesaplama tema CSS temizliğine karıştırılmadı |
| Üyelik/form | `.m-input`, `.contact-form`, Bootstrap form sınıfları, giriş/kayıt/adres şablonları | Gerçek showAlert/modal ve alan hatası DOM'u. Outline kaldırılan bazı alanlarda border/shadow var; odak görünümü görülmeden toplu değişiklik yok |
| Footer/özel modüller | footer.twig mobil bar/kategori paneli, video-gallery.js; 9998/9999 z-index değerleri | Aynı anda açık modal/panel ve Smartbanner ile tam sayfa yığılma kontrolü; keyfi z-index düşürülmedi |

7 keyframes tanımı korundu. Altısının bu dosyada animation bağlantısı var; `fadeInOut` için yerel çağrı bulunamaması, platform/modül ayarıyla kullanılmadığını kanıtlamaz. `animation:all ease .5s` Shuttle'da da var; bunu transition'a çevirmenin tasarımsal sonucu kanıtlanmadığı için tutuldu. Üç CSS değişkeni (`--primary`, `--border`, `--muted`) `.smart-purchase` altındaki kurallarda kullanılıyor; silinmedi. Kaldırılmış bileşen olduğu kesinleşen stil yok.

Değer denetleyicisinin `-ms-flexbox` ve video `min(...calc(...))` uyarıları otomatik hata kabul edilmedi: biri eski tarayıcı yedeği, diğeri yerel Chromium'da geçerli modern değer. Video max-width:960px yedeği korunur. Dış URL'ler, inline Twig CSS ve platforma ait stiller bu dosyanın AST taramasıyla kullanılmaz sayılmaz.

## Gerçekten yapılan doğrulama

- `tests/css-cascade.cjs`: etkilenen seçicilerden oluşan açıkça sentetik DOM; bütün hesaplanan özellikler 320,375,600,601,768,769,991,992,993,1200,1440 px'te önce/sonra eşit. [Sonuç](css-cascade-results.json). Ağ kapalı; animasyon/geçiş durduruldu. Platform başlık/HTML üretimini ve bütün pseudo-state'leri temsil etmez.
- Twig 3.29.0 ile 165 kaynak ayrıştırıldı; mevcut yerel render denemeleri geçti. Qukasoft motor sürümü doğrulanmadı.
- Mevcut `tests/platform-uyum-01.cjs` yerel etkileşim kontrolleri geçti; AJAX yanıtları taklit. Gerçek giriş, ödeme veya sipariş yapılmadı.
- `artifacts/css-before/cards-375.png`, `cards-1440.png` ile sonraki karşılıkları ve `artifacts/visual-05/cards-768.png` gerçekten açıldı. Mobil/tablet/masaüstü kart yerleşiminde temizlik kaynaklı fark görülmedi. Ekran görüntüsü hash'i tek başına kabul ölçütü yapılmadı. Yerel görseller ve dil/font yer tutucuları kullanıldı.
- Genel kaynak taraması ve tarayıcı hesaplanan stil deneyi tamamlandı; tam sayfa ve gerçek Qukasoft görsel kontrolleri açık. Bu rapor CSS'in bütün kullanım durumlarının tamamlandığı anlamına gelmez.

## Ana onarıma devam sırası

Birleşik header/footer ile ana sayfa, kategori/arama, ürün, sepet/ödeme, üyelik/hesap ve içerik fixture'ları → yerel açık sorunlar → kaynak commit'inden ayrı kimlikli güncel paket → sayfa/işlem bazında Qukasoft kabulü. Önizleme erişimi yerel çalışmayı durdurmaz.

08 turu sonrası güncel CSS: 312.121 bayt. Yukarıdaki 311.774 bayt yalnız kanıtlı temizliğin sonucudur; sonraki footer/video/erişilebilirlik onarımları ayrı eklenmiştir. Altı arka plan URL eşliği css-kaynak-baglari.json içindedir.
