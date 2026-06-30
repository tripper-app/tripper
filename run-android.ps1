# Builds and runs the NativeScript + Angular app on an Android emulator.
#
# Requirements (see MIGRATION_NOTES.md for the full story):
#   - Node >= 22.12 on PATH (Angular 21's ESM-only linker needs require(ESM)).
#     This machine has Node 24 installed system-wide as of 2026-06-25.
#   - Android Studio + SDK, and the `tripper_pixel` AVD.
#   - Run from PowerShell or cmd (NOT Git Bash).
#
# Usage:  .\run-android.ps1
# from the repo root.

$ErrorActionPreference = "Stop"

# --- Toolchain locations -----------------------------------------------------
$Sdk = "C:\Users\OdedBartov\AppData\Local\Android\Sdk"
$env:ANDROID_HOME = $Sdk
$env:ANDROID_SDK_ROOT = $Sdk
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"   # bundled JDK 21

# NativeScript spawns a bare `gradlew.bat` that relies on cmd.exe searching the
# current directory. With NoDefaultCurrentDirectoryInExePath=1 (set on this
# machine) plugin builds fail with "'gradlew.bat' is not recognized". Unset it.
$env:NoDefaultCurrentDirectoryInExePath = $null

$Adb = Join-Path $Sdk "platform-tools\adb.exe"
$Emulator = Join-Path $Sdk "emulator\emulator.exe"
$Avd = "tripper_pixel"

# --- Node version guard ------------------------------------------------------
$nodeVer = (node --version) -replace '^v',''
$nodeMajor = [int]($nodeVer.Split('.')[0])
$nodeMinor = [int]($nodeVer.Split('.')[1])
if ($nodeMajor -lt 22 -or ($nodeMajor -eq 22 -and $nodeMinor -lt 12)) {
    Write-Error "Node $nodeVer is too old. Need >= 22.12 (Angular 21 linker requires require(ESM)). Install Node 22 LTS or 24."
}
Write-Host "Using Node v$nodeVer" -ForegroundColor Green

# --- Ensure an emulator is running -------------------------------------------
$running = (& $Adb devices | Select-String "emulator-\d+\s+device")
if (-not $running) {
    Write-Host "No emulator running - launching AVD '$Avd'..." -ForegroundColor Yellow
    Start-Process -FilePath $Emulator -ArgumentList "-avd", $Avd
    & $Adb wait-for-device
    Write-Host "Waiting for boot to complete..." -ForegroundColor Yellow
    do {
        Start-Sleep -Seconds 3
        $booted = (& $Adb shell getprop sys.boot_completed 2>$null).Trim()
    } while ($booted -ne "1")
    Write-Host "Emulator booted." -ForegroundColor Green
} else {
    Write-Host "Emulator already running." -ForegroundColor Green
}

# --- Build, deploy, and live-sync --------------------------------------------
Set-Location $PSScriptRoot\app
ns run android --no-hmr
