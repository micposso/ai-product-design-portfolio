param(
  [string]$ConfigPath = '.\podcast\local-tts\local-tts.config.json',
  [ValidateSet('compare', 'full')]
  [string]$Mode = 'compare',
  [string[]]$Models = @('chatterbox', 'f5tts')
)

$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$configFullPath = Resolve-Path (Join-Path $root $ConfigPath)
$outputRoot = Join-Path $root 'podcast\local-tts\output'

New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null

function Invoke-ModelRender {
  param(
    [string]$ModelName,
    [string]$PythonPath,
    [string]$ScriptPath,
    [string[]]$ExtraArgs = @()
  )

  if (-not (Test-Path $PythonPath)) {
    throw "Python executable not found for $ModelName at $PythonPath"
  }

  $modelOutputRoot = Join-Path $outputRoot $ModelName
  New-Item -ItemType Directory -Force -Path $modelOutputRoot | Out-Null

  $args = @(
    $ScriptPath,
    '--config', $configFullPath,
    '--mode', $Mode,
    '--output-root', $modelOutputRoot
  ) + $ExtraArgs

  & $PythonPath @args
}

if ($Models -contains 'chatterbox') {
  Invoke-ModelRender `
    -ModelName 'chatterbox' `
    -PythonPath (Join-Path $root '.venvs\chatterbox\Scripts\python.exe') `
    -ScriptPath (Join-Path $root 'podcast\local-tts\render_chatterbox.py')
}

if ($Models -contains 'f5tts') {
  Invoke-ModelRender `
    -ModelName 'f5tts' `
    -PythonPath (Join-Path $root '.venvs\f5tts\Scripts\python.exe') `
    -ScriptPath (Join-Path $root 'podcast\local-tts\render_f5tts.py') `
    -ExtraArgs @('--cli', (Join-Path $root '.venvs\f5tts\Scripts\f5-tts_infer-cli.exe'))
}

Write-Host 'Local TTS comparison render complete.'
Write-Host "Output root: $outputRoot"
