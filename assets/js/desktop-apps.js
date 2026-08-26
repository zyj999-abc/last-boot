/* ============================================================
 * 《最后一次开机》 桌面应用层（窗口内容与剧情交互）
 * ============================================================ */

/* ============ 初始化 ============ */
const IS_GUEST = location.search.indexOf('guest')>=0 || sessionStorage.getItem('lb_guest')==='1';
const DESK = document.getElementById('desktop');

window.addEventListener('DOMContentLoaded',()=>{
  Game.injectFx({scanlines:false,vignette:false}); // 仅挂进度HUD，不加雾化层
  buildDesktop();
  bindGlobal();
  const ck=document.getElementById('clock');
  ck.textContent='23:47';
  ck.title='系统时间停留在 2003-12-31 23:47';

  if(IS_GUEST){
    document.getElementById('guest-strip').classList.add('show');
    document.getElementById('sm-user').textContent='Guest';
    setTimeout(()=>Game.monologue('来宾模式。大部分门都锁着……但也许，正需要这样慢慢看。',6000),900);
  }else{
    const av=document.getElementById('sm-avatar');
    if(av)av.style.background="url('assets/img/img-chenmo.jpg') center/cover";
    setTimeout(()=>{Game.balloon('江州邮局','您有 1 封未读邮件。双击桌面「江州邮局」查看。',8000);},2600);
    setTimeout(()=>Game.monologue('雪还在下。这台机器的主人，去哪儿了？',6000),1000);
  }
});

function logout(){ WM.closeAll(); Game.goto('login.html'); }
function doShutdown(){ Game.goto('shutdown.html'); }

/* ============ 桌面图标 ============ */
const DESK_ICONS = {
  mycomp:'mycomp', mydocs:'folder', mail:'mail',
  ie:'ie', notepad:'note', recycle:'recycle',
  media:'wmp', calendar:'cal', recent:'folder'
};
function buildDesktop(){
  const icons = IS_GUEST ? [
    {id:'calendar', label:'日历', x:26,y:26},
    {id:'recent',   label:'最近使用的文档', x:26,y:126},
    {id:'mydocs',   label:'我的文档', x:26,y:226},
    {id:'mail',     label:'江州邮局', x:26,y:326},
    {id:'ie',       label:'Internet Explorer', x:26,y:426},
    {id:'recycle',  label:'回收站', x:26,y:526}
  ] : [
    {id:'mycomp', label:'我的电脑', x:26,y:26},
    {id:'mydocs', label:'我的文档', x:26,y:126},
    {id:'mail',   label:'江州邮局', x:26,y:226},
    {id:'ie',     label:'Internet Explorer', x:26,y:326},
    {id:'notepad',label:'记事本', x:26,y:426},
    {id:'recycle',label:'回收站', x:26,y:526},
    {id:'media',  label:'媒体播放器', x:128,y:26}
  ];
  icons.forEach(cfg=>{
    const d=document.createElement('div');
    d.className='dicon';d.style.left=cfg.x+'px';d.style.top=cfg.y+'px';
    d.innerHTML='<div class="ico">'+svgIcon(DESK_ICONS[cfg.id]||'app')+'</div><span class="lbl">'+cfg.label+'</span>';
    d.ondblclick=()=>openApp(cfg.id);
    d.onclick=e=>{document.querySelectorAll('.dicon').forEach(x=>x.classList.remove('selected'));d.classList.add('selected');};
    d.oncontextmenu=e=>{
      e.preventDefault();
      WM.ctxMenu(e.clientX,e.clientY,[
        {label:'打开',fn:()=>openApp(cfg.id)},
        '-',
        {label:'属性',fn:()=>WM.dialog(IS_GUEST?'lock':'info',(IS_GUEST)?'您没有足够的权限查看该项目。<br>请使用管理员账户登录。':'「'+cfg.label+'」<br>类型：系统对象<br>创建时间：2001-08-17')}
      ]);
    };
    DESK.appendChild(d);
  });

  DESK.oncontextmenu=e=>{
    if(e.target!==DESK)return;
    e.preventDefault();
    WM.ctxMenu(e.clientX,e.clientY,[
      {label:'刷新',fn:()=>{DESK.style.opacity=.6;setTimeout(()=>DESK.style.opacity=1,180);}},
      '-',
      {label:'属性',fn:()=>WM.dialog('info','江州 Union P4X-400<br>Pentium(R) 4 2.40GHz<br>512 MB 内存<br><br>系统：Windows XP Professional（虚构致敬版）')}
    ]);
  };
}

function lockTip(){
  Sfx.errBeep();
  WM.dialog('lock','该功能在<b>来宾账户</b>下不可用。<br><br>提示：主人的密码线索，也许就藏在你能打开的东西里。');
}

/* ============ 应用分发 ============ */
function openApp(id){
  try{Sfx.click();}catch(e){}
  const map={
    mycomp:function(){appMyComputer();},
    mydocs:function(){IS_GUEST?lockTip():appExplorer();},
    recycle:function(){IS_GUEST?lockTip():appRecycle();},
    mail:function(){IS_GUEST?lockTip():appMail();},
    ie:function(){IS_GUEST?lockTip():appIE();},
    notepad:function(){appNotepad(null);},
    media:function(){appMedia();},
    calendar:function(){appCalendar();},
    recent:function(){appRecentDocs();}
  };
  (map[id]||function(){})();
}

