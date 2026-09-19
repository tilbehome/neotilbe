| Sorun | Müşteriye etkisi | Yapılan onarım | Doğrulama | Kalan iş |
|---|---|---|---|---|
| Alternatif ayarların gözden kaçması | Görünmeyen dalın CSS/JS bağlantısı bozulabilir | Bağlantı ve ayar envanteri oluşturuldu; belirsiz stiller korunuyor | Kaynak incelemesi | Aşağıdaki kombinasyonların gerçek önizlemesi |

Bu kayıt kaynak ilişkisini gösterir; bütün bileşenlerin kabulü değildir. CSS ana dosyası `canlitema/assets/style.css`, tema JS'i `assets/scripts.js`; platform referansları `Platform Dosyaları/template-assets` altındadır. Canlı sürüm ve yükleme sırası bilinmiyor. Şablon yolları canlitema köküne göredir.

| Bileşen | Twig / tema JS | CSS / işlev bağlantısı | Ayar / gereken kombinasyon |
|---|---|---|---|
| Menü | moduller/header.twig; moduller/diger/mega_menu.twig, single_menu.twig, mega_menu_side.twig; scripts.js | sidebar-menu, sidebar-menu-type-2, active, op-black; platform Bootstrap ve tema kilidi | header_area.menu_tipi tip_1/2/3; mobil_menu_tipi tip_1/2; mega_menu_resim, alt_kategori_seviye, kategori_icon |
| Arama | moduller/header.twig ve seçilen arama parçası | k form alanı; platform dinamik arama seçicileri | header_area.search_tipi tip_1/2/3; boş sonuç, uzun sorgu ve AJAX öneri |
| Ürün kartı | moduller/urunler/kart.twig; kart_favori_listesi.twig | card-product; addCart/userProductFavourite; carousel data-slide | urun_karti.resim, adet_secim, sepete_ekle, sepete_ekle_right/down, favori_buton; stok 0/pozitif, varyantlı/varyantsız |
| Varyant/fiyat | moduller/urunler/profil.twig ve varyant parçaları; scripts.js select köprüsü | Platformun varyant/fiyat/stok güncellemesi; tema bağımsız fiyat hesaplamaz | urun_profili.varyant_tipi tip_1/2; indirimli/indirimsiz, seçim eksik/tam/stoksuz |
| Galeri/favori | moduller/urunler/resim_alani_tipi/*.twig; kart_favori_listesi.twig | data-favourite-product-id, add-favorite/remove-favorite; userProductFavourite | urun_profili.resim_alani tip_1/2/3; misafir/üye, kayıtlı/kayıtsız, aynı ürün birden çok kart |
| Sayaç | flash-sayac.twig; profil.twig içindeki kargo sayacı | Modüle bağlı DOM; platform kampanya/kargo doğruluğu ayrıca gerekli | Modülün sayfada bir/çok örneği; geçmiş tarih; iş günü/kesim saati mağaza teyidi |
| Video | video-listeleme.twig; profil.twig; assets/video-gallery.js, product-video-popup.js, yt-video-kontrol-02.js | Modal, iframe, odak ve tema kilit sınıfları; başka modalın kilidi korunur | Video var/yok; galeri tipleri; iframe içinden tuş; alternatif popup; AJAX yeniden ekleme |
| Sepet | moduller/sepet/liste.twig, ajax_liste.twig, ozet.twig, butonlar.twig | Platform sepet güncellemesi ve ucretsizKargoLimitleri; payment-final-buttons-1 | Boş/dolu, kupon geçerli/hatalı, tutar/kargo değişimi; etkin blok yerleşimi |
| Ödeme | moduller/odeme altı şablonlar; scripts.js | completePaymentStep/FormData, platform hata ve yüklenme akışı | genel.kargo_fisi, kvkk_aydinlatma_metnini, ticari_elektronik_ileti_metnini, odeme_sepet_ust_alan_gizleme; yöntem var/yok |

Makinece okunabilir seçenekler: [ayar-kombinasyonlari.json](ayar-kombinasyonlari.json). Buradaki seçenekler tema tanımlarından çıkarılmıştır; aktif mağaza değerleri değildir. `ayarlar/modul_yerlesimi.config` opaque olduğu için etkin özel blok ve üst/alt kod eşleşmesi okunamadı. Yönetimde yalnız okuma ile CSS/JS Editörü ve Blok Yönetimi içindeki iki eski JS dosya adları ile updateQuantity/updateQuantityAndPrice/updateDiscountAndPrice ve .discount-box bağlantıları aranmalı. Modül kimliği kanıtsız tahmin edilmemeli.

CSS silme öncesi bu dallar, platformun AJAX/modal HTML'i ve hover/focus/active durumları birlikte değerlendirilir. Kaynakta eşleşme bulunmaması kullanım yokluğu sayılmaz.
