/* HomeFit AI
   - No backend required for the core experience.
   - Personalization is local and stored with localStorage.
   - Browser notifications work while this page/app can execute its timer.
*/

const state = {
  goal: localStorage.getItem('hf_goal') || 'muscle',
  duration: Number(localStorage.getItem('hf_duration') || 30),
  equipment: localStorage.getItem('hf_equipment') || 'body',
  level: localStorage.getItem('hf_level') || 'intermediate',
  days: JSON.parse(localStorage.getItem('hf_days') || '[1,3,5]'),
  reminderEnabled: JSON.parse(localStorage.getItem('hf_reminder_enabled') || 'false'),
  reminderDays: localStorage.getItem('hf_reminder_days') || 'daily',
  reminderTime: localStorage.getItem('hf_reminder_time') || '19:00',
  profileName: localStorage.getItem('hf_name') || '',
  lastNotificationKey: localStorage.getItem('hf_last_notification') || '',
  streak: Number(localStorage.getItem('hf_streak') || 0),
  sessions: Number(localStorage.getItem('hf_sessions') || 0)
};

const exercises = [
  {id:'squat',name:'Squat',group:'legs',level:'beginner',equipment:['body','dumbbell','backpack','all'],sets:'3 × 10–15',desc:'Kalça ve bacaklar. Dizleri ayak yönünde takip ettir, gövdeyi kontrollü tut.'},
  {id:'reverseLunge',name:'Geri Lunge',group:'legs',level:'intermediate',equipment:['body','dumbbell','backpack','all'],sets:'3 × 8/8',desc:'Denge ve bacak kuvveti. Adımı kontrollü al, ön ayağın tabanını yere sabitle.'},
  {id:'gluteBridge',name:'Glute Bridge',group:'legs',level:'beginner',equipment:['body','band','all'],sets:'3 × 12–15',desc:'Kalça odaklı. Tepede kısa süre sık, belini aşırı çukurlaştırma.'},
  {id:'pushup',name:'Şınav',group:'chest',level:'beginner',equipment:['body','band','all'],sets:'3 × 6–12',desc:'Göğüs, omuz ve triceps. Vücudu düz bir çizgide tutarak kontrollü in.'},
  {id:'inclinePushup',name:'Eğimli Şınav',group:'chest',level:'beginner',equipment:['chair','body','all'],sets:'3 × 8–15',desc:'Şınava yeni başlayanlar için. Sabit bir yüzey kullan ve hareketi yavaşlat.'},
  {id:'dbPress',name:'Dambıl Floor Press',group:'chest',level:'intermediate',equipment:['dumbbell','all'],sets:'3 × 8–12',desc:'Yerde göğüs press. Dirsekleri çok açmadan dambılları kontrollü indir.'},
  {id:'row',name:'Tek Kol Çanta Row',group:'back',level:'intermediate',equipment:['backpack','dumbbell','all'],sets:'3 × 10/10',desc:'Sırt çekişi. Gövdeyi sabit tutup dirseği kalçaya doğru sür.'},
  {id:'bandRow',name:'Direnç Bandı Row',group:'back',level:'beginner',equipment:['band','all'],sets:'3 × 12–15',desc:'Kürek kemiklerini geriye-aşağı çekerek sırtı çalıştır.'},
  {id:'deadBug',name:'Dead Bug',group:'core',level:'beginner',equipment:['body','all'],sets:'3 × 8/8',desc:'Core kontrolü. Belini rahatça sabit tutabildiğin aralıkta hareket et.'},
  {id:'plank',name:'Plank',group:'core',level:'beginner',equipment:['body','all'],sets:'3 × 20–40 sn',desc:'Gövdeyi tek parça tut. Nefesini tutmadan kontrollü şekilde bekle.'},
  {id:'shoulderPress',name:'Dambıl Omuz Press',group:'shoulders',level:'intermediate',equipment:['dumbbell','all'],sets:'3 × 8–12',desc:'Omuz ve triceps. Ağırlığı kontrol ederek yukarı it ve güvenli aralıkta çalış.'},
  {id:'bandPullApart',name:'Band Pull-Apart',group:'back',level:'beginner',equipment:['band','all'],sets:'3 × 12–15',desc:'Üst sırt ve arka omuz. Omuzları kulaklara yükseltmeden bandı aç.'},
  {id:'stepUp',name:'Sandalye Step-Up',group:'legs',level:'intermediate',equipment:['chair','all'],sets:'3 × 8/8',desc:'Diz ve kalça kuvveti. Sağlam bir yüzey kullan ve çıkışta kontrolü koru.'},
  {id:'mountainClimber',name:'Mountain Climber',group:'core',level:'intermediate',equipment:['body','all'],sets:'3 × 25 sn',desc:'Dinamik kondisyon. Hızdan önce omuz-kalça hizasını ve kontrollü ritmi koru.'},
  {id:'march',name:'Hızlı Yerinde Yürüme',group:'legs',level:'beginner',equipment:['body','all'],sets:'3 × 60 sn',desc:'Düşük ekipmanlı kondisyon. Ritmi nefesini kontrol edebileceğin düzeyde tut.'}
];

