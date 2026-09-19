# Üretilen yerel önizleme adayı

- Kaynak commit: `a67b949cb904e68979756a68ee4bb95ec2b3e7ca`, dal `fix/platform-uyum-01`.
- Tema kimliği: `goldfix01_a67b949cb904`. Kaynak canlitema kimliği goldtheme olarak korunur.
- ZIP: `artifacts/goldfix01_a67b949cb904/goldfix01_a67b949cb904.zip`.
- Dosya listesi, kaynak/adaya ait SHA256 ve ZIP hash'i: [onizleme-adayi-manifest.json](onizleme-adayi-manifest.json).
- 360 tema dosyası; yalnız aday `ayarlar/tanim.json` dosyasının id/adi değerleri farklı. Arşivde üst tema klasörü yok, yollar özgün dışa aktarım gibi `/` kullanır. Her ZIP girdisi manifestle yeniden doğrulandı.
- Özgün iki arşivin hash'leri inceleme öncesi kayda eşit; referanslar değiştirilmedi. Referans ZIP'ler ve üretilen ZIP Git'e gönderilmez; yöntem, doğrulama kaydı ve manifest gönderilir.
- Paket **platforma yüklenmedi/etkinleştirilmedi**. Kaynak `.config` ayarları korunmuştur; bunların izolasyonu ve platform içe aktarma kabulü doğrulanmadı.

Önceki `goldfix01_3b13f594d729` denemesi Windows ZIP yol ayracı yüzünden reddedildi; `goldfix01_29d696b7697b` denemesi paket oluşturmayı tamamlamadı. Yerlerinde KULLANMAYIN kaydı var. Yalnız yukarıdaki aday değerlendirilmeli.

Yükleme/kabul adımları ve üç gruplu kalan iş listesi: [platform-uyum-04-kontrol.md](platform-uyum-04-kontrol.md). Aktif goldtheme üzerine kayıt, Aktif Et, main birleştirmesi veya gerçek müşteri/sipariş/ödeme işlemi yapılmamalı. Önizleme de üretim mağazasına bağlıdır. Ayrı kimlik metadata çakışmasını önler; platformun opaque ayarları nasıl eşleştirdiği ayrıca doğrulanmalıdır.
