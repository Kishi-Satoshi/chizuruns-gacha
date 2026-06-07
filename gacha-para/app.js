/* ===== GACHA PARA — logic / sound / animation ===== */
'use strict';
const $ = s => document.querySelector(s);
const fmt = n => n.toLocaleString('ja-JP');

/* ---------- probability ---------- */
function tierWeights(t){ return CHARS.filter(c=>c.rarity===t).reduce((s,c)=>s+c.w,0); }
function charRate(c){ return RARITY[c.rarity].tier * (c.w / tierWeights(c.rarity)); }
function pullOne(){
  const r = Math.random()*100;
  const tier = r<RARITY.SP.tier ? 'SP' : r<RARITY.SP.tier+RARITY.R.tier ? 'R' : 'N';
  const pool = CHARS.filter(c=>c.rarity===tier);
  let sum = pool.reduce((s,c)=>s+c.w,0), x = Math.random()*sum;
  for(const c of pool){ x-=c.w; if(x<=0) return c; }
  return pool[pool.length-1];
}

/* ---------- state ---------- */
let state = { coin:START.coin, tic:START.tic, owned:{} };
let _wa = {coin:null,tic:null};
function setNum(el,target,key){
  const cur = parseInt((el.textContent||'').replace(/[^0-9]/g,''))||0;
  if(cur===target){ el.textContent=fmt(target); return; }
  cancelAnimationFrame(_wa[key]); const steps=20; let i=0;
  const tick=()=>{ i++; const e=1-Math.pow(1-i/steps,2); const v=Math.round(cur+(target-cur)*e);
    el.textContent=fmt(v); if(i<steps) _wa[key]=requestAnimationFrame(tick); else el.textContent=fmt(target); };
  _wa[key]=requestAnimationFrame(tick);
}
function updateWallet(){ setNum($('#coinVal'),state.coin,'coin'); setNum($('#ticVal'),state.tic,'tic'); }
function popChip(t){ const el=$(t==='coin'?'#coinChip':'#ticChip'); if(!el)return; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }

/* ---------- figure ---------- */
function figHTML(c,size){
  if(c.img) return `<img src="${c.img}" alt="${c.name}" style="height:${size}px;width:auto;max-width:100%;border-radius:12px;display:block;margin:0 auto;">`;
  const cls = c.rarity==='SP' ? 'fig sp' : 'fig';
  return `<div class="${cls}" style="width:${size}px;height:${size}px;--c:${c.color}"><div class="eye l"></div><div class="eye r"></div><div class="mo"></div></div>`;
}

