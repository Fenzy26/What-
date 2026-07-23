import { useRef, useState } from "react";
import { mesin } from "../lib/audio";
import { goncang, kirimToast } from "../lib/efek";

interface Unduhan {
  nama: string;
  ukuran: string;
  emoji: string;
  fase: string[];
  hasil: string;
}

const DAFTAR_UNDUHAN: Unduhan[] = [
  {
    nama: "kesabaran.exe",
    ukuran: "2,4 GB",
    emoji: "🧘",
    fase: [
      "Mencari kesabaran di seluruh internet…",
      "Kesabaran tidak ditemukan, mencoba tetangga…",
      "Tetangga juga tidak punya…",
      "Mengunduh hujan supaya adem…",
    ],
    hasil: "GAGAL: kamu ternyata kurang sabar 😝",
  },
  {
    nama: "ram-16gb-gratis.zip",
    ukuran: "16 GB",
    emoji: "💾",
    fase: [
      "Membungkus RAM pakai kertas koran…",
      "Mengirim lewat merpati pos…",
      "Merpatinya mogok kerja…",
      "RAM basah kena hujan…",
    ],
    hasil: "GAGAL: RAM kamu jadi bubur 🥣",
  },
  {
    nama: "waktu-mundur.exe",
    ukuran: "∞",
    emoji: "⏰",
    fase: [
      "Memutar jarum jam ke kiri…",
      "Jam protes, ini bukan sekrup…",
      "Menegosiasikan masa lalu…",
      "Masa lalu minta tebusan…",
    ],
    hasil: "GAGAL: masa depanmu terlalu cepat 🏃",
  },
];

export default function TrollZone() {
  return (
    <section className="py-12 sm:py-16">
      <h2 className="font-pixel text-lg text-[#ff4d2e] sm:text-2xl">⚠️ ZONA BERBAHAYA</h2>
      <p className="mt-3 text-sm text-white/65 sm:text-base">
        Apapun yang terjadi di zona ini, kami tidak bertanggung jawab. Sama sekali.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <TombolTerlarang />
        <PanelUnduhan />
      </div>
    </section>
  );
}

/* Tombol yang kabur kalau mau dipencet — setelah 7 percobaan, dia menyerah. */
function TombolTerlarang() {
  const kandang = useRef<HTMLDivElement>(null);
  const [posisi, setPosisi] = useState({ x: 50, y: 50 });
  const [cobaan, setCobaan] = useState(0);
  const MENYERAH = 7;
  const menyerah = cobaan >= MENYERAH;

  const kabur = () => {
    if (menyerah) return;
    mesin.sfx("pop");
    setCobaan((c) => c + 1);
    setPosisi({
      x: 12 + Math.random() * 76,
      y: 16 + Math.random() * 62,
    });
  };

  const pencetTerlarang = () => {
    mesin.sfx("boing");
    goncang();
    kirimToast("TUH KAN! Sudah dibilang JANGAN dipencet 😤");
  };

  return (
    <div className="flex flex-col rounded-lg border-[3px] border-[#2a3160] bg-[#161c3a] p-4">
      <h3 className="font-pixel text-[10px] leading-relaxed text-[#ffd400] sm:text-xs">
        JANGAN PENCET TOMBOL INI
      </h3>
      <p className="mt-2 text-[13px] text-white/60">
        Serius. Jangan. Dia agak pemalu.
      </p>

      <div
        ref={kandang}
        className="relative mt-4 h-56 overflow-hidden rounded-md border-2 border-dashed border-[#2a3160] bg-[#0e1430] sm:h-64"
      >
        <button
          type="button"
          onPointerEnter={kabur}
          onPointerDown={menyerah ? undefined : kabur}
          onClick={menyerah ? pencetTerlarang : undefined}
          className={`absolute -translate-x-1/2 -translate-y-1/2 touch-manipulation whitespace-nowrap rounded-md border-[3px] border-[#1a1030] px-3 py-2.5 font-pixel text-[8px] shadow-[0_5px_0_#1a1030] transition-all duration-200 ease-out active:translate-y-0 sm:text-[9px] ${
            menyerah
              ? "bg-[#b4ff39] text-[#1a1030]"
              : "bg-[#ff4d2e] text-white"
          }`}
          style={{ left: `${posisi.x}%`, top: `${posisi.y}%` }}
        >
          {menyerah ? "YA UDAH SIH 😩" : `JANGAN PENCET${cobaan > 0 ? ` (${cobaan})` : ""}`}
        </button>
      </div>

      <p className="mt-3 min-h-5 font-pixel text-[7px] leading-relaxed text-white/45 sm:text-[8px]">
        {menyerah
          ? "Dia menyerah. Sekarang terserah kamu… (jangan)"
          : `Percobaan: ${cobaan}/${MENYERAH}`}
      </p>
    </div>
  );
}