const goalData = {
  muscle:{title:'Güç & Kas — Ev Seansı', score:94, note:'Kas gelişimini desteklemek için kuvvet hareketlerini ve dinlenme aralıklarını dengeli tuttum. Kaliteli tekrar, kontrollü tempo ve toparlanma öncelikli.', focus:'Göğüs + bacak + sırt', preferred:['pushup','squat','row','gluteBridge','plank','shoulderPress']},
  weight:{title:'Aktif Kilo Yönetimi — Ev Seansı', score:91, note:'Kilo yönetiminde amaç sürdürülebilir hareket alışkanlığı. Orta tempolu kuvvet ve kondisyonu birleştirip aşırı yüklenmeden ilerle.', focus:'Bacak + core + kondisyon', preferred:['squat','march','reverseLunge','deadBug','mountainClimber','pushup']},
  wellness:{title:'Fit & Sağlıklı Yaşam — Ev Seansı', score:96, note:'Bugün enerji, eklem hareketliliği, temel kuvvet ve nefes kontrolünü bir arada tutan dengeli bir rutin öneriyorum.', focus:'Tüm vücut + mobilite', preferred:['march','squat','inclinePushup','bandPullApart','gluteBridge','deadBug']}
};

function $(id){return document.getElementById(id)}
function qsa(sel){return [...document.querySelectorAll(sel)]}
function saveState(){
  localStorage.setItem('hf_goal',state.goal); localStorage.setItem('hf_duration',state.duration); localStorage.setItem('hf_equipment',state.equipment); localStorage.setItem('hf_level',state.level);
  localStorage.setItem('hf_days',JSON.stringify(state.days)); localStorage.setItem('hf_reminder_enabled',JSON.stringify(state.reminderEnabled)); localStorage.setItem('hf_reminder_days',state.reminderDays); localStorage.setItem('hf_reminder_time',state.reminderTime);
  localStorage.setItem('hf_name',state.profileName); localStorage.setItem('hf_streak',state.streak); localStorage.setItem('hf_sessions',state.sessions);
}

function toast(title,msg){const t=document.createElement('div');t.className='toast';t.innerHTML=`<strong>${title}</strong><div>${msg}</div>`;$('toastWrap').appendChild(t);setTimeout(()=>t.remove(),3600)}
function labelEquipment(k){return ({body:'Ekipmansız',dumbbell:'Dambıl',band:'Direnç bandı',chair:'Sandalye',backpack:'Çanta',all:'Karışık'})[k] || k}
function labelLevel(k){return ({beginner:'Başlangıç',intermediate:'Orta',advanced:'İleri'})[k] || k}
function selectedExercises(){
  const preferred = goalData[state.goal].preferred;
  let pool = preferred.map(id=>exercises.find(e=>e.id===id)).filter(Boolean);
  pool = pool.filter(e=>e.equipment.includes(state.equipment) || state.equipment==='all');
  if(!pool.length) pool=exercises.filter(e=>e.equipment.includes(state.equipment) || state.equipment==='all');
  const levels={beginner:0,intermediate:1,advanced:2};
  const target=levels[state.level];
  pool=pool.filter(e=>Math.abs(levels[e.level]-target)<=1);
  if(pool.length<4) pool=exercises.filter(e=>e.equipment.includes(state.equipment)||state.equipment==='all');
  return [...new Map(pool.map(e=>[e.id,e])).values()].slice(0, Math.max(4, Math.min(6, Math.round(state.duration/7))))
}
function renderPlan(){
  const gd=goalData[state.goal]; const list=selectedExercises();
  $('planTitle').textContent=gd.title; $('planScore').textContent=gd.score+'%'; $('planMeta').textContent=`${state.duration} dk · ${labelEquipment(state.equipment)} · ${labelLevel(state.level)} seviye`;
  $('planNote').textContent=gd.note; $('todayFocus').textContent=gd.focus; $('moveCount').textContent=`${list.length} egzersiz`;
  const extra = state.duration>=45 ? '4 × 8–12' : state.duration>=30 ? '3 × 8–12' : '2–3 × 8–12';
  $('workoutPreview').innerHTML=list.map((e,i)=>`<div class="workout-row"><div class="workout-thumb"></div><div><strong>${i+1}. ${e.name}</strong><small>${e.group.toUpperCase()} · ${e.level==='advanced'?'İleri':e.level==='intermediate'?'Orta':'Temel'}</small></div><span class="workout-tag">${state.duration<=20?'2 set':extra}</span></div>`).join('');
  $('heroSessions').textContent=state.sessions; $('heroStreak').textContent=state.streak;
  $('readiness').textContent=state.level==='advanced'?76:state.level==='intermediate'?82:88; $('readinessMeter').style.width=$('readiness').textContent+'%'; $('loadText').textContent=state.level==='advanced'?'İleri — formu koruyarak ilerle':'Orta — kontrollü ilerle';
}