/* ---------- sound (Web Audio・合成) ---------- */
const SFX = (()=>{
  let ctx=null, master=null, on=true;
  function ac(){ if(!ctx){ try{ ctx=new (window.AudioContext||window.webkitAudioContext)(); master=ctx.createGain(); master.gain.value=.5; master.connect(ctx.destination);}catch(e){return null;} }
    if(ctx.state==='suspended') ctx.resume(); return ctx; }
  function beep(f1,f2,t0,dur,type,vol){ const o=ctx.createOscillator(),g=ctx.createGain();
    o.type=type||'sine'; o.frequency.setValueAtTime(f1,t0); if(f2)o.frequency.exponentialRampToValueAtTime(Math.max(1,f2),t0+dur);
    g.gain.setValueAtTime(.0001,t0); g.gain.exponentialRampToValueAtTime(vol||.3,t0+.012); g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
    o.connect(g); g.connect(master); o.start(t0); o.stop(t0+dur+.03); }
  function noise(t0,dur,vol,lp){ const n=Math.max(1,Math.floor(ctx.sampleRate*dur)),buf=ctx.createBuffer(1,n,ctx.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<n;i++)d[i]=Math.random()*2-1; const s=ctx.createBufferSource(); s.buffer=buf;
    const f=ctx.createBiquadFilter(); f.type='lowpass'; f.frequency.value=lp||1400; const g=ctx.createGain();
    g.gain.setValueAtTime(vol||.2,t0); g.gain.exponentialRampToValueAtTime(.0001,t0+dur); s.connect(f); f.connect(g); g.connect(master); s.start(t0); s.stop(t0+dur); }
  const N={C5:523.3,E5:659.3,G5:784,A5:880,C6:1046.5,E6:1318.5,G6:1568};
  return {
    on:()=>on, setOn(v){on=v;}, init(){ac();},
    tap(){ if(!on||!ac())return; const t=ctx.currentTime; beep(700,1050,t,.07,'triangle',.22); },
    nav(){ if(!on||!ac())return; const t=ctx.currentTime; beep(520,760,t,.06,'triangle',.18); },
    coin(){ if(!on||!ac())return; const t=ctx.currentTime; beep(880,null,t,.07,'square',.15); beep(1320,null,t+.07,.12,'square',.15); },
    spin(){ if(!on||!ac())return; const t=ctx.currentTime; beep(200,520,t,.5,'sawtooth',.10); for(let i=0;i<8;i++) noise(t+i*.055,.025,.07,2600); },
    drop(){ if(!on||!ac())return; const t=ctx.currentTime; beep(380,150,t,.12,'sine',.26); beep(520,260,t+.12,.1,'sine',.16); },
    charge(r){ if(!on||!ac())return; const t=ctx.currentTime; const top=r==='SP'?1000:r==='R'?760:520;
      beep(160,top,t,.62,'sawtooth',.12); for(let i=0;i<16;i++) noise(t+i*(.05-i*.0016),.02,.04+i*.008,3400);
      if(r!=='N') for(let i=0;i<6;i++) beep(1500+Math.random()*900,null,t+.3+i*.05,.1,'sine',.06); },
    impact(){ if(!on||!ac())return; const t=ctx.currentTime; beep(140,60,t,.18,'sine',.3); noise(t,.12,.25,1800); },
    pop(){ if(!on||!ac())return; const t=ctx.currentTime; beep(900,1350,t,.1,'triangle',.22); },
    chimeN(){ if(!on||!ac())return; const t=ctx.currentTime; beep(N.C5,null,t,.18,'sine',.22); beep(N.E5,null,t+.1,.22,'sine',.2); },
    chimeR(){ if(!on||!ac())return; const t=ctx.currentTime; [N.C5,N.E5,N.G5,N.C6].forEach((f,i)=>beep(f,null,t+i*.08,.26,'triangle',.2)); for(let i=0;i<5;i++) beep(1600+Math.random()*900,null,t+.42+i*.05,.12,'sine',.08); },
    jackpot(){ if(!on||!ac())return; const t=ctx.currentTime; [N.C5,N.E5,N.G5,N.C6,N.E6,N.G6].forEach((f,i)=>beep(f,null,t+i*.09,.3,'square',.17));
      [N.C5,N.E5,N.G5].forEach(f=>beep(f,null,t+.62,.7,'triangle',.14)); for(let i=0;i<16;i++) beep(1300+Math.random()*1500,null,t+.7+i*.055,.16,'sine',.08); },
    sparkle(){ if(!on||!ac())return; const t=ctx.currentTime; for(let i=0;i<3;i++) beep(1700+Math.random()*900,null,t+i*.04,.1,'sine',.08); }
  };
})();
function toggleSound(){ SFX.setOn(!SFX.on()); const s=$('#soundState'); if(s)s.textContent=SFX.on()?'ON':'OFF'; if(SFX.on()){ SFX.init(); SFX.tap(); } }