/* ============ 我的电脑 / 软盘 / C盘 ============ */
const TREE_ROOT=[
  {name:'本地磁盘 (C:)', ico:'hdd', act:function(){appDriveC();}},
  {name:'3.5 软盘 (A:)', ico:'floppy', act:function(){Game.flag('floppy_in')?appFloppy():floppyPrompt();}},
  {name:'CD 驱动器 (D:)', ico:'cd', act:function(){WM.dialog('cd','请插入光盘。');}},
  {name:'我的文档', ico:'folder', act:function(){appExplorer();}}
];
function appMyComputer(){
  const body=document.createElement('div');
  body.innerHTML='<div class="explorer"><div class="ex-side">'+
    '<div class="ex-panel"><h4>系统任务</h4><div>查看系统信息</div><div>添加/删除程序</div></div>'+
    '<div class="ex-panel"><h4>其它位置</h4><div onclick="openApp(\'mydocs\')">我的文档</div><div onclick="openApp(\'recycle\')">回收站</div></div>'+
    '</div><div class="ex-main"><div class="fgrid" id="mc-grid"></div></div></div>';
  WM.create({id:'mycomp',title:'我的电脑',icon:svgIcon('mycomp'),width:640,height:430,content:body});
  const g=body.querySelector('#mc-grid');
  TREE_ROOT.forEach(function(it){
    const f=document.createElement('div');f.className='fitem';
    f.innerHTML='<div class="fi">'+svgIcon(it.ico)+'</div><div class="fn">'+it.name+'</div>';
    f.ondblclick=it.act;
    g.appendChild(f);
  });
}
function floppyPrompt(){
  if(Game.flag('list_seen')){
    WM.dialog('floppy','软盘驱动器 A: 中没有磁盘。<br><br>纸箱里那张标注 <b>ZY-0034</b> 的软盘，就在手边。',
      [{label:'插入软盘',value:1},{label:'取消',value:null}]
    ).then(function(v){
      if(v){
        Game.setFlag('floppy_in');
        Game.toast('咔哒。软盘已插入。');
        Game.Timeline.at(500,function(){appFloppy();});
      }
    });
  }else{
    WM.dialog('floppy','请将磁盘插入驱动器 A:。<br><br><span style="color:#666">（房东移交清单里提到过一张软盘……它此刻在哪里？）</span>');
  }
}
function appFloppy(){
  if(!Game.flag('floppy_in')){floppyPrompt();return;}
  const body=document.createElement('div');
  body.innerHTML='<div class="crumbbar">3.5 软盘 (A:)</div><div class="fgrid" id="fl-grid" style="padding:10px;"></div>';
  WM.create({id:'a-drive',title:'3.5 软盘 (A:)',icon:svgIcon('floppy'),width:520,height:340,content:body});
  const g=body.querySelector('#fl-grid');
  FLOPPY.files.forEach(function(f){
    const el=document.createElement('div');el.className='fitem';
    el.innerHTML='<div class="fi">'+svgIcon(f.kind==='img'?'pic':'txt')+'</div><div class="fn">'+f.name+'</div>';
    el.ondblclick=function(){
      if(f.kind==='txt'){appNotepad({title:f.name,text:f.body});markTransfer();}
      else viewImage(f.src,f.caption,'kword');
    };
    g.appendChild(el);
  });
  Game.monologue('软盘转动的声音很轻。四年前的雪夜，被抄在这一张小盘片上。',6000);
}
function markTransfer(){
  if(!Game.hasClue('transfer')){
    Game.mark('transfer');
    Game.monologue('第 03 行：陈小默……1996 年 6 月 1 日，周秀兰领养迁出。<br>这个名字后面，跟着他自己的人生。',9000);
  }
}
function appDriveC(){
  const body=document.createElement('div');
  body.innerHTML='<div class="crumbbar">本地磁盘 (C:)</div><div class="fgrid" id="c-grid" style="padding:10px;"></div>';
  WM.create({id:'drive-c',title:'本地磁盘 (C:)',icon:svgIcon('hdd'),width:560,height:360,content:body});
  const g=body.querySelector('#c-grid');
  [
    {n:'Documents and Settings',ic:'folder',act:function(){WM.dialog('lock','访问拒绝：这不是你的账户。');}},
    {n:'Program Files',ic:'folder',act:function(){appFolderGeneric('Program Files',['Internet Explorer','江州邮局','易聊 2003','Media Player','搜霸助手']);}},
    {n:'WINDOWS',ic:'folder',act:function(){appFolderGeneric('WINDOWS',['system32','Fonts','Web']);}},
    {n:'系统备份_勿动',ic:'warn',act:function(){triggerBsod();}}
  ].forEach(function(it){
    const f=document.createElement('div');f.className='fitem';
    f.innerHTML='<div class="fi">'+svgIcon(it.ic)+'</div><div class="fn">'+it.n+'</div>';
    f.ondblclick=it.act;g.appendChild(f);
  });
  const used=document.createElement('div');used.style.cssText='padding:8px 12px;color:#666;width:100%;';
  used.innerHTML='<hr style="border:none;border-top:1px solid #ddd;margin-bottom:8px;">容量：40.0 GB　可用：21.3 GB';
  g.appendChild(used);
}
function appFolderGeneric(title,items){
  const body=document.createElement('div');
  body.innerHTML='<div class="crumbbar">'+title+'</div><div class="fgrid" id="fg" style="padding:10px;"></div>';
  WM.create({id:'folder-'+title,title:title,icon:svgIcon('folder'),width:480,height:320,content:body});
  const g=body.querySelector('#fg');
  items.forEach(function(n){
    const f=document.createElement('div');f.className='fitem';
    f.innerHTML='<div class="fi">'+svgIcon('app')+'</div><div class="fn">'+n+'</div>';
    f.ondblclick=function(){WM.dialog('info','无法打开「'+n+'」。<br>该文件与当前剧情无关。');};
    g.appendChild(f);
  });
}
function triggerBsod(){
  const b=document.getElementById('bsod');
  b.classList.add('show');try{Sfx.errBeep();}catch(e){}
  Game.Timeline.at(3000,function(){
    b.classList.remove('show');
    WM.dialog('warn','……吓到了吗？只是个玩笑。<br>不过说真的，「系统备份」里什么都没有。');
  });
  Game.setFlag('bsod_seen');
}

