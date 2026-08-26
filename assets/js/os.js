/* ============================================================
 * 《最后一次开机》 窗口管理器 WM + 游戏框架 Game
 * 拖拽/置顶/最小化/最大化/任务栏联动 + 线索系统
 * ============================================================ */

/* ---------------- Game 基础框架 ---------------- */
const Game = {
  PREFIX: 'lb_',
  CLUES: [
    { key:'photo',   label:'园舍照片' },  // 养育园旧照+废墟附件
    { key:'tape',    label:'录音转写' },
    { key:'ledger',  label:'捐款账目' },
    { key:'kword',   label:'K的证词' },
    { key:'record',  label:'备案档案' },  // LX-1998-117
    { key:'transfer',label:'转院档案' }   // ZY-0034
  ],
  PWD: {
    admin: '960601',      // XP 登录
    zip: '半掩门',         // 加密附件
    editor: 'CM0327',     // 采编系统工号
    chain: '117-0034'     // 证据链编号
  },
  HINTS: {
    admin: '便签上的字迹被灯光照亮：「密码别再用咱仨相遇的日子了。」……可"咱仨相遇"是哪天？《给妈妈的信》里似乎写过。',
    zip: 'K 在邮件里说"老规矩"。陈默的博客第一篇写过他们的暗号——是那家酒吧的名字。论坛上有人提起过它。',
    editor: '工牌。扫描件文件夹里那张工作证，编号就印在右下角。',
    chain: '两个编号各取一半：养育园的备案号取后三位，转院档案取后四位。'
  },
  failCount: {}, _timers: [],

  lsGet(k){ try{return localStorage.getItem(this.PREFIX+k);}catch(e){return null;} },
  lsSet(k,v){ try{localStorage.setItem(this.PREFIX+k,v);}catch(e){} },
  lsDel(k){ try{localStorage.removeItem(this.PREFIX+k);}catch(e){} },

  hasClue(k){ return !!this.lsGet('clue_'+k); },
  flag(k){ return !!this.lsGet('flag_'+k); },
  setFlag(k){ this.lsSet('flag_'+k,'1'); },
  clueCount(){ return this.CLUES.filter(c=>this.hasClue(c.key)).length; },

  mark(k, quiet){
    if (!this.CLUES.some(c=>c.key===k)) return;
    if (!this.hasClue(k)){
      this.lsSet('clue_'+k,'1');
      if (!quiet){
        const m = this.CLUES.find(c=>c.key===k);
        this.toast('✦ 证据入链：「'+m.label+'」');
        this.renderHud();
        try{ Sfx.chime(); }catch(e){}
      }
    }
  },
  renderHud(){
    let h = document.getElementById('evidence-hud');
    if (!h){
      h = document.createElement('div'); h.id='evidence-hud';
      h.innerHTML='<span class="num">0</span>/6 证据链 <div class="bar"><div class="fill"></div></div>';
      document.body.appendChild(h);
    }
    const n=this.clueCount();
    h.querySelector('.num').textContent=n;
    h.querySelector('.fill').style.width=(n/6*100)+'%';
  },
  resetAll(){
    ['admin','zip','editor','chain'].forEach(()=>{});
    this.CLUES.forEach(c=>this.lsDel('clue_'+c.key));
    ['note_read','mail_intro','dialed','bsod_seen','floppy_in','ending_c_unlocked','final_choice'].forEach(f=>this.lsDel('flag_'+f));
  },

  verify(input,key,onOk,onFail){
    const v=String(input||'').trim().toLowerCase();
    const e=String(this.PWD[key]).toLowerCase();
    if(v===e){ this.failCount[key]=0; onOk&&onOk(); return true; }
    this.failCount[key]=(this.failCount[key]||0)+1;
    const n=this.failCount[key];
    if(n>=3 && this.HINTS[key]) this.monologue(this.HINTS[key],9000);
    onFail&&onFail(n);
    return false;
  },

  toast(msg,dur){
    dur=dur||2400;
    let h=document.getElementById('toast-holder');
    if(!h){h=document.createElement('div');h.id='toast-holder';document.body.appendChild(h);}
    const t=document.createElement('div');t.className='toast';t.textContent=msg;h.appendChild(t);
    setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),600);},dur);
  },
  monologue(text,dur){
    dur=dur||6500;
    document.querySelectorAll('.monologue').forEach(el=>el.remove());
    const el=document.createElement('div');el.className='monologue';
    el.innerHTML='<span class="q">「</span>'+text+'<span class="q">」</span>';
    document.body.appendChild(el);
    setTimeout(()=>{el.classList.add('fade-out');setTimeout(()=>el.remove(),1000);},dur);
  },
  balloon(title,text,dur){
    dur=dur||6000;
    const b=document.createElement('div');b.className='balloon';
    b.innerHTML='<b>💡 '+title+'</b>'+text;
    document.body.appendChild(b);
    setTimeout(()=>b.remove(),dur);
  },

  Timeline:{
    at(d,fn){const id=setTimeout(fn,d);Game._timers.push(id);return id;},
    every(d,fn){const id=setInterval(fn,d);Game._timers.push(id);return id;},
    clear(){Game._timers.forEach(id=>{clearTimeout(id);clearInterval(id);});Game._timers=[];}
  },

  goto(url){
    document.body.style.transition='filter .45s ease';
    document.body.style.filter='brightness(0.15)';
    setTimeout(()=>location.href=url,480);
  },
  injectFx(opts){
    opts=opts||{};
    if(opts.scanlines!==false){
      const s=document.createElement('div');s.className='fx-scanlines';document.body.appendChild(s);
    }
    if(opts.vignette!==false){
      const v=document.createElement('div');v.className='fx-vignette';document.body.appendChild(v);
    }
    this.renderHud();
  }
};
window.addEventListener('beforeunload',()=>Game.Timeline.clear());

