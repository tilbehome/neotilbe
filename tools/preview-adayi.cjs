// Local candidate only. ZIP layout matches a read-only export; platform import remains untested.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const git = process.env.GIT_PATH || 'C:/Program Files/Git/cmd/git.exe';
const run = (...args) => execFileSync(git, args, { cwd: root, encoding: 'utf8' }).trim();
if (run('status', '--porcelain')) throw new Error('Commit or preserve working changes before staging.');
const commit = run('rev-parse', 'HEAD');
if (run('branch', '--show-current') !== 'fix/platform-uyum-01') throw new Error('Use the repair branch.');
const references = JSON.parse(fs.readFileSync(path.join(root, 'docs/arsiv-envanteri.json')));
const reference = references.find(r => r.archive === 'goldtheme_backup_20260919_123922.zip');
if (!reference || !reference.entries.some(e => e.path === 'ayarlar/tanim.json')) throw new Error('Export evidence missing.');
const referencePath = [path.join(root, reference.archive), path.join(root, 'referans-arsivler', reference.archive)].find(fs.existsSync);
if (!referencePath || crypto.createHash('sha256').update(fs.readFileSync(referencePath)).digest('hex') !== reference.sha256) {
    throw new Error('Read-only reference differs from inspected export.');
}
const id = 'goldfix01_' + commit.slice(0, 12);
const output = path.join(root, 'artifacts', id);
if (fs.existsSync(output)) throw new Error('Candidate already exists; refusing overwrite.');
const files = run('ls-files', '-z', '--', 'canlitema').split('\0').filter(Boolean);
const manifest = { commit, id, importFormatVerified: false, archiveStructureMatched: true,
    referenceArchive: reference.archive, referenceSHA256: reference.sha256,
    uploaded: false, opaqueSettingsIsolationVerified: false, files: [] };
for (const file of files) {
    const source = path.join(root, file);
    if (!fs.lstatSync(source).isFile()) throw new Error('Non-regular source: ' + file);
    if (/(^|\/)(\.env[^/]*|credentials\.json|secrets\.json)$|\.(pem|key|p12|pfx|zip)$/i.test(file)) {
        throw new Error('Review excluded file type: ' + file);
    }
    const relative = file.slice('canlitema/'.length);
    const original = fs.readFileSync(source);
    let content = original;
    if (relative === 'ayarlar/tanim.json') {
        const metadata = JSON.parse(original);
        metadata.id = id;
        metadata.adi = id;
        content = Buffer.from(JSON.stringify(metadata, null, 2) + '\n');
    }
    const target = path.join(output, 'theme-source', relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, { flag: 'wx' });
    const hash = b => crypto.createHash('sha256').update(b).digest('hex');
    manifest.files.push({ path: relative, sourceSHA256: hash(original), stagedSHA256: hash(content) });
}
fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
const zip = execFileSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File',
    path.join(root, 'tools/preview-zip.ps1'), '-Candidate', output], { encoding: 'utf8', windowsHide: true }).trim();
manifest.package = path.basename(zip);
manifest.packageSHA256 = crypto.createHash('sha256').update(fs.readFileSync(zip)).digest('hex');
manifest.packageFilesVerified = true;
fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ output, zip, id, files: files.length, commit, importFormatVerified: false }));
