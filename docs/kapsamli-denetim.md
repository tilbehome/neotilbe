# Tam tema denetimi ve onarım kaydı

## Hedef ve çalışma kuralları

Mevcut tasarım kimliğiyle bütün temanın onarımı; yeni özellik ve yeni tasarım yok. Dal `fix/platform-uyum-01`; main ve canlı mağaza değiştirilmeyecek. Platform/orijinal/örnek dosyalar referanstır, değiştirilmez ve çekirdek temaya kopyalanmaz. İlk rapordaki bulgular başlangıçtır.

**Tamamlanma durumu: devam ediyor.** Gerçek Qukasoft kabulü bekleyen kritik akışlar vardır. Bir dosyanın kaynak taramasından geçmesi bütün davranışlarının doğrulandığı anlamına gelmez. Önceki üç düzeltme korunmuştur; çevrimdışı tarayıcı regresyonu ayrıca çalıştırılır.

## İzleme biçimi

Envanter aşamaları ayrı tutulur: **listelendi**, **incelendi (belirtilen kapsam)**, **düzeltildi**, **yerelde doğrulandı**, **platformda doğrulama bekliyor**. İncelenmeyen dosya yalnız listelendi durumundadır. Eski sorun kayıtlarının kontrol edildi/düzeltildi ve doğrulandı ifadelerinde K = kaynak, Y = yerel ayrıştırma/sentetik veri, T = çevrimdışı gerçek tarayıcı, Q = gerçek Qukasoft. K/Y/T başarısı Q kabulü değildir. Dosya geneli tamamlandı sonucu çıkarılmaz.

`tema-envanteri.md` ve `tema-envanteri.json` tüm 361 tema dosyasını tek tek listeler: boyut, hash, sabit şablon bağları, satırlı inceleme sinyalleri ve ayrıştırma sonucu. Her sayfa, modül, yardımcı, varlık ve ayar kapsam içindedir. Envanterdeki sinyaller otomatik hata hükmü değildir. Dosyanın tüm durumları tamamlanmadan dosya geneline yeşil durum verilmez.

## Akış envanteri ve kabul matrisi

Her satır için masaüstü 1440, tablet 768 ve mobil 375 px; klavye/odak, console, yinelenen istek, yükleniyor/başarısız/tekrar durumları ayrıca kontrol edilecek. Gerçek cihaz Safari/Chrome ve canlı fontlar/sürüm sırası yerel tarayıcıdan farklı olabilir.

