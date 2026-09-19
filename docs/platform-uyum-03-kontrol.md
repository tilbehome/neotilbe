> Tarihsel inceleme/kontrol kaydıdır. Tek güncel sorun durumu: [kapsamli-denetim.md](kapsamli-denetim.md).

# Satış akışı denetimi — 19.09.2026

Dal: fix/platform-uyum-01. Yerel dosyalar incelendi; canlıya, yönetici oturumuna, müşteri verilerine veya yazan API uçlarına erişilmedi. Platform kaynakları/orijinal tema değiştirilmedi.

## İki eski JS: yükleme ve veri kaynağı

`canlitema/assets/cok-al-az-ode-indirim.js` ve `assets/tahmini-kargom.js` aynı içeriğe sahiptir. İkisinde de satır 22, 27–28 ve 57–59'da Twig ifadesi JS tek tırnak dizgesini kırar. Satır 30–34 sabit 3/6/9 adet ve indirim yüzdeleriyle hesap yapar; varyant fiyatı, para birimi ve platform kampanya sonucu kullanılmaz. İsimlerinin aksine ikisi de aynı miktar/indirim kodudur.

Tema/orijinal/örnek kaynaklarda dosya adları ve dört global fonksiyonun çağrıları arandı. Bu iki dosyanın kendi tanımları dışında açık yükleme/çağrı bulunmadı. `sablon.twig:91–92` smartbanner.js ve scripts.js yükler; bu dosyaları yüklemez. `Platform Dosyaları/template-assets/scripts.min.js:1` miktarı productQuantityBox, varyantı changeProductPageVariant ve sepeti sunucu çağrılarıyla yönetir; özel indirim yüzdelerinin platform sözleşmesi yoktur. `template.pdf` s.6 temaDosyalari bir URL yardımcısıdır; statik JS'yi Twig işlediğine kanıt değildir.

**Kesin sonuç:** ham dosyalar geçerli JS değildir. **Belirsiz:** dosyaların mağaza/blok ayarından eklenmesi ve sunucuda Twig dönüşümü. `ayarlar/modul_yerlesimi.config` okunabilir metin/JSON değildir; içeriği çözümlenmedi. Canlı kaynak/ağ listesi ve ilgili modülün kaynak ayarı bu bağlantıyı kesinleştirmelidir. Dosyalar silinmedi, devre dışı bırakılmadı ve yeni yükleme eklenmedi. Sadece tırnakları düzeltip doğrulanmamış fiyat hesabını çalışır hale getirmek onarım sayılmadı. Bu iki hata **açık**, kullanım/platform doğrulaması bekliyor.

## Onarımlar ve kanıt

| Kayıt | Konum ve neden | Etki / çözüm | Doğrulama ve kalan kabul |
|---|---|---|---|
| S2 | sepet/ozet.twig:15, odeme/ozet_icerik.twig:8; sepette-kargo-mesaj-pc.twig:1 eski sabit 500 ve biçimli fiyat üzerinde matematik | Yanlış ücretsiz kargo iddiası/para birimi. template.pdf s.28–29 ucretsizKargoLimitleri ucretsiz_kargo/kalan_tutar_goster/kalan_tutar alanları kullanıldı. Bağımsız toplam, yüzdelik ilerleme ve TL ekleme kaldırıldı; mevcut kutu korunur, ücretsiz durumda dolu, kalan durumda nötr zemin; uygunluk yoksa gizli | Kaynak kontrolü; üç bileşenin ücretsiz/kalan/gizli dalları sınırlı fixture ile ayrıştırıldı. Gerçek helper tutar biçimi, adres/kupon/kur değişimi ve Q görünümü bekliyor |
| S5 | assets/scripts.js eski completeBeforePaymentStep:132; odeme/bilgiler/kargo_sablonu.twig:13–18 | Tema shipmentFile POST'u ile platform completePaymentStep FormData gönderimi yineleniyordu. Tema hook'u kaldırıldı; dosya alanı ve platform akışı korundu | Enjekte edilen scripts.min.js:1 gerçek fonksiyonu, sentetik File ve yakalanan ajaxFormGate ile tek complete isteğinde adres+dosya doğrulandı. Sunucuya gönderim yapılmadı; canlı çekirdek sürümü ve gerçek dosya kabulü bekliyor |
| V1 | urunler/profil.twig:227,240,256; hizli_sepet_kutusu.twig:128; assets/scripts.js tilbeSelectProductVariant | Apostrof JS'yi, köşeli parantez/tırnak CSS seçicisini bozuyordu; global seçici başka grubu etkileyebiliyordu. Değer mevcut data-variant-value'dan okunur, yerel grupta eşitlikle bulunur; fiyat/stok yine platform fonksiyonuna aittir | Çevrimdışı tarayıcıda iki grupla `Boy's [L] "özel"` platform çağrı sınırına aynen ulaştı. changeProductPageVariant hesapları bu testte taklit edildi; stok/fiyat gerçek Q kabulü açık. Hızlı sepet başlığındaki eksik span kapanışı da onarıldı |
| F2 | hesap/alt_sayfalar/favori_listem.twig:18,36 | Platform userProductFavourite account dalı data-user-product-id arar; tabloda yoktu. Başarılı silme sonrası satır kalıyordu. Nitelik geri bağlandı, simgeye erişilebilir ad eklendi | Referans JS başarı callback'iyle yalnız eşleşen satır kaldırıldı. Gerçek kullanıcı işlemi yapılmadı; son satır/reload ve auth Q kontrolü bekliyor |
| A3 | uyelik/sifre_yenileme.twig:15–16, sifremi_unuttum.twig:12 | Placeholder dışında programatik alan adı yoktu. Görseli değiştirmeyen aria-label eklendi; mevcut platform submit ve alan adları korundu | Kaynak alan adı kontrolü; ekran okuyucu ve gerçek hata mesajı akışı bekliyor |
| S3 | video-listeleme.twig:6,71 sonrası | Swiper Element paketiyle global new Swiper karıştırılmış, defer tamamlanmadan çağrılıyordu. init=false, customElements.whenDefined ve element.initialize kullanıldı; mevcut @10 URL'si korunur ve yalnız bir kez eklenir | Çevrimdışı tarayıcıda geç tanımlanan taklit custom element ile iki modül/iki çalıştırmada tek yükleme, örnek başına tek initialize doğrulandı. Gerçek Swiper çizimi, video modal odağı, dinamik blok yükleme ve aktif modül ayarı Q bekliyor |

