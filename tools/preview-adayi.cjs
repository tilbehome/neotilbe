// Local staging only. This does not upload, activate, or certify an import format.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const git = process.env.GIT_PATH || 'C:/Program Files/Git/cmd/git.exe';
const run = (...args) => execFileSync(git, args, { cwd: root, encoding: 'utf8' }).trim();
if (run('status', '--porcelain')) throw new Error('Commit or preserve working changes before staging.');
const commit = run('rev-parse', 'HEAD');
const id = 'goldfix01_' + commit.slice(0, 12);
const output = path.join(root, 'artifacts', id);
if (fs.existsSync(output)) throw new Error('Candidate already exists; refusing overwrite.');
const files = run('ls-files', '-z', '--', 'canlitema').split('\0').filter(Boolean);
const manifest = { commit, id, importFormatVerified: false, uploaded: false, files: [] };
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
console.log(JSON.stringify({ output, id, files: files.length, commit, importFormatVerified: false }));