| Akış / envanter kümesi | İncelenecek durumlar | Durum / eksik kanıt |
|---|---|---|
| Ana şablon, header/footer, ayarlar | Miras, bloklar, inject sırası, head/footer tekrarı, farklı ayarlar | doğrulama bekliyor: K mevcut; Q render ve sürüm sırası yok |
| Ana sayfa / özel modüller | Boş vitrin, uzun adlar, çoklu modül, slider, sayaç/video | doğrulama bekliyor: render/yerleşim ve kampanya ayarları |
| Kategori / filtre / sayfalama | Boş sonuç, hatalı filtre, AJAX hata/tekrar, liste görünümü | doğrulama bekliyor: K bağımlılık taraması; T/Q akışı |
| Masaüstü/mobil arama | Boş sorgu, öneri, özel karakter, sonuç yok, ağ hatası | doğrulama bekliyor: gerçek autocomplete yanıtı |
| Ürün / varyant / stok / fiyat | 0/1/2/3 varyant, stok dışı, fiyat farkı, KDV, miktar sınırı | doğrulama bekliyor: Q ürün veri örnekleri |
| Ürün resimleri / video / taksit | Resim yok, değişen varyant, büyütme, taksit yok/farklı vade | doğrulama bekliyor: koşullu HTML ve modal/render |
| Favori / koleksiyon / alarm | Misafir, üye, ekle/kaldır, tekrar, hata, boş liste | doğrulama bekliyor: oturum ve sunucu yanıtları |
| Sepete ekle / hızlı sepet / hemen al | Eksik varyant, stok sınırı, tekrar tıklama, yönlendirme | doğrulama bekliyor: Q; yerel kaynak bağı korunuyor |
| Sepet / mini sepet | Boş/dolu, sil/güncelle, miktar ondalığı, başarısız yanıt | doğrulama bekliyor: Q özet ve değişim olayları |
| Kupon / promosyon / hediye | Geçerli/geçersiz/süresi dolmuş, iptal, birleşim, tutar | doğrulama bekliyor: gerçek kampanya sözleşmesi |
| Kargo | Ücretli/ücretsiz, ülke/adres/firma değişimi, bayi | doğrulama bekliyor: mağaza kargo kuralları |
| Ödeme adres / yöntem / sözleşme | TC ayarı, farklı fatura, boş/hatalı alan, geri/ileri, yöntem hatası | doğrulama bekliyor: test ortamı; gerçek ödeme yapılmaz |
| Giriş / kayıt / parola / iki faktör | Yanlış/doğru giriş, dönüş URL, modal, kod hatası, reset | doğrulama bekliyor: önceki düzeltmeler K/T geçti; Q yok |
| Hesap bilgileri / adresler / API / 2FA | Görüntüleme, boş/hata/izin, doğrulama mesajları | doğrulama bekliyor: test hesabı; gerçek müşteri değişikliği yok |
| Sipariş / takip / destek / havale | Boş/geçersiz numara, başarısız yanıt, detay, ek dosya | doğrulama bekliyor: sentetik sipariş/test ortamı |
| Bayi / cüzdan / bakiye / çek | Yetkisiz/boş/dolu, yöntem ve tutar durumları | doğrulama bekliyor: bayi ayarı/test verisi; gerçek para işlemi yok |
| Blog / marka / yardım / içerik / 404 | Uzun/boş içerik, bağlantı, başlıklar, form | doğrulama bekliyor: tüm render çıktıları |
| Menüler / modallar / overlay | X/arka plan/Escape, odak dönüşü, birden çok panel | doğrulama bekliyor: kaydırma K/T doğrulandı; erişilebilirlik/Q devam |
| SEO / yapılandırılmış veri | Title/meta/canonical/robots tekrarı, H1, gerçek veri | doğrulama bekliyor: Q head/HTTP yanıtı yok; sahte veri kaynakları tarandı |
| Erişilebilirlik / görsel düzen | Etiketler, isimler, tab sırası, kontrast, taşma, zoom | doğrulama bekliyor: tüm sayfa/device/tema ayarları |
| Performans / kaynak / güvenlik | LCP/CLS, font/görsel boyutu, cache, raw/JS interpolasyon | doğrulama bekliyor: K sinyalleri var; Q ağ ölçümü ve veri bağlamı |

## Düzeltme grupları

1. **G01 korunacak:** platform giriş fonksiyonu, şifre izolasyonu, menü kilidi. Önceki commitler 9758773 / 26e4395 / 1f8498c; kontroller 0416c43.
2. **G02 satış verisi ve HTML:** taksit vadesi, kargo ücretinin geri bağlanması, fiyat grubu koşullu HTML, mobil arama kapanışı, zorunlu TC sözleşmesi. Kanıtı olan değişiklikler; ayar değerini tahmin etme.
3. **G03 doğruluk/SEO:** uydurma favori/satış sayıları ve sabit sipariş durumu; gerçek verisi olmayan beyanları kaldır, sayı üretme. Platform head çıktısı görülmeden meta/canonical ekleme.
4. **G04 form/erişilebilirlik:** CSS kapsamı, alan isimleri, klavye kontrolleri, odak ve hata mesajları. 375/768/1440 sentetik tarayıcı kontrolleri; gerçek çıktıyı ayrı takip et.
5. **G05 kaynak/JS yaşam döngüsü:** üç bozuk JS, yinelenen globals/sayaçlar, video başlatma, hardcoded kaynak URL’leri. Etkin modül ve veri sözleşmesi belirsizse bu belirsizliği kaydet; fiyat/indirim algoritması uydurma.
6. **G06 bütün kalan akışlar:** envanterdeki her satırın kaynak ve koşul incelemesi, Q kabulü, görsel/performans/güvenlik kapanışı. Önceki grupların tamamlanması bu grubu kaldırmaz.

