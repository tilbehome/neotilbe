# Video, favori, form ve içerik onarımı

19.09.2026 — `fix/platform-uyum-01`. Tam tema kabulü devam ediyor. Güncel sorunların tek kaynağı `sorun-durumlari.json`; önceki raporlar tarihsel kanıttır.

## Yerelde tamamlanan ve doğrulananlar

Aşağıdaki yollar `canlitema/` köküne göredir. Satırların güncel karşılığı `tema-envanteri.json` sinyalleri ve Git farkında bulunur.

| Sorun / konum | Tetiklenme, etki ve dayanak | Onarım / doğrulama |
|---|---|---|
| VM1 `video-listeleme.twig`, `assets/video-gallery.js`, `assets/style.css` | İkinci galeri aynı modal/iframe ID'sini kullanıyordu; genel openModal/closeModal, klavye/odak/kilit eksikliği ve yerelde modal CSS'sinin bulunmaması. Platform Bootstrap `.modal.show`/`modal-open` ile beraber kullanım dikkate alındı. | Galeri başına seçici, native kapatma düğmesi, iframe temizliği, kendi scroll kilidi, tekrar başlatma koruması. Açıkken bağlı belge dinleyicileri kapatmada kaldırılır; açık kök kaldırılınca kilit bırakılır. Çevrimdışı Edge: iki örnek, Enter, Escape, backdrop, odak dönüşü, harici kilit ve DOM'dan kaldırma geçti. |
| J1 `moduller/urunler/profil.twig` son script | Global updateCountdown/getTurkeyTime ve tekrar eden sayaç ID'leri, eksik öğelerde hata. | Her campaignTimerDiv içinde kapalı kapsam, data nitelikleri, eksik/çıkarılan DOM koruması. Eksik DOM ve globals yerel tarayıcı kontrolü geçti. İşletmenin öğlen/hafta sonu kuralı değiştirilmedi, doğrulanmadı. |
| F1 `moduller/urunler/kart_favori_listesi.twig` | Kart ürününün yerine sayfa ID'si, ilk favori durumunun ve kaldırma kontrolünün eksikliği. Dayanak: orijinal hesap favori listesi `kullaniciFavoriListesi()` ve platform `userProductFavourite` içindeki data-favourite-product-id/add-favorite/remove-favorite seçicileri. | Kart urun.ID, kanonik liste üyeliği ve iki kontrol. Gerçek yerel Twig: misafir/favoride/başka ürün durumları; gerçek referans JS + sentetik yanıt: auth/hata/ekle/kaldır/aynı ürünün iki kartı. Galeri `resim_alani_tipi/carousel_atli_karinca.twig` mevcut kart favori sınıfını korur ve ürün bağlamını açıkça sayfaBilgileri() ile aktarır. |
| A5 üyelik/hızlı giriş/adres/eposta-şifre/üye bilgisi/bayilik/destek/iletişim/havale/hesap sipariş takip | Görünen label kontrolle bağlı değildi; iletişim h6 başlığı h2 ile kapanıyordu; adres bireysel radio'sunda koşulsuz checked vardı. | 11 form şablonunda ID/for; hızlı girişte modal koduyla ayrım; koşullu radio seçimi korunur. Her formda label.control tarayıcı kontrolü. Alan adları, submit ve platform doğrulama yolları korunur. Hata odağının bütün akışlarda kabulü yapılmadı. |
| CAT1 `moduller/kategoriler/sayfalama.twig` | Sabit sıralama seçenekleri platform listesini tekrarlıyordu; sorgudaki apostrof/script kapanışı inline JS'yi bozabiliyordu; responsive kod bütün class'ları siliyordu. | Platform siralama_tipleri tek kaynak, e('js'), yalnız grid class değişimi; tekrar resize bağlaması namespace ile önlenir. Gerçek Twig özel karakterli sorgu ve iki seçenek; tarayıcıda query korunması ve başka state class'ının kalması. |
| HELP1 `moduller/yardim/madde_listesi.twig`, `arama_formu.twig` | Sayfa ID=madde ID olduğunda accordion ebeveyni ile panelin ID'si aynı; çoklu modül de çakışabilir. | Modül/sayfa/madde ve rol önekleri; arama erişilebilir adı. Gerçek Twig iki modül ve aynı sayfa/madde ID'siyle tekil ID/hedef kontrolü. Bootstrap açılış/animasyonun gerçek Q kabulü açık. |
| SEO1 `moduller/statik_sayfalar/404.twig`, `alt_sayfalar/havale_bildirim.twig` | 404 kendi URL'si yerine ana sayfayı bildiriyordu; henüz işlem yokken ActiveActionStatus/PayAction/BankAccount gibi kanıtsız ödeme metadatası vardı. | Yanlış/verisiz işaretler kaldırıldı; görünür içerik ve breadcrumb korundu. Kaynak kontrolü. Platform title/canonical/robots üretilmedi; HTTP 404 veya gerçek head çıktısı test edilmedi. |
| ACC1 `hesap/alt_sayfalar/hediye_ceklerim.twig`, `hediye_ceki/kart.twig` | Kopyala düğmesi parent onclick'e yayılıyor; parent var olmayan voucher-code'u platform copyElement'e gönderiyordu. Referans fonksiyon getElementById sonucunda doğrudan innerHTML okur. | Parent olay kaldırıldı, mevcut hedefli düğme ve erişilebilir adı korundu. Yerel click kontrolünde bir çağrı/doğru hedef; gerçek pano izni denenmedi. |
| PAY1 `hesap/icerik.twig`, `odeme/bilgiler/odeme.twig` | Platform hata metni apostrof/satır sonu içerince inline JS bozulur. Ödeme sekmesinin aria-controls kendi tab ID'sine yöneliyor, hepsi seçili bildiriliyordu. | JS bağlamına e('js'); içerik paneline ARIA bağı ve gerçek metod.aktif. Yerel Twig özel karakterli hata ve iki yöntem kontrolü. Platform hata yanıtı/ödeme yapılmadı. |
| A6 `sepet/ajax_liste.twig`, hesap fiyat/stok alarm listeleri, profil/hızlı sepet favori | Görsel/silme/checkbox/simge kontrollerinde ad eksikliği. | Ürün adıyla alt/aria-label, sınıf/alan adı ve platform fonksiyonları aynen korunur. Kaynak incelemesi; ekran okuyucu kabulü açık. Sipariş detayındaki ters b/u kapanışı da düzeltildi. |
| PV1 `urunler/resim_alani_tipi/carousel_sol.twig`, `assets/scripts.js` | Aynı indeksle video ID'si/global playVideo; play reddedilse de düğme kayboluyor; iki çift ok, video sayısı yerine resim sayısıyla ok kontrolü. | Tıklanan .video içinde oynatıcı; pending tekrar koruması, başarısızsa yeniden deneme, başarıda native oynatıcı kontrolleri; tek ok çifti, videolu_resimler sayısı. Yerel play Promise reddi/başarısı ve iki video izolasyonu geçti; gerçek codec/medya ve carousel geçişi Q kabulü açık. |