/* ============ 文档浏览器 ============ */
function docTree(){
  return {
    folders:{
      '稿件':{docs:['稿件/蓝星养育园调查_未完稿.doc','稿件/K会计采访录音_转写.txt']},
      '日记':{docs:['日记/2003-11-02.txt','日记/2003-11-20.txt','日记/2003-12-08.txt','日记/2003-12-24.txt','日记/2003-12-31.txt']},
      '扫描件':{docs:['扫描件/工作证扫描.jpg','扫描件/物品移交清单.jpg','扫描件/备案档案_LX-1998-117.jpg']},
      '照片':{docs:['照片/1996年六一合影.jpg','照片/养育园旧址_1998.jpg']},
      '_root':{docs:['给妈妈的信_未寄出.txt']}
    }
  };
}
function appExplorer(){
  const t=docTree();
  const body=document.createElement('div');
  body.innerHTML='<div class="toolbar"><span class="tbtn">向上</span><span class="tbtn">搜索</span></div>'+
    '<div class="crumbbar">我的文档</div>'+
    '<div class="explorer" style="height:calc(100% - 60px);"><div class="ex-main"><div class="fgrid" id="exp-grid"></div></div></div>';
  WM.create({id:'exp-mydocs',title:'我的文档 - 资源管理器',icon:svgIcon('folder'),width:620,height:420,content:body});
  const g=body.querySelector('#exp-grid');
  Object.keys(t.folders).forEach(function(fn){
    if(fn==='_root')return;
    const f=document.createElement('div');f.className='fitem';
    f.innerHTML='<div class="fi">'+svgIcon('folder')+'</div><div class="fn">'+fn+'</div>';
    f.ondblclick=function(){appSubFolder(fn);};
    g.appendChild(f);
  });
  t.folders['_root'].docs.forEach(openDocItem(g));
}
function appSubFolder(folder){
  const docs=docTree().folders[folder].docs;
  const body=document.createElement('div');
  body.innerHTML='<div class="toolbar"><span class="tbtn" onclick="openApp(\'mydocs\')">向上</span></div>'+
    '<div class="crumbbar">我的文档 / '+folder+'</div>'+
    '<div class="fgrid" id="sf-grid" style="padding:10px;"></div>';
  WM.create({id:'sub-'+folder,title:folder,icon:svgIcon('folder'),width:600,height:400,content:body});
  const g=body.querySelector('#sf-grid');
  docs.forEach(openDocItem(g));
}
function fileIcoName(key){
  if(/\.doc$/i.test(key))return'word';
  if(/\.(jpg|jpeg|png)$/i.test(key))return'pic';
  if(/\.(mp3|wav)/i.test(key))return'music';
  return'txt';
}
function openDocItem(grid){
  return function(key){
    const doc=DOCS[key];if(!doc)return;
    const f=document.createElement('div');f.className='fitem';
    f.innerHTML='<div class="fi">'+svgIcon(fileIcoName(key))+'</div><div class="fn">'+doc.title+'</div>';
    f.ondblclick=function(){openDoc(key);};
    grid.appendChild(f);
  };
}
function openDoc(key){
  const doc=DOCS[key];
  checkClueFromDoc(key);
  if(doc.kind==='img'){viewImage(doc.src,doc.caption,imgClueFor(key));return;}
  if(key==='给妈妈的信_未寄出.txt'){
    appNotepad({title:doc.title,text:plainOf(doc.body)});
    if(!Game.flag('letter_read')){
      Game.setFlag('letter_read');
      Game.monologue('「您把我从蓝星接回家的那天」……信封上的地址是临江区梧桐里 12 号。<br>这封信写好了，却一直没敢寄。',9000);
    }
    return;
  }
  if(doc.kind==='doc'){
    const body=document.createElement('div');
    body.innerHTML='<div class="toolbar"><span>文件(F)</span><span>编辑(E)</span><span>视图(V)</span><span>插入(I)</span><span>格式(O)</span><span style="margin-left:auto;color:#888;">Word 2003 · 只读</span></div>'+
      '<div style="overflow:auto;background:#808080;height:calc(100% - 30px);"><div class="doc-paper">'+doc.body+'</div></div>';
    WM.create({id:'doc-'+key.replace(/\W/g,''),title:doc.title+' - Word',icon:svgIcon('word'),width:780,height:520,content:body});
  }else{
    appNotepad({title:doc.title,text:plainOf(doc.body)});
  }
}
function imgClueFor(key){
  if(key==='扫描件/备案档案_LX-1998-117.jpg')return'record';
  if(key==='扫描件/物品移交清单.jpg')return'list';
  if(key==='照片/养育园旧址_1998.jpg')return'photo';
  return null;
}
function plainOf(html){
  const d=document.createElement('div');d.innerHTML=html;
  return d.textContent.replace(/\n{3,}/g,'\n\n');
}
function checkClueFromDoc(key){
  if(key==='稿件/蓝星养育园调查_未完稿.doc'){
    Game.balloon('证据清单','稿子里列着 6 项证据。打勾的是他已取得的，空着的正是你要找的。',9000);
  }
  if(key==='稿件/K会计采访录音_转写.txt'){
    Game.mark('tape');
    setTimeout(function(){if(Game.hasClue('tape'))Game.monologue('K 说：「蓝星的账，不能烂在雪地里。」',7000);},600);
  }
  if(key==='日记/2003-12-31.txt'){
    Game.setFlag('diary_final_read');
    if(Game.flag('letter_read'))Game.setFlag('ending_c_unlocked');
    Game.monologue('「剩下的，拜托你了。」——原来他早知道会有别人打开这台电脑。',9000);
  }
  if(key==='日记/2003-12-08.txt'||key==='日记/2003-12-24.txt'){
    Game.monologue('他查的是别人的案子，翻出来的却是自己的名字。',7000);
  }
}

