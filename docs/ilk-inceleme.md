> Tarihsel inceleme/kontrol kaydıdır. Tek güncel sorun durumu: [kapsamli-denetim.md](kapsamli-denetim.md).

# Tilbe Home — İlk İnceleme ve Düzeltme Planı

> Bu belge ilk incelemenin tarihsel kaydıdır. Güncel, bütün temayı kapsayan onarım planı ve sorun durumları [kapsamli-denetim.md](kapsamli-denetim.md), 360 dosyanın durum envanteri [tema-envanteri.md](tema-envanteri.md) içindedir. İlk üç düzeltme toplam kapsamı sınırlamaz.

Tarih: 19 Eylül 2026. Kapsam: yerel Gold özelleştirmesinin Qukasoft referansları ve Shuttle ile statik karşılaştırılması. Tema veya referans kaynakları değiştirilmedi. Canlı mağazaya, müşteri verilerine ve mağaza API uçlarına istek gönderilmedi.

## 1. Proje ve Git durumu

- Başlangıçta proje kökünde, alt klasörlerde ve kontrol edilen üst dizinlerde `AGENTS.md` bulunmadı. Kök ve üst dizinlerde `.git` bulunmadı; mevcut remote yoktu. Git başlangıçta PATH üzerinden kullanılamıyordu.
- Kullanıcının sonraki açık gönderim talimatı üzerine Git kuruldu ve yerel depo başlatıldı. Kullanıcının verdiği `https://github.com/tilbehome/neotilbe` adresi GitHub bağlantısıyla doğrulandı; `origin` bu adrese eklendi. Başlangıç `ls-remote` kontrolünde uzak dal yoktu. Son gönderim bilgileri ayrıca bildirilmelidir; bu satır bir push başarı beyanı değildir.
- Gerçek klasör adı **Platform Dökümanları**; kullanıcıdaki “Platform Dokümanları” ile aynı referans klasörü olarak ele alındı, yeniden adlandırılmadı. Diğer kökler: `canlitema`, `orjinaltema`, `Platform Dosyaları`, `Platform Örnek Temaları`, `Örnek Dosyalar`. `docs` rapor için eklendi.
- Başlangıçta 1.300 dosya: 630 Twig, 17 JS, 13 CSS, 16 JSON, 5 CONFIG, 2 PDF, 2 ZIP, 2 Markdown, 2 HTML; kalanlar SVG/raster görsel ve font. En büyük dosya 1.806.144 bayt. Boyutu nedeniyle dışarıda bırakılması gereken dosya saptanmadı.
- `canlitema/ayarlar/tanim.json:1` Gold kimliğini, `orjinaltema/ayarlar/tanim.json:1` Shuttle kimliğini bildiriyor. Bunlar aynı tema sürümünün önce/sonra Git geçmişi değildir; farklar otomatik olarak hata sayılmadı.

## 2. Belgeler, teknoloji ve sürümler

`Platform Dökümanları/template.pdf` 51 sayfa, `web_servis_dokuman_v2.2.4.pdf` 78 sayfa: iki PDF’nin bütün sayfalarından metin çıkarıldı; tema açısından ilgili bölümler ve web servisinin kimlik doğrulama/veri sözleşmesi incelendi. Görsellerin ve ekran görüntülerinin görsel/OCR denetimi yapılmadı. Metinde bazı harf/boşluk ayrışmaları var; şüpheli isimler kaynak kodla karşılaştırıldı. Tamamen okunamayan PDF yok. Web servis belgesindeki 2.2.4, Twig veya mağaza çekirdeğinin sürümü olarak yorumlanmadı.

`web_servis_ornek.zip` içindeki dört PHP örneği çalıştırılmadan incelendi. Diğer ZIP’in dosya listesi incelendi; SVG ve HTML referansları içeriyor. Örnek temalar karşılaştırma desteğidir; tüm örnek temaların her davranışı ayrıntılı denetlenmedi.

