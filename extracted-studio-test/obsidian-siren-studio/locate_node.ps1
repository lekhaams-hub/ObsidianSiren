$nodejsPaths = @(
    "C:\Program Files\nodejs",
    "C:\Program Files (x86)\nodejs",
    "E:\Program Files\nodejs",
    "$env:USERPROFILE\AppData\Roaming\npm",
    "$env:APPDATA\npm"
)

foreach ($p in $nodejsPaths) {
    if (Test-Path $p) {
        Write-Output "Found directory: $p"
        Get-ChildItem -Path $p
    }
}

# Let's search inside environmental paths too
Write-Output "`nEnvironmental PATH directories:"
$paths = $env:PATH -split ";"
foreach ($path in $paths) {
    if ($path -like "*node*" -or $path -like "*npm*") {
        Write-Output "PATH MATCH: $path"
        if (Test-Path $path) {
            Get-ChildItem -Path $path
        }
    }
}
