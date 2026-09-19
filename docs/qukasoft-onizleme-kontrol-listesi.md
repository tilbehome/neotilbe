| Sorun | Müşteriye etkisi | Yapılan onarım | Doğrulama | Kalan iş |
|---|---|---|---|---|
| Yerel sonuç ile canlı platformun karıştırılması | Yanlış kabul ile satış akışı bozulabilir | Sayfa/işlem bazında aşağıdaki kabul adımları | Henüz Qukasoft'ta çalıştırılmadı | Ayrı adayın ve güvenli test koşullarının hazırlanması |

## Başlamadan

Güncel ZIP ve kaynak commit yalnız [onizleme-adayi.md](onizleme-adayi.md) içinden seçilmeli. Eski adaylar güncel CSS ve onarımları içermez. Platformun [Tema Yönetimi belgesi](https://help.qukasoft.com/tasarim/tema-yonetimi) Tasarım > Temalar > Temalarım içinde Tema Yükle ve etkinleştirmeden Önizle işlemlerini anlatır. Belge opaque blok ayarlarının içe aktarmada izolasyonunu açıklamaz. Ayrı `id/adi` yalnız metadata ayrımıdır; etkin Gold blok ayarlarını koruma garantisi değildir.

Önce yönetimde salt okunur inceleme veya Qukasoft desteği ile **farklı kimlikli tema yüklemesinde `ayarlar/modul_yerlesimi.config`, tema ayarları ve resim boyutları aktif temadan bağımsız mı, ortak kayıtları değiştirir mi?** sorusu doğrulanmalı. İzolasyon teyidi yoksa üretim mağazasına yükleme ertelenmeli; ayrı test mağazası veya destek tarafından doğrulanmış yöntem kullanılmalı. Bu bilgi yerel dosyalardan çıkarılamıyor.

Yükleme güvenli koşulda yapılınca Aktif Et veya mevcut goldtheme Kaydet kullanılmaz. Yeni adayın kendi Önizle bağlantısı ve paneldeki tema kimliği paylaşılır. Önizleme yönetici oturumuna bağlıdır; URL tek başına erişim sağlamaz. Parola, oturum çerezi veya müşteri verisi paylaşılmaz. Testi yetkili yönetici kendi oturumunda uygulayabilir. Misafir oturumundaki sayfa aktif mağazadır; aday testi diye kaydedilmez.

## Sayfa ve işlem bazında kabul

Her satır için tarih, tema kimliği, URL, viewport, beklenen/gerçek sonuç ve sınırlı kanıt kaydedilmeli. Network kayıtlarında yetkilendirme/çerez ve kişisel veri dışarı aktarılmamalı.

| Sayfa / durum | Uygulanacak kontrol | Beklenen kanıt / koşul |
|---|---|---|
| Önizleme kimliği | Yönetici Önizle paneli, tema kaynak URL'leri; önbellek kapalı yeniden yükleme | Manifestteki kimlik; assets/product-video-popup.js ve güncel sidebar kodunun Response'u. Eski goldtheme dosyası olmamalı. Gizli önizleme çerezi yalnız varlık/etki bakımından kontrol edilir |
| Bütün sayfalar | Stylesheet ve script DOM sırası, async/defer, Network Initiator/Response | Platform referans kopyası ile canlı sürüm ayrımı; indirme sırası çalıştırma sırası sayılmaz. Tek kütüphane/tek işlem dinleyicisi; konsol hataları ayrı kayıt |
| Ana sayfa / kategori / arama | 375/768/1440; uzun başlık, boş sonuç, filtre/sıralama, kart seçenekleri, menü/arama klavye | Gerçek blok birleşimi, taşma ve footer erişimi; desteklenen ayar kombinasyonları ayrı adayda. Aktif mağaza ayarı değişmez |
| İki eski JS | DevTools Network'te cok-al-az-ode-indirim.js ve tahmini-kargom.js; Initiator zinciri, Response | Dosya gerçekten isteniyor mu, hangi blok/üst-alt kod başlatıyor, Response içinde ham Twig var mı? Yalnız bir sayfada istek olmaması kullanım yokluğu değil |
| İki eski JS yönetim bağı | CSS/JS Editörü; Blok Yönetimi: ana sayfa, ürün, kategori/arama, sepet etkin özel modülleri | Dosya adı, modül adı/kimliği, seçili Twig dosyası, üst/alt kod. updateQuantity, updateQuantityAndPrice, updateDiscountAndPrice, .discount-box araması. Belgelenmemiş modül kimliği tahmin edilmez |
| Ürün / varyant | Seçilmemiş/seçilmiş/tükenen kombinasyon, fiyat/indirim/stok; galeri tipleri ve video var/yok | Platform yanıtının gösterime eşliği; fiyat/kargo hesabı temada taklit edilmez. Popup X/arka plan/Escape ve iframe içi klavye ayrıca kontrol |
| Kargo / kampanya | Ücretsiz, kalan tutar, gösterilmeyen limit; mağaza iş günü/kesim saati | ucretsizKargoLimitleri gerçek çıktısı; ürün ve sepet tutarlılığı; beyanın mağaza ayarı/dayanağı. 12:00/13:00 ve tatil farkı mağaza teyidi |
| Favori / sepet | Aynı ürün birden çok kart, stok dışı, tekrarlı ekleme, miktar/silme, boş sepet, kupon hatası | **Önceden sağlanmış test hesabı/ürünü ve izinli test koşulu gerekir.** Gerçek müşteriyi değiştirme. Stoksuz düğme istek göndermez; platform sonucu kart/özetle eşleşir |
| Sepet / ödeme yerleşimi | Gerçek etkin bloklarla mobil alt menü ve sabit CTA; klavye | LAYOUT1 üst üste binme/çift CTA; sipariş tamamla düğmesi yanlışlıkla kaldırılmamış olmalı |
| Giriş / kayıt / hesap | Hatalı/başarılı giriş, 2FA, returnUrl, ayrı parola gözleri, form ağ/sunucu hatası | Yalnız güvenli test hesabı/koşulu; gerçek kullanıcı kaydı veya güncelleme yapılmaz. Hata kapanınca odak geri döner; sağlayıcı kapalıysa boş sosyal bölüm yok |
| Ödeme | Adres/kargo/yöntem yüklenmesi, hata, yükleniyor/tekrar gönderim, dosya FormData | Gerçek sipariş/ödeme oluşturulmaz. Tam kabul için ayrı test mağazası + sağlayıcı sandbox + test hesap/ürün/adres ve test bildirimi koşulları gerekir; bunlar henüz doğrulanmadı |
| İçerik / yardım / SEO | Tam sayfa, uzun içerik, accordion hash/klavye; gerçek head ve yapılandırılmış veri | Title/canonical/robots/başlıklar/alt metin ve ürün verisi gerçek çıktıdan okunur. Platform etiketi tekrar üretilmez; yerel stub SEO kabulü değil |

Önizleme üretim mağazasının verisi ve API'leriyle çalışabilir; bağımsız test mağazası sayılmaz. Bu listedeki hiçbir bekleyen satır otomatik başarılı değildir. Kullanıcıdan istenen en küçük ilk bilgi ayrı kimlikli yüklemenin ayar izolasyonu teyididir; bu sırada bağımsız yerel işler sürer.