| Teknoloji | Yerel kanıt ve sürüm | Kullanım / sınır |
|---|---|---|
| Twig / Qukasoft fonksiyonları | `template.pdf`, s.6–7; bütün `sablon.twig` dosyaları | Twig motor sürümü ve sunucu PHP sürümü belirlenemiyor. Yerel PHP sürümü sunucunun kanıtı değildir. |
| jQuery | `Platform Dosyaları/template-assets/plugins/bootstrap.js:1`, **3.6.3** | Bu dosya yalnız Bootstrap değildir; birleştirilmiş kütüphane paketi. |
| Bootstrap JS | aynı dosya:10, **4.4.1** | `data-toggle`, jQuery modal/tab/carousel yapıları mevcut. Bootstrap 5 varsayılmamalı. CSS paketinin birebir aynı sürüm olduğu ayrıca kanıtlanmadı. |
| easy-autocomplete | aynı dosya:21, **1.3.5** | Platformun akıllı arama bileşeni. |
| Owl Carousel | aynı dosya:28, **2.3.4** | Platform/tema ürün karuselleri. |
| jsSocials | aynı dosya:38, **1.4.0** | `.social-share`. |
| sticky-sidebar | aynı dosya:50, **3.3.1** | Sabit yan alanlar. |
| International Telephone Input | aynı dosya:58, **16.0.8** | `.form-phone-control`; yardımcı JS platform URL’sinden yükleniyor. |
| jQuery & Zepto Lazy | aynı dosya:65, **1.7.10** | `.lazy-load`, `.owl-lazy`, mobil menü görselleri. |
| Font Awesome | `plugins/fontawesome/css/all.min.css:1`, **5.12.0** | Göreli webfont dosyalarının hepsi referans klasöründe yok; bu canlı 404 kanıtı değildir. |
| SweetAlert, Popper/diğer paket yardımcıları | Bootstrap paketindeki kod / çağrılar | Bu incelemede güvenilir kesin sürüm belirlenmedi; `swal` API’si kullanılıyor. |
| Fancybox, Simplebar, datepicker, resim yükleyici | `template-assets/scripts.min.js:1`, `loadPlugins` ve `SITE_CONFIG` | Bazıları koşullu/dinamik yükleniyor; sürümleri belirlenemedi. |
| Smartbanner | `canlitema/assets/smartbanner.js`, `sablon.twig:81` | Tema eklentisi; kesin sürüm belirlenemedi. |
| Swiper | `canlitema/video-listeleme.twig:71`, CDN’de `@10` | Yalnız ana sürüm sabitlenmiş; tam sürüm ve modülün canlıda etkinliği belirsiz. |
| Google / Cloudflare kaynakları | `Platform Dosyaları/google/platform.js`, `cloudflare/email-decode.min.js` | Kesin sürüm belirlenemedi; tema içine kopyalanacak bağımlılıklar değil. |

Bu envanter **yerel referans kopyalara** aittir; canlıda aynı sürümlerin çalıştığı doğrulanmadı.

Belge sözleşmeleri: `temaDosyalari`, `ortakDosyalar`, `updateModuleHeadCodes`, `updateModuleFooterCodes`, `varsayilanSablon`, `varsayilanModal`, `varsayilanBosDosya` s.6–7; ayarlar s.8–9; `statikLinkler` s.10; para biçimlendirme s.16; sepet alanları s.26–27; `ucretsizKargoKalanTutar` ve `ucretsizKargoLimitleri` s.28; `urunTaksitBilgisi` ve `vade` s.36; tema JSON yapısı s.49–50; dinamik sepet `data-*` nitelikleri s.51. `raw` yalnız platformun güvenilir HTML/JSON çıktısında sözleşmesine göre kullanılmalı.

## 3. Platform–Tema Uyumu

### Miras ve yükleme sırası

`sayfalar/urun_detay.twig:1` ve diğer sayfalar → `sablon.twig:1` → `varsayilanSablon()` ile platform şablonu. Modüller `varsayilanBlokModul()`, hızlı sepet `varsayilanModal()` kullanıyor. Sepet modülleri boş sepet için `varsayilanBosDosya()` seçiyor. `modulIcerik`, `modulBaslik`, `modulFooterKodlari`, `temaHeadEtiketleri`, `temaFooterKodlari` korunması gereken blok adlarıdır. Panda/Count örneklerinin `sablon.twig:1` yapıları da bu düzeni destekliyor.

Özel şablonun görülebilen head sırası: `temaHeadEtiketleri` → font/tema değişkenleri → Smartbanner CSS → tema CSS → koşullu stiller (`sablon.twig:3–66`). Footer: overlay → uyarı süresi → `smartbanner.js` (defer) → `scripts.js` → Smartbanner ready çağrısı → `temaFooterKodlari` (`sablon.twig:71–98`). Platform ana şablonu, modül kodlarını birleştiren sunucu ve `@default` kaynaklarının tamamı arşivde yok. Dolayısıyla platform CSS/JS’nin bu bloklara göre gerçek yükleme sırası, async/defer etkisi ve modüllerin kaç kez render edildiği **belirsiz**. Smartbanner için yalnız `defer` bulunmasından hareketle kesin hata ilan edilmedi.