Platform JS dayanağı salt okunur `Platform Dosyaları/template-assets/scripts.min.js` (minified satır 1); Bootstrap kaynakları aynı referans ağacındadır. Platform çekirdeği değiştirilmedi. JS bağlamı kaçışı [Twig resmi escape belgesi](https://twig.symfony.com/doc/1.x/filters/escape.html) ile karşılaştırıldı; bu belgenin sürümü Qukasoft sürüm kanıtı değildir.

Ürün profilindeki sabit 500 TL beyanı da `ucretsizKargoLimitleri` ücretsiz/kalan tutarı göster/gizli sözleşmesiyle değiştirildi. Tema tutar hesaplamaz, para birimi eklemez. Gerçek yerel Twig üç dalı ve 37,50 EUR sentetik biçimini korudu; gerçek platform helper kabulü açık.

## Kontrol kanıtları ve sınırlar

- `node tests/platform-uyum-01.cjs`: önceki giriş/2FA callback/returnUrl, parola, menü, kargo, varyant ve sepet regresyonlarıyla yeni kontroller geçti. HTTP/HTTPS engelli; AJAX yanıtları sentetik. Gerçek sipariş, üyelik, sepet veya ödeme işlemi yapılmadı.
- `php tests/twig-local.php <geçici Twig vendor/autoload.php>`: gerçek **Twig 3.29.0**, 165 Twig kaynağı ayrıştırıldı; hata yok. Motor yalnız sistem geçici klasöründedir, temaya eklenmedi. Qukasoft sürümü bilinmiyor; özel helper/filter'lar stub'dır. `twig-local-results.json` hangi render fixture'larının yürütüldüğünü kaydeder. Parse başarısı platform helper/veri/miras kabulü değildir.
- `artifacts/visual-05/video-{375,768,1440,844}.png`: video modal kabuğunun ekran görüntüleri açılarak incelendi. 844x390 yatay durumda kapatma odağı için boşluk düzeltildi ve yeni görüntü tekrar incelendi. Diğerleri 900 px yükseklikte. Oynatıcı açıkça yerel yer tutucudur. Ağ kapalıyken arka plandaki thumbnail/Swiper görünümü gerçek galeri kabulü sayılmaz. Diğer sayfalar için görsel kontrol geçti denmiyor.
- `tools/tema-sozlesmeleri.cjs`: Twig/JS/CSS/ayar/SVG kaynaklarının miras/helper/olay/orijinal farkını mekanik olarak kaydeder; manuel inceleme durumunu yükseltmez. Envanterde beş kaynak grubu ayrıca belirtilir.

## Yerelde yapılabilecek kalan işler

- `tema-envanteri.json` içinde yalnız listelendi kalan kaynakların elle okunması ve ilgili koşulların incelenmesi. Ayrıştırma bunların yerine geçmez.
- Galerilerin diğer varyantları, ürün kartlarının uzun/boş/stoksuz görünümü, CSS'nin global seçicileri, header/footer/flash içeriklerinin tam görsel fixture'ları. Görsel kabulü olmayan sayfalar açık.
- Form hata odağı ve alan bazlı geri bildirim: referans ajaxFormGate/showAlert davranışını bozmadan erişilebilirlik incelemesi sürüyor.
- `assets/kargoya-verilme-suresi.js` yüklenme bağı: ürün içi sayaçla farklı kesim saati içeriyor; kullanılmadığı varsayılmadı. Ürün popup'ının alternatif yükleme yolu ve iframe odak sınırları ayrıca incelenecek. YouTube içindeki tuş olayları üst belgeye gelmeyebilir; iframe içi Escape testi yapılmadı.
- Bayi hareketleri şablonunda hareket döngüsü içindeki siparis.* sıralama değerleri şüpheli; desteklenen *_base alanları belgeden doğrulanmadan değiştirilmedi. Bayilik formundaki invoice-type hedefleri kendi formunda bulunmuyor; beklenen alan grupları netleştirilecek.

## Yalnız Qukasoft/veri veya yönetim ayarıyla kapanabilecek işler

- F1: gerçek üye/misafir kartları, helper veri şekli ve çok kartlı sayfada helper maliyeti; favori add/remove sunucu yanıtı ve tekrarlı istek davranışı.
- S2/D4/J1: kargo helper çıktıları (üründeki sabit 500 TL artık kaldırıldı), saat/teslimat ve sepet rezervasyon beyanlarının mağaza ayarı dayanağı; kampanya ve fiyat hesabı temada icat edilmeyecek.
- K6 iki eski `cok-al-az-ode-indirim.js` ve `tahmini-kargom.js`: silinmedi/çalıştırılmadı. Statik JS ayrıştırmaları hâlâ hatalı. Kaynak ve okunabilir arşivde yükleme izi bulunmaması kullanım yokluğu değildir. Kesin yönetim ve Network adımları [önceki raporda](platform-uyum-04-kontrol.md#yalnız-qukasoft-önizlemesindeayarlarında-doğrulanabilecek-işler) kayıtlı: CSS/JS Editörü; etkin özel modül dosya/üst-alt kodları; Initiator ve Response içinde Twig'nin işlenmesi. Opaque modul_yerlesimi.config okunamadı.
- Canlı CSS/JS sürümü/sırası, platformun gizli base şablonları, Swiper ve Bootstrap birlikte davranışları, gerçek head/HTTP/SEO çıktısı, LCP/CLS, bütün sayfaların gerçek font/veriyle mobil ve masaüstü görünümü.
- Adayı ayrı kimlikle içe aktarma ve blok ayarlarının izolasyonu henüz doğrulanmadı. Aktif goldtheme/admin önizlemesi dalın testi değildir. Güvenli test hesabı/verisi olmayan yazma akışları denenmeyecek.

## Kısa önizleme kontrol listesi

1. Aday kimliğini ve kaynak commit'ini manifestle eşleştir; aktif goldtheme üzerinde kayıt/etkinleştirme yapma.
2. Salt okunur ürün/kategori/yardım sayfalarında Console/Network, özel karakterli sorgu, sıralama, görsel/videolu ürün ve yardım panellerini kontrol et.
3. Mobil/tablet/masaüstünde video X/arka plan/Escape/Tab, diğer açık modalın kilidi; gerçek iframe içinde odak ve Safari medya iznini kontrol et.
4. Formlarda etiket tıklaması, klavye, uzun hata metni ve hata odağını güvenli test verileriyle kontrol et. Gerçek müşteri kaydı değiştirme.
5. Favori/kupon/sepet/ödeme/2FA sunucu kabulünü yalnız izinli test ortamında yap; gerçek sipariş/ödeme oluşturma. Sonuç gelmeden ilgili kaydı kapatma.

## Güncel kaynak konumları

- VM1: `canlitema/video-listeleme.twig:1`.
- VM1: `canlitema/assets/video-gallery.js:2`.
- J1: `canlitema/moduller/urunler/profil.twig:535`.
- D4: `canlitema/moduller/urunler/profil.twig:415`.
- F1: `canlitema/moduller/urunler/kart_favori_listesi.twig:1`.
- CAT1: `canlitema/moduller/kategoriler/sayfalama.twig:44`.
- HELP1: `canlitema/moduller/yardim/madde_listesi.twig:21`.
- ACC1: `canlitema/moduller/hediye_ceki/kart.twig:18`.
- PAY1: `canlitema/moduller/odeme/bilgiler/odeme.twig:39`.
- PAY1: `canlitema/moduller/hesap/icerik.twig:39`.
- PV1: `canlitema/assets/scripts.js:170`.
- SEO1: `canlitema/moduller/statik_sayfalar/alt_sayfalar/havale_bildirim.twig:22`.
