import json
import shutil
import wave
from pathlib import Path
from typing import Any


def load_json(path: Path) -> Any:
    with path.open('r', encoding='utf-8') as file:
        return json.load(file)


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('w', encoding='utf-8') as file:
        json.dump(payload, file, indent=2)
        file.write('\n')


def resolve_path(base_dir: Path, raw_path: str) -> Path:
    candidate = Path(raw_path)
    if candidate.is_absolute():
        return candidate
    return (base_dir / candidate).resolve()


def ensure_clean_dir(path: Path) -> None:
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True, exist_ok=True)


def select_lines(lines: list[dict[str, Any]], config: dict[str, Any], mode: str) -> list[tuple[int, dict[str, Any]]]:
    comparison = config.get('comparison', {})
    explicit_line_numbers = comparison.get('lineNumbers') or []

    if explicit_line_numbers:
        selected = []
        for number in explicit_line_numbers:
            index = int(number) - 1
            if index < 0 or index >= len(lines):
                raise ValueError(f'Line number out of range: {number}')
            selected.append((index + 1, lines[index]))
        return selected

    if mode == 'compare':
        max_lines = int(comparison.get('maxLines', 6))
        return [(index + 1, line) for index, line in enumerate(lines[:max_lines])]

    return [(index + 1, line) for index, line in enumerate(lines)]


def append_style_hint(text: str, host_config: dict[str, Any]) -> str:
    style_hint = (host_config.get('styleHint') or '').strip()
    if not style_hint:
        return text

    style_mode = (host_config.get('styleHintMode') or 'none').strip().lower()
    if style_mode == 'prefix':
        return f'{style_hint}\n\n{text}'

    if style_mode == 'parenthetical':
        return f'({style_hint}) {text}'

    return text


def combine_wav_files(input_paths: list[Path], output_path: Path, pause_ms: int) -> None:
    if not input_paths:
        raise ValueError('No input WAV files provided.')

    output_path.parent.mkdir(parents=True, exist_ok=True)

    with wave.open(str(input_paths[0]), 'rb') as first_wave:
        params = first_wave.getparams()
        frame_rate = first_wave.getframerate()
        sample_width = first_wave.getsampwidth()
        channels = first_wave.getnchannels()

    pause_frames = int(frame_rate * (pause_ms / 1000))
    silence = b'\x00' * pause_frames * sample_width * channels

    with wave.open(str(output_path), 'wb') as out_wave:
        out_wave.setparams(params)

        for index, file_path in enumerate(input_paths):
            with wave.open(str(file_path), 'rb') as in_wave:
                current_params = in_wave.getparams()
                if current_params[:4] != params[:4]:
                    raise ValueError(f'WAV format mismatch: {file_path}')
                out_wave.writeframes(in_wave.readframes(in_wave.getnframes()))

            if index < len(input_paths) - 1 and pause_ms > 0:
                out_wave.writeframes(silence)
