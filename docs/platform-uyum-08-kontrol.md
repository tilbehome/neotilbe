| Sorun | Müşteriye etkisi | Yapılan onarım | Doğrulama | Kalan iş |
|---|---|---|---|---|
| FOOT1: Footer başlıkları ve ekran değişimi | Klavye ile kapanmayan gruplar; mobilde kapatılan bağlantıların masaüstünde gizli kalması | Yerel düğme, aria durumu, 991px sınırı ve masaüstüne dönüşte görünürlük | Gerçek referans jQuery ile Enter, grup ayrımı, resize testi; içerik birleşimi 375/768/1440 görüntüleri açıldı | Gerçek blok yerleşimi ve yardımcı teknoloji kabulü |
| FORM1: Hata penceresinden sonra odak kaybı | Klavye kullanıcısı formdaki yerini kaybediyor | Mevcut showAlert çağıran kontrole döner; başka modalın odağını almaz | Referans SweetAlert ve ajaxFormGate, sentetik sunucu/ağ hatası; önce body, sonra Kaydet odağı | Gerçek hata yanıtı ve alan bazlı hata şeması |
| ASSET2: Eski tema dizinine bağlı altı CSS görseli | Ayrı temanın kaynakları başka tema dizinine bağlı | Aynı mevcut dosyalara göreli URL | Yerel dosya hash'leri özgün Gold ZIP girdileriyle aynı; css-kaynak-baglari.json | Canlı CSS adresi ve HTTP yanıtı |
| A11Y8: Adsız arama, yanlış hesap alternatif metni, menü X | Kontrol amacı yardımcı teknolojide belirsiz | Etiketler; sınıfı korunan yerel X düğmesi | Kaynak incelemesi, önceki menü regresyonları geçti | Mobil menünün tam odak sırası hâlâ açık |
| FOOT2: Boş sosyal bağlantı | Tıklanınca mevcut sayfayı açıyor | Yalnız ayarı dolu bağlantı üretilir | Gerçek yerel Twig ile boş/dolu ayar dalları | Platformun ayar çıktısı |

2026-09-19. Dal: fix/platform-uyum-01. Bu sorunların kaynağı tema kodudur; platform, mağaza ayarı veya canlı kaynak değiştirilmedi. Canlıya yükleme yapılmadı.

## Konum, neden ve bağlantı

- FOOT1: `canlitema/moduller/footer.twig` içindeki üç `.title`, `assets/scripts.js` içindeki `mobileFooterToggle`, `assets/style.css` içindeki footer başlıkları. Eski div sadece click alıyordu; `<991` JS sınırı CSS `max-width:991px` ile ayrışıyor ve inline display masaüstünde kalıyordu. Mevcut f1/f2/f3 sınıfları korunur. `tests/footer-groups.cjs` kullanıcı tuşu ve ekran geçişini uygular.
- FORM1: `canlitema/assets/scripts.js:showAlert`; `Platform Dosyaları/template-assets/plugins/bootstrap.js` içindeki SweetAlert ve platform ajaxFormGate akışı. Promise kapanışı eski kontrolü geri odaklamıyordu. Veri/istek/giriş/ödeme algoritması değiştirilmedi. `tests/form-error-focus.cjs` ağ erişimini engeller; callback değerini ve başka açık modalı da kontrol eder.
- ASSET2: `style.css` altı `___shuttle` URL'si. Hedefler `resimler1/bg-resmi10.png` ve `assets/images/masaustu-banner/transparan-arka-plan.webp`. CSS'nin assets dizininden çözülmesi korunur; sorgu dizeleri değişmez. ZIP salt okunur açıldı. Canlı kopyaların eşitliği iddia edilmiyor.
- A11Y8: `moduller/header.twig` logo, arama ve `.mobile-menu-close`; platformun class/data seçicileri korunur. Arama gönderim alanı `k` değişmez.
- FOOT2: `moduller/footer.twig` Facebook/Twitter/Instagram/YouTube/LinkedIn/Pinterest `ayarlar()` koşulları. Boş URL işlev değildir; tanımlı altı bağlantı ve mevcut TikTok korunur.

## Yerelde tamamlanan ve doğrulananlar

- Yukarıdaki somut onarımlar; footer ve form odak testleri geçti.
- Önceki giriş/parola/menü/favori/varyant/kargo/kart kontrolleri: `tests/platform-uyum-01.cjs` geçti. Gerçek platform istekleri engelli, yanıtlar sentetik.
- `tests/twig-local.php`: 165 şablon yerel Twig 3.29.0 ile ayrıştırıldı, hata yok. Bu sürümün Qukasoft sürümü olduğu iddia edilmiyor.
- `tests/page-fixtures.php`: sosyal giriş ve footer boş/dolu ayar koşulları gerçek yerel Twig ile doğrulandı. Yeniden üretim görüntü kabulünü otomatik işaretlemez.
- Son footer değişikliğinin içerik birleşimi 375/768/1440 görüntüleri gerçekten açıldı. Logo/dil verisi ve bazı mobil dış görseller yerel birleşimde temsil edilmiyor. Diğer sekiz sayfanın önceki görsel kontrolü 07 raporunda; son değişiklik sonrası bütün sayfaların tekrar görsel kabulü yapılmış sayılmaz.

## Yerelde yapılabilecek kalan işler

- Mobil kapalı panellerin klavye erişimi, açma/kapama odağı ve başka panel/modal ile etkileşimi.
- Envanterde yalnız listelenmiş/incelemesi sınırlı şablonlar; ayar kombinasyonlarının kalan dalları; uzun/boş/hatalı tam sayfa etkileşimleri.
- Son değişikliklerden sonra tam sayfa görsellerinin güncel kabulü; kart görüntüsü bütün sayfayı onaylamaz.
- Başlangıca göre işlev kaybı incelemesinin kalan dosyaları. Kapsamlı denetim bitmedi.

## Yalnız platformda doğrulanabilecekler

- İki eski JS'nin gerçek yüklenme ve Twig işlenme yolu; aktif blok ayarları, Network Initiator/Response. Dosyalar korunuyor.
- Gerçek varyant/fiyat/stok/kargo, kupon, favori, üyelik/2FA/returnUrl, ödeme ve SEO çıktısı. Yerel taklit bunların kabulü değildir.
- LAYOUT1 sabit sepet CTA/alt menü ve çift CTA: gerçek etkin modül birleşimi bilinmiyor; gerekli satın alma düğmesi kaldırılmadı.
- Ayrı tema içe aktarmada opaque `modul_yerlesimi.config` izolasyonu. Salt ZIP oluşması veya ayrı metadata kimliği izolasyon kanıtı değil.

## Önceki onarımlarda işlev kaybı incelemesi

Başlangıç `4b759df` ile `sepet/ozet.twig`, `urunler/kart_favori_listesi.twig` farkı ve mevcut ürün profilindeki kargo/indirim dalları incelendi. Kargo mesajı ve ürün bağlantısı korunmuş, sabit 500 TL yerine platform helper'ı kullanılmıştır. Sayısal oran için doğrulanmış platform verisi olmadığı için eksik kargo durumunda uydurma yüzde çubuğu geri eklenmedi; ücretsiz durumda %100 korunur. Favori ekleme korunmuş, doğru ürün kimliği ve kaldırma durumu eklenmiştir. Profilde platform sabit/havale indirim dalları duruyor. Bu sınırlı karşılaştırma bütün geçmiş değişikliklerin işlev kaybı kabulü değildir; giriş/ödeme önceki yerel regresyonları geçti, gerçek platform kabulü açık.
