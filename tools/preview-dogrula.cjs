// Extract into a fresh temporary directory and compare every file to the source Git commit.
// No upload; no archive or reference is modified. Opaque settings are not privacy-cleared.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const candidate = path.resolve(process.argv[2]);
assert(candidate.startsWith(path.join(root, 'artifacts') + path.sep));
const manifest = JSON.parse(fs.readFileSync(path.join(candidate, 'manifest.json')));
assert.equal(path.basename(manifest.package), manifest.package);
assert(/^[a-f0-9]{40}$/.test(manifest.commit));
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const zip = path.join(candidate, manifest.package);
assert.equal(hash(fs.readFileSync(zip)), manifest.packageSHA256);
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'tilbe-preview-check-'));
execFileSync('powershell.exe', ['-NoProfile', '-Command', `
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive=[IO.Compression.ZipFile]::OpenRead($env:TILBE_CHECK_ZIP)
try {
  foreach($entry in $archive.Entries) {
    $target=[IO.Path]::GetFullPath((Join-Path $env:TILBE_CHECK_DIR $entry.FullName))
    if(-not $target.StartsWith($env:TILBE_CHECK_DIR+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)) { throw 'Unsafe ZIP path' }
    if($entry.FullName.Contains('\\') -or $entry.FullName.StartsWith('/')) { throw 'Noncanonical ZIP path' }
  }
} finally { $archive.Dispose() }
[IO.Compression.ZipFile]::ExtractToDirectory($env:TILBE_CHECK_ZIP,$env:TILBE_CHECK_DIR)
`], {windowsHide:true, env:{...process.env,TILBE_CHECK_ZIP:zip,TILBE_CHECK_DIR:temp},stdio:'pipe'});
const entries = fs.readdirSync(temp, {recursive:true}).filter(p => fs.statSync(path.join(temp,p)).isFile()).map(p=>p.replaceAll('\\','/'));
assert.deepEqual([...entries].sort(),manifest.files.map(f=>f.path).sort(),'Extracted paths must match, including case');
const git = process.env.GIT_PATH || 'C:/Program Files/Git/cmd/git.exe';
const secrets = /AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/;
for(const entry of manifest.files) {
    assert(!/^(?:tests|docs|orjinaltema|Platform[^/]*|referans-arsivler)\//i.test(entry.path));
    assert(!/(^|\/)(?:\.env(?:\..*)?|credentials\.json|secrets\.json)$|\.(?:zip|pem|key|p12|pfx)$/i.test(entry.path));
    const data = fs.readFileSync(path.join(temp, entry.path));
    const source = execFileSync(git,['show',manifest.commit+':canlitema/'+entry.path],{cwd:root,maxBuffer:10*1024*1024});
    assert.equal(hash(data),entry.stagedSHA256,entry.path);
    assert.equal(hash(source),entry.sourceSHA256,entry.path);
    if(entry.path === 'ayarlar/tanim.json') {
        const expected = JSON.parse(source);
        expected.id=manifest.id; expected.adi=manifest.id;
        assert.deepEqual(JSON.parse(data),expected);
    } else assert(data.equals(source),'Unexpected source difference: '+entry.path);
    if(/\.(?:twig|js|css|json|svg|html)$/i.test(entry.path)) assert(!secrets.test(data.toString('utf8')),'Credential pattern requires private review; value suppressed');
}
const paths = new Set(entries);
let sourceRefs=0;
const legacyThemePaths=[];
for(const entry of entries.filter(p=>/\.(?:twig|css|js|json)$/.test(p))) {
    fs.readFileSync(path.join(temp,entry),'utf8').split('\n').forEach((line,i)=>{
        if(/\/theme\/(?:___shuttle|goldtheme)\//.test(line)) legacyThemePaths.push({file:entry,line:i+1});
    });
}
for(const entry of entries.filter(p=>p.endsWith('.twig'))) {
    const source=fs.readFileSync(path.join(temp,entry),'utf8');
    for(const match of source.matchAll(/temaDosyalari\(\s*['"]([^'"]+)['"]\s*\)/g)) {
        const target=match[1].replace(/^\//,'').split('?')[0];
        assert(paths.has(target),'Case-sensitive source missing: '+entry+' -> '+target);
        sourceRefs++;
    }
}
const result={commit:manifest.commit,id:manifest.id,extractedToFreshDirectory:true,files:entries.length,
    gitContentMatched:true,onlyIdentityMetadataDiffers:true,caseSensitiveStaticTwigReferences:sourceRefs,
    literalLegacyThemePaths:legacyThemePaths,
    excludedFileTypesFound:0,commonCredentialPatternsFound:0,opaqueSettingsPrivacyVerified:false,
    platformImportVerified:false,note:'Dynamic paths, external resources, runtime loading and opaque settings isolation need platform verification.'};
fs.writeFileSync(path.join(candidate,'extraction-check.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
