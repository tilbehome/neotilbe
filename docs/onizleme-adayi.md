| Sorun | Müşteriye etkisi | Yapılan onarım | Doğrulama | Kalan iş |
|---|---|---|---|---|
| Eski aday güncel onarımları içermiyor | Eski dosyayla yapılan test yanlış kabul verebilir | Güncel kaynak commit'ten ayrı kimlikli paket | 362 ZIP girdisi yol/içerik hash'i ile yeniden doğrulandı | Platform içe aktarma ve blok ayarı izolasyonu |

Kaynak commit: `b31769aa6143ebda2c444947229f2b07fb23bb54`, dal `fix/platform-uyum-01`.

Tema kimliği: `goldfix01_b31769aa6143`. ZIP: [goldfix01_b31769aa6143.zip](../artifacts/goldfix01_b31769aa6143/goldfix01_b31769aa6143.zip). Boyut: 7252613 bayt.

Paket CSS temizliği, video popup, footer/form odağı, menü klavye, özel kart alt satın alma düğmesi ve Smartbanner boşluk onarımlarını içerir. Kaynak canlitema kimliği goldtheme olarak korunur; yalnız paket ayarlar/tanim.json id/adi değişir. 362 izlenen tema dosyasının tamamı vardır; üst tema klasörü yoktur, ZIP yolları özgün dışa aktarım gibi / kullanır. Platform/orijinal dosyaları, raporlar, testler, canlı ekran görüntüleri ve özgün ZIP'ler adayın içine kopyalanmadı. Dosya listesi ve kaynak/paket hash'leri [manifestte](onizleme-adayi-manifest.json).

**Yüklenmedi, etkinleştirilmedi.** Paket oluşturulması platform kabulü değildir. Opaque ayarlar/modul_yerlesimi.config kaynakta olduğu gibi korunmuştur; ayrı yüklemede aktif Gold blok ayarlarıyla paylaşım/izolasyon hâlâ bilinmiyor. Kimliğin farklı olması bu bilinmeyeni çözmez. Referans ZIP'ler, aday ZIP ve görüntüler yalnız yerelde; Git'e gönderilmez.

Önceki 98e2e4dc8734 ve 15897dfabc9b dahil bütün eski adaylar bu son paketin yerine kullanılmamalıdır.

Sizden gereken ilk somut işlem: Qukasoft yönetiminde salt okunur bilgi veya destek teyidiyle farklı kimlikli tema yüklemesinin aktif goldtheme ve blok ayarlarını değiştirmediğini doğrulayın. Teyit sonrası **Tasarım > Temalar > Temalarım > Tema Yükle** alanına yukarıdaki ZIP'i yükleyin; **Aktif Et kullanmayın**. Yeni adayın kendi **Önizle** bağlantısını ve panelde görünen tema kimliğini paylaşın. Yönetici oturumu gerektiğinden bu adres tek başına bana erişim vermez; parola/çerez göndermeyin. İzolasyon teyidi yoksa üretim mağazasına yüklemeyin; ayrı test mağazası veya destek tarafından doğrulanmış yöntem gerekir.

Yöntemin belgelenen ve belirsiz kısmı ile sayfa/işlem listesi: [Qukasoft kontrol listesi](qukasoft-onizleme-kontrol-listesi.md). Gerçek sipariş, ödeme veya müşteri değişikliği yapılmaz. Güvenli test hesabı ve ödeme sandbox'ı henüz doğrulanmadı.

Yerel ve platform kabulü ayrımı: [08 raporu](platform-uyum-08-kontrol.md), [09 raporu](platform-uyum-09-kontrol.md), [10 raporu](platform-uyum-10-kontrol.md). Tema bütünü tamamlandı sayılmaz; görsel/ayar kombinasyonları ve kritik platform akışları açık.
