<?php
// Local Twig syntax/render checks. Platform functions/data are explicit stubs.
// Usage: php tests/twig-local.php <temporary-vendor/autoload.php>
require $argv[1];
$root = dirname(__DIR__);
$loader = new Twig\Loader\ChainLoader([
    new Twig\Loader\ArrayLoader(['__fixture_base.twig' => '{% block modulIcerik %}{% endblock %}{% block modulFooterKodlari %}{% endblock %}']),
    new Twig\Loader\FilesystemLoader($root . '/canlitema'),
]);
$twig = new Twig\Environment($loader, ['autoescape' => 'html', 'cache' => false]);
$twig->addFunction(new Twig\TwigFunction('*', static fn (...$args) => null));
$twig->addFilter(new Twig\TwigFilter('*', static fn ($name, $value) => $value));
$loggedIn = false;
$favorites = [];
$twig->addFunction(new Twig\TwigFunction('kullaniciGirisYaptiMi', static function () use (&$loggedIn) { return $loggedIn; }));
$twig->addFunction(new Twig\TwigFunction('kullaniciFavoriListesi', static function () use (&$favorites) { return $favorites; }));
$page = ['gosterim' => 2, 'icerik' => ['icerik_sayisi' => 0],
    'siralama_tipleri' => [['ID'=>'akilli-siralama', 'baslik'=>'Önerilenler', 'secili'=>false], ['ID'=>'en-yeniler', 'baslik'=>'Yeni ürünler', 'secili'=>true]],
    'aranan' => "O'Neil </script> [test]", 'ana_link' => '/arama', 'filtreleme_anahtari' => 'fixture'];
$twig->addFunction(new Twig\TwigFunction('sayfaBilgileri', static function ($key = null) use (&$page) { return $key === null ? $page : ($page[$key] ?? null); }));
$twig->addFunction(new Twig\TwigFunction('varsayilanBlokModul', static fn () => '__fixture_base.twig'));
$twig->addFunction(new Twig\TwigFunction('cevir', static fn ($key, ...$args) => $key));
$themeOptions = null;
$twig->addFunction(new Twig\TwigFunction('temaAyarlari', static function ($group, $key) use (&$themeOptions) { return $themeOptions === null ? true : ($themeOptions[$group][$key]['deger'] ?? null); }));
$cart = [];
$twig->addFunction(new Twig\TwigFunction('sepetBilgileri', static function ($key) use (&$cart) { return $cart[$key] ?? null; }));
$categories = [];
$twig->addFunction(new Twig\TwigFunction('tumKategoriler', static function (...$args) use (&$categories) { return $categories; }));
$twig->addFunction(new Twig\TwigFunction('listeyiBol', static fn ($items, $size) => array_chunk($items, $size)));
$shipping = [];
$twig->addFunction(new Twig\TwigFunction('ucretsizKargoLimitleri', static function ($key) use (&$shipping) { return $shipping[$key] ?? null; }));
$results = [];
foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root . '/canlitema', FilesystemIterator::SKIP_DOTS)) as $file) {
    if ($file->getExtension() !== 'twig') continue;
    $name = str_replace('\\', '/', substr($file->getPathname(), strlen($root . '/canlitema/')));
    try { $twig->parse($twig->tokenize(new Twig\Source(file_get_contents($file->getPathname()), $name))); $error = null; }
    catch (Throwable $e) { $error = $e->getMessage(); }
    $results[] = ['file' => 'canlitema/' . $name, 'syntaxError' => $error];
}
$report = ['engine' => Twig\Environment::VERSION, 'platformVersionVerified' => false,
    'customFunctionsAndFiltersStubbed' => true, 'results' => $results];
