import { vfs } from '../../core/vfs.js';
import { state } from '../../core/state.js';
import { escapeHtml } from '../../utils/helpers.js';

const webIndex = [
  { title: 'Java switch-case 語法詳解 — 基礎教學 (繁中)', url: 'https://java-tutorial.example/switch-case', snippet: '【switch 用法】switch 會依變數值跳到對應 case，需搭配 break 避免貫穿。範例：switch(vipLv){ case 1: price *= 0.90; break; case 2: price *= 0.85; break; case 3: price *= 0.80; break; case 4: price *= 0.75; break; case 5: price *= 0.70; break; default: break; } 注意：若缺少 break 會繼續執行下一個 case。常與 if-else 比較，適用於枚舉分級如 VIP 折扣。', type: 'web', image: null },
  { title: '【StackOverflow】VIP 等級折扣用 switch 寫，VIP1 被算成 60% 而不是 50% 該怎麼修？', url: 'https://stackoverflow.com/questions/789421/vip-discount-switch-case-wrong-percentage', snippet: '發問：我的 switch(vipLv) 中 case 1 寫成 price*=0.95，但需求是 VIP1 60%、VIP2 65%。已嘗試修改但 Sonar 仍報錯... \n回答：請將 case 1 改為 0.50、case 2 改為 0.45，並確認每個 case 都有 break。另建議抽成 Map 或 enum 避免魔法數字。 \n\n(瀏覽 2.3k, 已解決)', type: 'web', image: null },
  { title: '【StackOverflow】import.meta.env 是什麼？Vite 專案的環境變數怎麼讀取？', url: 'https://stackoverflow.com/questions/5920914/import-meta-env-meaning', snippet: '發問：請問 import.meta.env 是什麼意思？在 Vite 專案常看到 import.meta.env.VITE_API_BASE，有人可以解釋一下嗎？\n\n回答（已採納，4.1k 讚）：import.meta.env 就是讀取 .env 檔案裡的參數，Vite 會在建置時把以 VITE_ 開頭的變數注入到前端。\n\n例子：\n// .env\nVITE_API_BASE=/api\nVITE_ANALYTICS_ID=12345\nVITE_PATH=/user\n\n// src/api/client.js\nconst BASE = import.meta.env.VITE_API_BASE // → "/api"\nconst NAME = import.meta.env.VITE_ANALYTICS_ID // → "12345"\n\n注意：只有 VITE_ 開頭的才會暴露到瀏覽器，沒有前綴的（如 DATABASE_URL）只在後端生效。 (瀏覽 5.7k, 已解決)', type: 'web', image: null },
  { title: 'Sawyer Choi — 2001-10-18', url: 'https://sawyer-blog.example/2001-10-18', snippet: '2001-10-18\n\n今天和好多朋友一起玩，大家都玩得很開心。\n\n我把自己的食物分給大家吃，他們吃完都笑得很開心。我覺得只要大家在一起，好像什麼都很好玩。朋友們都說我很好笑，我也喜歡看他們笑。\n\n回家的時候，我把今天和朋友玩的事情告訴爸爸媽媽。他們聽完也很開心，還一直問我今天跟誰一起玩、玩了什麼。\n\n今天真的很好玩，我希望明天也可以和大家一起玩。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: 'Sawyer Choi — 2003-04-27', url: 'https://sawyer-blog.example/2003-04-27', snippet: '2003-04-27\n\n今天上課的時候，我拿同學的眼鏡來玩，圍繞班房一直跑假裝不會再還他，老師看到了，叫住我，問我是不是在欺負同學，還在我的手冊上寫了不好的評語。\n\n我覺得很難過。\n\n更讓我難過的是，那個同學一直什麼都沒有說。我不知道他為什麼不幫我，他不喜歡這樣嗎？但我也沒有傷害到他吧。\n\n晚上吃飯的時候，爸爸媽媽問我老師為什麼會在手冊上這樣寫，我什麼都沒有說。只是眼淚突然掉了一滴在桌上。\n\n他們沒有再問我，只是拿了一包檸檬茶給我。這是我小時候很喜歡喝的東西。\n\n可是現在我覺得它太甜了，已經不太想喝了。\n\n只是爸爸媽媽好像還不知道。他們大概還以為，我一直都很喜歡。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: 'Sawyer Choi — 2004-11-13', url: 'https://sawyer-blog.example/2004-11-13', snippet: '2004-11-13\n\n今天和表妹一起玩的時候，我不小心戳到了她的眼睛。\n\n我馬上去看她有沒有受傷，也一直看看她的眼睛有沒有怎麼樣。可是她還是跑去她爸爸那裏，一直說是我弄到她的眼睛。\n\n這時所有大人都看著我，大家都覺得是我的錯。\n\n可是我不知道要說什麼。\n\n我那一刻腦袋裏一片空白。連爸爸媽媽也沒有站在我這邊，一直在問我為什麼要這樣做，我只好一直站在那裏。\n\n那些大人的眼神，讓我覺得很不舒服。\n\n其實，這已經不是第一次有這種感覺了。\n\n（2020 年的 Sawyer 留言）\n現在回頭看，我想那時候如果我懂得先說一句「對不起」，可能事情就會簡單很多。那時候的我，好像完全沒有想到道歉會有這麼大的作用。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: 'Sawyer Choi — 2006-09-01', url: 'https://sawyer-blog.example/2006-09-01', snippet: '2006-09-01\n\n今天要去新的學校了。\n\n可是我一點都不想去。\n\n我很害怕要認識新的同學，也不知道要怎麼跟他們說話。一直想著，如果沒有人跟我做朋友怎麼辦？\n\n我甚至開始想，為什麼學生一定要去學校？\n\n想了很久，我覺得大概是因為知識對以後的人生還是很重要。至少多學一點東西，將來應該會對自己有幫助。\n\n所以，我還是會努力讀書。\n\n至於朋友……慢慢再說吧。\n\n一個人好像也沒有什麼不好。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: 'Sawyer Choi — 2007-01-11', url: 'https://sawyer-blog.example/2007-01-11', snippet: '2007-01-11\n\n沒想到，我竟然交到了比自己想像中還要多的朋友。\n\n原本以為來到新學校會很孤單，結果大家好像都很喜歡跟我一起玩。甚至連老師都覺得我是個很幽默的人。\n\n我自己也不知道，原來我這麼會逗大家笑。\n\n現在想到要回學校，好像也沒有以前那麼討厭了。\n\n有朋友一起上課、一起聊天、一起笑，學校突然變得有趣很多。\n\n看來，我之前真的想太多了。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: 'Sawyer Choi — 2007-01-12', url: 'https://sawyer-blog.example/2007-01-12', snippet: '2007-01-12\n\n今天朋友跟我分享了一個他很喜歡的歌手和他創作的歌曲。\n\n本來只是想聽聽看，結果越聽越喜歡。回到家之後，我直接把那個歌單放出來，而且越開越大聲。\n\n我聽得太投入了，完全沒有發現爸爸媽媽已經回家。\n\n直到媽媽突然說：\n\n「太難聽了吧？」\n\n我才發現原來他們早就回來了。\n\n可能真的太大聲了。\n\n還是我喜歡的事物一直都很冷門？ — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: 'Sawyer Choi — 2010-06-06', url: 'https://sawyer-blog.example/2010-06-06', snippet: '2010-06-06\n\n今天媽媽又買了一箱檸檬茶回來。\n\n看到它的時候，我突然想起以前很喜歡喝檸檬茶。\n\n小時候總覺得它很好喝，甜甜的，喝完心情也會很好。\n\n不知道為什麼，現在再看到它，突然有一種很奇怪的感覺。\n\n可能有些東西就是這樣吧。\n\n以前很喜歡的東西，長大以後不一定還會喜歡。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: 'Sawyer Choi — 2012-07-07', url: 'https://sawyer-blog.example/2012-07-07', snippet: '2012-07-07\n\n今天媽媽帶我去一間很大的辦公室，叫我簽一些文件。\n\n原來，她是在幫我辦保險。\n\n一開始我沒有想太多，只覺得大人辦事情真的很麻煩。直到後來看到保單上的資料，我才發現一件事情。\n\n我的保險受益人，是爸爸媽媽。\n\n而爸爸媽媽的保險受益人，也是我。\n\n那一刻突然有點說不出話。\n\n以前總覺得保險就是大人要處理的事情，跟自己沒有什麼關係。\n\n可是看到名字寫在一起，我才第一次很清楚地感覺到，原來我們都在替彼此想著以後。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: 'Sawyer Choi — 2013-01-01', url: 'https://sawyer-blog.example/2013-01-01', snippet: '2013-01-01\n\n美麗的天空 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: '/assets/data/files/sawyer_blog_pic.HEIC' },
  { title: 'Sawyer Choi — 2023-12-20', url: 'https://sawyer-blog.example/2023-12-20', snippet: '2023-12-20\n\n我只好做你想我做的事了 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: '廣志中學作文比賽', url: 'https://school.example/guangzhi-essay-sawyer', snippet: '廣志中學聖誕假期作文比賽二等獎穫奬學生 中五甲班 蔡梓掦', type: 'web', image: '/assets/data/files/sawyer_writing_1.png', images: ['/assets/data/files/sawyer_writing_1.png', '/assets/data/files/sawyer_writing_2.png'] },
  { title: '新聞：Sawyer 父母車禍意外 2023 — Choi Tsz Yeung', url: 'https://news.example/sawyer-parents-accident-2023', snippet: '2023 年 Sawyer Choi 父母因車禍過世，喪事期間結識 FredyArc 主辦人 Fredy，傳聞 Fredy 看中 Nori 運輸潛力。搜尋 "Sawyer Choi" 可見相關報導。', type: 'news', image: null },
];

const trends = ['switch', 'StackOverflow', 'md5'];
let activeTab = 'all'; // all | image | news | academic
let lastQuery = '';
let lastResults = [];
let lastBaseQuery = '';

// --- MD5 (correct, verified) ---
function md5(string) {
  function RotateLeft(lValue, iShiftBits) { return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits)); }
  function AddUnsigned(lX,lY) { var lX4,lY4,lX8,lY8,lResult; lX8 = (lX & 0x80000000); lY8 = (lY & 0x80000000); lX4 = (lX & 0x40000000); lY4 = (lY & 0x40000000); lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF); if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8); if (lX4 | lY4) { if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8); else return (lResult ^ 0x40000000 ^ lX8 ^ lY8); } else return (lResult ^ lX8 ^ lY8); }
  function F(x,y,z) { return (x & y) | ((~x) & z); }
  function G(x,y,z) { return (x & z) | (y & (~z)); }
  function H(x,y,z) { return (x ^ y ^ z); }
  function I(x,y,z) { return (y ^ (x | (~z))); }
  function FF(a,b,c,d,x,s,ac) { a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b,c,d), x), ac)); return AddUnsigned(RotateLeft(a,s), b); }
  function GG(a,b,c,d,x,s,ac) { a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b,c,d), x), ac)); return AddUnsigned(RotateLeft(a,s), b); }
  function HH(a,b,c,d,x,s,ac) { a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b,c,d), x), ac)); return AddUnsigned(RotateLeft(a,s), b); }
  function II(a,b,c,d,x,s,ac) { a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b,c,d), x), ac)); return AddUnsigned(RotateLeft(a,s), b); }
  function ConvertToWordArray(string) { var lWordCount; var lMessageLength = string.length; var lNumberOfWords_temp1=lMessageLength + 8; var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64; var lNumberOfWords = (lNumberOfWords_temp2+1)*16; var lWordArray=Array(lNumberOfWords-1); var lBytePosition = 0; var lByteCount = 0; while ( lByteCount < lMessageLength ) { lWordCount = (lByteCount-(lByteCount % 4))/4; lBytePosition = (lByteCount % 4)*8; lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition)); lByteCount++; } lWordCount = (lByteCount-(lByteCount % 4))/4; lBytePosition = (lByteCount % 4)*8; lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition); lWordArray[lNumberOfWords-2] = lMessageLength<<3; lWordArray[lNumberOfWords-1] = lMessageLength>>>29; return lWordArray; }
  function WordToHex(lValue) { var WordToHexValue="",WordToHexValue_temp="",lByte,lCount; for (lCount = 0;lCount<=3;lCount++) { lByte = (lValue>>>(lCount*8)) & 255; WordToHexValue_temp = "0" + lByte.toString(16); WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2); } return WordToHexValue; }
  function Utf8Encode(string) { string = string.replace(/\r\n/g,"\n"); var utftext = ""; for (var n = 0; n < string.length; n++) { var c = string.charCodeAt(n); if (c < 128) { utftext += String.fromCharCode(c); } else if((c > 127) && (c < 2048)) { utftext += String.fromCharCode((c >> 6) | 192); utftext += String.fromCharCode((c & 63) | 128); } else { utftext += String.fromCharCode((c >> 12) | 224); utftext += String.fromCharCode(((c >> 6) & 63) | 128); utftext += String.fromCharCode((c & 63) | 128); } } return utftext; }
  var x=Array(); var k,AA,BB,CC,DD,a,b,c,d; var S11=7, S12=12, S13=17, S14=22; var S21=5, S22=9 , S23=14, S24=20; var S31=4, S32=11, S33=16, S34=23; var S41=6, S42=10, S43=15, S44=21; string = Utf8Encode(string); x = ConvertToWordArray(string); a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476; for (k=0;k<x.length;k+=16) { AA=a; BB=b; CC=c; DD=d; a=FF(a,b,c,d,x[k+0], S11,0xD76AA478); d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756); c=FF(c,d,a,b,x[k+2], S13,0x242070DB); b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE); a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF); d=FF(d,a,b,c,x[k+5], S12,0x4787C62A); c=FF(c,d,a,b,x[k+6], S13,0xA8304613); b=FF(b,c,d,a,x[k+7], S14,0xFD469501); a=FF(a,b,c,d,x[k+8], S11,0x698098D8); d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF); c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1); b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE); a=FF(a,b,c,d,x[k+12],S11,0x6B901122); d=FF(d,a,b,c,x[k+13],S12,0xFD987193); c=FF(c,d,a,b,x[k+14],S13,0xA679438E); b=FF(b,c,d,a,x[k+15],S14,0x49B40821); a=GG(a,b,c,d,x[k+1], S21,0xF61E2562); d=GG(d,a,b,c,x[k+6], S22,0xC040B340); c=GG(c,d,a,b,x[k+11],S23,0x265E5A51); b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA); a=GG(a,b,c,d,x[k+5], S21,0xD62F105D); d=GG(d,a,b,c,x[k+10],S22,0x2441453); c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681); b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8); a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6); d=GG(d,a,b,c,x[k+14],S22,0xC33707D6); c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87); b=GG(b,c,d,a,x[k+8], S24,0x455A14ED); a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905); d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8); c=GG(c,d,a,b,x[k+7], S23,0x676F02D9); b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A); a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942); d=HH(d,a,b,c,x[k+8], S32,0x8771F681); c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122); b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C); a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44); d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9); c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60); b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70); a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6); d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA); c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085); b=HH(b,c,d,a,x[k+6], S34,0x04881D05); a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039); d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5); c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8); b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665); a=II(a,b,c,d,x[k+0], S41,0xF4292244); d=II(d,a,b,c,x[k+7], S42,0x432AFF97); c=II(c,d,a,b,x[k+14],S43,0xAB9423A7); b=II(b,c,d,a,x[k+5], S44,0xFC93A039); a=II(a,b,c,d,x[k+12],S41,0x655B59C3); d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92); c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D); b=II(b,c,d,a,x[k+1], S44,0x85845DD1); a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F); d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0); c=II(c,d,a,b,x[k+6], S43,0xA3014314); b=II(b,c,d,a,x[k+13],S44,0x4E0811A1); a=II(a,b,c,d,x[k+4], S41,0xF7537E82); d=II(d,a,b,c,x[k+11],S42,0xBD3AF235); c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB); b=II(b,c,d,a,x[k+9], S44,0xEB86D391); a=AddUnsigned(a,AA); b=AddUnsigned(b,BB); c=AddUnsigned(c,CC); d=AddUnsigned(d,DD); } var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d); return temp.toLowerCase(); }

