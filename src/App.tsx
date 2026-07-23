import { useEffect, useState } from "react";
import { mesin } from "./lib/audio";
import { ambilKonfig } from "./lib/konfigurasi";
import { goncang, kirimToast } from "./lib/efek";
import PartikelCanvas from "./components/PartikelCanvas";
import TopBar from "./components/TopBar";
import Header from "./components/Header";
import Gallery from "./components/Gallery";
import TrollZone from "./components/TrollZone";
import PixelBuddy from "./components/PixelBuddy";
import { PopupSelamat, Toaster } from "./components/Popups";

const konfig = ambilKonfig();

const LINK_BOHONGAN: Array<[string, string]> = [
  ["Friendster", "Friendster sudah tutup sejak kamu SMP 🪦"],
  ["MySpace", "MySpace sekarang isinya cuma Tom. Sendirian. 😶"],
  ["RSS 2.0", "Tidak ada yang tahu apa itu RSS. Termasuk kamu. 📡"],
];

export default function App() {
  const [musikAktif, setMusikAktif] = useState(false);

  const toggleMusik = () => {
    if (musikAktif) {
      mesin.stopBgm();
      setMusikAktif(false);
      kirimToast("Musik dimatikan. Sunyi… seperti harimu 🌫️");
    } else {
      mesin.startBgm(konfig.bgm);
      setMusikAktif(true);
      kirimToast(
        konfig.bgm
          ? "Memutar lagu dari folder bgm 📁"
          : "Chiptune gabut diputar! (taruh lagumu di folder bgm)"
      );
    }
  };

  // petunjuk sekali jalan: suruh pencet Si Gabut
  useEffect(() => {
    const t = window.setTimeout(() => {
      kirimToast("Psst… pencet makhluk kuning di kanan ➜");
    }, 4800);
    return () => window.clearTimeout(t);
  }, []);

  // konami-ish easter egg: ketik "gabut"
  useEffect(() => {
    let ketikan = "";
    const tangani = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return;
      ketikan = (ketikan + e.key.toLowerCase()).slice(-5);
      if (ketikan === "gabut") {
        mesin.sfx("tada");
        goncang();
        kirimToast("🎮 KODE RAHASIA: GABUT! Kamu resmi warga sini.");
      }
    };
    window.addEventListener("keydown", tangani);
    return () => window.removeEventListener("keydown", tangani);
  }, []);

  return (
    <div className="relative min-h-screen">
      <PartikelCanvas />

      <div className="relative z-10">
        <TopBar musikAktif={musikAktif} onMusik={toggleMusik} />
        <Header />

        <main className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <Gallery gambar={konfig.gambar} />
          <TrollZone />
        </main>

        <Footer />
      </div>

      <PixelBuddy daftarSound={konfig.sound} />
      <PopupSelamat />
      <Toaster />

      {/* tekstur layar CRT */}
      <div className="lapisan-vignette" aria-hidden="true" />
      <div className="lapisan-scanline" aria-hidden="true" />
      <div className="lapisan-noise" aria-hidden="true" />
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-8">
      <div className="garis-konstruksi h-5 w-full" aria-hidden="true" />
      <div className="border-t-[3px] border-[#2a3160] bg-[#0a0e1f] py-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-pixel text-[8px] leading-relaxed text-white/70 sm:text-[9px]">
              © 2004–2026 PT. GABUT SELALU JAYA
            </p>
            <p className="mt-1.5 text-[13px] text-white/45">
              Tidak ada hak cipta. Silakan dibajak dengan bangga.
            </p>
          </div>

          <nav className="flex flex-wrap gap-4">
            {LINK_BOHONGAN.map(([label, ejekan]) => (
              <button
                key={label}
                type="button"
                onClick={() => kirimToast(ejekan)}
                className="touch-manipulation font-pixel text-[8px] text-[#29f3ff] underline decoration-dotted underline-offset-4 transition-colors hover:text-[#ffd400]"
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
        <p className="mx-auto mt-6 w-full max-w-5xl px-4 text-center font-pixel text-[7px] leading-relaxed text-white/30 sm:px-6">
          Situs ini 100% tidak berguna dan memang disengaja · Dibangun dengan 0% motivasi
          dan 100% cinta · Kalau terasa lag, salah kamu
        </p>
      </div>
    </footer>
  );
}
