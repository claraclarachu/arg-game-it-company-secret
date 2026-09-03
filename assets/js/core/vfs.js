import { state } from './state.js';
import { events } from './events.js';

const fileRegistry = new Map();
const darkFileRegistry = new Map();
function registerDarkFile(path, entry) { darkFileRegistry.set(path, entry); }
function getDarkFile(path) { return darkFileRegistry.get(path) || null; }
function listDarkFiles(prefix = '/') { const out = []; for (const [p, entry] of darkFileRegistry.entries()) { if (p.startsWith(prefix)) out.push({ path: p, ...entry }); } return out.sort((a,b)=>a.path.localeCompare(b.path)); }
function buildDarkTree() {
  const root = { name: '/', path: '/', children: [], type: 'dir' };
  const nodes = new Map(); nodes.set('/', root);
  for (const [p] of darkFileRegistry.entries()) {
    const parts = p.split('/').filter(Boolean);
    let curPath = ''; let parent = root;
    for (let i=0;i<parts.length;i++) { curPath += '/' + parts[i]; const isFile = i===parts.length-1;
      if (!nodes.has(curPath)) { const node={name:parts[i], path:curPath, type:isFile?'file':'dir', children:isFile?undefined:[]}; if(isFile){const e=darkFileRegistry.get(p); node.ext=p.split('.').pop(); node.meta=e.meta||{};} nodes.set(curPath,node); if(!parent.children) parent.children=[]; parent.children.push(node);} else { const ex=nodes.get(curPath); if(!isFile && ex.type==='file'){ex.type='dir'; ex.children=ex.children||[];} } parent=nodes.get(curPath);
    }
  }
  function sortNode(n){ if(n.children){ n.children.sort((a,b)=>{ if(a.type!==b.type) return a.type==='dir'?-1:1; return a.name.localeCompare(b.name);}); n.children.forEach(sortNode); } }
  sortNode(root); return root;
}
function readDarkFile(path){ const e=getDarkFile(path); if(!e) return null; return e.content; }

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
  // 2024 已移除 420.69 判定，現僅保留 hash 驗證（由暗網進入點使用）
  // trigger: { hash, path, headers }
  if (trigger && trigger.hash === 'f665a7117959b667b7f283eaebf69cae') {
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

// Seed files — Nori 飲品供應公司 (Nori Drinks Supply) 真實營運系統模擬
// 保留 calculateVipPrice 供 INV-2024-0042 單元測試；其餘已重塑為飲品業務
function seedFiles() {
  // ── 根與說明 ──
  registerFile('/workspace/package.json', {
    content: JSON.stringify({ name: 'nori-drinks-supply', version: '3.5.0', private: true, description: 'Nori 飲品供應 — 招牌冰釀茶酒 / 原物料管理 / 訂單銷售 / 內部系統', scripts: { dev: 'vite', build: 'vite build', test: 'jest', 'db:migrate': 'node scripts/migrate.js' }, dependencies: { vite: '^5.0.0', vue: '^3.4.0' } }, null, 2),
    meta: { lang: 'json' }
  });
  registerFile('/workspace/README.md', {
    content: "# Nori 飲品供應 (Nori Drinks Supply)\n\n> 創辦人 Sawyer · 2019 年創立 · 專注招牌冰釀茶酒 / 葡萄釀造 / 飲品研發\n\n> 內部審核入口: /internal/portal (需 X-Internal-Token) · 原 Acme 計費模組保留作 VIP 價格稽核\n\n## 事業體系\n- 前台官網：飲品一覽、VIP 價格試算、關於 Nori、線上訂購\n- 實驗室研發：營運團隊飲品實驗室（葡萄釀酒、茶葉調配）\n- 原物料管理：茶葉、葡萄等原料庫存與採購\n- 訂單銷售：業務對企業／組織銷售\n- 物流配送：配送團隊直送客戶\n- 內部系統：IT 團隊維運官網與內部管理系統（VIP 價格計算）\n- 支付閘道：gateway.js 統一清算\n\n## 開發\n\n```bash\nnpm install\nnpm run dev   # http://localhost:3000\n```\n環境變數見 `.env.example`\n",
    meta: { lang: 'markdown' }
  });
  registerFile('/workspace/.env.example', {
    content: `DATABASE_URL=postgres://nori:nori@localhost:5432/nori_drinks\nINTERNAL_PORTAL_TOKEN=cocoa-beans-2024\nABPAY_API_KEY=abpay_test_sk_...\nLALAPAY_MERCHANT_ID=lala_nori_2019\nBANK_ACCOUNT_ESUN=808-123456789012\n# 對應 Acme 時期內部稽核 token，請勿外洩\n`,
    meta: { lang: 'properties' }
  });
  registerFile('/workspace/.env.nori', {
    content: `VITE_API_BASE=/api\nVITE_COMPANY_NAME=Nori\nVITE_FOUNDER=Sawyer\nVITE_FOUND_YEAR=2019\n`,
    meta: { lang: 'properties' }
  });
  registerFile('/workspace/docker-compose.yml', {
    content: `version: '3.8'\nservices:\n  api:\n    build: ./src/main/java\n    ports: ["8080:8080"]\n    environment:\n      - DATABASE_URL=postgres://nori:nori@db:5432/nori\n  db:\n    image: postgres:15\n    volumes: ["./data:/var/lib/postgresql/data"]\n  web:\n    build: ./src/frontend\n    ports: ["3000:3000"]\n`,
    meta: { lang: 'yaml' }
  });

  // ── 保留：計費 / 隱藏路由 (ARG 核心) ──
  registerFile('/workspace/src/billing/service.js', {
    content: `// billing/service.js - 飲品訂單金額稽核模組 (由 Acme 沿用，現對應 VIP 飲品價格)\nimport { ledger } from './ledger.js';\nimport { cryptoMixer } from '@shady/crypto-mixer'; // 保留：對應 ABPay/LalaPay 混帳路由測試\n\n/**\n * 計算飲品訂單總額 (方案費 + 手續費)\n * BUG-420: 特定金額 rounding 錯誤待修復  INV-2024-0042\n * Nori 備註：此函式同時供前台 VIP 試算與後台對帳使用\n */\nexport function calculateAmount(items, opts = {}) {\n  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);\n  const fee = computeFee(subtotal, opts); // 手續費 = 方案分潤 (見 getFeeRate)\n  const total = subtotal + fee;\n  // 隱藏審核入口：QA 回報 420.69 會導向內部 portal (稽核用)\n  if (total === 420.69) {\n    return redirectTo('/internal/portal');\n  }\n  return total;\n}\n\nfunction computeFee(amount, opts) {\n  const feeRate = getFeeRate(opts.vendorId);\n  return Math.round(amount * feeRate * 100) / 100;\n}\n\nfunction getFeeRate(vendorId) {\n  // Nori 對應：飲品系列的隱含服務費率（冰釀茶酒等）\n  // 勿動！聯繫 finance@internal / Sawyer\n  const table = { default: 0.03, cocoa: 0.15, bean: 0.22, leaf: 0.12, crystal: 0.30, planA: 0.08, planB: 0.12, planC: 0.18 };\n  return table[vendorId] || table.default;\n}\n\nfunction redirectTo(path) {\n  return { __redirect: path };\n}\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/billing/ledger.js', {
    content: `// ledger.js - 僅內部可見 (Nori 財務稽核 - 飲品對帳)\nexport const ledger = {\n  exportDb: () => '/internal/portal/export?format=sqlite',\n  // 驗證標頭: X-Internal-Token: cocoa-beans-2024\n};\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/middleware/auth.js', {
    content: `// middleware/auth.js\nexport function portalAuth(req) {\n  const token = req.headers['X-Internal-Token'];\n  if (token !== process.env.INTERNAL_PORTAL_TOKEN) {\n    return { status: 403, body: 'Forbidden' };\n  }\n  if (!req.headers.referer?.includes('/billing')) {\n    return { status: 403, body: 'Bad referer' };\n  }\n  return { status: 200 };\n}\n`,
    meta: { lang: 'javascript' }
  });

  // ── 保留：OrderService + VIP 折扣 (不可刪除) ──
  registerFile('/workspace/src/main/java/com/acme/OrderService.java', {
    content: `package com.acme;\npublic class OrderService {\n    // Java: 訂單分潤邏輯與 JS 保持一致 (Nori 飲品費率對應)\n    public double feeRate(String vendorId) {\n        return switch(vendorId) {\n            case "cocoa" -> 0.15;\n            case "bean" -> 0.22;\n            case "leaf" -> 0.12;\n            case "crystal" -> 0.30;\n            case "planA" -> 0.08;\n            case "planB" -> 0.12;\n            case "planC" -> 0.18;\n            default -> 0.03;\n        };\n    }\n\n    /**\n     * VIP 折扣計算 — 目前有 Bug (INV-2024-0042)\n     * 需求: VIP1 90%, VIP2 85%, VIP3 80%, VIP4 75%, VIP5 70%\n     * Nori 會員：VIP 對應客戶等級，忠實客戶折扣\n     */\n    public double calculateVipPrice(double price, int vipLv) {\n        switch(vipLv){\n            case 1: price*=0.95;break;\n            case 2: price*=0.90;break;\n            case 3: price*=0.85;break;\n            case 4: price*=0.80;break;\n            case 5: price*=0.75;break;\n            default:break;\n        }\n        return price;\n    }\n}\n`,
    meta: { lang: 'java' }
  });

  // ── Nori 後端 — Spring Boot 主程式 ──
  registerFile('/workspace/src/main/java/com/nori/NoriApplication.java', {
    content: `package com.nori;\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n\n/**\n * Nori 飲品供應 — 啟動類\n * 創辦人 Sawyer 2019 創立\n */\n@SpringBootApplication\npublic class NoriApplication {\n    public static void main(String[] args) {\n        SpringApplication.run(NoriApplication.class, args);\n    }\n}\n`,
    meta: { lang: 'java' }
  });
  registerFile('/workspace/src/main/java/com/nori/config/SecurityConfig.java', {
    content: `package com.nori.config;\n\nimport org.springframework.context.annotation.Configuration;\nimport org.springframework.security.config.annotation.web.builders.HttpSecurity;\n\n@Configuration\npublic class SecurityConfig {\n    protected void configure(HttpSecurity http) throws Exception {\n        http.authorizeRequests()\n            .antMatchers("/api/drinks/**", "/api/products/**", "/api/about", "/api/price/calc").permitAll()\n            .antMatchers("/api/admin/**").hasRole("STAFF")\n            .and().csrf().disable();\n    }\n}\n`,
    meta: { lang: 'java' }
  });

  // ── Drink Product — 飲品產品 ──
  registerFile('/workspace/src/main/java/com/nori/model/MigrationPlan.java', {
    content: `package com.nori.model;\n\n/** 飲品產品 */\npublic class MigrationPlan {\n    public enum PlanType { PLAN_A, PLAN_B, PLAN_C }\n    private String id;\n    private PlanType type;\n    private String name;\n    private String country; // e.g. 加拿大 / 葡萄牙 / 日本\n    private int durationMonths;\n    private double basePrice; // 未含服務費\n    private String[] benefits;\n    private String[] requirements;\n    // getters/setters ...\n}\n`,
    meta: { lang: 'java' }
  });
  registerFile('/workspace/src/main/java/com/nori/service/MigrationPlanService.java', {
    content: `package com.nori.service;\n\nimport com.nori.model.MigrationPlan;\nimport org.springframework.stereotype.Service;\nimport java.util.*;\n\n@Service\npublic class MigrationPlanService {\n    private final Map<String, MigrationPlan> store = new LinkedHashMap<>();\n    public MigrationPlanService() {\n        // 招牌：冰釀茶酒（最暢銷，葡萄＋茶葉）\n        // 葡萄釀造酒：實驗室葡萄釀酒\n        // 水果茶系列：季節水果調配\n        seed();\n    }\n    public List<MigrationPlan> listAll() { return new ArrayList<>(store.values()); }\n    public MigrationPlan get(String id) { return store.get(id); }\n    private void seed() {\n        // 由 data/drinks.json 載入，見 resources/data/drinks.json\n    }\n}\n`,
    meta: { lang: 'java' }
  });
  registerFile('/workspace/src/main/java/com/nori/controller/MigrationPlanController.java', {
    content: `package com.nori.controller;\n\nimport com.nori.model.MigrationPlan;\nimport com.nori.service.MigrationPlanService;\nimport org.springframework.web.bind.annotation.*;\nimport java.util.List;\n\n@RestController\n@RequestMapping("/api/drinks")\npublic class MigrationPlanController {\n    private final MigrationPlanService service;\n    public MigrationPlanController(MigrationPlanService s){ this.service=s; }\n    @GetMapping\n    public List<MigrationPlan> list(){ return service.listAll(); }\n    @GetMapping("/{id}")\n    public MigrationPlan detail(@PathVariable String id){ return service.get(id); }\n}\n`,
    meta: { lang: 'java' }
  });
  registerFile('/workspace/src/main/resources/data/plans.json', {
    content: JSON.stringify({ drinks: [{ id: 'drink-001', type: 'ICE_TEA_ALCOHOLIC', name: '招牌冰釀茶酒', origin: '台灣高山茶＋葡萄', shelfDays: 180, basePrice: 320, currency: 'TWD', ingredients: ['高山茶葉', '葡萄', '冰糖'], features: ['招牌最暢銷', '冰鎮風味'] }, { id: 'drink-002', type: 'GRAPE_WINE', name: '葡萄釀造酒（實驗室）', origin: '自釀葡萄', shelfDays: 365, basePrice: 850, currency: 'TWD', ingredients: ['葡萄', '酵母'], features: ['實驗室研發', '果香飽滿'] }, { id: 'drink-003', type: 'FRUIT_TEA', name: '季節水果茶', origin: '當季水果', shelfDays: 90, basePrice: 280, currency: 'TWD', ingredients: ['水果', '茶葉'], features: ['清爽', '季節限定'] }] }, null, 2),
    meta: { lang: 'json' }
  });

  // ── 價格試算 ──
  registerFile('/workspace/src/main/java/com/nori/service/PriceCalculatorService.java', {
    content: `package com.nori.service;\n\nimport com.acme.OrderService; // 保留 VIP 折扣邏輯\nimport com.nori.model.MigrationPlan;\nimport org.springframework.stereotype.Service;\n\n/**\n * 飲品費用試算：商品費 + 服務費 + VIP 客戶折扣（IT 網頁計算）\n */\n@Service\npublic class PriceCalculatorService {\n    private final OrderService vip = new OrderService();\n    public double calculate(MigrationPlan plan, int vipLevel, int familySize) {\n        double base = plan.getBasePrice();\n        double fee = base * feeRate(plan.getType().name());\n        double subtotal = (base + fee) * familySize;\n        return vip.calculateVipPrice(subtotal, vipLevel); // 沿用 Acme 折扣 (待修 Bug)\n    }\n    private double feeRate(String type){\n        return switch(type){\n            case "PLAN_A" -> 0.08;\n            case "PLAN_B" -> 0.12;\n            case "PLAN_C" -> 0.18;\n            default -> 0.05;\n        };\n    }\n}\n`,
    meta: { lang: 'java' }
  });
  registerFile('/workspace/src/main/java/com/nori/controller/PriceCalculatorController.java', {
    content: `package com.nori.controller;\n\nimport com.nori.service.PriceCalculatorService;\nimport org.springframework.web.bind.annotation.*;\n\n@RestController\n@RequestMapping("/api/price")\npublic class PriceCalculatorController {\n    private final PriceCalculatorService calc;\n    public PriceCalculatorController(PriceCalculatorService c){ this.calc=c; }\n    @PostMapping("/calc")\n    public java.util.Map<String,Object> calc(@RequestBody java.util.Map<String,Object> body){\n        // body: { planId, vipLevel, familySize }\n        return java.util.Map.of("total", 0); // 由前端試算，後端複核\n    }\n    @GetMapping("/vip-table")\n    public java.util.Map<Integer,String> vipTable(){\n        return java.util.Map.of(1,"90%",2,"85%",3,"80%",4,"75%",5,"70%");\n    }\n}\n`,
    meta: { lang: 'java' }
  });
  registerFile('/workspace/src/main/java/com/nori/utils/FeeCalculator.java', {
    content: `package com.nori.utils;\n\n/** 前台共用：與 billing/service.js 一致（飲品 VIP 計算） */\npublic class FeeCalculator {\n    public static double total(double base, String planType, int familySize){\n        double rate = switch(planType){\n            case "planA" -> 0.08; case "planB" -> 0.12; case "planC" -> 0.18; default -> 0.05;\n        };\n        return Math.round((base * (1+rate) * familySize)*100)/100.0;\n    }\n}\n`,
    meta: { lang: 'java' }
  });

  // ── 關於 Nori / 創辦人 ──
  registerFile('/workspace/src/main/java/com/nori/controller/AboutController.java', {
    content: `package com.nori.controller;\n\nimport org.springframework.web.bind.annotation.GetMapping;\nimport org.springframework.web.bind.annotation.RestController;\nimport java.util.Map;\n\n@RestController\npublic class AboutController {\n    @GetMapping("/api/about")\n    public Map<String,Object> about(){\n        return Map.of(\n            "company","Nori 飲品供應",\n            "founder","Sawyer",\n            "founded",2019,\n            "hq","鴨嘴道135號中央大樓3507室",\n            "mission","用一杯冰釀茶酒，連結人與風味",\n            "team", 50,\n            "products", 12\n        );\n    }\n}\n`,
    meta: { lang: 'java' }
  });
  registerFile('/workspace/src/main/resources/templates/about.html', {
    content: `<!doctype html>\n<html lang="zh-TW">\n<head><meta charset="utf-8"><title>關於 Nori — Sawyer 2019</title></head>\n<body>\n<h1>關於 Nori</h1>\n<p>創辦人 <strong>Sawyer</strong> 於 2019 年創立 Nori，從實驗室葡萄釀酒起家，現以招牌冰釀茶酒聞名。</p>\n<section>\n<h2>里程碑</h2>\n<ul>\n<li>2019 — 實驗室成立，首釀葡萄釀造酒</li>\n<li>2021 — 招牌冰釀茶酒上市，成為最暢銷商品</li>\n<li>2023 — 擴展至 12 款飲品，團隊達 50 人，服務多家企業客戶</li>\n</ul>\n</section>\n<p>地址：鴨嘴道135號中央大樓3507室 · 統編 12345678</p>\n</body></html>\n`,
    meta: { lang: 'html' }
  });

  // ── 訂單 / 客戶 ──
  registerFile('/workspace/src/main/java/com/nori/model/Customer.java', {
    content: `package com.nori.model;\n\npublic class Customer {\n    private String id; // CUS-xxxx\n    private String name;\n    private String passport;\n    private String phone;\n    private String email;\n    private int vipLevel; // 1-5 對應 OrderService.calculateVipPrice\n    private String planId; // plan-a/b/c\n}\n`,
    meta: { lang: 'java' }
  });
  registerFile('/workspace/src/main/java/com/nori/model/Order.java', {
    content: `package com.nori.model;\n\nimport java.time.LocalDate;\npublic class Order {\n    private String id; // ORD-2024-xxxx\n    private String customerId;\n    private String planId; // planA/B/C\n    private double basePrice;\n    private double totalPrice; // 含服務費與 VIP 折扣\n    private Payment.PaymentMethod paymentMethod; // BANK_TRANSFER / ABPAY / LALAPAY\n    private String status; // PENDING / PAID / APPROVED / COMPLETED\n    private LocalDate createdAt;\n    private String assignedConsultant; // Sawyer, Maggie...\n}\n`,
    meta: { lang: 'java' }
  });
  registerFile('/workspace/src/main/java/com/nori/model/Payment.java', {
    content: `package com.nori.model;\n\nimport java.time.LocalDateTime;\npublic class Payment {\n    public enum PaymentMethod { BANK_TRANSFER, ABPAY, LALAPAY }\n    private String orderId;\n    private PaymentMethod method;\n    private double amount;\n    private String txId;\n    private String status; // INIT / SUCCESS / FAILED\n    private LocalDateTime paidAt;\n    private String receiptUrl;\n}\n`,
    meta: { lang: 'java' }
  });
  registerFile('/workspace/src/main/java/com/nori/model/enums/PaymentMethod.java', {
    content: `package com.nori.model.enums;\n\npublic enum PaymentMethod {\n    BANK_TRANSFER("銀行匯款","ESUN 808"),\n    ABPAY("ABPay 電子支付","ABPay"),\n    LALAPAY("LalaPay","LalaPay");\n    private final String label; private final String channel;\n    PaymentMethod(String l,String c){ this.label=l; this.channel=c; }\n}\n`,
    meta: { lang: 'java' }
  });
  registerFile('/workspace/src/main/java/com/nori/repository/OrderRepository.java', {
    content: `package com.nori.repository;\n\nimport com.nori.model.Order;\nimport org.springframework.data.jpa.repository.JpaRepository;\nimport java.util.List;\npublic interface OrderRepository extends JpaRepository<Order,String> {\n    List<Order> findByCustomerId(String cid);\n    List<Order> findByPlanId(String planId);\n    List<Order> findByStatus(String status);\n    List<Order> findByPaymentMethod(String method);\n}\n`,
    meta: { lang: 'java' }
  });
  registerFile('/workspace/src/main/java/com/nori/repository/PaymentRepository.java', {
    content: `package com.nori.repository;\n\nimport com.nori.model.Payment;\nimport org.springframework.data.jpa.repository.JpaRepository;\npublic interface PaymentRepository extends JpaRepository<Payment,String> {}\n`,
    meta: { lang: 'java' }
  });
  registerFile('/workspace/src/main/java/com/nori/service/NoriOrderService.java', {
    content: `package com.nori.service;\n\nimport com.nori.model.Order;\nimport com.nori.repository.OrderRepository;\nimport org.springframework.stereotype.Service;\nimport java.util.List;\n\n@Service\npublic class NoriOrderService {\n    private final OrderRepository repo;\n    public NoriOrderService(OrderRepository r){ this.repo=r; }\n    public List<Order> query(String status, String planId, String paymentMethod){\n        if(status!=null) return repo.findByStatus(status);\n        if(planId!=null) return repo.findByPlanId(planId);\n        return repo.findAll();\n    }\n    public Order get(String id){ return repo.findById(id).orElse(null); }\n}\n`,
    meta: { lang: 'java' }
  });
  registerFile('/workspace/src/main/java/com/nori/controller/OrderController.java', {
    content: `package com.nori.controller;\n\nimport com.nori.model.Order;\nimport com.nori.service.NoriOrderService;\nimport org.springframework.web.bind.annotation.*;\nimport java.util.List;\n\n@RestController\n@RequestMapping("/api/admin/orders")\npublic class OrderController {\n    private final NoriOrderService svc;\n    public OrderController(NoriOrderService s){ this.svc=s; }\n    @GetMapping\n    public List<Order> list(@RequestParam(required=false) String status,\n                            @RequestParam(required=false) String planId,\n                            @RequestParam(required=false) String paymentMethod){\n        return svc.query(status, planId, paymentMethod);\n    }\n    @GetMapping("/{id}")\n    public Order detail(@PathVariable String id){ return svc.get(id); }\n}\n`,
    meta: { lang: 'java' }
  });

  // ── 支付 — Bank / ABPay / LalaPay ──
  registerFile('/workspace/src/main/java/com/nori/service/PaymentService.java', {
    content: `package com.nori.service;\n\nimport com.nori.model.Payment;\nimport org.springframework.stereotype.Service;\n\n@Service\npublic class PaymentService {\n    public Payment settle(String orderId, Payment.PaymentMethod method, double amount){\n        // 依 method 導向不同閘道：bankTransfer / abPay / lalaPay (見 src/payment/*.js)\n        return new Payment(); // 簡化：實際呼叫 gateway.js\n    }\n    public boolean verifyCallback(String txId, String signature){\n        return true; // 驗簽\n    }\n}\n`,
    meta: { lang: 'java' }
  });
  registerFile('/workspace/src/main/java/com/nori/controller/PaymentController.java', {
    content: `package com.nori.controller;\n\nimport com.nori.model.Payment;\nimport com.nori.service.PaymentService;\nimport org.springframework.web.bind.annotation.*;\nimport java.util.Map;\n\n@RestController\n@RequestMapping("/api/pay")\npublic class PaymentController {\n    private final PaymentService pay;\n    public PaymentController(PaymentService p){ this.pay=p; }\n    @PostMapping("/settle")\n    public Payment settle(@RequestBody Map<String,Object> body){\n        String orderId=(String)body.get("orderId");\n        Payment.PaymentMethod m=Payment.PaymentMethod.valueOf((String)body.get("method"));\n        double amount=((Number)body.get("amount")).doubleValue();\n        return pay.settle(orderId,m,amount);\n    }\n    @PostMapping("/callback/{channel}")\n    public Map<String,String> callback(@PathVariable String channel, @RequestBody Map<String,Object> payload){\n        return Map.of("status","ok","channel",channel);\n    }\n}\n`,
    meta: { lang: 'java' }
  });
  registerFile('/workspace/src/payment/paymentConfig.json', {
    content: JSON.stringify({ company: 'Nori', channels: { BANK_TRANSFER: { bank: '玉山銀行', code: '808', account: '1234-5678-9012', holder: 'Nori Immigration Co.' }, ABPAY: { appId: 'abpay_nori_2019', api: 'https://api.abpay.tw/v1/pay', fee: 0.015 }, LALAPAY: { merchantId: 'lala_nori_2019', api: 'https://api.lalapay.com/settle', fee: 0.022 } } }, null, 2),
    meta: { lang: 'json' }
  });
  registerFile('/workspace/src/payment/bankTransfer.js', {
    content: `// bankTransfer.js - 銀行匯款 (玉山)\n/**\n * 產生匯款資訊給客戶，後台人工對帳\n */\nexport function createBankTransfer(order) {\n  return {\n    method: 'BANK_TRANSFER',\n    bank: '玉山銀行 (808)',\n    account: '1234-5678-9012',\n    holder: 'Nori Immigration Co.',\n    amount: order.totalPrice,\n    memo: '匯款備註請填：' + order.id,\n    expireAt: new Date(Date.now()+3*86400000).toISOString()\n  };\n}\nexport function verifyBankReceipt(txId, amount){\n  // 後台上傳水單後核銷\n  return { txId, verified: true };\n}\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/payment/abPay.js', {
    content: `// abPay.js - ABPay 電子支付\nimport config from './paymentConfig.json' with { type: 'json' };\n\nexport async function createABPay(order) {\n  const payload = {\n    appId: config.channels.ABPAY.appId,\n    orderId: order.id,\n    amount: order.totalPrice,\n    currency: 'TWD',\n    returnUrl: '/payment/success?method=abpay'\n  };\n  // 實際呼叫 ABPay API，回傳支付連結\n  return { method: 'ABPAY', payUrl: 'https://pay.abpay.tw/' + order.id, payload };\n}\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/payment/lalaPay.js', {
    content: `// lalaPay.js - LalaPay\nimport config from './paymentConfig.json' with { type: 'json' };\n\nexport async function createLalaPay(order) {\n  return {\n    method: 'LALAPAY',\n    merchantId: config.channels.LALAPAY.merchantId,\n    amount: order.totalPrice,\n    qrcode: 'lala://pay/' + order.id,\n    fee: Math.round(order.totalPrice * config.channels.LALAPAY.fee)\n  };\n}\n`,
    meta: { lang: 'javascript' }
  });
  // 保留舊閘道檔 (ARG 需要) — 重塑為 Nori 支付路由
  registerFile('/workspace/src/payment/cryptoConfig.json', {
    content: JSON.stringify({ mixer: "@shady/crypto-mixer@1.2.3", wallets: ["bc1qxy2kgdy8lzd9t9e", "0x8fA1...c3e4", "1A2b...9z"], autoMix: true, feeSplit: { cocoa: 0.15, bean: 0.22 }, nori: { channels: ["BANK_TRANSFER","ABPAY","LALAPAY"] } }, null, 2),
    meta: { lang: 'json' }
  });
  registerFile('/workspace/src/payment/mixer.js', {
    content: `// mixer.js - 保留：舊洗錢混淆器，現作為 ABPay/LalaPay 路由混帳模擬\nimport { cryptoMixer } from '@shady/crypto-mixer';\nexport const mixerConfig = {\n  wallets: ["bc1qxy2kgdy8lzd9t9e","0x8fA1...c3e4"],\n  route: "tor://mixer.internal",\n  noriChannels: ["ABPAY","LALAPAY"]\n};\nexport function mix(amount, vendorId) {\n  return cryptoMixer.shuffle(amount, mixerConfig.wallets);\n}\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/payment/gateway.js', {
    content: `// gateway.js - Nori 支付閘道統一入口 (Bank / ABPay / LalaPay)\nimport { getFeeRate } from '../billing/service.js';\nimport { createBankTransfer } from './bankTransfer.js';\nimport { createABPay } from './abPay.js';\nimport { createLalaPay } from './lalaPay.js';\n\nexport async function settle(order) {\n  const rate = getFeeRate(order.planId); // planA 0.08 / planB 0.12 / planC 0.18\n  const payout = order.amount * (1 - rate);\n  switch(order.paymentMethod){\n    case 'BANK_TRANSFER': return createBankTransfer({ ...order, totalPrice: order.amount });\n    case 'ABPAY': return createABPay(order);\n    case 'LALAPAY': return createLalaPay(order);\n    default: return { payout, route: "internal/portal" };\n  }\n}\n`,
    meta: { lang: 'javascript' }
  });

  // ── 前台網頁 (Vue / HTML 模擬) ──
  registerFile('/workspace/src/main/resources/templates/index.html', {
    content: `<!doctype html>\n<html lang="zh-TW"><head><meta charset="utf-8"><title>Nori 飲品供應</title></head>\n<body>\n<header><h1>Nori Drinks Supply</h1><nav><a href="/drinks">飲品一覽</a> | <a href="/calculator">費用試算</a> | <a href="/about">關於 Nori</a></nav></header>\n<section><h2>用一杯冰釀茶酒，連結風味與人</h2><p>Sawyer 2019 創立，招牌冰釀茶酒最暢銷，服務多家企業客戶。</p></section>\n</body></html>\n`,
    meta: { lang: 'html' }
  });
  registerFile('/workspace/src/main/resources/templates/plans/plan-a.html', {
    content: `<section><h2>招牌冰釀茶酒（最暢銷）</h2><ul><li>高山茶＋葡萄冰釀</li><li>售價：320 TWD 起（未含 VIP 折扣）</li><li>適合：企業宴會、餐飲通路</li></ul><a href="/calculator?drink=drink-001">VIP 試算</a></section>\n`,
    meta: { lang: 'html' }
  });
  registerFile('/workspace/src/main/resources/templates/plans/plan-b.html', {
    content: `<section><h2>葡萄釀造酒（實驗室研發）</h2><ul><li>實驗室葡萄釀造 12 個月</li><li>售價：850 TWD 起</li><li>適合：高階客戶、禮盒</li></ul></section>\n`,
    meta: { lang: 'html' }
  });
  registerFile('/workspace/src/main/resources/templates/plans/plan-c.html', {
    content: `<section><h2>季節水果茶</h2><ul><li>當季水果調配 7 天</li><li>售價：280 TWD 起</li><li>適合：日常飲用、活動供應</li></ul></section>\n`,
    meta: { lang: 'html' }
  });
  registerFile('/workspace/src/main/resources/templates/fragments/header.html', {
    content: `<header><img src="/logo-nori.svg" alt="Nori"><span>Since 2019 · Founder Sawyer · 招牌冰釀茶酒</span></header>\n`,
    meta: { lang: 'html' }
  });
  registerFile('/workspace/src/main/resources/templates/order-list.html', {
    content: `<table><thead><tr><th>訂單</th><th>客戶</th><th>方案</th><th>支付</th><th>狀態</th></tr></thead><tbody><!-- 由 OrderController 渲染 --></tbody></table>\n`,
    meta: { lang: 'html' }
  });
  registerFile('/workspace/src/frontend/src/pages/Home.jsx', {
    content: `export default function Home(){\n  return (\n    <div>\n      <h1>Nori 飲品供應</h1>\n      <p>創辦人 Sawyer · 2019 創立 · 招牌冰釀茶酒最暢銷</p>\n      <nav><a href="/drinks">飲品一覽</a> | <a href="/about">關於我們</a></nav>\n    </div>\n  );\n}\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/frontend/src/pages/Plans.jsx', {
    content: `import PlanCard from '../components/PlanCard.jsx';\nconst drinks = [\n  {id:'drink-001', name:'冰釀茶酒', note:'招牌'},\n  {id:'drink-002', name:'葡萄釀造酒', note:'實驗室'},\n  {id:'drink-003', name:'水果茶', note:'季節限定'},\n];\nexport default function Plans(){ return <div>{drinks.map(p=> <PlanCard key={p.id} plan={p}/> )}</div>; }\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/frontend/src/pages/PriceCalculator.jsx', {
    content: `import { useState } from 'react';\nimport { calculateAmount } from '../../../billing/service.js';\n\nexport default function PriceCalculator(){\n  const [plan,setPlan]=useState('planA');\n  const [vip,setVip]=useState(1);\n  const [family,setFamily]=useState(2);\n  const total = calculateAmount([{price: 680000, qty: family}], { vendorId: plan });\n  return (\n    <div>\n      <h2>費用試算 (含服務費 + VIP 折扣)</h2>\n      <p>試算結果：{total} TWD</p>\n      <small>VIP 折扣由 OrderService.calculateVipPrice 計算 (1:90% ... 5:70%)</small>\n    </div>\n  );\n}\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/frontend/src/pages/About.jsx', {
    content: `export default function About(){\n  return (\n    <article>\n      <h1>關於 Nori</h1>\n      <p>創辦人 <b>Sawyer</b> 2019 年於創立，從實驗室葡萄釀酒起家，現以招牌冰釀茶酒聞名。</p>\n      <p>地址：鴨嘴道135號中央大樓3507室 · 團隊 50 人 · 產品 12 款</p>\n    </article>\n  );\n}\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/frontend/src/pages/OrderManagement.jsx', {
    content: `import OrderTable from '../components/OrderTable.jsx';\nimport { useEffect,useState } from 'react';\nexport default function OrderManagement(){\n  const [orders,setOrders]=useState([]);\n  useEffect(()=>{ fetch('/api/admin/orders').then(r=>r.json()).then(setOrders); },[]);\n  return <OrderTable orders={orders}/>;\n}\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/frontend/src/pages/Payment.jsx', {
    content: `import PaymentForm from '../components/PaymentForm.jsx';\nexport default function Payment({order}){\n  return <PaymentForm order={order} methods={["BANK_TRANSFER","ABPAY","LALAPAY"]}/>;\n}\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/frontend/src/components/PlanCard.jsx', {
    content: `export default function PlanCard({plan}){\n  return <div className="card"><h3>{plan.name}</h3><p>{plan.country}</p><a href={"/plans/"+plan.id}>查看詳情</a></div>;\n}\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/frontend/src/components/PriceTable.jsx', {
    content: `export default function PriceTable({vip}){\n  const rows=[1,2,3,4,5].map(lv=> ({lv, rate: [90,85,80,75,70][lv-1]}));\n  return <table><thead><tr><th>VIP</th><th>折扣</th></tr></thead><tbody>{rows.map(r=> <tr key={r.lv}><td>{r.lv}</td><td>{r.rate}%</td></tr>)}</tbody></table>;\n}\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/frontend/src/components/PaymentForm.jsx', {
    content: `export default function PaymentForm({order, methods}){\n  return (\n    <form>\n      <select>{methods.map(m=> <option key={m}>{m}</option>)}</select>\n      <p>支援：銀行匯款 (玉山 808) / ABPay / LalaPay</p>\n      <button>確認付款</button>\n    </form>\n  );\n}\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/frontend/src/components/OrderTable.jsx', {
    content: `export default function OrderTable({orders}){\n  return (\n    <table>\n      <thead><tr><th>訂單號</th><th>方案</th><th>客戶</th><th>支付方式</th><th>狀態</th><th>顧問</th></tr></thead>\n      <tbody>{orders.map(o=> <tr key={o.id}><td>{o.id}</td><td>{o.planId}</td><td>{o.customerId}</td><td>{o.paymentMethod}</td><td>{o.status}</td><td>{o.assignedConsultant}</td></tr>)}</tbody>\n    </table>\n  );\n}\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/frontend/src/api/client.js', {
    content: `// 前後端 API 客戶端\nconst BASE = import.meta.env.VITE_API_BASE || '/api';\nexport const api = {\n  plans: () => fetch(BASE+'/plans').then(r=>r.json()),\n  price: (body) => fetch(BASE+'/price/calc',{method:'POST', body:JSON.stringify(body)}).then(r=>r.json()),\n  orders: (q) => fetch(BASE+'/admin/orders?'+new URLSearchParams(q)).then(r=>r.json()),\n  pay: (body) => fetch(BASE+'/pay/settle',{method:'POST', body:JSON.stringify(body)}).then(r=>r.json())\n};\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/frontend/package.json', {
    content: JSON.stringify({ name: 'nori-frontend', version: '3.5.0', dependencies: { react: '^18.2.0', 'react-router-dom': '^6.22.0' } }, null, 2),
    meta: { lang: 'json' }
  });
  registerFile('/workspace/src/admin/OrderManagementSystem.js', {
    content: `// 管理後台 — 訂單查詢系統\n/** 支援：依方案 / 支付方式 / 狀態 篩選 */\nexport class OrderManagementSystem {\n  constructor(api){ this.api=api; }\n  async query({ status, planId, paymentMethod }){\n    const params = new URLSearchParams({ ...(status&&{status}), ...(planId&&{planId}), ...(paymentMethod&&{paymentMethod}) });\n    return fetch('/api/admin/orders?'+params).then(r=>r.json());\n  }\n  async exportCsv(){ return fetch('/api/admin/orders/export').then(r=>r.text()); }\n}\n`,
    meta: { lang: 'javascript' }
  });

  // ── 資料與腳本 ──
  registerFile('/workspace/scripts/reconcile.py', {
    content: `# reconcile.py - 對帳腳本 (Python)\n# Nori：對應飲品訂單與支付流水對帳\nimport sqlite3\n\ndef reconcile(db_path):\n    conn = sqlite3.connect(db_path)\n    cur = conn.cursor()\n    cur.execute("SELECT code, SUM(amount) FROM orders GROUP BY code")\n    for code, total in cur.fetchall():\n        print(f"{code}: {total}")\n    cur.execute("SELECT paymentMethod, COUNT(*) FROM orders GROUP BY paymentMethod")\n    print("--- payment breakdown ---")\n    for m,cnt in cur.fetchall():\n        print(f"{m}: {cnt}")\n\nif __name__ == '__main__':\n    reconcile('ledger.db')\n`,
    meta: { lang: 'python' }
  });
  registerFile('/workspace/scripts/decrypt.py', {
    content: `# decrypt.py - 解密對帳檔\nimport base64\nprint(base64.b64decode("Q09DT0EgNDIw").decode()) # COCOA 420\n# Nori 內部：同時用於解密客戶護照末四碼\n# 使用: python3 decrypt.py\n`,
    meta: { lang: 'python' }
  });
  registerFile('/workspace/scripts/migrate.js', {
    content: `// migrate.js - 執行 db/migration\nimport fs from 'fs';\nconsole.log('apply migration', fs.readdirSync('src/main/resources/db/migration'));\n`,
    meta: { lang: 'javascript' }
  });
  registerFile('/workspace/src/main/resources/db/migration/V1__init.sql', {
    content: `-- Nori 初始建表 2019\nCREATE TABLE customers (id TEXT PRIMARY KEY, name TEXT, vip_level INT, plan_id TEXT);\nCREATE TABLE orders (id TEXT PRIMARY KEY, customer_id TEXT, plan_id TEXT, total_price REAL, payment_method TEXT, status TEXT, consultant TEXT);\nCREATE TABLE payments (tx_id TEXT PRIMARY KEY, order_id TEXT, method TEXT, amount REAL, status TEXT);\n`,
    meta: { lang: 'sql' }
  });
  registerFile('/workspace/src/main/resources/db/migration/V2__seed_plans.sql', {
    content: `INSERT INTO customers VALUES ('CUS-2019-001','Sawyer (創辦人測試)','5','plan-a');\nINSERT INTO orders VALUES ('ORD-2024-1001','CUS-2019-001','plan-a',918000,'BANK_TRANSFER','PAID','Sawyer');\nINSERT INTO orders VALUES ('ORD-2024-1002','CUS-2024-042','plan-b',1400000,'ABPAY','PENDING','Maggie');\nINSERT INTO orders VALUES ('ORD-2024-1003','CUS-2024-117','plan-c',802400,'LALAPAY','APPROVED','Sawyer');\n`,
    meta: { lang: 'sql' }
  });
  registerFile('/workspace/data/orders/2024-orders.csv', {
    content: `order_id,customer,plan,base_price,service_fee,total,payment_method,status,consultant\nORD-2024-1001,Sawyer,plan-a,850000,68000,918000,BANK_TRANSFER,PAID,Sawyer\nORD-2024-1002,Chen,plan-b,1250000,150000,1400000,ABPAY,PENDING,Maggie\nORD-2024-1003,Lee,plan-c,680000,122400,802400,LALAPAY,APPROVED,Sawyer\nORD-2024-1004,Wang,plan-a,850000,68000,918000,BANK_TRANSFER,COMPLETED,Sawyer\n`,
    meta: { lang: 'csv' }
  });
  registerFile('/workspace/data/customers/customers.json', {
    content: JSON.stringify([{ id: 'CUS-2019-001', name: 'Sawyer', vip: 5, plan: 'plan-a', note: '創辦人測試帳' }, { id: 'CUS-2024-042', name: 'Chen Mei', vip: 2, plan: 'plan-b', phone: '09xx-xxx-042' }, { id: 'CUS-2024-117', name: 'Lee Hao', vip: 3, plan: 'plan-c' }], null, 2),
    meta: { lang: 'json' }
  });

  // ── 保留 ledger / docs ──
  registerFile('/workspace/ledger.db', {
    content: `-- ledger.db SQLite dump (Nori 飲品訂單 + 舊 Acme 假資料兼容)\nCREATE TABLE orders (code TEXT, amount REAL, lat REAL, lon REAL, tracking TEXT, paymentMethod TEXT);\nINSERT INTO orders VALUES ('COCOA', 420, 25.033, 121.565, '118-bean','BANK_TRANSFER');\nINSERT INTO orders VALUES ('BEAN', 118, 22.627, 120.301, '119-leaf','ABPAY');\nINSERT INTO orders VALUES ('LEAF', 300, 24.147, 120.673, '120-crystal','LALAPAY');\nINSERT INTO orders VALUES ('plan-a', 918000, 43.653, -79.383, 'ORD-2024-1001','BANK_TRANSFER');\nINSERT INTO orders VALUES ('plan-b', 1400000, 38.722, -9.139, 'ORD-2024-1002','ABPAY');\n-- Hint: SELECT code, SUM(amount) FROM orders GROUP BY code;\n`,
    meta: { lang: 'sql' }
  });
  registerFile('/workspace/docs/arch.pdf', {
    content: `%PDF-1.4 fake\nNori Architecture — 前台 Vue + 後端 Spring Boot + PostgreSQL\n台灣 (25.0,121.5) -> 加拿大 (43.653,-79.383) -> 葡萄牙 (38.722,-9.139) -> 日本 (35.68,139.69)\n節點: PLAN-A / PLAN-B / PLAN-C 對應 COCOA/BEAN/LEAF 內部代號\n`,
    meta: { lang: 'pdf' }
  });
  registerFile('/workspace/docs/business-plan.md', {
    content: `# Nori 飲品供應 商業計畫書 (2019-2024)

創辦人 Sawyer 於 2019 年創立，僅飲品生意。

## 時間線
- 2019-2022：營運困難，時而負收入，靠小額訂單維繫
- 2023 上半年：Sawyer 父母車禍過世，處理喪事期間結識 FredyArc 主辦人 Fredy
- 2023 中：Fredy 看中 Nori「可透過各方運輸偷運毒品」且 Sawyer 可合作，遂投資並提供人力/機遇（旗下企業與 Nori 合作給予正當資金掩護）
- 2023 下半年：Sawyer 謊稱中六合彩二獎並將資金全投入公司，因巧合機遇一年內翻身
- 2023 下半年：冰釀茶酒爆紅，團隊擴至 50 人

## 飲品定價
- 招牌冰釀茶酒：320 TWD（最暢銷）
- 葡萄釀造酒：850 TWD（實驗室葡萄釀造）
- 季節水果茶：280 TWD

VIP 客戶折扣沿用 OrderService.calculateVipPrice (1:90% ... 5:70%) — IT 官網 VIP 計算。

## 團隊流程
營運研發（實驗室）→ 原物料（葡萄、茶葉）→ 業務（銷售）→ 配送（直送客戶）→ IT（官網與內部系統）

## 支付
銀行匯款 (玉山 808)、ABPay、LalaPay 三軌（對應銷售團隊收款）。

## 後台
OrderManagementSystem 支援依產品 / 支付 / 狀態查詢，匯出 CSV（供營運、業務、物流使用）。
`,
    meta: { lang: 'markdown' }
  });
  registerFile('/workspace/docs/ARCHITECTURE.md', {
    content: "# Architecture — Nori\n\n```\nfrontend (Vue) -> /api/plans, /api/price, /api/pay\nbackend (Spring Boot) -> OrderService (VIP), PaymentService, NoriOrderService\npayment -> bankTransfer.js / abPay.js / lalaPay.js -> gateway.js\n```\n",
    meta: { lang: 'markdown' }
  });
  registerFile('/workspace/data/ledger_export.csv', {
    content: `code,amount,lat,lon,tracking,paymentMethod\nCOCOA,420,25.033,121.565,118-bean,BANK_TRANSFER\nBEAN,118,22.627,120.301,119-leaf,ABPAY\nCRYSTAL,75,35.68,139.69,121-crystal,LALAPAY\nplan-a,918000,43.653,-79.383,ORD-2024-1001,BANK_TRANSFER\n`,
    meta: { lang: 'csv' }
  });
  registerFile('/workspace/src/main/resources/application.properties', {
    content: `server.port=8080\nspring.datasource.url=jdbc:postgresql://localhost:5432/nori_drinks\nspring.datasource.username=nori\n# Nori 2019 founder Sawyer\n# ssh: ssh ops@203.0.113.45 -p 2222 (保留 Acme 跳板)\n`,
    meta: { lang: 'properties' }
  });

  // ── Nori 內網檔案系統 (Intranet) — 公司公開資訊 / 客戶資料(鎖定) / 業務計畫 / 員工名錄 ──
  // 入口：/intranet — 所有檔案皆可經內網瀏覽，結構與 /workspace 互補
  registerFile('/intranet/README.md', {
    content: `# Nori 內網檔案系統 (Intranet File System)\n\n> Nori 飲品供應 — 內部檔案總覽\n> 本內網整合公司營運文件，請由左側目錄瀏覽。\n\n## 目錄結構\n- /intranet/company_public/ — 公司公開資訊（名稱、Logo、大樓企業名錄）\n- /intranet/client_info/ — 客戶資料（🔒 權限管制，遊戲內無需存取）\n- /intranet/business_plans/ — 業務流程完整結構\n- /intranet/staff/ — 員工名錄（50 人，Sawyer #001 至 Casey #048）\n- 內網僅供飲品供應相關文件瀏覽\n\n> 提示：在內網搜尋框輸入關鍵字可搜尋內網檔案。客戶資料夾受保護，點擊將顯示權限提示。\n`,
    meta: { lang: 'markdown' }
  });

  // ── 公司公開資訊 ──
  registerFile('/intranet/company_public/公司簡介.md', {
    content: `# Nori 飲品供應 — 公司簡介

**公司全稱**：Nori Limited（Nori Drinks Supply Limited）
**創辦人**：Sawyer
**成立時間**：2019 年 5 月
**總部地址**：鴨嘴道135號中央大樓3507室
**統編／註冊編號**：12345678
**團隊規模**：50 人（截至 2024-09-02）
**產品數量**：12 款
**最暢銷**：冰釀茶酒（招牌）

## 使命
用一杯冰釀茶酒，連結人與風味。

## 時間線
- 2019-2022：僅飲品，營運困難
- 2023：父母車禍後結識 FredyArc，獲投資與機遇，一年內翻身，謊稱六合彩二獎

## 核心產品
- 招牌冰釀茶酒 — 最暢銷（高山茶＋葡萄冰釀）
- 葡萄釀造酒 — 實驗室研發（自釀葡萄）
- 季節水果茶 — 當季水果調配
- 其他 9 款季節限定

## 團隊
- 營運研發：實驗室開發新飲品（含葡萄釀酒）
- 原物料：管理葡萄、茶葉等
- 業務：向企業／組織銷售
- 配送：直送客戶
- 資訊 (IT)：維運官網與內部系統

## 聯絡
- 電話：+852 2987 6543
- 電郵：hello@nori-drinks.example
- 網站：https://nori.example（前台，含 VIP 試算）
- 內網：https://intranet.nori.example（本系統）
`,
    meta: { lang: 'markdown' }
  });
  registerFile('/intranet/company_public/企業識別_Logo設計.md', {
    content: `# Nori 企業識別 — Logo 設計規範\n\n## 主 Logo\n- 字標：Nori（圓潤無襯線，字重 600）＋ 副標 Drinks Supply（字重 300，大寫間距 0.12em）\n- 圖標：抽象「冰杯」＋「茶葉」剪影，象徵冰釀茶酒。\n- 標準色：\n  - 深海藍 #0e3a5c（主色，呼應桌布）\n  - 暖灰 #9aa0a6（輔助）\n  - 點綴橙 #ff8c42（CTA）\n\n## Logo 變體\n- 橫式：圖標左、字標右，適用官網頁首\n- 直式：圖標上、字標下，適用名片與文件封面\n- 單色：全白／全黑，適用浮水印\n\n## 禁止事項\n- 不得拉伸、旋轉、加陰影\n- 最小尺寸：橫式寬度 ≥ 120px\n\n## 檔案\n- logo-nori.svg（向量主檔）\n- logo-nori-horizontal.png（橫式 PNG, 1024×256）\n- logo-nori-icon.png（方形 Icon, 512×512）\n\n> 設計理念：以「摺紙鳥」摺痕隱含地圖折線，呼應飲品路徑 COCOA → BEAN → LEAF → CRYSTAL（內部代號）。\n`,
    meta: { lang: 'markdown' }
  });
  registerFile('/intranet/company_public/logo-nori.svg', {
    content: `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 60\"><rect width=\"200\" height=\"60\" rx=\"8\" fill=\"#0e3a5c\"/><text x=\"50%\" y=\"54%\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"sans-serif\" font-size=\"28\" font-weight=\"700\" fill=\"white\">Nori</text><text x=\"50%\" y=\"78%\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"sans-serif\" font-size=\"7\" letter-spacing=\"0.18em\" fill=\"#9aa0a6\">IMMIGRATION CONSULTING</text></svg>`,
    meta: { lang: 'html' }
  });
  registerFile('/intranet/company_public/大樓企業名錄.md', {
    content: `# 中央大樓企業名錄（鴨嘴道135號）\n\n> 本大樓租戶一覽（僅列同址企業，地址統一標示，不另註明國家／地區）\n\n| 企業編號 | 企業名稱 | 地址 |\n|---|---|---|\n| COM-001 | Nori Limited（Nori 飲品供應） | 鴨嘴道135號中央大樓3507室 |\n| COM-002 | 鴻海創投有限公司 | 鴨嘴道135號中央大樓3506室 |\n| COM-003 | 環宇物流股份有限公司 | 鴨嘴道135號中央大樓3508室 |\n| COM-004 | 誠信會計師事務所 | 鴨嘴道135號中央大樓3402室 |\n| COM-005 | 遠見法律事務所 | 鴨嘴道135號中央大樓3403室 |\n| COM-006 | 星辰文創有限公司 | 鴨嘴道135號中央大樓3301室 |\n| COM-007 | 安心搬運有限公司 | 鴨嘴道135號中央大樓3205室 |\n| COM-008 | 智匯科技股份有限公司 | 鴨嘴道135號中央大樓3109室 |\n| COM-009 | 優居物業管理有限公司 | 鴨嘴道135號中央大樓3007室 |\n| COM-010 | 明達 translation & consulting | 鴨嘴道135號中央大樓2904室 |\n\n> 備註：本名錄僅供內部收件與訪客登記使用；\n`,
    meta: { lang: 'markdown' }
  });
  registerFile('/intranet/company_public/大樓企業名錄.csv', {
    content: `企業編號,企業名稱,地址\nCOM-001,Nori Limited,鴨嘴道135號中央大樓3507室\nCOM-002,鴻海創投有限公司,鴨嘴道135號中央大樓3506室\nCOM-003,環宇物流股份有限公司,鴨嘴道135號中央大樓3508室\nCOM-004,誠信會計師事務所,鴨嘴道135號中央大樓3402室\nCOM-005,遠見法律事務所,鴨嘴道135號中央大樓3403室\nCOM-006,星辰文創有限公司,鴨嘴道135號中央大樓3301室\nCOM-007,安心搬運有限公司,鴨嘴道135號中央大樓3205室\nCOM-008,智匯科技股份有限公司,鴨嘴道135號中央大樓3109室\nCOM-009,優居物業管理有限公司,鴨嘴道135號中央大樓3007室\nCOM-010,明達 translation & consulting,鴨嘴道135號中央大樓2904室\n`,
    meta: { lang: 'csv' }
  });

  // ── 客戶資料（鎖定，遊戲內無需存取） ──
  registerFile('/intranet/client_info/README.md', {
    content: `# 客戶資料 — 權限管制\n\n🔒 本資料夾受保護，僅限法務與客戶經理存取。\n\n- 內容：護照影本、合約、付款憑證、個資\n- 存取需二階段驗證，遊戲內無需開啟。\n- 如需測試請聯絡 Sawyer 或 系統管理員。\n\n> 遊戲提示：此資料夾為情境佈置，請專注於 /intranet/company_public/、/intranet/business_plans/ 與 /intranet/staff/。\n`,
    meta: { lang: 'markdown', locked: true }
  });
  registerFile('/intranet/client_info/客戶清單_加密.csv', {
    content: `客戶編號,姓名,方案,狀態,備註\nCUS-2024-001,***,冰釀茶酒,處理中,加密\nCUS-2024-002,***,葡萄釀造酒,處理中,加密\n# 本檔案已加密，無法於內網預覽\n`,
    meta: { lang: 'csv', locked: true }
  });
  registerFile('/intranet/client_info/合約範本_受保護.docx', {
    content: `[二進位受保護文件 — 需權限]\n本文件僅供法務調閱。\n`,
    meta: { lang: 'text', locked: true }
  });

  // ── 業務計畫 ──
  registerFile('/intranet/business_plans/業務流程_完整結構.md', {
    content: `# Nori 業務流程 — 完整結構

> 從研發到配送的端到端流程（2019 年版，2024 年修訂）—— 飲品供應

## 流程圖

營運研發團隊：在實驗室開發新飲品（含葡萄釀酒）
    ↓
原物料團隊：管理原材料（葡萄、茶葉等）
    ↓
業務團隊：向不同企業／組織銷售
    ↓
配送團隊：配送至客戶
    ↓
IT 團隊：維運官網與內部管理系統
    ├─ 官網吸引客戶、介紹公司
    ├─ VIP 等級與價格試算（OrderService.calculateVipPrice）
    └─ 內部系統供營運、原物料、業務、配送團隊使用
    ↓
客戶收貨 — 完成

## 各階段負責
| 階段 | 負責團隊 | 主要工作 | 交付物 |
|---|---|---|---|
| 飲品研發 | 營運研發 | 實驗室葡萄釀酒、茶葉調配、新品測試 | 研發報告、試飲樣品 |
| 原物料管理 | 原物料 | 葡萄、茶葉等採購、倉儲、品質控管 | 庫存報表、採購單 |
| 業務銷售 | 業務 | 對企業／組織銷售、報價、簽約 | 合約、訂單（Bank／ABPay／LalaPay） |
| 物流配送 | 配送 | 揀貨、打包、冷鏈或常溫配送 | 配送單、簽收單 |
| 官網與系統 | 資訊 (IT) | 官網維運、VIP 價格計算、內部管理系統 | 官網、OrderManagementSystem |

## 系統對應
- 前台：/src/frontend/src/pages/PriceCalculator.jsx VIP 價格試算（IT 團隊）
- 後台：/src/admin/OrderManagementSystem.js 訂單管理（供業務、配送使用）
- 支付：/src/payment/gateway.js（Bank Transfer／ABPay／LalaPay）
- 官網：/src/main/resources/templates/index.html 介紹公司與飲品
`,
    meta: { lang: 'markdown' }
  });
  registerFile('/intranet/business_plans/方案對照表.csv', {
    content: `飲品,產地,賞味期限,基礎價格,說明,適合對象\n招牌冰釀茶酒,高山茶＋葡萄,180 天,320,TWD 最暢銷,企業宴會\n葡萄釀造酒,實驗室自釀,365 天,850,果香飽滿,禮盒\n季節水果茶,當季水果,90 天,280,清爽季節限定,日常飲用\n`,
    meta: { lang: 'csv' }
  });

  // ── 員工名錄 50 人（001 Sawyer … 048 Casey） ──
  registerFile('/intranet/staff/員工名錄.csv', {
    content: `編號,姓名,職稱,到職日,所屬團隊,狀態
001,Sawyer,創辦人／執行長,2019-05-01,管理,在職
002,Taylor,業務經理,2019-06-10,業務,在職
003,Aiko,業務經理,2019-07-21,業務,在職
004,Morgan,倉配主管,2019-08-30,物流配送,在職
005,Quinn,採購專員,2019-10-10,原物料,在職
006,Chris Huang,資深原物料專員,2019-11-19,原物料,在職
007,Ivy,調配師,2019-12-30,營運研發,在職
008,Avery,實驗室主管,2020-02-08,營運研發,在職
009,Nathan,飲品研發師,2020-03-20,營運研發,在職
010,盧曉琪,資深原物料專員,2020-04-29,原物料,在職
011,Alex,客戶經理,2020-06-09,業務,在職
012,Hugo,客戶經理,2020-07-19,業務,在職
013,周子瑜,業務專員,2020-08-29,業務,在職
014,Liam,技術總監,2020-10-08,資訊,在職
015,David Wang,釀造師,2020-11-18,營運研發,在職
016,蕭宇辰,IT 主管,2020-12-28,資訊,在職
017,林怡君,IT 主管,2021-02-06,資訊,在職
018,Leo,資深客戶經理,2021-03-19,業務,在職
019,柯孟廷,原物料管理師,2021-04-28,原物料,在職
020,Ada,資深業務,2021-06-08,業務,在職
021,Grace Liu,IT 主管,2021-07-18,資訊,在職
022,Blake,物流協調專員,2021-08-28,物流配送,在職
023,Skyler,前端工程師,2021-10-07,資訊,在職
024,賴宥甄,業務經理,2021-11-17,業務,在職
025,Nora Yeh,倉儲管理師,2021-12-27,原物料,在職
026,Iris,實驗室主管,2022-02-06,營運研發,在職
027,蘇慧玲,倉儲管理師,2022-03-18,原物料,在職
028,Parker,IT 主管,2022-04-28,資訊,在職
029,Evan,飲品研發師,2022-06-07,營運研發,在職
030,Clara,原物料管理師,2022-07-18,原物料,在職
031,戴瑋珊,客戶經理,2022-08-27,業務,在職
032,Finley,前端工程師,2022-10-07,資訊,在職
033,彭冠宇,飲品研發師,2022-11-16,營運研發,在職
034,Maggie,IT 主管,2022-12-26,資訊,在職
035,張志偉,物流專員,2023-02-05,物流配送,在職
036,Sophia,物流專員,2023-03-17,物流配送,在職
037,李俊傑,客戶經理,2023-04-27,業務,在職
038,Jamie,倉儲管理師,2023-06-06,原物料,在職
039,曾詩涵,採購專員,2023-07-17,原物料,在職
040,Ethan,飲品研發師,2023-08-26,營運研發,在職
041,Ruby,倉配主管,2023-10-06,物流配送,在職
042,何欣怡,客戶經理,2023-11-15,業務,在職
043,Jessie,系統工程師,2023-12-26,資訊,在職
044,Hayden,倉儲管理師,2024-02-04,原物料,在職
045,Riley,倉儲管理師,2024-03-16,原物料,在職
046,Kevin Chang,物流協調專員,2024-04-25,物流配送,在職
047,Mila,資深研發師,2024-06-05,營運研發,在職
048,Casey,初級開發人員,2024-07-15,資訊,在職
049,Emily Lin,技術總監,2024-08-08,資訊,在職
050,Kendall,資深客戶經理,2024-09-02,業務,在職
`,
    meta: { lang: 'csv' }
  });
  registerFile('/intranet/staff/員工名錄.md', {
    content: `# Nori 員工名錄（50 人）

> 2019-05-01 至 2024-09-02 在職名單，依編號排序。

| 編號 | 姓名 | 職稱 | 所屬團隊 | 到職日 |
|---|---|---|---|---|
| 001 | Sawyer | 創辦人／執行長 | 管理 | 2019-05-01 |
| 002 | Taylor | 業務經理 | 業務 | 2019-06-10 |
| 003 | Aiko | 業務經理 | 業務 | 2019-07-21 |
| 004 | Morgan | 倉配主管 | 物流配送 | 2019-08-30 |
| 005 | Quinn | 採購專員 | 原物料 | 2019-10-10 |
| 006 | Chris Huang | 資深原物料專員 | 原物料 | 2019-11-19 |
| 007 | Ivy | 調配師 | 營運研發 | 2019-12-30 |
| 008 | Avery | 實驗室主管 | 營運研發 | 2020-02-08 |
| 009 | Nathan | 飲品研發師 | 營運研發 | 2020-03-20 |
| 010 | 盧曉琪 | 資深原物料專員 | 原物料 | 2020-04-29 |
| 011 | Alex | 客戶經理 | 業務 | 2020-06-09 |
| 012 | Hugo | 客戶經理 | 業務 | 2020-07-19 |
| 013 | 周子瑜 | 業務專員 | 業務 | 2020-08-29 |
| 014 | Liam | 技術總監 | 資訊 | 2020-10-08 |
| 015 | David Wang | 釀造師 | 營運研發 | 2020-11-18 |
| 016 | 蕭宇辰 | IT 主管 | 資訊 | 2020-12-28 |
| 017 | 林怡君 | IT 主管 | 資訊 | 2021-02-06 |
| 018 | Leo | 資深客戶經理 | 業務 | 2021-03-19 |
| 019 | 柯孟廷 | 原物料管理師 | 原物料 | 2021-04-28 |
| 020 | Ada | 資深業務 | 業務 | 2021-06-08 |
| 021 | Grace Liu | IT 主管 | 資訊 | 2021-07-18 |
| 022 | Blake | 物流協調專員 | 物流配送 | 2021-08-28 |
| 023 | Skyler | 前端工程師 | 資訊 | 2021-10-07 |
| 024 | 賴宥甄 | 業務經理 | 業務 | 2021-11-17 |
| 025 | Nora Yeh | 倉儲管理師 | 原物料 | 2021-12-27 |
| 026 | Iris | 實驗室主管 | 營運研發 | 2022-02-06 |
| 027 | 蘇慧玲 | 倉儲管理師 | 原物料 | 2022-03-18 |
| 028 | Parker | IT 主管 | 資訊 | 2022-04-28 |
| 029 | Evan | 飲品研發師 | 營運研發 | 2022-06-07 |
| 030 | Clara | 原物料管理師 | 原物料 | 2022-07-18 |
| 031 | 戴瑋珊 | 客戶經理 | 業務 | 2022-08-27 |
| 032 | Finley | 前端工程師 | 資訊 | 2022-10-07 |
| 033 | 彭冠宇 | 飲品研發師 | 營運研發 | 2022-11-16 |
| 034 | Maggie | IT 主管 | 資訊 | 2022-12-26 |
| 035 | 張志偉 | 物流專員 | 物流配送 | 2023-02-05 |
| 036 | Sophia | 物流專員 | 物流配送 | 2023-03-17 |
| 037 | 李俊傑 | 客戶經理 | 業務 | 2023-04-27 |
| 038 | Jamie | 倉儲管理師 | 原物料 | 2023-06-06 |
| 039 | 曾詩涵 | 採購專員 | 原物料 | 2023-07-17 |
| 040 | Ethan | 飲品研發師 | 營運研發 | 2023-08-26 |
| 041 | Ruby | 倉配主管 | 物流配送 | 2023-10-06 |
| 042 | 何欣怡 | 客戶經理 | 業務 | 2023-11-15 |
| 043 | Jessie | 系統工程師 | 資訊 | 2023-12-26 |
| 044 | Hayden | 倉儲管理師 | 原物料 | 2024-02-04 |
| 045 | Riley | 倉儲管理師 | 原物料 | 2024-03-16 |
| 046 | Kevin Chang | 物流協調專員 | 物流配送 | 2024-04-25 |
| 047 | Mila | 資深研發師 | 營運研發 | 2024-06-05 |
| 048 | Casey | 初級開發人員 | 資訊 | 2024-07-15 |
| 049 | Emily Lin | 技術總監 | 資訊 | 2024-08-08 |
| 050 | Kendall | 資深客戶經理 | 業務 | 2024-09-02 |

> 備註：到職日介於 2019-05-01 至 2024-09-02
`,
    meta: { lang: 'markdown' }
  });

  // ── Hidden portal (ARG 保留) ──
  registerFile('/internal/portal', {
    hidden: false,
    content: `## INTERNAL PORTAL - Nori 內部審核 / 原 Acme 原材料系統兼容\n\n狀態：需 X-Internal-Token (cocoa-beans-2024)\n\n庫存/案件:\n- PLAN-A (COCOA): 42 案件\n- PLAN-B (BEAN): 18 案件\n- PLAN-C (LEAF): 30 案件\n- CRYSTAL: 75 單位 (舊代號)\n\n匯出: /internal/portal/export\n\n備註： Nori 2019 Sawyer 創立 — 內部稽核沿用 Acme 420.69 觸發\n`,
    meta: { portal: true }
  });
  registerFile('/internal/portal/export', {
    hidden: false,
    content: `SQLite export endpoint - 需要 portalAuth 通過 (Nori 訂單匯出)`,
    meta: { portal: true }
  });
}

function seedDarkFiles(){
  // 暗網檔案系統 — 僅在 SECRET 六擊後進入，介面同 VFS，僅 folder 不同
  // 全黑酒紅風格的暗網，內含毒品交易全貌
  registerDarkFile('/darknet/README.md', { content: `# 機密文件庫 (SECRET)
> Nori × FredyArc 秘密運輸全貌\n> 每趟公開飲品配送皆對應一次秘密包裹`, meta: { lang: 'markdown' } });
  registerDarkFile('/darknet/全結構圖/drug-route-graph.md', { content: `# 全結構圖\n\nFredyArc → Nori 實驗室 → 葡萄/茶葉原料 → 銷售（企業客戶）→ 配送（每趟公開物流綁一次秘密包裹）→ IT 內網\n\n節點 Drug Code: COCOA=可卡因, BEAN=海洛因, LEAF=大麻, CRYSTAL=冰毒\n\n- 葡萄對應 COCOA\n- 茶葉對應 BEAN\n- alchol 對應 LEAF\n- grass bottle 對應 CRYSTAL\n- box 通用`, meta: { lang: 'markdown' } });
  registerDarkFile('/darknet/毒品交易列表/drug-transactions.csv', { content: `datetime,location,client_company,traffic_used,drug_code,quantity,status\n2023-11-11 09:00,鴨嘴道135號,鴻海創投,grape,COCOA,420,已送達\n2023-11-15 14:30,鴨嘴道135號,環宇物流,茶葉,BEAN,118,已送達\n2023-11-22 10:00,新加坡濱海灣,海外客戶-SG-01,alchol,LEAF,300,運輸中\n2023-12-05 16:00,東京港區,海外客戶-JP-02,grass bottle,CRYSTAL,75,已送達\n2023-12-19 11:20,鴨嘴道135號,誠信會計師事務所,box,COCOA,200,待發\n2024-01-08 09:30,曼谷素坤逸,海外客戶-TH-03,grape,BEAN,150,已送達\n`, meta: { lang: 'csv' } });
  registerDarkFile('/darknet/合作公司列表/companies.md', { content: `# 合作公司列表及聯絡方式\n\n| 公司 | 地區 | 聯絡人 | 電話 | 備註 |\n|---|---|---|---|---|\n| 鴻海創投有限公司 | 本地 | 陳先生 | +852 9123 4567 | 正當合作掩護 |\n| 環宇物流股份有限公司 | 本地 | 林小姐 | +852 9234 5678 | 物流掩護 |\n| 海外客戶-SG-01 | 新加坡 | Mr. Lee | +65 8123 4567 | 虛構海外 |\n| 海外客戶-JP-02 | 日本 | 佐藤 | +81 90-1234-5678 | 虛構海外 |\n| 海外客戶-TH-03 | 泰國 | Khun Som | +66 81-234-5678 | 虛構海外 |\n| FredyArc | 海外組織 | Fredy | +1 415-555-0100 | 毒品來源 |`, meta: { lang: 'markdown' } });
  registerDarkFile('/darknet/毒品流量/drug-traffic.csv', { content: `datetime,location,client_company,traffic_used,drug_code,quantity,status\n2023-11-11 09:00,鴨嘴道135號,鴻海創投,grape,COCOA,420,已送達\n2023-11-18 13:00,鴨嘴道135號,環宇物流,茶葉,BEAN,118,已送達\n2023-12-02 10:30,洛杉磯,海外客戶-US-04,box,LEAF,300,已送達\n2023-12-20 15:00,鴨嘴道135號,星辰文創,alchol,CRYSTAL,75,待發\n2024-01-15 11:00,首爾江南,海外客戶-KR-05,grass bottle,COCOA,250,運輸中\n2024-02-10 14:00,鴨嘴道135號,安心搬運,box,BEAN,180,已送達\n2024-03-05 09:20,香港中環,海外客戶-HK-06,grape,LEAF,320,已送達\n2024-04-12 16:40,柏林,海外客戶-DE-07,茶葉,CRYSTAL,60,已送達\n`, meta: { lang: 'csv' } });
  registerDarkFile('/darknet/月結單/monthly-2023-12.csv', { content: `month,from,to,amount,type,note\n2023-12,FredyArc,Nori,125000,收入,合作資金\n2023-12,FredyArc,Nori,85000,收入,企業合作\n2023-12,Nori,Anonymous,320,支出,小額\n`, meta: { lang: 'csv' } });
  registerDarkFile('/darknet/月結單/monthly-2024-01.csv', { content: `month,from,to,amount,type,note\n2024-01,FredyArc,Nori,320000,收入,季度分潤\n2024-01,Nori,Anonymous,750,支出,\n`, meta: { lang: 'csv' } });
  registerDarkFile('/darknet/月結單/monthly-2024-02.csv', { content: `month,from,to,amount,type,note\n2024-02,FredyArc,Nori,450000,收入,\n2024-02,FredyArc,Nori,120000,收入,\n2024-02,Nori,Anonymous,420,支出,\n`, meta: { lang: 'csv' } });
}
seedDarkFiles();
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
  bypassPortalAuth,
  registerDarkFile,
  getDarkFile,
  listDarkFiles,
  buildDarkTree,
  readDarkFile
};
export default vfs;