## Sorun kaydı

Son tur: [platform-uyum-06-kontrol.md](platform-uyum-06-kontrol.md); önceki [05 turu](platform-uyum-05-kontrol.md). Video/favori/form/kategori/yardım/ödeme metni ve hediye çeki onarımları, gerçek yerel Twig ayrıştırması ve sınırları bu raporda kayıtlıdır. Önceki tur durumları aşağıdaki tek güncel kayıtta birleştirildi.

Güncel durumun tek kaynağı `sorun-durumlari.json`; aşağıdaki tablo bu kayıttan üretilir. Önceki raporlar tarihsel kanıttır, güncel açık/kapalı durum için bu tablo geçerlidir.

<!-- CURRENT_ISSUES_START -->
| Sorun | Konum | Onarım / gereken iş | Tek güncel durum | Kanıt |
|---|---|---|---|---|
| G01-1 | giris_yap.twig:165 eski özel userLogin platformu eziyordu | Override kaldırıldı; AJAX çağrısı, returnUrl ve sentetik 2FA callback T | düzeltildi ve doğrulandı (K/T); Q bekliyor | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| G01-2 | giris_yap.twig:150 global name seçicisi yanlış parolayı açıyordu | En yakın kapsayıcı; üç alan T | düzeltildi ve doğrulandı (K/T) | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| G01-3 | scripts.js:8 eski kapatma scroll kilidini bırakıyordu | Ayrı kilit sahipliği; X/overlay/hesap/modal T | düzeltildi ve doğrulandı (K/T); Q bekliyor | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| K3 | profil.twig:165 sabit 12 taksit, gerçek vade farklı olabilir | Belgede vade/aylik s.36; platform vade alanını göster | düzeltildi ve doğrulandı (K/T sentetik vade); Q bekliyor | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| K4 | odeme/bilgiler/kargo_icerik.twig:35 ücretli dal boş | Orijinaldeki firma.ucret alanını tasarıma bağla | düzeltildi ve doğrulandı (K: orijinal firma.ucret); Q bekliyor | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| H1 | profil.twig:159–186 taksit wrapper kapanışı koşul dışında; taksit yokken fazla div kapanır | Kapanışı aynı if dalına taşı; iki koşul DOM kontrolü | düzeltildi ve doğrulandı (K/T: dört koşul) | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| H2 | header.twig:226 arama button kapanışı eksik | İki ayrı button; isim ve form semantiği korunacak | düzeltildi ve doğrulandı (K/T: iki ayrı GET düğmesi); Q arama bekliyor | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| S1 | odeme/bilgiler/adres.twig:11 TC alanı kaldırılmış | Belge s.8 tc_alani_zorunlu_mu; ayara bağlı alan, Q hata hedefi | düzeltildi ve doğrulandı (K/T: zorunlu ayar dalı); Q kabulü bekliyor | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| K5 | style.css:12784 aynı element sınıfları descendant yazılmış | Bileşik selector; alan etkilerini T ölç | düzeltildi ve doğrulandı (T: 375/768/1440 giriş fixture) | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| D1 | sepet/liste.twig:94 ürün ID’sinden sahte favori sayısı | Gerçek veri yoksa sayısal beyanı kaldır | düzeltildi ve doğrulandı (K: sahte sayı kaldırıldı) | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| D2 | assets/urun-fav-sayma-eklenti.js:1 rastgele favori/sepet/görüntüleme/satış | Rastgele üretimi kaldır; gerçek kaynak olmadan göstermeme | düzeltildi ve doğrulandı (K/Y: üretim kaldırıldı, dosya yolu korundu) | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| D3 | statik_sayfalar/alt_sayfalar/siparis_takip.twig:21 henüz sorgu yokken OrderProcessing ilanı | Veri olmayan Order şemasını kaldır; formu koru | düzeltildi ve doğrulandı (K: verisiz Order bildirimi kaldırıldı) | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| S2 | sepet/ozet.twig:15–19,63 biçimli fiyatla matematik, sabit kargo | Üç bileşende platform kargo helper alanları kullanılıyor; bağımsız toplam/yüzde kaldırıldı. | onarım uygulandı; yerelde doğrulandı; platform kabulü bekliyor | platform-uyum-03-kontrol.md |
| K7 | sepet/liste.twig:12–22 satır ID ve koşulsuz kampanya vaadi | Gerçek ürün ID ve kampanya sonucunu ayır; mağaza kuralı gerekli | düzeltildi ve doğrulandı (K: ürün ID, tarafsız adet mesajı); kampanya Q bekliyor | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| K6 | assets/cok-al-az-ode-indirim.js:22, tahmini-kargom.js:22, yt-video-kontrol-02.js:1 | Statik JS’de Twig/script etiketi; veri bağlantısı/etkinlik doğrulanmalı | doğrulama bekliyor: video dosyası Y/T düzeltildi; iki fiyat JS dosyası açık | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| S3 | video-listeleme.twig:71–75 defer sonrası hemen global Swiper | Mevcut Swiper Element kaydı bekleniyor; global kurucu kaldırıldı. | onarım uygulandı; yerelde doğrulandı; gerçek Swiper/Q kabulü bekliyor | platform-uyum-03-kontrol.md; platform-uyum-05-kontrol.md |
| S4 | header.twig ve birçok dosyada /theme/___shuttle URL | Mevcut varlığı helper’a bağla; olmayan dosyayı icat etme | 37 bağlantıda onarım/yerel doğrulama; diğer dinamik/CSS yolları açık | tema-kaynak-baglari.json; onizleme-hazirligi.md |
| S5 | scripts.js completeBeforePaymentStep; çekirdek completePaymentStep | Çift dosya gönderimi kaldırıldı; referans completePaymentStep tek FormData isteği. | onarım uygulandı; yerelde doğrulandı; platform kabulü bekliyor | platform-uyum-03-kontrol.md |
| A1 | giris_yap.twig göz simgeleri i/onclick | Klavye ve erişilebilir ad; görünümü koruyan kontrol | düzeltildi ve doğrulandı (T: native Enter/Space, aria-pressed) | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| A2 | ödeme ve sipariş takip form etiketleri | ID/label bağları, hata odağı, uzun değerler | doğrulama bekliyor: ödeme/takip label bağları K onarıldı; diğer formlar/odak devam | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| J1 | profil.twig:527 ve diğer sayaç global isimleri | Ürün sayacı her campaignTimerDiv içinde; global adlar kaldırıldı; kargo takvimi uydurulmadı. | sayaç kapsam/DOM onarıldı; yerel eksik DOM kontrolü geçti; takvim/veri kabulü açık | platform-uyum-05-kontrol.md |
| B1 | sepet/liste.twig ürün hücresi: p-info/product/td kapanışları eksik | İki div ve td kapatıldı; kaynakta satır konteyner dengesi Y | düzeltildi ve doğrulandı (K/Y); gerçek sepet görünümü Q bekliyor | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| B2 | sepet/liste.twig quantity input data-value-type; referans productQuantityBox data-quantity-type okuyor | Referansın okuduğu niteliğe bağlandı; gerçek referans yardımcıyla 1.5→1.6→1.5 T | düzeltildi ve doğrulandı (K/T); diğer birim/min/max kuralları Q bekliyor | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| C1 | kart_degerlendirmeler.twig:8,30 Bootstrap 5 me/ms yardımcıları, referans Bootstrap 4 | mr-2/ml-2 ile mevcut pakete bağlandı K | düzeltildi ve doğrulandı (K); canlı kütüphane sürümü Q bekliyor | ilk-inceleme.md (ilk tespit); önceki kontrol raporları |
| F1 | kart_favori_listesi.twig:1 kart urun.ID yerine sayfaBilgileri ID kapsayıcısı; orijinalde de var | urun.ID, kanonik favori listesinden ilk durum ve ekle/kaldır kontrolleri. | onarım uygulandı; yerel callback doğrulandı; helper/performans Q kabulü bekliyor | platform-uyum-05-kontrol.md |
| D4 | sepet/liste.twig rezervasyon rozeti, profil.twig sabit 500 TL ve kargo sayacı | 500 TL platform helperına bağlandı; sepet rezervasyon iddiası kaldırıldı. Teslimat/saat takviminin mağaza dayanağı açık. | kargo tutarı onarıldı ve yerelde doğrulandı; diğer beyanlar/platform kabulü bekliyor | platform-uyum-05-kontrol.md; platform-uyum-06-kontrol.md |
| V1 | urunler/profil.twig ve hizli_sepet_kutusu.twig | Varyant değeri JS dizgesinden data niteliğine taşındı | onarım uygulandı; yerelde doğrulandı (rapordaki kapsam); platform kabulü bekliyor | platform-uyum-03-kontrol.md |
| F2 | hesap/alt_sayfalar/favori_listem.twig | data-user-product-id geri bağlandı | onarım uygulandı; yerelde doğrulandı (rapordaki kapsam); platform kabulü bekliyor | platform-uyum-03-kontrol.md |
| A3 | uyelik/sifre_yenileme.twig; sifremi_unuttum.twig | Alan erişilebilir adları | onarım uygulandı; yerelde doğrulandı (rapordaki kapsam); platform kabulü bekliyor | platform-uyum-03-kontrol.md |
| A4 | footer.twig; flash-urunler-hots.twig | Alan/bağlantı/alternatif adlar ve telefon anchor kapanışı | onarım uygulandı; yerelde doğrulandı (rapordaki kapsam); platform kabulü bekliyor | platform-uyum-04-kontrol.md |
| D5 | flash-urunler-hots.twig; footer.twig | Sahte satış/izleyen sayaçları yerine stok alanı | onarım uygulandı; yerelde doğrulandı (rapordaki kapsam); platform kabulü bekliyor | platform-uyum-04-kontrol.md |
| M2 | footer.twig; style.css | Kategori dialog odağı ve ayrı kaydırma kilidi | onarım uygulandı; yerelde doğrulandı (rapordaki kapsam); platform kabulü bekliyor | platform-uyum-04-kontrol.md |
| VM1 | video-listeleme.twig; assets/video-gallery.js; style.css | Çoklu örnek, klavye/odak, iframe temizleme ve modal CSS | onarım uygulandı; yerelde doğrulandı (rapordaki kapsam); platform kabulü bekliyor | platform-uyum-05-kontrol.md |
| A5 | 11 üyelik/hesap/iletişim/havale form şablonu | Etiket-kontrol bağlantıları ve iletişim başlık kapanışı | onarım uygulandı; yerelde doğrulandı (rapordaki kapsam); platform kabulü bekliyor | platform-uyum-05-kontrol.md |
| CAT1 | kategoriler/sayfalama.twig | Platform sıralama listesi; JS kaçışı; sınırlı grid class değişimi | onarım uygulandı; yerelde doğrulandı (rapordaki kapsam); platform kabulü bekliyor | platform-uyum-05-kontrol.md |
| SEO1 | statik_sayfalar/404.twig; alt_sayfalar/havale_bildirim.twig | Yanlış ana sayfa URL iddiası ve gerçekleşmemiş ödeme action metadatası kaldırıldı | onarım uygulandı; yerelde doğrulandı (rapordaki kapsam); platform kabulü bekliyor | platform-uyum-05-kontrol.md |
| HELP1 | yardim/madde_listesi.twig; arama_formu.twig | Modül ve rol bazlı tekil accordion ID/hedefleri | onarım uygulandı; rapordaki yerel kontroller geçti; platform kabulü bekliyor | platform-uyum-05-kontrol.md |
| ACC1 | hesap/alt_sayfalar/hediye_ceklerim.twig; hediye_ceki/kart.twig | Kopyala parent olayının boşa ve çift çağrısı kaldırıldı | onarım uygulandı; rapordaki yerel kontroller geçti; platform kabulü bekliyor | platform-uyum-05-kontrol.md |
| PAY1 | hesap/icerik.twig; odeme/bilgiler/odeme.twig | Hata mesajı JS kaçışı ve ödeme tab ARIA ilişkisi | onarım uygulandı; rapordaki yerel kontroller geçti; platform kabulü bekliyor | platform-uyum-05-kontrol.md |
| A6 | sepet/ajax_liste.twig; fiyat/stok alarm listeleri; profil/hızlı favori | Ürün adıyla erişilebilir kontrol isimleri | onarım uygulandı; kaynak kontrolü; tarayıcı/ekran okuyucu kabulü açık | platform-uyum-05-kontrol.md |
| PV1 | urunler/resim_alani_tipi/carousel_sol.twig; assets/scripts.js | Video öğe izolasyonu, play hata/tekrar yönetimi ve tek ok çifti | onarım uygulandı; rapordaki yerel kontroller geçti; platform kabulü bekliyor | platform-uyum-05-kontrol.md |
| PROMO1 | sepette-1000-tl-75-indirim.twig:1 | Sabit indirim matematiği yerine platform özetinin indirim bayrağı | onarım uygulandı; rapordaki yerel kapsam doğrulandı; platform kabulü açık | platform-uyum-06-kontrol.md |
| MENU1 | moduller/diger/mega_menu.twig:54; style.css:6005 | Koşullu sütun kapanışı, görsel adı ve focus-within klavye erişimi | onarım uygulandı; rapordaki yerel kapsam doğrulandı; platform kabulü açık | platform-uyum-06-kontrol.md |
| CARD1 | urunler/kart.twig; kat-ozel-kart.twig | Stok dışı native disabled kontrol, görsel/kontrol adları | onarım uygulandı; rapordaki yerel kapsam doğrulandı; platform kabulü açık | platform-uyum-06-kontrol.md |
| CSS2 | assets/style.css:8735 | Açık fonda beyaz stok metni #333 ile okunur oldu | onarım uygulandı; rapordaki yerel kapsam doğrulandı; platform kabulü açık | platform-uyum-06-kontrol.md |
| SHIP1 | odeme/bilgiler/kargo_icerik.twig:3 | Radio tıklamasında çift change engellendi | onarım uygulandı; rapordaki yerel kapsam doğrulandı; platform kabulü açık | platform-uyum-06-kontrol.md |
| GALLERY2 | urunler/resim_alani_tipi; atli_karinca_resim.twig; carousel_atli_karinca.twig | Etiket makrosuna tam ürün nesnesi | onarım uygulandı; rapordaki yerel kapsam doğrulandı; platform kabulü açık | platform-uyum-06-kontrol.md |
| HELP2 | yardim/madde_listesi.twig; assets/scripts.js | Eski yardım fragment hedefleri korundu | onarım uygulandı; rapordaki yerel kapsam doğrulandı; platform kabulü açık | platform-uyum-06-kontrol.md |
| SB1 | assets/smartbanner.js; sablon.twig | HTML metin kaçışı, pushSelector ve mevcut transition helperını koruma | onarım uygulandı; rapordaki yerel kapsam doğrulandı; platform kabulü açık | platform-uyum-06-kontrol.md |
| HTML2 | odeme/siparis_onayi.twig; kategoriler/filtreleme/fiyatlar.twig | Başlık kapanışı ve fiyat kontrol adları | onarım uygulandı; rapordaki yerel kapsam doğrulandı; platform kabulü açık | platform-uyum-06-kontrol.md |
| JS2 | urunler/hizli_sepet_kutusu.twig; siparislerim.twig; bakiye_dekontu.twig | Biçimli fiyat JS kaçışı; sipariş/yazdırma metnini data niteliğiyle taşıma | onarım uygulandı; rapordaki yerel kapsam doğrulandı; platform kabulü açık | platform-uyum-06-kontrol.md |
| CSS3 | canlitema/assets/style.css; başlangıç satırları css-temizlik-kaniti.json | Aynı medya kapsamındaki tekrarlar, ezilen ve geçersiz bildirimler kaldırıldı; Gold cascade korundu | onarım uygulandı; 11 genişlikte yerel cascade doğrulandı; tam sayfa/platform görsel kabulü açık | css-denetimi.md; css-cascade-results.json |
| PV2 | profil.twig; carousel_sol.twig; assets/product-video-popup.js | Alternatif video X hatası, odak/scroll/temizleme ve ekran dışı kapanış kontrolü onarıldı | onarım uygulandı; yerelde doğrulandı; platform kabulü bekliyor | platform-uyum-07-kontrol.md |
| CSS4 | assets/style.css: footer mobil siyah important kuralı | Koyu fondaki çalışma saatine mevcut açık footer rengi döndü | onarım uygulandı; yerelde doğrulandı; platform kabulü bekliyor | platform-uyum-07-kontrol.md |
| LOGIN2 | uyelik/giris_yap.twig sosyal giriş kapsayıcıları | Sağlayıcılar kapalıyken boş sosyal giriş alanı gösterilmiyor | onarım uygulandı; yerelde doğrulandı; platform kabulü bekliyor | platform-uyum-07-kontrol.md |
| LAYOUT1 | Platform Dosyaları/template-assets/style.min.css; footer.twig; sepet/ozet.twig; sepet/butonlar.twig | Mobil sabit CTA ve alt navigasyon örtüşmesi; etkin blok yerleşimi/gerçek DOM gerekli | yerel birleşimde görüldü; platformda doğrulama bekliyor | platform-uyum-07-kontrol.md |
<!-- CURRENT_ISSUES_END -->

