# Tam tema denetimi ve onarım kaydı

## Hedef ve çalışma kuralları

Mevcut tasarım kimliğiyle bütün temanın onarımı; yeni özellik ve yeni tasarım yok. Dal `fix/platform-uyum-01`; main ve canlı mağaza değiştirilmeyecek. Platform/orijinal/örnek dosyalar referanstır, değiştirilmez ve çekirdek temaya kopyalanmaz. İlk rapordaki bulgular başlangıçtır.

**Tamamlanma durumu: devam ediyor.** Gerçek Qukasoft kabulü bekleyen kritik akışlar vardır. Bir dosyanın kaynak taramasından geçmesi bütün davranışlarının doğrulandığı anlamına gelmez. Önceki üç düzeltme korunmuştur; çevrimdışı tarayıcı regresyonu ayrıca çalıştırılır.

## İzleme biçimi

Durumlar: **kontrol edildi**, **düzeltildi ve doğrulandı**, **doğrulama bekliyor**, **uygulanamaz**. Her doğrulamada katman belirtilir: K = kaynak, Y = yerel ayrıştırma/sentetik veri, T = çevrimdışı gerçek tarayıcı, Q = gerçek Qukasoft. Düzeltildi ve doğrulandı (K/Y/T) ifadesi Q kabulü değildir. Henüz kontrol edilmemiş alanlar da gerekçeleriyle doğrulama bekliyor durumundadır.

`tema-envanteri.md` ve `tema-envanteri.json` tüm 360 tema dosyasını tek tek listeler: boyut, hash, sabit şablon bağları, satırlı inceleme sinyalleri ve ayrıştırma sonucu. Her sayfa, modül, yardımcı, varlık ve ayar kapsam içindedir. Envanterdeki sinyaller otomatik hata hükmü değildir. Dosyanın tüm durumları tamamlanmadan dosya geneline yeşil durum verilmez.

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

Satırlar ilk tespit konumlarını kullanır; dosya düzenlendikçe satır kayabilir. Kaynak sembolü/alan adı kalıcı arama dayanağıdır.

