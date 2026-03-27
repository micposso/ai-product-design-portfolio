# Podcast Generator

This folder contains a ready-made two-host podcast script about Michael Posso's work and a generator for turning it into audio.

## What I still need from you

- An `ELEVENLABS_API_KEY` if you want real generated audio.
- Two ElevenLabs voice IDs, one for each host.
  Example env vars:
  - `ELEVENLABS_HOST_A_VOICE_ID`
  - `ELEVENLABS_HOST_B_VOICE_ID`

## What is already prepared

- `podcast-script.md`: a ~4 minute two-host podcast script.
- `podcast-lines.json`: the structured dialogue used for audio generation.
- `generate-podcast.ts`: generates one MP3 per line and, if `ffmpeg` is installed, a combined episode MP3.

## Run

PowerShell:

```powershell
$env:ELEVENLABS_API_KEY="your_key_here"
$env:ELEVENLABS_HOST_A_VOICE_ID="voice_id_for_host_a"
$env:ELEVENLABS_HOST_B_VOICE_ID="voice_id_for_host_b"
.\node_modules\.bin\tsx.cmd .\podcast\generate-podcast.ts
```

## Output

- `podcast/output/lines/`: individual MP3 clips
- `podcast/output/podcast-full.mp3`: combined file when `ffmpeg` is available

If `ffmpeg` is not installed, the script still saves all individual clips so they can be stitched together later.
