import { vfs } from '../../core/vfs.js';
import { state } from '../../core/state.js';
import { escapeHtml } from '../../utils/helpers.js';
import '../../../css/blog.css';
import '../../../css/school.css';

const webIndex = [
  { title: 'Java switch-case 語法詳解 — 基礎教學 (繁中)', url: 'https://java-tutorial.example/switch-case', snippet: '【switch 用法】switch 會依變數值跳到對應 case，需搭配 break 避免貫穿。範例：switch(vipLv){ case 1: price *= 0.90; break; case 2: price *= 0.85; break; case 3: price *= 0.80; break; case 4: price *= 0.75; break; case 5: price *= 0.70; break; default: break; } 注意：若缺少 break 會繼續執行下一個 case。常與 if-else 比較，適用於枚舉分級如 VIP 折扣。', type: 'web', image: null },
  { title: '【StackOverflow】VIP 等級折扣用 switch 寫，VIP1 被算成 60% 而不是 50% 該怎麼修？', url: 'https://stackoverflow.com/questions/789421/vip-discount-switch-case-wrong-percentage', snippet: '發問：我的 switch(vipLv) 中 case 1 寫成 price*=0.95，但需求是 VIP1 60%、VIP2 65%。已嘗試修改但 Sonar 仍報錯... \n回答：請將 case 1 改為 0.50、case 2 改為 0.45，並確認每個 case 都有 break。另建議抽成 Map 或 enum 避免魔法數字。 \n\n(瀏覽 2.3k, 已解決)', type: 'web', image: null },
  { title: '【StackOverflow】import.meta.env 是什麼？Vite 專案的環境變數怎麼讀取？', url: 'https://stackoverflow.com/questions/5920914/import-meta-env-meaning', snippet: '發問：請問 import.meta.env 是什麼意思？在 Vite 專案常看到 import.meta.env.VITE_API_BASE，有人可以解釋一下嗎？\n\n回答（已採納，4.1k 讚）：import.meta.env 就是讀取 .env 檔案裡的參數，Vite 會在建置時把以 VITE_ 開頭的變數注入到前端。\n\n例子：\n// .env\nVITE_API_BASE=/api\nVITE_ANALYTICS_ID=12345\nVITE_PATH=/user\n\n// src/api/client.js\nconst BASE = import.meta.env.VITE_API_BASE // → "/api"\nconst NAME = import.meta.env.VITE_ANALYTICS_ID // → "12345"\n\n注意：只有 VITE_ 開頭的才會暴露到瀏覽器，沒有前綴的（如 DATABASE_URL）只在後端生效。 (瀏覽 5.7k, 已解決)', type: 'web', image: null },
  { title: 'Sawyer Choi — 2001-10-18', url: 'https://sawyer-blog.example/2001-10-18', snippet: '2001-10-18\n\n今天和好多朋友一起玩，大家都玩得很開心。\n\n我把自己的食物分給大家吃，他們吃完都笑得很開心。我覺得只要大家在一起，好像什麼都很好玩。朋友們都說我很好笑，我也喜歡看他們笑。\n\n回家的時候，我把今天和朋友玩的事情告訴爸爸媽媽。他們聽完也很開心，還一直問我今天跟誰一起玩、玩了什麼。\n\n今天真的很好玩，我希望明天也可以和大家一起玩。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: 'Sawyer Choi — 2003-04-27', url: 'https://sawyer-blog.example/2003-04-27', snippet: '2003-04-27\n\n今天上課的時候，我拿同學的眼鏡來玩，圍繞班房一直跑假裝不會再還他，老師看到了，叫住我，問我是不是在欺負同學，還在我的手冊上寫了不好的評語。\n\n我覺得很難過。\n\n更讓我難過的是，那個同學一直什麼都沒有說。我不知道他為什麼不幫我，他不喜歡這樣嗎？但我也沒有傷害到他吧。\n\n晚上吃飯的時候，爸爸媽媽問我老師為什麼會在手冊上這樣寫，我什麼都沒有說。只是眼淚突然掉了一滴在桌上。\n\n他們沒有再問我，只是拿了一包檸檬茶給我。這是我小時候很喜歡喝的東西。\n\n可是現在我覺得它太甜了，已經不太想喝了。\n\n只是爸爸媽媽好像還不知道。他們大概還以為，我一直都很喜歡。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: 'Sawyer Choi — 2004-11-13', url: 'https://sawyer-blog.example/2004-11-13', snippet: '2004-11-13\n\n今天和表妹一起玩的時候，我不小心戳到了她的眼睛。\n\n我馬上去看她有沒有受傷，也一直看看她的眼睛有沒有怎麼樣。可是她還是跑去她爸爸那裏，一直說是我弄到她的眼睛。\n\n這時所有大人都看著我，大家都覺得是我的錯。\n\n可是我不知道要說什麼。\n\n我那一刻腦袋空白。連爸爸媽媽也沒有站在我這邊，一直在問我為什麼要這樣做，我只好一直站在那裏。\n\n那些大人的眼神，讓我覺得很不舒服。\n\n其實，這已經不是第一次有這種感覺了。— Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: 'Sawyer Choi — 2006-09-01', url: 'https://sawyer-blog.example/2006-09-01', snippet: '2006-09-01\n\n今天要去新的學校了。\n\n可是我一點都不想去。\n\n我很害怕要認識新的同學，也不知道要怎麼跟他們說話。一直想著，如果沒有人跟我做朋友怎麼辦？\n\n我甚至開始想，為什麼學生一定要去學校？\n\n想了很久，我覺得大概是因為知識對以後的人生還是很重要。至少多學一點東西，將來應該會對自己有幫助。\n\n所以，我還是會努力讀書。\n\n至於朋友……慢慢再說吧。\n\n一個人好像也沒有什麼不好。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: 'Sawyer Choi — 2007-01-11', url: 'https://sawyer-blog.example/2007-01-11', snippet: '2007-01-11\n\n沒想到，我竟然交到了比自己想像中還要多的朋友。\n\n原本以為來到新學校會很孤單，結果大家好像都很喜歡跟我一起玩。甚至連老師都覺得我是個很幽默的人。\n\n我自己也不知道，原來我這麼會逗大家笑。\n\n現在想到要回學校，好像也沒有以前那麼討厭了。\n\n有朋友一起上課、一起聊天、一起笑，學校突然變得有趣很多。\n\n看來，我之前真的想太多了。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: 'Sawyer Choi — 2007-01-12', url: 'https://sawyer-blog.example/2007-01-12', snippet: '2007-01-12\n\n今天朋友跟我分享了一個他很喜歡的歌手和他創作的歌曲。\n\n本來只是想聽聽看，結果越聽越喜歡。回到家之後，我直接把那個歌單放出來，而且越開越大聲。\n\n我聽得太投入了，完全沒有發現爸爸媽媽已經回家。\n\n直到媽媽突然說：\n\n「太難聽了吧？」\n\n我才發現原來他們早就回來了。\n\n可能真的太大聲了。\n\n還是我喜歡的事物一直都很冷門？ — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: 'Sawyer Choi — 2010-06-06', url: 'https://sawyer-blog.example/2010-06-06', snippet: '2010-06-06\n\n今天媽媽又買了一箱檸檬茶回來。\n\n看到它的時候，我突然想起以前很喜歡喝檸檬茶。\n\n小時候總覺得它很好喝，甜甜的，喝完心情也會很好。\n\n不知道為什麼，現在再看到它，突然有一種很奇怪的感覺。\n\n可能有些東西就是這樣吧。\n\n以前很喜歡的東西，長大以後不一定還會喜歡。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: 'Sawyer Choi — 2012-07-07', url: 'https://sawyer-blog.example/2012-07-07', snippet: '2012-07-07\n\n今天媽媽帶我去一間很大的辦公室，叫我簽一些文件。\n\n原來，她是在幫我辦保險。\n\n一開始我沒有想太多，只覺得大人辦事情真的很麻煩。直到後來看到保單上的資料，我才發現一件事情。\n\n我的保險受益人，是爸爸媽媽。\n\n而爸爸媽媽的保險受益人，也是我。\n\n那一刻突然有點說不出話。\n\n以前總覺得保險就是大人要處理的事情，跟自己沒有什麼關係。\n\n可是看到名字寫在一起，我才第一次很清楚地感覺到，原來我們都在替彼此想著以後。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: 'Sawyer Choi — 2013-01-01', url: 'https://sawyer-blog.example/2013-01-01', snippet: '2013-01-01\n\n美麗的天空 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: '/assets/data/files/sawyer_blog_pic.HEIC' },
  { title: 'Sawyer Choi — 2023-12-20', url: 'https://sawyer-blog.example/2023-12-20', snippet: '2023-12-20\n\nI will do what you want me to do — Sawyer Choi / Choi Tsz Yeung 蔡梓掦', type: 'web', image: null },
  { title: '廣志中學作文比賽', url: 'https://school.example/guangzhi-essay-sawyer', snippet: '廣志中學聖誕假期作文比賽二等獎穫奬學生 中五甲班 蔡梓掦', type: 'web', image: '/assets/data/files/sawyer_writing_1.png', images: ['/assets/data/files/sawyer_writing_1.png', '/assets/data/files/sawyer_writing_2.png'] },
  { title: '新聞：夫婦平和道遇車禍雙亡　29歲兒子獲大額保險賠償', url: 'https://news.example/car-accident-2023', snippet: '【本報訊】\n\n2023年，一對夫婦在平和道發生嚴重交通事故，兩人最終不幸離世。意外發生後，29歲兒子成為相關保險賠償的主要受益人，據悉獲得一筆大額賠償。\n事故發生於2023年某日，涉事夫婦當時途經平和道，期間與另一輛車輛發生碰撞。救援人員接報後迅速趕抵現場，惟兩人傷勢嚴重，經搶救後仍證實不治。\n夫婦突然離世，令家人深受打擊。其29歲兒子在處理父母身後事及相關法律程序期間，亦需要面對保險索償及遺產安排等一系列問題。\n據了解，涉事夫婦生前曾購買多份保險，當中包括人壽及意外保障。由於兩人同時因意外身故，符合相關保單的賠償條件，兒子最終獲得一筆金額可觀的保險賠償。\n值得一提的是，意外發生地點附近一幢大樓由某集團旗下公司持有。集團創辦人 Fredy 得悉事件後表示深感惋惜，並對夫婦突然離世表示哀痛。Fredy其後決定向其遺屬提供一筆私人捐贈，希望在其面對家庭變故及生活壓力之際，提供一些實際援助。\nFredy表示，意外雖然令人惋惜，但更重要的是希望社會能夠在有需要時互相扶持，因此決定以個人名義向死者家屬伸出援手。至於捐贈的具體金額，則未有對外公布。\n有保險業人士指出，保險賠償金額取決於保單種類、投保額、受益人安排及事故是否符合保障條款等因素，不能單純以事故造成的死亡推算實際賠償金額。\n這宗意外亦再次引起社會對道路安全及家庭保障的關注。對不少家庭而言，突如其來的交通事故不僅帶來無法彌補的傷痛，亦可能造成長期的經濟影響。社會人士呼籲駕駛者時刻保持警覺，同時及早做好家庭保障及財務規劃。\n', type: 'news', image: null },
];

// ── BlogWorld 平台資料 (全域部落格網絡) ──
const blogAuthors = {
  sawyer: { id:'sawyer', name:'Sawyer Choi', handle:'@sawyerchoi', displayName:'Sawyer Choi / 蔡梓掦', bio:'喜歡把日常小事寫成文字的人。從2001年開始在 BlogWorld 記錄生活，覺得能把想法寫下來，好像就能更理解自己一點。', avatar:'/lemon_tea.jpg', cover:'/lemon_tea.jpg', followers: 842, following: 37, joined:'2001-10-01', verified:false },
  mary: { id:'mary', name:'Mary Chen', handle:'@marychen', displayName:'Mary Chen · 陳曉玲', bio:'旅遊 × 攝影 × 生活手帳。走過 27 個城市，喜歡在咖啡香裡寫明信片。', avatar:'https://i.pravatar.cc/150?u=mary', cover:'https://picsum.photos/seed/marycover/900/240', followers: 12430, following: 210, joined:'2018-03-12', verified:true },
  peter: { id:'peter', name:'Peter Lin', handle:'@peterlin', displayName:'Peter Lin · 林柏安', bio:'後端工程師 / 開源愛好者。分享 Python、NAS、自架服務與踩坑筆記。', avatar:'https://i.pravatar.cc/150?u=peter', cover:'https://picsum.photos/seed/petercover/900/240', followers: 8930, following: 96, joined:'2019-07-20', verified:true },
  paul: { id:'paul', name:'Paul Wang', handle:'@paulwang', displayName:'Paul Wang · 王志豪', bio:'台南胃、台北心。專門挖掘巷弄美食與手沖咖啡，記錄每一口幸福。', avatar:'https://i.pravatar.cc/150?u=paul', cover:'https://picsum.photos/seed/paulcover/900/240', followers: 15600, following: 143, joined:'2017-11-05', verified:true },
  emma: { id:'emma', name:'Emma Wu', handle:'@emmaw', displayName:'Emma Wu · 吳思敏', bio:'底片攝影 / 極地旅人。想用快門留住光線的溫度。', avatar:'https://i.pravatar.cc/150?u=emma', cover:'https://picsum.photos/seed/emmacover/900/240', followers: 6720, following: 78, joined:'2020-01-18', verified:false },
  david: { id:'david', name:'David Chang', handle:'@davidchang', displayName:'David Chang · 張大衛', bio:'黑膠收藏家 / Live House 常客。寫音樂，也寫城市的聲音。', avatar:'https://i.pravatar.cc/150?u=david', cover:'https://picsum.photos/seed/davidcover/900/240', followers: 4210, following: 52, joined:'2019-09-03', verified:false },
};

const blogArticles = [
  // Sawyer (10 篇，沿用 webIndex 內容並補齊詮釋資料)
  { url:'https://sawyer-blog.example/2001-10-18', title:'Sawyer Choi — 2001-10-18', excerpt:'今天和好多朋友一起玩，大家都玩得很開心。我把自己的食物分給大家吃，他們笑得很開心。', content:'2001-10-18\n\n今天和好多朋友一起玩，大家都玩得很開心。\n\n我把自己的食物分給大家吃，他們吃完都笑得很開心。我覺得只要大家在一起，好像什麼都很好玩。朋友們都說我很好笑，我也喜歡看他們笑。\n\n回家的時候，我把今天和朋友玩的事情告訴爸爸媽媽。他們聽完也很開心，還一直問我今天跟誰一起玩、玩了什麼。\n\n今天真的很好玩，我希望明天也可以和大家一起玩。', authorId:'sawyer', date:'2001-10-18', views:3420, likes:128, topic:'成長', tags:['童年','友情','日常'], cover:null },
  { url:'https://sawyer-blog.example/2003-04-27', title:'Sawyer Choi — 2003-04-27', excerpt:'拿同學的眼鏡來玩，被老師寫了不好的評語。更難過的是，那個同學什麼都沒有說。', content:'2003-04-27\n\n今天上課的時候，我拿同學的眼鏡來玩，圍繞班房一直跑假裝不會再還他，老師看到了，叫住我，問我是不是在欺負同學，還在我的手冊上寫了不好的評語。\n\n我覺得很難過。\n\n更讓我難過的是，那個同學一直什麼都沒有說。我不知道他為什麼不幫我，他不喜歡這樣嗎？但我也沒有傷害到他吧。\n\n晚上吃飯的時候，爸爸媽媽問我老師為什麼會在手冊上這樣寫，我什麼都沒有說。只是眼淚突然掉了一滴在桌上。\n\n他們沒有再問我，只是拿了一包檸檬茶給我。這是我小時候很喜歡喝的東西。\n\n可是現在我覺得它太甜了，已經不太想喝了。\n\n只是爸爸媽媽好像還不知道。他們大概還以為，我一直都很喜歡。', authorId:'sawyer', date:'2003-04-27', views:8920, likes:342, topic:'成長', tags:['學校','成長','檸檬茶'], cover:'/lemon_tea.jpg' },
  { url:'https://sawyer-blog.example/2004-11-13', title:'Sawyer Choi — 2004-11-13', excerpt:'不小心戳到表妹的眼睛，所有大人都看著我。那一刻腦袋一片空白。', content:'2004-11-13\n\n今天和表妹一起玩的時候，我不小心戳到了她的眼睛。\n\n我馬上去看她有沒有受傷，也一直看看她的眼睛有沒有怎麼樣。可是她還是跑去她爸爸那裏，一直說是我弄到她的眼睛。\n\n這時所有大人都看著我，大家都覺得是我的錯。\n\n可是我不知道要說什麼。\n\n我那一刻腦袋裏一片空白。連爸爸媽媽也沒有站在我這邊，一直在問我為什麼要這樣做，我只好一直站在那裏。\n\n那些大人的眼神，讓我覺得很不舒服。\n\n其實，這已經不是第一次有這種感覺了。', authorId:'sawyer', date:'2004-11-13', views:15600, likes:721, topic:'家庭', tags:['家庭','道歉','成長'], cover:null },
  { url:'https://sawyer-blog.example/2006-09-01', title:'Sawyer Choi — 2006-09-01', excerpt:'要去新的學校了，卻一點都不想去。很害怕要認識新的同學，也不知道要怎麼跟他們說話。', content:'2006-09-01\n\n今天要去新的學校了。\n\n可是我一點都不想去。\n\n我很害怕要認識新的同學，也不知道要怎麼跟他們說話。一直想著，如果沒有人跟我做朋友怎麼辦？\n\n我甚至開始想，為什麼學生一定要去學校？\n\n想了很久，我覺得大概是因為知識對以後的人生還是很重要。至少多學一點東西，將來應該會對自己有幫助。\n\n所以，我還是會努力讀書。\n\n至於朋友……慢慢再說吧。\n\n一個人好像也沒有什麼不好。', authorId:'sawyer', date:'2006-09-01', views:5210, likes:198, topic:'校園', tags:['學校','孤獨','成長'], cover:null },
  { url:'https://sawyer-blog.example/2007-01-11', title:'Sawyer Choi — 2007-01-11', excerpt:'沒想到，竟然交到了比自己想像中還要多的朋友。原來我這麼會逗大家笑。', content:'2007-01-11\n\n沒想到，我竟然交到了比自己想像中還要多的朋友。\n\n原本以為來到新學校會很孤單，結果大家好像都很喜歡跟我一起玩。甚至連老師都覺得我是個很幽默的人。\n\n我自己也不知道，原來我這麼會逗大家笑。\n\n現在想到要回學校，好像也沒有以前那麼討厭了。\n\n有朋友一起上課、一起聊天、一起笑，學校突然變得有趣很多。\n\n看來，我之前真的想太多了。', authorId:'sawyer', date:'2007-01-11', views:23400, likes:1024, topic:'校園', tags:['友情','校園','幽默'], cover:null },
  { url:'https://sawyer-blog.example/2007-01-12', title:'Sawyer Choi — 2007-01-12', excerpt:'朋友分享的歌手越聽越喜歡，開得太大聲被媽媽說「太難聽了吧？」', content:'2007-01-12\n\n今天朋友跟我分享了一個他很喜歡的歌手和他創作的歌曲。\n\n本來只是想聽聽看，結果越聽越喜歡。回到家之後，我直接把那個歌單放出來，而且越開越大聲。\n\n我聽得太投入了，完全沒有發現爸爸媽媽已經回家。\n\n直到媽媽突然說：\n\n「太難聽了吧？」\n\n我才發現原來他們早就回來了。\n\n可能真的太大聲了。\n\n還是我喜歡的事物一直都很冷門？', authorId:'sawyer', date:'2007-01-12', views:18700, likes:843, topic:'音樂', tags:['音樂','家庭','成長'], cover:null },
  { url:'https://sawyer-blog.example/2010-06-06', title:'Sawyer Choi — 2010-06-06', excerpt:'媽媽又買了一箱檸檬茶。以前很喜歡，現在卻覺得太甜了。可能有些東西長大後就不一樣了。', content:'2010-06-06\n\n今天媽媽又買了一箱檸檬茶回來。\n\n看到它的時候，我突然想起以前很喜歡喝檸檬茶。\n\n小時候總覺得它很好喝，甜甜的，喝完心情也會很好。\n\n不知道為什麼，現在再看到它，突然有一種很奇怪的感覺。\n\n可能有些東西就是這樣吧。\n\n以前很喜歡的東西，長大以後不一定還會喜歡。', authorId:'sawyer', date:'2010-06-06', views:9800, likes:412, topic:'家庭', tags:['檸檬茶','成長','家庭'], cover:'/lemon_tea.jpg' },
  { url:'https://sawyer-blog.example/2012-07-07', title:'Sawyer Choi — 2012-07-07', excerpt:'媽媽帶我去辦保險，才發現彼此的受益人都是對方。那一刻才感覺到，原來我們都在替彼此想著以後。', content:'2012-07-07\n\n今天媽媽帶我去一間很大的辦公室，叫我簽一些文件。\n\n原來，她是在幫我辦保險。\n\n一開始我沒有想太多，只覺得大人辦事情真的很麻煩。直到後來看到保單上的資料，我才發現一件事情。\n\n我的保險受益人，是爸爸媽媽。\n\n而爸爸媽媽的保險受益人，也是我。\n\n那一刻突然有點說不出話。\n\n以前總覺得保險就是大人要處理的事情，跟自己沒有什麼關係。\n\n可是看到名字寫在一起，我才第一次很清楚地感覺到，原來我們都在替彼此想著以後。', authorId:'sawyer', date:'2012-07-07', views:12300, likes:567, topic:'家庭', tags:['保險','家庭','成長'], cover:null },
  { url:'https://sawyer-blog.example/2013-01-01', title:'Sawyer Choi — 2013-01-01', excerpt:'美麗的天空', content:'2013-01-01\n\n美麗的天空', authorId:'sawyer', date:'2013-01-01', views:7600, likes:310, topic:'攝影', tags:['天空','攝影','日常'], cover:'/assets/data/files/sawyer_blog_pic.HEIC' },
  { url:'https://sawyer-blog.example/2023-12-20', title:'Sawyer Choi — 2023-12-20', excerpt:'我只好做你想我做的事了', content:'2023-12-20\n\nI will do what you want me to do', authorId:'sawyer', date:'2023-12-20', views:99, likes:1, topic:'心情', tags:[], cover:null },
  // Mary
  { url:'https://mary-blog.example/kyoto-sakura-2024', title:'京都賞櫻七日散策 — 從哲學之道到嵐山小火車', excerpt:'沿著哲學之道慢慢走，櫻花像雪一樣落在肩頭。嵐山小火車穿過山谷那一刻，我明白了什麼叫「一期一會」。', content:'三月底的京都，櫻花比預報早開了兩天。\n\n第一天我從哲學之道開始，整條小徑兩側都是染井吉野櫻，風一吹，花瓣像細雪一樣落下。有位老婆婆坐在長椅上摺紙鶴，她說每年都會來這裡看一次櫻花，已經三十年了。\n\n第二天搭嵐山小火車，車廂是開放式的，山谷的風直接吹在臉上。保津川的水很清，偶爾能看到一兩隻鷺鷥站在石頭上。\n\n最喜歡的是傍晚在鴨川邊發呆，看著情侶、學生、上班族各自走過，像是一部沒有劇本的電影。\n\n旅行教我的事：不用趕行程，慢慢走反而能看見更多。', authorId:'mary', date:'2024-04-02', views:8900, likes:523, topic:'旅遊', tags:['京都','櫻花','旅行'], cover:'https://picsum.photos/seed/kyoto/600/400' },
  { url:'https://mary-blog.example/one-person-kitchen', title:'一人廚房：三道十分鐘上菜的下班療癒料理', excerpt:'下班後不想叫外送？這三道菜只要十分鐘，連洗碗都很快。給獨居的你，也給想好好吃飯的自己。', content:'獨居第三年，我終於學會不把「煮飯」當成壓力。\n\n第一道：蒜香櫛瓜炒蝦仁。櫛瓜切薄片，大火快炒，加一點檸檬汁就很清爽。\n\n第二道：番茄豆腐味噌湯。把所有材料丟進鍋子，五分鐘就能喝到熱湯，配白飯就很滿足。\n\n第三道：半熟蛋拌菠菜。菠菜燙一下、擠乾水份，和半熟蛋、醬油、芝麻油拌在一起，超下飯。\n\n一個人吃飯，也可以很隆重。點一盞燈，擺好碗筷，為自己好好煮一頓飯，就是對今天最溫柔的收尾。', authorId:'mary', date:'2024-03-15', views:12400, likes:812, topic:'美食', tags:['料理','一人食','療癒'], cover:'https://picsum.photos/seed/cooking/600/400' },
  { url:'https://mary-blog.example/danshari-half-year', title:'斷捨離半年後，我學會的五件小事', excerpt:'丟掉 120 公斤的東西後，房間變大了，心也變輕了。原來不需要的東西，遠比想像中多。', content:'去年冬天，我決定把房間裡超過一年沒用的東西全部清掉。\n\n結果清出了 18 袋垃圾、7 箱回收，和一整櫃沒穿過的衣服。\n\n半年後，我發現：\n1. 衣櫃只剩 30 件衣服，反而每天更好搭配。\n2. 桌子空了，工作更專心。\n3. 不再衝動購物，存下的錢去了一趟小旅行。\n4. 打掃從兩小時變成二十分鐘。\n5. 最重要的是，學會問自己：這真的是我需要的嗎？\n\n斷捨離不是丟東西，是重新選擇留下什麼。', authorId:'mary', date:'2023-11-20', views:6700, likes:401, topic:'生活', tags:['斷捨離','生活','成長'], cover:'https://picsum.photos/seed/danshari/600/400' },
  // Peter
  { url:'https://peter-blog.example/python-one-year', title:'自學 Python 一年的踩坑筆記：從爬蟲到自動化報表', excerpt:'從 print("Hello") 到每天自動跑的報表腳本，這一年我踩過的坑，希望你不用再踩一次。', content:'一年前，我連 pip 是什麼都不知道。\n\n第一個月：跟著官方教學寫爬蟲，結果被網站的反爬蟲封 IP，學會了加 header、睡隨機秒數。\n\n第三個月：開始用 pandas 處理公司每週的 Excel 報表，本來要花兩小時手動整理，現在一個指令就完成，主管以為我加班，其實我在喝咖啡。\n\n第六個月：踩到最大坑——編碼。CSV 用 excel 開啟全是亂碼，後來才知道要存成 utf-8-sig。\n\n給新手的建議：不要追求一次學會所有套件，先解決一個實際問題，你會學得更快。', authorId:'peter', date:'2024-02-10', views:15600, likes:923, topic:'科技', tags:['Python','自學','效率'], cover:'https://picsum.photos/seed/python/600/400' },
  { url:'https://peter-blog.example/vim-vs-vscode', title:'Vim vs VSCode：我最後為什麼還是回到 Vim', excerpt:'用了三年 VSCode，我還是回到了 Vim。不是因為情懷，而是因為手指不想離開鍵盤。', content:'VSCode 很棒，外掛多、介面美、什麼都能做。但我發現自己一直在用滑鼠。\n\n回到 Vim 之後，我重新設定了 .vimrc，把常用操作都綁成快捷鍵。現在寫程式，眼睛不用離開螢幕，手也不用離開鍵盤。\n\n當然，Vim 的學習曲線很陡，前兩週我每天都在查 cheat sheet。但一旦肌肉記憶形成，效率真的會回不去。\n\n結論：沒有最好的編輯器，只有最適合你手指的編輯器。', authorId:'peter', date:'2023-09-18', views:8200, likes:412, topic:'科技', tags:['Vim','VSCode','工具'], cover:'https://picsum.photos/seed/vim/600/400' },
  { url:'https://peter-blog.example/nas-ds220', title:'家用 NAS 入門：Synology DS220+ 開箱與備份策略', excerpt:'照片、影片、文件散落在各個硬碟？一台 NAS 幫我把十年的回憶全部收好，還能自動備份。', content:'買 DS220+ 之前，我的照片分散在三顆外接硬碟、一台舊筆電和雲端。\n\n安裝比想像中簡單，插上兩顆 4TB 硬碟，照著精靈設定，半小時就完成。\n\n我設了三層備份：\n1. 手機照片自動同步到 NAS\n2. NAS 每週備份到外接硬碟\n3. 重要文件再同步一份到雲端\n\n最有感的是，再也不怕手機丟了照片就不見。所有的回憶，都在自己家裡好好存著。', authorId:'peter', date:'2023-06-12', views:4300, likes:210, topic:'科技', tags:['NAS','備份','開箱'], cover:'https://picsum.photos/seed/nas/600/400' },
  // Paul
  { url:'https://paul-blog.example/tainan-beef-soup', title:'台南牛肉湯全攻略：在地人帶路的五間深夜食堂', excerpt:'凌晨三點的台南，牛肉湯的蒸氣比路燈還溫暖。這五間，是我吃過十年後還會想念的味道。', content:'台南的牛肉湯不是湯，是溫體牛肉用熱湯沖出來的甜。\n\n第一間：文章牛肉湯。觀光客很多，但品質穩定，肉片厚、湯頭清甜。\n\n第二間：六千牛肉湯。凌晨三點去排隊，點頭尾，牛肉的油花最漂亮。\n\n第三間：無名小攤（海安路）。沒有招牌，只有一個阿伯和五張桌子，但湯頭用了大量蔬果熬，喝起來最溫潤。\n\n吃牛肉湯的秘訣：不要加太多調味，先喝原味，再試米酒和薑絲。', authorId:'paul', date:'2024-01-28', views:20300, likes:1340, topic:'美食', tags:['台南','牛肉湯','深夜食堂'], cover:'https://picsum.photos/seed/beefsoup/600/400' },
  { url:'https://paul-blog.example/hand-drip-coffee', title:'手沖咖啡入門：從選豆到水溫的實驗筆記', excerpt:'同樣的豆子，水溫差 5 度，風味就完全不同。這半年，我記錄了 30 次沖煮的失敗與成功。', content:'開始手沖後，我才知道原來水溫這麼重要。\n\n93 度：酸度明亮，適合淺焙的花果香。\n88 度：甜感突出，堅果、巧克力味更明顯。\n83 度：口感最平順，但香氣會少一點。\n\n我現在的配方：20g 豆子、300ml 水、93 度、分三次注水，總時間 2:30。\n\n最有趣的是，同样的豆子，每次沖出來都不太一樣。像在跟豆子對話一樣。', authorId:'paul', date:'2023-10-14', views:11200, likes:687, topic:'美食', tags:['咖啡','手沖','實驗'], cover:'https://picsum.photos/seed/coffee/600/400' },
  { url:'https://paul-blog.example/keelung-night-market', title:'基隆夜市隱藏版：13號攤的碳烤三明治為何排一小時也值得', excerpt:'沒有招牌、沒有菜單，只有三種口味。老闆說：我只做我覺得好吃的。', content:'基隆廟口夜市第13號攤，沒有名字。\n\n只有碳烤三明治、豬排三明治、火腿三明治三種。麵包是老闆自己烤的，炭火香很足，裡面夾的蛋是半熟的，咬下去會流出來。\n\n排隊要一小時，但老闆不急。每份都慢慢烤、慢慢夾，好像在做什麼儀式。\n\n我問他為什麼不請人？他說：請人味道就不一樣了。\n\n有時候，好吃不是因為技巧，是因為堅持。', authorId:'paul', date:'2023-08-05', views:5400, likes:321, topic:'美食', tags:['夜市','基隆','三明治'], cover:'https://picsum.photos/seed/sandwich/600/400' },
  // Emma
  { url:'https://emma-blog.example/contax-t2-taipei', title:'底片日常：用 Contax T2 記錄台北的黃昏', excerpt:'數位很方便，但底片的等待讓每一張都更珍惜。這些黃昏，都是等了三天才看到的顏色。', content:'Contax T2 是我存了半年才買的。\n\n第一次帶它出門，是在台北的河濱公園。黃昏的光很 мяг，整個城市都變成金色的。\n\n底片最迷人的地方是，你永遠不知道會拍到什麼。對焦有點慢、曝光有點不可控，但洗出來那一刻的驚喜，是數位給不了的。\n\n最近最喜歡的一張，是在公館的巷子裡，一隻貓坐在機車上睡覺，後面是剛亮起的路燈。', authorId:'emma', date:'2024-03-22', views:7400, likes:445, topic:'攝影', tags:['底片','台北','黃昏'], cover:'https://picsum.photos/seed/contax/600/400' },
  { url:'https://emma-blog.example/iceland-aurora', title:'冰島極光追逐記：三晚未眠終於等到的綠光', excerpt:'零下十五度、風大到站不穩，第三晚凌晨兩點，天空突然像被打翻的螢光顏料。', content:'在冰島的前兩晚，雲層都很厚，導遊說機率不到 10%。\n\n第三晚，我們開到一個完全沒有光害的湖邊。車外零下十五度，風大到門都打不開。\n\n等到凌晨兩點，雲突然散開，一道綠光慢慢從天邊暈開，然後變成整片天空的舞動。\n\n那一刻，所有人都安靜了。只聽得到快門聲和自己的呼吸。\n\n原來極光不是「看到」，是「等到」。', authorId:'emma', date:'2023-12-08', views:15800, likes:892, topic:'旅遊', tags:['冰島','極光','旅行'], cover:'https://picsum.photos/seed/aurora/600/400' },
  // David
  { url:'https://david-blog.example/vinyl-jazz-20', title:'黑膠回潮：我收藏的二十張必聽爵士入門', excerpt:'從 Miles Davis 到 Chet Baker，這二十張黑膠是我十年來反覆聽、還是不會膩的起點。', content:'第一張黑膠是 Miles Davis 的 Kind of Blue，在二手店用 300 元買的。\n\n從此入坑。\n\n我選這二十張的標準：旋律要美、錄音要好、半夜聽不會吵醒鄰居。\n\n最推薦的三張：\n1. Chet Baker - My Funny Valentine (深夜必聽)\n2. Bill Evans - Waltz for Debby (適合雨天)\n3. Norah Jones - Come Away With Me (最溫柔的入門)\n\n黑膠的炒豆聲，一開始覺得是雜訊，後來覺得是陪伴。', authorId:'david', date:'2024-02-28', views:3300, likes:201, topic:'音樂', tags:['黑膠','爵士','收藏'], cover:'https://picsum.photos/seed/vinyl/600/400' },
  { url:'https://david-blog.example/livehouse-map', title:'獨立樂團現場：從 Legacy 到小地方的聲音地圖', excerpt:'在 Live House 裡，音樂是立體的。你能感覺到鼓點打在胸口，吉他聲從腳底震上來。', content:'第一次去 Legacy 是大學時，看落日飛車。那時候還不知道什麼叫「現場」，只覺得音響好大聲。\n\n後來才懂，現場的迷人之處在於不完美。主唱破音、吉他走調，但那種「此刻只有這裡」的感覺，是專線裡聽不到的。\n\n我整理了台北五間最愛的 Live House：\nLegacy、The Wall、小地方、Revolver、海邊的卡夫卡。\n\n每一間的味道都不同，但都一樣吵、一樣熱、一樣讓人想再去一次。', authorId:'david', date:'2023-07-19', views:5100, likes:298, topic:'音樂', tags:['LiveHouse','獨立樂團','現場'], cover:'https://picsum.photos/seed/livehouse/600/400' },
];

const blogComments = {
  'https://sawyer-blog.example/2001-10-18': [
    { user:'小雯', avatar:'https://i.pravatar.cc/150?u=xiaowen', time:'2001-10-19 08:12', text:'Sawyer 小時候就這麼會分享，難怪大家都喜歡跟你玩！', likes:3 },
    { user:'阿哲', avatar:'https://i.pravatar.cc/150?u=azhe', time:'2002-02-11 14:33', text:'把食物分給大家那段好可愛，感覺能想像那個畫面。', likes:1 },
  ],
  'https://sawyer-blog.example/2003-04-27': [
  ],
  'https://sawyer-blog.example/2004-11-13': [
    { user:'Sawyer Choi', avatar:'/lemon_tea.jpg', time:'2020-01-02 11:20', text:'現在回頭看，我想那時候如果我懂得先說一句「對不起」，可能事情就會簡單很多。那時候的我，好像完全沒有想到道歉會有這麼大的作用。', likes:0 }
  ],
  'https://sawyer-blog.example/2006-09-01': [
    { user:'同樣轉學過的人', avatar:'https://i.pravatar.cc/150?u=transfer', time:'2007-02-14 10:22', text:'我也經歷過轉學，那種害怕我懂。後來真的會慢慢變好的。', likes:9 },
    { user:'學長', avatar:'', time:'2008-09-01 07:30', text:'「一個人也沒有什麼不好」這句話那時候的你一定很努力在說服自己吧。', likes:6 },
  ],
  'https://sawyer-blog.example/2007-01-11': [
    { user:'同班同學', avatar:'https://i.pravatar.cc/150?u=classmate', time:'2007-01-12 08:40', text:'紫菜羊真的超好笑！', likes:2 },
    { user:'Sawyer Choi', avatar:'/lemon_tea.jpg', time:'2007-01-12 09:40', text:'你才紫菜羊!！', likes:2 },
    { user:'Mary Chen', avatar:'https://i.pravatar.cc/150?u=mary', time:'2010-01-03 09:20', text:'幽默感真的是一種天賦，能讓大家開心是很厲害的事。', likes:8 },
  ],
  'https://sawyer-blog.example/2007-01-12': [
    { user:'音樂同好', avatar:'https://i.pravatar.cc/150?u=music', time:'2007-01-20 16:00', text:'被說難聽一定很受傷吧，但喜歡的東西本來就很主觀。', likes:11 },
    { user:'David Chang', avatar:'https://i.pravatar.cc/150?u=david', time:'2024-02-20 21:10', text:'冷門才珍貴啊，來聽聽我推薦的黑膠，說不定你會喜歡！', likes:3 },
  ],
  'https://sawyer-blog.example/2010-06-06': [
  ],
  'https://sawyer-blog.example/2012-07-07': [
  ],
  'https://sawyer-blog.example/2013-01-01': [
    { user:'Emma Wu', avatar:'https://i.pravatar.cc/150?u=emma', time:'2014-03-23 07:12', text:'Beautiful sky~', likes:6 },
    { user:'攝影同好', avatar:'', time:'2015-01-05 22:10', text:'這張天空的顏色好美，和我用底片拍的黃昏好像。', likes:2 },
  ],
  'https://sawyer-blog.example/2023-12-20': [
  ],
  'https://mary-blog.example/kyoto-sakura-2024': [
    { user:'櫻花控', avatar:'', time:'2024-04-03 08:12', text:'哲學之道真的必去！我去年也走過，感動到哭。', likes:14 },
    { user:'嵐山粉', avatar:'', time:'2024-04-04 12:30', text:'小火車那段寫得太好了，風的感覺都寫出來了。', likes:6 },
  ],
  'https://mary-blog.example/one-person-kitchen': [
    { user:'獨居新手', avatar:'', time:'2024-03-16 19:00', text:'今晚就試蒜香櫛瓜！謝謝分享，感覺真的很簡單。', likes:21 },
    { user:'料理苦手', avatar:'', time:'2024-03-17 08:22', text:'半熟蛋拌菠菜看起來好好吃，已收藏。', likes:9 },
  ],
  'https://mary-blog.example/danshari-half-year': [
    { user:'整理控', avatar:'', time:'2023-11-22 10:10', text:'我也想試斷捨離，但每次都捨不得丟...', likes:5 },
  ],
  'https://peter-blog.example/python-one-year': [
    { user:'Python 新手', avatar:'', time:'2024-02-11 09:00', text:'utf-8-sig 那個坑我也踩過！太有共鳴了。', likes:33 },
    { user:'工程師', avatar:'', time:'2024-02-12 14:20', text:'自動化報表那段太實用了，已經分享給同事。', likes:12 },
  ],
  'https://paul-blog.example/tainan-beef-soup': [
    { user:'台南人', avatar:'', time:'2024-01-29 07:30', text:'六千真的要凌晨去排，但絕對值得！', likes:18 },
    { user:'吃貨', avatar:'', time:'2024-01-30 12:44', text:'收藏了，下次去台南照著吃！', likes:9 },
  ],
  'https://paul-blog.example/hand-drip-coffee': [
    { user:'咖啡新手', avatar:'', time:'2023-10-15 09:12', text:'93 度和 88 度真的差很多，學到了！', likes:11 },
  ],
  'https://emma-blog.example/contax-t2-taipei': [
    { user:'底片同好', avatar:'', time:'2024-03-23 10:00', text:'T2 真的是一台會讓人愛上的相機。', likes:7 },
  ],
  'https://emma-blog.example/iceland-aurora': [
    { user:'追光者', avatar:'', time:'2023-12-09 22:33', text:'等到極光那刻的安靜，我完全能想像。', likes:15 },
  ],
  'https://david-blog.example/vinyl-jazz-20': [
    { user:'爵士新手', avatar:'', time:'2024-03-01 20:10', text:'已加入購物車，謝謝推薦！', likes:4 },
  ],
  'https://david-blog.example/livehouse-map': [
    { user:'現場控', avatar:'', time:'2023-07-20 11:22', text:'小地方真的很棒，推推！', likes:6 },
  ],
};

const trends = ['switch'];
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

// ── BlogWorld helpers ──
function formatViews(n){
  if (n >= 10000) return (n/10000).toFixed(1) + '萬';
  if (n >= 1000) return (n/1000).toFixed(1) + 'k';
  return String(n);
}
function getBlogArticle(url){ return blogArticles.find(a=>a.url===url) || null; }
function getBlogAuthor(id){ return blogAuthors[id] || null; }
function getAuthorArticles(authorId){ return blogArticles.filter(a=>a.authorId===authorId).sort((a,b)=> b.views - a.views); }
function getRecommendedFor(article){
  const sameAuthor = blogArticles.filter(a=>a.authorId===article.authorId && a.url!==article.url).sort((a,b)=>b.views-a.views).slice(0,2);
  let sameTopic = blogArticles.filter(a=>a.topic===article.topic && a.url!==article.url && a.authorId!==article.authorId);
  // 若同 topic 不足，補相似 tags
  if (sameTopic.length < 3){
    const extra = blogArticles.filter(a=> a.url!==article.url && !sameAuthor.includes(a) && !sameTopic.includes(a) && a.tags.some(t=> article.tags.includes(t)));
    sameTopic = [...sameTopic, ...extra];
  }
  sameTopic = sameTopic.slice(0,3);
  let rec = [...sameAuthor, ...sameTopic];
  if (rec.length < 5){
    const fill = blogArticles.filter(a=> a.url!==article.url && !rec.includes(a)).sort(()=>0.5 - Math.random()).slice(0, 5 - rec.length);
    rec = rec.concat(fill);
  }
  return rec.slice(0,5);
}
function blogHeaderHtml(active){
  return `
    <div class="blog-header">
      <div class="blog-header__logo" data-blog-home>
        <div class="blog-header__logo-mark">B</div>
        <div class="blog-header__logo-text"><b>BlogWorld</b><span>全球部落格 · 博誌</span></div>
      </div>
      <nav class="blog-header__nav">
        <a data-blog-nav="home" class="${active==='home'?'active':''}">首頁</a>
        <a data-blog-nav="trending" class="${active==='trending'?'active':''}">排行榜</a>
        <a data-blog-nav="following">追蹤</a>
      </nav>
      <div class="blog-header__spacer"></div>
      <div class="blog-header__search"><i class="fa-solid fa-magnifying-glass"></i><input placeholder="搜尋部落格文章、作者..." readonly /></div>
      <div class="blog-header__actions">
        <button class="blog-back-top" data-blog-back-search><i class="fa-solid fa-arrow-left"></i> 回到搜尋</button>
        <button class="blog-header__btn primary">登入</button>
      </div>
    </div>
  `;
}
function bindBlogHeader(detail){
  detail.querySelector('[data-blog-home]')?.addEventListener('click', ()=> openBlogHome());
  detail.querySelectorAll('[data-blog-nav]').forEach(el=>{
    el.addEventListener('click', ()=>{
      if (el.dataset.blogNav==='home' || el.dataset.blogNav==='trending') openBlogHome();
    });
  });
  detail.querySelector('[data-blog-back-search]')?.addEventListener('click', ()=> showResultsView());
}
function openBlogHome(){
  const detail = document.getElementById('searchDetail');
  const layout = document.getElementById('searchLayout');
  if (!detail || !layout) return;
  layout.style.display='none';
  detail.style.display='block';
  detail.classList.add('open');
  const md5C = document.getElementById('md5Tool');
  if (md5C){ md5C.style.display='none'; md5C.innerHTML=''; }
  // 推薦欄：依瀏覽數排序的熱門 + 編輯精選
  const featured = [...blogArticles].sort((a,b)=>b.views-a.views).slice(0,1)[0];
  const trending = [...blogArticles].sort((a,b)=>b.views-a.views).slice(1,4);
  const recommended = [...blogArticles].sort(()=>0.5-Math.random()).slice(0,6);
  const editorsPick = recommended.slice(0,6);
  const hotAuthors = Object.values(blogAuthors).sort((a,b)=>b.followers-a.followers).slice(0,4);
  detail.innerHTML = `
    <div class="blog-platform">
      ${blogHeaderHtml('home')}
      <div class="blog-body">
        <div class="blog-home__hero">
          <div style="max-width:1120px;margin:0 auto;">
            <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px">
              <span class="blog-back-top" data-blog-back-search style="background:var(--blog-accent-bg);border-color:#ffd8c2;color:#d45a1f"><i class="fa-solid fa-arrow-left"></i> 回到搜尋結果</span>
            </div>
            <h1 class="blog-home__hero-title">在 <span>BlogWorld</span> 發現世界的聲音</h1>
            <p class="blog-home__hero-desc">全球部落格平台 · 收錄超過 120 萬篇創作。這裡有旅遊手帳、程式筆記、深夜食堂、底片日常與每個人的小宇宙。</p>
            <div class="blog-home__hero-meta">
              <span class="blog-home__hero-tag"><i class="fa-solid fa-fire" style="color:var(--blog-accent)"></i> 本週熱門</span>
              <span class="blog-home__hero-tag"><i class="fa-solid fa-star" style="color:#ffb347"></i> 編輯精選</span>
              <span class="blog-home__hero-tag"><i class="fa-solid fa-users"></i> 追蹤作者</span>
              <span class="blog-home__hero-stats"><span><b>1.2M</b> 篇文章</span><span><b>86k</b> 位作者</span><span><b>320</b> 種話題</span></span>
            </div>
          </div>
        </div>
        <div class="blog-home__layout">
          <div class="blog-home__main">
            <div class="blog-featured">
              <div class="blog-featured__main" data-blog-url="${escapeHtml(featured.url)}">
                <div class="blog-card__cover"><img src="${escapeHtml(featured.cover || `https://picsum.photos/seed/${featured.authorId}feat/600/400`)}" alt="" onerror="this.src='https://picsum.photos/600/400?random=1'" />
                  <span class="blog-card__cover-tag"><i class="fa-solid fa-crown" style="color:#ffb347"></i> 今日精選</span></div>
                <div class="blog-card__body">
                  <div class="blog-card__title" style="font-size:17px;min-height:auto">${escapeHtml(featured.title)}</div>
                  <div class="blog-card__excerpt">${escapeHtml(featured.excerpt)}</div>
                  <div class="blog-card__meta"><span class="blog-card__author"><img src="${escapeHtml(getBlogAuthor(featured.authorId).avatar)}" alt="" />${escapeHtml(getBlogAuthor(featured.authorId).displayName)}</span><span class="blog-card__dot"></span><span>${escapeHtml(featured.date)}</span><span class="blog-card__dot"></span><span><i class="fa-solid fa-eye"></i> ${formatViews(featured.views)}</span></div>
                </div>
              </div>
              <div class="blog-featured__list">
                ${trending.map(a=>`
                  <div class="blog-mini" data-blog-url="${escapeHtml(a.url)}">
                    <img src="${escapeHtml(a.cover || `https://picsum.photos/seed/${a.authorId}mini/200/200`)}" alt="" onerror="this.src='https://picsum.photos/600/400?random=2'" />
                    <div style="flex:1;min-width:0">
                      <div class="blog-mini__title">${escapeHtml(a.title)}</div>
                      <div class="blog-mini__meta"><span>${escapeHtml(getBlogAuthor(a.authorId).displayName.split('·')[0].trim())}</span><span>·</span><span><i class="fa-solid fa-eye"></i> ${formatViews(a.views)}</span></div>
                      <div class="blog-mini__meta" style="margin-top:2px"><span style="padding:1px 6px;border-radius:999px;background:var(--blog-accent-bg);border:1px solid #ffd8c2;color:#d45a1f;font-size:10px;font-weight:700">${escapeHtml(a.topic)}</span></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="blog-section__head"><h3><i class="fa-solid fa-heart"></i> 為你推薦</h3><a data-blog-more>查看更多</a></div>
            <div class="blog-grid">
              ${editorsPick.map(a=>`
                <div class="blog-card" data-blog-url="${escapeHtml(a.url)}">
                  <div class="blog-card__cover"><img src="${escapeHtml(a.cover || `https://picsum.photos/seed/${a.url.slice(-6)}/600/400`)}" alt="" onerror="this.src='https://picsum.photos/600/400?random=3'" /><span class="blog-card__cover-tag">${escapeHtml(a.topic)}</span></div>
                  <div class="blog-card__body">
                    <div class="blog-card__title">${escapeHtml(a.title)}</div>
                    <div class="blog-card__excerpt">${escapeHtml(a.excerpt)}</div>
                    <div class="blog-card__meta"><span class="blog-card__author"><img src="${escapeHtml(getBlogAuthor(a.authorId).avatar)}" alt="" />${escapeHtml(getBlogAuthor(a.authorId).name)}</span><span class="blog-card__dot"></span><span>${escapeHtml(a.date)}</span><span class="blog-card__dot"></span><span><i class="fa-solid fa-eye"></i> ${formatViews(a.views)}</span></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="blog-home__side">
            <div class="blog-widget">
              <h4><i class="fa-solid fa-user-group"></i> 熱門作者</h4>
              <div class="blog-author-list">
                ${hotAuthors.map(au=>`
                  <div class="blog-author-row" data-blog-author="${escapeHtml(au.id)}">
                    <img src="${escapeHtml(au.avatar)}" alt="" />
                    <div style="flex:1;min-width:0"><b>${escapeHtml(au.displayName)}</b><div style="font-size:11px;color:#9aa0a6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(au.bio.slice(0,32))}…</div></div>
                    <span style="font-size:11px;color:#9aa0a6">${formatViews(au.followers)} 追蹤</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="blog-widget">
              <h4><i class="fa-solid fa-hashtag"></i> 熱門話題</h4>
              <div class="blog-tag-cloud">
                ${['旅遊','美食','科技','攝影','音樂','生活','成長','校園','家庭'].map(t=>`<span class="blog-tag" data-blog-tag="${escapeHtml(t)}"># ${escapeHtml(t)}</span>`).join('')}
              </div>
            </div>
            <div class="blog-widget" style="background:linear-gradient(135deg,#fff7ef 0%, #fff 100%)">
              <h4><i class="fa-solid fa-lightbulb"></i> 關於 BlogWorld</h4>
              <p style="font-size:12.5px;line-height:1.7;color:#5b6572;margin:0">BlogWorld 是全球筆記網絡，收錄每個人的日常與思考。點擊任意文章可進入閱讀，或前往作者主頁查看他最受歡迎的作品。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  bindBlogHeader(detail);
  detail.querySelector('[data-blog-back-search]')?.addEventListener('click', ()=> showResultsView());
  detail.querySelectorAll('[data-blog-url]').forEach(el=>{
    el.addEventListener('click', ()=> openBlogArticle(el.dataset.blogUrl));
  });
  detail.querySelectorAll('[data-blog-author]').forEach(el=>{
    el.addEventListener('click', ()=> openBlogProfile(el.dataset.blogAuthor));
  });
  detail.querySelectorAll('[data-blog-tag]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const tag = el.dataset.blogTag;
      const found = blogArticles.find(a=> a.tags.includes(tag) || a.topic===tag);
      if (found) openBlogArticle(found.url);
    });
  });
  const viewSearch = document.getElementById('view-search');
  if (viewSearch) viewSearch.scrollTop = 0;
  const body = detail.querySelector('.blog-body');
  if (body) body.scrollTop = 0;
}
function openBlogProfile(authorId){
  const author = getBlogAuthor(authorId);
  if (!author) return;
  const detail = document.getElementById('searchDetail');
  const layout = document.getElementById('searchLayout');
  if (!detail || !layout) return;
  layout.style.display='none';
  detail.style.display='block';
  detail.classList.add('open');
  const articles = getAuthorArticles(authorId);
  const totalViews = articles.reduce((s,a)=>s+a.views,0);
  const totalLikes = articles.reduce((s,a)=>s+a.likes,0);
  detail.innerHTML = `
    <div class="blog-platform">
      ${blogHeaderHtml('profile')}
      <div class="blog-body">
        <div class="blog-profile__head">
          <img class="blog-profile__avatar" src="${escapeHtml(author.avatar)}" alt="" onerror="this.src='https://i.pravatar.cc/150?u=fallback'" />
          <div class="blog-profile__info">
            <h2 class="blog-profile__name">${escapeHtml(author.displayName)} <small>${escapeHtml(author.handle)}</small> ${author.verified?'<span style="color:#1d9bf0"><i class=&quot;fa-solid fa-circle-check&quot;></i></span>':''}</h2>
            <p class="blog-profile__bio">${escapeHtml(author.bio)}</p>
            <div class="blog-profile__stats">
              <span><b>${articles.length}</b> 篇文章</span>
              <span><b>${formatViews(totalViews)}</b> 總瀏覽</span>
              <span><b>${formatViews(totalLikes)}</b> 收到喜歡</span>
              <span><b>${formatViews(author.followers)}</b> 追蹤者</span>
              <span><b>${author.following}</b> 追蹤中</span>
              <span>加入於 ${escapeHtml(author.joined)}</span>
            </div>
            <div class="blog-profile__actions">
              <button class="blog-header__btn primary"><i class="fa-solid fa-plus"></i> 追蹤</button>
              <button class="blog-header__btn">分享主頁</button>
              <button class="blog-back-top" data-blog-back-search style="margin-left:auto"><i class="fa-solid fa-arrow-left"></i> 回到搜尋</button>
            </div>
          </div>
        </div>
        <div class="blog-profile__body">
          <div style="min-width:0">
            <div class="blog-profile__tabs">
              <button class="blog-profile__tab active">熱門文章 · 依瀏覽數排序</button>
              <button class="blog-profile__tab">最新</button>
              <button class="blog-profile__tab">收藏</button>
            </div>
            <div style="font-size:12px;color:#9aa0a6;margin-bottom:10px">共 ${articles.length} 篇 · 已依 <b style="color:#1f2328">最高瀏覽</b> 排序，點擊可進入文章頁</div>
            <div class="blog-profile__list">
              ${articles.map((a,idx)=>`
                <div class="blog-row" data-blog-url="${escapeHtml(a.url)}">
                  <div class="blog-row__cover"><img src="${escapeHtml(a.cover || `https://picsum.photos/seed/${a.url.slice(-8)}/400/300`)}" alt="" onerror="this.src='https://picsum.photos/600/400?random=4'" /></div>
                  <div class="blog-row__main">
                    <div class="blog-row__title">${idx===0?'<span style="padding:2px 6px;border-radius:6px;background:var(--blog-accent);color:#fff;font-size:11px;margin-right:6px">最高瀏覽</span>':''}${escapeHtml(a.title)}</div>
                    <div class="blog-row__excerpt">${escapeHtml(a.excerpt)}</div>
                    <div class="blog-row__meta">
                      <span><i class="fa-regular fa-calendar"></i> ${escapeHtml(a.date)}</span>
                      <span><i class="fa-solid fa-eye"></i> ${formatViews(a.views)}</span>
                      <span><i class="fa-regular fa-heart"></i> ${formatViews(a.likes)}</span>
                      <span class="blog-row__tag">${escapeHtml(a.topic)}</span>
                      ${a.tags.slice(0,2).map(t=>`<span class="blog-row__tag">#${escapeHtml(t)}</span>`).join('')}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="blog-sidebar">
            <div class="blog-widget">
              <h4><i class="fa-solid fa-circle-info"></i> 關於作者</h4>
              <p style="font-size:12.5px;line-height:1.7;color:#5b6572;margin:0 0 10px">${escapeHtml(author.bio)}</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <span class="blog-tag">BlogWorld 成員</span>
                <span class="blog-tag">${escapeHtml(author.id==='sawyer'?'創作 10 年':'創作 3 年+')}</span>
              </div>
            </div>
            <div class="blog-widget">
              <h4><i class="fa-solid fa-chart-simple"></i> 瀏覽排行</h4>
              <div style="display:flex;flex-direction:column;gap:6px">
                ${articles.slice(0,3).map((a,i)=>`
                  <div style="display:flex;gap:8px;align-items:center;padding:6px;border-radius:8px;background:${i===0?'var(--blog-accent-bg)':'transparent'};border:1px solid ${i===0?'#ffd8c2':'transparent'};cursor:pointer" data-blog-url="${escapeHtml(a.url)}">
                    <span style="font-weight:900;color:${i===0?'var(--blog-accent)':'#9aa0a6'}">${i+1}</span>
                    <span style="flex:1;font-size:12px;font-weight:700;color:#1f2328;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(a.title)}</span>
                    <span style="font-size:11px;color:#9aa0a6">${formatViews(a.views)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="blog-widget">
              <h4><i class="fa-solid fa-link"></i> 相關推薦</h4>
              <div style="font-size:12px;color:#9aa0a6">追蹤更多作者，探索更多故事。回到 <a data-blog-home style="cursor:pointer;color:var(--blog-accent);font-weight:700">BlogWorld 首頁</a> 瀏覽編輯精選。</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  bindBlogHeader(detail);
  detail.querySelector('[data-blog-back-search]')?.addEventListener('click', ()=> showResultsView());
  detail.querySelectorAll('[data-blog-url]').forEach(el=>{
    el.addEventListener('click', ()=> openBlogArticle(el.dataset.blogUrl));
  });
  detail.querySelector('[data-blog-home]')?.addEventListener('click', ()=> openBlogHome());
  detail.querySelector('a[data-blog-home]')?.addEventListener('click', ()=> openBlogHome());
  const viewSearch = document.getElementById('view-search');
  if (viewSearch) viewSearch.scrollTop = 0;
}
function openBlogArticle(url){
  let article = getBlogArticle(url);
  // fallback: 若是 webIndex 的 sawyer 條目但未在 blogArticles，嘗試映射
  if (!article){
    const w = webIndex.find(r=>r.url===url);
    if (w && w.url.includes('sawyer-blog.example')){
      article = getBlogArticle(w.url);
    }
  }
  if (!article) return;
  const author = getBlogAuthor(article.authorId);
  const detail = document.getElementById('searchDetail');
  const layout = document.getElementById('searchLayout');
  if (!detail || !layout) return;
  layout.style.display='none';
  detail.style.display='block';
  detail.classList.add('open');
  const md5C = document.getElementById('md5Tool');
  if (md5C){ md5C.style.display='none'; md5C.innerHTML=''; }
  const recs = getRecommendedFor(article);
  const comments = blogComments[article.url] || [];
  const isSawyerImage = article.cover && article.cover.includes('sawyer_blog_pic');
  detail.innerHTML = `
    <div class="blog-platform">
      ${blogHeaderHtml('article')}
      <div class="blog-body">
        <div class="blog-article__layout">
          <div class="blog-article__main">
            <div class="blog-article__card">
              <div class="blog-article__head">
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px">
                  <button class="blog-back-top" data-blog-back-home><i class="fa-solid fa-house"></i> BlogWorld 首頁</button>
                  <button class="blog-back-top" data-blog-author="${escapeHtml(author.id)}"><i class="fa-solid fa-user"></i> ${escapeHtml(author.name)} 主頁</button>
                  <button class="blog-back-top" data-blog-back-search style="margin-left:auto"><i class="fa-solid fa-arrow-left"></i> 回到搜尋</button>
                </div>
                <h1 class="blog-article__title">${escapeHtml(article.title)}</h1>
                <div class="blog-article__meta">
                  <img src="${escapeHtml(author.avatar)}" alt="" />
                  <div style="line-height:1.3">
                    <div><b data-blog-author="${escapeHtml(author.id)}" style="cursor:pointer">${escapeHtml(author.displayName)}</b> <span style="color:#9aa0a6">${escapeHtml(author.handle)}</span></div>
                    <div style="font-size:11px;color:#9aa0a6">${escapeHtml(article.date)} · <i class="fa-solid fa-eye"></i> ${formatViews(article.views)} 瀏覽 · <i class="fa-regular fa-heart"></i> ${formatViews(article.likes)} 喜歡 · 閱讀約 ${Math.max(1, Math.ceil(article.content.length/400))} 分鐘</div>
                  </div>
                  <span class="dot"></span>
                  <span style="padding:4px 8px;border-radius:999px;background:var(--blog-accent-bg);border:1px solid #ffd8c2;color:#d45a1f;font-weight:700;font-size:11px">${escapeHtml(article.topic)}</span>
                  <button class="blog-header__btn primary" style="margin-left:auto;padding:6px 12px;font-size:12px">追蹤</button>
                </div>
                ${article.cover ? `<div class="blog-article__cover"><img src="${escapeHtml(article.cover)}" alt="" onerror="this.style.display='none'" /></div>` : ''}
              </div>
              <div class="blog-article__content">${highlightSnippet(article.content, lastBaseQuery)}</div>
              <div class="blog-article__tags">
                ${article.tags.map(t=>`<span class="blog-article__tag"># ${escapeHtml(t)}</span>`).join('')}
                <span class="blog-article__tag" style="background:var(--blog-accent-bg);border-color:#ffd8c2;color:#d45a1f"><i class="fa-solid fa-eye"></i> ${formatViews(article.views)}</span>
              </div>
            </div>
            <div class="blog-comments">
              <div class="blog-comments__head">
                <h4><i class="fa-regular fa-comments"></i> 留言 ${comments.length}</h4>
                <span class="blog-comments__count">按熱度排序</span>
              </div>
              <div class="blog-comments__list">
                ${comments.length? comments.map(c=>`
                  <div class="blog-comment">
                    <div class="blog-comment__avatar" style="${c.avatar?`background:url(${escapeHtml(c.avatar)}) center/cover`:''}">${c.avatar?'':escapeHtml(c.user.slice(0,1))}</div>
                    <div class="blog-comment__main">
                      <div class="blog-comment__head"><span class="blog-comment__user">${escapeHtml(c.user)}</span><span class="blog-comment__time">${escapeHtml(c.time)}</span></div>
                      <div class="blog-comment__text">${escapeHtml(c.text)}</div>
                      <div class="blog-comment__actions"><span><i class="fa-regular fa-heart"></i> ${c.likes} 喜歡</span><span><i class="fa-regular fa-comment"></i> 回覆</span><span><i class="fa-regular fa-flag"></i> 檢舉</span></div>
                    </div>
                  </div>
                `).join('') : `<div style="padding:18px;text-align:center;color:#9aa0a6;font-size:13px">還沒有留言，成為第一個留言的人吧</div>`}
              </div>
              <div class="blog-comment__composer"><img src="${escapeHtml(author.avatar)}" alt="" style="width:28px;height:28px;border-radius:50%" /><input placeholder="寫下你的想法..." readonly /><button>送出</button></div>
            </div>
          </div>
          <aside class="blog-sidebar">
            <div class="blog-widget">
              <div style="display:flex;gap:10px;align-items:center">
                <img src="${escapeHtml(author.avatar)}" alt="" style="width:44px;height:44px;border-radius:50%" />
                <div style="flex:1;min-width:0"><b style="font-size:13px;color:#1f2328">${escapeHtml(author.displayName)}</b><div style="font-size:11px;color:#9aa0a6">${escapeHtml(author.bio.slice(0,28))}…</div></div>
                <button class="blog-header__btn primary" style="padding:6px 10px;font-size:12px">追蹤</button>
              </div>
              <div style="margin-top:10px;display:flex;gap:14px;font-size:11px;color:#9aa0a6"><span><b style="color:#1f2328">${formatViews(author.followers)}</b> 追蹤者</span><span><b style="color:#1f2328">${author.following}</b> 追蹤中</span><span style="margin-left:auto;cursor:pointer;color:var(--blog-accent);font-weight:700" data-blog-author="${escapeHtml(author.id)}">前往主頁 →</span></div>
            </div>
            <div class="blog-widget">
              <h4 class="blog-sidebar__title"><i class="fa-solid fa-book-open"></i> 推薦閱讀 · 5 篇</h4>
              <div style="font-size:11px;color:#9aa0a6;margin-bottom:8px">包含 2 篇同作者 + 3 篇相似話題的其他作者文章</div>
              <div class="blog-rec-list">
                ${recs.map((r,idx)=>{
                  const ra = getBlogAuthor(r.authorId);
                  const isSameAuthor = r.authorId===article.authorId;
                  return `
                  <div class="blog-rec" data-blog-url="${escapeHtml(r.url)}">
                    <img src="${escapeHtml(r.cover || `https://picsum.photos/seed/${r.url.slice(-8)}/200/200`)}" alt="" onerror="this.src='https://picsum.photos/600/400?random=5'" />
                    <div style="flex:1;min-width:0">
                      <div class="blog-rec__title">${escapeHtml(r.title)}</div>
                      <div class="blog-rec__meta"><span>${escapeHtml(ra.name)}</span><span>·</span><span><i class="fa-solid fa-eye"></i> ${formatViews(r.views)}</span></div>
                      <div style="margin-top:4px">${isSameAuthor?`<span class="blog-rec__badge">同作者</span>`:`<span class="blog-rec__badge" style="background:#eef2ff;border-color:#c7d2fe;color:#4338ca">相似話題 · ${escapeHtml(r.topic)}</span>`}</div>
                    </div>
                  </div>
                  `;
                }).join('')}
              </div>
            </div>
            <div class="blog-widget" style="background:var(--blog-bg2)">
              <h4><i class="fa-solid fa-shield-halved"></i> BlogWorld 提醒</h4>
              <p style="font-size:12px;line-height:1.6;color:#6b7280;margin:0">此為公開部落格平台，文章由作者自行撰寫。留言區為社群互動，請保持友善。</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  `;
  bindBlogHeader(detail);
  detail.querySelector('[data-blog-back-home]')?.addEventListener('click', ()=> openBlogHome());
  detail.querySelector('[data-blog-back-search]')?.addEventListener('click', ()=> showResultsView());
  detail.querySelectorAll('[data-blog-author]').forEach(el=>{
    el.addEventListener('click', ()=> openBlogProfile(el.dataset.blogAuthor));
  });
  detail.querySelectorAll('[data-blog-url]').forEach(el=>{
    el.addEventListener('click', ()=> openBlogArticle(el.dataset.blogUrl));
  });
  // scroll to top
  const viewSearch = document.getElementById('view-search');
  if (viewSearch) viewSearch.scrollTop = 0;
  const body = detail.querySelector('.blog-body');
  if (body) body.scrollTop = 0;
  detail.scrollIntoView({behavior:'auto', block:'start'});
}

// ── 廣志中學 — 學生成就檔案 / Students Portfolio ──
function isSchoolEssay(url){
  return url === 'https://school.example/guangzhi-essay-sawyer' || url.includes('school.example/guangzhi');
}
function schoolHeaderHtml(active){
  return `
    <div class="school-topline">
      <span><b>廣志中學</b> Kwong Chi Secondary School</span>
      <span>校訓：勤 · 誠 · 仁 · 毅</span>
      <div class="school-topline__links">
        <span>English</span><span>聯絡我們</span><span>登入 Intranet</span>
      </div>
    </div>
    <div class="school-header">
      <div class="school-header__row">
        <div class="school-header__crest"><i class="fa-solid fa-graduation-cap"></i></div>
        <div class="school-header__title">
          <h1>廣志中學 <span>KWONG CHI SECONDARY SCHOOL</span></h1>
          <p>Est. 1968 · 校務處 · 學生成就檔案</p>
        </div>
        <div class="school-header__meta">
          <span><i class="fa-solid fa-location-dot"></i> 九龍廣志街 38 號</span>
          <span><i class="fa-solid fa-phone"></i> 2748 3821</span>
        </div>
        <div class="school-header__actions">
          <button class="school-back" data-school-back-search><i class="fa-solid fa-arrow-left"></i> 回到搜尋</button>
          <button class="school-btn primary">校園入口</button>
        </div>
      </div>
      <nav class="school-nav">
        <a>學校簡介</a>
        <a>行政架構</a>
        <a>課程介紹</a>
        <a class="active">學生成就</a>
        <a>家校合作</a>
        <a>聯絡我們</a>
      </nav>
    </div>
    <div class="school-breadcrumb">
      <a data-school-home>首頁</a><span class="sep">›</span>
      <a>學生成就</a><span class="sep">›</span>
      <a>作品集 · Portfolio</a><span class="sep">›</span>
      <b style="color:var(--school-navy)">聖誕假期作文比賽 · 二等獎</b>
    </div>
  `;
}
function bindSchoolHeader(root){
  root.querySelectorAll('[data-school-back-search]').forEach(el=> el.addEventListener('click', ()=> showResultsView()));
  root.querySelectorAll('[data-school-home]').forEach(el=> el.addEventListener('click', ()=> showResultsView()));
}
function openSchoolPortfolio(targetItem){
  const item = targetItem || webIndex.find(r=> r.url==='https://school.example/guangzhi-essay-sawyer') || lastResults.find(r=> isSchoolEssay(r.url));
  if (!item) return;
  const detail = document.getElementById('searchDetail');
  const layout = document.getElementById('searchLayout');
  if (!detail || !layout) return;
  layout.style.display='none';
  detail.style.display='block';
  detail.classList.add('open');
  const md5C = document.getElementById('md5Tool');
  if (md5C){ md5C.style.display='none'; md5C.innerHTML=''; }
  const images = item.images || (item.image ? [item.image] : []);
  // 同屆其他獲獎學生（虛構，用於營造官網列表真實感）
  const peers = [
    { rank:1, name:'陳曉彤', cls:'中五乙班', title:'《冬日的燈火》', award:'一等獎', tag:'評審大獎' },
    { rank:2, name:'蔡梓掦', cls:'中五甲班', title:'《有時候, 輸也是一種贏》', award:'二等獎', tag:'優異作品', active:true },
    { rank:3, name:'林俊賢', cls:'中五丙班', title:'《廣場的鴿子》', award:'二等獎', tag:'' },
    { rank:4, name:'黃思敏', cls:'中四甲班', title:'《雨後的操場》', award:'優異獎', tag:'' },
    { rank:5, name:'張嘉裕', cls:'中五甲班', title:'《重返舊校舍》', award:'優異獎', tag:'' },
  ];
  detail.innerHTML = `
    <div class="school-platform">
      ${schoolHeaderHtml('portfolio')}
      <div class="school-body">
        <div class="school-backrow">
          <button class="school-back" data-school-back-search><i class="fa-solid fa-arrow-left"></i> 回到搜尋結果</button>
          <span style="margin-left:auto;display:flex;gap:6px">
            <button class="school-btn ghost"><i class="fa-solid fa-print"></i> 列印</button>
            <button class="school-btn"><i class="fa-solid fa-share-nodes"></i> 分享</button>
          </span>
        </div>

        <div class="school-hero">
          <div class="school-hero__inner">
            <div class="school-hero__badge">
              <i class="fa-solid fa-award"></i>
              <b>二等獎</b>
              <span>Second Prize</span>
            </div>
            <div class="school-hero__main">
              <div class="school-hero__kicker">Students Portfolio · 學生成就檔案 <span class="dot"></span> 2022–2023 年度 <span class="dot"></span> 語文科</div>
              <h1 class="school-hero__title">廣志中學聖誕假期作文比賽</h1>
              <p class="school-hero__subtitle">本年度聖誕假期作文比賽共收到 186 份作品，經中文科組評選後選出 12 份優異作品。此檔案為「二等獎」得主之公開作品集，供校內師生及家長瀏覽。</p>
              <div class="school-hero__meta">
                <span class="school-hero__tag gold"><i class="fa-solid fa-medal"></i> 二等獎 · 中五組</span>
                <span class="school-hero__tag">中五甲班 · 蔡梓掦</span>
                <span class="school-hero__tag"><i class="fa-regular fa-calendar"></i> 公布日期：2010-01-09</span>
                <span style="margin-left:auto;font-size:11px;color:var(--school-subtle)"><i class="fa-solid fa-eye"></i> 瀏覽 1,248 · <i class="fa-solid fa-download"></i> 下載 86</span>
              </div>
            </div>
            <div class="school-hero__actions">
              <button class="school-btn primary"><i class="fa-solid fa-file-lines"></i> 下載 PDF</button>
            </div>
          </div>
        </div>

        <div class="school-layout">
          <div class="school-main">
            <div class="school-profile-card">
              <div class="school-profile-card__head">
                <div class="school-profile-card__avatar">蔡</div>
                <div class="school-profile-card__info">
                  <h2 class="school-profile-card__name">蔡梓掦 <small>Sawyer Choi · Choi Tsz Yeung</small></h2>
                  <div class="school-profile-card__class"><span><b>中五甲班</b> · 5A</span><span>學號：5A-12</span><span>指導老師：陳慧敏老師</span></div>
                  <div class="school-profile-card__stats">
                    <span><b>二等獎</b> 中五組</span>
                    <span><b>12</b> 入選作品</span>
                    <span><b>186</b> 參賽總數</span>
                    <span>檔案編號：GSC-CHI-2022-5A-012</span>
                  </div>
                </div>
                <div style="position:relative;z-index:1;margin-left:auto;display:flex;flex-direction:column;gap:6px">
                  <span class="school-btn" style="background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.18);color:#fff"><i class="fa-solid fa-id-card"></i> 學生檔案</span>
                </div>
              </div>
              <div class="school-profile-card__body">
                <p class="school-profile-card__quote"><i class="fa-solid fa-quote-left" style="color:#c9b48a;margin-right:6px"></i>「文字能讓想法留下來。很高興這次的嘗試被看見，謝謝老師的鼓勵。」—— 蔡梓掦（獲獎感言節錄）</p>
                <div class="school-profile-card__grid">
                  <div class="school-stat"><b>二等獎</b><span>聖誕假期作文比賽 · 中五組</span></div>
                  <div class="school-stat"><b>公開展示</b><span>作品已收錄於校園展覽廊</span></div>
                </div>
              </div>
            </div>

            <div class="school-doc">
              <div class="school-doc__head">
                <h3><i class="fa-solid fa-book-open"></i> 得獎作品原稿 · Handwritten Manuscript</h3>
                <div class="school-doc__tools">
                  <span class="school-doc__tool"><i class="fa-solid fa-magnifying-glass"></i> 放大檢視</span>
                  <span class="school-doc__tool"><i class="fa-solid fa-download"></i> 下載原稿 (PNG)</span>
                </div>
              </div>
              <div class="school-doc__pages">
                ${images.map((src, idx)=>`
                  <div class="school-page" data-school-page="${idx}">
                    <div class="school-page__bar">
                      <span><b>原稿</b> · Page ${idx+1} / ${images.length} · 手寫掃描件</span>
                      <span style="display:flex;gap:8px;align-items:center"><span class="school-doc__tool" data-school-zoom="${idx}"><i class="fa-solid fa-expand"></i> 全螢幕</span><span>300 dpi · 彩色掃描</span></span>
                    </div>
                    <div class="school-page__img"><img src="${escapeHtml(src)}" alt="作文原稿第${idx+1}頁" loading="lazy" onerror="this.src='https://via.placeholder.com/640x900?text=Manuscript+${idx+1}'" /></div>
                    <div class="school-page__caption">
                      <span><i class="fa-solid fa-pen-nib" style="color:var(--school-gold)"></i> 蔡梓掦 · 中五甲班 · 聖誕假期作文比賽參賽作品（掃描件僅供校內存檔）</span>
                      <span>頁碼 ${idx+1} · 由中文科組存檔</span>
                    </div>
                  </div>
                `).join('')}
                ${!images.length? `<div style="padding:24px;text-align:center;color:var(--school-muted)">暫無掃描件</div>` : ''}
              </div>
              <div style="padding:10px 16px;background:#fdfdfb;border-top:1px solid var(--school-border2);font-size:11px;color:var(--school-subtle);display:flex;gap:12px;flex-wrap:wrap;justify-content:space-between">
                <span><i class="fa-solid fa-shield-halved"></i> 校方聲明：本作品著作權歸學生所有，未經授權不得轉載。</span>
                <span>檔案最後更新：2023-01-10 09:32 · 管理員：中文科組</span>
              </div>
            </div>

            <div class="school-eval">
              <div class="school-eval__head"><h4><i class="fa-solid fa-comments"></i> 評審評語 · Jury Comments</h4></div>
              <div class="school-eval__body">
                <div class="school-eval__row">
                  <div style="flex:1">
                    <b>陳慧敏老師（中文科）</b><br>
                    <span>行文真摯，情感細膩，能以日常小事帶出成長體悟。字跡工整，結構完整，具中五學生應有之觀察力與表達力。</span>
                    <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">
                      <span class="school-hero__tag">立意明確</span><span class="school-hero__tag">情感真切</span><span class="school-hero__tag gold">優異</span>
                    </div>
                  </div>
                  <div class="school-eval__seal"><span>廣志中學</span><span style="font-size:10px;letter-spacing:2px">KWONG CHI</span><span style="font-size:8px;letter-spacing:1px">審核通過</span></div>
                </div>
                <div class="school-eval__row" style="background:#fff">
                  <span><b>頒獎：</b> 2010 年 1 月 16 日（一）早會頒發證書及書券。作品將於二樓展覽廊展出至 2 月底。</span>
                </div>
              </div>
            </div>
          </div>

          <aside class="school-side">
            <div class="school-widget">
              <h4><i class="fa-solid fa-trophy" style="color:var(--school-gold)"></i> 本屆獲獎名單 · 中五組</h4>
              <div class="school-list">
                ${peers.map(p=>`
                  <div class="school-list__item ${p.active?'active':''}" data-school-peer="${p.name}">
                    <div class="school-list__num">${p.rank}</div>
                    <div style="flex:1;min-width:0">
                      <div class="school-list__title">${escapeHtml(p.title)} <span style="font-weight:400;color:var(--school-subtle)">— ${escapeHtml(p.name)}</span></div>
                      <div class="school-list__meta">${escapeHtml(p.cls)} · ${escapeHtml(p.award)} ${p.tag?`· <b style="color:var(--school-gold)">${escapeHtml(p.tag)}</b>`:''}</div>
                    </div>
                    ${p.active?'<i class="fa-solid fa-chevron-right" style="color:var(--school-navy);align-self:center"></i>':''}
                  </div>
                `).join('')}
              </div>
              <div style="margin-top:10px;display:flex;gap:6px">
                <button class="school-btn" style="flex:1"><i class="fa-solid fa-list"></i> 完整名單</button>
                <button class="school-btn" style="flex:1">歷屆作品</button>
              </div>
            </div>

            <div class="school-widget">
              <h4><i class="fa-solid fa-building-columns"></i> 關於學生成就檔案</h4>
              <p>廣志中學自 2008 年起建立「學生成就檔案」制度，系統化收藏學生在學術、體藝、服務及創作等領域之成果，並於校網公開展示優異作品，鼓勵同儕觀摩學習。</p>
              <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px">
                <span class="school-archive__tag active">作文比賽</span>
                <span class="school-archive__tag">書法</span>
                <span class="school-archive__tag">演講</span>
                <span class="school-archive__tag">科學專題</span>
                <span class="school-archive__tag">視藝</span>
              </div>
            </div>

            <div class="school-widget" style="background:linear-gradient(135deg,#fdfdfb 0%, #f4f1ea 100%)">
              <h4><i class="fa-solid fa-circle-info"></i> 檔案資訊</h4>
              <div style="display:grid;gap:6px;font-size:11px;color:var(--school-muted);line-height:1.6">
                <div><b style="color:var(--school-navy)">檔案編號：</b> GSC-CHI-2022-5A-012</div>
                <div><b style="color:var(--school-navy)">分類：</b> 語文科 · 中文寫作 · 假期徵文</div>
                <div><b style="color:var(--school-navy)">原稿格式：</b> 手寫 · A4 橫線紙 · 掃描 PNG</div>
                <div><b style="color:var(--school-navy)">公開範圍：</b> 校內公開 · 家長可瀏覽</div>
                <div><b style="color:var(--school-navy)">聯絡：</b> 中文科組 · chi@kwongchi.edu.hk</div>
              </div>
            </div>

            <div class="school-widget">
              <h4><i class="fa-solid fa-link"></i> 相關連結</h4>
              <div style="display:flex;flex-direction:column;gap:8px;font-size:12px">
                <a><i class="fa-solid fa-chevron-right" style="font-size:10px"></i> 2021 年度作文比賽作品集</a>
                <a><i class="fa-solid fa-chevron-right" style="font-size:10px"></i> 中文科學習資源</a>
                <a><i class="fa-solid fa-chevron-right" style="font-size:10px"></i> 校園展覽廊（虛擬導覽）</a>
              </div>
            </div>
          </aside>
        </div>

        <div class="school-footer">
          <div><b>廣志中學 Kwong Chi Secondary School</b> · 九龍廣志街 38 號 · Tel 2748 3821 · Fax 2748 3822</div>
          <div class="school-footer__links">
            <span>私隱政策</span><span>版權聲明</span><span>無障礙</span><span>© 2008 Kwong Chi Secondary School</span>
          </div>
        </div>
      </div>
    </div>

    <div id="schoolLightbox" class="school-lightbox" aria-hidden="true">
      <div class="school-lightbox__card">
        <div class="school-lightbox__head">
          <span><i class="fa-solid fa-file-lines"></i> 原稿預覽 · Page <span id="schoolLbPage">1</span> / ${images.length}</span>
          <button class="school-lightbox__close" id="schoolLbClose"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="school-lightbox__img"><img id="schoolLbImg" src="" alt="原稿大圖" /></div>
      </div>
    </div>
  `;
  bindSchoolHeader(detail);
  // page zoom / lightbox
  detail.querySelectorAll('[data-school-zoom]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const idx = Number(btn.dataset.schoolZoom);
      const src = images[idx];
      const lb = document.getElementById('schoolLightbox');
      const img = document.getElementById('schoolLbImg');
      const pg = document.getElementById('schoolLbPage');
      if (lb && img){ img.src = src; if(pg) pg.textContent = String(idx+1); lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); }
    });
  });
  detail.querySelectorAll('.school-page__img img').forEach((img, idx)=>{
    img.style.cursor='zoom-in';
    img.addEventListener('click', ()=>{
      const lb = document.getElementById('schoolLightbox');
      const lbImg = document.getElementById('schoolLbImg');
      const pg = document.getElementById('schoolLbPage');
      if (lb && lbImg){ lbImg.src = images[idx]; if(pg) pg.textContent = String(idx+1); lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); }
    });
  });
  detail.querySelector('#schoolLbClose')?.addEventListener('click', ()=>{
    const lb = document.getElementById('schoolLightbox');
    if (lb){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); }
  });
  detail.querySelector('#schoolLightbox')?.addEventListener('click', (e)=>{
    if (e.target.id === 'schoolLightbox'){ e.currentTarget.classList.remove('open'); e.currentTarget.setAttribute('aria-hidden','true'); }
  });
  // other peers toast
  detail.querySelectorAll('[data-school-peer]').forEach(el=>{
    if (el.dataset.schoolPeer === '蔡梓掦') return;
    el.addEventListener('click', ()=>{
      const name = el.dataset.schoolPeer;
      // simple inline toast inside detail
      const t = document.createElement('div');
      t.textContent = name + ' 的作品僅展示標題，完整內容未公開。';
      t.style.cssText = 'position:fixed;left:50%;bottom:80px;transform:translateX(-50%);background:#0f2b46;color:#fff;padding:10px 14px;border-radius:999px;font-size:12px;box-shadow:0 8px 24px rgba(0,0,0,.3);z-index:1300';
      document.body.appendChild(t);
      setTimeout(()=> t.remove(), 2200);
    });
  });
  const viewSearch = document.getElementById('view-search');
  if (viewSearch) viewSearch.scrollTop = 0;
  const searchEl = document.querySelector('.search');
  if (searchEl) searchEl.scrollTop = 0;
  detail.scrollIntoView({behavior:'auto', block:'start'});
}

function openDetail(idx) {
  const item = lastResults[idx];
  if (!item) return;
  const md5C = document.getElementById('md5Tool');
  if (md5C) { md5C.style.display = 'none'; md5C.innerHTML = ''; }
  // 若為部落格文章，進入 BlogWorld 文章頁 (全新風格頁面)
  const blogUrl = item.url;
  const isBlogWorld = blogArticles.some(a=>a.url===blogUrl) || blogUrl.includes('sawyer-blog.example') || blogUrl.includes('mary-blog.example') || blogUrl.includes('peter-blog.example') || blogUrl.includes('paul-blog.example') || blogUrl.includes('emma-blog.example') || blogUrl.includes('david-blog.example');
  if (isBlogWorld){
    // 盡量對應到 blogArticles 的 url
    let target = blogUrl;
    if (!getBlogArticle(target)){
      const cand = blogArticles.find(a=> a.title===item.title);
      if (cand) target = cand.url;
    }
    if (getBlogArticle(target)) { openBlogArticle(target); return; }
  }
  // 廣志中學作文比賽 — 官方學生成就檔案頁
  if (isSchoolEssay(item.url) || item.title.includes('廣志中學')){
    openSchoolPortfolio(item);
    return;
  }
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
      vfs.readFile(vfsPath);
    }
  } else if (vfs.exists(item.url)) {
    vfsPath = item.url;
    const file = vfs.getFile(vfsPath);
    if (file && typeof file.content === 'string') fullContent = file.content;
  }
  if (!fullContent && item.title.startsWith('/customer-portal')) {
    const file = vfs.getFile(item.title);
    if (file && typeof file.content === 'string') fullContent = file.content;
  }

  const displayContent = fullContent || item.snippet || '無內容';
  // 非部落格的一般結果 (廣志中學、新聞等) 維持原樣
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
  detail.querySelector('#searchBackBtn')?.addEventListener('click', () => showResultsView());
  const searchEl = document.querySelector('.search');
  if (searchEl) searchEl.scrollTop = 0;
  const viewSearch = document.getElementById('view-search');
  if (viewSearch) viewSearch.scrollTop = 0;
  detail.scrollIntoView({ behavior: 'auto', block: 'start' });
}
