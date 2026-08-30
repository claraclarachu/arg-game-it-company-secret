import { state } from './state.js';
import { events } from './events.js';

const fileRegistry = new Map();

function registerFile(path, entry) {
  fileRegistry.set(path, entry);
}

function getFile(path) {
  return fileRegistry.get(path) || null;
}

function listFiles(prefix = '/') {
  const out = [];
  for (const [p, entry] of fileRegistry.entries()) {
    if (p.startsWith(prefix)) out.push({ path: p, ...entry });
  }
  return out.sort((a, b) => a.path.localeCompare(b.path));
}

function buildTree() {
  const root = { name: '/', path: '/', children: [], type: 'dir' };
  const nodes = new Map();
  nodes.set('/', root);
  for (const [p] of fileRegistry.entries()) {
    const parts = p.split('/').filter(Boolean);
    let curPath = '';
    let parent = root;
    for (let i = 0; i < parts.length; i++) {
      curPath += '/' + parts[i];
      const isFile = i === parts.length - 1;
      if (!nodes.has(curPath)) {
        const node = {
          name: parts[i],
          path: curPath,
          type: isFile ? 'file' : 'dir',
          children: isFile ? undefined : []
        };
        if (isFile) {
          const entry = fileRegistry.get(p);
          node.ext = p.split('.').pop();
          node.meta = entry.meta || {};
        }
        nodes.set(curPath, node);
        // guard: parent may be a file that was previously created (e.g. /internal/portal + /internal/portal/export)
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      } else {
        // existing node is a file but we need to traverse deeper (file + child conflict)
        const existing = nodes.get(curPath);
        if (!isFile && existing.type === 'file') {
          existing.type = 'dir';
          existing.children = existing.children || [];
        }
        // if existing is file and this is also file (duplicate) skip
      }
      parent = nodes.get(curPath);
    }
  }
  // sort dirs first
  function sortNode(n) {
    if (n.children) {
      n.children.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      n.children.forEach(sortNode);
    }
  }
  sortNode(root);
  return root;
}

function readFile(path) {
  const entry = getFile(path);
  if (!entry) return null;
  if (entry.hidden && !state.hasFlag(`discovered:${path}`)) {
    // hidden until flag
    return null;
  }
  state.discoverFile(path);
  // auto flags for Phase 6 progression
  if (path === '/workspace/src/payment/mixer.js') state.setFlag('found_crypto_mixer', true);
  if (path === '/workspace/src/payment/gateway.js') state.setFlag('found_fee_mapping', true);
  if (path === '/workspace/src/payment/cryptoConfig.json') state.setFlag('found_mixer_config', true);
  if (path === '/workspace/ledger.db') state.setFlag('ledger_exported', true);
  if (path === '/workspace/docs/arch.pdf') state.setFlag('sql_injected', true);
  if (path === '/workspace/data/ledger_export.csv') state.setFlag('found_coordinates', true);
  if (path === '/workspace/src/main/resources/application.properties') state.setFlag('found_ssh_trace', true);
  if (path === '/workspace/src/main/java/com/acme/OrderService.java') state.setFlag('found_fee_mapping', true);
  events.emit('vfs:read', path);
  return entry.content;
}

function exists(path) {
  return fileRegistry.has(path);
}

function searchContent(query) {
  const q = query.toLowerCase();
  const results = [];
  for (const [p, entry] of fileRegistry.entries()) {
    if (typeof entry.content === 'string' && entry.content.toLowerCase().includes(q)) {
      results.push({ path: p, snippet: snippet(entry.content, q) });
    }
  }
  return results;
}

function snippet(content, q) {
  const idx = content.toLowerCase().indexOf(q);
  const start = Math.max(0, idx - 40);
  const end = Math.min(content.length, idx + q.length + 40);
  return content.slice(start, end).replace(/\n/g, ' ');
}

// ---- Hidden route / portal access helpers ----
function canAccessPortal() {
  return state.hasFlag('hidden_portal_accessed');
}

function tryAccessPortal(trigger) {
  // trigger: { amount, path, headers }
  const service = getFile('/workspace/src/billing/service.js');
  if (!service) return false;
  // minimal validation: amount === 420.69
  if (trigger && trigger.amount === 420.69) {
    state.setFlag('hidden_portal_accessed', true);
    state.setFlag('portal_auth_bypassed', false);
    events.emit('portal:discovered');
    return true;
  }
  return false;
}

