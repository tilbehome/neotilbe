# Kalan şablonlar, kargo olayı ve kart görsel kontrolü

19.09.2026 — 05 turundan sonra aynı dalda sürdürülen inceleme. Bu rapor tam tema kabulü değildir. Güncel durum `sorun-durumlari.json` içindedir.

## Yerelde tamamlanan ve doğrulananlar

| Sorun | Konum / tetiklenme / etki | Dayanak, onarım ve kanıt |
|---|---|---|
| PROMO1 | `canlitema/sepette-1000-tl-75-indirim.twig:1`: biçimli sepet.fiyat ile bağımsız toplam ve sabit 1000/75 TL hesabı; indirim uygulanmadığında uygulanmış mesajı | Platform sepet özeti `indirim_var_mi` mevcut `sepet/hediye_ceki.twig` sözleşmesidir. Matematik/sabit para birimi kaldırıldı; mevcut kutu platform özetine yönlendiren doğru metni gösterir. Dosya silinmedi; aktif modül yerleşimi bilinmiyor. Gerçek yerel Twig indirim var/yok dalları geçti; gerçek kampanya kabulü yok. |
| MENU1 | `canlitema/moduller/diger/mega_menu.twig:54`: resimli menü açıkken col-md-4 kapanmıyordu | Eksik div tamamlandı; kategori simge/görsel bağlantılarına kategori adı eklendi. Gerçek yerel Twig, mega_menu_resim açık/kapalı div dengesi kontrolü geçti. Canlı uzun kategori/mobil/hover/klavye yerleşimi açık. |
| CARD1 | `canlitema/moduller/urunler/kart.twig`, `kat-ozel-kart.twig`: stok dışı anchor üzerindeki disabled class klavye/JS tıklamasını engellemiyor | Stok dışı kontroller native disabled button oldu; platform addCart stoklu dallarda korundu. Yerel gerçek Twig stoklu/stoksuz dalları, sentetik kart görünümü; gerçek sepet çağrısı yapılmadı. Modal açıcı anchor'a href/ad, miktar ve carousel kontrollerine ad, carousel görsellerine ürün alt metni. |
| CSS2 | `canlitema/assets/style.css:8735` `.card-product .it-over`: yüzde 80 beyaz fon ve beyaz yazı | Kaynak ve üç ekran görüntüsünde görünmez stok metni doğrulandı. Mevcut kuraldaki renk #333, yanıltıcı pointer default oldu; !important eklenmedi. Tarayıcı computed color ve yeni ekran görüntüleri doğrulandı. |
| SHIP1 | `canlitema/moduller/odeme/bilgiler/kargo_icerik.twig:3`: radio native change ile parent onclick'in .change() çağrısı aynı tıklamada iki olay üretiyor | Platform `scripts.min.js` shipment_method dinleyicisi korunur. Parent yalnız input/label dışından gelen tıklamada seçer; radio'nun kendi olayı bırakılır. Yerel tarayıcı radio=1, satır=1 change; firma adıyla erişilebilir ad. Gerçek kargo fiyatı/HTTP isteği denenmedi. |
| DATA1 | `canlitema/moduller/sepet/liste.twig:54`: sepet satırının varlığı stok rezervasyonu kanıtı değil | Kanıtsız rezervasyon iddiası yerine Sepetinizde yazılır; miktar adları ve görsel alt metni eklenir. Platform miktar/sepet fonksiyonları değiştirilmedi. Kaynak incelemesi; gerçek rezervasyon politikası iddiası yok. |
| GALLERY2 | `urunler/atli_karinca_resim.twig:3`, `carousel_atli_karinca.twig:3`, `resim_alani_tipi/normal_altta.twig:4,54`, `resim_alani_tipi/carousel_atli_karinca.twig:3` | Ürün etiketi makrosuna boş anahtar/yalnız ID yerine tam sayfa ürün verisi aktarılır. Dayanak: orjinaltema ve count/panda/lility resim_alani_tipi şablonlarında etiketler(sayfaBilgileri()); kartlarda etiketler(urun). Yerel stub makro gerçek Twig'den ID içeren nesne aldı. Gerçek platform makrosunun render'ı erişim bekliyor. |
| HELP2 | `yardim/baslik_vitrini.twig` eski #accordion-head-ID bağlantıları, `yardim/madde_listesi.twig`, `assets/scripts.js` | 05 turundaki tekil ID onarımına eski fragment uyumluluğu eklendi; başlık data-help-entry-id ile bulunur, tek namespace hash dinleyicisi. Eski bağlantıdan doğru başlığa scrollIntoView tarayıcı kontrolü geçti; platformdan gelen madde.aktif korunur. |
| SB1 | `canlitema/assets/smartbanner.js:8,160,234,426` | Meta/title/options metinlerini HTML dizgesine ham ekleme düzeltildi; yerel img işaretli başlık gerçek düğüm üretmedi. this.pushSelector yerine tanımlı options.pushSelector; yerelde padding hedefi doğrulandı. Platform Bootstrap'in $.fn.emulateTransitionEnd tanımı varsa korunur. Yeni kütüphane/sürüm yok. Kaynak sablon.twig:81,92 üzerinden yüklenir; gerçek mobil mağaza/cookie/kapatma animasyonu kabulü açık. |
| HTML2 | `odeme/siparis_onayi.twig:12`, `kategoriler/filtreleme/fiyatlar.twig` | h5 yanlış h4 kapanışı düzeltildi; min/max fiyat ve uygula düğmesine ad verildi. İsim/seçici/platform hesapları korunur; kaynak kontrolü. Gerçek onay sayfası için sipariş oluşturulmadı. |