function setActive(selector,attr,value){qsa(selector).forEach(x=>x.classList.toggle('active',x.dataset[attr]===String(value)))}

function initPickers(){
  qsa('#dayPicker button').forEach(b=>{b.classList.toggle('active',state.days.includes(Number(b.dataset.day)));b.onclick=()=>{const d=Number(b.dataset.day);state.days=state.days.includes(d)?state.days.filter(x=>x!==d):[...state.days,d];saveState();}});
  qsa('#durationPicker button').forEach(b=>b.classList.toggle('active',Number(b.dataset.duration)===state.duration));
  qsa('#durationPicker button').forEach(b=>b.onclick=()=>{state.duration=Number(b.dataset.duration);setActive('#durationPicker button','duration',state.duration);saveState();renderPlan()});
  qsa('#equipmentPicker .equip').forEach(b=>b.classList.toggle('active',b.dataset.equipment===state.equipment));
  qsa('#equipmentPicker .equip').forEach(b=>b.onclick=()=>{state.equipment=b.dataset.equipment;setActive('#equipmentPicker .equip','equipment',state.equipment);saveState();renderPlan()});
  qsa('#levelPicker button').forEach(b=>b.classList.toggle('active',b.dataset.level===state.level));
  qsa('#levelPicker button').forEach(b=>b.onclick=()=>{state.level=b.dataset.level;setActive('#levelPicker button','level',state.level);saveState();renderPlan()});
  $('reminderEnabled').checked=state.reminderEnabled; $('reminderDays').value=state.reminderDays; $('reminderTime').value=state.reminderTime;
}

function buildPlan(){state.sessions+=1;saveState();renderPlan();toast('Plan hazır','Kişiselleştirilmiş seans oluşturuldu. Bugün kaliteyi ve kontrollü tempoyu önceliklendir.');document.querySelector('#planPreview')?.scrollIntoView({behavior:'smooth'});}

