# 《最后一次开机》 GitHub 发布/更新脚本 v2（支持空仓与已有仓库）
param(
  [string]$Tok = $env:GH_TOKEN,
  [string]$Owner = 'zyj999-abc',
  [string]$Repo = 'last-boot',
  [string]$Src = 'D:\Desktop\kai\xj\ivx\last-boot'
)
$ErrorActionPreference = 'Stop'
$base = "https://api.github.com/repos/$Owner/$Repo"
$h = @{ Authorization = "Bearer $Tok"; 'User-Agent' = 'lb-deploy'; Accept = 'application/vnd.github+json' }

function Api($method,$url,$obj){
  $json = if($obj){$obj|ConvertTo-Json -Depth 6}else{$null}
  Invoke-RestMethod -Uri $url -Method $method -Headers $h -Body $json -ContentType 'application/json' -TimeoutSec 240
}

# ---- 取基线：main 是否存在 ----
$parent=$null; $baseTree=$null
try{
  $ref = Invoke-RestMethod -Uri "$base/git/ref/heads/main" -Headers $h -TimeoutSec 60
  $parent = $ref.object.sha
  $c = Invoke-RestMethod -Uri "$base/git/commits/$parent" -Headers $h
  $baseTree = $c.tree.sha
  Write-Output ("baseline commit=" + $parent.Substring(0,8))
}catch{
  Write-Output 'baseline: none (will bootstrap)'
}

# ---- 收集文件 ----
$files = Get-ChildItem $Src -Recurse -File | Where-Object { $_.FullName -notmatch '\\\.git\\' }
Write-Output ("files=" + $files.Count)

$items=@(); $i=0
foreach($f in $files){
  $i++
  $rel = $f.FullName.Substring($Src.Length+1).Replace('\','/')
  $b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($f.FullName))
  $blob = Api Post "$base/git/blobs" @{ content=$b64; encoding='base64' }
  $items += @{ path=$rel; mode='100644'; type='blob'; sha=$blob.sha }
  Write-Output ("blob {0:D2}/{1:D2} {2}" -f $i,$files.Count,$rel)
}

# ---- 建 tree / commit / 移动 main ----
if($baseTree){ $tree = Api Post "$base/git/trees" @{ base_tree=$baseTree; tree=$items } }
else{ $tree = Api Post "$base/git/trees" @{ tree=$items } }
Write-Output ("tree=" + $tree.sha)

$msg = 'update: site refresh ' + (Get-Date -Format 'yyyy-MM-dd HH:mm')
if($parent){
  $commit = Api Post "$base/git/commits" @{ message=$msg; tree=$tree.sha; parents=@($parent) }
  Api Patch "$base/git/refs/heads/main" @{ sha=$commit.sha; force=$true } | Out-Null
}else{
  # 空仓库兜底：先建一个引导文件提交
  $boot = Api Put "$base/contents/bootstrap.md" @{ message='bootstrap'; content=[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes('init')) } 
  $bp = $boot.commit.sha
  $t2items = @(); foreach($it in $items){ if($it.path -ne 'bootstrap.md'){ $t2items += $it } }
  $t2 = Api Post "$base/git/trees" @{ base_tree=$tree.sha; tree=$t2items }
  $c2 = Api Post "$base/git/commits" @{ message=$msg; tree=$t2.sha; parents=@($bp) }
  Api Post "$base/git/refs" @{ ref='refs/heads/main'; sha=$c2.sha } | Out-Null
}
Write-Output 'PUSH OK'

# ---- Pages 触发 ----
Start-Sleep 6
try{
  Invoke-RestMethod -Uri "$base/actions/workflows/deploy.yml/dispatches" -Method Post -Headers $h -Body (@{ref='main'}|ConvertTo-Json) -ContentType 'application/json'
  Write-Output 'workflow dispatched'
}catch{ Write-Output ('dispatch note: ' + $_.Exception.Message) }

for($k=0;$k -lt 24;$k++){
  Start-Sleep 10
  try{ $run=(Invoke-RestMethod -Uri "$base/actions/runs?per_page=1" -Headers $h).workflow_runs[0] }catch{continue}
  if(-not $run){continue}
  Write-Output ("[{0:D2}s] run {1} {2} {3}" -f (($k+1)*10),$run.id,$run.status,$run.conclusion)
  if($run.status -eq 'completed'){
    if($run.conclusion -eq 'success'){ try{ Invoke-RestMethod -Uri "$base/actions/runs/$($run.id)/rerun" -Method Post -Headers $h|Out-Null }catch{} }
    break
  }
}
