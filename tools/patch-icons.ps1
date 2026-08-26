$ErrorActionPreference='Continue'
$f='D:\Desktop\kai\xj\ivx\last-boot\desktop.html'
$t=[IO.File]::ReadAllText($f,[Text.Encoding]::UTF8)
$t=$t.Replace("`r`n","`n")
$script:n=0
function Rep([string]$old,[string]$new){
  if($script:t.Contains($old)){ $script:t=$script:t.Replace($old,$new); $script:n++ }
  else{ Write-Output ("MISS: "+$old.Substring(0,[Math]::Min(70,$old.Length))) }
}

# ---- 头部 ----
Rep @'
<link rel="stylesheet" href="assets/css/os.css?v=11">
  <link rel="stylesheet" href="assets/css/icons.css?v=11">
'@ @'
<link rel="stylesheet" href="assets/css/os.css?v=13">
'@

Rep @'
<script src="assets/js/data.js?v=11"></script>
'@ @'
<script src="assets/js/data.js?v=13"></script>
  <script src="assets/js/icons.js?v=13"></script>
'@

Rep @'
<script src="assets/js/os.js?v=11"></script>
'@ @'
<script src="assets/js/os.js?v=13"></script>
'@

# ---- 开始按钮旗帜 ----
Rep @'
<div id="start-btn"><span class="flag"><i></i><i></i><i></i><i></i></span>开始</div>
'@ @'
<div id="start-btn"><svg class="winflag" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 3 L9 1.4 V9.4 L2 10.6 Z" fill="#f25022"/><path d="M10.6 1.2 L18 0 V8.8 L10.6 9.2 Z" fill="#7fba00"/><path d="M2 12 L9 11 V19 L2 17.6 Z" fill="#00a4ef"/><path d="M10.6 10.8 L18 10.4 V19 L10.6 18 Z" fill="#ffb900"/></svg>开始</div>
'@

# ---- 托盘 ----
Rep @'
<span title="本地连接已断开" style="font-size:12px;">🔌</span><span style="font-size:12px;">🔊</span>
'@ @'
<svg class="tray-svg" viewBox="0 0 16 16"><rect x="1" y="2.5" width="10" height="7" rx="1" fill="#cdd8e4" stroke="#22344e"/><rect x="3" y="4.5" width="6" height="3" fill="#5a86b8"/><path d="M12.5 5.5 L15 8.5 M15 5.5 L12.5 8.5" stroke="#d9d9d9" stroke-width="1.4"/><rect x="5.5" y="11.5" width="5" height="1.6" fill="#cdd8e4"/></svg><svg class="tray-svg" viewBox="0 0 16 16"><path d="M2 6 H5 L9 3 V13 L5 10 H2 Z" fill="#e8eef5" stroke="#33455e"/><path d="M11 5 Q13.6 8 11 11" stroke="#e8eef5" fill="none" stroke-width="1.3"/></svg>
'@

# ---- 文案 emoji ----
Rep @'
⚠ 来宾账户
'@ @'
来宾账户
'@
Rep @'
🔒 注销(L)
'@ @'
注销(L)
'@
Rep @'
⏻ 关闭计算机(U)
'@ @'
关闭计算机(U)
'@
Rep @'
<b>💡 
'@ @'
<b>
'@

# ---- DESK_ICONS 块 ----
Rep @'
const DESK_ICONS = {
  mycomp:{c:'ic-mycomp'}, mydocs:{c:'ic-folder'}, mail:{c:'ic-mail'},
  ie:{c:'ic-ie'}, notepad:{c:'ic-note'}, recycle:{c:'ic-recycle'},
  media:{c:'ic-wmp'}, calendar:{c:'ic-cal'}, recent:{c:'ic-folder'}
};
'@ @'
const DESK_ICONS = {
  mycomp:'mycomp', mydocs:'folder', mail:'mail',
  ie:'ie', notepad:'note', recycle:'recycle',
  media:'wmp', calendar:'cal', recent:'folder'
};
'@

Rep @'
    const cls=(DESK_ICONS[cfg.id]||{}).c||'ic-app';
'@ @'
    const cls=DESK_ICONS[cfg.id]||'app';
'@

Rep @'
    d.innerHTML='<div class="ico"><span class="ic '+cls+'"></span></div><span class="lbl">'+cfg.label+'</span>';
'@ @'
    d.innerHTML='<div class="ico">'+svgIcon(cls)+'</div><span class="lbl">'+cfg.label+'</span>';
'@

# ---- 驱动器函数 ----
Rep @'
function driveIco(name){
  const M={'hdd':'ic-hdd','floppy':'ic-floppy','cd':'ic-cd','folder':'ic-folder'};
  return '<span class="ic sm '+(M[name]||'ic-app')+'"></span>';
}
'@ @'
function driveIco(name){ return svgIcon(name); }
'@

# ---- C盘项 ----
Rep @'
    f.innerHTML='<div class="fi"><span class="ic sm ic-'+it.ic+'"></span></div><div class="fn">'+it.n+'</div>';
'@ @'
    f.innerHTML='<div class="fi">'+driveIco(it.ic)+'</div><div class="fn">'+it.n+'</div>';
'@

# ---- 程序项 ----
Rep @'
    f.innerHTML='<div class="fi"><span class="ic sm ic-app"></span></div><div class="fn">'+n+'</div>';
'@ @'
    f.innerHTML='<div class="fi">'+svgIcon('app')+'</div><div class="fn">'+n+'</div>';
'@