## İncelenen kapsam

Küçük kalan Twig dosyaları tek tek okundu: bütün sayfa girişleri, blog/kategori/marka/yardım kartları ve listeleri, filtre AJAX kapları, boş sepet, sözleşme modalları, statik içerik/SSS, hediye çekleri, ürün detay alt blokları, altı özel banner, resim galerileri ve iki ana ürün kartı. Hesap/cüzdan/API dinamik include hedeflerinin kendisi platforma bağlıdır; yerel include satırını okumak gizli şablonun kabulü değildir.

`moduller/sayfam-urun/sayfam-urun.twig` yalnız deneme metni içerir; aktif yerleşimi bilinmediğinden silinmedi. Özel banner linklerinin içerikle eşleşmesi yönetim içeriği/gerçek sayfa kabulü bekler. `sayfalar/*` head blokları okundu; platform head çıktısı görülmeden yeni title/canonical/robots eklenmedi. Admin tarafından sağlanan raw içerikler otomatik olarak açık ilan edilmedi; sanitizasyon/güven sınırı platform doğrulamasında açık.

Smartbanner JS akışı ve CSS kuralları incelendi. CSS'de aynı Android kuralının sonraki beyaz fonla önceki siyah fonu geçersiz kıldığı görüldü; yalnız önceki kuralı okuyarak yanlış kontrast düzeltmesi yapılmadı. Ana style.css'nin tüm görsel kombinasyonları doğrulanmış değildir.

## Yerel kanıt

Ek bağlam kontrolünde `hizli_sepet_kutusu.twig:12` fiyat dizgilerine JS kaçışı uygulandı; gerçek yerel Twig çıktısı tarayıcıda `1'234,50 CHF` olarak kayıpsız okundu. `hesap/alt_sayfalar/siparislerim.twig:23` sipariş numarası ve `bakiye_dekontu.twig:22` yazdırma başlığı/ID'si inline JS dizgesinden data niteliklerine taşındı; mevcut fonksiyon imzaları korunur. Bu iki hesap işlemi kaynak/ayrıştırma düzeyinde kontrol edildi, gerçek iptal/yazdırma yapılmadı.

`style.css:6005,6034` masaüstü menüsü yalnız hover ile açılıyordu; alt bağlantı odağını da kapsayan focus-within mevcut kurala eklendi. 1440 px tarayıcı fixture'ında ana bağlantı ve alt bağlantı odağında menü açık kaldı. Footer kategori bağlantı/düğmeleri ve masaüstü menüye scoped focus-visible çizgisi eklendi; yeni !important yok. `sablon.twig:81–92` geçersiz script kendiliğinden kapanışı düzeltildi; isteği başarısız optional Smartbanner ana sayfa kodunu düşürmesin diye fonksiyon varlık kontrolü eklendi.