function getSuggestions(q) {
  if (!q) return [];
  const low = q.toLowerCase();
  const set = new Set();
  const out = [];
  // from webIndex titles (browser only, no VFS)
  webIndex.forEach(r => {
    if (r.title.toLowerCase().includes(low) && !set.has(r.title)) { set.add(r.title); out.push({ text: r.title, kind: r.type }); }
  });
  // from history (keep)
  (state.get('searchHistory') || []).slice(-5).reverse().forEach(h => {
    if (h.q.toLowerCase().includes(low) && !set.has(h.q)) { set.add(h.q); out.push({ text: h.q, kind: 'history' }); }
  });
  return out.slice(0, 8);
}

function parseAdvanced(query) {
  let q = query;
  const filters = { site: null, filetype: null, before: null, after: null };
  // site:
  const siteM = q.match(/site:([^\s]+)/i);
  if (siteM) { filters.site = siteM[1].toLowerCase(); q = q.replace(siteM[0], '').trim(); }
  const ftM = q.match(/filetype:([^\s]+)/i);
  if (ftM) { filters.filetype = ftM[1].toLowerCase(); q = q.replace(ftM[0], '').trim(); }
  const beforeM = q.match(/before:([^\s]+)/i);
  if (beforeM) { filters.before = beforeM[1]; q = q.replace(beforeM[0], '').trim(); }
  const afterM = q.match(/after:([^\s]+)/i);
  if (afterM) { filters.after = afterM[1]; q = q.replace(afterM[0], '').trim(); }
  return { base: q.trim(), filters };
}

