import argparse
import shutil
import subprocess
import sys
from pathlib import Path

from common import append_style_hint, combine_wav_files, ensure_clean_dir, load_json, resolve_path, select_lines, write_json


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', required=True)
    parser.add_argument('--mode', choices=['compare', 'full'], default='compare')
    parser.add_argument('--output-root', required=True)
    parser.add_argument('--cli', required=True)
    return parser.parse_args()


def newest_wav(directory: Path) -> Path:
    wav_files = sorted(directory.rglob('*.wav'), key=lambda path: path.stat().st_mtime, reverse=True)
    if not wav_files:
        raise FileNotFoundError(f'No WAV output found in {directory}')
    return wav_files[0]


def main() -> None:
    args = parse_args()
    config_path = resolve_path(Path.cwd(), args.config)
    config = load_json(config_path)
    lines_path = resolve_path(config_path.parent, config['linesPath'])
    lines = load_json(lines_path)
    selected_lines = select_lines(lines, config, args.mode)

    output_root = resolve_path(Path.cwd(), args.output_root)
    lines_output_dir = output_root / 'lines'
    scratch_dir = output_root / 'scratch'
    ensure_clean_dir(lines_output_dir)
    ensure_clean_dir(scratch_dir)

    cli_path = resolve_path(Path.cwd(), args.cli)
    rendered_paths: list[Path] = []
    manifest_lines: list[dict[str, object]] = []

    for line_number, line in selected_lines:
        host_key = line['hostKey']
        host_config = config['hosts'][host_key]
        reference_audio = resolve_path(config_path.parent, host_config['referenceAudio'])
        reference_text = host_config['referenceText']
        rendered_text = append_style_hint(line['text'], host_config)
        line_scratch_dir = scratch_dir / f'{line_number:02d}-{host_key}'
        ensure_clean_dir(line_scratch_dir)

        command = [
            str(cli_path),
            '--ref_audio',
            str(reference_audio),
            '--ref_text',
            reference_text,
            '--gen_text',
            rendered_text,
            '--output_dir',
            str(line_scratch_dir),
            '--speed',
            str(host_config.get('f5tts', {}).get('speed', 1.0)),
        ]

        print(f'Rendering F5-TTS line {line_number}: {line["speaker"]}')
        subprocess.run(command, check=True)

        generated_wav = newest_wav(line_scratch_dir)
        clip_path = lines_output_dir / f'{line_number:02d}-{host_key}.wav'
        shutil.copy2(generated_wav, clip_path)
        rendered_paths.append(clip_path)
        manifest_lines.append(
            {
                'lineNumber': line_number,
                'speaker': line['speaker'],
                'hostKey': host_key,
                'referenceAudio': str(reference_audio),
                'referenceText': reference_text,
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
            'model': 'f5tts',
            'mode': args.mode,
            'lineCount': len(manifest_lines),
            'combinedOutput': str(combined_output),
            'lines': manifest_lines,
        },
    )

    print(f'F5-TTS output ready at {combined_output}')


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(error, file=sys.stderr)
        raise
