$ErrorActionPreference = "Stop"

$root = Get-Location
$podcastDir = Join-Path $root "podcast"
$linesPath = Join-Path $podcastDir "podcast-lines.json"
$outputDir = Join-Path $podcastDir "output"
$linesDir = Join-Path $outputDir "lines"
$combinedPath = Join-Path $outputDir "podcast-full.wav"

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
New-Item -ItemType Directory -Force -Path $linesDir | Out-Null

$voiceNames = @{
  A = "Microsoft Zira Desktop - English (United States)"
  B = "Microsoft David Desktop - English (United States)"
}

$dialogue = Get-Content $linesPath -Raw | ConvertFrom-Json

function New-SpeechClip {
  param(
    [string]$Text,
    [string]$VoiceName,
    [string]$OutputPath
  )

  $voice = New-Object -ComObject SAPI.SpVoice
  $voice.Voice = $voice.GetVoices() | Where-Object {
    $_.GetDescription() -eq $VoiceName
  } | Select-Object -First 1

  if (-not $voice.Voice) {
    throw "Voice not found: $VoiceName"
  }

  $voice.Rate = -1

  $stream = New-Object -ComObject SAPI.SpFileStream
  $stream.Open($OutputPath, 3)
  $voice.AudioOutputStream = $stream
  [void]$voice.Speak($Text)
  $stream.Close()
}

function Get-WavInfo {
  param([byte[]]$Bytes)

  $offset = 12
  $dataOffset = -1
  $dataSize = -1
  $fmtOffset = -1
  $fmtSize = -1

  while ($offset -le $Bytes.Length - 8) {
    $chunkId = [System.Text.Encoding]::ASCII.GetString($Bytes, $offset, 4)
    $chunkSize = [BitConverter]::ToInt32($Bytes, $offset + 4)
    $chunkDataOffset = $offset + 8

    if ($chunkId -eq "fmt ") {
      $fmtOffset = $chunkDataOffset
      $fmtSize = $chunkSize
    }

    if ($chunkId -eq "data") {
      $dataOffset = $chunkDataOffset
      $dataSize = $chunkSize
      break
    }

    $offset = $chunkDataOffset + $chunkSize
    if ($offset % 2 -ne 0) {
      $offset += 1
    }
  }

  if ($fmtOffset -lt 0 -or $dataOffset -lt 0) {
    throw "Invalid WAV file structure."
  }

  return [PSCustomObject]@{
    Channels = [BitConverter]::ToInt16($Bytes, $fmtOffset + 2)
    SampleRate = [BitConverter]::ToInt32($Bytes, $fmtOffset + 4)
    ByteRate = [BitConverter]::ToInt32($Bytes, $fmtOffset + 8)
    BitsPerSample = [BitConverter]::ToInt16($Bytes, $fmtOffset + 14)
    DataOffset = $dataOffset
    DataSize = $dataSize
  }
}

function Join-WavFiles {
  param(
    [string[]]$InputPaths,
    [string]$OutputPath,
    [int]$PauseMs = 250
  )

  if ($InputPaths.Count -eq 0) {
    throw "No input WAV files provided."
  }

  $firstBytes = [System.IO.File]::ReadAllBytes($InputPaths[0])
  $info = Get-WavInfo -Bytes $firstBytes
  $headerLength = $info.DataOffset
  $header = New-Object byte[] $headerLength
  [Array]::Copy($firstBytes, 0, $header, 0, $headerLength)

  $pauseByteCount = [Math]::Round(($info.ByteRate * $PauseMs) / 1000)
  if ($pauseByteCount % 2 -ne 0) {
    $pauseByteCount += 1
  }

  $dataChunks = New-Object System.Collections.Generic.List[byte[]]
  $totalDataSize = 0

  foreach ($path in $InputPaths) {
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $clipInfo = Get-WavInfo -Bytes $bytes

    if (
      $clipInfo.Channels -ne $info.Channels -or
      $clipInfo.SampleRate -ne $info.SampleRate -or
      $clipInfo.BitsPerSample -ne $info.BitsPerSample
    ) {
      throw "WAV format mismatch while combining files."
    }

    $clipData = New-Object byte[] $clipInfo.DataSize
    [Array]::Copy($bytes, $clipInfo.DataOffset, $clipData, 0, $clipInfo.DataSize)
    $dataChunks.Add($clipData)
    $totalDataSize += $clipData.Length

    if ($path -ne $InputPaths[-1]) {
      $silence = New-Object byte[] $pauseByteCount
      $dataChunks.Add($silence)
      $totalDataSize += $silence.Length
    }
  }

  [Array]::Copy([BitConverter]::GetBytes(36 + $totalDataSize), 0, $header, 4, 4)
  [Array]::Copy([BitConverter]::GetBytes($totalDataSize), 0, $header, ($headerLength - 4), 4)

  $output = New-Object byte[] ($headerLength + $totalDataSize)
  [Array]::Copy($header, 0, $output, 0, $headerLength)

  $offset = $headerLength
  foreach ($chunk in $dataChunks) {
    [Array]::Copy($chunk, 0, $output, $offset, $chunk.Length)
    $offset += $chunk.Length
  }

  [System.IO.File]::WriteAllBytes($OutputPath, $output)
}

$linePaths = @()

for ($index = 0; $index -lt $dialogue.Count; $index++) {
  $line = $dialogue[$index]
  $hostKey = [string]$line.hostKey
  $voiceName = $voiceNames[$hostKey]

  if (-not $voiceName) {
    throw "No voice mapped for host key $hostKey"
  }

  $clipPath = Join-Path $linesDir ("{0:D2}-{1}.wav" -f ($index + 1), $hostKey)
  if (-not (Test-Path $clipPath)) {
    Write-Host ("Generating line {0}/{1}: {2}" -f ($index + 1), $dialogue.Count, $line.speaker)
    New-SpeechClip -Text ([string]$line.text) -VoiceName $voiceName -OutputPath $clipPath
  }
  $linePaths += $clipPath
}

Join-WavFiles -InputPaths $linePaths -OutputPath $combinedPath

Write-Host "Podcast generation complete."
Write-Host "Line clips: $linesDir"
Write-Host "Combined episode: $combinedPath"