function humanSvg(id){
  const motion = {
    squat:`<g class="anim-squat"><circle cx="160" cy="45" r="16"/><path d="M160 63 L160 113 L126 145 L105 183"/><path d="M160 113 L198 144 L216 181"/><path d="M160 76 L121 95 L95 121"/><path d="M160 76 L199 94 L224 118"/><path d="M105 183 L145 183"/><path d="M216 181 L256 181"/></g>`,
    reverseLunge:`<g class="anim-lunge"><circle cx="162" cy="42" r="16"/><path d="M162 60 L160 110 L132 148 L103 188"/><path d="M160 110 L198 148 L239 185"/><path d="M160 74 L126 92 L99 78"/><path d="M160 74 L196 92 L226 82"/><path d="M102 188 L137 188"/><path d="M240 185 L268 185"/></g>`,
    pushup:`<g class="anim-pushup"><circle cx="224" cy="75" r="15"/><path d="M210 85 L160 116 L104 127 L57 138"/><path d="M160 116 L141 156"/><path d="M104 127 L92 160"/><path d="M58 138 L28 160"/><path d="M141 156 L157 156"/><path d="M92 160 L109 160"/></g>`,
    dbPress:`<g class="anim-press"><circle cx="160" cy="40" r="16"/><path d="M160 59 L160 118 L128 168 L103 191"/><path d="M160 118 L193 168 L221 191"/><path d="M160 75 L118 89 L101 68"/><path d="M160 75 L202 89 L219 68"/><path d="M92 191 L113 191"/><path d="M212 191 L233 191"/><rect x="85" y="62" width="24" height="8" rx="4"/><rect x="211" y="62" width="24" height="8" rx="4"/></g>`,
    row:`<g class="anim-row"><circle cx="190" cy="55" r="16"/><path d="M187 72 L151 108 L105 122 L72 159"/><path d="M151 108 L166 151 L198 180"/><path d="M105 122 L82 164"/><path d="M72 159 L45 181"/><path d="M166 151 L188 151"/><path d="M82 164 L100 164"/><rect x="44" y="172" width="34" height="9" rx="4"/></g>`,
    plank:`<g class="anim-plank"><circle cx="226" cy="87" r="15"/><path d="M211 97 L164 119 L113 134 L65 138"/><path d="M164 119 L142 157"/><path d="M112 134 L95 171"/><path d="M64 138 L39 170"/><path d="M38 170 L54 170"/></g>`,
    deadBug:`<g class="anim-deadbug"><circle cx="159" cy="119" r="15"/><path d="M159 134 L159 175"/><path d="M159 142 L119 119 L98 87"/><path d="M159 142 L198 119 L220 90"/><path d="M159 173 L121 187 L96 211"/><path d="M159 173 L199 188 L222 214"/></g>`,
    march:`<g class="anim-march"><circle cx="160" cy="42" r="16"/><path d="M160 60 L160 112"/><path d="M160 75 L125 102 L105 82"/><path d="M160 75 L196 104 L216 86"/><path d="M160 112 L133 157 L109 194"/><path d="M160 112 L194 148 L222 116"/></g>`,
  };
  const content=motion[id]||motion.squat;
  return `<svg viewBox="0 0 320 220" aria-hidden="true"><g fill="none" stroke="rgba(239,247,255,.84)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">${content}</g><g fill="none" stroke="rgba(143,255,79,.65)" stroke-width="4" stroke-linecap="round">${content}</g></svg>`;
}
function renderExercises(filter='all'){
  const list=exercises.filter(e=>filter==='all'||e.group===filter).slice(0,9);
  $('exerciseGrid').innerHTML=list.map(e=>`<article class="exercise-card"><div class="exercise-visual">${humanSvg(e.id)}</div><div class="exercise-body"><h3>${e.name}</h3><p>${e.desc}</p><div class="chip-row"><span class="chip">${e.sets}</span><span class="chip">${e.equipment.includes('body')?'Ekipmansız':'Ekipmanlı seçenek'}</span></div></div></article>`).join('');
}

function aiReply(text){
  const t=text.toLowerCase(); let reply='';
  const mins=(t.match(/(20|30|45|60)\s*(dk|dakika)/)||[])[1];
  let name=state.profileName?` ${state.profileName},`:'';
  if(/hafif|dinlen|yorgun|bitkin/.test(t)) reply=`${name} bugün daha hafif bir seans seçmek mantıklı: 5 dk rahat ısınma, 15–20 dk düşük/orta tempolu hareket, ardından kısa soğuma. Keskin ağrı veya baş dönmesi olursa bırak.`;
  else if(/kas|güç|kuvvet/.test(t)) reply=`${name} kas ve güç odağında evde şınav, squat, row ve core hareketlerini birleştirebiliriz. ${mins||state.duration} dakikalık bir plan için kaliteyi tekrar sayısından önce tutuyorum.`;
  else if(/kilo|yağ|zayıf|zayif/.test(t)) reply=`${name} sürdürülebilir kilo yönetimi için düzenli hareket, yeterli uyku ve dengeli beslenme alışkanlıkları daha önemli. Evde orta tempolu kuvvet + kondisyon kombinasyonu uygundur; aşırı kısıtlama veya aşırı egzersiz hedeflemeyelim.`;
  else if(/sandalye/.test(t)) reply=`Sandalye için uygun hareketler: eğimli şınav ve sağlam bir yüzey uygunsa step-up. Sandalyenin kaymadığından emin ol ve hareket aralığını kontrollü tut.`;
  else if(/dambıl|dambil/.test(t)) reply=`Dambıl varsa floor press, omuz press ve row seçenekleri ekleyebilirim. Ağırlığı formun bozulmadığı bir seviyede tut.`;
  else if(/band|lastik/.test(t)) reply=`Direnç bandıyla row, pull-apart ve glute bridge iyi bir kombinasyon. Bandı aşırı germeden ve güvenli bir bağlantıyla kullan.`;
  else if(/20/.test(t)) reply=`20 dakikaya sıkıştıracaksak 3 dk ısınma + 14 dk ana bölüm + 3 dk soğuma yapalım. 4 temel hareketi 2–3 tur kontrollü tempoda uygulayabilirsin.`;
  else if(/45|60/.test(t)) reply=`45–60 dakikada acele etmeden ısınma + 5–6 ana hareket + set aralarında dinlenme + kısa soğuma şeklinde daha dengeli bir seans kurabiliriz.`;
  else reply=`Tamam${name} — hedefine göre planı otomatik ayarlayabilirim. Hedef (kas / kilo yönetimi / sağlıklı yaşam), süre ve ekipmanı tek cümlede yazman yeterli.`;
  return reply;
}
function addBubble(text,type='ai'){const el=document.createElement('div');el.className=`bubble ${type}`;el.innerHTML=type==='ai'?`<strong>HomeFit AI</strong><br>${text}`:text; $('chatMessages').appendChild(el);$('chatMessages').scrollTop=$('chatMessages').scrollHeight;}

