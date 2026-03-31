param(
  [switch]$Cuda
)

$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$venvPath = Join-Path $root '.venvs\chatterbox'

py -3 -m venv $venvPath
$python = Join-Path $venvPath 'Scripts\python.exe'

& $python -m pip install --upgrade pip setuptools wheel

if ($Cuda) {
  & $python -m pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu121
} else {
  & $python -m pip install torch torchaudio
}

& $python -m pip install git+https://github.com/resemble-ai/chatterbox.git

Write-Host 'Chatterbox environment is ready.'
Write-Host "Python: $python"