function isMD5Query(q) { return q.toLowerCase().includes('md5'); }
function renderMD5Tool(initialValue) {
  const c = document.getElementById('md5Tool');
  if (!c) return;
  // Hide normal search layout and detail view like entering other pages
  const layout = document.getElementById('searchLayout');
  const detail = document.getElementById('searchDetail');
  if (layout) layout.style.display = 'none';
  if (detail) { detail.style.display = 'none'; detail.innerHTML = ''; detail.classList.remove('open'); }
  // Extract value after 'md5' keyword if present, e.g. "md5 hello" -> "hello"
  let v = '';
  if (initialValue) {
    const m = initialValue.match(/md5\s*(.*)/i);
    if (m && m[1]) v = m[1].trim();
  }
  c.innerHTML = `
    <button id="md5BackBtn" class="btn detail__back" style="margin-bottom:12px">← 上一頁</button>
    <div class="md5-tool__header">
      <div class="md5-tool__title"><i class="fa-solid fa-hashtag" style="color:var(--accent)"></i> MD5 加密工具</div>
      <div class="small muted">輸入任意字串，一鍵轉換為 MD5（32 位小寫）</div>
    </div>
    <div class="md5-tool__body">
      <div class="md5-panel">
        <label class="md5-panel__label">輸入</label>
        <textarea id="md5Input" class="md5-panel__textarea" placeholder="在此輸入要轉換的字串...">${v.replace(/</g,'&lt;')}</textarea>
      </div>
      <button id="md5ConvertBtn" class="md5-convert-btn" title="轉換" aria-label="轉換">
        <i class="fa-solid fa-right-left"></i>
      </button>
      <div class="md5-panel">
        <label class="md5-panel__label">輸出 (MD5)</label>
        <textarea id="md5Output" class="md5-panel__textarea" placeholder="轉換結果將顯示於此" readonly></textarea>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button id="md5CopyBtn" class="btn small">複製</button>
          <button id="md5ClearBtn" class="btn small">清空</button>
        </div>
      </div>
    </div>
  `;
  c.style.display = 'block';
  const input = document.getElementById('md5Input');
  const output = document.getElementById('md5Output');
  const convert = document.getElementById('md5ConvertBtn');
  const copy = document.getElementById('md5CopyBtn');
  const clear = document.getElementById('md5ClearBtn');
  function doConvert() {
    const val = input.value;
    if (!val) { output.value = ''; output.placeholder = '請先輸入字串'; return; }
    try { output.value = md5(val); } catch(e) { output.value = '轉換失敗'; }
  }
  convert?.addEventListener('click', doConvert);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); doConvert(); } });
  copy?.addEventListener('click', async () => {
    if (!output.value) return;
    try { await navigator.clipboard.writeText(output.value); copy.textContent = '已複製'; setTimeout(()=> copy.textContent='複製', 1500); } catch { output.select(); document.execCommand('copy'); }
  });
  clear?.addEventListener('click', () => { input.value=''; output.value=''; input.focus(); });
  document.getElementById('md5BackBtn')?.addEventListener('click', () => {
    c.style.display = 'none';
    c.innerHTML = '';
    const layout2 = document.getElementById('searchLayout');
    if (layout2) layout2.style.display = '';
    // restore last non-md5 search if available
    const inp = document.getElementById('searchInput');
    if (inp) { inp.value = ''; }
  });
  // Auto convert if initial value provided
  if (v) { input.value = v; doConvert(); }
}

