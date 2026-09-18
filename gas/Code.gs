/**
 * arg-game-it-company-secret — Google Apps Script + Sheets 追蹤後端
 * 部署為 Web App (執行身分: 我 / 存取權: 所有人) 後，複製 exec URL 貼到前端 analytics.js 或 localStorage cc_gas_url
 *
 * 單表單列一 session（最多 2 次寫入）：
 *  - 玩家首次打開 => 前端 sendSessionStart -> doPost {action:'session_start'} => append 一列（start_date, session_id, lang, ua，其餘空白）
 *  - 遊玩期間 whatsapp/email/chp 時間皆緩衝於前端 localStorage，不寫入
 *  - 達成結局 => 前端 sendSessionEnd -> doPost {action:'session_end'} => 以 session_id 為 key 找到同一列並覆蓋更新（end_date, total_play_time, chp0-4, ending, inputted_content, archievement_list）
 *  - 若直接收到 session_end 但找不到既有列，則直接 append 一列（兼容舊資料 / 無痕重整）
 *
 * 試算表欄位（唯一 14 欄，嚴格照此順序）：
 * start_date | end_date | session_id | total_play_time | lang | ua | chp0_play_time | chp1_play_time | chp2_play_time | chp3_play_time | chp4_play_time | ending | inputted_content | archievement_list
 *   start_date / end_date: ISO timestamp (例 2026-03-20T11:30:00.000Z)
 *   session_id: 前端 cc_game_session.id (gs_xxxx)
 *   total_play_time / chp*_play_time: 秒數 (Number)
 *   ending: 中文 {舉報 / 合作 / 離職 / 平凡的日常 / 做對了嗎？}
 *   inputted_content JSON: {whatsup:[{to,content}], email:[{to,title,content}]} 僅在 send 時才有，點擊 send 才紀錄
 *   archievement_list JSON: {"老闆知音":"9/10", "你知道得太多了":"0/10", ...}
 */

const SHEET_NAME = 'game_events';
const LEGACY_SESSION_SHEET = 'sessions';

function getSpreadsheet_(){
  let ss = null;
  try{ ss = SpreadsheetApp.getActiveSpreadsheet(); }catch(e){}
  if(ss) return ss;
  try{
    const props = PropertiesService.getScriptProperties();
    const id = props.getProperty('SHEET_ID');
    if(id) return SpreadsheetApp.openById(id);
  }catch(e){}
  throw new Error('找不到試算表：請務必在「Sheets → 擴充功能 → Apps Script」內建立專案，而非在 script.google.com 獨立建立。或在 ScriptProperties 設定 SHEET_ID');
}

function doGet(e) {
  try{
    const ss = getSpreadsheet_();
    return ContentService.createTextOutput(JSON.stringify({ok:true, ping: Date.now(), sheet: SHEET_NAME, spreadsheet: ss.getName()}))
      .setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({ok:false, error: String(err), hint: '請確認專案是綁定到試算表的容器專案'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e){
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT);
}

const HEADER = ['start_date','end_date','session_id','total_play_time','lang','ua','chp0_play_time','chp1_play_time','chp2_play_time','chp3_play_time','chp4_play_time','ending','inputted_content','archievement_list'];

function ensureSheet_(ss){
  // 一律以 game_events 為主表（兼容舊試算表），全新試算表則建立 sessions 以保持舊文件連結也不斷
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    // 若舊的 sessions 已存在，沿用它並正名為 game_events（避免雙表）
    const legacy = ss.getSheetByName(LEGACY_SESSION_SHEET);
    if (legacy) {
      try { legacy.setName(SHEET_NAME); } catch(e) {}
      sheet = ss.getSheetByName(SHEET_NAME);
    }
  }
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADER);
    sheet.setFrozenRows(1);
    return sheet;
  }
  // 若表頭不是 14 欄精準格式，自動重建表頭（覆蓋舊 31 欄 / 12 欄 schema）
  try{
    const lastCol = sheet.getLastColumn();
    const headerRow = sheet.getRange(1,1,1,lastCol).getValues()[0];
    const needFix = headerRow.join('|') !== HEADER.join('|');
    if (needFix) {
      // 舊表可能是 HEADER_V2 (31欄) 或 HEADER_SESSION (12欄) — 直接覆蓋為 14 欄新表頭
      // 清空首列全部再寫入，避免殘留舊欄名
      sheet.getRange(1,1,1,Math.max(lastCol, HEADER.length)).clearContent();
      sheet.getRange(1,1,1,HEADER.length).setValues([HEADER]);
      // 舊資料列（第2列起）保留但欄位已不對齊，提示使用者可手動刪除舊列或另建試算表
      // 若需完全重置，可手動清空工作表內容後重新觸發寫入
    } else if (lastCol !== HEADER.length) {
      // 欄數不同但內容相同（極少見），仍正規化
      sheet.getRange(1,1,1,HEADER.length).setValues([HEADER]);
      if (lastCol > HEADER.length) {
        sheet.getRange(1, HEADER.length+1, 1, lastCol - HEADER.length).clearContent();
      }
    }
  }catch(e){}
  // 同步清理孤立的 legacy sessions 表（若與主表並存，避免混淆 — 僅在主表已修正後刪除）
  try{
    const dup = ss.getSheetByName(LEGACY_SESSION_SHEET);
    if (dup && dup.getSheetId() !== sheet.getSheetId()) {
      // 若 sessions 表仍為舊 schema，清空或提示；此處不自動刪除以免誤刪使用者手動資料，僅確保主表正確
    }
  }catch(e){}
  return sheet;
}

function clip(s, n){ try{ return String(s).slice(0, n); }catch{ return ''; } }

