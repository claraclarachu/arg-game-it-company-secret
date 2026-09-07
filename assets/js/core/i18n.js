import { state } from './state.js';

const dict = {
  'zh-TW': {
    'app.title': '聽日辭職',
    'app.subtitle': '編程人生模擬 · 離線 ARG',
    'dock.vscode': 'Vizual Studio Code',
    'dock.intranet': '內網',
    'dock.jira': 'Jiua',
    'dock.whatsapp': 'WhatUp',
    'dock.search': 'Search',
    'dock.notebook': '筆記本',
    'dock.settings': '設定',
    'settings.theme': '主題',
    'settings.language': '語言',
    'settings.export': '匯出存檔',
    'settings.import': '匯入存檔',
    'settings.reset': '重置進度',
    'toast.saved': '已儲存',
    'toast.evidence': '發現新證據',
    'toast.unlocked': '解鎖新介面'
  },
  'en': {
    'app.title': '聽日辭職',
    'app.subtitle': 'Dev Life Sim · Offline ARG',
    'dock.vscode': 'Vizual Studio Code',
    'dock.intranet': 'Intranet',
    'dock.jira': 'Jiua',
    'dock.whatsapp': 'WhatUp',
    'dock.search': 'Search',
    'dock.notebook': 'Notebook',
    'dock.settings': 'Settings',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.export': 'Export Save',
    'settings.import': 'Import Save',
    'settings.reset': 'Reset Progress',
    'toast.saved': 'Saved',
    'toast.evidence': 'New evidence',
    'toast.unlocked': 'Interface unlocked'
  }
};

export function t(key) {
  const lang = state.get('settings.language') || 'zh-TW';
  return dict[lang]?.[key] ?? dict['zh-TW'][key] ?? key;
}

export function setLanguage(lang) {
  state.set('settings.language', lang);
}

export function getLanguages() {
  return Object.keys(dict);
}
