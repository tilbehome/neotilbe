> Tarihsel inceleme/kontrol kaydıdır. Tek güncel sorun durumu: [kapsamli-denetim.md](kapsamli-denetim.md).

# G02–G05 yerel onarımlar ve açık kabul işleri

## Onarılanlar

- **Satış/form:** taksit sayısı platform `vade` alanından; taksit bölümü açık/kapalı/veri yok dallarında dengeli HTML; ücretli kargoda `firma.ucret`; TC zorunlu ayarında `tc` alanı ve hata hedefi; ödeme alanlarının kaybolan label bağları; mobil aramada kapanmış iki ayrı submit düğmesi.
- **Sepet/veri doğruluğu:** farklı ürün sayısı sepet satırı yerine ürün kimliğinden; gerçek indirimle doğrulanmayan “indirim kazan/uygulandı” mesajı yerine mevcut ürün sayısı. Bu değişiklik sunucuda kampanya tanımlamaz veya uygulamaz. İndirim tutarı platformun biçimlendirilmiş çıktısıyla gösterilir; ikinci `number_format` ve sabit TL kaldırıldı. Ürün hücresinin eksik iki div/td kapanışı ve miktar birimi seçicisi düzeltildi.
- **Uydurma veriler:** sepette ID’den türetilen favori sayısı kaldırıldı. Rastgele sepet/favori/görüntüleme/satış üreten eski JS artık sayı üretmez; dosya yolu olası mevcut başvurular için tutuldu. Sipariş sorgusu yapılmadan OrderProcessing bildiren Order microdata’sı kaldırıldı; görünür takip formu, platform çağrısı ve breadcrumb korundu.
- **Erişilebilirlik/CSS:** şifre simgeleri aynı görünümde native button; Enter/Space, erişilebilir ad ve aria-pressed; giriş/kayıt input adları; ödeme formunda 16 eksik label bağı ve mevcut hatalı label `form` niteliğinin `for` düzeltmesi; takip formundaki iki label bağı. `.login-body.p-g-mod-t-4` doğru bileşik seçicisi. Kart puan aralıkları yerel Bootstrap 4'ün mr/ml yardımcılarına bağlandı.
- **İsteğe bağlı video JS:** script etiketi statik JS'den çıkarıldı; eksik düğme/iframe/container durumları güvenli; modülün mevcut global aç/kapat yardımcıları ezilmez. Yeni yükleme başvurusu eklenmedi, dosya etkinleştirilmedi.
- **JS veri bağlamı:** Benzer Ürünler düğmesinde kategori adı çalıştırılabilir onclick metninden çıkarıldı. Platform arama adresi ve URL kodlanmış kategori, data niteliğinde taşınır; görünür düğme korunur. Apostrof, Türkçe harf ve `&` içeren kategoriyle Qukasoft kabulü bekliyor.

## Gerçekte yapılan kontroller

`node tests/platform-uyum-01.cjs`: **42 çevrimdışı tarayıcı kontrolü**. Önceki 25 regresyon korunur; dört koşullu fiyat fixture’ı, 6 vade gösterimi, TC ayarının iki dalı, mobil GET formu, video eksik DOM/tekrar yükleme, referans miktar yardımcısında ondalıklı artış/azalış, gerçek tarayıcı klavye Enter/Space ve 375/768/1440 px giriş formu yerleşimi eklenmiştir. Bu genişletilmiş test artık `platform-uyum-02-cases.cjs` kaynağını da kullanır.

Kaynak kontrolleri: sahte sayı ve sabit sipariş durumunun yokluğu; ürün-ID sayacı; kargo alanı/indirim çıktısı; sepet satırı div dengesi; tema JS/JSON ayrıştırma envanteri; platform/orijinal/örnek referanslarda Git farkı olmaması. Yeni/değişen metinler erişim anahtarı içermez; hassas örnek ZIP hâlâ Git dışında.

**Sınırlar:** fixture üreticisi yalnız testte açıkça tanımlanan birkaç `if` koşulunu işler; Twig derleyicisi değildir. Platform motoru, gerçek ürün/kampanya/ödeme verisi ve ağ davranışı doğrulanmadı. Ödeme etiketleri kaynak düzeyinde bağlandı; bütün adres/ülke/fatura kombinasyonlarının ekran okuyucu testi henüz yapılmadı. 375/768/1440 kontrolleri giriş fixture’ına aittir; tüm mağazanın taşma/kontrast/görsel kabulü değildir. Görsel kimlik korunurken hatalı selector'ün amaçlanan input yüksekliği tekrar uygulanmıştır; gerçek font, içerik ve modül düzeni Qukasoft'ta görülmelidir.

## Qukasoft kabul listesi — açık

1. Taksit ayarı açık/kapalı; taksit verisi yok/3/6/12 vade; havale/indirim açık/kapalı; fiyatlı varyant değişimi. Ürün sütunları, fiyatlar ve taksit sonucu karşılaştırılmalı.
2. Ücretli/ücretsiz kargo; TC zorunlu/zorunlu değil; bireysel/kurumsal fatura ve farklı fatura adresi. Eksik TC sunucu mesajı kendi hedefinde görünmeli. Gerçek ödeme yapılmamalı.
3. Sepette aynı ürünün farklı varyantları, ondalıklı birim, miktar sınırı, silme/güncelleme, kupon hata/iptal ve farklı para birimi. Sayısal mesaj ile platform özeti eşleşmeli; kampanya uygulandığına dair sahte beyan olmamalı.
4. Giriş/kayıt/takip/ödeme alanlarını klavye ve ekran okuyucuyla dolaşın; göz düğmeleri formu göndermemeli; odak görünmeli. Mobil aramada Enter, her iki düğme ve öneri seçimi çalışmalı.
5. Video dosyası gerçekten yüklenen bir yerleşim varsa video var/yok, popup aç/kapat, tekrar yükleme ve gerçek mobil cihaz davranışı. Dosya etkin değilse sırf test için canlıya eklemeyin.
6. Render edilmiş head içinde title/meta/canonical/robots/JSON-LD tekrarları, HTTP durumları, tüm sayfalarda klavye/kontrast/taşma, LCP/CLS ve kaynak yüklenme sırası ayrıca incelenmeli.

## Kapanmayan işler

`kapsamli-denetim.md` tüm açık işleri izler. Özellikle iki fiyat JS dosyasının veri entegrasyonu, kargo eşiği/ham tutar türleri, kampanya ve rezervasyon beyanları, favori kartlarının başlangıç durumu, sayaç/video modül yaşam döngüsü, sabit tema URL’leri, inline JS kaçışları, dinamik SEO ve tüm hesap/sipariş/bayi akışları açıktır. Yerel referans sürümleri canlı sürüm kabul edilmedi. Tema tamamlanmış değildir.
