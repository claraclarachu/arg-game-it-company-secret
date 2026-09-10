import { state } from '../core/state.js';

// BGM 路徑對照
const BGM_PATHS = {
  default: `${import.meta.env.BASE_URL}assets/data/music/Teacup Corridor (warmer).mp3`,
  darknet: `${import.meta.env.BASE_URL}assets/data/music/Teacup Corridor.mp3`,
  cooperate: `${import.meta.env.BASE_URL}assets/data/music/bgm_cowork.mp3`,
  flee: `${import.meta.env.BASE_URL}assets/data/music/bgm_flee.mp3`,
  fried: `${import.meta.env.BASE_URL}assets/data/music/bgm_fried.mp3`,
  report: `${import.meta.env.BASE_URL}assets/data/music/bgm_report.mp3`,
  resign: `${import.meta.env.BASE_URL}assets/data/music/bgm_resign.mp3`
};

// 預設音量 (0-1)
const DEFAULT_VOLUME = 0.25;
const FADE_DURATION = 1500; // ms

class BGMManager {
  constructor() {
    this.audio = null;
    this.currentBgm = null;
    this.isMuted = false;
    this.volume = DEFAULT_VOLUME;
    this.fadeTimer = null;
    this._loadSettings();
  }

  _loadSettings() {
    const settings = state.get('settings');
    if (settings) {
      if (typeof settings.bgmVolume === 'number') this.volume = settings.bgmVolume;
      if (typeof settings.bgmMuted === 'boolean') this.isMuted = settings.bgmMuted;
    }
  }

  _saveSettings() {
    state.set('settings.bgmVolume', this.volume);
    state.set('settings.bgmMuted', this.isMuted);
  }

  _createAudio(src) {
    const a = new Audio(src);
    a.loop = true;
    a.preload = 'auto';
    a.volume = this.isMuted ? 0 : this.volume;
    return a;
  }

  _fadeVolume(from, to, duration, onDone) {
    if (this.fadeTimer) cancelAnimationFrame(this.fadeTimer);
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = from + (to - from) * progress;
      if (this.audio) this.audio.volume = this.isMuted ? 0 : current;
      if (progress < 1) {
        this.fadeTimer = requestAnimationFrame(step);
      } else {
        this.fadeTimer = null;
        if (onDone) onDone();
      }
    };
    this.fadeTimer = requestAnimationFrame(step);
  }

  _stopCurrent(fadeOut = true) {
    if (!this.audio) return Promise.resolve();
    const prev = this.audio;
    const prevVol = prev.volume;
    if (fadeOut && prevVol > 0) {
      return new Promise(resolve => {
        this._fadeVolume(prevVol, 0, FADE_DURATION, () => {
          prev.pause();
          prev.src = '';
          resolve();
        });
      });
    } else {
      prev.pause();
      prev.src = '';
      return Promise.resolve();
    }
  }

  async play(bgmKey) {
    const src = BGM_PATHS[bgmKey];
    if (!src) return;
    if (this.currentBgm === bgmKey) return;

    await this._stopCurrent(true);

    this.currentBgm = bgmKey;
    this.audio = this._createAudio(src);

    try {
      await this.audio.play();
      this._fadeVolume(0, this.volume, FADE_DURATION);
    } catch (e) {
      console.warn('BGM play failed:', e);
    }
  }

  async stop(fadeOut = true) {
    await this._stopCurrent(fadeOut);
    this.audio = null;
    this.currentBgm = null;
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.audio && !this.isMuted) {
      this.audio.volume = this.volume;
    }
    this._saveSettings();
  }

  getVolume() {
    return this.volume;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    this._saveSettings();
    return this.isMuted;
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    this._saveSettings();
  }

  isMutedState() {
    return this.isMuted;
  }

  getCurrentBgm() {
    return this.currentBgm;
  }
}

export const bgm = new BGMManager();
export default bgm;
