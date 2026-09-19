# CSS sonrası sayfa ve video onarımları

19.09.2026 — `fix/platform-uyum-01`. [CSS temizliği](css-denetimi.md) ayrı `8c9b5c9` commit'inde gönderildi. Aşağıdaki görsel/işlev onarımları onun üzerine gelir; CSS temizliğinin görünüm eşitliği iddiası bu kasıtlı sonraki düzeltmeleri kapsamaz.

## Müşteriye yansıyan düzeltmeler

| Sorun | Kaynak / tetik / neden | Yapılan düzeltme / doğrulama | Açık kabul |
|---|---|---|---|
| Alternatif ürün videosunun X düğmesi çalışmıyor | `urunler/resim_alani_tipi/carousel_sol.twig:87`, eski `profil.twig:516`: onclick parametresiz çağırırken fonksiyon event.target okuyor | Inline/global popup fonksiyonları yerine bu mevcut pencereye ait `assets/product-video-popup.js`; gerçek button, X/arka plan/Escape, odağı geri verme, iframe temizliği, tekrar yükleme koruması | Gerçek YouTube içeriği, sonradan AJAX ile eklenen ürün açıklaması, tüm galeri ayarları |
| Video X'i ekranın üstünde kalıyor | `.video-popup-content-987`, eski iki `.video-container-987 iframe` medya kuralı: sınırsız dikey içerik | Mevcut 9:16 oranı korunarak ekran yüksekliğine göre genişlik sınırlandı; X içerik üzerinde görünür. Tek ortak iframe kuralı; yeni !important yok | Gerçek mobil Safari, ekran klavyesi, iframe içi klavye. Cross-origin oynatıcının Escape olayı üst belgeye ulaşmayabilir |
| İlgisiz YouTube videosunu ürün videosu sayma | Eski `profil.twig:495` bütün belgedeki ilk YouTube iframe'ini seçiyordu | Arama ürün gövdesi/profiliyle sınırlandı. Ürün dışında iframe varsa düğme etkinleşmiyor | Platform ürün açıklamasının gerçek kapsayıcısı görülmeli; farklı yerleşimde yanlış videoyu açmak yerine düğme kapalı kalır |
| Mobil footer çalışma saati okunmuyor | `style.css`, 991 px altında `footer .info .fs,footer .info ul li {color:#000!important}`; `footer.twig:283` metni koyu #394348 fon üzerinde | Eski siyah important kuralı kaldırıldı; mevcut footer #dedede kuralı geçerli. Yerel 9 sayfanın mobil ölçümünde rgb(222,222,222); tablet görüntüsünde de görüldü | Gerçek footer iletişim/adres verileri ve renk ayarları |
| Sosyal giriş kapalıyken boş alan ve yanıltıcı metin | `uyelik/giris_yap.twig`, iki sosyal giriş kapsayıcısı sağlayıcıların dışındaydı | Kapsayıcı da facebookLogin/googleLogin aktif bayraklarına bağlandı. Kapalı ve Facebook açık Twig çıktıları kontrol edildi. userLogin/userRegister, 2FA ve returnUrl değişmedi | Gerçek sosyal giriş ayarı ve yönlendirme; hesap işlemi yapılmadı |

Platform referansları: `Platform Dosyaları/template-assets/scripts.min.js` giriş/kayıt ve modal çağrıları; `template-assets/style.min.css` ödeme düğmesi ve Bootstrap modal düzeni; `plugins/bootstrap.soft.min.css` form/grid/tab temeli. Bu dosyalar değiştirilmedi. Video onarımı platform fonksiyonu veya yeni kütüphane eklemez; mevcut tema davranışını kendi dosyasında yürütür. Tema modal kilidi yalnız `tilbe-product-video-open`; `modal-open` ve diğer kilitler korunur.

## Gerçekten görüntülenen kapsam

`tests/page-fixtures.php` kaynak Twig modüllerini açık sentetik veriyle header/footer etrafında birleştirir. `tests/page-visuals.cjs` referans CSS ile, HTTP/HTTPS kapalı olarak 375/768/1440 px görüntüleri üretir. **Qukasoft özel base şablonu ve etkin blok yerleşimi taklit edilmez.** Fixture'lar platform tam sayfası değildir. Dil anahtarları görünür; gerçek font ikonları, logo ve ürün verileri yoktur. Yerel eşleşen resimler gömülür, diğerleri açık yer tutucudur. Swiper/ödeme sağlayıcısı çalıştırılmaz; inline ağ/işlem kodu kaldırılır. Bu görüntülerdeki boş menü, eksik fiyat alanı veya dikey video listesi doğrudan tema kusuru sayılmadı.

