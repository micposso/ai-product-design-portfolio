"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Square, Play, Mail } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [emailHoneypot, setEmailHoneypot] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

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

  const sendAudioEmail = useCallback(async () => {
    if (!emailAddress.trim()) {
      toast.error("Enter an email address.");
      return;
    }

    setIsSendingEmail(true);

    try {
      const response = await fetch("/api/podcast-audio-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailAddress.trim(),
          company: emailHoneypot,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "Unable to email the audio right now.");
        return;
      }

      toast.success(`Audio link sent to ${emailAddress.trim()}.`);
      setIsEmailComposerOpen(false);
      setEmailAddress("");
      setEmailHoneypot("");
    } catch {
      toast.error("Unable to email the audio right now.");
    } finally {
      setIsSendingEmail(false);
    }
  }, [emailAddress, emailHoneypot]);

  return (
    <div className="relative">
      <AnimatePresence initial={false}>
        {isEmailComposerOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="editorial-card absolute inset-x-0 bottom-full z-20 mb-3 flex flex-col gap-3 rounded-xl border p-3 shadow-[var(--editorial-shadow)]"
          >
            <div>
              <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
                Email This Audio
              </p>
              <p className="mt-1 text-sm text-[var(--editorial-text)]">
                We&apos;ll send a direct link to the audio intro.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[-9999px] top-auto size-px overflow-hidden opacity-0"
              >
                <label htmlFor="audio-company">Company</label>
                <input
                  id="audio-company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={emailHoneypot}
                  onChange={(event) => setEmailHoneypot(event.target.value)}
                />
              </div>

              <Input
                type="email"
                value={emailAddress}
                onChange={(event) => setEmailAddress(event.target.value)}
                placeholder="you@example.com"
                className="h-11 rounded-lg border-[color:var(--editorial-border)] bg-[var(--editorial-input)] text-[var(--editorial-text)] placeholder:text-[var(--editorial-placeholder)] focus-visible:ring-0 focus-visible:ring-offset-0"
              />

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  onClick={sendAudioEmail}
                  disabled={isSendingEmail || hasError}
                  className="editorial-sans h-11 rounded-lg bg-[var(--color-brand-primary)] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:brightness-110"
                >
                  {isSendingEmail ? "Sending..." : "Send Email"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEmailComposerOpen(false);
                    setEmailHoneypot("");
                  }}
                  disabled={isSendingEmail}
                  className="editorial-sans h-11 rounded-lg border-[color:var(--editorial-border)] bg-[var(--editorial-card)] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--editorial-text)] hover:brightness-110"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

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
            className="h-2 w-full cursor-pointer appearance-none rounded-full border border-[color:var(--editorial-border)]/25 accent-[var(--color-brand-primary)] disabled:cursor-not-allowed"
          />
        </div>

        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() => setIsEmailComposerOpen((current) => !current)}
          disabled={hasError}
          aria-label="Email this audio"
          className="size-9 shrink-0 rounded-full border-[color:var(--editorial-border)] bg-[var(--editorial-card)] text-[var(--editorial-text)] shadow-[var(--editorial-shadow)] hover:brightness-110"
        >
          <Mail className="size-4" />
        </Button>
      </div>

      <div className="mt-3 px-1 lg:hidden">
        <div className="border-l border-[color:var(--editorial-border)] pl-4">
          <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
            Podcast 01
          </p>
          <p className="mt-1 text-sm leading-5 text-[var(--editorial-text)]">
            {hasError
              ? "Unable to load the generated podcast audio"
              : isReady
                ? "A two-host podcast about my work in product and AI"
                : "Loading audio..."}
          </p>
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

          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => setIsEmailComposerOpen((current) => !current)}
            disabled={hasError}
            aria-label="Email this audio"
            className="size-10 rounded-full border-[color:var(--editorial-border)] bg-[var(--editorial-card)] text-[var(--editorial-text)] shadow-[var(--editorial-shadow)] hover:brightness-110"
          >
            <Mail className="size-4" />
          </Button>
        </div>

        <div className="mt-4 border-l border-[color:var(--editorial-border)] pl-4">
          <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
            Podcast 01
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--editorial-text)]">
            {hasError
              ? "Unable to load the generated podcast audio"
              : isReady
                ? "A two-host podcast about my work in product and AI"
                : "Loading audio..."}
          </p>
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
            className="h-2 w-full cursor-pointer appearance-none rounded-full border border-[color:var(--editorial-border)]/25 accent-[var(--color-brand-primary)] disabled:cursor-not-allowed"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-[var(--editorial-text)]/72">
            <span className="editorial-sans">{formatTime(currentTime)}</span>
            <span className="editorial-sans">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
