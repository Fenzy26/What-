#!/usr/bin/env sh
# ============================================================
#  KEMAS WEBSITE KEGABUTAN MENJADI SATU FILE ZIP (Mac/Linux)
#  Jalankan: ./kemas-zip.sh  (butuh perintah "zip")
#  Pastikan sudah menjalankan: npm run build
# ============================================================

if [ ! -f "dist/index.html" ]; then
  echo ""
  echo "[!] Folder dist belum ada. Jalankan dulu: npm run build"
  exit 1
fi

rm -f website-kegabutan.zip
(cd dist && zip -r ../website-kegabutan.zip .)

echo ""
echo "[OK] Selesai! File website-kegabutan.zip sudah jadi."