| İşlevsel bağlantı | Platform tüketicisi | Tema karşılığı / durum |
|---|---|---|
| Varyant | `scripts.min.js:1`, `changeProductPageVariant` | `profil.twig:207–262`: `select[data-variant]`, `data-variant-value`, seçenek bağlantıları korunmuş; `.sale-variant-price` üzerinden liste/havale/indirim fiyatı seçicileri türetiliyor. |
| Sepete ekleme | aynı dosya, `addCart` | `profil.twig:322–352`: ürün ID, `variantDiv`, `checkVariant`, `quantity`, `redirectPayment` korunmuş. Hızlı sepette ayrı `data-fast-cart-product-id` alanı var. |
| Sepet güncelleme | aynı dosya, `productQuantityBox`, `updateCartQuantity`, `removeCart`, `fetchCartAjax` | `sepet/liste.twig:101–123`, `ajax_liste.twig:38`, `header.twig:122–137`; sayaç ve AJAX hedefleri korunmuş. |
| Ödeme | aynı dosya, `completePaymentStep` | `odeme/bilgiler/adres.twig:11`, `kargo.twig:16`, `odeme.twig:12`, `sozlesme_kutusu.twig:7`: form `data-payment-box-form` ve alan `data-payment-input` sözleşmeleri kritik. TC alanı istisnası aşağıda. |
| Üyelik | aynı dosya, `userLogin`, `userRegister`, `userForgotPassword` | Girişte global çakışma var; kayıt ve şifre formu platform çağrılarını koruyor. Sunucudaki zorunlu alanlar ayrıca sınanmalı. |
| Arama | aynı dosya, `data-smart-product-search*` taraması | `header.twig:78–85,222–224`: form action, `name="k"`, masaüstü ve mobil arama nitelikleri mevcut. Mobil nitelik referans JS tarafından gerçekten destekleniyor. |
| Modal / menü | Bootstrap paketi, `showNativeModal`, `baseLazyLoad`; platform `.hidden-scroll` CSS’i | `data-toggle`, `.btn-sidebar-menu`, `.mobile-menu-close`, `.op-black`, `active/hide/show` işlevsel; yalnız görsel sınıflar gibi kaldırılmamalı. |

`guncelfiyat-price`, `thkm456-*`, kampanya/kart tasarım sınıfları kendi başlarına hata değildir. Buna karşılık `.sale-variant-price`, `.variant-box`, `.form-control`, `.hidden-scroll`, `data-cart-*` ve form alan adları JS sözleşmesine dahildir. Platformun mobil menü görsellerini yükleyen click dinleyicisiyle temanın menüyü açan dinleyicisinin aynı düğmede olması tek başına çift işlem hatası değildir.

### Kesin kaynak kusurları / koşullu etkileri

“Kesin” kaynakta doğrulanan kusur demektir; canlı mağazada işlem yürütüldüğü anlamına gelmez. P1 satış/erişim, P2 gösterim/yardımcı işlev önceliğidir.

**K1 — P1: Platform giriş fonksiyonu eziliyor.**
- Tema: `canlitema/moduller/uyelik/giris_yap.twig:24,165–173`; orijinal karşılık kendi `userLogin` fonksiyonunu tanımlamıyor. Platform: `Platform Dosyaları/template-assets/scripts.min.js:1`, `userLogin`.
- Kanıt: özel `function userLogin(form)` platformun global adıyla aynı; `remember-me` ID’si tema içinde yok ama `.checked` okunuyor. Platform fonksiyonu AJAX girişini, iki faktörlü doğrulamayı ve yönlendirmeyi yönetirken özel kod bunları yapmıyor, `true` dönüyor.
- Tetik/etki: özel tanım son yüklenen olursa girişte TypeError; normal form gönderimi ve platform giriş akışının kaybı riski. Hangi tanımın kazandığı canlı yükleme sırasına bağlı.
- Düzeltme: platform globalini koru; “beni hatırla” gerekiyorsa desteklenen form alanıyla ve ayrı isimli yardımcıyla uygula. Tasarım korunabilir.
- Doğrulama: Qukasoft test hesabıyla hatalı/doğru parola, modal giriş, iki faktör ve ödeme dönüş URL’si; Network’te tek beklenen giriş isteği. Burada yapılmadı.