function highlightSnippet(text, query) {
  if (!query) return escapeHtml(text);
  const esc = escapeHtml(text);
  const terms = query.split(/\s+/).filter(Boolean).slice(0, 3);
  let out = esc;
  terms.forEach(t => {
    const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    out = out.replace(re, '<mark>$1</mark>');
  });
  return out;
}

export function mountSearch() {
  const root = document.getElementById('view-search');
  if (!root) return;
  root.innerHTML = `
    <div class="search">
      <div class="search__header">
        <div class="search__logo">Sear<span>ch</span></div>
        <div class="search__bar">
          <input id="searchInput" class="input" placeholder="輸入關鍵詞，如 switch" autocomplete="off" />
          <button id="searchBtn" class="btn primary">搜尋</button>
          <div id="suggestBox" class="suggest-box"></div>
        </div>
      </div>
      <div class="search__suggest">
        <span class="chip" data-q="switch">switch</span>
        <span class="chip" data-q="StackOverflow">StackOverflow</span>
      </div>
      <div class="search__tabs" role="tablist">
        <button class="search__tab active" data-tab="all">全部</button>
        <button class="search__tab" data-tab="image">圖片</button>
        <button class="search__tab" data-tab="news">新聞</button>
        <button class="search__tab" data-tab="academic">學術</button>
      </div>
      <div id="md5Tool" class="md5-tool" style="display:none"></div>
      <div id="searchViewContainer">
        <div id="searchLayout" class="search__layout">
          <div class="search__main">
            <div id="searchResults"></div>
            <div id="searchAdvancedHint" class="small muted" style="margin-top:8px"></div>
          </div>
          <div class="search__side">
            <div class="search__history">
              <h4>搜尋歷史</h4>
              <div id="searchHistoryList"></div>
            </div>
          </div>
        </div>
        <div id="searchDetail" class="search__detail-view" style="display:none"></div>
      </div>
    </div>
  `;
  bindSearch();
  renderHistory();
  renderTrends();
  doSearch('');
}

