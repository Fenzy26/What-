import { useEffect, useRef, useState } from "react";
import { mesin } from "../lib/audio";
import { kirimToast } from "../lib/efek";

/* Peta pixel "Si Gabut" (16 x 14).
   y = badan kuning, d = bayangan, k = garis/mata/mulut, w = kilau mata, p = pipi */
const PETA = [
  "....k.......k...",
  "...kyk.....kyk..",
  "..kyyyk...kyyyk.",
  "..kyyyykkkyyyyk.",
  ".kyyyyyyyyyyyyk.",
  ".kyykkyyyykkyyk.",
  ".kyywkyyyywkyyk.",
  ".kypyyyyyyyyypk.",
  ".kyyyym..myyyyk.",
  ".kyyyyyyyyyyyyk.",
  ".kdyyyyyyyyyydk.",
  ".kddddddddddddk.",
  "..kddddddddddk..",
  "...kkkkkkkkkk...",
];

const WARNA: Record<string, string> = {
  y: "#ffd400",
  d: "#dfa300",
  k: "#1a1030",
  w: "#ffffff",
  p: "#ff7ab8",
  m: "#1a1030",
};

const MATA = new Set(["5-4", "5-5", "5-10", "5-11", "6-4", "6-5", "6-10", "6-11"]);

const FRASA = [
  "Gabut banget dah…",
  "Tet tet tet! 🎵",
  "Pencet lagi dong~",
  "Waduh, jari kamu kuat ya",
  "Aku cuma kotak kuning 😌",
  "Jangan bilang siapa-siapa ya",
  "Kamu sudah makan belum?",
  "Loading… otak 404",
  "Ampas banget hari ini",
  "Tolong… aku bosan di sini",
  "1 klik = 1 pahala (bohong)",
  "Suara dari folder sound! 📁",
];

const PENCAPAIAN: Array<[number, string]> = [
  [10, "🏅 10 pencetan: Tukang Pencet Pemula"],
  [25, "🎖️ 25 pencetan: Gabuter Sejati"],
  [50, "👑 50 pencetan: Dewa Kegabutan"],
  [100, "🫠 100 pencetan: Sudah, cari hobi sana"],
];

interface Props {
  daftarSound: string[];
}

/** Karakter 8-bit di pojok tengah kanan. Dipencet → bunyi + lompat + ngomong. */
export default function PixelBuddy({ daftarSound }: Props) {
  const [hitungan, setHitungan] = useState(0);
  const [lompat, setLompat] = useState(0);
  const [frasa, setFrasa] = useState<string | null>(null);
  const timerFrasa = useRef<number | null>(null);
  const frasaSebelumnya = useRef<string>("");

  useEffect(() => {
    return () => {
      if (timerFrasa.current !== null) window.clearTimeout(timerFrasa.current);
    };
  }, []);

  const pencet = () => {
    const baru = hitungan + 1;
    setHitungan(baru);
    setLompat((l) => l + 1);

    void mesin.bunyiAcak(daftarSound);

    let f = FRASA[Math.floor(Math.random() * FRASA.length)];
    while (f === frasaSebelumnya.current) {
      f = FRASA[Math.floor(Math.random() * FRASA.length)];
    }
    frasaSebelumnya.current = f;
    setFrasa(f);
    if (timerFrasa.current !== null) window.clearTimeout(timerFrasa.current);
    timerFrasa.current = window.setTimeout(() => setFrasa(null), 1900);

    const capai = PENCAPAIAN.find(([n]) => n === baru);
    if (capai) kirimToast(capai[1]);
  };

  return (
    <div className="fixed right-1.5 top-1/2 z-40 -translate-y-1/2 sm:right-4">
      {/* gelembung ucapan */}
      {frasa && (
        <div
          key={frasa + hitungan}
          className="gelembung absolute bottom-full right-0 mb-2 w-40 rounded-lg border-[3px] border-[#1a1030] bg-white px-2.5 py-2 font-bold text-[#1a1030] shadow-[4px_4px_0_rgba(0,0,0,0.45)] sm:w-48"
        >
          <span className="text-[13px] leading-tight">{frasa}</span>
          <span className="absolute -bottom-[9px] right-6 h-3 w-3 rotate-45 border-b-[3px] border-r-[3px] border-[#1a1030] bg-white" />
        </div>
      )}

      <button
        type="button"
        onClick={pencet}
        aria-label="Pencet Si Gabut biar bunyi"
        className="buddy-bob group relative block touch-manipulation select-none rounded-2xl border-[3px] border-[#1a1030] bg-[#232a52] p-1.5 shadow-[0_6px_0_#1a1030] transition-transform duration-100 active:translate-y-1 active:shadow-[0_2px_0_#1a1030] sm:p-2"
      >
        <span key={lompat} className={lompat > 0 ? "anim-lompat block" : "block"}>
          <svg
            width="52"
            height="46"
            viewBox="0 0 16 14"
            shapeRendering="crispEdges"
            className="block sm:h-[54px] sm:w-[62px]"
            aria-hidden="true"
          >
            {PETA.map((baris, y) =>
              baris.split("").map((ch, x) => {
                if (ch === "." || !WARNA[ch]) return null;
                const kunci = `${y}-${x}`;
                const isi = (
                  <rect key={kunci} x={x} y={y} width="1" height="1" fill={WARNA[ch]} />
                );
                return MATA.has(kunci) ? null : isi;
              })
            )}
            {/* mata dikelompokkan supaya bisa berkedip */}
            <g className="buddy-mata">
              {PETA.map((baris, y) =>
                baris.split("").map((ch, x) => {
                  const kunci = `${y}-${x}`;
                  if (!MATA.has(kunci) || ch === "." || !WARNA[ch]) return null;
                  return <rect key={kunci} x={x} y={y} width="1" height="1" fill={WARNA[ch]} />;
                })
              )}
            </g>
          </svg>
        </span>
        <span className="pointer-events-none absolute -top-2 -left-2 rounded-md border-2 border-[#1a1030] bg-[#ff3ea5] px-1 py-0.5 font-pixel text-[7px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          pencet!
        </span>
      </button>

      <p className="mt-1.5 text-center font-pixel text-[7px] leading-relaxed text-white/55 sm:text-[8px]">
        Si Gabut
        <br />
        <span className="text-[#ffd400]">{hitungan}x dipencet</span>
      </p>
    </div>
  );
}