/* ---------- particles ---------- */
const SP_COL=['#ff7ba6','#ffd66b','#9fe88a','#79c9ff','#c79bff'];
function spawnSparks(node,n){ const ch=['✨','⭐','💫','🌟','💖','💛'];
  for(let i=0;i<n;i++){ const s=document.createElement('div'); s.className='spark';
    const a=Math.random()*Math.PI*2, d=70+Math.random()*120;
    s.style.setProperty('--tx',(Math.cos(a)*d).toFixed(0)+'px'); s.style.setProperty('--ty',(Math.sin(a)*d).toFixed(0)+'px');
    s.style.setProperty('--r',(Math.random()*420-210)+'deg'); s.style.fontSize=(13+Math.random()*10)+'px'; s.textContent=ch[i%ch.length];
    node.appendChild(s); requestAnimationFrame(()=>s.classList.add('go')); setTimeout(()=>s.remove(),900); } }
function shockwave(node,color){ const d=document.createElement('div'); d.className='shock'; if(color)d.style.borderColor=color;
  node.appendChild(d); requestAnimationFrame(()=>d.classList.add('go')); setTimeout(()=>d.remove(),650); }
function flashEl(node){ const f=document.createElement('div'); f.className='flashfx go'; node.appendChild(f); setTimeout(()=>f.remove(),520); }
function confettiBurst(node,n,colors){ const shapes=['sq','sq','sq','★','♥','✦'];
  for(let i=0;i<n;i++){ const d=document.createElement('div'); d.className='confetti'; const sh=shapes[i%shapes.length], col=colors[i%colors.length];
    d.style.left=(Math.random()*100)+'%'; d.style.setProperty('--dx',(Math.random()*120-60)+'px');
    if(sh==='sq'){ d.style.background=col; } else { d.textContent=sh; d.style.background='transparent'; d.style.color=col; d.style.width='auto'; d.style.height='auto'; d.style.fontSize=(13+Math.random()*9)+'px'; }
    d.style.animationDuration=(1.3+Math.random()*1.2)+'s'; d.style.animationDelay=(Math.random()*0.4)+'s';
    node.appendChild(d); setTimeout(()=>d.remove(),2900); } }

/* ---------- navigation / toast ---------- */
function go(id){ SFX.nav();
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active', s.id===id));
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('on', b.id==='tab-'+id));
  if(id==='collection') renderCollection(); $('main').scrollTop=0; }
let toastT; function toast(m){ const t=$('#toast'); t.textContent=m; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),1800); }

/* ---------- gacha ---------- */
let spinning=false;
function addOwned(c){ const first=!state.owned[c.id]; state.owned[c.id]=(state.owned[c.id]||0)+1; return first; }
function machineAnim(color){
  const m=$('#machine'), mg=$('#mglow'), dome=m.querySelector('.dome'), base=m.querySelector('.base');
  m.classList.add('spin','shake'); dome.classList.add('tumbling');
  mg.classList.remove('go'); void mg.offsetWidth; mg.classList.add('go');
  SFX.spin();
  setTimeout(()=>{ const cap=document.createElement('div'); cap.className='chute-cap'; cap.style.setProperty('--c',color||'#ff7ab0'); cap.innerHTML='<i></i>';
    base.appendChild(cap); requestAnimationFrame(()=>cap.style.animation='chuteDrop .55s ease-in forwards'); SFX.drop(); setTimeout(()=>cap.remove(),760); },430);
  setTimeout(()=>{ m.classList.remove('spin','shake'); dome.classList.remove('tumbling'); },720);
}
function doSingle(){ if(spinning)return;
  if(state.coin<COST.single){ SFX.tap(); toast(state.tic>0?'コインが足りないよ。チケットで回せるよ！':'コインが足りないよ💦 ショップで増やそう'); return; }
  SFX.tap(); state.coin-=COST.single; updateWallet(); spinSingle(); }
function doTicket(){ if(spinning)return;
  if(state.tic<1){ SFX.tap(); toast('チケットがないよ💦'); return; }
  SFX.tap(); state.tic-=1; updateWallet(); spinSingle(); }