**K2 — P1: Mobil menü kapatıldığında kaydırma kilidi kaldırılmıyor.**
- Tema: `canlitema/assets/scripts.js:8–28`, `moduller/header.twig:177,237–242`; orijinal `assets/scripts.js:8` açma/kapatmayı birlikte bağlıyor. Platform: `template-assets/style.min.css:1`, `.hidden-scroll{overflow:hidden!important;position:relative!important}`.
- Kanıt: açma `body.hidden-scroll` ekliyor; yeni kapatma yalnız menü `active` ve overlay `show` sınıflarını kaldırıyor. Overlay handler’ı `.sidebar-menu-type-2`yi kontrol etmiyor.
- Tetik/etki: üst mobil menüyü açıp X ile kapatma sonrası sayfa kaydırması kilitli kalabilir; arka plana tıklama da tip-2 menüyü kapatmayabilir.
- Düzeltme: aç/kapat durumunu tek tema yardımcısıyla yönet; bütün menü/overlay/body durumlarını tutarlı temizle. Yeni `!important` ile örtme.
- Doğrulama: 375/768 px’de X, arka plan, tekrar açma, hesap paneli ve alt özel menü geçişlerinde sınıfları/computed overflow’u kontrol et.

**K3 — P2: Taksit adedi platform çıktısı yerine 12’ye sabitlenmiş.**
- Tema: `moduller/urunler/profil.twig:157–165`; platform sözleşmesi: `template.pdf`, s.36 (`aylik`, `vade`); ilişkili JS `scripts.min.js:1/changeProductPageVariant`.
- Kanıt: `taksit_bilgisi.aylik` ile sabit `12 X` birlikte basılıyor. Gerçek `vade` farklıysa yanlış taksit vaadi oluşur; varyant fiyat değişimi ayrıca bu özel taksit alanını güncellemiyor.
- Düzeltme: platform `vade` alanını kullan; varyant değişiminde desteklenen taksit güncellemesini doğrula.
- Doğrulama: 3/6/12 vade ve farklı fiyatlı varyantlarda ürün/taksit tablosu karşılaştırması.

**K4 — P2: Kargo seçeneğinin ücretli dalı boş bırakılmış.**
- Tema: `moduller/odeme/bilgiler/kargo_icerik.twig:31–36`; orijinal aynı dosyada ücret çıktısı var. Platform: `scripts.min.js:1` ödeme/kargo seçimi ve özet güncellemesi.
- Tetik/etki: ücretli kargo firmasında seçenek satırının fiyatı görünmüyor. Özetin toplamı doğru olsa bile firma karşılaştırması eksik.
- Düzeltme: orijinalin platform fiyat alanını mevcut tasarıma geri bağla; ücret hesaplamasını JS ile yeniden yazma.
- Doğrulama: biri ücretli biri ücretsiz iki firma; satır/özet/son adım tutarları.

**K5 — P2: Giriş formu CSS seçicisi gerçek HTML’yi hedeflemiyor.**
- Tema: `assets/style.css:12778,12787`; `moduller/uyelik/giris_yap.twig:4` aynı elemente `login-body p-g-mod-t-4` koyuyor. Platform: `plugins/bootstrap.soft.min.css` içindeki `.form-control` kuralları.
- Kanıt: `.login-body .p-g-mod-t-4 .form-control` bir alt element bekliyor; iki sınıf aynı elementte. Hedeflenen input bu kuralla eşleşmiyor, platform/genel tema input stilleri uygulanıyor.
- Düzeltme: aynı elementi gösteren `.login-body.p-g-mod-t-4 ...` kapsamı; gereksiz özgüllük/`!important` ekleme.
- Doğrulama: DevTools matched rules; hesap/giriş modalındaki diğer formlarda yan etki kontrolü.

**K6 — P2: Üç JS varlığı düz JS olarak ayrıştırılamıyor.**
- Tema: `assets/cok-al-az-ode-indirim.js:22`, `assets/tahmini-kargom.js:22`, `assets/yt-video-kontrol-02.js:1`. Platform ilişkisi: `scripts.min.js:1/productQuantityBox`, `changeProductPageVariant`; belge `temaDosyalari`, s.6.
- Kanıt: ilk ikisinde JS tek tırnaklı dizgesine Twig tek tırnakları gömülmüş; üçüncüsü `<script>` etiketiyle başlıyor. Node `vm.Script` sözdizimi kontrolü üçünde de başarısız oldu. İlk ikisi aynı global fonksiyon isimlerini de tanımlıyor.
- Tetik/etki: bunlar statik JS olarak yüklenirse dosya çalışmaz; iki miktar dosyası beraber işlenirse global çakışma riski de var. Yerel Twig/CONFIG/JSON içinde yükleme referansı bulunmadı; canlıda yüklendikleri söylenemez.
- Düzeltme: etkinlik doğrulandıktan sonra veriyi Twig’den JSON/data niteliğiyle geçir; JS’yi gerçek JS tut; tek kapsamlı modül kullan. Kullanılmıyorlarsa bu aşamada silme.
- Doğrulama: render edilmiş sayfa Network/console ve tek miktar değişiminde tek güncelleme.