/* 图片查看 */
function viewImage(src,caption,clue){
  const body=document.createElement('div');
  body.className='imgview-wrap';
  body.style.position='relative';
  body.innerHTML='<img src="'+src+'"><div style="position:absolute;bottom:14px;left:0;right:0;text-align:center;color:#ddd;font-size:13px;text-shadow:0 1px 4px #000;line-height:1.9;">'+caption+'</div>';
  WM.create({id:'imgv-'+Date.now(),title:'图片查看器',icon:svgIcon('pic'),width:660,height:500,content:body});
  if(clue==='record'){Game.mark('record');Game.monologue('备案编号 LX-1998-117……记住它的末三位：117。',8000);}
  if(clue==='photo'){Game.mark('photo');}
  if(clue==='kword'){Game.mark('kword');}
  if(clue==='ledger'){Game.mark('ledger');}
  if(clue==='transfer'){markTransfer();}
  if(clue==='list'){
    Game.setFlag('list_seen');
    Game.monologue('移交清单上写着：一张软盘，标注 ZY-0034……它就在房东给的纸箱里。<br>下次打开「我的电脑」，把软盘插进 A 驱吧。',10000);
  }
}

/* ============ 记事本 / 最近文档 / 日历 ============ */
function appNotepad(preset){
  const ta=document.createElement('textarea');
  ta.className='notepad-area';ta.readOnly=true;
  ta.value=preset?preset.text:'记事本\r\n\r\n（空白。也许主人习惯把东西都放进文件夹里。）';
  WM.create({id:'np-'+(preset?preset.title.replace(/\W/g,''):'blank'),title:(preset?preset.title+' - 记事本':'无标题 - 记事本'),icon:svgIcon('note'),width:600,height:430,content:ta});
}
function appRecentDocs(){
  const body=document.createElement('div');
  body.innerHTML='<div class="crumbbar">最近使用的文档'+(IS_GUEST?'（Guest 可见 1 项）':'')+'</div><div class="fgrid" id="rd-grid" style="padding:10px;"></div>';
  WM.create({id:'recent-docs',title:'最近使用的文档',icon:svgIcon('folder'),width:520,height:330,content:body});
  const g=body.querySelector('#rd-grid');
  const items=[{key:'给妈妈的信_未寄出.txt'}];
  if(!IS_GUEST){
    items.unshift({key:'日记/2003-12-31.txt'},{key:'稿件/蓝星养育园调查_未完稿.doc'});
  }
  items.forEach(function(it){
    const doc=DOCS[it.key];
    const f=document.createElement('div');f.className='fitem';
    f.innerHTML='<div class="fi">'+svgIcon(fileIcoName(it.key))+'</div><div class="fn">'+doc.title+'</div>';
    f.ondblclick=function(){openDoc(it.key);};
    g.appendChild(f);
  });
}
function appCalendar(){
  const y=1996,m=5;
  const first=new Date(y,m,1).getDay();
  const days=new Date(y,m+1,0).getDate();
  let html='<div style="text-align:center;font-size:15px;font-weight:bold;padding:10px 0;color:#123a8c;">1996年 六月</div><table style="width:100%;border-collapse:collapse;font-size:12px;">';
  html+='<tr>'+'日一二三四五六'.split('').map(function(d){return '<th style="padding:4px;color:#555;border-bottom:1px solid #ddd;">'+d+'</th>';}).join('')+'</tr><tr>';
  for(let i=0;i<first;i++)html+='<td></td>';
  for(let d2=1;d2<=days;d2++){
    const mark=(d2===1);
    html+='<td style="text-align:center;padding:5px;border:1px solid #eee;'+(mark?'background:#fff3bf;color:#8a1f11;font-weight:bold;':'')+'"'+(mark?' title="妈妈把我接回家"':'')+'>'+d2+(mark?'<div style="font-size:9px;">家</div>':'')+'</td>';
    if((first+d2)%7===0&&d2<days)html+='</tr><tr>';
  }
  html+='</tr></table><div style="padding:10px;color:#8a1f11;font-size:12px;">6 月 1 日：妈妈把我接回家（这一天被红笔圈了很多年）</div>';
  const b=document.createElement('div');b.innerHTML=html;
  WM.create({id:'cal',title:'日历 - 1996年6月',icon:svgIcon('cal'),width:380,height:380,content:b});
}