function doTen(){ if(spinning)return;
  if(state.coin<COST.ten){ SFX.tap(); toast('コインが足りないよ💦 ショップで増やそう'); return; }
  SFX.tap(); state.coin-=COST.ten; updateWallet(); spinning=true;
  const results=[]; for(let i=0;i<10;i++){ const c=pullOne(); const first=addOwned(c); results.push({c,first}); }
  const best=results.reduce((a,b)=>({SP:3,R:2,N:1})[b.c.rarity]>({SP:3,R:2,N:1})[a.c.rarity]?b:a);
  machineAnim('#ffd66b');
  setTimeout(()=>showCharge(best.c.rarity,()=>{ showTen(results,best); spinning=false; }),460);
}
function spinSingle(){ spinning=true; const c=pullOne(); machineAnim(c.color);
  setTimeout(()=>showCharge(c.rarity,()=>{ const first=addOwned(c); showReveal(c,first); spinning=false; }),460); }

/* charge build-up (anticipation) */
function showCharge(rarity,cb){
  const ch=$('#charge');
  const col = rarity==='SP' ? 'rgba(255,170,215,.7)' : rarity==='R' ? 'rgba(255,200,70,.62)' : 'rgba(110,175,255,.48)';
  ch.style.setProperty('--cc', col);
  ch.classList.remove('on'); void ch.offsetWidth; ch.classList.add('on');
  SFX.charge(rarity);
  setTimeout(()=>{ ch.classList.remove('on'); cb(); }, rarity==='N'?560:680);
}

/* ---------- reveal (single) ---------- */
function showReveal(c, first){
  const R=RARITY[c.rarity], sp=c.rarity==='SP';
  const canAfford = state.coin>=COST.single || state.tic>0;
  $('#revealBody').innerHTML = `
    <div class="reveal-root" data-r="${c.rarity}">
      <div class="rflood"></div><div class="rays2"></div>
      <div class="rstage" id="rstage">
        <div class="frame"></div>
        <div class="capanim ${R.cls}" id="capanim" style="--c:${c.color}"><div class="ct"></div><div class="seam"></div><div class="cb"></div></div>
        <div class="figwrap" id="figwrap">${figHTML(c, sp?212:196)}</div>
        ${sp?'':`<div class="stamp">${R.label}</div>`}
      </div>
      <div class="rinfo" id="rinfo">
        ${sp?'<div class="jackpot">あたり!!</div>':''}
        ${first?'<span class="newbadge">NEW!</span><br>':''}
        <span class="rlabel ${R.cls}">${R.label}</span>
        <div class="rstars">${R.stars}</div>
        ${c.img?'':`<div class="rname">${c.name}</div><div class="rtrait">${c.trait}</div>`}
        <div class="ractions">
          <button class="ra-again" ${canAfford?'':'disabled'} onclick="againFrom()">もう1回</button>
          <button class="ra-close" onclick="SFX.tap();close_('reveal')">とじる</button>
        </div>
      </div>
    </div>`;
  $('#reveal').classList.toggle('reveal-sp', sp);
  $('#reveal').classList.add('show');
  const root=$('#revealBody').firstElementChild, stage=$('#rstage'), cap=$('#capanim');
  let opened=false, done=false, timers=[];
  function openFx(){ if(opened)return; opened=true; cap.classList.add('opening'); SFX.pop();
    if(c.rarity!=='N') SFX.impact();
    shockwave(stage, sp?'#ffd66b':(c.rarity==='R'?'#ffd66b':'#bcd8ff'));
    spawnSparks(stage, sp?16:(c.rarity==='R'?10:5)); if(sp) flashEl(stage); }
  function revealNow(){ if(done)return; done=true; timers.forEach(clearTimeout); openFx();
    root.classList.add('revealed'); $('#figwrap').classList.add('shine-on'); $('#rinfo').style.opacity=1;
    if(sp){ confettiBurst($('#reveal'),66,SP_COL); setTimeout(()=>spawnSparks(stage,12),120); SFX.jackpot(); }
    else if(c.rarity==='R'){ confettiBurst($('#reveal'),26,['#ffd66b','#ffab2e','#ff7ba6']); SFX.chimeR(); }
    else { SFX.chimeN(); } }
  timers.push(setTimeout(()=>SFX.drop(),180));
  timers.push(setTimeout(openFx,720));
  timers.push(setTimeout(revealNow,1000));
  stage.onclick=revealNow;   // タップでスキップ
}
function againFrom(){ close_('reveal'); setTimeout(()=>{ if(state.coin>=COST.single) doSingle(); else if(state.tic>0) doTicket(); },180); }

