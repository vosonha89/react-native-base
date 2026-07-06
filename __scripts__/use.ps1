<#
.SYNOPSIS
Scaffold a new project from the react-native-base template.

.DESCRIPTION
Clones the template, renames it to your project name, and cleans up.

.PARAMETER Name
Optional PascalCase project name (e.g., MyApp). If omitted, you'll be prompted.

.EXAMPLE
# Interactive (prompts for name):
irm https://raw.githubusercontent.com/vosonha89/react-native-base/main/__scripts__/use.ps1 | iex

.EXAMPLE
# Non-interactive:
irm https://raw.githubusercontent.com/vosonha89/react-native-base/main/__scripts__/use.ps1 -OutFile install.ps1; .\install.ps1 -Name MyApp
#>
[CmdletBinding()]
param(
  [string]$Name,
  [string]$Namespace
)

$ErrorActionPreference = 'Stop'

# ──────────────────────── helpers ────────────────────────

function Write-OK($text) { Write-Host "  ✓  $text" -ForegroundColor Green }
function Write-Err($text) { Write-Host "  ✖  $text" -ForegroundColor Red; exit 1 }
function Write-Header { 
  Write-Host "`n  🏗  use  🏗" -ForegroundColor Cyan
  Write-Host "  Scaffold a new project from react-native-base`n"
}

# PascalCase → kebab-case
function ConvertTo-Kebab([string]$s) {
  $s = $s -creplace '([a-z0-9])([A-Z])', '$1-$2'
  $s = $s -creplace '([A-Z])([A-Z][a-z])', '$1-$2'
  return $s.ToLower()
}

# ──────────────────────── main ────────────────────────

Write-Header

# Interactive prompt if no name provided
if ([string]::IsNullOrWhiteSpace($Name)) {
  $Name = Read-Host "  Project name (PascalCase, e.g. MyApp)"
}

# Validate
if ([string]::IsNullOrWhiteSpace($Name)) {
  Write-Err "Name is required. Use -Name MyApp or enter it interactively."
}
if ($Name -notmatch '^[A-Z][a-zA-Z0-9]*$') {
  Write-Err "Invalid name '$Name'. Must be PascalCase, e.g. MyApp, AwesomeProject."
}

$kebab = ConvertTo-Kebab $Name
$defaultNs = "com." + $kebab.Replace("-", "")

# Interactive prompt if no namespace provided
if ([string]::IsNullOrWhiteSpace($Namespace)) {
  $Namespace = Read-Host "  Android/iOS namespace (press Enter for default: $defaultNs)"
  if ([string]::IsNullOrWhiteSpace($Namespace)) {
    $Namespace = $defaultNs
  }
}

# Validate namespace format
if ($Namespace -and ($Namespace -notmatch '^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$')) {
  Write-Err "Invalid namespace '$Namespace'. Must be reverse-DNS, e.g. com.myapp or com.acme.myapp."
}

Write-Host ""

# Clone template
if (Test-Path $kebab) {
  Write-Err "Directory '$kebab' already exists. Remove it first or choose a different name."
}

Write-OK "Cloning template → ./$kebab/"
git clone --depth 1 "https://github.com/vosonha89/react-native-base.git" $kebab

Write-Host ""

# Run the inner rename script with --no-install so it never reads from stdin
Write-OK "Renaming project → $Name"
Push-Location $kebab
try {
  & "node" @("__scripts__/use.js", "--name=`"$Name`"", "--namespace=`"$Namespace`"", "--no-install")
  
  Write-Host ""
  Write-OK "Removing scaffolding scripts"
  Remove-Item -Recurse -Force __scripts__/use.js, __scripts__/use.sh -ErrorAction SilentlyContinue
}
finally {
  Pop-Location
}

Write-Host "`n  ✨  Project '$Name' is ready!`n" -ForegroundColor Green
Write-Host "    Next steps:"
Write-Host "      cd $kebab"
Write-Host "      npm install"
Write-Host "      npx react-native eject"
Write-Host "      npm run start:android    # or: npm run start:ios"
Write-Host ""
Write-Host "    📁  Source files are at  src/"
Write-Host "    🔤  Language files are at  assets/language/"
Write-Host ""