/* ============ 回收站 ============ */
function appRecycle(){
  const body=document.createElement('div');
  body.innerHTML='<div class="toolbar"><span class="tbtn" id="rb-empty">清空回收站</span></div>'+
    '<div class="fgrid" id="rc-grid" style="padding:12px;"></div>';
  WM.create({id:'recycle-bin',title:'回收站',icon:svgIcon('recycle'),width:560,height:380,content:body});
  const g=body.querySelector('#rc-grid');
  RECYCLE.forEach(function(item){
    const f=document.createElement('div');f.className='fitem';
    f.innerHTML='<div class="fi">'+svgIcon(fileIcoName(item.name))+'</div><div class="fn">'+item.name+'<br><small style="color:#999">删除于 '+item.del+'</small></div>';
    f.ondblclick=function(){
      if(item.fake){WM.dialog('info',item.msg);}
      else{
        viewImage('assets/img/img-ledger.jpg',item.caption,'ledger');
        Game.monologue('21 万2 的"结余上缴"，流向了一个不存在的咨询部。<br>这就是他要发的报道。',9000);
      }
    };
    g.appendChild(f);
  });
  body.querySelector('#rb-empty').onclick=function(){
    WM.dialog('recycle','确定要永久删除这 3 个项目吗？',[{label:'是',value:1},{label:'否',value:0}]).then(function(v){if(v)Game.toast('……还是别删了。万一有用呢。');});
  };
}

/* ============ 邮件 ============ */
let ZIP_OPENED=false;
function appMail(){
  const body=document.createElement('div');
  body.innerHTML='<div class="mail-app">'+
    '<div class="mail-folders"><div class="on">'+svgIcon('mail')+'收件箱 (1)</div><div>'+svgIcon('folder')+'发件箱</div><div>'+svgIcon('txt')+'已发送 (1)</div><div>'+svgIcon('recycle')+'已删除</div></div>'+
    '<div class="mail-list" id="ml-list"></div><div class="mail-view" id="ml-view"><div style="padding:30px;color:#888;">选择一封邮件以阅读。</div></div></div>';
  WM.create({id:'mail-app-w',title:'收件箱 - 江州邮局',icon:svgIcon('mail'),width:860,height:520,content:body});
  const list=body.querySelector('#ml-list');
  MAILS.inbox.forEach(function(m){
    const r=document.createElement('div');
    r.className='mail-row'+(m.unread?' unread':' read');
    r.innerHTML='<span class="m-date">'+m.date+'</span><div class="m-from">'+m.from.split('<')[0]+'</div><div class="m-subj">'+m.subj+'</div>';
    r.onclick=function(){showMail(body,m);};
    list.appendChild(r);
  });
}
function showMail(root,m){
  root.querySelector('#ml-view').innerHTML=
    '<div class="mail-head"><b>主题：</b>'+m.subj+'<br><b>发件人：</b>'+m.from+'<br><b>时间：</b>'+m.date+'</div>'+
    '<div class="mail-body">'+m.body+'</div>';
  try{Sfx.click();}catch(e){}
}
function openZip(){
  if(ZIP_OPENED)return;
  const mask=document.createElement('div');mask.className='dialog-mask';
  const d=document.createElement('div');d.className='xp-dialog';
  d.style.left='50%';d.style.top='38%';d.style.transform='translate(-50%,-50%)';
  d.innerHTML='<div class="titlebar"><span class="t-ico">'+svgIcon('floppy')+'</span><span class="t-text">解压 - 输入密码</span><div class="t-btns"><div class="tb close">r</div></div></div>'+
    '<div class="dlg-body" style="display:block;"><p style="margin-bottom:10px;">转院台账及照片.zip 被密码保护：</p><input id="zip-pwd" style="width:100%;padding:7px;border:1px solid #7f9db9;" placeholder="输入密码" autocomplete="off"><div class="err-line" id="zip-err" style="min-height:18px;margin-top:8px;"></div></div>'+
    '<div class="dlg-btns"><button class="xp-button" id="zip-ok">确定</button><button class="xp-button" id="zip-cancel">取消</button></div>';
  DESK.appendChild(mask);DESK.appendChild(d);
  const finish=function(){mask.remove();d.remove();};
  d.querySelector('.close').onclick=finish;d.querySelector('#zip-cancel').onclick=finish;
  d.querySelector('#zip-ok').onclick=function(){
    Game.verify(document.getElementById('zip-pwd').value,'zip',function(){
      finish();ZIP_OPENED=true;
      Game.toast('解压成功：2 个文件');
      viewImage('assets/img/img-yuyuan-ruin.jpg','蓝星养育园旧址（K 摄于 2003 年初冬）<br>墙塌了，铁门锈了。孩子们早已散落各方。','photo');
      Game.Timeline.at(1500,function(){Game.monologue('照片背面有一行钢笔字：「替我把这里记住。」',8000);});
    },function(n){
      document.getElementById('zip-err').innerHTML='<span style="color:#c33b32;">密码错误（第 '+n+' 次）</span>';
      try{Sfx.errBeep();}catch(e){}
    });
  };
  setTimeout(function(){d.querySelector('#zip-pwd').focus();},80);
}

