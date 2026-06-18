// Music Box / Ambient Synth implementation of Happy Birthday
// Zero dependencies, instant loading.

let audioCtx: AudioContext | null = null;

function initAudio() {
  if (!audioCtx) {
    const WebkitAudioContext = (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    audioCtx = new (window.AudioContext || WebkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Haptic feedback helper — silent fallback on unsupported browsers
export const vibrate = (pattern: number | number[]) => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

export const playPop = () => {
  if (typeof window === "undefined") return;
  const ctx = initAudio();
  
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  // A cute, satisfying bubble pop sound
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
};

export const playBGM = () => {
  if (typeof window === "undefined") return;
  const ctx = initAudio();
  
  // Happy Birthday Melody (Notes and durations)
  // 0 = C4, 2 = D4, 4 = E4, 5 = F4, 7 = G4, 9 = A4, 11 = B4, 12 = C5
  const bpm = 120;
  const beat = 60 / bpm;
  
  const notes = [
    { n: 7, d: 0.75 }, { n: 7, d: 0.25 }, { n: 9, d: 1 }, { n: 7, d: 1 }, { n: 12, d: 1 }, { n: 11, d: 2 },
    { n: 7, d: 0.75 }, { n: 7, d: 0.25 }, { n: 9, d: 1 }, { n: 7, d: 1 }, { n: 14, d: 1 }, { n: 12, d: 2 },
    { n: 7, d: 0.75 }, { n: 7, d: 0.25 }, { n: 19, d: 1 }, { n: 16, d: 1 }, { n: 12, d: 1 }, { n: 11, d: 1 }, { n: 9, d: 1 },
    { n: 17, d: 0.75 }, { n: 17, d: 0.25 }, { n: 16, d: 1 }, { n: 12, d: 1 }, { n: 14, d: 1 }, { n: 12, d: 2 }
  ];

  let time = ctx.currentTime + 0.5; // Start half a second from now
  
  // Base frequency for G3 (since our array starts relative to G)
  const baseFreq = 261.63; // C4

  const playNote = (semitone: number, duration: number, startTime: number) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Lo-fi Music box sound = sine wave + slight attack/decay
    osc.type = 'sine';
    
    // Calculate frequency based on equal temperament
    osc.frequency.value = baseFreq * Math.pow(2, semitone / 12);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Envelope for music box pluck
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration - 0.05); // Decay
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const playSequence = () => {
    time = ctx.currentTime;
    for (const note of notes) {
      const noteDuration = note.d * beat;
      playNote(note.n - 7, noteDuration, time); // Adjusting so 7=G3
      time += noteDuration;
    }
    
    // Loop
    setTimeout(playSequence, (time - ctx.currentTime + 2) * 1000);
  };

  playSequence();
};

export const playPurr = () => {
  if (typeof window === "undefined") return;
  const ctx = initAudio();
  
  // A cat purr is a low frequency rumble (20-30Hz) modulated by breathing
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  // LFO to simulate the breathing/rhythmic pattern of a purr
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  
  // Carrier: Low rumble
  osc.type = 'sawtooth';
  osc.frequency.value = 25; // 25Hz fundamental purr frequency
  
  // Modulator: Breathing rhythm (about 1-2 breaths per second)
  lfo.type = 'sine';
  lfo.frequency.value = 1.5;
  
  // Connect modulation
  lfo.connect(lfoGain);
  lfoGain.connect(gainNode.gain);
  
  // Connect main signal path
  osc.connect(gainNode);
  
  // Add a lowpass filter to remove harsh highs from the sawtooth
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;
  gainNode.connect(filter);
  filter.connect(ctx.destination);
  
  // Envelope
  const now = ctx.currentTime;
  const duration = 2.5; // Purr for 2.5 seconds
  
  lfoGain.gain.value = 0.5; // Depth of modulation
  
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.8, now + 0.5); // Fade in
  gainNode.gain.setValueAtTime(0.8, now + duration - 0.5);
  gainNode.gain.linearRampToValueAtTime(0, now + duration); // Fade out
  
  osc.start(now);
  lfo.start(now);
  
  osc.stop(now + duration);
  lfo.stop(now + duration);
};
