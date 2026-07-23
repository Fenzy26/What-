@echo off
REM ============================================================
REM  KEMAS WEBSITE KEGABUTAN MENJADI SATU FILE ZIP
REM  Klik dua kali file ini (Windows). Hasil: website-kegabutan.zip
REM  Pastikan sudah menjalankan: npm run build
REM ============================================================

if not exist "dist\index.html" (
  echo.
  echo [!] Folder dist belum ada. Jalankan dulu: npm run build
  echo.
  pause
  exit /b 1
)

if exist "website-kegabutan.zip" del "website-kegabutan.zip"

powershell -NoProfile -Command "Compress-Archive -Path 'dist\*' -DestinationPath 'website-kegabutan.zip' -Force"

echo.
echo [OK] Selesai! File "website-kegabutan.zip" sudah jadi.
echo.
pause