**K7 — P2: Sepet kampanya mesajı gerçek indirim durumunu doğrulamıyor.**
- Tema: `moduller/sepet/liste.twig:12–22`; platform: `template.pdf`, s.26–28, `urunler.ID`, `urunler.urun.ID`, `ozet.indirim_var_mi`; `scripts.min.js:1/updateCartQuantity`.
- Kanıt: “farklı ürün” için ürün ID’si yerine sepet satırı ID’si tekilleştiriliyor; üç satırda koşulsuz “indirim uygulanmıştır” deniyor. Üç varyant satırı aynı ürüne ait olabilir; gerçek indirim uygulanmasa da mesaj çıkar.
- Düzeltme: kampanya koşullarını platformun gerçek sonuçlarıyla bağla; yalnız ürün çeşidi sayılacaksa `sepet.urun.ID` kullan. Salt görsel sayaç indirim uygulamış gibi konuşmamalı.
- Doğrulama: aynı ürünün üç varyantı, üç uygun ürün, kampanya dışı ürün ve kupon birleşimleri.

### Qukasoft ortamında doğrulanması gereken şüpheler

**S1 — P1: Ödeme formundan TC alanının kaldırılması.**
- Tema: `moduller/odeme/bilgiler/adres.twig:11–25`; orijinal: aynı dosya:24–27. Platform: `template.pdf`, s.8, `tc_alani_zorunlu_mu`; `scripts.min.js:1/completePaymentStep` alanları serialize ediyor ve hata hedefinde `.offset().top` okuyor.
- Kanıt: `name="tc"` ve `data-payment-input="tc"` kaldırılmış; fatura `invoice_tc` bunun yerine geçmez. Ayar zorunluysa sunucu reddedebilir; bulunmayan hata hedefi istemci hatası da doğurabilir. Aktif mağaza ayarı bilinmiyor.
- Düzeltme: platform ayarına bağlı TC alanını mevcut görünümle geri bağla; fatura alanının “zorunlu değil” ifadesini de gerçek kuralla eşleştir.
- Doğrulama: zorunlu/zorunlu olmayan ayarlar ve bireysel/kurumsal fatura ile 1→2 ödeme adımı; gerçek ödeme yapmadan test ortamında.

**S2 — P1/P2: Biçimlendirilmiş sepet fiyatıyla matematik ve sabit kargo eşiği.**
- Tema: `moduller/sepet/ozet.twig:15–19,63`; platform: `template.pdf`, s.27–28 (`genel_toplam_base`, `genel_toplam`, kargo yardımcıları); `scripts.min.js:1/fetchCartAjax`.
- Kanıt: `genel_toplam` çıkarma/bölme işleminde; indirim tutarı yeniden `number_format` ile işleniyor; eşik 500 ve para birimi TL sabit. Orijinal bu tutarları doğrudan gösteriyor. Belge alanları ayrı listeliyor ama her alanın kesin çalışma zamanı tipini açıklamıyor.
- Etki: yerelleştirilmiş fiyatlarda yanlış sayı/şablon hatası; farklı kargo kuralı veya para biriminde yanlış “kargo bedava” mesajı.
- Düzeltme: mevcut `ucretsizKargoKalanTutar` / `ucretsizKargoLimitleri` sözleşmesini kullan; matematikte doğrulanmış ham sayılar, gösterimde platform biçimi. Çekirdeğe müdahale etme.
- Doğrulama: 499,90 / 500 / 1.250,50 tutarları, kupon, ücretli kargo ve başka para birimi; Twig hata günlüğü ve gerçek sunucu özeti.

**S3 — P2: Swiper yükleme/başlatma modeli karışık.**
- Tema: `video-listeleme.twig:6,71–75`; platform: `plugins/bootstrap.js:28` Owl mevcut, bu yerel pakette global Swiper kaynağı saptanmadı.
- Kanıt: web component etiketi ve `swiper-element-bundle` yanında anında `new Swiper(...)`; dış script defer olduğu için bu inline koddan önce çalışması garanti değil. Bu modülün etkin sayfalara dahil edildiği doğrulanmadı.
- Düzeltme: görünümü koruyan tek bir desteklenmiş başlatma yolu seç; mümkünse platformun mevcut karuselini kullan; ek kütüphane gerçekten gerekiyorsa tek kez ve doğru yaşam döngüsünde yükle.
- Doğrulama: modül etkinse soğuk cache, yavaş ağ, tekrar render ve mobil kaydırma; console’da global/yeniden tanım hataları.

