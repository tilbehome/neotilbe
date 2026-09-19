// Source evidence only: this does not render Twig or certify platform data contracts.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const files = walk(path.join(root, 'canlitema')).filter(f => /\.(twig|js|css|json|config|svg)$/.test(f));
const reference = fs.readFileSync(path.join(root, 'Platform Dosyaları/template-assets/scripts.min.js'), 'utf8');
const records = files.map(file => {
    const text = fs.readFileSync(file, 'utf8');
    const relative = path.relative(root, file).replaceAll('\\', '/');
    const original = path.join(root, relative.replace(/^canlitema\//, 'orjinaltema/'));
    const twig = [...text.matchAll(/\{[{%][\s\S]*?[}%]\}/g)].map(m => m[0]).join('\n');
    const helpers = [...new Set([...twig.matchAll(/\b([a-zA-Z_]\w*)\(/g)].map(m => m[1]))].sort();
    const events = [...text.matchAll(/\bon(?:click|change|submit|keypress|keydown)="([^"\n]*(?:\n[^"\n]*)*)"/gi)].map(m => ({
        line: text.slice(0, m.index).split('\n').length,
        calls: [...new Set([...m[1].matchAll(/\b([a-zA-Z_]\w*)\(/g)].map(x => x[1]))].map(name => ({ name,
            declaredInPlatformReference: reference.includes('function ' + name + '(') }))
    }));
    return { file: relative, listed: true, manuallyReviewed: false,
        note: 'Mekanik kaynak karşılaştırması; insan incelemesi denetim-durumlari.json içinde ayrı tutulur.',
        identicalToOriginal: fs.existsSync(original) ? fs.readFileSync(original, 'utf8') === text : null,
        twigHelpers: helpers, inlineEvents: events,
        inheritance: [...text.matchAll(/\{%\s*(?:extends|include|import|from)\s+([\s\S]*?)%\}/g)].map(m => m[1].trim()),
        rawLines: [...text.matchAll(/\|\s*raw\b/g)].map(m => text.slice(0, m.index).split('\n').length) };
});
fs.writeFileSync(path.join(root, 'docs/tema-sozlesmeleri.json'), JSON.stringify(records, null, 2) + '\n');
console.log(JSON.stringify({ textSources: records.length, inlineEventFiles: records.filter(r => r.inlineEvents.length).length,
    note: 'Source comparison only; no new manually-reviewed status granted.' }));