/* ---------------- 音效合成器 ---------------- */
const Sfx = {
  ctx:null, started:false,
  ensure(){
    if(this.started) return true;
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC) return false;
    try{
      this.ctx=new AC();
      this.master=this.ctx.createGain();this.master.gain.value=.85;
      this.master.connect(this.ctx.destination);
      this.started=true;return true;
    }catch(e){return false;}
  },
  tone(f,when,dur,vol,type){
    if(!this.started)return;
    vol=vol==null?.14:vol;type=type||'sine';dur=dur||.2;
    const o=this.ctx.createOscillator(),g=this.ctx.createGain();
    o.type=type;o.frequency.value=f;
    const t=this.ctx.currentTime+when;
    g.gain.setValueAtTime(.0001,t);
    g.gain.exponentialRampToValueAtTime(vol,t+.02);
    g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g);g.connect(this.master);o.start(t);o.stop(t+dur+.05);
  },
  noise(when,dur,vol,fLow,fHigh){
    if(!this.started)return;
    const len=Math.ceil(this.ctx.sampleRate*dur);
    const buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
    const src=this.ctx.createBufferSource();src.buffer=buf;
    const bp=this.ctx.createBiquadFilter();bp.type='bandpass';
    bp.frequency.value=(fLow+fHigh)/2;bp.Q.value=(fHigh-fLow)/2/fLow;
    const g=this.ctx.createGain();const t=this.ctx.currentTime+when;
    g.gain.setValueAtTime(vol,t);g.gain.linearRampToValueAtTime(.0001,t+dur);
    src.connect(bp);bp.connect(g);g.connect(this.master);src.start(t);
  },
  click(){ this.tone(2600,0,.03,.05,'square'); },
  chime(){ this.tone(880,0,.3,.09);this.tone(1320,.12,.4,.07); },
  errBeep(){ this.tone(220,0,.28,.13,'square');this.tone(180,.22,.32,.11,'square'); },
  /* 56K 拨号握手：拨号音→按键→应答载波→白噪啁啾 */
  dialup(){
    if(!this.started)return;
    // 拨号音 440+350 混合 1.6s
    this.tone(440,0,1.6,.06);this.tone(350,0,1.6,.05);
    // 七位号码 DTMF
    const num='4413827';
    const rows={'1':[697,1209],'2':[697,1336],'3':[697,1477],'4':[770,1209],'5':[770,1336],'6':[770,1477],'7':[852,1209],'8':[852,1336]};
    let t=1.9;
    num.split('').forEach(d=>{const p=rows[d];if(p){this.tone(p[0],t,.14,.08);this.tone(p[1],t,.14,.08);}t+=.24;});
    // 应答：2100Hz 应答音
    this.tone(2100,t+.6,.9,.06);
    // 载波协商噪声
    this.noise(t+1.6,1.2,.10,900,2600);
    this.tone(1200,t+1.7,.5,.05,'sawtooth');
    this.noise(t+3.0,1.4,.12,1400,3200);
    // 最终稳定载波嘶声渐弱
    this.noise(t+4.5,2.2,.07,1500,3400);
    return t+6.5; // 总时长秒数
  },
  startup(){
    // XP 风格开机四音
    this.tone(523.25,0,.5,.12);this.tone(659.25,.42,.5,.12);
    this.tone(783.99,.84,.55,.12);this.tone(1046.5,1.26,1.1,.13);
  },
  shutdownSnd(){
    this.tone(1046.5,0,.4,.11);this.tone(783.99,.35,.45,.1);
    this.tone(659.25,.72,.45,.1);this.tone(523.25,1.08,.9,.11);
  }
};