**S4 — P2: Göreli tema dosyaları yerine eski tema yoluna bağlı URL’ler.**
- Tema örneği: `moduller/header.twig:193,200,209`; kimlik: `ayarlar/tanim.json:1`; platform: `template.pdf`, s.6 `temaDosyalari`.
- Kanıt: Gold kimliğine rağmen `/theme/___shuttle/...` mutlak URL’leri. Canlıda eski yol çalışıyor olabilir; 404 iddiası yok.
- Düzeltme: tema paketine ait dosyalarda `temaDosyalari`; gerçekten dış kaynak olan URL’leri ayrı tut.
- Doğrulama: yeni tema kopyası/test alanında kaynak URL’leri ve HTTP durumları; eski canlı temaya bağımlılık kalmaması.

**S5 — P2: Ödeme kargo fişi iki yoldan gönderilebilir.**
- Tema: `assets/scripts.js:126–140`, `moduller/odeme/bilgiler/kargo_sablonu.twig:13–16`; platform: `scripts.min.js:1/completePaymentStep`.
- Kanıt: tema `completeBeforePaymentStep` içinde bağımsız `Payment/shipmentFile` çağırıyor; yerel çekirdek aynı dosyayı `Payment/complete` FormData’sına da ekliyor. Hook dönüş değeri çekirdekte beklenmiyor. Bu tema hook’u orijinalde de var: yalnız özelleştirmeye yüklenemez.
- Etki: bayi+kargo fişi koşulunda yinelenen yükleme/yarış ihtimali; çekirdek sürüm eşleşmesi belirsiz.
- Düzeltme: güncel platform sözleşmesinde tek dosya gönderim yolunu tema tarafından kullan; çekirdeği değiştirme.
- Doğrulama: test dosyası ve test bayi hesabıyla istek sayısı, başarılı/başarısız yükleme ve bir sonraki adıma geçiş.

## 4. Diğer inceleme sonuçları ve karşılaştırma

- SHA-256 ile aynı göreli yol üzerinden karşılaştırma: **canlitema 360, orjinaltema 132 dosya; 78 aynı, 54 değişmiş, 228 yalnız özel temada, 0 orijinalden eksik**. Ek görseller, kartlar, kampanyalar ve tasarım dosyaları hata sayılmadı. Bütün `sayfalar/*.twig` dosyaları ortak karşılaştırmada aynı; değişiklikler çoğunlukla modüllerde/varlıklarda.
- Özel temada 165 Twig, 7 JS, 2 CSS, 3 JSON, 1 CONFIG ve 182 görsel/font dosyası var. İki tema arasında değişmiş 54 dosyanın 5’i görsel, kalanları kaynak/ayar dosyalarıdır.
- Sabit `include/extends/import/from` hedefleri ve sabit `temaDosyalari('...')` başvuruları kontrol edildi: eksik yerel hedef saptanmadı. Bu sonuç dinamik yolları, modül yönetimindeki içerikleri, CSS içindeki tüm URL’leri veya uzak URL’lerin canlı durumunu kapsamaz. `@default` ve fonksiyonla çözülen yollar yerel dosya yok diye hata sayılmadı.
- Tema şablonlarında jQuery/Bootstrap’ın yeniden yüklenmesine rastlanmadı. Swiper/Smartbanner ekleri ayrı değerlendirildi. “Bütün kütüphaneler çift yükleniyor” sonucu çıkarmak için kanıt yok.
- Açık çift addCart dinleyicisi saptanmadı. Sepet miktar artışı `productQuantityBox → change → updateCartQuantity` zinciriyle çalışıyor; bunu iki ayrı güncelleme gibi yorumlamamak gerekir. Platformda `updateCartQuantity_Process` kilidi var.
- Aynı adlı `updateCountdown` fonksiyonları `assets/kargoya-verilme-suresi.js:1`, `flash-sayac.twig:33`, `flash-urun.twig:40`, `moduller/urunler/profil.twig:527` içinde bulundu. Birlikte yüklenmeleri doğrulanmadı; modül yerleşimi/tekrar render kontrolünde ele alınmalı. Referans JS `add_to_cart`, `cart_updated`, `change_product_variant` olayları sunuyor; bunları kullanırken her varyant dalında aynı olayın geldiği varsayılmamalı.
- Varyant `tip_2` onchange yazımı özel ve orijinalde aynı; salt farklı görünmesi yeni hata kanıtı değil. 1/2/3 varyant, stok dışı seçenek, boş seçim, apostrof/tırnak içeren varyant adı ve hızlı sepet birlikte sınanmalı. `sale-*` fiyat sınıfları korunmuş.
- Mobil arama `header.twig:226–228` içinde kapanışı eksik ilk button var; tarayıcının DOM onarımıyla iki düğme oluşabilir. GET arama ve öneri seçimi test edilmeli, işlevsel nitelikler korunarak HTML düzeltilmeli. Platformun mobil arama seçicisi mevcut olduğu için bu niteliği değiştirmek çözüm değildir.
- Tema CSS’inde 199 `!important` bulundu; sayı tek başına hata değil. `.hidden-scroll` ile menü durumunun birlikte etkisi K2’de, uygulanmayan kapsam K5’te kanıtlandı. `sablon.twig:50–57` genel `.container*` genişliğini koşullu `!important` ile değiştiriyor; ödeme/modal dahil etkileri computed style ile doğrulanmalı. Body fontu kalıtılıyor; komponent font tanımları bunu değiştirebilir. Canlı stylesheet sırası bilinmeden yalnız dosya sırasından bütün cascade sonuçları çıkarılamaz.

