const STORAGE_KEY = 'code_conspiracy_state';
const STATE_VERSION = '1.0.0';

const defaultState = {
  version: STATE_VERSION,
  currentChapter: 0,
  unlockedInterfaces: ['vscode', 'jira', 'whatsapp', 'search'],
  discoveredFiles: [],
  collectedEvidence: [],
  whatsappChats: null,
  whatsappMeta: null,
  jiraTickets: {},
  jiraTicketsData: null,
  vscodeState: null,
  intranetState: null,
  darknetState: null,
  searchHistory: [],
  readArticles: [],
  whatsappSentCount: 0,
  flags: {},
  endings: [],
  settings: {
    language: 'zh-TW',
    theme: 'dark',
    sound: true,
    reducedMotion: false,
    bgmVolume: 0.25,
    bgmMuted: false
  },
  playtime: 0,
  lastSaved: null
};

class StateManager {
  constructor() {
    this.state = this.load();
    this.listeners = new Map();
    this.saveDebounce = null;
    this.playtimeInterval = null;
    this.startPlaytimeTracking();
  }

  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.migrateState(parsed);
      }
    } catch (e) {
      console.warn('Failed to load game state:', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  migrateState(state) {
    if (!state.version) {
      state.version = STATE_VERSION;
    }
    // Deep merge defaults for critical keys to avoid losing flags/endings on corrupted saves
    const merged = { ...defaultState, ...state };
    // Ensure flags is always an object and preserve all stored flags
    merged.flags = { ...(defaultState.flags || {}), ...(state.flags || {}) };
    merged.endings = Array.isArray(state.endings) ? [...state.endings] : [...defaultState.endings];
    merged.discoveredFiles = Array.isArray(state.discoveredFiles) ? [...state.discoveredFiles] : [];
    merged.collectedEvidence = Array.isArray(state.collectedEvidence) ? [...state.collectedEvidence] : [];
    merged.searchHistory = Array.isArray(state.searchHistory) ? [...state.searchHistory] : [];
    merged.readArticles = Array.isArray(state.readArticles) ? [...state.readArticles] : [];
    merged.whatsappSentCount = typeof state.whatsappSentCount === 'number' ? state.whatsappSentCount : 0;
    if (!merged.settings || typeof merged.settings !== 'object') {
      merged.settings = { ...defaultState.settings };
    } else {
      merged.settings = { ...defaultState.settings, ...state.settings };
    }
    if (!Array.isArray(merged.unlockedInterfaces) || !merged.unlockedInterfaces.length) {
      merged.unlockedInterfaces = [...defaultState.unlockedInterfaces];
    } else {
      for (const iface of defaultState.unlockedInterfaces) {
        if (!merged.unlockedInterfaces.includes(iface)) merged.unlockedInterfaces.push(iface);
      }
    }
    // Preserve optional persisted app states if present
    if (state.whatsappChats !== undefined) merged.whatsappChats = state.whatsappChats;
    if (state.whatsappMeta !== undefined) merged.whatsappMeta = state.whatsappMeta;
    if (state.jiraTicketsData !== undefined) merged.jiraTicketsData = state.jiraTicketsData;
    if (state.jiraTickets !== undefined) merged.jiraTickets = { ...(state.jiraTickets || {}) };
    if (state.vscodeState !== undefined) merged.vscodeState = state.vscodeState;
    if (state.intranetState !== undefined) merged.intranetState = state.intranetState;
    if (state.darknetState !== undefined) merged.darknetState = state.darknetState;
    if (state.readArticles !== undefined) merged.readArticles = Array.isArray(state.readArticles) ? [...state.readArticles] : [];
    if (typeof state.whatsappSentCount === 'number') merged.whatsappSentCount = state.whatsappSentCount;
    if (typeof state.currentChapter === 'number') merged.currentChapter = state.currentChapter;
    if (typeof state.playtime === 'number') merged.playtime = state.playtime;
    return merged;
  }

  save(immediate = false) {
    if (immediate) {
      this._doSave();
      return;
    }
    clearTimeout(this.saveDebounce);
    this.saveDebounce = setTimeout(() => this._doSave(), 500);
  }

  _doSave() {
    this.state.lastSaved = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.emit('save', this.state);
    } catch (e) {
      console.error('Failed to save game state:', e);
      this.emit('saveError', e);
    }
  }

  get(path) {
    if (!path) return this.state;
    return path.split('.').reduce((obj, key) => obj?.[key], this.state);
  }

  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => {
      if (!obj[key]) obj[key] = {};
      return obj[key];
    }, this.state);
    target[lastKey] = value;
    this.emit('change', { path, value, state: this.state });
    // Critical paths should persist immediately to survive refresh
    const critical = path.startsWith('flags.') || path === 'currentChapter' || path === 'endings' || path.startsWith('endings') || path === 'readArticles' || path.startsWith('readArticles') || path === 'whatsappSentCount';
    if (critical) this.save(true);
    else this.save();
  }

  update(path, updater) {
    const current = this.get(path);
    this.set(path, updater(current));
  }

  push(path, value) {
    const arr = this.get(path) || [];
    this.set(path, [...arr, value]);
  }

  remove(path, predicate) {
    const arr = this.get(path) || [];
    this.set(path, arr.filter(item => !predicate(item)));
  }

  hasFlag(flag) {
    return !!this.state.flags[flag];
  }

  setFlag(flag, value = true) {
    // Flags drive progression — save immediately so refresh never loses them (e.g. ch0_maggie_notified)
    this.set(`flags.${flag}`, value);
    // Force immediate persist for flags/endings/currentChapter to survive instant refresh
    this.save(true);
  }

  addEvidence(evidence) {
    const exists = this.state.collectedEvidence.some(e => e.id === evidence.id);
    if (!exists) {
      this.push('collectedEvidence', { ...evidence, discoveredAt: new Date().toISOString() });
      this.emit('evidence', evidence);
      this.save(true);
    }
  }

  unlockInterface(iface) {
    if (!this.state.unlockedInterfaces.includes(iface)) {
      this.push('unlockedInterfaces', iface);
      this.emit('interfaceUnlocked', iface);
    }
  }

  discoverFile(filePath) {
    if (!this.state.discoveredFiles.includes(filePath)) {
      this.push('discoveredFiles', filePath);
      this.emit('fileDiscovered', filePath);
      this.save(true);
    }
  }

  markArticleRead(url) {
    if (!url) return;
    if (!this.state.readArticles) this.state.readArticles = [];
    if (!this.state.readArticles.includes(url)) {
      this.push('readArticles', url);
      this.save(true);
    }
  }

  incrementWhatsappSent() {
    const cur = typeof this.state.whatsappSentCount === 'number' ? this.state.whatsappSentCount : 0;
    this.set('whatsappSentCount', cur + 1);
    this.save(true);
  }

  startPlaytimeTracking() {
    this.playtimeInterval = setInterval(() => {
      this.state.playtime += 1;
      if (this.state.playtime % 60 === 0) {
        this.save(true);
      }
    }, 1000);
  }

  stopPlaytimeTracking() {
    clearInterval(this.playtimeInterval);
    this.save(true);
  }

  exportSave() {
    return JSON.stringify(this.state, null, 2);
  }

  importSave(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      this.state = this.migrateState(imported);
      this.save(true);
      this.emit('load', this.state);
      return true;
    } catch (e) {
      console.error('Failed to import save:', e);
      return false;
    }
  }

  reset() {
    // Deep copy to avoid shared references and clear timers
    try { clearTimeout(this.saveDebounce); } catch {}
    try { clearInterval(this.playtimeInterval); } catch {}
    this.state = JSON.parse(JSON.stringify(defaultState));
    // Ensure unlockedInterfaces is a fresh copy
    this.state.unlockedInterfaces = [...defaultState.unlockedInterfaces];
    this.state.flags = {};
    this.state.collectedEvidence = [];
    this.state.discoveredFiles = [];
    this.state.endings = [];
    this.state.searchHistory = [];
    this.state.readArticles = [];
    this.state.whatsappSentCount = 0;
    this.state.jiraTickets = {};
    this.state.whatsappChats = null;
    this.state.whatsappMeta = null;
    this.state.jiraTicketsData = null;
    this.state.vscodeState = null;
    this.state.playtime = 0;
    this.save(true);
    this.emit('reset', this.state);
    // Restart playtime tracking
    this.startPlaytimeTracking();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event, data) {
    this.listeners.get(event)?.forEach(cb => cb(data));
  }
}

export const state = new StateManager();
export default state;