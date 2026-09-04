const STORAGE_KEY = 'code_conspiracy_state';
const STATE_VERSION = '1.0.0';

const defaultState = {
  version: STATE_VERSION,
  currentChapter: 0,
  unlockedInterfaces: ['vscode', 'jira', 'whatsapp', 'search'],
  discoveredFiles: [],
  collectedEvidence: [],
  whatsappChats: {},
  jiraTickets: {},
  searchHistory: [],
  flags: {},
  endings: [],
  settings: {
    language: 'zh-TW',
    theme: 'dark',
    sound: true,
    reducedMotion: false
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
    if (!state.settings) {
      state.settings = defaultState.settings;
    }
    if (!state.unlockedInterfaces) {
      state.unlockedInterfaces = [...defaultState.unlockedInterfaces];
    } else {
      // Ensure all interfaces are unlocked from the start — no gating
      for (const iface of defaultState.unlockedInterfaces) {
        if (!state.unlockedInterfaces.includes(iface)) state.unlockedInterfaces.push(iface);
      }
    }
    return { ...defaultState, ...state, unlockedInterfaces: state.unlockedInterfaces };
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
    this.save();
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
    this.set(`flags.${flag}`, value);
  }

  addEvidence(evidence) {
    const exists = this.state.collectedEvidence.some(e => e.id === evidence.id);
    if (!exists) {
      this.push('collectedEvidence', { ...evidence, discoveredAt: new Date().toISOString() });
      this.emit('evidence', evidence);
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
    }
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
    this.state.jiraTickets = {};
    this.state.whatsappChats = {};
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