# Platform uyumu 01 — değişiklikler ve kontrol listesi

Dal: `fix/platform-uyum-01`. Bu grup yalnız giriş globali, şifre görünürlüğü ve mobil menü kapanışı içindir. Platform/orijinal tema kaynakları değiştirilmedi, yeni çalışma zamanı kütüphanesi eklenmedi.

## Yapılan değişiklikler

- `canlitema/moduller/uyelik/giris_yap.twig`: özel `userLogin` ve desteklenmeyen `remember-me` kodu kaldırıldı. `onsubmit="return userLogin(this)"`, `returnUrl`, alan adları ve kayıt çağrısı korundu. AJAX, iki faktör, yanıt/yönlendirme işlemleri platformda kaldı. Göz simgesi artık `this` geçirir; yardımcı yalnız en yakın `.password-container` içindeki `input.password` alanını değiştirir. Mevcut simge, sınıf ve yerleşim korunur.
- `canlitema/assets/scripts.js`: menü ve hesap paneli durumu overlay ile tek yardımcı üzerinden eşitlenir. X menüyü kapatır; hesap paneli açıksa overlay/kilit korunur. Arka plan, menü açıksa menüyü; yalnız hesap paneli açıksa hesabı kapatır. Tekrarlanan kapatma durumu tersine çevirmez.
- `canlitema/assets/style.css`: yalnız `body.tilbe-sidebar-open` kaydırma kilidi eklendi. Tema artık ortak `hidden-scroll` sınıfını açıp kapatmaz; platformun `hidden-scroll`, Bootstrap'ın `modal-open` sınıfları ve inline stilleri korunur. Kendi kilidinin iki bildirimi platformdaki mevcut kilidin `overflow:hidden` ve `position:relative` davranışını aynı öncelikte sürdürür; genel CSS çakışmasını örtmek için eklenmemiştir.

## Yerel kontroller

`tests/platform-uyum-01.cjs`, Node 22+ ve yüklü Edge/Chromium ile çalışır:

```text
node tests/platform-uyum-01.cjs
```

Gerekirse `BROWSER_PATH` ile tarayıcı yolu verilir. Ek npm paketi gerekmez. Test izole geçici tarayıcı profili kullanır; mağazaya bağlanmaz, sayfanın HTTP/HTTPS istekleri engellenir. Profil çalışma alanı dışında işletim sistemi geçici dizininde kalabilir.

Sonuç: **25 tarayıcı kontrolü geçti**; ayrıca kaynakta `userLogin` override ve `remember-me` bulunmadığı doğrulandı.

- Gerçek referans paketindeki jQuery ve `userLogin` gövdesiyle global kimliğin korunması, formun platform AJAX yolunu çağırması ve `returnUrl` alanı.
- Sahte `two_factor` yanıtının referans fonksiyonundan beklenen modal çağrısına ulaşması.
- Giriş, kayıt ve tekrar alanlarının ayrı ayrı göster/gizlenmesi; diğer alanların gizli kalması ve simge değişimi.
- Her iki menü seçicisi için X/arka plan kapanışı, tekrar kapatma, menü+hesap birlikteliği, hesap panelinin kendi kapanışı.
- Menüden önce ve menü açıkken sonradan eklenen platform/modal kilitlerinin korunması; başka kilit yoksa kaydırmanın geri gelmesi. Yerel platform ve tema CSS’iyle computed `overflow` kontrolü.

**Sınır:** Twig gerçek Qukasoft motorunda render edilmedi; test formu Twig direktifleri çıkarılmış sentetik HTML'dir. AJAX ve modal taşıması test tarafından yakalanır; gerçek sunucuya giriş yapılmaz, gerçek iki faktör kodu gönderilmez. Başarılı girişin sunucu oturumu/yönlendirmesi, canlı CSS/JS yükleme sırası, gerçek mobil dokunma ve gerçek modal geçişleri test edilmiş sayılmaz. Bu kontroller Qukasoft kabul testinin yerine geçmez.

## Qukasoft'ta kısa kabul listesi — henüz yapılmadı

Gerçek müşteri hesabı yerine test hesabı ve mümkünse ayrı Qukasoft test teması kullanın.

1. Giriş sayfasında hatalı/doğru parola: tek giriş isteği, platform mesajı, doğru oturum. Ödeme öncesi girişte `returnUrl` ile beklenen adıma dönüş. Misafir devam bağlantısının görünümü aynı kalmalı.
2. İki faktör açık test hesabı: platform doğrulama modalı, hatalı/doğru kod ve yönlendirme. Hızlı giriş/modal girişi ayrıca kontrol edilmeli.
3. Giriş/kayıt sekmelerinde her üç göz simgesini ayrı ayrı tıklayın. Yalnız kendi alanı ve simgesi değişmeli; form kendiliğinden gönderilmemeli. Aynı sayfada giriş modalı varsa bu izolasyonu orada da kontrol edin.
4. Mobilde menüyü açıp X, arka plan ve tekrar aç/kapat deneyin: görünmez overlay kalmamalı, sayfa kaydırılabilmeli. Hesap paneli açıkken menüyü kapatın: hesap, overlay ve kaydırma kilidi kalmalı; hesap kapatılınca kalkmalı.
5. Platform filtre paneli veya modal açıkken menü kapanışı: diğer panel/modalın kilidi korunmalı. Son panel/modal kapanınca kaydırma geri gelmeli. iOS Safari ve Android Chrome'da dokunma/kaydırma, yatay-dikey geçiş kontrol edilmeli.
6. Console'da yeni hata ve Network'te çift giriş isteği olmadığını kontrol edin. Bu dalı main'e birleştirmek veya canlıya yüklemek bu çalışmanın parçası değildir.
