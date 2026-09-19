| Sorun | Müşteriye etkisi | Yapılan onarım | Doğrulama | Kalan iş |
|---|---|---|---|---|
| MENU2: Kapalı yan menü odak alıyor | Tab ekran dışındaki bağlantılara gider; açma/kapama sonrası konum kaybolur | Kapalı panel görünürlük/inert/aria durumu, açılış odağı, Tab sınırı, Escape ve tetikleyiciye dönüş | Gerçek tema + referans CSS, referans jQuery ile önce hata yeniden üretildi; onarımdan sonra test geçti | Gerçek dinamik kategori/hesap içeriği ve yardımcı teknoloji |
| HTML3: Mobil promosyon div'i doğrudan ul içinde | Geçersiz liste yapısı | Aynı promosyon listeden hemen önce, aynı categories kapsayıcısında | 375/768'de promosyon ve alt öğelerinin bütün computed style ve geometrisi önce/sonra eşit | Gerçek kategori HTML'i ile görsel kabul |
| CARD2: Özel kartın aşağı açılan satın alma dalı boş | Bu seçenek tek başınayken stoklu üründe sepete ekle düğmesi yok | Normal Gold ve orijinal kartın addCart bağlantısı geri kondu | İki kartta bağımsız düğme/adet/stok ayar kombinasyonları gerçek yerel Twig ile kontrol | Gerçek varyant modalı ve sunucu sepet sonucu |

2026-09-19, fix/platform-uyum-01. Üçü de **tema kodu** kaynaklıdır. Platform, orijinal tema ve canlı ayarlar değiştirilmedi.

MENU2 konumu: `canlitema/assets/scripts.js` ilk sidebar bloğu; `assets/style.css` sidebar kuralları. Eski negatif margin yalnız çizimi ekran dışına taşıyordu. `tests/sidebar-focus.cjs` önce `menu-link` odağı alarak başarısız oldu; artık dış kontrol odağı korunur. Açılışta panel kontrolü, kapanışta tetikleyici veya diğer açık panel odaklanır. Bootstrap/SweetAlert açıkken bu kod odağı veya Escape'i sahiplenmez. Mevcut kilit yalnız `tilbe-sidebar-open` sınıfını yönetmeye devam eder. Eski `transition:all` görünürlük değişimini de geciktirdiği için yalnız zaten hareket eden margin özellikleri animasyonlu bırakıldı; keyfi süre bekletme eklenmedi. Kapalı panel artık hemen görünmez/etkileşimsiz olur; bu bilinçli erişilebilirlik farkıdır.

HTML3 konumu: `moduller/header.twig`, `.categories > .mms-12345`. Promosyon kaldırılmadı, `ul` dışına taşındı. Kaynakta kategorinin ul margin/padding değerleri sıfır. Tarayıcı karşılaştırması referans Bootstrap/platform CSS + Gold CSS ile yapıldı. Menü kabuğu 375/768 görüntüleri açıldı; platform kategori helper'ı, ikon fontu ve dış görseller sentetik ortamda eksik olduğundan bu ekranlar gerçek menünün görsel kabulü değildir.

Aynı dosyanın mobil üst banner'ında tek bağlantı için iki `</a>` vardı; fazladan kapanış kaldırıldı. Link ve görsel korunur. Kaynak/yerel Twig kontrolü; tarayıcının zaten yok saydığı kapanışı temizler.

Ayar bağlantı taramasında `header_area.mobil_menu_tipi` tanımlı olsa da özel header bu değeri okumuyor; doğrudan tip-2 yapısını üretiyor. Orijinal header tip-1 dalını da içeriyor. Bu durum `ayar-kombinasyonlari.json` içinde kaynak farkı olarak kayıtlı: seçeneği destekleniyor diye kabul etmiyoruz, eski tasarımın başka menüsünü kanıtsız geri eklemiyoruz. Platform varsayılan şablonlarının bu ayarı başka yerde kullanıp kullanmadığı ve mağazanın beklediği seçenek açık. Bütün ayarların açık tema referansları dosya/satır olarak kaydedildi.

CARD2 konumu: `moduller/urunler/kat-ozel-kart.twig`, `urun_karti.sepete_ekle_down`, stok > 0 dalı. Dayanak: `orjinaltema/moduller/urunler/kart.twig` ve mevcut `canlitema/moduller/urunler/kart.twig`; platform `template-assets/scripts.min.js:addCart`. Test önce özel kartta eksik çağrı nedeniyle başarısız oldu. `tests/twig-local.php` sabit/sağ/alt düğmeleri tek tek, birlikte ve kapalı; adet seçimini açık/kapalı; stok sıfır/pozitif durumlarını kontrol eder. Stoksuz üründe hiçbir addCart çağrısı üretilmez; mevcut disabled düğmeler korunur. Platform fiyat/varyant/stok hesabı yeniden yazılmadı.

## Kalan işlerin ayrımı

- **Yerelde tamamlanan:** Yukarıdaki onarımlar, odak/DOM/CSS karşılaştırması ve ayar dallarının render kontrolü. Önceki regresyonların sonucu ilgili test kayıtlarında; sentetik yanıtlar gerçek işlem değildir.
- **Yerelde kalan:** Son kaynaktan tam sayfa ve diğer ayar kombinasyonlarının görsel/etkileşim kapsamı; mevcut envanterde belirtilen sınırlı incelemeler. Menü kabuğu/kart kontrolü bütün sayfayı kabul etmez.
- **Platformda bekleyen:** İki eski JS yükleme bağı; gerçek CSS/JS sırası/sürümleri; dinamik menü, galeri, varyant, sepet, ödeme, kullanıcı ve SEO çıktıları. Ayrı ZIP ayar izolasyonu belirsizdir. Gerçek hesap, sipariş veya ödeme oluşturulmadı.

Canlı home/category/login/product referansları `docs/canli-tasarim-referanslari.json` içinde adres/zaman/genişlikle kayıtlı; ekranlar `artifacts/live-reference` altında yerel tutulur. Ürün üst alanı ayrıca 375/1440 viewport görüntülerinde açıldı. Bunlar aktif mağazanın anonim görünümüdür, dalın doğrulaması değildir. Ekran altındaki lazy görsellerin boşluğu yakalama sınırıdır; otomatik bozuk kaynak sayılmadı. Aktif sayfadaki sabit kargo eşiği ve taksit metni düzeltilmiş dala geri taşınmadı.
