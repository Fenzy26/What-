import { useCallback, useEffect, useRef, useState } from "react";
import { mesin } from "../lib/audio";

interface Props {
  gambar: string[];
}

const TINGGI = [176, 224, 144, 208, 160, 240]; // px — bikin ritme masonry acak

function judulDari(nama: string): string {
  return nama
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .toUpperCase();
}

function rotasiDari(i: number): number {
  const pilihan = [-2.4, 1.8, -1.2, 2.6, -3, 1.4];
  return pilihan[i % pilihan.length];
}

/** Galeri yang membaca daftar gambar dari folder "gambar" via /konfigurasi.js */
export default function Gallery({ gambar }: Props) {
  const [dilihat, setDilihat] = useState<number | null>(null);
  const [gagal, setGagal] = useState<Set<number>>(new Set());
  const judulRef = useRef<HTMLDivElement>(null);

  // reveal judul saat di-scroll
  useEffect(() => {
    const el = judulRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entri) => {
        entri.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // navigasi keyboard untuk lightbox
  useEffect(() => {
    if (dilihat === null) return;
    const kunci = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDilihat(null);
      if (e.key === "ArrowRight") setDilihat((d) => (d! + 1) % gambar.length);
      if (e.key === "ArrowLeft") setDilihat((d) => (d! - 1 + gambar.length) % gambar.length);
    };
    window.addEventListener("keydown", kunci);
    return () => window.removeEventListener("keydown", kunci);
  }, [dilihat, gambar.length]);

  // kunci scroll body saat lightbox terbuka
  useEffect(() => {
    document.body.style.overflow = dilihat !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [dilihat]);

  const buka = useCallback((i: number) => {
    setDilihat(i);
    mesin.sfx("pop");
  }, []);

  const tandaiGagal = useCallback((i: number) => {
    setGagal((g) => {
      const baru = new Set(g);
      baru.add(i);
      return baru;
    });
  }, []);

  return (
    <section className="py-12 sm:py-16">
      <div ref={judulRef} className="reveal">
        <h2 className="font-pixel text-lg text-[#ffd400] sm:text-2xl">
          GALERI KEGABUTAN
        </h2>
        <p className="mt-3 text-sm text-white/65 sm:text-base">
          <span className="font-bold text-[#29f3ff]">{gambar.length} gambar</span> dibaca
          otomatis dari folder{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[13px] text-[#b4ff39]">
            gambar/
          </code>{" "}
          — target 15, sisanya kamu yang tambah sendiri. Aku capek. 🥱
        </p>
      </div>

      <div className="mt-8 columns-2 gap-3 sm:gap-5 md:columns-3">
        {gambar.map((nama, i) => (
          <KartuGambar
            key={nama + i}
            nama={nama}
            indeks={i}
            rusak={gagal.has(i)}
            onBuka={() => buka(i)}
            onGagal={() => tandaiGagal(i)}
          />
        ))}
      </div>

      {/* lightbox */}
      {dilihat !== null && (
        <div
          className="pop-masuk fixed inset-0 z-[70] flex items-center justify-center bg-[#04060f]/90 p-4"
          onClick={() => setDilihat(null)}
        >
          <button
            type="button"
            aria-label="Tutup"
            className="tombol95 absolute right-4 top-4 flex h-11 w-11 items-center justify-center font-pixel text-sm text-[#14141f]"
            onClick={() => setDilihat(null)}
          >
            ✕
          </button>

          <button
            type="button"
            aria-label="Sebelumnya"
            className="tombol95 absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-2xl font-bold text-[#14141f] sm:left-6"
            onClick={(e) => {
              e.stopPropagation();
              mesin.sfx("koin");
              setDilihat((d) => (d! - 1 + gambar.length) % gambar.length);
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Berikutnya"
            className="tombol95 absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-2xl font-bold text-[#14141f] sm:right-6"
            onClick={(e) => {
              e.stopPropagation();
              mesin.sfx("koin");
              setDilihat((d) => (d! + 1) % gambar.length);
            }}
          >
            ›
          </button>

          <figure
            className="max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`gambar/${gambar[dilihat]}`}
              alt={judulDari(gambar[dilihat])}
              className="max-h-[68vh] w-auto max-w-full rounded-sm border-4 border-white/20 bg-[#161c3a] object-contain"
              draggable={false}
            />
            <figcaption className="mt-3 text-center font-pixel text-[8px] leading-relaxed text-white/80 sm:text-[10px]">
              {judulDari(gambar[dilihat])} — {dilihat + 1}/{gambar.length}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}

function KartuGambar({
  nama,
  indeks,
  rusak,
  onBuka,
  onGagal,
}: {
  nama: string;
  indeks: number;
  rusak: boolean;
  onBuka: () => void;
  onGagal: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entri) => {
        entri.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onBuka}
      style={{ ["--rot" as string]: `${rotasiDari(indeks)}deg` }}
      className="kartu-foto reveal relative mb-3 block w-full break-inside-avoid touch-manipulation bg-white p-2 pb-3 text-left shadow-[6px_6px_0_rgba(0,0,0,0.45)] hover:shadow-[10px_10px_0_rgba(255,62,165,0.35)] sm:mb-5"
      aria-label={`Buka gambar ${judulDari(nama)}`}
    >
      {/* selotip */}
      <span
        aria-hidden="true"
        className="absolute -top-2.5 left-1/2 z-10 h-5 w-16 -translate-x-1/2 -rotate-3 bg-[#ffd400]/85 shadow-sm"
      />
      {rusak ? (
        <div
          className="flex w-full flex-col items-center justify-center gap-2 border-4 border-dashed border-[#c9c9d4] bg-[#e9e9f2] text-center"
          style={{ height: TINGGI[indeks % TINGGI.length] }}
        >
          <span className="text-3xl">😱</span>
          <span className="font-pixel text-[7px] leading-relaxed text-[#55556e]">
            GAMBAR HILANG
            <br />
            {nama}
          </span>
        </div>
      ) : (
        <img
          src={`gambar/${nama}`}
          alt={judulDari(nama)}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={onGagal}
          className="block w-full select-none object-cover"
          style={{ height: TINGGI[indeks % TINGGI.length] }}
        />
      )}
      <p className="mt-2.5 truncate text-center font-pixel text-[7px] leading-relaxed text-[#1a1030] sm:text-[8px]">
        {judulDari(nama)}
      </p>
    </button>
  );
}
