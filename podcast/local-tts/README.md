# Local Two-Host TTS Comparison

This folder lets you compare `Chatterbox` and `F5-TTS` locally against the same two-host podcast script.

The setup is designed for side-by-side voice tests before you commit to a full render.

## What you can control

- Host A and Host B reference voices
- Accent, mostly through the reference audio
- Delivery style notes for each host
- F5-TTS speaking speed
- Chatterbox expression settings
- Compare mode with only a few lines, or full mode for the whole episode

## Important reality check

Accent and style control work differently for the two models.

- `F5-TTS` is usually stronger for voice identity and accent transfer from the reference clip.
- `Chatterbox` is usually stronger for expressive delivery and conversational tone.
- The most reliable way to choose accent is to use a clean reference clip spoken in that accent.
- Style hints are included in the config for your workflow notes, but by default they are not injected into the spoken text because that can sound unnatural.

## Folder layout

- `local-tts.config.example.json`: copy this to `local-tts.config.json` and edit it
- `bootstrap-chatterbox.ps1`: creates a dedicated venv for Chatterbox
- `bootstrap-f5tts.ps1`: creates a dedicated venv for F5-TTS
- `run-local-tts-compare.ps1`: renders both models into separate output folders
- `render_chatterbox.py`: Chatterbox renderer
- `render_f5tts.py`: F5-TTS renderer

## Requirements

- Windows PowerShell
- `py -3` launcher available
- an NVIDIA GPU is strongly recommended for quality and speed
- `ffmpeg` is optional because this setup combines WAV files in Python already

## Setup

1. Copy the example config.

```powershell
Copy-Item .\podcast\local-tts\local-tts.config.example.json .\podcast\local-tts\local-tts.config.json
```

2. Add your host reference clips.

Expected default paths:

- `podcast/local-tts/references/host-a.wav`
- `podcast/local-tts/references/host-b.wav`

3. Install each model into its own environment.

CPU:

```powershell
.\podcast\local-tts\bootstrap-chatterbox.ps1
.\podcast\local-tts\bootstrap-f5tts.ps1
```

CUDA:

```powershell
.\podcast\local-tts\bootstrap-chatterbox.ps1 -Cuda
.\podcast\local-tts\bootstrap-f5tts.ps1 -Cuda
```

## How to choose voices and accents

For each host in `local-tts.config.json`, set:

- `referenceAudio`: a clean WAV or mono speech clip
- `referenceText`: the exact transcript of that reference clip
- `accent`: your planning note, for example `General American` or `Light British`
- `styleHint`: your planning note, for example `Warm, polished, slightly upbeat podcast host`

Best practices for reference audio:

- 10 to 20 seconds is usually enough for a first test
- minimal background noise
- natural speaking pace
- no music bed
- one speaker only
- use the accent you want to preserve

## Compare just a few lines first

Edit the comparison block in the config:

```json
"comparison": {
  "maxLines": 6,
  "lineNumbers": [1, 2, 3, 4, 5, 6]
}
```

Then run:

```powershell
.\podcast\local-tts\run-local-tts-compare.ps1 -Mode compare
```

## Render the full episode

```powershell
.\podcast\local-tts\run-local-tts-compare.ps1 -Mode full
```

## Render only one model

```powershell
.\podcast\local-tts\run-local-tts-compare.ps1 -Mode compare -Models chatterbox
.\podcast\local-tts\run-local-tts-compare.ps1 -Mode compare -Models f5tts
```

## Output

- `podcast/local-tts/output/chatterbox/lines/*.wav`
- `podcast/local-tts/output/chatterbox/podcast-full.wav`
- `podcast/local-tts/output/chatterbox/manifest.json`
- `podcast/local-tts/output/f5tts/lines/*.wav`
- `podcast/local-tts/output/f5tts/podcast-full.wav`
- `podcast/local-tts/output/f5tts/manifest.json`

## Notes on the current scripts

- `render_chatterbox.py` assumes the Chatterbox Python API is available in the Chatterbox venv.
- `render_f5tts.py` assumes the F5 CLI is available at `.venvs/f5tts/Scripts/f5-tts_infer-cli.exe`.
- If either upstream project changes its API or CLI flags, you may need to adjust the renderer script.

## Recommended evaluation flow

1. Start with 6 lines only.
2. Compare accent fidelity.
3. Compare host consistency.
4. Compare pacing and naturalness.
5. Pick the better model for each host.
6. Run the full render only after that.
