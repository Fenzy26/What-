import { useEffect, useRef, useState } from "react";
import { mesin } from "../lib/audio";
import { goncang, kirimToast, ledakkanDari } from "../lib/efek";

/* ---------------- Toaster: mendengar event "gabut-toast" ---------------- */

interface Toast {
  id: number;
  pesan: string;
}

export function Toaster() {
  const [daftar, setDaftar] = useState<Toast[]>([]);
  const idBerikut = useRef(0);

  useEffect(() => {
    const tangani = (e: Event) => {
      const pesan = (e as CustomEvent<string>).detail;
      const id = ++idBerikut.current;
      setDaftar((d) => [...d.slice(-2), { id, pesan }]);
      window.setTimeout(() => {
        setDaftar((d) => d.filter((t) => t.id !== id));
      }, 3400);
    };
    window.addEventListener("gabut-toast", tangani);
    return () => window.removeEventListener("gabut-toast", tangani);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[85] flex w-72 max-w-[calc(100vw-2rem)] flex-col gap-2">
      {daftar.map((t) => (
        <div
          key={t.id}
          className="toast-masuk rounded-md border-[3px] border-[#1a1030] bg-[#ffd400] px-3 py-2.5 font-bold text-[#1a1030] shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
        >
          <p className="text-[13px] leading-snug">{t.pesan}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- Popup "Selamat Anda pengunjung ke-1.000.000" ala Win95 ---------- */

export function PopupSelamat() {
  const [buka, setBuka] = useState(false);
  const [kabur, setKabur] = useState({ x: 0, y: 0 });
  const [kaburKe, setKaburKe] = useState(0);
  const tombolTolak = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setBuka(true), 1900);
    return () => window.clearTimeout(t);
  }, []);

  const tutup = (denganSuara: boolean) => {
    if (denganSuara) mesin.sfx("pop");
    setBuka(false);
  };

  const klaim = (e: React.MouseEvent<HTMLButtonElement>) => {
    mesin.sfx("tada");
    ledakkanDari(e.currentTarget);
    setBuka(false);
    kirimToast("Hadiahmu dikirim via merpati pos 🕊️ (bohong)");
  };

  const tolak = () => {
    if (kaburKe < 3) {
      mesin.sfx("pop");
      setKaburKe((k) => k + 1);
      setKabur({
        x: (Math.random() - 0.5) * 110,
        y: (Math.random() - 0.5) * 46,
      });
    } else {
      mesin.sfx("ditolak");
      goncang();
      setBuka(false);
      kirimToast("Yaudah, hadiahnya hangus 🙃");
    }
  };

  if (!buka) return null;

  return (
    <div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-black/60 p-4"
      onClick={() => tutup(false)}
    >
      <div
        className="jendela95 pop-masuk w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Selamat Anda menang (bohong)"
      >
        {/* title bar */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#1d3fc0] to-[#4f8cff] px-2.5 py-1.5">
          <p className="truncate font-pixel text-[8px] text-white">🎉 SELAMAT_ANDA_MENANG.EXE</p>
          <button
            type="button"
            aria-label="Tutup jendela"
            onClick={() => tutup(true)}
            className="tombol95 flex h-6 w-6 shrink-0 items-center justify-center font-pixel text-[9px] text-[#14141f]"
          >
            ✕
          </button>
        </div>

        {/* isi */}
        <div className="flex items-start gap-3 px-4 py-4">
          <span className="text-4xl" aria-hidden="true">
            🏆
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-bold leading-snug">
              SELAMAT!!! Anda adalah pengunjung ke-
              <span className="text-[#c0182b]">1.000.000</span> (dibulatkan ke atas)
            </p>
            <p className="mt-2 text-[13px] leading-snug text-[#3a3a4d]">
              Klaim hadiahmu sekarang: <b>1 piring gorengan hangat</b>.
              <br />
              <span className="text-[11px] italic">
                *ongkir ditanggung pemenang. bohong. hadiah tidak ada.
              </span>
            </p>
          </div>
        </div>

        {/* tombol */}
        <div className="flex items-center justify-end gap-3 px-4 pb-4">
          <button
            ref={tombolTolak}
            type="button"
            onClick={tolak}
            className="tombol95 touch-manipulation px-3 py-2 font-pixel text-[8px] text-[#14141f] transition-transform duration-150"
            style={{ transform: `translate(${kabur.x}px, ${kabur.y}px)` }}
          >
            {kaburKe >= 3 ? "YA UDAH" : "GA MAU"}
          </button>
          <button
            type="button"
            onClick={klaim}
            className="tombol95 touch-manipulation bg-[#1d3fc0] px-3 py-2 font-pixel text-[8px] text-white"
          >
            KLAIM 🎁
          </button>
        </div>
      </div>
    </div>
  );
}