/* ============ IE 浏览器 ============ */
let NET_OK=false;
let historyStack=[],historyIdx=-1;
function appIE(home){
  if(!NET_OK){
    dialupFlow().then(function(ok){if(ok){NET_OK=true;renderIE(home||'sites/soba.html');}});
    return;
  }
  renderIE(home||'sites/soba.html');
}
function dialupFlow(){
  return new Promise(function(res){
    const mask=document.createElement('div');mask.className='dialog-mask';
    const d=document.createElement('div');d.className='xp-dialog';
    d.style.left='50%';d.style.top='36%';d.style.transform='translate(-50%,-50%)';
    d.innerHTML='<div class="titlebar"><span class="t-ico">'+svgIcon('ie')+'</span><span class="t-text">连接到 96163</span><div class="t-btns"><div class="tb close">r</div></div></div>'+
      '<div class="dlg-body"><span class="dlg-icon">'+svgIcon('ie')+'</span><span>正在拨号：<b>96163（主叫计费接入号）</b><br>用户名：jz_chemo　密码：••••••••<br><span id="dial-status" style="color:#555;">正在初始化调制解调器…</span><br><span style="color:#999;font-size:11px;">（把声音开大一点，听听 2003 年的声音）</span></span></div>';
    DESK.appendChild(mask);DESK.appendChild(d);
    const st=d.querySelector('#dial-status');
    Sfx.ensure();
    let total=6500;
    try{total=(Sfx.dialup()||6.5)*1000;}catch(e){}
    st.textContent='正在拨号…';
    Game.Timeline.at(1900,function(){st.textContent='正在验证用户名和密码…';});
    Game.Timeline.at(total*0.62,function(){st.textContent='正在网络上注册您的计算机…';});
    Game.Timeline.at(total*0.85,function(){st.textContent='已连接（56.6 Kbps）✓';});
    Game.Timeline.at(total+400,function(){mask.remove();d.remove();res(true);});
    d.querySelector('.close').onclick=function(){mask.remove();d.remove();res(false);};
  });
}
function renderIE(url){
  const body=document.createElement('div');
  body.innerHTML='<div class="ie-app">'+
    '<div class="ie-menu">文件(F) 编辑(E) 查看(V) 收藏(A) 工具(T) 帮助(H)</div>'+
    '<div class="ie-bar">'+
      '<span class="tbtn" data-role="back">后退</span>'+
      '<span class="tbtn" data-role="fw">前进</span>'+
      '<div class="ie-url"><span>地址</span><span id="ie-cur-url" style="flex:1;">http://www.soba.com.cn</span><span id="ie-refresh" style="cursor:pointer;">转到</span></div>'+
      '<button class="xp-button" id="ie-home" style="min-width:52px;">主页</button>'+
    '</div>'+
    '<iframe class="ie-frame" id="ie-frame" src="'+url+'"></iframe>'+
    '<div class="ie-status"><span id="ie-msg">完成</span><div class="ie-progress"><i id="ie-pg"></i></div></div>'+
    '</div>';
  const w=WM.create({id:'ie-window',title:'搜霸一下，你就知道 - Internet Explorer',icon:svgIcon('ie'),width:900,height:600,content:body});
  w.el.querySelector('.win-body').style.overflow='hidden';
  historyStack=[url];historyIdx=0;
  wireIE(body);
}
function wireIE(root){
  root.querySelector('[data-role=back]').onclick=function(e){e.stopPropagation();if(historyIdx>0){historyIdx--;frameLoad(root,historyStack[historyIdx]);}};
  root.querySelector('[data-role=fw]').onclick=function(e){e.stopPropagation();if(historyIdx<historyStack.length-1){historyIdx++;frameLoad(root,historyStack[historyIdx]);}};
  root.querySelector('#ie-refresh').onclick=function(){frameLoad(root,historyStack[historyIdx]);};
  root.querySelector('#ie-home').onclick=function(){navigateIE(root,'sites/soba.html');};
}
function frameLoad(root,url){
  const f=root.querySelector('#ie-frame');
  const pg=root.querySelector('#ie-pg'),msg=root.querySelector('#ie-msg');
  if(pg)pg.style.width='20%';
  if(msg)msg.textContent='正在打开页面…';
  f.src=url;
  const w=WM.wins['ie-window'];
  if(w)setTimeout(function(){try{w.el.querySelector('.t-text').textContent=(f.contentDocument.title||'页面')+' - Microsoft Internet Explorer';}catch(e){}},700);
}
function navigateIE(root,url){
  historyStack=historyStack.slice(0,historyIdx+1);historyStack.push(url);historyIdx++;
  frameLoad(root,url);
}
window.ieNavigate=function(url){const w=WM.wins['ie-window'];if(w)navigateIE(w.el,url);};