function doPost(e) {
  const lock = LockService.getScriptLock();
  try { lock.tryLock(10000); } catch(err){}
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ok:false, error:'empty body: 請用 Content-Type: text/plain 發送 JSON'}, 400);
    }
    let body;
    try { body = JSON.parse(e.postData.contents); } catch(err){
      return jsonResponse({ok:false, error:'invalid json: ' + String(err)}, 400);
    }
    // 兼容舊欄位名：archievement -> archievement_list, total_time_sec -> total_play_time 等
    if (body.archievement && !body.archievement_list) body.archievement_list = body.archievement;
    if (body.total_time_sec != null && body.total_play_time == null) body.total_play_time = body.total_time_sec;
    if (body.game_session_id && !body.session_id) body.session_id = body.game_session_id;
    if (body.game_session_start && !body.start_date) body.start_date = body.game_session_start;
    if (body.game_session_end && !body.end_date) body.end_date = body.game_session_end;

    const ss = getSpreadsheet_();
    const sheet = ensureSheet_(ss);

    const action = (body.action || body.event_type || '').toString();
    const isStart = action === 'session_start';
    const isEnd = action === 'session_end';
    // 若無 action 但帶 start_date 且無 end_date 視為 start，帶 end_date 視為 end
    const inferredStart = !isStart && !isEnd && body.start_date && !body.end_date;
    const inferredEnd = !isStart && !isEnd && body.end_date;

    // 標準化 ending 為中文（容錯英文）
    const endingMap = { report:'舉報', cooperate:'合作', resign:'離職', flee:'平凡的日常', fried:'做對了嗎？' };
    let endingZh = (body.ending || '').toString();
    if (endingMap[endingZh]) endingZh = endingMap[endingZh];

    const sessionId = (body.session_id || '').toString().trim();
    if (!sessionId) return jsonResponse({ok:false, error:'missing session_id'}, 400);

    if (isStart || inferredStart) {
      // session_start: 直接 append 一列（即使已存在同 id 也不覆蓋，避免誤判；若同 id 已存在則先更新視為冪等）
      const existingRow = findRowBySessionId_(sheet, sessionId);
      if (existingRow > 0) {
        // 已有同 session_id 的列，視為重複 start（刷新等），不重複 append
        return jsonResponse({ok:true, action:'session_start', reused:true, row: existingRow});
      }
      const row = [
        body.start_date || new Date().toISOString(),
        body.end_date || '',
        sessionId,
        body.total_play_time != null ? body.total_play_time : 0,
        clip(body.lang || 'zh-TW', 20),
        clip(body.ua || '', 200),
        body.chp0_play_time != null ? body.chp0_play_time : 0,
        body.chp1_play_time != null ? body.chp1_play_time : 0,
        body.chp2_play_time != null ? body.chp2_play_time : 0,
        body.chp3_play_time != null ? body.chp3_play_time : 0,
        body.chp4_play_time != null ? body.chp4_play_time : 0,
        clip(endingZh, 30),
        clip(body.inputted_content || JSON.stringify({whatsup:[], email:[]}), 4000),
        clip(body.archievement_list || '{}', 4000)
      ];
      sheet.appendRow(row);
      return jsonResponse({ok:true, action:'session_start', row: sheet.getLastRow()});
    }

    if (isEnd || inferredEnd) {
      // session_end: 以 session_id 定位同一列並整列覆蓋更新；找不到則 append
      const rowIdx = findRowBySessionId_(sheet, sessionId);
      const row = [
        body.start_date || '',
        body.end_date || new Date().toISOString(),
        sessionId,
        body.total_play_time != null ? body.total_play_time : '',
        clip(body.lang || 'zh-TW', 20),
        clip(body.ua || '', 200),
        body.chp0_play_time != null ? body.chp0_play_time : '',
        body.chp1_play_time != null ? body.chp1_play_time : '',
        body.chp2_play_time != null ? body.chp2_play_time : '',
        body.chp3_play_time != null ? body.chp3_play_time : '',
        body.chp4_play_time != null ? body.chp4_play_time : '',
        clip(endingZh, 30),
        clip(body.inputted_content || JSON.stringify({whatsup:[], email:[]}), 4000),
        clip(body.archievement_list || '{}', 4000)
      ];
      // 若 start_date 空，嘗試保留原列的 start_date
      if (!row[0] && rowIdx > 0) {
        try{
          const existingStart = sheet.getRange(rowIdx, 1).getValue();
          if (existingStart) row[0] = existingStart;
        }catch(e){}
      }
      if (rowIdx > 0) {
        sheet.getRange(rowIdx, 1, 1, HEADER.length).setValues([row]);
        return jsonResponse({ok:true, action:'session_end', updated:true, row: rowIdx});
      } else {
        sheet.appendRow(row);
        return jsonResponse({ok:true, action:'session_end', appended:true, row: sheet.getLastRow()});
      }
    }

    // 兜底：未知 action，兼容舊前端誤發的零散事件（不再寫入，避免多餘列）
    // GAS 無 console，改用 Logger
    try{ Logger.log('unknown action, ignored: ' + JSON.stringify(body).slice(0,500)); }catch(e){}
    return jsonResponse({ok:false, error:'unknown action: use session_start / session_end'}, 400);

  } catch(err){
    return jsonResponse({ok:false, error: String(err)}, 500);
  } finally {
    try{ lock.releaseLock(); }catch{}
  }
}

function findRowBySessionId_(sheet, sessionId){
  try{
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return -1;
    // session_id 在第 3 欄 (1-indexed)
    const ids = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
    for (let i = 0; i < ids.length; i++) {
      if (String(ids[i][0]).trim() === String(sessionId).trim()) return i + 2;
    }
    return -1;
  }catch(e){ return -1; }
}

function jsonResponse(obj, code){
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
