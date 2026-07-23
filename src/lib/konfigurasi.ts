export interface Konfig {
  gambar: string[];
  sound: string[];
  bgm: string;
}

declare global {
  interface Window {
    KONFIG?: Partial<Konfig>;
  }
}

/** Nama-nama gambar bawaan (folder "gambar"). Ganti sesukamu lewat /konfigurasi.js */
const GAMBAR_BAWAAN = Array.from(
  { length: 10 },
  (_, i) => `gabut-${String(i + 1).padStart(2, "0")}.jpg`
);

export function ambilKonfig(): Konfig {
  const k = typeof window !== "undefined" ? window.KONFIG : undefined;
  return {
    gambar: k && Array.isArray(k.gambar) && k.gambar.length > 0 ? [...k.gambar] : GAMBAR_BAWAAN,
    sound: k && Array.isArray(k.sound) ? [...k.sound] : [],
    bgm: k && typeof k.bgm === "string" ? k.bgm : "",
  };
}
