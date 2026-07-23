import { useEffect, useRef } from "react";

interface Bintang {
  x: number;
  y: number;
  s: number;
  fase: number;
  cepat: number;
  warna: string;
}
interface Kotak {
  x: number;
  y: number;
  uk: number;
  vx: number;
  vy: number;
  warna: string;
  a: number;
}
interface Percikan {
  x: number;
  y: number;
  umur: number;
  warna: string;
}

const WARNA = ["#ffd400", "#29f3ff", "#ff3ea5", "#b4ff39"];

/**
 * Latar hidup: bintang berkedip + kotak pixel melayang + jejak kursor.
 * Dioptimalkan untuk 60fps: tanpa filter/blur, jumlah partikel
 * otomatis dikurangi di layar kecil / perangkat sentuh, DPR dibatasi.
 */
export default function PartikelCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gerakanDikurangi = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const kasar = window.matchMedia("(pointer: coarse)").matches;
    const kecil = window.innerWidth < 720;
    const sedikit = kasar || kecil;

    let w = 0;
    let h = 0;
    let raf = 0;
    let terlihat = !document.hidden;

    const dpr = Math.min(window.devicePixelRatio || 1, sedikit ? 1.25 : 1.75);

    const ubahUkuran = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    ubahUkuran();

    const bintang: Bintang[] = Array.from({ length: sedikit ? 55 : 110 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      s: Math.random() < 0.75 ? 2 : 3,
      fase: Math.random() * Math.PI * 2,
      cepat: 0.5 + Math.random() * 1.5,
      warna: Math.random() < 0.82 ? "#eef0ff" : WARNA[Math.floor(Math.random() * WARNA.length)],
    }));

    const kotak: Kotak[] = Array.from({ length: sedikit ? 14 : 30 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      uk: 3 + Math.random() * 5,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.12 + Math.random() * 0.3),
      warna: WARNA[Math.floor(Math.random() * WARNA.length)],
      a: 0.25 + Math.random() * 0.4,
    }));

    const percikan: Percikan[] = [];
    let px = -100;
    let py = -100;
    let bingkai = 0;

    const gerak = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const dx = e.clientX - px;
      const dy = e.clientY - py;
      if (dx * dx + dy * dy < 90) return;
      px = e.clientX;
      py = e.clientY;
      percikan.push({
        x: px,
        y: py,
        umur: 1,
        warna: WARNA[Math.floor(Math.random() * WARNA.length)],
      });
      if (percikan.length > 40) percikan.shift();
    };

    const vis = () => {
      terlihat = !document.hidden;
    };

    const gambar = (t: number) => {
      raf = requestAnimationFrame(gambar);
      if (!terlihat) return;
      ctx.clearRect(0, 0, w, h);

      // bintang berkedip
      for (const b of bintang) {
        ctx.globalAlpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * 0.001 * b.cepat + b.fase));
        ctx.fillStyle = b.warna;
        ctx.fillRect(b.x, b.y, b.s, b.s);
      }

      // kotak pixel melayang
      for (const k of kotak) {
        k.x += k.vx;
        k.y += k.vy;
        if (k.y < -10) {
          k.y = h + 10;
          k.x = Math.random() * w;
        }
        if (k.x < -10) k.x = w + 10;
        if (k.x > w + 10) k.x = -10;
        ctx.globalAlpha = k.a;
        ctx.fillStyle = k.warna;
        ctx.fillRect(k.x, k.y, k.uk, k.uk);
      }

      // jejak kursor
      bingkai++;
      if (bingkai % 2 === 0) {
        for (let i = percikan.length - 1; i >= 0; i--) {
          percikan[i].umur -= 0.06;
          if (percikan[i].umur <= 0) percikan.splice(i, 1);
        }
      }
      for (const p of percikan) {
        ctx.globalAlpha = p.umur * 0.8;
        ctx.fillStyle = p.warna;
        const s = 2 + p.umur * 4;
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }

      ctx.globalAlpha = 1;
    };

    const gambarStatis = () => {
      ctx.clearRect(0, 0, w, h);
      for (const b of bintang) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = b.warna;
        ctx.fillRect(b.x, b.y, b.s, b.s);
      }
      ctx.globalAlpha = 1;
    };

    window.addEventListener("resize", ubahUkuran);

    if (gerakanDikurangi) {
      gambarStatis();
    } else {
      window.addEventListener("pointermove", gerak, { passive: true });
      document.addEventListener("visibilitychange", vis);
      raf = requestAnimationFrame(gambar);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", ubahUkuran);
      window.removeEventListener("pointermove", gerak);
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