file_put_contents($root . '/docs/twig-local-results.json', json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n");
if (array_filter($results, fn ($r) => $r['syntaxError'] !== null)) {
    throw new RuntimeException('Twig syntax errors: see docs/twig-local-results.json');
}
foreach ([[false, [], false], [true, [['ID'=>21]], true], [true, [['ID'=>99]], false]] as [$loggedIn, $favorites, $expected]) {
    $html = $twig->render('moduller/urunler/kart_favori_listesi.twig', ['urun' => ['ID' => 21]]);
    if (!str_contains($html, 'class="' . ($expected ? 'd-none' : 'd-block') . ' add-favorite"')) {
        throw new RuntimeException('Favorite initial state mismatch.');
    }
}
$category = $twig->render('moduller/kategoriler/sayfalama.twig');
if (str_contains($category, "O'Neil </script>") || substr_count($category, 'name="smart-cat-siralama"') !== 2) {
    throw new RuntimeException('Category escaping/options mismatch.');
}
$directory = $root . '/artifacts/real-twig';
if (!is_dir($directory)) mkdir($directory, 0777, true);
file_put_contents($directory . '/category.html', $category);
$report['renderFixtures'] = ['favoriteGuestSavedOther' => 'passed', 'categorySearchEscapeAndOptions' => 'passed'];
$page = ['ID' => 7, 'maddeler' => [['ID' => 7, 'aktif' => true, 'baslik' => 'Başlık', 'aciklama' => 'İçerik']]];
$help = $twig->render('moduller/yardim/madde_listesi.twig', ['modul' => ['ozel_data_kodu' => 'first']])
    . $twig->render('moduller/yardim/madde_listesi.twig', ['modul' => ['ozel_data_kodu' => 'second']]);
preg_match_all('/\sid="([^"]+)"/', $help, $ids);
preg_match_all('/(?:data-target|data-parent)="#([^"]+)"/', $help, $targets);
if (count($ids[1]) !== count(array_unique($ids[1])) || array_diff($targets[1], $ids[1])) {
    throw new RuntimeException('Help accordion IDs/targets conflict.');
}
$report['renderFixtures']['helpRepeatedModulesAndEqualPageEntryIds'] = 'passed';
$page = ['hata_mesaji' => "O'Neil </script>\nHata", 'odeme_yontemleri' => [
    ['ID' => 1, 'aktif' => true, 'baslik' => 'Birinci'], ['ID' => 2, 'aktif' => false, 'baslik' => 'İkinci']]];
$payment = $twig->render('moduller/odeme/bilgiler/odeme.twig');
if (str_contains($payment, "O'Neil </script>") || !str_contains($payment, 'aria-selected="false"')
    || !str_contains($payment, 'aria-controls="payment-methods-content-1"')) {
    throw new RuntimeException('Payment error escaping/tab relationship mismatch.');
}
$report['renderFixtures']['paymentEscapedErrorAndTabState'] = 'passed';
$profileSource = file_get_contents($root . '/canlitema/moduller/urunler/profil.twig');
$start = strpos($profileSource, '{% set urunKargoUcretsiz');
$end = strpos($profileSource, '<div class="kampanya-item-99x">', strpos($profileSource, '{% endif %}', $start));
$shippingTemplate = $twig->createTemplate(substr($profileSource, $start, $end - $start));
foreach ([[true, false, 'Kargo Bedava!'], [false, true, '37,50 EUR'], [false, false, '']] as [$free, $show, $expected]) {
    $shipping = ['ucretsiz_kargo' => $free, 'kalan_tutar_goster' => $show, 'kalan_tutar' => '37,50 EUR'];
    $html = $shippingTemplate->render([]);
    if (($expected === '' && trim($html) !== '') || ($expected !== '' && !str_contains($html, $expected)) || str_contains($html, '500')) {
        throw new RuntimeException('Product shipping data contract fixture mismatch.');
    }
}
$report['renderFixtures']['productShippingFreeRemainderHidden'] = 'passed';
$page = ['ID' => 21, 'videolu_resimler' => [['tipi' => 'resim', 'normal' => '/fixture.png']]];
$gallery = $twig->render('moduller/urunler/resim_alani_tipi/carousel_atli_karinca.twig');
if (!str_contains($gallery, 'class="product-favourite-kart" data-favourite-product-id="21"')) {
    throw new RuntimeException('Product gallery favorite lost product identity or styling hook.');
}
$report['renderFixtures']['galleryFavoriteExplicitProductContext'] = 'passed';
$labels = new class {
    public $received;
    public function etiketler($product) { $this->received = $product; return ''; }
};
foreach (['atli_karinca_resim', 'carousel_atli_karinca', 'resim_alani_tipi/normal_altta', 'resim_alani_tipi/carousel_atli_karinca'] as $name) {
    $twig->render('moduller/urunler/' . $name . '.twig', ['urunEklentileri' => $labels]);
    if (($labels->received['ID'] ?? null) !== 21) throw new RuntimeException('Gallery label macro lost product data.');
}
foreach ([true, false] as $discount) {
    $cart = ['ozet' => ['indirim_var_mi' => $discount]];
    $promo = $twig->render('sepette-1000-tl-75-indirim.twig');
    if (str_contains($promo, '75 TL') || str_contains($promo, '1000') || !str_contains($promo, 'sipariş özetinde')) {
        throw new RuntimeException('Unverified discount claim remains.');
    }
}
$report['renderFixtures']['galleryLabelProductDataAndPlatformDiscountFlag'] = 'passed';
$themeOptions = json_decode(file_get_contents($root . '/canlitema/ayarlar/tema.json'), true);
$image = new class {
    public function lazy($url, $class = '', $alt = '') {
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#eee"/><text x="55" y="150" font-size="20">Yerel görsel örneği</text></svg>';
        return new Twig\Markup('<img src="data:image/svg+xml;base64,' . base64_encode($svg) . '" class="' . htmlspecialchars($class) . '" alt="' . htmlspecialchars($alt) . '">', 'UTF-8');
    }
};
$cards = '';
foreach ([1, 0] as $stock) {
    $product = ['ID' => 21 + $stock, 'stok' => $stock, 'adi' => 'Yerel örnek: Uzun başlıklı mutfak saklama ürünü ve aksesuarları',
        'adi_alt' => 'Yerel görsel örneği', 'link' => '#fixture', 'resim' => '/fixture.png', 'fiyat' => '1.299,90 TL',
        'indirim' => true, 'indirim_orani_str' => '%10', 'piyasa_fiyati' => '1.444,33 TL'];
    $html = $twig->render('moduller/urunler/kart.twig', ['urun' => $product, 'modul' => ['ozel_data_kodu' => 'fixture'], 'gorsel' => $image, 'urunEklentileri' => $labels]);
    $alternate = $twig->render('moduller/urunler/kat-ozel-kart.twig', ['urun' => $product, 'modul' => ['ozel_data_kodu' => 'fixture'], 'gorsel' => $image, 'urunEklentileri' => $labels]);
    if ($stock === 0 && (!str_contains($html, '<button type="button" disabled') || str_contains($html, 'onclick="addCart'))) {
        throw new RuntimeException('Out-of-stock card still dispatches addCart.');
    }
    if ($stock === 0 && (!str_contains($alternate, '<button type="button" disabled') || str_contains($alternate, 'onclick="addCart'))) {
        throw new RuntimeException('Alternate out-of-stock card still dispatches addCart.');
    }
    $cards .= '<div class="col-6 col-md-4 col-lg-3">' . $html . '</div>';
}
preg_match('/<style type="text\/css">[\s\S]*?<\/style>/', file_get_contents($root . '/canlitema/sablon.twig'), $rootStyle);
$themeStyle = $twig->createTemplate($rootStyle[0])->render([]);
file_put_contents($directory . '/cards.html', $themeStyle . '<div class="container"><p>Yerel sentetik ürünler; gerçek mağaza verisi değildir.</p><div class="row">' . $cards . '</div></div>');
$report['renderFixtures']['cardStockBranches'] = 'passed';
$savedOptions = $themeOptions;
// These are independent supported settings, not a promise that every combination is visually accepted.
foreach ([[1,0,0], [0,1,0], [0,0,1], [1,1,1], [0,0,0]] as $buttons) {
    foreach (['sepete_ekle','sepete_ekle_right','sepete_ekle_down'] as $i => $key) {
        $themeOptions['urun_karti'][$key]['deger'] = $buttons[$i];
    }
    foreach ([0,1] as $stock) foreach ([0,1] as $quantity) {
        $themeOptions['urun_karti']['adet_secim']['deger'] = $quantity;
        $product['stok'] = $stock;
        foreach (['kart','kat-ozel-kart'] as $cardName) {
            $html = $twig->render('moduller/urunler/'.$cardName.'.twig', ['urun'=>$product,'modul'=>['ozel_data_kodu'=>'settings'],'gorsel'=>$image,'urunEklentileri'=>$labels]);
            $expected = $stock ? array_sum($buttons) : 0;
            if (substr_count($html, 'onclick="addCart(') !== $expected ||
                str_contains($html, 'data-product-card-quantity=') !== (bool)$quantity) {
                throw new RuntimeException('Card setting/stock/quantity contract differs: '.$cardName);
            }
        }
    }
}
$themeOptions = $savedOptions;
$report['renderFixtures']['cardIndependentButtonAndQuantitySettings'] = 'passed (local render, no platform requests or visual acceptance)';
$categories = [['ID' => 1, 'adi' => 'Kategori', 'link' => '#fixture', 'alt_kategori_var_mi' => true,
    'alt_kategoriler' => [['ID' => 2, 'adi' => 'Alt kategori', 'link' => '#child']], 'kapak' => '/fixture.png']];
foreach ([0, 1] as $menuImage) {
    $themeOptions['header_area']['mega_menu_resim']['deger'] = $menuImage;
    $menu = $twig->render('moduller/diger/mega_menu.twig');
    if (preg_match_all('/<div\b/', $menu) !== substr_count($menu, '</div>')) {
        throw new RuntimeException('Mega menu conditional column is unbalanced.');
    }
}
$report['renderFixtures']['megaMenuImageOnOffBalance'] = 'passed';
$page = ['ID' => 42, 'fiyat' => "1'234,50 CHF", 'indirim' => true, 'piyasa_fiyati' => "1'500,00 CHF",
    'indirimli_fiyatlar' => ['sabit_indirim' => ['aktif' => true, 'kdv_dahil' => "1'200,00 CHF"]]];
preg_match('/<script type="text\/javascript">([\s\S]*?)<\/script>/', file_get_contents($root . '/canlitema/moduller/urunler/hizli_sepet_kutusu.twig'), $fastScript);
file_put_contents($directory . '/fast-cart.js', $twig->createTemplate($fastScript[1])->render([]));
file_put_contents($root . '/docs/twig-local-results.json', json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n");
echo 'Twig ' . Twig\Environment::VERSION . ': ' . count($results) . ' templates parsed; ' . count(array_filter($results, fn ($r) => $r['syntaxError'] !== null)) . " errors. Favorite guest/saved/other-product fixtures passed. Not Qukasoft acceptance.\n";
