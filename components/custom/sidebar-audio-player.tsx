"use client";

import { Square, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

const AUDIO_SRC = "/api/podcast-audio";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);

  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export function SidebarAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsReady(true);
      setHasError(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    const handleError = () => {
      setHasError(true);
      setIsPlaying(false);
      setIsReady(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  const progressValue = useMemo(() => {
    if (!duration) {
      return 0;
    }

    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  const togglePlayback = async () => {
    const audio = audioRef.current;

    if (!audio || hasError) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setHasError(true);
      setIsPlaying(false);
    }
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;

    if (!audio || !duration) {
      return;
    }

    const nextTime = (value / 100) * duration;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <>
      <div className="editorial-card flex items-center gap-3 rounded-full border px-3 py-2 lg:hidden">
        <audio ref={audioRef} preload="metadata" src={AUDIO_SRC} />

        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={togglePlayback}
          disabled={hasError}
          aria-label={isPlaying ? "Stop audio" : "Play audio"}
          className="size-9 shrink-0 rounded-full border-transparent bg-[var(--color-brand-primary)] text-white shadow-[0_16px_40px_-28px_rgba(34,25,19,0.18)] hover:brightness-110"
        >
          {isPlaying ? <Square className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
        </Button>

        <div className="min-w-0 flex-1">
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progressValue}
            onChange={(event) => handleSeek(Number(event.target.value))}
            disabled={!isReady || hasError}
            aria-label="Audio timeline"
            style={{
              background: `linear-gradient(90deg, #b9e6c7 0%, #b9e6c7 ${progressValue}%, rgba(160, 138, 127, 0.28) ${progressValue}%, rgba(160, 138, 127, 0.28) 100%)`,
            }}
            className="h-2 w-full cursor-pointer appearance-none rounded-full border border-[color:var(--editorial-border)]/25 accent-[#b9e6c7] disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="editorial-card hidden w-full rounded-xl border p-4 lg:block">
        <audio ref={audioRef} preload="metadata" src={AUDIO_SRC} />

        <div className="flex items-center gap-3">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={togglePlayback}
            disabled={hasError}
            aria-label={isPlaying ? "Stop audio" : "Play audio"}
            className="size-10 rounded-full border-transparent bg-[var(--color-brand-primary)] text-white shadow-[0_16px_40px_-28px_rgba(34,25,19,0.18)] hover:brightness-110"
          >
            {isPlaying ? <Square className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
          </Button>

          <div className="min-w-0 flex-1">
            <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
              Audio Intro
            </p>
            <p className="mt-1 text-sm leading-5 text-[var(--editorial-text)] sm:truncate">
              {hasError
                ? "Unable to load the generated podcast audio"
                : isReady
                  ? "A two-host podcast about the work"
                  : "Loading audio..."}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progressValue}
            onChange={(event) => handleSeek(Number(event.target.value))}
            disabled={!isReady || hasError}
            aria-label="Audio timeline"
            style={{
              background: `linear-gradient(90deg, #b9e6c7 0%, #b9e6c7 ${progressValue}%, rgba(160, 138, 127, 0.28) ${progressValue}%, rgba(160, 138, 127, 0.28) 100%)`,
            }}
            className="h-2 w-full cursor-pointer appearance-none rounded-full border border-[color:var(--editorial-border)]/25 accent-[#b9e6c7] disabled:cursor-not-allowed"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-[var(--editorial-text)]/72">
            <span className="editorial-sans">{formatTime(currentTime)}</span>
            <span className="editorial-sans">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
