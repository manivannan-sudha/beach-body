# Set or change the Beach Body passcode.
# Writes access.json next to index.html with a random salt and a PBKDF2-SHA256 hash.
# The passcode itself is never written anywhere.
param(
  [string]$RepoDir = (Split-Path -Parent $PSScriptRoot),
  [int]$Iterations = 310000
)

function Read-Secret($prompt) {
  $secure = Read-Host -AsSecureString $prompt
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try { return ([Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)).Trim() }
  finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
}

$first = Read-Secret 'Choose a passcode for Beach Body (at least 8 characters)'
if ($first.Length -lt 8) { Write-Host 'Use at least 8 characters. Nothing was changed.' -ForegroundColor Red; exit 1 }
$second = Read-Secret 'Type it again'
if ($first -ne $second) { Write-Host "The two entries don't match. Nothing was changed." -ForegroundColor Red; exit 1 }

$salt = New-Object byte[] 16
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($salt)
$kdf = New-Object Security.Cryptography.Rfc2898DeriveBytes(([Text.Encoding]::UTF8.GetBytes($first)), $salt, $Iterations, [Security.Cryptography.HashAlgorithmName]::SHA256)
$hash = $kdf.GetBytes(32)
$kdf.Dispose()

$json = '{"v":1,"iter":' + $Iterations + ',"salt":"' + [Convert]::ToBase64String($salt) + '","hash":"' + [Convert]::ToBase64String($hash) + '"}'
[IO.File]::WriteAllText((Join-Path $RepoDir 'access.json'), $json + "`n", (New-Object Text.UTF8Encoding($false)))
Write-Host 'Passcode saved. Every device asks for it once.' -ForegroundColor Green
