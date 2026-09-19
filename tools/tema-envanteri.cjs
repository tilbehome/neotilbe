// Read-only source inventory; the generated report does not certify runtime behavior.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const files = walk(path.join(root, 'canlitema')).sort();
const reviews = JSON.parse(fs.readFileSync(path.join(root, 'docs/denetim-durumlari.json'), 'utf8'));
const results = files.map(file => {
    const relative = path.relative(root, file).replaceAll('\\', '/');
    const buffer = fs.readFileSync(file);
    const extension = path.extname(file);
    const category = relative.startsWith('canlitema/ayarlar/') ? 'Tema ayarları' : extension === '.twig' ? 'Twig şablonları' :
        extension === '.js' ? 'JavaScript' : extension === '.css' ? 'CSS' : 'Görsel, ikon, font ve diğer kaynaklar';
    const text = /\.(twig|js|css|json|config|svg)$/.test(extension) ? buffer.toString('utf8') : '';
    const line = index => text.slice(0, index).split('\n').length;
    const refs = [...text.matchAll(/\{%\s*(?:include|extends|import|from)\s+['"]([^'"]+)['"]/g)]
        .map(m => ({ target: m[1], line: line(m.index), platform: m[1].startsWith('@'),
            exists: m[1].startsWith('@') ? null : fs.existsSync(path.join(root, 'canlitema', m[1])) }));
    let syntax = 'uygulanamaz: bu dosya JS/JSON değil';
    if (extension === '.js' || extension === '.json') {
        try {
            if (extension === '.js') new vm.Script(text, { filename: relative });
            else JSON.parse(text);
            syntax = 'kontrol edildi: yerel ayrıştırma başarılı';
        } catch (error) { syntax = 'doğrulama bekliyor: ' + error.message; }
    }
    const signals = [];
    const patterns = {
        'inline-event': /\bon(?:click|change|submit|keypress|keydown)=/g,
        'raw-output': /\|\s*raw\b/g,
        'structured-data': /schema\.org|application\/ld\+json/g,
        'heading-h1': /<h1\b/g,
        'metadata': /<title\b|canonical|name=["']robots/g,
        'html-sink': /innerHTML|document\.write|\beval\(/g,
        'random-data': /Math\.random\(/g,
        'absolute-theme-url': /https?:\/\/[^\s"']+\/theme\//g,
        'lazy-loading': /loading=["']lazy|gorsel\.lazy/g
    };
    for (const [kind, re] of Object.entries(patterns)) {
        const locations = [...text.matchAll(re)].map(m => line(m.index));
        if (locations.length) signals.push({ kind, lines: locations });
    }
    return { file: relative, category, bytes: buffer.length, sha256: crypto.createHash('sha256').update(buffer).digest('hex'),
        status: reviews[relative] ? 'incelendi (belirtilen kapsam)' : 'listelendi',
        stages: { listelendi: true, incelendi: Boolean(reviews[relative]),
            duzeltildi: reviews[relative]?.fixed || false,
            yereldeDogrulandi: reviews[relative]?.local || false,
            platformdaDogrulamaBekliyor: true },
        review: reviews[relative] || null,
        reason: text ? 'Kaynak envanteri tarandı; dosyanın tüm render/işlev/görsel durumları henüz doğrulanmadı.' :
            'Dosya varlığı/boyutu kaydedildi; kullanım, görsel kalite, boyut/CLS ve alternatif metin bağlamı doğrulanmalı.',
        syntax, refs, signals };
});
fs.writeFileSync(path.join(root, 'docs/tema-envanteri.json'), JSON.stringify(results, null, 2) + '\n');
const rows = results.map(r => '| `' + r.file + '` | ' + r.bytes + ' | ' + r.status +
    (r.stages.duzeltildi ? '; düzeltildi' : '') + (r.stages.yereldeDogrulandi ? '; yerelde doğrulandı' : '') +
    '; platformda doğrulama bekliyor | ' +
    (r.syntax.startsWith('uygulanamaz') ? (r.refs.length + ' sabit şablon bağı; ' + r.signals.length + ' inceleme sinyali') : r.syntax.replaceAll('|', '/')) + ' |');
fs.writeFileSync(path.join(root, 'docs/tema-envanteri.md'), '# Tam tema dosya envanteri\n\n' +
    'Üreten: `node tools/tema-envanteri.cjs`. ' + results.length + ' dosya; hiçbir dosya kapsam dışı bırakılmadı.\n\n' +
    'Listelendi yalnız otomatik envanterdir; incelendi yalnız review.scope içindeki kaynak incelemesidir. Düzeltildi ve yerelde doğrulandı ayrı aşamalardır; bütün dosyanın kabulü değildir. İncelenmeyen dosyalar listelendi olarak kalır. ' +
    'Alt kontroller, SHA-256, satırlı sinyaller ve bağımlılıklar `tema-envanteri.json` içinde. ' +
    'Sinyaller hata hükmü değildir. İşlev/onarım durumları `kapsamli-denetim.md` içinde izlenir.\n\n' +
    '| Dosya | Bayt | Durum | Yerel kontrol |\n|---|---:|---|---|\n' + rows.join('\n') + '\n');
console.log(JSON.stringify({ files: results.length,
    jsJsonIssues: results.filter(r => r.syntax.startsWith('doğrulama')).map(r => ({ file: r.file, syntax: r.syntax })),
    missingTemplateRefs: results.flatMap(r => r.refs.filter(t => t.exists === false).map(t => ({ file: r.file, ...t }))) }, null, 2));