| ID / öncelik | Konum / neden / etki | Çözüm / doğrulama | Durum |
|---|---|---|---|
| G01-1 P1 | giris_yap.twig:165 eski özel userLogin platformu eziyordu | Override kaldırıldı; AJAX çağrısı, returnUrl ve sentetik 2FA callback T | düzeltildi ve doğrulandı (K/T); Q bekliyor |
| G01-2 P2 | giris_yap.twig:150 global name seçicisi yanlış parolayı açıyordu | En yakın kapsayıcı; üç alan T | düzeltildi ve doğrulandı (K/T) |
| G01-3 P1 | scripts.js:8 eski kapatma scroll kilidini bırakıyordu | Ayrı kilit sahipliği; X/overlay/hesap/modal T | düzeltildi ve doğrulandı (K/T); Q bekliyor |
| K3 P2 | profil.twig:165 sabit 12 taksit, gerçek vade farklı olabilir | Belgede vade/aylik s.36; platform vade alanını göster | doğrulama bekliyor |
| K4 P2 | odeme/bilgiler/kargo_icerik.twig:35 ücretli dal boş | Orijinaldeki firma.ucret alanını tasarıma bağla | doğrulama bekliyor |
| H1 P1 | profil.twig:159–186 taksit wrapper kapanışı koşul dışında; taksit yokken fazla div kapanır | Kapanışı aynı if dalına taşı; iki koşul DOM kontrolü | doğrulama bekliyor |
| H2 P2 | header.twig:226 arama button kapanışı eksik | İki ayrı button; isim ve form semantiği korunacak | doğrulama bekliyor |
| S1 P1 | odeme/bilgiler/adres.twig:11 TC alanı kaldırılmış | Belge s.8 tc_alani_zorunlu_mu; ayara bağlı alan, Q hata hedefi | doğrulama bekliyor |
| K5 P2 | style.css:12784 aynı element sınıfları descendant yazılmış | Bileşik selector; alan etkilerini T ölç | doğrulama bekliyor |
| D1 P2 | sepet/liste.twig:94 ürün ID’sinden sahte favori sayısı | Gerçek veri yoksa sayısal beyanı kaldır | doğrulama bekliyor |
| D2 P2 | assets/urun-fav-sayma-eklenti.js:1 rastgele favori/sepet/görüntüleme/satış | Rastgele üretimi kaldır; gerçek kaynak olmadan göstermeme | doğrulama bekliyor |
| D3 P2 | statik_sayfalar/alt_sayfalar/siparis_takip.twig:21 henüz sorgu yokken OrderProcessing ilanı | Veri olmayan Order şemasını kaldır; formu koru | doğrulama bekliyor |
| S2 P1 | sepet/ozet.twig:15–19,63 biçimli fiyatla matematik, sabit kargo | Ham/biçimli tür ve kargo helper sözleşmesi Q doğrulaması | doğrulama bekliyor |
| K7 P2 | sepet/liste.twig:12–22 satır ID ve koşulsuz kampanya vaadi | Gerçek ürün ID ve kampanya sonucunu ayır; mağaza kuralı gerekli | doğrulama bekliyor |
| K6 P2 | assets/cok-al-az-ode-indirim.js:22, tahmini-kargom.js:22, yt-video-kontrol-02.js:1 | Statik JS’de Twig/script etiketi; veri bağlantısı/etkinlik doğrulanmalı | doğrulama bekliyor |
| S3 P2 | video-listeleme.twig:71–75 defer sonrası hemen global Swiper | Bileşen modelini doğrula; aktif modül belirsiz | doğrulama bekliyor |
| S4 P2 | header.twig ve birçok dosyada /theme/___shuttle URL | Mevcut varlığı helper’a bağla; olmayan dosyayı icat etme | doğrulama bekliyor |
| S5 P2 | scripts.js completeBeforePaymentStep; çekirdek completePaymentStep | Kargo dosyasının iki ayrı POST yolu; canlı sürüm doğrulanmalı | doğrulama bekliyor |
| A1 P2 | giris_yap.twig göz simgeleri i/onclick | Klavye ve erişilebilir ad; görünümü koruyan kontrol | doğrulama bekliyor |
| A2 P2 | ödeme ve sipariş takip form etiketleri | ID/label bağları, hata odağı, uzun değerler | doğrulama bekliyor |
| J1 P2 | profil.twig:527 ve diğer sayaç global isimleri | Ayrı scope, eksik DOM guard; kampanya tarihleri işletme ayarı | doğrulama bekliyor |
| SEC1 P1 | Twig inline JS ve raw çıktı sinyalleri | Veri kaynağı/kaçış bağlamı ve platform autoescape incelenecek | doğrulama bekliyor |

## Platformla kesinleştirilmesi gerekenler

- Qukasoft test teması/önizleme adresi, test hesabı ve sentetik ürün/siparişler; iki faktör ve bayi senaryoları. Parola/token rapora yazılmaz. Bunların olup olmadığı kullanıcıya soruldu.
- Canlı platform CSS/JS sürümleri, inject sırası, varsayılan şablon/SEO etiketleri ve aktif modül yerleşimi. Yerel bootstrap.js 4.4.1/jQuery 3.6.3 kanıtı canlı sürüm kanıtı değildir.
- Aktif TC zorunluluğu, KDV gösterimi, kargo eşikleri, para birimi ve kampanya koşulları; helper çıktılarının ham/biçimli türleri. Örneğin template.pdf s.27 kargo_ucret_var_mi yazarken temalar kargo_ucreti_var_mi kullanıyor: sırf belgeye göre topluca yeniden adlandırılmayacak.
- Değerlendirme fotoğrafı, sosyal kanıt sayıları, kargoya teslim saatleri için gerçek veri kaynağı. Sayı/tarih üretmek çözüm değildir.

Kritik akışlar Q kabulü olmadan **tema tamamlandı** denmeyecek. Harici erişim gerektirmeyen kesin kaynak kusurları sırayla onarılmaya devam edilir.
