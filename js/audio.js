/**
 * Audio system for stress-relief app
 * Handles: AudioContext init, background music, sound effects
 */

const AudioSystem = {
  ctx: null,
  masterGain: null,
  musicGain: null,
  sfxGain: null,
  currentMusic: null,
  musicSource: null,
  musicStarted: false,
  musicPlaying: false,
  currentTrackIndex: 0,
  activeSfxNodes: [],
  maxSfx: 8,

  // Curated soothing tracks (using Web Audio API generated tones as fallback)
  tracks: [
    { name: '宁静森林', freq: 220, type: 'sine' },
    { name: '海洋微风', freq: 196, type: 'sine' },
    { name: '星空夜曲', freq: 261.63, type: 'triangle' },
    { name: '雨声轻语', freq: 174.81, type: 'sine' },
  ],

  // Sound effect presets
  sfxPresets: {
    tear: { freq: 800, type: 'sawtooth', duration: 0.3, decay: 0.1 },
    pop: { freq: 600, type: 'sine', duration: 0.15, decay: 0.05 },
    crunch: { freq: 300, type: 'triangle', duration: 0.4, decay: 0.2 },
    sweep: { freq: 200, type: 'sine', duration: 0.5, decay: 0.3 },
  },

  /**
   * Initialize AudioContext (must be called after user gesture)
   */
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0.8;

    this.musicGain = this.ctx.createGain();
    this.musicGain.connect(this.masterGain);
    this.musicGain.gain.value = 0.4;

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.connect(this.masterGain);
    this.sfxGain.gain.value = 0.6;
  },

  /**
   * Generate a soothing tone as background music
   */
  _createToneSource(freq, type) {
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gainNode.gain.value = 0;
    osc.connect(gainNode);
    gainNode.connect(this.musicGain);
    return { osc, gainNode };
  },

  /**
   * Start playing background music
   */
  playMusic() {
    this.init();
    if (this.musicPlaying) return;

    const track = this.tracks[this.currentTrackIndex];
    const { osc, gainNode } = this._createToneSource(track.freq, track.type);

    // Add lush harmonics for richer sound
    const harmonic = this.ctx.createOscillator();
    const harmonicGain = this.ctx.createGain();
    harmonic.type = 'sine';
    harmonic.frequency.value = track.freq * 1.5;
    harmonicGain.gain.value = 0;
    harmonic.connect(harmonicGain);
    harmonicGain.connect(this.musicGain);
    harmonic.start();

    // Low pad for warmth
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.value = track.freq * 0.5;
    subGain.gain.value = 0;
    sub.connect(subGain);
    subGain.connect(this.musicGain);
    sub.start();

    osc.start();
    const now = this.ctx.currentTime;
    gainNode.gain.setTargetAtTime(0.15, now, 0.5);
    harmonicGain.gain.setTargetAtTime(0.06, now, 0.5);
    subGain.gain.setTargetAtTime(0.1, now, 0.5);

    this.currentMusic = { osc, gainNode, harmonic, harmonicGain, sub, subGain };
    this.musicStarted = true;
    this.musicPlaying = true;

    document.getElementById('musicPlayBtn').textContent = '⏸ 暂停';
    document.getElementById('musicPlayBtn').classList.add('playing');
  },

  /**
   * Pause music
   */
  pauseMusic() {
    if (!this.musicPlaying || !this.currentMusic) return;
    const now = this.ctx.currentTime;
    const m = this.currentMusic;
    m.gainNode.gain.setTargetAtTime(0, now, 0.3);
    m.harmonicGain.gain.setTargetAtTime(0, now, 0.3);
    m.subGain.gain.setTargetAtTime(0, now, 0.3);

    setTimeout(() => {
      try { m.osc.stop(); m.harmonic.stop(); m.sub.stop(); } catch(e) {}
    }, 400);

    this.currentMusic = null;
    this.musicPlaying = false;
    document.getElementById('musicPlayBtn').textContent = '▶ 播放';
    document.getElementById('musicPlayBtn').classList.remove('playing');
  },

  /**
   * Toggle play/pause
   */
  toggleMusic() {
    if (this.musicPlaying) {
      this.pauseMusic();
    } else {
      this.playMusic();
    }
  },

  /**
   * Switch to a specific track
   */
  switchTrack(index) {
    if (index === this.currentTrackIndex && this.musicPlaying) return;
    this.currentTrackIndex = index;
    if (this.musicPlaying) {
      this.pauseMusic();
      setTimeout(() => this.playMusic(), 350);
    }
    this._updateTrackListUI();
  },

  /**
   * Set music volume (0-100)
   */
  setMusicVolume(value) {
    const vol = value / 100;
    if (this.musicGain) {
      this.musicGain.gain.value = vol * 0.5;
    }
  },

  /**
   * Set sound effects volume (0-100)
   */
  setSfxVolume(value) {
    const vol = value / 100;
    if (this.sfxGain) {
      this.sfxGain.gain.value = vol * 0.8;
    }
  },

  /**
   * Play a one-shot sound effect
   */
  playSfx(presetName) {
    this.init();
    const preset = this.sfxPresets[presetName];
    if (!preset) return;

    // Enforce concurrency limit
    while (this.activeSfxNodes.length >= this.maxSfx) {
      const old = this.activeSfxNodes.shift();
      try { old.stop(); } catch(e) {}
    }

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    osc.type = preset.type;

    // Slight random pitch variation for natural feel
    osc.frequency.value = preset.freq * (0.9 + Math.random() * 0.2);

    // Add noise component for texture
    const bufferSize = this.ctx.sampleRate * preset.duration;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.08;
    noise.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noise.start();

    osc.connect(gainNode);
    gainNode.connect(this.sfxGain);

    const now = this.ctx.currentTime;
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + preset.duration);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + preset.duration);

    osc.start(now);
    osc.stop(now + preset.duration + 0.05);
    noise.stop(now + preset.duration + 0.05);

    const nodes = [osc, noise];
    this.activeSfxNodes.push({ stop: () => { try { nodes.forEach(n => n.stop()); } catch(e) {} } });

    // Clean up finished nodes
    setTimeout(() => {
      const idx = this.activeSfxNodes.findIndex(n => n.stop === nodes[0].stop?.bind);
      if (idx >= 0) this.activeSfxNodes.splice(idx, 1);
    }, preset.duration * 1000 + 100);
  },

  /**
   * Play crunch sound continuously (returns a stop function)
   */
  playContinuousSfx(presetName) {
    this.init();
    const preset = this.sfxPresets[presetName];
    if (!preset) return () => {};

    let running = true;
    let interval;

    const playOne = () => {
      if (!running) return;
      this.playSfx(presetName);
    };

    // Play immediately, then repeat
    playOne();
    interval = setInterval(playOne, preset.duration * 1000 * 1.5);

    return () => {
      running = false;
      clearInterval(interval);
    };
  },

  /**
   * Build track list UI
   */
  _updateTrackListUI() {
    const list = document.getElementById('musicTrackList');
    list.innerHTML = this.tracks.map((t, i) =>
      `<button class="music-track-item${i === this.currentTrackIndex ? ' active' : ''}" data-index="${i}">${t.name}</button>`
    ).join('');
  },

  /**
   * Initialize UI bindings
   */
  initUI() {
    const toggle = document.getElementById('musicToggle');
    const panel = document.getElementById('musicPanel');
    const closeBtn = document.getElementById('musicPanelClose');
    const playBtn = document.getElementById('musicPlayBtn');
    const musicVol = document.getElementById('musicVolume');
    const sfxVol = document.getElementById('sfxVolume');

    toggle.addEventListener('click', () => {
      this.init();
      panel.classList.toggle('visible');
      toggle.classList.toggle('active');
    });

    closeBtn.addEventListener('click', () => {
      panel.classList.remove('visible');
      toggle.classList.remove('active');
    });

    playBtn.addEventListener('click', () => this.toggleMusic());

    musicVol.addEventListener('input', (e) => this.setMusicVolume(e.target.value));
    sfxVol.addEventListener('input', (e) => this.setSfxVolume(e.target.value));

    // Track list delegation
    document.getElementById('musicTrackList').addEventListener('click', (e) => {
      const item = e.target.closest('.music-track-item');
      if (item) {
        const idx = parseInt(item.dataset.index);
        this.switchTrack(idx);
      }
    });

    // Initial UI state
    this._updateTrackListUI();
  }
};