## 5. Küçük, ayrı uygulanabilir düzeltme adımları

1. **Giriş düzeltmesi (K1):** yalnız global ad çakışmasını ve form bağlantısını düzelt. Test hesabı, iki faktör ve ödeme dönüşü kabul kriterleri.
2. **Ödeme form sözleşmesi (S1):** TC zorunluluğunu doğrula, alanı ayarla uyumlu yap. Kayıt/şifre formlarının zorunlu alanlarını aynı ortamda kontrol et. Tasarım değişikliği ayrı tutulmalı.
3. **Ürün→sepet doğrulaması:** 1/2/3 varyant, stok dışı, fiyat farkı, hızlı modal, hemen al, artı/eksi/doğrudan miktar ve kupon senaryoları. Hata çıkarsa tek bağlantıyı düzelten ayrı değişiklik; kapsamlı yeniden yazım yok.
4. **Sepet fiyat/kargo mesajları (S2,K7):** platform yardımcıları ve gerçek indirim sonuçlarıyla bağla. Önce sınır tutarları/para birimi; sonra görsel bar. Sunucu toplamını istemcide yeniden hesaplama.
5. **Mobil menü (K2):** tek aç/kapat durumu; X/overlay/hesap geçişleri ve kaydırma. Alt özel menü tasarımı korunmalı.
6. **Ödeme kargo/taksit gösterimi (K3,K4):** platform ücret/vade alanlarını bağla; farklı yöntem/varyantla karşılaştır.
7. **Koşullu eklentiler (K6,S3,S5):** önce hangi dosyanın gerçekten yüklendiğini ölç; sonra JS sözdizimi, tek başlatma ve tek dosya yükleme yolunu ayrı değişikliklerle düzelt.
8. **Kaynak URL’leri ve CSS kapsamı (S4,K5):** tema helper’ları ve doğru bileşik seçiciler. `!important` yığarak veya platform dosyalarını temaya kopyalayarak çözme.

Her adım ayrı commit ile uygulanabilir; ürün/menü/kart tasarımı korunmalı. Platform referansları salt karşılaştırma kaynağı olarak kalmalı.

## 6. Kontrollerin sınırı

Yapılanlar: yerel dosya/envanter ve SHA-256 karşılaştırması; belge metni incelemesi; platform fonksiyon/HTML/CSS eşleştirmesi; sabit dosya referansı taraması; yedi özel JS dosyasının çalıştırmadan sözdizimi kontrolü. Dört JS ayrıştırıldı, üçünde yukarıdaki hatalar bulundu. Twig platform motorunda derlenmedi. Sıradan statik önizleme hazırlanmadı; hazırlansa da gerçek mağaza işlevlerini doğrulamazdı.

**Sepete ekleme, üyelik, kupon, kargo güncelleme veya ödeme işlemleri Qukasoft’ta test edilmedi.** Sunucu verisinin tipi, aktif tema ayarları, modül yerleşiminin gerçek render sonucu, canlı kütüphane sürümleri, CSS/JS yükleme sırası ve ödeme yöntemlerinin dinamik kodu yerelden kesinleşmez. Gerçek müşteri/sipariş kullanılmadan ayrı Qukasoft test ortamı ve test hesapları gerekir. Bu rapor tüm olası hataların tüketildiği iddiasında değildir.

## 7. GitHub gönderimi öncesi hassas veri kontrolü