CSS kaynak taraması: ana dosya yaklaşık 15.500 satır ve 201 mevcut !important içeriyor; Smartbanner 3 içeriyor. Tek göreli CSS URL'si `images/select-arrow.svg` yerelde var. Bu sayılar kalite kabulü değildir. Contact-form focus kuralının outline'ı kaldırırken border/shadow sağladığı görüldü; her outline:0 otomatik hata sayılmadı. Genel body/html overflow-x:hidden tam sayfa taşmasını gizleyebileceğinden gerçek sayfa kabulünde öğe sınırları ayrıca ölçülmeli.

- `php tests/twig-local.php <geçici vendor/autoload.php>`: 165 kaynağın Twig 3.29.0 ayrıştırması; özel helper'lar stub. Kart stokları, platform indirim bayrağı, ürün makro nesnesi ve menü resimli/resimsiz dalları render edildi. Motor Qukasoft sürümü değildir.
- `node tests/platform-uyum-01.cjs`: önceki regresyonlar, eski yardım fragment'i, kargo radio/satır olayı, Smartbanner metin/yardımcı/hedef kontrolleri geçti. HTTP/HTTPS engelli. PHP çıktıları varsa kart görüntüleri üretilir; yoksa açık NOT RUN yazar.
- `artifacts/visual-05/cards-375.png`, `cards-768.png`, `cards-1440.png` gerçekten açılıp incelendi. Gerçek Twig kartı, kaynak tema renk ayarları, yerel Bootstrap/platform/tema CSS, sentetik uzun başlık ve açıkça belirtilen SVG yer tutucu kullanıldı. Resimler decode olmadan görüntü alınmıyor. Görünen cevir anahtarları/font ikonları platform dil/font çıktısı değildir. Tam sayfa/kategori/gerçek görsel/gerçek font kabulü değildir. Stok rozetindeki beyaz yazı hatası bu kontrolde bulunup düzeltildi; yatay viewport taşması yok.

## Yerelde yapılabilecek kalan işler

- Tam header/footer/sepet/ödeme/ürün sayfa birleşimlerinin görsel fixture'ları, klavye ve farklı ayar kombinasyonları; tek kart veya modal görüntüsü bunları doğrulamaz. Platformun varsayılan blok/makro HTML'si yerelde olmadığı için sentetik örnekler sınırlıdır.
- Ana style.css global selector/özgüllük ve bütün renklerin kontrast incelemesinin kalan bölümü; Smartbanner/mobile üst boşluk animasyonlarının gerçek CSS ile ayrıntılı fixture'ı; video popup'ın alternatif yükleme yolundaki odak davranışı.
- Tema ayarlarının her dalının ve resim kaynaklarının kullanılma/CLS boyutlarının bağlamlı denetimi; envanter hash/boyut kontrolü görsel kalite kabulü değildir.
- Referans ajaxFormGate hata yolunda yalnız showAlert(message) var, alan bazlı hata şeması yok. Form hata odağını platform modal davranışını ezmeden tamamlamak için gerçek hata/DOM örneği gerekli; tema bu yanıtı tahmin ederek yeniden yazmadı.

## Platform veya ayar kanıtı gerektirenler

- K6 iki eski JS hâlâ korunur ve iki syntax hatası açıktır. Yükleme/işlenmiş Response/Initiator ve etkin modül adı/dosya ayarları için 04 raporundaki kesin liste uygulanmalı. Opaque `.config` nedeni ile aktif kullanım kanıtlanamadı.
- Ürün kargo saatleri/tatil takvimi ve teslimat beyanları; geçerli kampanyalar, platform indirim/kargo/favori helper alanları; userCancelOrder'un canlı tanımı. Yerel scripts.min.js kopyasında userCancelOrder tanımı bulunmadı; temada yeni iptal API'si yazılmadı.
- B2B sıralama *_base alanı ve fatura alan gruplarının beklenen yapısı; gerçek test hesabı/verisiyle form hataları, 2FA, ödeme ve kupon kabulü. Gerçek müşteri/sipariş/ödeme işlemi yapılmaz.
- Canlı yükleme sırası/sürüm, SEO head/HTTP, medya/Swiper/Fancybox/Bootstrap birlikte davranışı, gerçek LCP/CLS ve bütün sayfaların cihaz kontrolü.

Bu gruptan sonra da **tema tamamlandı denmez**. Kaynak incelemesi, yerel render/tarayıcı ve Qukasoft kabulü farklı aşamalardır. Önizleme adayı yalnız ayrı kimlikli yerel arşivdir; etkin tema veya bağımsız test mağazası değildir.
