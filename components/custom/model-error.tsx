"use client";

import { AlertTriangle } from "lucide-react";

export function ModelError({ error }: { error: Error | undefined }) {
  if (!error) {
    return null;
  }

  return (
    <div
      role="alert"
      className="mb-3 w-full rounded-xl border border-red-300/70 bg-red-50/90 px-4 py-3 text-red-950 shadow-sm dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-100"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.16em]">
            Model call failed
          </p>
          <p className="mt-1 text-sm leading-6">
            The assistant could not complete this response. The technical details
            from the model provider are below.
          </p>
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-black/5 px-3 py-2 font-mono text-xs leading-5 dark:bg-white/10">
            {error.message || "The model returned an unknown error."}
          </pre>
        </div>
      </div>
    </div>
  );
}