/* ---------- reveal (ten) ---------- */
function showTen(results, best){
  const rcount=results.filter(r=>r.c.rarity!=='N').length;
  const cells=results.map((r,i)=>{ const R=RARITY[r.c.rarity]; const glow=r.c.rarity!=='N'?`glow ${R.cls==='sp'?'sp':''}`:'';
    return `<div class="ten-cell"><div class="mini ${glow}" style="animation-delay:${i*0.09}s">${figHTML(r.c,52)}</div>
      <div class="tn">${r.c.name}${r.first?' <span style="color:#ffd66b">N</span>':''}</div></div>`; }).join('');
  const canAfford = state.coin>=COST.ten;
  $('#revealBody').innerHTML = `
    <div class="reveal-root" data-r="${best.c.rarity}">
      ${best.c.rarity==='SP'?'<div class="rflood"></div>':''}
      <h2>10連 けっか</h2>
      ${best.c.rarity==='SP'?'<div style="text-align:center"><div class="jackpot" style="font-size:26px">あたり!!</div></div>':''}
      <div class="ten-grid">${cells}</div>
      <div class="ten-sum">レア以上 ${rcount} 体！</div>
      <div class="ractions">
        <button class="ra-again" ${canAfford?'':'disabled'} onclick="SFX.tap();close_('reveal');setTimeout(()=>{if(state.coin>=COST.ten)doTen();},180)">もう10連</button>
        <button class="ra-close" onclick="SFX.tap();close_('reveal')">とじる</button>
      </div>
    </div>`;
  $('#reveal').classList.toggle('reveal-sp', best.c.rarity==='SP');
  $('#reveal').classList.add('show');
  results.forEach((r,i)=>setTimeout(()=>{ r.c.rarity==='N'?SFX.tap():SFX.sparkle(); }, 120+i*90));
  setTimeout(()=>{ if(best.c.rarity==='SP'){ confettiBurst($('#reveal'),66,SP_COL); spawnSparks($('#revealBody'),14); SFX.jackpot(); }
    else if(rcount>0){ confettiBurst($('#reveal'),26,['#ffd66b','#ffab2e','#ff7ba6']); SFX.chimeR(); } else { SFX.chimeN(); } }, 120+results.length*90+120);
}

/* ---------- collection ---------- */
function renderCollection(){
  const total=CHARS.length, got=Object.keys(state.owned).length;
  $('#compTxt').textContent=`${got} / ${total}`; $('#compBar').style.width=(got/total*100)+'%';
  const order={SP:0,R:1,N:2}; const sorted=[...CHARS].sort((a,b)=>order[a.rarity]-order[b.rarity]);
  $('#collGrid').innerHTML = sorted.map(c=>{ const cnt=state.owned[c.id];
    if(!cnt) return `<div class="cell locked"><div class="lockfig" style="width:64px;height:64px;font-size:26px">?</div><div class="nm">？？？</div></div>`;
    const R=RARITY[c.rarity];
    return `<div class="cell ${R.cls}" onclick="showDetail('${c.id}')"><span class="rb ${R.cls}">${R.label}</span>${cnt>1?`<span class="cnt">×${cnt}</span>`:''}
      ${c.img ? figHTML(c,118) : `${figHTML(c,64)}<div class="nm">${c.name}</div><div class="st">${R.stars}</div>`}</div>`;
  }).join('');
}
function showDetail(id){ SFX.tap();
  const c=CHARS.find(x=>x.id===id), R=RARITY[c.rarity], cnt=state.owned[c.id];
  $('#detailBody').innerHTML = `${figHTML(c,196)}
    <div style="margin-top:10px"><span class="rlabel ${R.cls}">${R.label}</span></div>
    <div class="rstars">${R.stars}</div>
    ${c.img?'':`<div class="rname">${c.name}</div><div class="rtrait" style="margin-bottom:8px">${c.trait}</div>`}
    <div style="font-weight:800;margin-top:6px">持っている数：${cnt}</div>
    <div class="note" style="margin-top:6px">提供割合：${charRate(c).toFixed(2)}%</div>
    <button class="mclose" onclick="close_('detail')">とじる</button>`;
  $('#detail').classList.add('show');
}