function bindSearch() {
  const input = document.getElementById('searchInput');
  const box = document.getElementById('suggestBox');
  input?.addEventListener('input', e => {
    const q = e.target.value;
    const sug = getSuggestions(q);
    if (!q || !sug.length) { box.classList.remove('open'); box.innerHTML = ''; return; }
    box.innerHTML = sug.map(s => `<div class="suggest-item" data-q="${escapeHtml(s.text)}"><span>${escapeHtml(s.text)}</span><span class="small">${s.kind}</span></div>`).join('');
    box.classList.add('open');
    box.querySelectorAll('.suggest-item').forEach(el => el.addEventListener('click', () => {
      input.value = el.dataset.q;
      box.classList.remove('open');
      doSearch(el.dataset.q);
    }));
  });
  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { document.getElementById('suggestBox')?.classList.remove('open'); doSearch(e.target.value); }
    if (e.key === 'Escape') document.getElementById('suggestBox')?.classList.remove('open');
    if (e.key === 'ArrowDown') {
      const first = document.querySelector('#suggestBox .suggest-item');
      if (first) { e.preventDefault(); first.classList.add('active'); input.value = first.dataset.q; }
    }
  });
  input?.addEventListener('blur', () => setTimeout(()=> box?.classList.remove('open'), 150));
  document.getElementById('searchBtn')?.addEventListener('click', () => doSearch(document.getElementById('searchInput').value));
  document.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => doSearch(c.dataset.q)));
  document.querySelectorAll('.search__tab').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.search__tab').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      activeTab = b.dataset.tab;
      doSearch(lastQuery || 'Sawyer');
    });
  });
}

