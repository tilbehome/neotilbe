<?php
// Explicit local composition, not Qukasoft's private base layout/block engine.
require $argv[1];
$root = dirname(__DIR__);
$page = []; $cart = []; $loggedIn = false;
$base = '{% block modulBaslik %}{% endblock %}{% block modulIcerik %}{% endblock %}';
$loader = new Twig\Loader\ChainLoader([
    new Twig\Loader\ArrayLoader(['__base' => $base, '__empty' => '', '@default/addons/product_special_fields.twig' => '<p data-platform-placeholder>Platform özel alan makrosu yerelde yok.</p>']),
    new Twig\Loader\FilesystemLoader($root . '/canlitema')
]);
$twig = new Twig\Environment($loader, ['autoescape'=>'html']);
$twig->addFunction(new Twig\TwigFunction('*', static fn (...$args) => null));
$twig->addFilter(new Twig\TwigFilter('*', static fn ($name,$value) => $value));
$options=json_decode(file_get_contents($root.'/canlitema/ayarlar/tema.json'),true);
$twig->addFunction(new Twig\TwigFunction('temaAyarlari',static fn($group,$key)=>$options[$group][$key]['deger']??null));
$twig->addFunction(new Twig\TwigFunction('sayfaBilgileri',static function($key=null)use(&$page){return $key===null?$page:($page[$key]??null);}));
$twig->addFunction(new Twig\TwigFunction('sepetBilgileri',static function($key)use(&$cart){return $cart[$key]??null;}));
$twig->addFunction(new Twig\TwigFunction('varsayilanBlokModul',static fn()=>'__base'));
$twig->addFunction(new Twig\TwigFunction('varsayilanBosDosya',static fn()=>'__empty'));
$twig->addFunction(new Twig\TwigFunction('cevir',static fn($key,...$args)=>$key));
$twig->addFunction(new Twig\TwigFunction('statikLinkler',static fn($key)=>'#local-'.$key));
$twig->addFunction(new Twig\TwigFunction('temaDosyalari',static fn($key)=>'__theme__'.$key));
$twig->addFunction(new Twig\TwigFunction('kullaniciGirisYaptiMi',static function()use(&$loggedIn){return $loggedIn;}));
$twig->addFunction(new Twig\TwigFunction('listeyiBol',static fn($items,$n)=>array_chunk($items,$n)));
$socialActive=false;
$storeOptions=[];
$twig->addFunction(new Twig\TwigFunction('ayarlar',static function($key)use(&$storeOptions){return $storeOptions[$key]??null;}));
$twig->addFunction(new Twig\TwigFunction('facebookLogin',static function()use(&$socialActive){return ['aktif'=>$socialActive,'link'=>'#local-social'];}));
$categories=[['ID'=>1,'adi'=>'Uzun kategori ve mutfak aksesuarları','link'=>'#category','resim'=>null,'alt_kategoriler'=>[]]];
$twig->addFunction(new Twig\TwigFunction('tumKategoriler',static fn(...$args)=>$categories));
$twig->addFunction(new Twig\TwigFunction('ucretsizKargoLimitleri',static fn($key)=>['ucretsiz_kargo'=>false,'kalan_tutar_goster'=>true,'kalan_tutar'=>'37,50 TL'][$key]??null));
$image=new class {public function lazy($src,$class='',$alt=''){return new Twig\Markup('<img src="'.htmlspecialchars($src??'').'" class="'.htmlspecialchars($class).'" alt="'.htmlspecialchars($alt).'">','UTF-8');}};
$labels=new class {public function __call($name,$args){return '';}};
$ctx=['gorsel'=>$image,'urunEklentileri'=>$labels,'modul'=>['ozel_data_kodu'=>'local-page','sayfalar'=>'__empty','kart'=>'moduller/urunler/kart.twig']];
$render=static fn($file)=>$twig->render($file,$ctx);
$product=['ID'=>21,'adi'=>'Uzun başlıklı yerel örnek mutfak saklama ürünü ve aksesuarları','adi_alt'=>'Yerel ürün','link'=>'#product','resim'=>'__placeholder__','fiyat'=>'1.299,90 TL','stok'=>1,'videolu_resimler'=>[['tipi'=>'resim','normal'=>'__placeholder__','kucuk'=>'__placeholder__']], 'resimler'=>[], 'varyantlar'=>[], 'indirim'=>false];
$card=$twig->render('moduller/urunler/kart.twig',$ctx+['urun'=>$product]);
$loginWithoutSocial=$render('moduller/uyelik/giris_yap.twig');
if(str_contains($loginWithoutSocial,'social-login-19kfsj'))throw new RuntimeException('Empty social login panel remains');
$socialActive=true;
if(!str_contains($render('moduller/uyelik/giris_yap.twig'),'Facebook ile Giriş Yap'))throw new RuntimeException('Enabled social login missing');
$socialActive=false;
$emptySocialFooter=$render('moduller/footer.twig');
if(str_contains($emptySocialFooter,'aria-label="Facebook"'))throw new RuntimeException('Empty social URL remains clickable');
$storeOptions=['facebook_adresi'=>'#local-facebook'];
if(!str_contains($render('moduller/footer.twig'),'href="#local-facebook"'))throw new RuntimeException('Configured social link missing');
$storeOptions=[];
$header=$render('moduller/header.twig'); $footer=$render('moduller/footer.twig');
preg_match('/<style type="text\/css">([\s\S]*?)<\/style>/',file_get_contents($root.'/canlitema/sablon.twig'),$match);
$variables=$twig->createTemplate($match[1])->render([]);
$dir=$root.'/artifacts/full-pages';if(!is_dir($dir))mkdir($dir,0777,true);
$report=['scope'=>'Local explicit composition; private Qukasoft base, macros, active module placement and language data are not reproduced. No server transactions.', 'pages'=>[]];
foreach(['home','category','product','cart','empty-cart','payment','login','account','content'] as $name){
    try {
        $page=$product+['odeme_adimi'=>2,'baslik'=>'Yerel içerik başlığı','icerik'=>'<p>Yerel uzun içerik örneği.</p>','tema_dosyasi'=>'sayfa'];
        $cart=['durum'=>true,'urunler'=>[['ID'=>1,'urun'=>$product,'adet'=>2,'birim_fiyat'=>'1.299,90 TL','toplam_fiyat'=>'2.599,80 TL']],'ozet'=>['adet'=>2,'toplam'=>'2.599,80 TL','genel_toplam'=>'2.599,80 TL']];
        $bodyClass='';
        if($name==='home')$body='<section class="row">'.str_repeat($card,4).'</section>'.$render('video-listeleme.twig');
        if($name==='category'){$page=['gosterim'=>2,'icerik'=>['icerik_sayisi'=>4],'siralama_tipleri'=>[['ID'=>'local','baslik'=>'Önerilenler','secili'=>true]],'aranan'=>'Uzun arama metni','ana_link'=>'#search'];$body=$render('moduller/kategoriler/sayfalama.twig').'<div class="row">'.str_repeat($card,4).'</div>';}
        if($name==='product'){$bodyClass='product-body';$body=$render('moduller/urunler/profil.twig');}
        if($name==='cart'){$bodyClass='cart-body';$body='<div class="row"><div class="col-lg-8">'.$render('moduller/sepet/liste.twig').'</div><div class="col-lg-4">'.$render('moduller/sepet/ozet.twig').$render('moduller/sepet/butonlar.twig').'</div></div>';}
        if($name==='empty-cart'){$cart=['durum'=>false];$body=$render('moduller/sepet/sepet_bos.twig');}
        if($name==='payment'){$bodyClass='payment-body';$page['hata_mesaji']='Yerel hata örneği';$page['odeme_yontemleri']=[];$body='<div class="row"><div class="col-lg-8">'.$render('moduller/odeme/bilgiler/odeme.twig').'<p data-platform-placeholder>Ödeme sağlayıcısı ve adres/kargo AJAX içeriği yerelde yok.</p></div><div class="col-lg-4">'.$render('moduller/odeme/ozet.twig').'</div></div>';}
        if($name==='login')$body=$render('moduller/uyelik/giris_yap.twig').$render('moduller/uyelik/uyelik_formu.twig');
        if($name==='account')$body=$render('moduller/hesap/alt_sayfalar/uyelik_bilgilerim.twig');
        if($name==='content')$body=$render('moduller/statik_sayfalar/icerik.twig');
        $html='<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>'.$variables.'</style><body class="'.$bodyClass.'"><p data-local-notice>YEREL SENTETİK BİRLEŞİM: platform sayfası değildir; işlem yapmayın.</p>'.$header.'<main class="container">'.$body.'</main>'.$footer.'</body></html>';
        $html=preg_replace('/<script\b[^>]*>[\s\S]*?<\/script>/i','',$html);
        file_put_contents($dir.'/'.$name.'.html',$html);
        $report['pages'][]=['name'=>$name,'rendered'=>true,'visualInspected'=>false];
    }catch(Throwable $e){$report['pages'][]=['name'=>$name,'rendered'=>false,'error'=>$e->getMessage()];}
}
file_put_contents($root.'/docs/full-page-fixtures.json',json_encode($report,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)."\n");
echo json_encode($report,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)."\n";
