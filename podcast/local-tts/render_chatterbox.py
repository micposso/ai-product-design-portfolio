import argparse
import shutil
import sys
from pathlib import Path

import torch
import torchaudio

from chatterbox.tts import ChatterboxTTS

from common import append_style_hint, combine_wav_files, ensure_clean_dir, load_json, resolve_path, select_lines, write_json


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', required=True)
    parser.add_argument('--mode', choices=['compare', 'full'], default='compare')
    parser.add_argument('--output-root', required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    script_dir = Path(__file__).resolve().parent
    config_path = resolve_path(Path.cwd(), args.config)
    config = load_json(config_path)
    lines_path = resolve_path(config_path.parent, config['linesPath'])
    lines = load_json(lines_path)
    selected_lines = select_lines(lines, config, args.mode)

    output_root = resolve_path(Path.cwd(), args.output_root)
    lines_output_dir = output_root / 'lines'
    ensure_clean_dir(lines_output_dir)

    device = config.get('device') or ('cuda' if torch.cuda.is_available() else 'cpu')
    model = ChatterboxTTS.from_pretrained(device=device)
    sample_rate = getattr(model, 'sr', 24000)

    rendered_paths: list[Path] = []
    manifest_lines: list[dict[str, object]] = []

    for line_number, line in selected_lines:
        host_key = line['hostKey']
        host_config = config['hosts'][host_key]
        reference_audio = resolve_path(config_path.parent, host_config['referenceAudio'])
        rendered_text = append_style_hint(line['text'], host_config)
        clip_path = lines_output_dir / f'{line_number:02d}-{host_key}.wav'

        print(f'Rendering Chatterbox line {line_number}: {line["speaker"]}')
        waveform = model.generate(
            rendered_text,
            audio_prompt_path=str(reference_audio),
            exaggeration=float(host_config.get('chatterbox', {}).get('exaggeration', 0.45)),
            cfg_weight=float(host_config.get('chatterbox', {}).get('cfgWeight', 0.5)),
        )

        if waveform.ndim == 1:
            waveform = waveform.unsqueeze(0)

        torchaudio.save(str(clip_path), waveform.detach().cpu(), sample_rate)
        rendered_paths.append(clip_path)
        manifest_lines.append(
            {
                'lineNumber': line_number,
                'speaker': line['speaker'],
                'hostKey': host_key,
                'referenceAudio': str(reference_audio),
                'accent': host_config.get('accent', ''),
                'styleHint': host_config.get('styleHint', ''),
                'text': line['text'],
                'renderedText': rendered_text,
                'output': str(clip_path),
            }
        )

    combined_output = output_root / 'podcast-full.wav'
    combine_wav_files(rendered_paths, combined_output, int(config.get('pauseMs', 250)))

    write_json(
        output_root / 'manifest.json',
        {
            'model': 'chatterbox',
            'mode': args.mode,
            'device': device,
            'lineCount': len(manifest_lines),
            'combinedOutput': str(combined_output),
            'lines': manifest_lines,
        },
    )

    print(f'Chatterbox output ready at {combined_output}')


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(error, file=sys.stderr)
        raise