function renderHistory() {
  const el = document.getElementById('searchHistoryList');
  if (!el) return;
  const hist = (state.get('searchHistory') || []).slice(-8).reverse();
  if (!hist.length) { el.innerHTML = '<div class="small muted">尚無歷史</div>'; return; }
  el.innerHTML = hist.map(h => `<div class="history-item" data-q="${escapeHtml(h.q)}"><span>${escapeHtml(h.q)}</span><span class="small">${new Date(h.at).toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'})}</span></div>`).join('');
  el.querySelectorAll('.history-item').forEach(n => n.addEventListener('click', () => doSearch(n.dataset.q)));
}

function renderTrends() {
  const el = document.getElementById('searchTrendList');
  if (!el) return;
  el.innerHTML = trends.map(t => `<div class="trend-item" data-q="${escapeHtml(t)}"><span>🔥 ${escapeHtml(t)}</span><span class="small">›</span></div>`).join('');
  el.querySelectorAll('.trend-item').forEach(n => n.addEventListener('click', () => doSearch(n.dataset.q)));
}

function doSearch(q) {
  const input = document.getElementById('searchInput');
  if (input && q) input.value = q;
  const raw = (q || '').trim();
  if (!raw) return;
  lastQuery = raw;
  // Hash priority over MD5: if query contains dark web hash, handle as portal (but remind to use intranet)
  if (raw.includes('hash=')) {
    if (raw.includes('f665a7117959b667b7f283eaebf69cae')) {
      const c = document.getElementById('searchResults');
      if (c) {
        // Show hint that dark web URL should be entered in normal intranet, not browser search
        showResultsView();
        c.innerHTML = `<div class="card" style="padding:16px"><div class="small muted">此為暗網路徑的 hash，請至 <b>正常內網</b> 搜尋框輸入完整 URL：<br><code style="word-break:break-all">https://nori-intranet/internal/portal?hash=f665a7117959b667b7f283eaebf69cae</code><br><br>提示：可在 Vizual Studio Code 的 Git Graph 找到 <code>generateSecretPath</code> 歷史與 <code>.env.example</code> 的 key，自行組合 md5。</div></div>`;
        // Still push to history and hide md5 tool
        const md5C = document.getElementById('md5Tool');
        if (md5C) { md5C.style.display = 'none'; md5C.innerHTML = ''; }
        state.push('searchHistory', { q: raw, at: new Date().toISOString() });
        renderHistory();
        return;
      }
    }
    // For other hash queries, treat as normal search (don't trigger md5 tool)
  }
  // MD5 tool: show when query contains md5 — hide history/trends/portal like entering other pages
  const md5Container = document.getElementById('md5Tool');
  if (isMD5Query(raw)) {
    renderMD5Tool(raw);
    state.push('searchHistory', { q: raw, at: new Date().toISOString() });
    renderHistory();
    // Hide normal results layout is already handled in renderMD5Tool, return early to avoid showing results below tool
    return;
  } else {
    if (md5Container) { md5Container.style.display = 'none'; md5Container.innerHTML = ''; }
    // Ensure normal layout is visible when not md5
    const layout = document.getElementById('searchLayout');
    if (layout) layout.style.display = '';
  }
  state.push('searchHistory', { q: raw, at: new Date().toISOString() });
  // Phase 6 flags via search behavior
  if (raw.toLowerCase().includes('package') || raw.toLowerCase().includes('image')) state.setFlag('reverse_image_done', true);
  if (raw.toLowerCase().includes('shell') || raw.toLowerCase().includes('site:nori')) state.setFlag('found_shell_company', true);
  if (raw.toLowerCase().includes('drink') || raw.toLowerCase().includes('nori')) state.setFlag('found_supplier', true);
  renderHistory();
  const { base, filters } = parseAdvanced(raw);
  lastBaseQuery = base;
  const hint = document.getElementById('searchAdvancedHint');
  if (hint) {
    const parts = [];
    if (filters.site) parts.push(`site:${filters.site}`);
    if (filters.filetype) parts.push(`filetype:${filters.filetype}`);
    if (filters.before) parts.push(`before:${filters.before}`);
    if (filters.after) parts.push(`after:${filters.after}`);
    hint.textContent = parts.length ? `進階語法生效：${parts.join(' · ')} ｜ 基礎查詢：${base || '(空)'}` : '';
  }

  let results = [];
  // web index match (filtered by tab)
  for (const r of webIndex) {
    if (activeTab !== 'all' && r.type !== activeTab) continue;
    const target = (r.title + ' ' + r.snippet + ' ' + r.url).toLowerCase();
    const kw = base.toLowerCase();
    const match = !base || target.includes(kw) || base.split(/\s+/).some(k => target.includes(k.toLowerCase()));
    if (!match) continue;
    if (filters.site && !r.url.toLowerCase().includes(filters.site)) continue;
    // filetype only applies to vfs, skip web for filetype mismatch? keep web if not filetype
    if (filters.filetype && r.type === 'image' && filters.filetype !== 'image') continue;
    results.push(r);
  }
  // VFS search removed: searching engine is browser only, not including Vizual Studio Code files
  // (previously searched vfs, now disabled per spec)

  // tab filter already, but for image tab ensure image results shown
  if (activeTab === 'image') {
    // if no image results, fallback to show web image placeholder
    if (!results.some(r=>r.image)) {
      // keep as is, will show empty
    }
  }

  lastResults = results.slice(0, 12);
  const c = document.getElementById('searchResults');
  if (!c) return;
  // ensure we are in results view when doing a new search
  showResultsView();
  if (!lastResults.length) {
    c.innerHTML = `<div class="muted small" style="margin-top:12px">無結果 — 嘗試 "Sawyer" 或 <code>filetype:js</code> 或 <code>site:nori.internal</code></div>`;
    return;
  }
  c.innerHTML = lastResults.map((r, idx) => `
    <div class="result" data-idx="${idx}">
      <div class="result__title" data-open="${idx}">${escapeHtml(r.title)}</div>
      <div class="result__url">${escapeHtml(r.url)}</div>
      <div class="result__snippet">${highlightSnippet(r.snippet, base)}</div>
      <div class="result__meta">
        <span class="result__tag">${r.type}</span>
        ${filters.site ? `<span class="result__tag">site:${filters.site}</span>` : ''}
        ${filters.filetype ? `<span class="result__tag">filetype:${filters.filetype}</span>` : ''}
      </div>
      ${r.image ? `<div class="result__image"><img src="${r.image}" alt="preview" loading="lazy" /></div>` : ''}
      <div class="result__actions">
        <span class="result__snap" data-open="${idx}">開啟</span>
      </div>
    </div>
  `).join('');
  c.querySelectorAll('[data-open]').forEach(el => el.addEventListener('click', () => {
    const idx = Number(el.dataset.open);
    const item = lastResults[idx];
    if (!item) return;
    if (item.url.startsWith('file://') || item.url.startsWith('/customer-portal')) {
      const p = item.url.replace('file://','');
      if (vfs.exists(p)) { state.setFlag('found_code_map', true); }
      // also dispatch event for VSCode integration
      const ev = new CustomEvent('search:openFile', { detail: p });
      window.dispatchEvent(ev);
    }
    openDetail(idx);
  }));
}