- Kaynak/ayar metinleri ve dosya isimlerinde parola/token/anahtar, `.env`, özel anahtar ve veri dışa aktarımı göstergeleri tarandı. PDF metinleri ve ZIP içindeki PHP örnekleri de kontrol edildi; yalnız dış ZIP adına bakılmadı. Mağaza API’siyle hiçbir anahtar doğrulanmadı.
- **`Platform Dökümanları/web_servis_ornek.zip` hariç bırakıldı:** dört PHP örneğinin 3–4. satırlarında doldurulmuş API kimlik bilgileri var. Geçerli oldukları iddia edilmiyor; açık depoya gönderilmemeleri için `.gitignore`a yalnız bu arşivin yolu eklendi. Yerel arşiv değiştirilmedi/silinmedi, değerleri rapora kopyalanmadı. Sipariş oluşturma örneği de bu arşiv içinde kaldı.
- Web servis PDF’sindeki kimlik doğrulama anlatımı örnek/yer tutucu değerler içeriyor; belgeyi bu nedenle dışlamadık. Dinamik `kullaniciBilgileri` / `siparisBilgileri` Twig çağrıları gerçek müşteri veri dökümü değildir. Projede ayrı gerçek müşteri/sipariş veri dışa aktarımı saptanmadı. Otomatik tarama ve metin incelemesi tüm görsellerde gizli bilgi bulunmadığının garantisi değildir; görsellerin tamamına OCR uygulanmadı.
- PDF’ler, platform CSS/JS, orijinal ve örnek temalar, diğer örnek ZIP gereksiz sayılmadı. `.gitignore` geçici/kimlik dosyalarını ve gelecekteki özel export dizinlerini de kapsıyor. İnceleme araçları ve PDF metin çıkarımları proje dışındaki geçici dizinde tutuldu; commit’e alınmayacak.

## Ek: Dosya fark envanteri

De?i?en ortak yollar (canlitema ? orjinaltema):

- `assets/images/appstore.png`
- `assets/images/playstore.png`
- `assets/images/preview/1.png`
- `assets/images/preview/3.png`
- `assets/images/preview/4.png`
- `assets/scripts.js`
- `assets/style.css`
- `ayarlar/modul_yerlesimi.config`
- `ayarlar/resim_boyutlari.json`
- `ayarlar/tanim.json`
- `ayarlar/tema.json`
- `moduller/diger/mega_menu.twig`
- `moduller/diger/mega_menu_side.twig`
- `moduller/diger/single_menu.twig`
- `moduller/footer.twig`
- `moduller/header.twig`
- `moduller/kategoriler/kategori_aciklama.twig`
- `moduller/kategoriler/responsive_butonlar.twig`
- `moduller/kategoriler/sayfalama.twig`
- `moduller/odeme/adimlar.twig`
- `moduller/odeme/bilgiler/adres.twig`
- `moduller/odeme/bilgiler/kargo.twig`
- `moduller/odeme/bilgiler/kargo_icerik.twig`
- `moduller/odeme/bilgiler/odeme.twig`
- `moduller/odeme/bilgiler/siparis.twig`
- `moduller/odeme/butonlar.twig`
- `moduller/odeme/ozet.twig`
- `moduller/odeme/ozet_icerik.twig`
- `moduller/odeme/siparis_onayi.twig`
- `moduller/odeme/sozlesme_kutusu.twig`
- `moduller/sepet/butonlar.twig`
- `moduller/sepet/hediye_ceki.twig`
- `moduller/sepet/liste.twig`
- `moduller/sepet/ozet.twig`
- `moduller/sepet/sepet_bos.twig`
- `moduller/statik_sayfalar/404.twig`
- `moduller/statik_sayfalar/alt_sayfalar/havale_bildirim.twig`
- `moduller/statik_sayfalar/alt_sayfalar/siparis_takip.twig`
- `moduller/statik_sayfalar/alt_sayfalar/sss.twig`
- `moduller/urunler/anasayfa_kart.twig`
- `moduller/urunler/hizli_sepet_kutusu.twig`
- `moduller/urunler/kart.twig`
- `moduller/urunler/kart_degerlendirmeler.twig`
- `moduller/urunler/liste_kart.twig`
- `moduller/urunler/profil.twig`
- `moduller/urunler/profil_degerlendirmeler.twig`
- `moduller/urunler/resim_alani_tipi/carousel_atli_karinca.twig`
- `moduller/urunler/resim_alani_tipi/carousel_sol.twig`
- `moduller/urunler/resim_alani_tipi/normal_altta.twig`
- `moduller/uyelik/giris_yap.twig`
- `moduller/uyelik/sifre_yenileme.twig`
- `moduller/uyelik/sifremi_unuttum.twig`
- `moduller/uyelik/uyelik_formu.twig`
- `sablon.twig`

Yaln?z ?zel temada bulunan dosyalar?n t?r da??l?m?: {".png":50,".webp":51,".svg":59,".js":6,".gif":2,".jpg":4,".jpeg":3,".css":1,".otf":1,".twig":51}. Eklenmi? olmak hata s?n?fland?rmas? de?ildir.
