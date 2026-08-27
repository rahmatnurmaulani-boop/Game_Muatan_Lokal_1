// soundUtils.js
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.isBgmPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // =========================================================================
  // PROSEDURAL BACKGROUND MUSIC (BGM): ETHNIC DAYAK WAR DRUMS & SAPE MELODY
  // =========================================================================
  startBGM() {
    if (this.isBgmPlaying || this.muted) return;
    this.init();
    this.isBgmPlaying = true;
    this.bgmStep = 0;

    // Tangga Nada Pentatonik Sape Dayak (D Minor Pentatonic: D, F, G, A, C)
    const sapeMelody = [
      293.66, 0, 349.23, 392.0, 440.0, 0, 392.0, 349.23, 293.66, 349.23, 440.0,
      523.25, 440.0, 392.0, 349.23, 0, 440.0, 0, 523.25, 440.0, 392.0, 349.23,
      293.66, 0, 349.23, 392.0, 440.0, 392.0, 349.23, 293.66, 220.0, 0,
    ];

    const stepTime = 135; // 135ms per step (~110 BPM yang energik)

    this.bgmTimer = setInterval(() => {
      if (!this.isBgmPlaying || this.muted) return;
      const step = this.bgmStep % 32;
      const now = this.ctx.currentTime;

      // 1. KETUKAN GENDANG / BEDUG UTAMA (Katambung / War Drum)
      if (step % 4 === 0 || step % 8 === 6) {
        this.playDrum(now, step % 8 === 0 ? 110 : 80, 0.22);
      }

      // 2. PERKUSI RITMIS KAYU / RATTLE (Woodblock & Shaker)
      if (step % 2 === 0) {
        this.playWoodPerc(now, step % 4 === 2 ? 650 : 850, 0.08);
      }

      // 3. PETIKAN INSTRUMEN SAPE DAYAK
      const noteFreq = sapeMelody[step];
      if (noteFreq > 0) {
        this.playSapePluck(now, noteFreq, 0.12);
      }

      this.bgmStep++;
    }, stepTime);
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // Sintesis Suara Gendang Katambung
  playDrum(time, freq, volume) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + 0.18);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.18);
  }

  // Sintesis Perkusi Kayu / Tong-tong Tradisional
  playWoodPerc(time, freq, volume) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.04);
  }

  // Sintesis Petikan Sape Dayak Khas Kalimantan
  playSapePluck(time, freq, volume) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth"; // Memberikan tekstur dawai senar yang renyah
    osc.frequency.setValueAtTime(freq, time);

    // Filter nada agar terasa hangat seperti kayu alami
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, time);
    filter.frequency.exponentialRampToValueAtTime(400, time + 0.25);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.28);
  }

  // =========================================================================
  // SOUND EFFECTS (SFX)
  // =========================================================================
  playCorrect() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.3);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  playTugPull() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.22);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playWrong() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  playTick() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(700, now);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  playFanfare() {
    if (this.muted) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((freq, i) => {
      const now = this.ctx.currentTime + i * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    });
  }
}

export const sounds = new SoundEngine();
