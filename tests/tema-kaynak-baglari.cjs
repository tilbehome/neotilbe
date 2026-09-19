const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const entries = JSON.parse(fs.readFileSync(path.join(root, 'docs/tema-kaynak-baglari.json')));
assert.equal(entries.length, 37);
for (const entry of entries) {
    assert(fs.statSync(path.join(root, 'canlitema', entry.asset)).isFile());
    const source = fs.readFileSync(path.join(root, entry.file), 'utf8');
    assert(source.includes("{{ temaDosyalari('/" + entry.asset + "') }}"), entry.file);
}
console.log('37 asset references: local files exist and template helper bindings present. No Qukasoft rendering tested.');
