import { useEffect, useState } from "react";

interface Props {
  musikAktif: boolean;
  onMusik: () => void;
}

/** Bar atas: status online bohongan, tombol BGM, dan counter pengunjung palsu. */
export default function TopBar({ musikAktif, onMusik }: Props) {
  const [pengunjung, setPengunjung] = useState(1_337_420);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPengunjung((p) => p + 1 + Math.floor(Math.random() * 6));
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b-[3px] border-[#2a3160] bg-[#0b1020]/95">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <span className="peluru-hidup inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#b4ff39] shadow-[0_0_8px_#b4ff39]" />
          <p className="truncate font-pixel text-[7px] text-white/75 sm:text-[8px]">
            ONLINE — server warnet RT.04
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onMusik}
            aria-pressed={musikAktif}
            className={`flex touch-manipulation items-center gap-2 rounded-md border-[3px] border-[#1a1030] px-2 py-1.5 font-pixel text-[7px] shadow-[0_4px_0_#1a1030] transition-all duration-100 active:translate-y-0.5 active:shadow-none sm:text-[8px] ${
              musikAktif
                ? "bg-[#b4ff39] text-[#1a1030]"
                : "bg-[#232a52] text-white/80 hover:bg-[#2c3468]"
            }`}
          >
            <span className={`eq ${musikAktif ? "" : "eq-mati"}`} aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            {musikAktif ? "MUSIK: GAS" : "MUSIK: OFF"}
          </button>

          <div
            className="hidden items-center gap-1.5 rounded-md border-[3px] border-[#1a1030] bg-black px-2 py-1.5 sm:flex"
            title="Jumlah pengunjung (dibuat-buat)"
          >
            <span className="font-pixel text-[7px] text-[#29f3ff]">👥</span>
            <span className="font-pixel text-[8px] tabular-nums tracking-wider text-[#ffd400]">
              {pengunjung.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
