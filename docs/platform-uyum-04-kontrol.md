# Yeni arşiv referansları, footer ve flash kart onarımı

19.09.2026 — Dal fix/platform-uyum-01. Kullanıcı canlitema'nın canlı Gold tema kaynakları olduğunu doğruladı; mevcut dal düzeltmeleri korunuyor. Arşivler proje kökünde bulundu, taşınmadı/açılıp kaynakların üzerine yazılmadı. Salt okunur inceleme `tools/arsiv-incele.ps1`, değer içermeyen dosya/hash/işaret envanteri `arsiv-envanteri.json` içindedir.

## Yerelde tamamlanan ve doğrulananlar

| Sorun | Konum / neden / etki | Onarım ve kanıt | Açık kabul |
|---|---|---|---|
| D5 sahte sosyal kanıt | ozel-moduller/flash-urunler-hots.twig eski 155–204: ürün ID ve yılın gününden satış/ziyaretçi sayısı; footer.twig eski 419 sonrası rastgele artış | Üretilmiş sayılar/bar ve zamanlayıcı kaldırıldı. Aynı kartın conversion-block alanında yalnız urun.stok > 0 üzerinden Stokta/Stokta yok gösterilir. Referans: orjinaltema/moduller/urunler/kart.twig stok dalı; platform fiyat/sepet hesabına müdahale yok. Sınırlı koşul fixture'ında stoklu/stoksuz çıktı doğrulandı | Gerçek ürün verisi ve flash kartın responsive görünümü Q bekliyor |
| M2 kategori dialogu | footer.twig:33,67,130 sonrası; eski div.focus etkisiz, kaydırma kilidi/Tab sınırı yok | Gerçek açıcı bağlantıya odak dönüşü, aria-controls/expanded, Tab çevrimi, Escape/X/arka plan kapanışı, yalnız kendi body.tilbe-category-open kilidi. style.css son kural. Referans platform Bootstrap .modal.show açıkken klavyeye müdahale edilmez; modal-open/hidden-scroll değiştirilmez | Çevrimdışı gerçek tarayıcıda açılış odağı, Tab çevrimi, Escape, arka plan ve diğer kilitleri koruma geçti. Tam mobil görünüm, ekran okuyucu ve platform modallarıyla birlikte kullanım Q bekliyor |
| A4 alan/bağlantı adları | footer.twig bülten email/phone, sosyal simgeler, mağaza görselleri; flash-urunler-hots.twig carousel | Eksik erişilebilir adlar ve görsel alternatifleri eklendi; footer telefon bağlantısının eksik kapanışı tamamlandı. Mevcut submit fonksiyonları, fiyatlar ve tasarım sınıfları korunur | Kaynak kontrolü; bütün footer'ın görsel/ekran okuyucu kabulü açık |
| P1 arşiv biçimi | goldtheme_backup_20260919_123922.zip, shuttleorj_backup_20260919_124053.zip | Dosyalar ZIP kökünde; tema adına ait üst klasör yok. 360/132 dosya; tanım kimlikleri goldtheme/shuttleorj. Her ikisinde ayarlar/tanim.json, tema.json, resim_boyutlari.json, modul_yerlesimi.config var | Bu dosyaların örneklerde bulunması hepsinin zorunlu olduğunu tek başına kanıtlamaz; gerçek içe aktarma yapılmadı |

Kontrol komutu: `node tests/platform-uyum-01.cjs`. Yeni kategori/stock kontrolleri önceki satış, varyant, giriş ve 375/768/1440 giriş fixture kontrolleriyle birlikte geçti. HTTP/HTTPS engelli; canlı API yok. Twig koşulları sınırlı test dönüştürücüsüyle temsil edilir, gerçek Twig/mağaza testi değildir. Giriş fixture genişlikleri bütün sayfaların görsel kabulü sayılmaz.

Arşiv metinlerinde erişim bilgisi kalıbı bulunmadı; `.config` içeriği çözümlenemedi. Bu nedenle **gizlilik onayı verilmedi**, iki kaynak ZIP Git dışında kaldı. Tarama hassas veri yokluğunun ispatı değildir. Rapor yalnız yollar, boyutlar, hash'ler, bilinen tema kimlikleri ve inceleme işaretleri içerir.

## Yerelde yapılabilecek kalan işler

