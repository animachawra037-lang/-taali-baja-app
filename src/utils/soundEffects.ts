// Synthesized comedy sound effects using the Web Audio API
// 100% self-contained, no external audio files required, instant latency

class ComedySoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // 1. Clapping Applause (Taali Burst)
  playTaali() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Series of 8-10 quick noise bursts resembling a crowd clapping vigorously
    for (let i = 0; i < 9; i++) {
      const clapTime = now + i * 0.07 + (Math.random() * 0.02);
      this.createNoiseBurst(ctx, clapTime, 0.045, 0.4 + Math.random() * 0.3);
    }
  }

  // 2. Punchline Ba-Dum Tsss!
  playBaDumTss() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // "Ba" (tom drum)
    this.createDrumHit(ctx, now, 160, 80, 0.12, 0.6);

    // "Dum" (lower floor tom)
    this.createDrumHit(ctx, now + 0.18, 120, 60, 0.15, 0.7);

    // "Tssss!" (crisp splash cymbal)
    this.createCymbalCrash(ctx, now + 0.36, 0.5, 0.6);
  }

  // 3. Sad Trombone (Wah-Wah-Wah-Waaaaah)
  playSadTrombone() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [
      { freq: 246.94, dur: 0.28 }, // B3
      { freq: 233.08, dur: 0.28 }, // Bb3
      { freq: 220.0, dur: 0.3 },  // A3
      { freq: 207.65, dur: 0.7, slideTo: 160 }, // Ab3 slide down
    ];

    let t = ctx.currentTime;
    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(n.freq, t);
      if (n.slideTo) {
        osc.frequency.exponentialRampToValueAtTime(n.slideTo, t + n.dur);
      }

      // Wah filter envelope
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, t);
      filter.frequency.exponentialRampToValueAtTime(1200, t + n.dur * 0.4);
      filter.frequency.exponentialRampToValueAtTime(300, t + n.dur);
      filter.Q.value = 4;

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + n.dur);
      t += n.dur + 0.05;
    });
  }

  // 4. Cartoon Spring / Boing
  playBoing() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

    // Tremolo LFO
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 24;
    lfoGain.gain.value = 60;
    lfo.connect(osc.frequency);
    lfo.start(now);
    lfo.stop(now + 0.45);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  // 5. Dramatic Indian Soap Opera Sting (Dhum-Ta-Na-Na Hit)
  playDramaticSting() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Dramatic minor chord strike
    const freqs = [130.81, 155.56, 196.0, 311.13, 392.0];
    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.85);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    });

    // Sudden sub kick
    this.createDrumHit(ctx, now, 120, 40, 0.4, 0.5);
  }

  // 6. Meme Air Horn Blast
  playAirHorn() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bursts = [now, now + 0.12, now + 0.28];
    const freqs = [466.16, 587.33, 698.46]; // Bb chords

    bursts.forEach((startTime, idx) => {
      const dur = idx === 2 ? 0.35 : 0.08;
      freqs.forEach(f => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + dur);
      });
    });
  }

  // 7. Sitcom Laugh Track
  playLaughter() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Rapid staccato vocal-like pulses
    for (let i = 0; i < 7; i++) {
      const pulseTime = now + i * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 + (i % 2 === 0 ? 40 : -20), pulseTime);
      osc.frequency.exponentialRampToValueAtTime(220, pulseTime + 0.07);

      gain.gain.setValueAtTime(0.18, pulseTime);
      gain.gain.exponentialRampToValueAtTime(0.001, pulseTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(pulseTime);
      osc.stop(pulseTime + 0.08);
    }
  }

  // Helpers
  private createNoiseBurst(ctx: AudioContext, time: number, duration: number, vol: number) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000 + Math.random() * 400, time);
    filter.Q.value = 1.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start(time);
    whiteNoise.stop(time + duration);
  }

  private createDrumHit(ctx: AudioContext, time: number, startFreq: number, endFreq: number, dur: number, vol: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + dur);

    gain.gain.setValueAtTime(vol * 0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + dur);
  }

  private createCymbalCrash(ctx: AudioContext, time: number, dur: number, vol: number) {
    const bufferSize = ctx.sampleRate * dur;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6500, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(time);
    noise.stop(time + dur);
  }

  playSoundById(id: string) {
    switch (id) {
      case 'taali':
        this.playTaali();
        break;
      case 'badum_tss':
        this.playBaDumTss();
        break;
      case 'sad_trombone':
        this.playSadTrombone();
        break;
      case 'boing':
        this.playBoing();
        break;
      case 'dramatic':
        this.playDramaticSting();
        break;
      case 'airhorn':
        this.playAirHorn();
        break;
      case 'laughter':
        this.playLaughter();
        break;
      default:
        this.playTaali();
    }
  }
}

export const comedyAudio = new ComedySoundEngine();
