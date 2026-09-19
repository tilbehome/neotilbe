param([Parameter(Mandatory=$true)][string]$Candidate)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$candidatePath = (Resolve-Path -LiteralPath $Candidate).Path
$manifest = Get-Content -LiteralPath (Join-Path $candidatePath 'manifest.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$source = Join-Path $candidatePath 'theme-source'
$target = Join-Path $candidatePath ($manifest.id + '.zip')
if (Test-Path -LiteralPath $target) { throw 'Refusing to overwrite an existing package.' }
$writer = [IO.Compression.ZipFile]::Open($target, [IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($item in $manifest.files) {
        $entryName = $item.path.Replace('\', '/')
        [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($writer, (Join-Path $source $item.path), $entryName,
            [IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
} finally { $writer.Dispose() }
$archive = [IO.Compression.ZipFile]::OpenRead($target)
try {
    $files = @($archive.Entries | Where-Object { -not $_.FullName.EndsWith('/') })
    if ($files.Count -ne $manifest.files.Count) { throw 'Package file count mismatch.' }
    foreach ($entry in $files) {
        if ($entry.FullName.Contains('\')) { throw 'Export requires forward slash ZIP paths.' }
        $name = $entry.FullName
        $expected = @($manifest.files | Where-Object { $_.path -ceq $name })
        if ($expected.Count -ne 1) { throw 'Unexpected or duplicated package path.' }
        $stream = $entry.Open()
        $sha = [Security.Cryptography.SHA256]::Create()
        try { $hash = ([BitConverter]::ToString($sha.ComputeHash($stream))).Replace('-', '').ToLowerInvariant() }
        finally { $stream.Dispose(); $sha.Dispose() }
        if ($hash -ne $expected[0].stagedSHA256) { throw 'Package content hash mismatch.' }
    }
} finally { $archive.Dispose() }
Write-Output $target
