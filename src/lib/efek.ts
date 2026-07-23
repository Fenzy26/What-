const WARNA_KONFETI = ["#ffd400", "#29f3ff", "#ff3ea5", "#b4ff39", "#ff4d2e"];

/** Kirim pesan ke sistem toast (pojok kiri bawah). */
export function kirimToast(pesan: string) {
  window.dispatchEvent(new CustomEvent<string>("gabut-toast", { detail: pesan }));
}

/** Guncang seluruh layar sebentar. */
export function goncang() {
  document.body.classList.remove("goncang");
  void document.body.offsetWidth; // restart animasi
  document.body.classList.add("goncang");
  window.setTimeout(() => document.body.classList.remove("goncang"), 520);
}

/** Ledakkan konfeti kotak-kotak pixel dari titik (x, y) layar. */
export function ledakkan(x: number, y: number) {
  if (document.querySelectorAll(".konfeti").length > 120) return; // jaga performa
  for (let i = 0; i < 26; i++) {
    const el = document.createElement("span");
    el.className = "konfeti";
    const ukuran = 5 + Math.random() * 7;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${ukuran}px`;
    el.style.height = `${Math.random() > 0.5 ? ukuran : ukuran * 0.45}px`;
    el.style.background = WARNA_KONFETI[i % WARNA_KONFETI.length];
    el.style.setProperty("--dx", `${(Math.random() - 0.5) * 260}px`);
    el.style.setProperty("--dy", `${-40 - Math.random() * 180}px`);
    el.style.setProperty("--rot", `${(Math.random() - 0.5) * 900}deg`);
    el.addEventListener("animationend", () => el.remove());
    document.body.appendChild(el);
  }
}

/** Konfeti dari tengah sebuah elemen (mis. tombol). */
export function ledakkanDari(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  ledakkan(r.left + r.width / 2, r.top + r.height / 2);
}
