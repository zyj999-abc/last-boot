# 《最后一次开机》素材生成脚本（SenseNova u1.5-lite）
$ErrorActionPreference = 'Continue'
$key = $env:SENSENOVA_API_KEY
if (-not $key) { Write-Output 'ERROR: no key'; exit 1 }
$outDir = Join-Path $PSScriptRoot '..\assets\img'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$jobs = @(
  @{ f='bg-desk.jpg';        s='2720x1536'; p='2003年中国北方城市的深夜书房，一台米白色CRT显示器发出冷蓝微光照亮桌面，桌上散落稿纸钢笔和茶杯，窗外隐约雪光，暖黄台灯与冷蓝屏幕光交织，电影感写实摄影，胶片颗粒，悬疑安静氛围' },
  @{ f='img-crt.jpg';        s='2048x2048'; p='黑暗房间中老式CRT显示器屏幕特写，屏幕泛起淡蓝色辉光和轻微噪点，曲面玻璃反光，周围完全沉入黑暗，神秘氛围，写实摄影' },
  @{ f='wp-snow.jpg';        s='2720x1536'; p='雪夜小城全景，从高处俯瞰：屋顶积雪的旧居民楼群，几扇温暖的橙黄色窗户亮着灯，远处烟囱与水塔剪影，深蓝色夜空飘雪，宁静怀旧，适合做电脑桌面壁纸，写实摄影' },
  @{ f='img-chenmo.jpg';     s='1664x2496'; p='一张2003年 style的中国男性证件照，三十岁左右，短发清瘦戴细框眼镜穿深色夹克，表情平静略带疲惫，浅蓝色背景，胶片颗粒质感，老式照相馆风格' },
  @{ f='img-yuyuan-old.jpg'; s='2496x1664'; p='九十年代彩色老照片：郊区一栋两层砖砌小楼，围墙和大铁门，门口挂着褪色招牌但文字模糊不清，院子里晾着小衣服，几个孩子身影在远处玩耍，照片褪色偏黄有折痕，怀旧纪实摄影' },
  @{ f='img-yuyuan-ruin.jpg';s='2720x1536'; p='同一栋两层砖楼的废弃现状：窗户破碎用木板钉死，院墙塌了一角长满枯草，铁门锈蚀半开，阴天灰白光线，荒凉萧瑟，2003年初冬，写实摄影' },
  @{ f='img-fire-news.jpg';  s='2048x2048'; p='黑白新闻照片质感：夜晚一栋两层小楼旁停着老式消防车，浓烟从窗口涌出，消防员水柱剪影，围观人群背影，高对比黑白粗颗粒，九十年代报纸档案摄影' },
  @{ f='img-tape.jpg';       s='2048x2048'; p='深色木桌上一台老式便携磁带录音机旁边散落三盘录音磁带，其中一盘白色标签上有手写字迹但无法辨认，暖黄台灯单光源，怀旧写实静物摄影' },
  @{ f='img-floppy.jpg';     s='2048x2048'; p='一张3.5英寸软盘的特写平铺在深色桌面，深蓝色盘壳略有磨损，白色纸质标签上有手写编号字迹但无法辨认清楚，角落有灰尘，单光源静物摄影，写实细节丰富' },
  @{ f='img-kids.jpg';       s='1664x2496'; p='1996年幼儿园合影老照片：一群五六岁孩子坐在长椅上排两排，前排中间一个短发男孩最清晰，其他孩子略微虚糊，背景是砖楼和白墙，照片严重褪色泛黄有折痕和老斑点，怀旧纪实' },
  @{ f='img-letter.jpg';     s='1664x2496'; p='摊开的信纸和信封放在木桌上，信纸上是钢笔写的中文竖排字迹但无法辨认内容，信封贴着邮票盖着圆形邮戳，旁边一副老花镜，暖黄灯光，怀旧写实摄影' },
  @{ f='img-badge.jpg';      s='2048x2048'; p='深色木桌上一个翻开的塑料工作证，透明卡套里是蓝色工作证但照片区域反光看不清，证面上有模糊的小字和红色印章痕迹，旁边一支钢笔，冷色光线，写实静物摄影' },
  @{ f='img-ledger.jpg';     s='2496x1664'; p='堆叠的旧账本票据和收据摊满桌面，几张盖着红色圆章的单据，一本绿色封皮账本翻开露出手写数字表格，算盘一角入画，冷白日光灯照明，审计档案氛围，写实摄影' },
  @{ f='img-bar.jpg';        s='2048x2048'; p='雨夜一条老巷子里一家小酒馆的木门半开，暖黄灯光从门缝洒在湿漉漉的青石板上，门口挂着一盏灯笼，墙上斑驳，没有人物，电影感写实摄影，怀旧温暖又神秘' },
  @{ f='end-press.jpg';      s='2720x1536'; p='清晨的报摊前刚印好的报纸成摞堆放，头版版面清晰但文字不可辨认，摊主的手正在整理，晨光照亮纸面上的油墨，城市苏醒的气息，写实纪实摄影，希望感' },
  @{ f='end-station.jpg';    s='2720x1536'; p='大雪中的老式火车站站台，一个穿深色大衣的女人提着旧行李箱的背影站在站牌下等车，雪花纷飞，站台灯昏黄，远处的铁轨延伸进雪雾，孤独而安宁，电影感构图，写实摄影' }
)

foreach ($j in $jobs) {
  $out = Join-Path $outDir $j.f
  if (Test-Path $out) { Write-Output "SKIP $($j.f)"; continue }
  $ok = $false
  for ($a = 1; $a -le 3; $a++) {
    try {
      $body = @{ model='sensenova-u1.5-lite'; prompt=$j.p; size=$j.s; n=1; watermark=$false; output_format='jpeg'; response_format='url' } | ConvertTo-Json
      $resp = Invoke-RestMethod -Uri 'https://token.sensenova.cn/v1/images/generations' -Method Post -Headers @{ Authorization="Bearer $key"; 'Content-Type'='application/json' } -Body $body -TimeoutSec 300
      $url = $resp.data[0].url
      if ($url) {
        Invoke-WebRequest -Uri $url -OutFile $out -TimeoutSec 300
        $len = (Get-Item $out).Length
        if ($len -gt 50000) { Write-Output "OK $($j.f) $([math]::Round($len/1KB))KB"; $ok = $true; break }
      }
    } catch { Write-Output "RETRY $($j.f)#${a}: $($_.Exception.Message)"; Start-Sleep 5 }
  }
  if (-not $ok) { Write-Output "FAIL $($j.f)" }
  Start-Sleep 2
}
Write-Output 'ALL DONE'
