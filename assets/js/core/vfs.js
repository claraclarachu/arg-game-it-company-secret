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