/* ---------- rates ---------- */
function showRates(){ SFX.tap(); let html='';
  ['SP','R','N'].forEach(t=>{ const R=RARITY[t];
    html+=`<div class="rate-head ${R.cls}"><span>${R.stars} ${R.label}</span><span>${R.tier}%</span></div>`;
    CHARS.filter(c=>c.rarity===t).sort((a,b)=>charRate(b)-charRate(a)).forEach(c=>{ html+=`<div class="rate-row"><span>${c.name}</span><span>${charRate(c).toFixed(2)}%</span></div>`; }); });
  html+=`<p class="note" style="margin-top:12px">天井なし（毎回くじ引き）。同じレアリティの中では人気キャラほど出にくい傾斜にしています。</p>`;
  $('#ratesBody').innerHTML=html; $('#rates').classList.add('show');
}

/* ---------- shop / settings ---------- */
function give(type,amt){ SFX.coin(); if(type==='coin') state.coin+=amt; else state.tic+=amt; updateWallet(); popChip(type==='coin'?'coin':'tic'); toast(type==='coin'?`コイン +${fmt(amt)}！`:`チケット +${amt}！`); }
function resetAll(){ state={coin:START.coin, tic:START.tic, owned:{}}; updateWallet(); renderCollection(); toast('リセットしました'); }
function close_(id){ $('#'+id).classList.remove('show'); }

/* ---------- decorative ---------- */
function buildBalls(){ const colors=['#ff5d5d','#ffd23f','#5bb8ff','#7fd86a','#ff7ab0','#b18cff','#ffa45b','#6fd3c9'];
  const pos=[[8,4],[30,2],[52,6],[72,3],[18,30],[40,28],[60,32],[78,30],[6,58],[28,56],[50,60],[70,56],[20,84],[44,82],[64,86]];
  $('#balls').innerHTML=pos.map((p,i)=>`<div class="ball" style="left:${p[0]}%; bottom:${p[1]}px; --c:${colors[i%colors.length]}; animation-delay:${(-i*0.17).toFixed(2)}s"><i></i></div>`).join(''); }
function buildFloat(){ const layer=document.createElement('div'); layer.className='floatfx'; const ch=['✨','⭐','💫','🌟','💛'];
  for(let i=0;i<14;i++){ const b=document.createElement('b'); b.textContent=ch[i%ch.length];
    b.style.left=(Math.random()*100)+'%'; b.style.fontSize=(10+Math.random()*13)+'px';
    b.style.animationDuration=(7+Math.random()*8)+'s'; b.style.animationDelay=(-Math.random()*14)+'s'; layer.appendChild(b); }
  $('#app').appendChild(layer); }
function buildPickup(){ const c=CHARS.find(x=>x.id===FEATURED)||CHARS[0];
  $('#pickupFig').innerHTML=`<img src="${c.img}" alt="${c.name}">`;
  $('#pickupName').innerHTML=`今だけ注目！ <b>${c.name}</b>`;
  $('#pickupRate').textContent=`${RARITY[c.rarity].label}・提供割合 ${charRate(c).toFixed(2)}%`; }

/* ---------- init ---------- */
buildBalls(); buildFloat(); buildPickup(); updateWallet();
document.addEventListener('pointerdown', ()=>SFX.init(), {once:true});