# ---- 文件类型函数 ----
Rep @'
function fileIcoClass(key){
  if(/\.doc$/i.test(key))return'ic-word';
  if(/\.(jpg|jpeg|png)$/i.test(key))return'ic-pic';
  if(/\.mp3|\.wav/i.test(key))return'ic-music';
  return'ic-txt';
}
'@ @'
function fileIcoName(key){
  if(/\.doc$/i.test(key))return'word';
  if(/\.(jpg|jpeg|png)$/i.test(key))return'pic';
  if(/\.(mp3|wav)/i.test(key))return'music';
  return'txt';
}
'@

# ---- 文件渲染行 ----
Rep @'
    f.innerHTML='<div class="fi"><span class="ic sm '+fileIcoClass(key)+'"></span></div><div class="fn">'+doc.title+'</div>';
'@ @'
    f.innerHTML='<div class="fi">'+svgIcon(fileIcoName(key))+'</div><div class="fn">'+doc.title+'</div>';
'@

Rep @'
    el.innerHTML='<div class="fi"><span class="ic sm '+(f.kind==='img'?'ic-pic':'ic-txt')+'"></span></div><div class="fn">'+f.name+'</div>';
'@ @'
    el.innerHTML='<div class="fi">'+svgIcon(f.kind==='img'?'pic':'txt')+'</div><div class="fn">'+f.name+'</div>';
'@

Rep @'
    f.innerHTML='<div class="fi"><span class="ic sm '+(item.name.indexOf('.jpg')>=0?'ic-pic':'ic-music')+'"></span></div><div class="fn">'+item.name+'<br><small style="color:#999">删除于 '+item.del+'</small></div>';
'@ @'
    f.innerHTML='<div class="fi">'+svgIcon(item.name.indexOf('.jpg')>=0?'pic':'music')+'</div><div class="fn">'+item.name+'<br><small style="color:#999">删除于 '+item.del+'</small></div>';
'@

# ---- 邮件夹列表 ----
Rep @'
<div class="on">📥 收件箱 (1)</div><div>📤 发件箱</div><div>📄 已发送 (1)</div><div>🗑️ 已删除</div>
'@ @'
<div class="on">'+svgIcon('mail')+'收件箱 (1)</div><div>'+svgIcon('folder')+'发件箱</div><div>'+svgIcon('txt')+'已发送 (1)</div><div>'+svgIcon('recycle')+'已删除</div>
'@

# ---- 附件与按钮 ----
Rep @'
🗜 转院台账及照片.zip (1.2MB) 🔒已加密
'@ @'
转院台账及照片.zip (1.2MB) [已加密]
'@
Rep @'
>📤 提交编委会</button>
'@ @'
>提交编委会</button>
'@
Rep @'
>✉ 不发稿了。把那封信寄给妈妈</button>
'@ @'
>不发稿了。把那封信寄给妈妈</button>
'@

# ---- 对话框语义键 ----
Rep @'
WM.dialog('ℹ️',
'@ @'
WM.dialog('info',
'@
Rep @'
WM.dialog('🔒',
'@ @'
WM.dialog('lock',
'@
Rep @'
WM.dialog('😅',
'@ @'
WM.dialog('warn',
'@
Rep @'
WM.dialog('🗑️',
'@ @'
WM.dialog('recycle',
'@
Rep @'
WM.dialog('💾',
'@ @'
WM.dialog('floppy',
'@
Rep @'
WM.dialog('💿',
'@ @'
WM.dialog('cd',
'@
Rep @'
WM.dialog('🖥️',
'@ @'
WM.dialog('info',
'@
Rep @'
WM.dialog('🖼️',
'@ @'
WM.dialog('info',
'@
Rep @'
WM.dialog('📄',
'@ @'
WM.dialog('info',
'@
Rep @'
WM.dialog('📮',
'@ @'
WM.dialog('info',
'@

# ---- 面包屑（整行替换） ----
Rep @'
  body.innerHTML='<div class="crumbbar">📁 我的文档</div>'+
'@ @'
  body.innerHTML='<div class="crumbbar">'+svgIcon('folder')+'我的文档</div>'+
'@

Rep @'
  body.innerHTML='<div class="crumbbar">💾 3.5 软盘 (A:)</div><div class="fgrid" id="fl-grid" style="padding:10px;"></div>';
'@ @'
  body.innerHTML='<div class="crumbbar">'+svgIcon('floppy')+'3.5 软盘 (A:)</div><div class="fgrid" id="fl-grid" style="padding:10px;"></div>';
'@

Rep @'
  body.innerHTML='<div class="crumbbar">💽 本地磁盘 (C:)</div><div class="fgrid" id="c-grid" style="padding:10px;"></div>';
'@ @'
  body.innerHTML='<div class="crumbbar">'+svgIcon('hdd')+'本地磁盘 (C:)</div><div class="fgrid" id="c-grid" style="padding:10px;"></div>';
'@

Rep @'
  body.innerHTML='<div class="crumbbar">📁 我的文档 \\ '+folder+'</div>'+
'@ @'
  body.innerHTML='<div class="crumbbar">'+svgIcon('folder')+'我的文档 \\ '+folder+'</div>'+
'@

# ---- 历史面板标题 / 媒体空态 / 日历窗口图标 ----
Rep @'
<div class="crumbbar">🕒 浏览器历史记录 · 今天（2003-12-31）</div>
'@ @'
<div class="crumbbar">浏览器历史记录 · 今天（2003-12-31）</div>
'@
Rep @'
<div style="font-size:44px;">📼</div>
'@ @'
<div style="width:64px;height:64px;">'+svgIcon('tape')+'
'@
Rep @"
icon:'📅',width:380
"@ @"
icon:svgIcon('cal'),width:380
"@

[IO.File]::WriteAllText($f,$t,(New-Object Text.UTF8Encoding($false)))
Write-Output ("applied="+$script:n+" | length="+$t.Length)