/* 历史记录面板 */
function appHistoryPanel(){
  const body=document.createElement('div');
  body.innerHTML='<div class="crumbbar">浏览器历史记录 · 今天（2003-12-31）</div><div style="padding:12px;line-height:2.3;font-size:12.5px;">'+
    '<div>· www.soba.com.cn —— 搜霸搜索</div>'+
    '<div>· www.lht-bbs.com.cn —— 老槐树BBS（×14 次）</div>'+
    '<div>· www.jznews.net —— 江北晨报电子版</div>'+
    '<div>· blog.zhuyeqai.com.cn/mocun —— 竹叶斋·默存</div>'+
    '<div id="his-caibian" style="background:#fff3bf;display:flex;align-items:center;gap:8px;padding:3px 8px;cursor:pointer;"><span>· <b style="color:#8a1f11">jb.jznews.net/caibian —— 【收藏夹清空了，但历史没清】</b></span></div>'+
    '</div>';
  WM.create({id:'ie-history',title:'历史记录栏',icon:svgIcon('txt'),width:540,height:340,content:body});
  body.querySelector('#his-caibian').onclick=function(){closeSM();appEditorSystem();};
}

/* ============ 媒体播放器 ============ */
function appMedia(){
  const body=document.createElement('div');
  body.innerHTML='<div style="height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;background:#222;">'+
    '<div style="width:64px;height:64px;">'+svgIcon('tape')+'</div>'+
    '<div style="color:#ccc;">没有可播放的媒体文件。</div>'+
    '<div style="color:#777;font-size:11px;">（三盒磁带在房东的纸箱里，这台电脑放不了它们。）</div></div>';
  WM.create({id:'media',title:'Windows Media Player',icon:svgIcon('wmp'),width:460,height:320,content:body});
}

/* ============ 开始菜单 ============ */
function bindGlobal(){
  const sm=document.getElementById('start-menu');
  document.getElementById('start-btn').onclick=function(e){
    e.stopPropagation();
    sm.classList.toggle('open');
    buildStartMenu();
  };
  document.addEventListener('pointerdown',function(e){
    if(!sm.contains(e.target)&&!e.target.closest('#start-btn'))sm.classList.remove('open');
  });
}
function buildStartMenu(){
  const L=document.getElementById('sm-left'),R=document.getElementById('sm-right');
  if(IS_GUEST){
    L.innerHTML='<div class="sm-i" onclick="openApp(\'calendar\')">日历</div>'+
      '<div class="sm-i" onclick="openApp(\'recent\')">最近使用的文档</div>'+
      '<div class="sm-i" onclick="logout()">切换用户（试试主人的密码？）</div>';
    R.innerHTML='<div class="sm-i" style="opacity:.45;">我的文档（受限）</div><div class="sm-i" style="opacity:.45;">搜索（受限）</div>';
    return;
  }
  L.innerHTML=
    '<div class="sm-i" id="sm-editor"><b>江北晨报采编系统</b></div>'+
    '<div class="sm-i" id="sm-ie">Internet Explorer</div>'+
    '<div class="sm-i" id="sm-mail">江州邮局</div>'+
    '<div class="sm-i" id="sm-docs">我的文档</div>'+
    '<div class="sm-sep"></div>'+
    '<div class="sm-i" id="sm-his">IE 历史记录</div>'+
    '<div class="sm-i" id="sm-np">记事本</div>';
  R.innerHTML=
    '<div class="sm-i" id="sr-comp">我的电脑</div>'+
    '<div class="sm-i" id="sr-bin">回收站</div>'+
    '<div class="sm-i" id="sr-cal">日历</div>'+
    '<div class="sm-i" id="sr-reset">重置游戏存档</div>';

  document.getElementById('sm-editor').onclick=function(){closeSM();appEditorSystem();};
  document.getElementById('sm-ie').onclick=function(){closeSM();openApp('ie');};
  document.getElementById('sm-mail').onclick=function(){closeSM();openApp('mail');};
  document.getElementById('sm-docs').onclick=function(){closeSM();openApp('mydocs');};
  document.getElementById('sm-his').onclick=function(){closeSM();appHistoryPanel();};
  document.getElementById('sm-np').onclick=function(){closeSM();appNotepad(null);};
  document.getElementById('sr-comp').onclick=function(){closeSM();openApp('mycomp');};
  document.getElementById('sr-bin').onclick=function(){closeSM();openApp('recycle');};
  document.getElementById('sr-cal').onclick=function(){closeSM();openApp('calendar');};
  document.getElementById('sr-reset').onclick=function(){closeSM();Game.resetAll();location.href='boot.html';};
}
function closeSM(){document.getElementById('start-menu').classList.remove('open');}

