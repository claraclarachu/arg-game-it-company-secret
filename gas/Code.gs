/**
 * arg-game-it-company-secret — Google Apps Script + Sheets 追蹤後端
 * 部署為 Web App (執行身分: 我 / 存取權: 所有人) 後，複製 exec URL 貼到前端 analytics.js 或 localStorage cc_gas_url
 * 試算表欄位: timestamp | session_id | event_type | chapter | playtime | lang | ua | url | whatsapp_chat_id | whatsapp_chat_name | whatsapp_to | whatsapp_preview | whatsapp_hash | whatsapp_len | email_title | email_to | email_body_preview | email_body_hash | email_body_len | ending | endings | payload_json
 */

const SHEET_NAME = 'game_events';

function getSpreadsheet_(){
  // 優先容器綁定（擴充功能 → Apps Script），若為獨立專案則嘗試用 ScriptProperties 的 SHEET_ID
  let ss = null;
  try{ ss = SpreadsheetApp.getActiveSpreadsheet(); }catch(e){}
  if(ss) return ss;
  try{
    const props = PropertiesService.getScriptProperties();
    const id = props.getProperty('SHEET_ID');
    if(id) return SpreadsheetApp.openById(id);
  }catch(e){}
  // 最後嘗試：若此專案曾綁定過，先拋出明確錯誤
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

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.tryLock(10000);
  } catch(err){}
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ok:false, error:'empty body: 請用 Content-Type: text/plain 發送 JSON'}, 400);
    }
    let body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch(err){
      return jsonResponse({ok:false, error:'invalid json: ' + String(err)}, 400);
    }
    // 限長保護 (單筆 8KB 內)
    const rawLen = e.postData.contents.length;
    if (rawLen > 8000) {
      body._truncated = true;
      if (body.payload_json) body.payload_json = String(body.payload_json).slice(0, 4000);
    }
    const ss = getSpreadsheet_();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['timestamp','session_id','event_type','chapter','playtime','lang','ua','url','whatsapp_chat_id','whatsapp_chat_name','whatsapp_to','whatsapp_preview','whatsapp_hash','whatsapp_len','email_title','email_to','email_body_preview','email_body_hash','email_body_len','ending','endings','payload_json']);
      sheet.setFrozenRows(1);
    }
    const row = [
      body.timestamp || new Date().toISOString(),
      body.session_id || '',
      body.event_type || '',
      body.chapter != null ? body.chapter : '',
      body.playtime != null ? body.playtime : '',
      body.lang || '',
      (body.ua || '').toString().slice(0,200),
      (body.url || '').toString().slice(0,300),
      body.whatsapp_chat_id || '',
      body.whatsapp_chat_name || '',
      body.whatsapp_to || '',
      (body.whatsapp_preview || '').toString().slice(0,80),
      body.whatsapp_hash || '',
      body.whatsapp_len != null ? body.whatsapp_len : '',
      body.email_title || '',
      (body.email_to || '').toString().slice(0,100),
      (body.email_body_preview || '').toString().slice(0,80),
      body.email_body_hash || '',
      body.email_body_len != null ? body.email_body_len : '',
      body.ending || '',
      (body.endings || '').toString().slice(0,200),
      (body.payload_json || '').toString().slice(0,4000)
    ];
    sheet.appendRow(row);
    return jsonResponse({ok:true});
  } catch(err){
    return jsonResponse({ok:false, error: String(err)}, 500);
  } finally {
    try{ lock.releaseLock(); }catch{}
  }
}

function jsonResponse(obj, code){
  // GAS 的 ContentService 不支援自訂 statusCode，前端以 JSON ok 判斷
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
