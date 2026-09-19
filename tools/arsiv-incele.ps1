$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$workspace = Split-Path $PSScriptRoot -Parent
$candidates = @(Get-ChildItem -LiteralPath $workspace -File -Filter '*_backup_*.zip')
$referenceDir = Join-Path $workspace 'referans-arsivler'
if (Test-Path -LiteralPath $referenceDir) { $candidates += Get-ChildItem -LiteralPath $referenceDir -File -Filter '*.zip' }
$reports = foreach ($file in $candidates) {
    $zip = [IO.Compression.ZipFile]::OpenRead($file.FullName)
    try {
        $items = foreach ($entry in $zip.Entries) {
            if ($entry.FullName.EndsWith('/')) { continue }
            if ($entry.Length -gt 50MB) { throw 'Archive entry exceeds inspection limit.' }
            $stream = $entry.Open()
            $memory = [IO.MemoryStream]::new()
            try { $stream.CopyTo($memory); $bytes = $memory.ToArray() } finally { $stream.Dispose(); $memory.Dispose() }
            $sha = [Security.Cryptography.SHA256]::Create()
            try { $hash = ([BitConverter]::ToString($sha.ComputeHash($bytes))).Replace('-', '').ToLowerInvariant() } finally { $sha.Dispose() }
            $flags = @()
            if ($entry.FullName -match '(^|/)(\.env[^/]*|credentials[^/]*|secrets[^/]*)$|\.(pem|key|p12|pfx|sql|csv|zip)$') { $flags += 'sensitive-or-nested-file-type' }
            if ($entry.FullName -match '(^/|(^|/)\.\.(/|$)|^[A-Za-z]:)') { $flags += 'unsafe-path' }
            $legacyReferences = @()
            $metadata = $null
            if ($entry.FullName -match '\.(twig|js|css|json|config|html|txt|php)$') {
                $text = [Text.Encoding]::UTF8.GetString($bytes)
                if ($text -match '(?i)(AKIA[A-Z0-9]{16}|gh[pousr]_[A-Za-z0-9]{30,}|-----BEGIN .*PRIVATE KEY|(?:api[_-]?key|secret|access[_-]?token|password)\s*[:=]\s*["''][^"''\s]{12,}["''])') { $flags += 'credential-pattern-review' }
                if ($entry.FullName.EndsWith('.config')) { $flags += 'opaque-settings-review' }
                foreach ($symbol in @('cok-al-az-ode-indirim.js','tahmini-kargom.js','updateQuantityAndPrice','updateDiscountAndPrice')) {
                    if ($text.Contains($symbol)) { $legacyReferences += $symbol }
                }
                if ($entry.FullName -eq 'ayarlar/tanim.json') {
                    $definition = $text | ConvertFrom-Json
                    $metadata = @{ id = $definition.id; name = $definition.adi }
                }
            }
            [pscustomobject]@{ path=$entry.FullName; bytes=$entry.Length; sha256=$hash; flags=$flags; legacyReferences=$legacyReferences; metadata=$metadata }
        }
        [pscustomobject]@{ archive=$file.Name; sha256=(Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant(); entries=@($items); privacyCleared=$false }
    } finally { $zip.Dispose() }
}
$json = ConvertTo-Json -InputObject @($reports) -Depth 8
[IO.File]::WriteAllText((Join-Path $workspace 'docs/arsiv-envanteri.json'), $json, [Text.UTF8Encoding]::new($false))
$reports | ForEach-Object { [pscustomobject]@{archive=$_.archive; files=$_.entries.Count; flaggedFiles=@($_.entries | Where-Object {$_.flags.Count}).Count; privacyCleared=$_.privacyCleared} }