- Ana sayfa birleşimi: header/footer, ürün kartları, video modülü; üç genişlik açıldı.
- Kategori/arama birleşimi: sıralama/filtre düğmeleri, uzun sorgu ve kartlar; üç genişlik açıldı. Gerçek filtre paneli/pagination AJAX yok.
- Ürün: profil, seçili galeri, fiyat, sayaç kabuğu, kampanya/kargo alanı, header/footer; üç genişlik açıldı. Özel alan platform makrosu yer tutucu.
- Sepet: dolu ve boş durumlar; üç genişlik açıldı. Miktar/fiyatlar sentetik; server işlemi yok.
- Ödeme: yöntem bulunamadı durumu ve özet kabuğu; üç genişlik açıldı. Adres/kargo AJAX ve sağlayıcı formu yok.
- Üyelik: giriş ve ayrı kayıt formu aynı deneme sayfasında; önce/sonra üç genişlik açıldı. Bu birleşim gerçek blok yerleşimini kanıtlamaz.
- Hesap: boş kullanıcı bilgisi formu ve header/footer; üç genişlik açıldı. Gerçek hesap oturumu yok.
- İçerik: basit metin ve header/footer; üç genişlik açıldı. Diğer içerik türleri görsel kabul bekliyor.

Dosyalar: `artifacts/full-pages/<home|category|product|cart|empty-cart|payment|login|account|content>-<375|768|1440>.png`. Boyut/taşma adayları [full-page-fixtures.json](full-page-fixtures.json) içinde. Taşma listesi kapalı offcanvas öğeleri de içerir; sayısı otomatik hata/başarı ölçütü değildir. Body overflow-x:hidden de hataları gizleyebilir; scrollWidth tek başına yeterli değildir. Tam sayfa görüntüsünde sabit bar ilk viewport yüksekliğinde görünür; sayfanın ortasında akış elemanı sanılmamalı.

Alternatif popup'ın 375/768/1440 ve 844×390 ekran görüntüleri gerçekten açıldı (`artifacts/product-popup`). İlk görüntüde X'in üstten kesildiği görüldü, düzeltildi ve tekrar bakıldı. Siyah iframe ağ engellendiği içindir; video oynadı iddiası yok. `tests/product-video-popup.cjs` bütün bu ölçülerde iframe ve X sınırlarını, kapanış yollarını, odak dönüşünü, mevcut modal kilidini, DOM'dan çıkarılınca temizliği ve ilgisiz video izolasyonunu doğrular.

## Yerelde kalan işler

- Birleşik sayfa fixture'larında gerçek kaynaklarla temsil edilebilecek diğer blok/ayar kombinasyonları, uzun gerçekçi içerik ve klavye dolaşımı genişletilebilir. Şu an statik birleşim görüntüleriyle bütün etkileşimler tamamlanmış sayılmaz. Önceki menü/şifre/favori/varyant kontrolleri kendi sınırlı fixture'larında geçti.
- Alt bar/ödeme CTA çakışma adayı: platform `style.min.css` 991 px altında `.payment-final-buttons-1` için bottom:0, height:70px, z-index:999 verir; tema `.tilbehomeMobilMenu456-container` bottom:0, z-index:998. Dolu sepet birleşiminde navigasyonun üstü örtülüyor. Özet şablonundaki CTA ile ayrı buton modülü birlikte etkin mi, gerçek base bunlardan hangisini gösteriyor: aktif blok yerleşimi görülmeden düğme/modül silinmedi. Referans çekirdeğe müdahale yok.
- Footer menü başlıklarının klavye ile açılması ve ekran genişliği değişiminde görünürlük; tüm ayar dallarında odak/kontrast kabulü açık.
- Form hata odağı için ref ajaxFormGate yalnız showAlert(message) sağlıyor; alan hata şeması bilinmiyor. Backend alan eşlemesi uydurulmadı. Native alan kuralları platformdan bağımsız yeniden tanımlanmadı.

## Yalnız platformda doğrulanacaklar

İki eski JS'nin etkin modül ayarı/Network kanıtı, canlı CSS/JS sırası ve sürümler, platform helper verileri, fiyat/stok/varyant/kargo/kupon hesapları, gerçek head/SEO, ödeme ve hesap yanıtları, opaque modül ayarlarının ayrı tema izolasyonu açık. Kaynaklarda bulunmayan backend davranışı tema koduyla kapatılmadı. Hiçbir canlı kayıt, yükleme, etkinleştirme, sipariş veya ödeme yapılmadı.
