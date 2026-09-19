const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const issues = JSON.parse(fs.readFileSync(path.join(root, 'docs/sorun-durumlari.json')));
const seen = new Set();
for (const issue of issues) {
    if (seen.has(issue.id)) throw new Error('Duplicate issue: ' + issue.id);
    seen.add(issue.id);
}
const safe = text => String(text || '').replaceAll('|', '/').replaceAll('\n', ' ');
const table = '| Sorun | Konum | Onarım / gereken iş | Tek güncel durum | Kanıt |\n|---|---|---|---|---|\n' +
    issues.map(i => '| ' + [i.id, i.location, i.remedy, i.status, i.evidence].map(safe).join(' | ') + ' |').join('\n');
const file = path.join(root, 'docs/kapsamli-denetim.md');
const source = fs.readFileSync(file, 'utf8');
fs.writeFileSync(file, source.replace(/<!-- CURRENT_ISSUES_START -->[\s\S]*?<!-- CURRENT_ISSUES_END -->/,
    '<!-- CURRENT_ISSUES_START -->\n' + table + '\n<!-- CURRENT_ISSUES_END -->'));