- video-listeleme.twig: modalın klavye/odak/aria davranışı, tekrarlanan modal ID'leri ve yer tutucu başlıklar; Swiper başlangıcı önceki turda düzeltildi.
- moduller/urunler/profil.twig: kargo sayacının global fonksiyonları ve eksik DOM koruması; ürün üzerinde sabit 500 TL beyanı. İşletme tarihini/limitini tahmin etmeden veri bağları incelenecek.
- moduller/urunler/kart_favori_listesi.twig: ürün ID yerine sayfa ID'si ve eksik remove kontrolü; başlangıç favori durumunun platform veri alanıyla birlikte ele alınması gerekir.
- moduller/uyelik/uyelik_formu.twig ve hizli_giris_kutusu.twig: label/input ilişkileri; hesap/adres/iletişim formlarında hata odağı ve alan adları.
- Envanterde yalnız listelendi olan sayfalar: koşullu HTML, sabit linkler, seçiciler, SEO işaretleri, görsel boyutları ve CSS kapsamının elle incelemesi. Yeni tarama çalışması bunları incelendiye otomatik yükseltmez.
- Footer/flash kart dahil gerçek görsel kontrolü yapılmamış sayfalar açık. Yerel sentetik masaüstü/mobil örnekler hazırlanabilir; bunlar canlı font/veri/kütüphane kabulünün yerine geçmez.

## Yalnız Qukasoft önizlemesinde/ayarlarında doğrulanabilecek işler

- Adayın etkinleştirmeden içe aktarılması, ayrı kimlikle listelenmesi ve Önizle panelinin o kimliği göstermesi; blok ayarlarının izolasyonu. Önizleme aynı mağazanın verilerini kullanır, test mağazası değildir.
- Platform Twig helper çıktıları, CSS/JS sürüm/yükleme sırası; ürün varyant fiyat/stokları, kargo/kupon/kur sonuçları; SEO title/canonical/robots ve yapılandırılmış veri tekrarı; gerçek LCP/CLS.
- İki eski JS'nin kullanım bağlantısı: kaynaklarda ve yeni dışa aktarımların okunabilir dosyalarında yükleme çağrısı yok; yalnız kendi fonksiyon tanımları eşleşiyor. Twig işlendiği veya kullanılmadığı kanıtlanmadı. Dosyalar korunuyor, iki ayrıştırma hatası açık.
- Kontrol edilecek yerler: **Tasarım > Temalar > ilgili aday > CSS ve JS Editörü** içeriği; **Blok Yönetimi** içinde ürün detayı, kategori/arama, ana sayfa ve sepet sayfalarının etkin özel HTML/Twig modülleri ve dosya yolları; bu modüllerin üst/alt kod içerikleri. Tam arama değerleri: `cok-al-az-ode-indirim.js`, `tahmini-kargom.js`, `updateQuantity`, `updateQuantityAndPrice`, `updateDiscountAndPrice`, `.discount-box`. İlgili modülün adı/kimliği, seçili dosyası ve sayfa yerleşimi kaydedilmeli. `.config` okunamadığından belirli bir modül kimliği/ayar anahtarı bildiğimiz iddia edilmiyor.
- Tarayıcı Network'te bu iki dosya isteğinin Initiator zinciri, Response içeriğinde işlenmemiş `{{` bulunup bulunmadığı ve yüklenme sırası kaydedilmeli; bu kontrol salt okunurdur. Theme editöründe `.js` uzantılı dosya bulunması Twig çalıştığını kanıtlamaz.
- Giriş/2FA, üyelik, sepet ve ödeme sunucu akışlarının yazma gerektiren kabulü için güvenli test hesabı/ürünleri veya bağımsız test ortamı gerekir; gerçek müşteri/sipariş/ödeme oluşturulmayacak.

## Önizleme adayı yöntemi ve yükleme sınırı

`node tools/preview-adayi.cjs` temiz çalışma dalındaki commit'i kaydeder. Yalnız izlenen canlitema dosyalarını kopyalar; kopyadaki tanim.json id/adi değerlerini `goldfix01_<12 karakter commit>` yapar. Aktif kaynak tanımı goldtheme kalır. Yeni ZIP, özgün dışa aktarım gibi kökte ayarlar/assets/moduller içerir. ZIP tekrar açılarak her dosya adı ve SHA256 manifestle eşleştirilir; manifest ZIP dışında saklanır. Kaynak ZIP, docs, platform dosyaları ve testler aday ZIP'e girmez.

Bu, yapısı örnekle eşleşen **yerel adaydır**; çalışır/yüklenebilir kabulü değildir. Opaque blok ayarları değiştirilmeden kopyalanır; içlerindeki kimlik bağı ve izolasyon doğrulanmadı. Aynı aday kimliği zaten varsa yükleme durdurulmalı. İlk yükleme öncesinde aynı kimlikle üstüne yazma ve blok ayarlarının paylaşımı platform desteği/arayüzle kesinleştirilmeli. Tasarım > Temalar > Temalarım > Tema Yükle üzerinden **yeni ayrı tema** olarak eklenip yalnız Önizle seçilmeli; Aktif Et kullanılmamalı, goldtheme editöründe kayıt yapılmamalı. Bu tur hiçbir yükleme/etkinleştirme yapılmadı.
