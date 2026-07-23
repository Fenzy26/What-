/* ------------------------------------------------------------------
   Mesin suara: efek 8-bit disintesis lewat WebAudio (tanpa file),
   BGM chiptune otomatis, PLUS dukungan file suara milikmu sendiri
   yang ditaruh di folder "sound" dan "bgm" (lihat /konfigurasi.js).
------------------------------------------------------------------- */

export type NamaSfx = "tekan" | "pop" | "ditolak" | "tada" | "boing" | "koin";

function pilih<T>(daftar: T[]): T {
  return daftar[Math.floor(Math.random() * daftar.length)];
}

const BASS_PER_BAR = [110, 110, 87.31, 87.31, 130.81, 130.81, 98, 98];

/** Melodi chiptune 8 bar x 16 langkah (0 = istirahat). Nada pentatonik A. */
const LEAD: number[][] = [
  [440, 0, 523.25, 0, 587.33, 0, 659.25, 0, 587.33, 0, 523.25, 0, 440, 0, 0, 0],
  [523.25, 0, 440, 0, 392, 0, 440, 0, 523.25, 0, 587.33, 0, 659.25, 0, 0, 0],
  [440, 0, 523.25, 587.33, 659.25, 0, 587.33, 0, 523.25, 0, 440, 0, 392, 0, 0, 0],
  [329.63, 0, 392, 0, 440, 0, 523.25, 0, 440, 0, 392, 0, 329.63, 0, 0, 0],
  [523.25, 523.25, 0, 587.33, 0, 659.25, 0, 587.33, 523.25, 0, 440, 0, 392, 0, 440, 0],
  [440, 0, 0, 523.25, 0, 587.33, 659.25, 0, 783.99, 0, 659.25, 0, 587.33, 0, 523.25, 0],
  [392, 0, 440, 0, 523.25, 0, 587.33, 0, 659.25, 0, 587.33, 0, 523.25, 0, 440, 0],
  [587.33, 0, 523.25, 0, 440, 0, 659.25, 0, 587.33, 523.25, 440, 392, 440, 0, 0, 0],
];

class MesinSuara {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private bufferDeru: AudioBuffer | null = null;

  private timerBgm: number | null = null;
  private langkah = 0;
  private waktuBerikut = 0;
  private modeSintesis = false;
  private extBgm: HTMLAudioElement | null = null;
  private _bgmAktif = false;

  private cacheSfx = new Map<string, HTMLAudioElement>();

  get bgmAktif(): boolean {
    return this._bgmAktif;
  }