S3 dayanağı: [Swiper Element belgesi](https://swiperjs.com/element) karmaşık parametrelerde init=false ve initialize kullanımını açıklar. Güncel belge sürümü ile temadaki @10 aynı kabul edilmedi; ayrıca [v10.3.1 kaynak kodunda](https://raw.githubusercontent.com/nolimits4web/swiper/v10.3.1/src/swiper-element.mjs) initialize, init=false ve custom element kayıt davranışı kontrol edildi. @10 URL'sinin canlıda hangi patch dosyayı döndürdüğü doğrulanmadı; yeni sürüm veya kütüphane eklenmedi.

## Envanter durumları

`denetim-durumlari.json` yalnız kanıtı bulunan dosyaların **inceleme kapsamını** tutar. Üretici her dosyada ayrı `listelendi`, `incelendi`, `duzeltildi`, `yereldeDogrulandi`, `platformdaDogrulamaBekliyor` alanlarını yazar. Otomatik tarama incelendi sayılmaz. Bir dosyada bir konu onarıldığında dosyanın tamamı bitmiş sayılmaz. Kayıt bulunmayan dosyalar yalnız listelendi olarak kalır. Önceki ayrıntılı kontrol raporları geçerlidir.

## ZIP incelemesi

Çalışma klasörü altındaki ZIP/RAR/7z taramasında yalnız `Örnek Dosyalar/Örnek Dosyalar.zip` ve `Platform Dökümanları/web_servis_ornek.zip` bulundu. Birincisinin dizin girdileri SVG ikon koleksiyonudur; tema tanımı/ayarları içermez. İkincisi önceki incelemede erişim bilgisi içeren PHP API örnekleri olarak dışlandı; hassas değerler okunup rapora alınmadı. **Orijinal Qukasoft tema dışa aktarım arşivi yerelde yok.**

`orjinaltema/ayarlar/tanim.json:1` id=shuttleorj, adi=Shuttle Orjinal; ayarlar altında tanim.json, tema.json, resim_boyutlari.json, modul_yerlesimi.config bulunur. Count örneği de aynı dört dosyayı taşır. Bunlar açılmış dizin yapısı kanıtıdır; ZIP kökünün doğrudan bu dizinleri mi, tema-adı üst klasörünü mü gerektirdiğini ve zorunlu dosyaları kanıtlamaz. Önceki kaynak aday dizini arşiv doğrulaması sayılmıyor. Eksik: platformdan alınmış gerçek tema dışa aktarımı veya resmi arşiv sözleşmesi.

## Çalıştırılan kontroller / açık işler

`node tests/platform-uyum-01.cjs`: önceki giriş/menu/parola/375–768–1440 kontrolleri ve bu turdaki satış kontrolleri geçti. HTTP/HTTPS fixture içinde engellidir. Koşullu şablon taklidi Twig motoru değildir; gerçek Qukasoft'ta sepet/üyelik/ödeme test edilmedi.

Kalanlar: iki eski JS, kart favorisinin ilk durumu, video modalının erişilebilirliği ve gerçek Swiper çizimi, ürün üzerindeki sabit 500 TL ve teslimat/kampanya beyanlarının gerçek ayar/veri bağlantısı, tüm formların hata/odak akışları, ürün/sepet/ödemenin gerçek responsive görünümü, platform SEO head çıktısı, LCP/CLS ve canlı inject sırası. Bu tur SEO etiketi veya yapılandırılmış veri eklenmedi; platform çıktısı görülmeden çoğaltılmadı. Bu liste önceki kapsamı daraltmaz; envanterde listelendi kalan dosyaların elle incelenmesi devam eden iştir. Tema tamamlanmış değildir.
