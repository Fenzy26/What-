# 🫠 Sebuah Tulisan Kegabutan

Website troll / fake page dengan:

- **Galeri gambar** yang membaca otomatis dari folder `gambar/`
- **Karakter 8-bit "Si Gabut"** di pojok tengah kanan — dipencet → bunyi
- **BGM**: chiptune 8-bit bawaan (tanpa file!) atau lagu milikmu sendiri
- Partikel hidup, tekstur CRT (scanline + noise), animasi & easter egg
- Ramah Android & dioptimalkan untuk 60fps (partikel adaptif, tanpa filter berat)

---

## 📁 Cara menambahkan konten (TANPA build ulang!)

Semua konten diatur lewat **`konfigurasi.js`** (di root, sebelah `index.html`).

### 1. Gambar (target ±15)
Taruh file di folder `gambar/`, lalu daftarkan di `konfigurasi.js`:

```js
gambar: ["gabut-01.jpg", "meme-batu.png", "foto-aib.gif"],
```

Format bebas: `.jpg .jpeg .png .gif .webp`. Kalau gambarnya hilang,
website menampilkan kartu "GAMBAR HILANG 😱" (tetap lucu).

### 2. Suara Si Gabut
Taruh `.mp3/.wav/.ogg` di folder `sound/`, daftarkan:

```js
sound: ["bebek.mp3", "kikuk.wav"],
```

Diputar **acak** setiap kali Si Gabut dipencet. Kosong = suara 8-bit sintetis.

### 3. BGM
Taruh lagu di folder `bgm/`, tulis namanya:

```js
bgm: "lagu-gabutan.mp3",
```

Kosong (`""`) = chiptune 8-bit bawaan yang digenerate WebAudio.

---

## 🚀 Build & preview

```bash
npm install
npm run dev        # mode pengembangan
npm run build      # hasil di folder dist/
```

Hasil build: `dist/` berisi `index.html` + folder `gambar/`, `sound/`, `bgm/`,
dan `konfigurasi.js`. Website bisa dibuka langsung (klik dua kali `index.html`)
maupun di-hosting di mana saja.

---

## 📦 Cara menjadikan satu file ZIP

Di environment ini file `.zip` biner tidak bisa dibuat langsung,
jadi sudah disiapkan script otomatis:

**Windows (klik dua kali):**
```
kemas-zip.bat
```
→ menghasilkan `website-kegabutan.zip` berisi seluruh folder `dist/`.

**Manual (PowerShell):**
```powershell
Compress-Archive -Path dist\* -DestinationPath website-kegabutan.zip -Force
```

**Mac / Linux:**
```bash
./kemas-zip.sh
# atau manual:
cd dist && zip -r ../website-kegabutan.zip . && cd ..
```

Zip berisi website lengkap yang siap dijalankan / dikirim.

---

## 🎮 Rahasia

- Ketik **`gabut`** di keyboard…
- Tombol **JANGAN PENCET** bisa dikalahkan (7 percobaan).
- Pencet Si Gabut 100x kalau kamu tidak punya kerjaan.

*Dilarang keras bermanfaat di situs ini.*
