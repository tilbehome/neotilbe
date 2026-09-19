| Sorun | Müşteriye etkisi | Yapılan onarım | Doğrulama | Kalan iş |
|---|---|---|---|---|
| SB2: Smartbanner yanlış öğenin boşluğunu geri yüklüyor | Alternatif pushSelector hedefinde banner kapanınca sayfa yukarı/aşağı kayabilir | Hedefin kendi margin/padding değerleri, kullanılan moda göre korunur; geçiş sınıfı aynı hedeften kaldırılır | Referans jQuery/Bootstrap + gerçek Smartbanner CSS/JS; önce 13px yerine 5px, sonra 13px; layer açık/kapalı geçti | Gerçek cihaz, mağaza meta/cookie ve header bileşimi |

Kaynak: **tema kodu**, `canlitema/assets/smartbanner.js:17` constructor ve show/hide. `sablon.twig` eklentiyi mevcut yükleme noktasından kullanır. Başlangıç kodu pushSelector seçeneğini sağlasa da ilk boşluğu daima html'den, padding için bile margin-top'tan alıyordu. Callback de geçiş sınıfını daima html'den kaldırıyordu. Bu onarım varsayılan html hedefini ve mevcut kütüphaneyi korur; yeni seçenek/kütüphane eklemez. Bugünkü mağazanın alternatif hedef kullandığı iddia edilmiyor.

`tests/smartbanner-spacing.cjs` ağ kapalı tarayıcıda gerçek referans kitaplıkları ve CSS ile farklı html/body boşlukları kurar; iki mevcut yerleşim modunda kapanış sonucunu kontrol eder. Yerel hesaplanan stil doğrulamasıdır; mobil mağaza görsel kabulü veya gerçek cookie davranışı değildir. Önceki başlık escaping, pushSelector ve Bootstrap transition helper koruma kontrolleri de sürdürülür.

Yerelde tamamlanan: yukarıdaki somut kök neden ve onarım. Yerelde kalan: ayar kombinasyonları ve son kaynağın diğer tam sayfa görsel/etkileşim kapsamları (08/09 raporları). Platformda bekleyen: gerçek cihaz, mağaza app meta verisi, uygulama içi tarayıcı, banner kapanma cookie'si ve diğer header/menü kilitleriyle birlikte kabul. Aktif mağazaya veya müşteri verisine yazılmadı.

`goldfix01_15897dfabc9b` kontrol noktası bu son JS onarımını içermez; güncel aday için yalnız onizleme-adayi.md kullanılmalı.
