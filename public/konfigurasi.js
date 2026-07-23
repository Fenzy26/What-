/* ==================================================================
   KONFIGURASI WEBSITE KEGABUTAN — edit file ini TANPA perlu build ulang!

   File ini dibaca langsung oleh website saat dibuka.
   Letakkan file ini di sebelah index.html (root).

   1) GAMBAR  -> taruh file gambar di folder  "gambar/"
                 lalu daftarkan nama file-nya di bawah.
                 (target 15 gambar — tambah sesukamu!)

   2) SOUND   -> taruh file suara (.mp3/.wav/.ogg) di folder "sound/"
                 Si Gabut (makhluk kuning di kanan) akan membunyikan
                 salah satu secara ACAK saat dipencet.
                 Kalau kosong, dia bunyi "tet tet" 8-bit bawaan.

   3) BGM     -> taruh lagu di folder "bgm/" dan tulis nama file-nya.
                 Contoh: bgm: "lagu-gabutan.mp3"
                 Kalau kosong, website memutar chiptune 8-bit bawaan.
   ================================================================== */

window.KONFIG = {
  // --- daftar gambar di folder "gambar/" ---
  gambar: [
    "gabut-01.jpg",
    "gabut-02.jpg",
    "gabut-03.jpg",
    "gabut-04.jpg",
    "gabut-05.jpg",
    "gabut-06.jpg",
    "gabut-07.jpg",
    "gabut-08.jpg",
    "gabut-09.jpg",
    "gabut-10.jpg",
    // tambah sendiri sampai 15 (atau lebih), contoh:
    // "meme-batu.jpg",
    // "kucing-kena-tangkap.png",
    // "foto-aib-temen.gif",
  ],

  // --- daftar suara di folder "sound/" (diputar saat Si Gabut dipencet) ---
  sound: [
    // contoh:
     "bebek.mp3",
    // "kikuk.wav",
    // "tertawa.ogg",
  ],

  // --- lagu BGM di folder "bgm/" (kosongkan "" untuk chiptune bawaan) ---
  bgm: [
    "Converse Pink.m4a",
    "Converse Pink.mp3",
    ]
};
