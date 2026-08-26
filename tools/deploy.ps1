# 《最后一次开机》GitHub 发布脚本（Git Data API，单提交）
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

# 引导空仓库
$boot = Api Put "$base/contents/bootstrap.md" @{ message='bootstrap'; content=[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes('init')) }
$parent = $boot.commit.sha
Write-Output "bootstrap=$parent"

$files = Get-ChildItem $Src -Recurse -File | Where-Object { $_.FullName -notmatch '\\\.git\\' -and $_.Name -ne 'push-via-api.ps1' }
Write-Output ("files=" + $files.Count)

$items=@(); $i=0
foreach($f in $files){
  $i++
  $rel = $f.FullName.Substring($Src.Length+1).Replace('\','/')
  $b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($f.FullName))
  $blob = Api Post "$base/git/blobs" @{ content=$b64; encoding='base64' }
  $items += @{ path=$rel; mode='100644'; type='blob'; sha=$blob.sha }
  Write-Output ("{0:D2}/{1:D2} {2}" -f $i,$files.Count,$rel)
}
$tree = Api Post "$base/git/trees" @{ tree=$items }
$commit = Api Post "$base/git/commits" @{ message='feat: 《最后一次开机 The Last Boot》 initial release - Windows XP 拟真解谜'; tree=$tree.sha; parents=@($parent) }
try{ Api Post "$base/git/refs" @{ ref='refs/heads/main'; sha=$commit.sha } | Out-Null }catch{
  Api Patch "$base/git/refs/heads/main" @{ sha=$commit.sha; force=$true } | Out-Null
}
# 删除引导文件
Invoke-RestMethod -Uri "$base/contents/bootstrap.md" -Method Delete -Headers $h -Body (@{message='cleanup';sha=$boot.content.sha;branch='main'}|ConvertTo-Json) -ContentType 'application/json' | Out-Null
Write-Output 'PUSH OK'
# 开启 Pages(workflow模式)
try{ Api Post "$base/pages" @{ build_type='workflow' } | Out-Null; Write-Output 'pages enabled' }catch{ Write-Output ("pages: " + $_.Exception.Message) }
# 重跑最新 workflow
Start-Sleep 6
$run = (Api Get "$base/actions/runs?per_page=1").workflow_runs[0]
if($run){ try{ Invoke-RestMethod -Uri "$base/actions/runs/$($run.id)/rerun" -Method Post -Headers $h | Out-Null; Write-Output ("rerun "+$run.id) }catch{ Write-Output 'rerun skipped' } }