function initCoach(){
  $('coachForm').addEventListener('submit',e=>{e.preventDefault();const v=$('coachInput').value.trim();if(!v)return;addBubble(v,'user');$('coachInput').value='';setTimeout(()=>addBubble(aiReply(v),'ai'),250)});
  qsa('#quickPrompts button').forEach(b=>b.onclick=()=>{addBubble(b.textContent,'user');setTimeout(()=>addBubble(aiReply(b.dataset.prompt),'ai'),250)});
}

function setupGoals(){qsa('.goal-card').forEach(b=>b.addEventListener('click',()=>{state.goal=b.dataset.goal;qsa('.goal-card').forEach(x=>x.classList.remove('active'));b.classList.add('active');saveState();renderPlan();toast('Hedef güncellendi','Programın seçtiğin hedefe göre yeniden düzenlendi.')}));qsa('.goal-card').forEach(b=>b.classList.toggle('active',b.dataset.goal===state.goal));}
function setupScroll(){qsa('[data-scroll]').forEach(b=>b.onclick=()=>document.querySelector(b.dataset.scroll)?.scrollIntoView({behavior:'smooth'}));}
function setupExerciseFilters(){qsa('#exerciseFilters .filter').forEach(b=>b.onclick=()=>{qsa('#exerciseFilters .filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderExercises(b.dataset.filter)});}

function notificationPermission(){
  if(!('Notification' in window)){toast('Bildirim desteklenmiyor','Bu tarayıcı Web Notification API desteklemiyor.');return}
  Notification.requestPermission().then(p=>{toast('Bildirim durumu',p==='granted'?'Bildirim izni verildi.':'Bildirim izni verilmedi.');if(p==='granted') maybeNotify(true);});
}
function reminderMatchesNow(){
  if(!state.reminderEnabled)return false;
  const now=new Date(); const hm=now.toTimeString().slice(0,5); if(hm!==state.reminderTime)return false;
  if(state.reminderDays==='selected'&&!state.days.includes(now.getDay()))return false;
  const key=`${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${hm}`;
  if(state.lastNotificationKey===key)return false; state.lastNotificationKey=key;localStorage.setItem('hf_last_notification',key);return true;
}
function maybeNotify(manual=false){
  if(!state.reminderEnabled&&!manual)return;
  if(manual){
    if(Notification.permission!=='granted')return;
    new Notification('HomeFit AI', {body:'Spor saatin geldi. 3–5 dk ısın ve bugünkü planına başla.'});
    return;
  }
  if(reminderMatchesNow() && Notification.permission==='granted') new Notification('HomeFit AI — Spor Saati',{body:'Haydi spor saati. Bugünkü planın hazır.'});
}
function initReminder(){
  $('reminderEnabled').addEventListener('change',e=>{state.reminderEnabled=e.target.checked;saveState();if(state.reminderEnabled)notificationPermission();});
  $('reminderDays').addEventListener('change',e=>{state.reminderDays=e.target.value;saveState()});
  $('reminderTime').addEventListener('change',e=>{state.reminderTime=e.target.value;saveState()});
  $('saveReminder').onclick=()=>{state.reminderEnabled=true;state.reminderDays=$('reminderDays').value;state.reminderTime=$('reminderTime').value;saveState();notificationPermission();toast('Hatırlatma kaydedildi',`${state.reminderTime} için antrenman alarmı ayarlandı.`)};
  $('notificationBtn').onclick=notificationPermission; setInterval(maybeNotify,15000);
}

function initProfile(){
  const modal=$('profileModal'); $('openProfile').onclick=()=>{modal.classList.remove('hidden');$('profileName').value=state.profileName}; $('closeProfile').onclick=()=>modal.classList.add('hidden');
  $('saveProfile').onclick=()=>{state.profileName=$('profileName').value.trim();state.level=$('profileExperience').value;saveState();initPickers();renderPlan();modal.classList.add('hidden');toast('Profil kaydedildi','Koç önerileri güncellendi.');};
}

function init(){initPickers();setupGoals();setupScroll();setupExerciseFilters();renderPlan();renderExercises();initCoach();initReminder();initProfile();}

document.addEventListener('DOMContentLoaded',init);
