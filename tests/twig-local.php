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
$twig->addFunction(new Twig\TwigFunction('temaAyarlari', static fn (...$args) => true));
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
preg_match_all('/\bid="([^"]+)"/', $help, $ids);
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
file_put_contents($root . '/docs/twig-local-results.json', json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n");
echo 'Twig ' . Twig\Environment::VERSION . ': ' . count($results) . ' templates parsed; ' . count(array_filter($results, fn ($r) => $r['syntaxError'] !== null)) . " errors. Favorite guest/saved/other-product fixtures passed. Not Qukasoft acceptance.\n";