  private pastikan(): AudioContext {
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(this.ctx.destination);
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.5;
      this.bgmGain.connect(this.master);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  /** Satu nada oscillator dengan amplop singkat. */
  private nada(
    freq: number,
    t: number,
    dur: number,
    tipe: OscillatorType,
    vol: number,
    tujuan?: AudioNode
  ) {
    const ctx = this.pastikan();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = tipe;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(tujuan ?? this.master!);
    osc.start(t);
    osc.stop(t + dur + 0.03);
  }

  private deru(t: number, dur: number, vol: number, frekMin: number, tujuan?: AudioNode) {
    const ctx = this.pastikan();
    if (!this.bufferDeru) {
      const panjang = ctx.sampleRate * 0.5;
      const buf = ctx.createBuffer(1, panjang, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < panjang; i++) data[i] = Math.random() * 2 - 1;
      this.bufferDeru = buf;
    }
    const src = ctx.createBufferSource();
    src.buffer = this.bufferDeru;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = frekMin;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(tujuan ?? this.master!);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  /** Efek suara 8-bit sintetis. */
  sfx(nama: NamaSfx) {
    try {
      const ctx = this.pastikan();
      const t = ctx.currentTime + 0.005;
      switch (nama) {
        case "tekan": {
          const f = pilih([659.25, 783.99, 880, 987.77]);
          this.nada(f, t, 0.07, "square", 0.16);
          this.nada(f * 1.5, t + 0.06, 0.09, "square", 0.12);
          break;
        }
        case "pop": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(300, t);
          osc.frequency.exponentialRampToValueAtTime(640, t + 0.08);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
          osc.connect(gain);
          gain.connect(this.master!);
          osc.start(t);
          osc.stop(t + 0.12);
          break;
        }
        case "ditolak": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(170, t);
          osc.frequency.exponentialRampToValueAtTime(90, t + 0.3);
          gain.gain.setValueAtTime(0.16, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
          osc.connect(gain);
          gain.connect(this.master!);
          osc.start(t);
          osc.stop(t + 0.35);
          break;
        }
        case "tada": {
          const urutan = [523.25, 659.25, 783.99, 1046.5];
          urutan.forEach((f, i) => this.nada(f, t + i * 0.07, 0.16, "square", 0.13));
          this.deru(t + 0.26, 0.25, 0.08, 5000);
          break;
        }
        case "boing": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(520, t);
          osc.frequency.exponentialRampToValueAtTime(130, t + 0.12);
          osc.frequency.exponentialRampToValueAtTime(380, t + 0.24);
          gain.gain.setValueAtTime(0.22, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
          osc.connect(gain);
          gain.connect(this.master!);
          osc.start(t);
          osc.stop(t + 0.32);
          break;
        }
        case "koin": {
          this.nada(987.77, t, 0.07, "square", 0.13);
          this.nada(1318.5, t + 0.07, 0.18, "square", 0.13);
          break;
        }
      }
    } catch {
      /* audio tidak didukung — diamkan saja */
    }
  }

  /**
   * Putar file dari folder "sound". Return true kalau berhasil.
   * Kalau gagal (file belum ada), otomatis fallback ke suara sintetis.
   */
  async bunyiBerkas(namaBerkas: string): Promise<boolean> {
    const jalur = `sound/${namaBerkas}`;
    try {
      let a = this.cacheSfx.get(jalur);
      if (!a) {
        a = new Audio(jalur);
        a.preload = "auto";
        this.cacheSfx.set(jalur, a);
      }
      a.currentTime = 0;
      a.volume = 0.9;
      await a.play();
      return true;
    } catch {
      return false;
    }
  }

  /** Ambil suara acak dari daftar file; kalau tidak ada, pakai sintetis. */
  async bunyiAcak(daftar: string[]) {
    if (daftar.length > 0) {
      const ok = await this.bunyiBerkas(pilih(daftar));
      if (ok) return;
    }
    this.sfx("tekan");
  }

  /* ------------------------- BGM ------------------------- */

  startBgm(namaBgm: string) {
    this._bgmAktif = true;
    if (namaBgm) {
      const a = new Audio(`bgm/${namaBgm}`);
      a.loop = true;
      a.volume = 0.55;
      this.extBgm = a;
      a.addEventListener("error", () => {
        if (this._bgmAktif && !this.modeSintesis) {
          this.extBgm = null;
          this.startSintesis();
        }
      });
      const p = a.play();
      if (p) {
        p.then(() => {
          this.modeSintesis = false;
        }).catch(() => {
          this.extBgm = null;
          this.startSintesis();
        });
      }
    } else {
      this.startSintesis();
    }
  }

  private startSintesis() {
    this.pastikan();
    if (this.timerBgm !== null) return;
    this.modeSintesis = true;
    this.langkah = 0;
    this.waktuBerikut = this.ctx!.currentTime + 0.08;
    this.timerBgm = window.setInterval(() => this.jadwalkan(), 25);
  }

  private jadwalkan() {
    const ctx = this.ctx;
    if (!ctx || !this.bgmGain) return;
    const spb = 60 / 118 / 4; // 118 BPM, not 1/16
    while (this.waktuBerikut < ctx.currentTime + 0.16) {
      const bar = Math.floor(this.langkah / 16) % LEAD.length;
      const s = this.langkah % 16;
      const t = this.waktuBerikut;
      const bgm = this.bgmGain;

      if (s % 4 === 2) this.deru(t, 0.03, 0.045, 7000, bgm); // hi-hat
      if (s === 4 || s === 12) this.deru(t, 0.09, 0.1, 1800, bgm); // snare
      if (s === 0 || s === 4 || s === 8 || s === 12) {
        this.nada(BASS_PER_BAR[bar], t, 0.22, "triangle", 0.3, bgm); // bass
      }
      if (s === 14) this.nada(BASS_PER_BAR[bar] * 2, t, 0.1, "triangle", 0.14, bgm);

      const f = LEAD[bar][s];
      if (f > 0) this.nada(f, t, 0.16, "square", 0.1, bgm); // lead

      this.waktuBerikut += spb;
      this.langkah++;
    }
  }

  stopBgm() {
    this._bgmAktif = false;
    if (this.timerBgm !== null) {
      window.clearInterval(this.timerBgm);
      this.timerBgm = null;
    }
    if (this.extBgm) {
      this.extBgm.pause();
      this.extBgm = null;
    }
    this.modeSintesis = false;
  }
}

export const mesin = new MesinSuara();