/* Panel unduhan palsu dengan progress bar yang menyebalkan. */
function PanelUnduhan() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border-[3px] border-[#2a3160] bg-[#161c3a] p-4">
      <div>
        <h3 className="font-pixel text-[10px] leading-relaxed text-[#29f3ff] sm:text-xs">
          UNDUH GRATIS 100% PALSU
        </h3>
        <p className="mt-2 text-[13px] text-white/60">
          Semua unduhan dijamin gagal. Itu fitur, bukan bug.
        </p>
      </div>
      {DAFTAR_UNDUHAN.map((u) => (
        <BarisUnduhan key={u.nama} unduhan={u} />
      ))}
    </div>
  );
}

function BarisUnduhan({ unduhan }: { unduhan: Unduhan }) {
  const [status, setStatus] = useState<"diam" | "jalan" | "gagal">("diam");
  const [persen, setPersen] = useState(0);
  const [faseKe, setFaseKe] = useState(0);
  const timer = useRef<number | null>(null);

  const mulai = () => {
    if (status === "jalan") return;
    setStatus("jalan");
    setPersen(0);
    setFaseKe(0);
    mesin.sfx("koin");
    let p = 0;
    timer.current = window.setInterval(() => {
      p += 1 + Math.random() * 3.2;
      if (p >= 99) {
        p = 99;
        window.clearInterval(timer.current!);
        timer.current = null;
        setPersen(99);
        setFaseKe(unduhan.fase.length - 1);
        window.setTimeout(() => {
          setStatus("gagal");
          mesin.sfx("ditolak");
        }, 900);
        return;
      }
      setPersen(p);
      setFaseKe(Math.min(Math.floor((p / 99) * unduhan.fase.length), unduhan.fase.length - 1));
    }, 120);
  };

  return (
    <div className="rounded-md border-2 border-[#2a3160] bg-[#0e1430] p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-[13px] font-bold text-white/85">
          {unduhan.emoji} {unduhan.nama}{" "}
          <span className="font-normal text-white/45">({unduhan.ukuran})</span>
        </p>
        {status !== "jalan" && (
          <button
            type="button"
            onClick={mulai}
            className="tombol95 shrink-0 touch-manipulation px-2.5 py-1.5 font-pixel text-[7px] text-[#14141f] sm:text-[8px]"
          >
            {status === "gagal" ? "COBA LAGI" : "UNDUH"}
          </button>
        )}
      </div>

      {status !== "diam" && (
        <div className="mt-2.5">
          <div className="h-4 overflow-hidden rounded-sm border-2 border-[#2a3160] bg-black">
            <div
              className={`h-full ${persen >= 99 ? "" : "stripes-berjalan"} bg-[#b4ff39] transition-[width] duration-150`}
              style={{ width: `${persen}%` }}
            />
          </div>
          <p className="mt-1.5 flex justify-between font-pixel text-[7px] leading-relaxed">
            <span className={status === "gagal" ? "text-[#ff4d2e]" : "text-white/55"}>
              {status === "gagal" ? unduhan.hasil : unduhan.fase[faseKe]}
            </span>
            <span className="ml-2 shrink-0 text-[#ffd400]">{Math.floor(persen)}%</span>
          </p>
        </div>
      )}
    </div>
  );
}