/* ---------------- 窗口管理器 WM ---------------- */
const WM = {
  wins:{}, zTop:100, seq:0,

  create(opt){
    // opt: {id,title,icon,width,height,x,y,content(html|node),onClose,noTask}
    const id = opt.id || ('w'+(++this.seq)+Date.now());
    if (this.wins[id]) { this.close(id); } // 已存在则关闭重建，保证内容与事件全新

    const w = document.createElement('div');
    w.className='win active'; w.dataset.wid=id;
    const wd=opt.width||520;
    w.style.width=wd+'px';
    // 高度策略：'auto' 表示随内容收缩，杜绝空白；数字则固定
    if(opt.height==='auto'){ w.style.height='auto'; w.classList.add('autosize'); }
    else { w.style.height=(opt.height||380)+'px'; }
    const maxX=Math.max(20,(window.innerWidth-wd)-16);
    const maxY=Math.max(20,(window.innerHeight-70-(parseInt(opt.height)||300)));
    w.style.left=(opt.x!=null?opt.x:40+(Object.keys(this.wins).length%6)*26)+'px';
    w.style.top =(opt.y!=null?opt.y:30+(Object.keys(this.wins).length%6)*22)+'px';

    w.innerHTML =
      '<div class="titlebar">'+
        '<span class="t-ico">'+(opt.icon||'📁')+'</span>'+
        '<span class="t-text">'+opt.title+'</span>'+
        '<div class="t-btns">'+
          '<div class="tb min" title="最小化">0</div>'+
          (opt.noMax?'':'<div class="tb max" title="最大化">1</div>')+
          '<div class="tb close" title="关闭">r</div>'+
        '</div>'+
      '</div>'+
      '<div class="win-body"></div>';
    if (typeof opt.content==='string') w.querySelector('.win-body').innerHTML=opt.content;
    else if (opt.content) w.querySelector('.win-body').appendChild(opt.content);

    document.getElementById('desktop').appendChild(w);
    w.style.display='flex'; // ★ 关键：CSS 默认 display:none，创建后立即可见
    const rec={el:w,title:opt.title,icon:opt.icon||'📁',onClose:opt.onClose,minimized:false};
    this.wins[id]=rec;

    // 任务栏按钮
    if (!opt.noTask){
      const tb=document.createElement('div');
      tb.className='task-btn active';tb.dataset.wid=id;
      tb.innerHTML='<span>'+rec.icon+'</span><span style="overflow:hidden;text-overflow:ellipsis;">'+opt.title+'</span>';
      tb.onclick=()=>this.taskClick(id);
      document.getElementById('task-buttons').appendChild(tb);
      rec.taskBtn=tb;
    }

    // 拖拽 & 焦点 & 按钮
    const bar=w.querySelector('.titlebar');
    bar.addEventListener('pointerdown',e=>{
      if(e.target.classList.contains('tb'))return;
      this.focus(id);this.startDrag(e,w);
    });
    w.addEventListener('pointerdown',()=>this.focus(id),true);
    w.querySelector('.min').onclick=e=>{e.stopPropagation();this.minimize(id);};
    const mx=w.querySelector('.max'); if(mx) mx.onclick=e=>{e.stopPropagation();this.toggleMax(w);};
    w.querySelector('.close').onclick=e=>{e.stopPropagation();this.close(id);};

    this.focus(id);
    return rec;
  },

  focus(id){
    Object.entries(this.wins).forEach(([k,r])=>{
      const act=k===id;
      r.el.classList.toggle('active',act);
      r.el.classList.toggle('inactive',!act);
      r.el.style.zIndex=act?(++this.zTop):r.el.style.zIndex;
      if(r.taskBtn)r.taskBtn.classList.toggle('active',act&&!r.minimized);
    });
  },

  startDrag(e,el){
    const sx=e.clientX,sy=e.clientY;
    const ol=el.offsetLeft,ot=el.offsetTop;
    el.setPointerCapture(e.pointerId);
    const move=ev=>{
      el.style.left=Math.max(-el.offsetWidth+90,ol+ev.clientX-sx)+'px';
      el.style.top =Math.max(0,ot+ev.clientY-sy)+'px';
    };
    const up=()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);};
    el.addEventListener('pointermove',move);
    el.addEventListener('pointerup',up);
  },

  toggleMax(el){
    if(el.dataset.maxed==='1'){
      el.style.cssText=el.dataset.restore;el.dataset.maxed='';
    }else{
      el.dataset.restore=el.style.cssText;
      el.style.cssText+='left:0;top:0;width:100%;height:calc(100% - 30px);border-radius:0;';
      el.dataset.maxed='1';
    }
  },

  minimize(id){
    const r=this.wins[id];if(!r)return;
    r.minimized=true;r.el.style.display='none';
    if(r.taskBtn)r.taskBtn.classList.remove('active');
  },
  taskClick(id){
    const r=this.wins[id];if(!r)return;
    if(r.minimized){r.el.style.display='flex';r.minimized=false;this.focus(id);}
    else{
      const isTop=r.el.classList.contains('active')&&+r.el.style.zIndex===WM.zTop;
      if(isTop)this.minimize(id);else this.focus(id);
    }
  },

  close(id){
    const r=this.wins[id];if(!r)return;
    r.onClose&&r.onClose();
    r.el.remove();r.taskBtn&&r.taskBtn.remove();
    delete this.wins[id];
  },

  closeAll(){Object.keys(this.wins).forEach(id=>this.close(id));},

  /* 对话框（替代 alert） */
  dialog(icon,text,buttons){
    buttons=buttons||[{label:'确定',value:true}];
    return new Promise(res=>{
      const map=(typeof SVGI!=='undefined')?{
        info:SVGI.info,warn:SVGI.warn,lock:SVGI.lock,
        recycle:SVGI.recycle,floppy:SVGI.floppy,cd:SVGI.cd
      }:{};
      const ic=map[icon]||'';
      const mask=document.createElement('div');mask.className='dialog-mask';
      const d=document.createElement('div');d.className='xp-dialog';
      d.style.left='50%';d.style.top='34%';d.style.transform='translate(-50%,-50%)';
      d.innerHTML='<div class="titlebar"><span class="t-ico">'+(ic||'')+'</span><span class="t-text">提示</span>'+
        '<div class="t-btns"><div class="tb close">r</div></div></div>'+
        '<div class="dlg-body">'+(ic?'<span class="dlg-icon">'+ic+'</span>':'')+'<span>'+text+'</span></div>'+
        '<div class="dlg-btns"></div>';
      const btns=d.querySelector('.dlg-btns');
      const finish=v=>{mask.remove();d.remove();res(v);};
      buttons.forEach(b=>{
        const bt=document.createElement('button');bt.className='xp-button';bt.textContent=b.label;
        bt.onclick=()=>finish(b.value);btns.appendChild(bt);
      });
      d.querySelector('.close').onclick=()=>finish(null);
      mask.onclick=e=>{if(e.target===mask)finish(null);};
      document.getElementById('desktop').appendChild(mask);
      document.getElementById('desktop').appendChild(d);
    });
  },

  ctxMenu(x,y,items){
    let m=document.getElementById('ctxmenu');
    if(!m){m=document.createElement('div');m.id='ctxmenu';document.body.appendChild(m);
      const kill=()=>{m.style.display='none';};
      document.addEventListener('pointerdown',e=>{if(!m.contains(e.target))kill();});
      window.addEventListener('blur',kill);
    }
    m.innerHTML='';
    items.forEach(it=>{
      if(it==='-'){m.appendChild(document.createElement('hr'));return;}
      const d=document.createElement('div');d.textContent=it.label;
      if(it.disabled)d.className='dis';else d.onclick=()=>{m.style.display='none';it.fn&&it.fn();};
      m.appendChild(d);
    });
    m.style.display='block';
    m.style.left=Math.min(x,window.innerWidth-m.offsetWidth-6)+'px';
    m.style.top =Math.min(y,window.innerHeight-m.offsetHeight-6)+'px';
  }
};

/* 开机音效在首次手势后可用 */
document.addEventListener('DOMContentLoaded',()=>{
  document.body.addEventListener('pointerdown',()=>Sfx.ensure(),{once:true});
});