## Platformla kesinleştirilmesi gerekenler

- Qukasoft test teması/önizleme adresi, test hesabı ve sentetik ürün/siparişler; iki faktör ve bayi senaryoları. Parola/token rapora yazılmaz. Bunların olup olmadığı kullanıcıya soruldu.
- Canlı platform CSS/JS sürümleri, inject sırası, varsayılan şablon/SEO etiketleri ve aktif modül yerleşimi. Yerel bootstrap.js 4.4.1/jQuery 3.6.3 kanıtı canlı sürüm kanıtı değildir.
- Aktif TC zorunluluğu, KDV gösterimi, kargo eşikleri, para birimi ve kampanya koşulları; helper çıktılarının ham/biçimli türleri. Örneğin template.pdf s.27 kargo_ucret_var_mi yazarken temalar kargo_ucreti_var_mi kullanıyor: sırf belgeye göre topluca yeniden adlandırılmayacak.
- Değerlendirme fotoğrafı, sosyal kanıt sayıları, kargoya teslim saatleri için gerçek veri kaynağı. Sayı/tarih üretmek çözüm değildir.

Kritik akışlar Q kabulü olmadan **tema tamamlandı** denmeyecek. Harici erişim gerektirmeyen kesin kaynak kusurları sırayla onarılmaya devam edilir.