function showResultsView() {
  const md5C = document.getElementById('md5Tool');
  if (md5C) { md5C.style.display = 'none'; md5C.innerHTML = ''; }
  const layout = document.getElementById('searchLayout');
  const detail = document.getElementById('searchDetail');
  if (layout) layout.style.display = '';
  if (detail) { detail.style.display = 'none'; detail.innerHTML = ''; detail.classList.remove('open'); }
  // scroll search container to top
  const searchEl = document.querySelector('.search');
  if (searchEl) searchEl.scrollTop = 0;
  const viewSearch = document.getElementById('view-search');
  if (viewSearch) viewSearch.scrollTop = 0;
}

function openDetail(idx) {
  const item = lastResults[idx];
  if (!item) return;
  const md5C = document.getElementById('md5Tool');
  if (md5C) { md5C.style.display = 'none'; md5C.innerHTML = ''; }
  const layout = document.getElementById('searchLayout');
  const detail = document.getElementById('searchDetail');
  if (!layout || !detail) return;
  layout.style.display = 'none';
  detail.style.display = 'block';
  detail.classList.add('open');

  // try to get full content if it's a VFS file
  let fullContent = '';
  let vfsPath = null;
  if (item.url.startsWith('/customer-portal') || item.url.startsWith('file://')) {
    vfsPath = item.url.replace('file://','');
    const file = vfs.getFile(vfsPath);
    if (file && typeof file.content === 'string') {
      fullContent = file.content;
      // also trigger read for flags
      vfs.readFile(vfsPath);
    }
  } else if (vfs.exists(item.url)) {
    vfsPath = item.url;
    const file = vfs.getFile(vfsPath);
    if (file && typeof file.content === 'string') fullContent = file.content;
  }
  // if it's a webIndex item that maps to a VFS file via title, try lookup
  if (!fullContent && item.title.startsWith('/customer-portal')) {
    const file = vfs.getFile(item.title);
    if (file && typeof file.content === 'string') fullContent = file.content;
  }

  const displayContent = fullContent || item.snippet || '無內容';
  const isSawyerBlog = item.url.includes('sawyer-blog.example');
  if (isSawyerBlog) {
    const allBlogs = webIndex.filter(r => r.url.includes('sawyer-blog.example')).sort((a,b) => a.url.localeCompare(b.url));
    const otherBlogs = allBlogs.filter(b => b.url !== item.url);
    detail.innerHTML = `
      <button id="searchBackBtn" class="btn detail__back">← 上一頁</button>
      <div class="detail__sawyer-grid" style="display:grid;grid-template-columns:1fr 260px;gap:16px;align-items:start;min-width:0;max-width:100%;overflow:hidden">
        <div class="detail__card" style="min-width:0;max-width:100%;overflow:hidden">
          <h2 class="detail__title" style="word-break:break-word;overflow-wrap:anywhere">${escapeHtml(item.title)}</h2>
          <div class="detail__url" style="word-break:break-all;overflow-wrap:anywhere">${escapeHtml(item.url)}</div>
          ${item.image ? `<div class="detail__image"><img src="${escapeHtml(item.image)}" alt="preview" onerror="this.src='https://via.placeholder.com/320x180?text=Sawyer+2013-01-01'" style="max-width:100%" /></div>` : ''}
          <div class="detail__snippet" style="white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere">${highlightSnippet(displayContent, lastBaseQuery)}</div>
          ${fullContent ? `<pre class="detail__pre">${escapeHtml(fullContent)}</pre>` : ''}
          <div class="result__meta" style="margin-top:12px">
            <span class="result__tag">${item.type}</span>
          </div>
        </div>
        <div class="card" style="padding:12px;position:sticky;top:12px;min-width:0;max-width:100%;overflow:hidden">
          <h4 style="margin:0 0 8px;font-size:13px;font-weight:700">其他部落格</h4>
          <div style="display:grid;gap:6px;min-width:0">
            ${otherBlogs.map(b => `<div class="sawyer-blog-link" data-url="${escapeHtml(b.url)}" style="padding:8px;border:1px solid var(--border);border-radius:6px;cursor:pointer;background:var(--bg-primary);font-size:12px;line-height:1.4;min-width:0;max-width:100%;overflow:hidden"><div style="font-weight:600;color:var(--fg-primary);word-break:break-word;overflow-wrap:anywhere;white-space:normal">${escapeHtml(b.title)}</div><div class="small muted" style="margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;max-width:100%">${escapeHtml(b.snippet.slice(0,40))}...</div></div>`).join('')}
          </div>
        </div>
      </div>
    `;
    // Bind other blogs clicks - directly open the correct blog page
    detail.querySelectorAll('.sawyer-blog-link').forEach(el => {
      el.addEventListener('click', () => {
        const url = el.dataset.url;
        const blog = webIndex.find(r => r.url === url);
        if (blog) {
          // Set lastResults to single blog and open detail correctly (avoid webIndex vs lastResults index mismatch)
          lastResults = [blog];
          // Keep lastBaseQuery as the blog title for highlighting
          lastBaseQuery = blog.title;
          openDetail(0);
        }
      });
    });
  } else {
    // For Guangzhi essay, show two images vertically if images array exists
    const imagesHtml = item.images ? item.images.map(src => `<div class="detail__image"><img src="${escapeHtml(src)}" alt="preview" style="width:100%;display:block" onerror="this.src='https://via.placeholder.com/320x480?text=Sawyer+Writing'" /></div>`).join('') : (item.image ? `<div class="detail__image"><img src="${escapeHtml(item.image)}" alt="preview" onerror="this.src='https://via.placeholder.com/320x180?text=Preview'" /></div>` : '');
    detail.innerHTML = `
      <button id="searchBackBtn" class="btn detail__back">← 上一頁</button>
      <div class="detail__card">
        <h2 class="detail__title">${escapeHtml(item.title)}</h2>
        <div class="detail__url">${escapeHtml(item.url)}</div>
        ${imagesHtml}
        <div class="detail__snippet">${highlightSnippet(displayContent, lastBaseQuery)}</div>
        ${fullContent ? `<pre class="detail__pre">${escapeHtml(fullContent)}</pre>` : ''}
        <div class="result__meta" style="margin-top:12px">
          <span class="result__tag">${item.type}</span>
        </div>
      </div>
    `;
  }
  detail.querySelector('#searchBackBtn')?.addEventListener('click', () => showResultsView());
  // scroll to top of search
  const searchEl = document.querySelector('.search');
  if (searchEl) searchEl.scrollTop = 0;
  const viewSearch = document.getElementById('view-search');
  if (viewSearch) viewSearch.scrollTop = 0;
  detail.scrollIntoView({ behavior: 'auto', block: 'start' });
}