function bypassPortalAuth(headers) {
  // headers must contain X-Internal-Token: cocoa-beans-2024
  const token = headers?.['X-Internal-Token'] || headers?.['x-internal-token'];
  if (token === 'cocoa-beans-2024') {
    // Require hidden portal to be accessed first (Chapter 1 progression)
    if (!state.hasFlag('hidden_portal_accessed')) {
      state.setFlag('hidden_portal_accessed', true);
      events.emit('portal:discovered');
    }
    state.setFlag('portal_auth_bypassed', true);
    events.emit('portal:bypassed');
    return true;
  }
  return false;
}

// Seed files (Chapter 0-2). Content intentionally concise for MVP.
function seedFiles() {
  // VS Code workspace files
  registerFile('/workspace/package.json', {
    content: JSON.stringify({ name: 'acme-billing', version: '3.2.1', scripts: { dev: 'vite', test: 'jest' } }, null, 2),
    meta: { lang: 'json' }
  });
  registerFile('/workspace/src/billing/service.js', {
    content: `// billing/service.js - 計費模組
import { ledger } from './ledger.js';
import { cryptoMixer } from '@shady/crypto-mixer'; // legacy payment helper

/**
 * 計算訂單金額
 * BUG-420: 特定金額 rounding 錯誤待修復  INV-2024-0042
 */
export function calculateAmount(items, opts = {}) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const fee = computeFee(subtotal, opts); // <-- 手續費邏輯藏著分潤
  const total = subtotal + fee;
  // TODO: edge case - investigate why QA reports 420.69 redirects?
  if (total === 420.69) {
    // 隱藏的業務邏輯：內部審核入口 (僅內部網路可用)
    return redirectTo('/internal/portal');
  }
  return total;
}

function computeFee(amount, opts) {
  // feeRate 表面是 0.03，實際根據 vendorId 動態調整
  const feeRate = getFeeRate(opts.vendorId);
  return Math.round(amount * feeRate * 100) / 100;
}

function getFeeRate(vendorId) {
  // Legacy mapping - 勿動！聯繫 finance@internal
  const table = { default: 0.03, cocoa: 0.15, bean: 0.22, leaf: 0.12, crystal: 0.30 };
  return table[vendorId] || table.default;
}

function redirectTo(path) {
  // SSR helper - 在瀏覽器會觸發 location 變化
  return { __redirect: path };
}
`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/billing/ledger.js', {
    content: `// ledger.js - 僅內部可見
export const ledger = {
  exportDb: () => '/internal/portal/export?format=sqlite',
  // 驗證標頭: X-Internal-Token: cocoa-beans-2024
};
`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/.env.example', {
    content: `DATABASE_URL=postgres://dev:dev@localhost/acme
INTERNAL_PORTAL_TOKEN=cocoa-beans-2024
# 請勿提交真實 token！
`,
    meta: { lang: 'properties' }
  });
  registerFile('/workspace/src/middleware/auth.js', {
    content: `// middleware/auth.js
export function portalAuth(req) {
  const token = req.headers['X-Internal-Token'];
  if (token !== process.env.INTERNAL_PORTAL_TOKEN) {
    return { status: 403, body: 'Forbidden' };
  }
  // Referrer 必須來自計費頁
  if (!req.headers.referer?.includes('/billing')) {
    return { status: 403, body: 'Bad referer' };
  }
  return { status: 200 };
}
`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/README.md', {
    content: `# Acme Billing Service\n\n> 原材料採購系統: /internal/portal (內部專用)\n\n## 開發\n\nnpm install\nnpm run dev\n`,
    meta: { lang: 'markdown' }
  });

  // Python & Java samples for flavor
  registerFile('/workspace/scripts/reconcile.py', {
    content: `# reconcile.py - 對帳腳本 (Python)
import sqlite3

def reconcile(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT code, SUM(amount) FROM orders GROUP BY code")
    for code, total in cur.fetchall():
        print(f"{code}: {total}")

if __name__ == '__main__':
    reconcile('ledger.db')
`,
    meta: { lang: 'python' }
  });
  registerFile('/workspace/src/main/java/com/acme/OrderService.java', {
    content: `package com.acme;
public class OrderService {
    // Java: 訂單分潤邏輯與 JS 保持一致
    public double feeRate(String vendorId) {
        return switch(vendorId) {
            case "cocoa" -> 0.15;
            case "bean" -> 0.22;
            case "leaf" -> 0.12;
            case "crystal" -> 0.30;
            default -> 0.03;
        };
    }
}
`,
    meta: { lang: 'java' }
  });

  // Phase 3-4: Payment / Ledger files
  registerFile('/workspace/src/payment/cryptoConfig.json', {
    content: JSON.stringify({ mixer: "@shady/crypto-mixer@1.2.3", wallets: ["bc1qxy2kgdy8lzd9t9e", "0x8fA1...c3e4", "1A2b...9z"], autoMix: true, feeSplit: { cocoa: 0.15, bean: 0.22 } }, null, 2),
    meta: { lang: 'json' }
  });
  registerFile('/workspace/src/payment/mixer.js', {
    content: `// mixer.js - 洗錢混淆器\nimport { cryptoMixer } from '@shady/crypto-mixer';\nexport const mixerConfig = {\n  wallets: ["bc1qxy2kgdy8lzd9t9e","0x8fA1...c3e4"],\n  route: "tor://mixer.internal",\n  // feeRate 即分潤，見 gateway.js\n};\nexport function mix(amount, vendorId) {\n  return cryptoMixer.shuffle(amount, mixerConfig.wallets);\n}\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/payment/gateway.js', {
    content: `// gateway.js - Payment Gateway Integration v3\n// 注意: feeRate 實際為分潤比例，非手續費\nimport { getFeeRate } from '../billing/service.js';\nexport function settle(order) {\n  const rate = getFeeRate(order.vendorId); // cocoa 0.15 etc\n  const payout = order.amount * (1 - rate);\n  // 轉帳至混幣錢包\n  return { payout, route: "internal/portal" };\n}\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/ledger.db', {
    content: `-- ledger.db SQLite dump (假資料)\nCREATE TABLE orders (code TEXT, amount REAL, lat REAL, lon REAL, tracking TEXT);\nINSERT INTO orders VALUES ('COCOA', 420, 25.033, 121.565, '118-bean');\nINSERT INTO orders VALUES ('BEAN', 118, 22.627, 120.301, '119-leaf');\nINSERT INTO orders VALUES ('LEAF', 300, 24.147, 120.673, '120-crystal');\n-- Hint: SELECT code, SUM(amount) FROM orders GROUP BY code;\n-- 輸入 ledger_exported 觸發需執行 cat ledger.db | grep SELECT\n`,
    meta: { lang: 'sql' }
  });
  registerFile('/workspace/docs/arch.pdf', {
    content: `%PDF-1.4 fake\nArchitecture Diagram — 實為物流路線圖\n台灣 (25.0,121.5) -> 東南亞 (14.5,100.9) -> 北美 (37.7,-122.4)\n節點: COCOA / BEAN / LEAF / CRYSTAL\n`,
    meta: { lang: 'pdf' }
  });
  registerFile('/workspace/data/ledger_export.csv', {
    content: `code,amount,lat,lon,tracking\nCOCOA,420,25.033,121.565,118-bean\nBEAN,118,22.627,120.301,119-leaf\nCRYSTAL,75,35.68,139.69,121-crystal\n`,
    meta: { lang: 'csv' }
  });
  registerFile('/workspace/scripts/decrypt.py', {
    content: `# decrypt.py - 解密對帳檔\nimport base64\nprint(base64.b64decode("Q09DT0EgNDIw").decode()) # COCOA 420\n# 使用: python3 decrypt.py\n`,
    meta: { lang: 'python' }
  });
  registerFile('/workspace/src/main/resources/application.properties', {
    content: `server.port=8080\nspring.datasource.url=jdbc:sqlite:ledger.db\n# ssh: ssh ops@203.0.113.45 -p 2222\n`,
    meta: { lang: 'properties' }
  });

  // Hidden portal page (virtual route, not file but registered for search)
  registerFile('/internal/portal', {
    hidden: false,
    content: `## INTERNAL PORTAL - 原材料採購系統\n\n狀態：需 X-Internal-Token\n\n庫存:\n- COCOA: 420 units\n- BEAN: 118 units\n- LEAF: 300 units\n- CRYSTAL: 75 units\n\n匯出: /internal/portal/export\n\n備註： cocoa bean shipment delay - 供應商延遲 (實際指 COCOA 到貨延遲)`,
    meta: { portal: true }
  });
  registerFile('/internal/portal/export', {
    hidden: false,
    content: `SQLite export endpoint - 需要 portalAuth 通過`,
    meta: { portal: true }
  });
}

seedFiles();

export const vfs = {
  registerFile,
  getFile,
  listFiles,
  buildTree,
  readFile,
  exists,
  searchContent,
  canAccessPortal,
  tryAccessPortal,
  bypassPortalAuth
};
export default vfs;
