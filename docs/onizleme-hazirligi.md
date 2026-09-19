# Ayrı tema önizlemesi ve yerel aday hazırlığı — 19.09.2026

Kullanıcının verdiği `?theme_preview=goldtheme`, yönetici oturumuna bağlı mevcut aktif temanın önizlemesidir. Çalışma dalı burada yüklü değildir. Ekran görüntüsü bu dalın doğrulaması değildir; ayrı test mağazası doğrulanmadı. Yönetici ekranına erişilmedi, kayıt/yükleme/etkinleştirme yapılmadı.

[Qukasoft Tema Yönetimi](https://help.qukasoft.com/tasarim/tema-yonetimi) belgesi, Tasarım > Temalar > Temalarım altında Tema Yükle işlemini ve etkinleştirmeden Önizle seçeneğini ayrı tanımlar. Ayrıca etkinleştirmede mevcut banner yapısının otomatik aktarılmadığını belirtir. Belge arşiv kök yapısını, aynı kimlikli yüklemenin üzerine yazma davranışını veya ayarların izolasyonunu açıklamaz. Yerel `Platform Dökümanları/template.pdf` s.49–50 tema tanımını açıklar; bu, ZIP içe aktarma sözleşmesini tek başına doğrulamaz.

## Yerel yöntem

Temiz commit üzerinde `node tools/preview-adayi.cjs` çalıştırılır. Gerekirse `GIT_PATH` ile Git çalıştırılabilir dosyası belirtilir. Araç yalnız Git'te izlenen canlitema dosyalarını `artifacts/goldfix01_<commit>/theme-source/` altına kopyalar. Yalnız kopyadaki `ayarlar/tanim.json` id/adi değerlerini değiştirir; kaynak goldtheme tanımına dokunmaz. Kaynak ve aday SHA256 değerleri manifestte tutulur; mevcut çıktı üzerine yazılmaz. Belgeler, platform referansları ve test araçları tema adayına girmez; kaynak depoda korunur. Artifacts Git dışında tutulur. Dosya türü engeli kapsamlı sır taramasının yerine geçmez.

Bu çıktı **kaynak aday dizinidir; yüklenebilirliği doğrulanmış ZIP değildir**. Paketlemeden önce Qukasoft'un dışa verdiği hassas veri içermeyen örnek tema arşivinin kök yapısı veya destek tarafından doğrulanmış paket sözleşmesi gerekir. Kimlik değiştirme yöntemi de içe aktarıcının davranışıyla doğrulanmalıdır. Bu nedenle tahmini ZIP üretip yüklenmeye hazır diye sunulmaz.

## Platformda sonraki kabul

1. Ayrı kimliğin Temalarım listesinde bulunmadığını ve yüklemenin etkinleştirmediğini doğrula. Aktif goldtheme editöründe kaydetme; Aktif Et kullanma.
2. Belgelenmiş arşiv yapısıyla aday paketle. Opaque `ayarlar/modul_yerlesimi.config` içerikleri ve blok/mağaza ayarlarının paylaşımı belirsizdir; izolasyon doğrulanmadan ayar değiştirme.
3. Ayrı temanın kendi Önizle düğmesini kullan; adresi tahmin etme. Panelde ayrı tema kimliğini, ağda bu adayın dosyalarını ve manifestteki değişiklikleri doğrula. Misafir görünümünün aktif goldtheme kaldığını kontrol et.
4. Önizleme aynı mağaza verilerini kullanabilir. Gerçek sipariş, ödeme, üyelik kaydı veya müşteri verisi değişikliği yapma. Kritik yazma akışları için ayrı test ortamı/sentetik veri gerekir.
5. 375/768/1440 genişliklerde header/footer/banner/ödeme simgeleri, iki sayaç birlikte ve yinelenmiş modüller, giriş/şifre/menu kontrolleri, konsol/ağ hataları incelenecek. Platform CSS/JS sürümleri ve yükleme sırası kaydedilecek. Bu kontroller henüz yapılmadı.

## Bu turdaki onarımlar

**S4:** 16 Twig dosyasında 37 eski `/theme/___shuttle/` görsel bağlantısı mevcut yerel varlıkla eşleştirilip `temaDosyalari` yardımcısına bağlandı. Dosya/satır/varlık kanıtı `tema-kaynak-baglari.json` içindedir. Platform dayanağı template.pdf s.6; platform JS/CSS değiştirilmedi. Tetik: farklı tema adıyla çalışma veya eski tema dosyalarının kaldırılması. Etki: başka temadan/eskimiş adresten görsel yükleme. Yerel dosya ve bağlantı kontrolü geçti; gerçek helper URL çıktısı Qukasoft'ta bekliyor. CSS içi URL'ler ve opaque ayarlar bu düzeltmeyle doğrulanmış sayılmaz.

**J2:** `canlitema/flash-sayac.twig:3,17`, `canlitema/flash-urun.twig:3,19` ortak days/hours/minutes/seconds ID'leri kullanıyordu. Birden çok modülde ilk sayaç güncelleniyor, diğerleri kalıyor; flash-sayac global adları tekrar tanımlanabiliyordu. Bileşen içi data seçicileri ve kapalı fonksiyon kapsamı kullanıldı. `assets/style.css:1916` genel ID kuralı aynı bileşenlerle sınırlandı; referans platform dosyalarında değişiklik yok. Sayaç başlangıcı hemen güncellenir, kaldırılan modülün zamanlayıcısı durur. Dört örnekle yerel JS/DOM taklidi geçti. Gerçek tarayıcı görünümü, dinamik Qukasoft modül ekleme biçimi ve kampanya bitiş tarihinin doğruluğu bekliyor. Haftalık kampanya mantığı değiştirilmedi; sayaç kampanya verisinin doğruluğunu kanıtlamaz.

Önceki 42 çevrimdışı tarayıcı kontrolü yeniden geçti. Bunlar gerçek Twig çalıştırması veya Qukasoft giriş/sepet/ödeme testi değildir. Envanterdeki iki eski JS ayrıştırma sorunu, favori bağlantıları, kampanya/kargo veri sözleşmesi, SEO/erişilebilirlik ve tüm sayfaların gerçek görsel kabulü açık kalır. Tema tamamlandı sayılmaz.