/* ============ 采编系统（终局） ============ */
function appEditorSystem(){
  const unlockedChoice=Game.flag('ending_c_unlocked');
  const n=Game.clueCount();
  const body=document.createElement('div');
  body.innerHTML=
  '<div style="background:#fff;height:100%;">'+
  '<div style="background:linear-gradient(#003399,#0055d4);color:#fff;padding:10px 16px;font-size:14px;font-weight:bold;">江北晨报 · 采编系统 v2.1（内部）</div>'+
  '<div style="padding:22px 30px;line-height:2;">'+
    '<div id="ed-login">'+
      '<p><b>记者登录</b>（请输入工号）</p>'+
      '<input id="ed-code" style="border:1px solid #7f9db9;padding:6px;width:180px;" maxlength="6" autocomplete="off">'+
      '<button class="xp-button" id="ed-go" style="margin-left:8px;">登录</button>'+
      '<div class="err-line" id="ed-err"></div>'+
    '</div>'+
    '<div id="ed-main" style="display:none;">'+
      '<p><b>稿件登记</b></p>'+
      '<p style="line-height:1.9;">题目：谁花掉了孩子们的救命钱——蓝星养育园火灾之后<br>作者：CM0327 陈默（社会新闻部）　栏目：深度</p>'+
      '<p><b>证据链完整度：<span id="chain-n" style="color:'+(n>=5?'#1d7a34':'#c33b32')+'">'+n+'</span> / 6</b>'+(n>=5?' <span style="color:#1d7a34;">（达到刊发标准）</span>':' <span style="color:#c33b32;">（不足！编委会会毙稿）</span>')+'</p>'+
      '<div style="max-width:280px;height:8px;border:1px solid #999;background:#eee;margin:6px 0 16px;"><div style="height:100%;width:'+(n/6*100)+'%;background:linear-gradient(90deg,#6f5624,#e8b45a);"></div></div>'+
      '<p><b>证据链编号</b>（备案末三位 - 转院末四位）：</p>'+
      '<input id="chain-input" style="border:1px solid #7f9db9;padding:6px;width:160px;" placeholder="如：000-0000" autocomplete="off">'+
      '<div class="err-line" id="chain-err"></div>'+
      '<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;">'+
        '<button class="xp-button" id="send-btn" style="background:linear-gradient(#ffe9c2,#ffd98a);border-color:#c88a2a;font-weight:bold;">提交编委会</button>'+
        (unlockedChoice?'<button class="xp-button" id="mom-btn">不发稿了。把那封信寄给妈妈</button>':'')+
      '</div>'+
    '</div>'+
  '</div></div>';
  const w=WM.create({id:'editor-system',title:'江北晨报采编系统 - 请登录',icon:svgIcon('app'),width:720,height:520,content:body,noMax:true});
  w.el.querySelector('.win-body').style.overflow='auto';

  body.querySelector('#ed-go').onclick=function(){
    Game.verify(body.querySelector('#ed-code').value,'editor',function(){
      body.querySelector('#ed-login').style.display='none';
      body.querySelector('#ed-main').style.display='block';
      Game.toast('登录成功。欢迎回来，陈默。');
    },function(nn){
      body.querySelector('#ed-err').textContent='工号不存在。（第 '+nn+' 次）——工牌上印着呢。';
      try{Sfx.errBeep();}catch(e){}
    });
  };
  body.querySelector('#send-btn').onclick=function(){
    const v=body.querySelector('#chain-input').value.trim();
    Game.verify(v,'chain',function(){
      sessionStorage.setItem('lb_result', n>=5 ? 'A' : 'B');
      doEndgame();
    },function(nn){
      body.querySelector('#chain-err').textContent='编号校验失败（第 '+nn+' 次）。备案号末三位 - 转院号末四位。';
      try{Sfx.errBeep();}catch(e){}
    });
  };
  const momBtn=body.querySelector('#mom-btn');
  if(momBtn)momBtn.onclick=function(){
    sessionStorage.setItem('lb_result','C');
    doEndgame();
  };
}
function doEndgame(){
  const mask=document.createElement('div');
  mask.style.cssText='position:fixed;inset:0;z-index:30000;background:#000;opacity:0;transition:opacity 1.4s;';
  document.body.appendChild(mask);
  requestAnimationFrame(function(){mask.style.opacity='1';});
  Game.Timeline.at(1600,function(){location.href='shutdown.html';});
}