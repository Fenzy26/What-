const TEKS_MARQUEE = [
  "SELAMAT DATANG DI WEBSITE PALING TIDAK BERGUNA SEDUNIA",
  "100% GABUT TERUJI SECARA TIDAK KLINIS",
  "DILARANG KERAS BERMANFAAT DI SINI",
  "GAMBAR-GAMBAR DIBUAT DENGAN PENUH RASA MALAS",
  "JANGAN LUPA MINUM AIR PUTIH",
  "Btw Server website ini akan dihapus pada tanggal 26",
  "Website ini hanya untuk uji coba saja"
];

const DEKORASI: Array<{ emoji: string; kelas: string; tunda: string }> = [
  { emoji: "🗿", kelas: "right-[8%] top-8 text-4xl sm:text-5xl", tunda: "0s" },
  { emoji: "📼", kelas: "left-[4%] top-32 text-3xl sm:text-4xl", tunda: "1.2s" },
  { emoji: "🕹️", kelas: "right-[16%] bottom-6 text-3xl sm:text-5xl", tunda: "0.6s" },
  { emoji: "🐸", kelas: "left-[14%] bottom-10 text-3xl sm:text-4xl", tunda: "1.8s" },
];

/** Kepala situs: stiker, judul raksasa "Sebuah Tulisan Kegabutan", dan marquee. */
export default function Header() {
  return (
    <section className="relative overflow-hidden">
      {/* emoji dekoratif melayang */}
      {DEKORASI.map((d) => (
        <span
          key={d.emoji}
          aria-hidden="true"
          className={`dekor-apung ${d.kelas} hidden md:block`}
          style={{ animationDelay: d.tunda }}
        >
          {d.emoji}
        </span>
      ))}

      <div className="mx-auto w-full max-w-5xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
        {/* stiker */}
        <div className="stiker inline-block rounded-md bg-[#ffd400] px-3 py-1.5 font-pixel text-[8px] leading-relaxed text-[#1a1030] sm:text-[9px]">
          ★ WEBSITE RESMI Dari distributor PT.jungkat jungkir jaya ★
        </div>

        {/* judul utama */}
        <h1 className="mt-6">
          <span className="block font-pixel text-[10px] tracking-widest text-[#29f3ff] sm:text-sm">
            SEBUAH Website
          </span>
          <span className="judul-gabutan mt-3 block font-pixel text-[clamp(2.5rem,10vw,6rem)] leading-none text-[#ffd400]">
            Tidak Memiliki Tujuan!
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-sm font-medium text-white/70 sm:text-base">
          Website ini tidak memiliki tujuan, tidak memiliki manfaat, dan tidak memiliki
          masa depan. Silakan dinikmati sepenuh hati. 🫠
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded-md border-2 border-[#ff3ea5] bg-[#ff3ea5]/10 px-2.5 py-1 font-pixel text-[7px] text-[#ff3ea5] sm:text-[8px]">
            est. 2004
          </span>
          <span className="rounded-md border-2 border-[#29f3ff] bg-[#29f3ff]/10 px-2.5 py-1 font-pixel text-[7px] text-[#29f3ff] sm:text-[8px]">
            0% manfaat
          </span>
          <span className="rounded-md border-2 border-[#b4ff39] bg-[#b4ff39]/10 px-2.5 py-1 font-pixel text-[7px] text-[#b4ff39] sm:text-[8px]">
            100% gabut
          </span>
        </div>
      </div>

      {/* marquee berjalan */}
      <div className="marquee-jalur" aria-hidden="true">
        <div className="marquee-isi">
          {[...TEKS_MARQUEE, ...TEKS_MARQUEE].map((t, i) => (
            <span
              key={i}
              className="flex items-center gap-6 whitespace-nowrap font-pixel text-[8px] text-white/80 sm:text-[9px]"
            >
              <span className="text-[#ffd400]">★</span> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
