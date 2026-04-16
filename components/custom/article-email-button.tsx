"use client";

import { Mail } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ArticleEmailButton({
  articleTitle,
  articleUrl,
  buttonLabel = "Email Me This Article",
}: {
  articleTitle: string;
  articleUrl: string;
  buttonLabel?: string;
}) {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [emailHoneypot, setEmailHoneypot] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const sendArticleEmail = useCallback(async () => {
    if (!emailAddress.trim()) {
      toast.error("Enter an email address.");
      return;
    }

    setIsSendingEmail(true);

    try {
      const response = await fetch("/api/article-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailAddress.trim(),
          company: emailHoneypot,
          articleTitle,
          articleUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "Unable to email this article right now.");
        return;
      }

      toast.success(`Article sent to ${emailAddress.trim()}.`);
      setIsComposerOpen(false);
      setEmailAddress("");
      setEmailHoneypot("");
    } catch {
      toast.error("Unable to email this article right now.");
    } finally {
      setIsSendingEmail(false);
    }
  }, [articleTitle, articleUrl, emailAddress, emailHoneypot]);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsComposerOpen((current) => !current)}
        className="editorial-sans h-9 rounded-full border-[color:var(--editorial-border)] bg-[var(--editorial-card)] px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--editorial-text)] shadow-[var(--editorial-shadow)] hover:brightness-110"
      >
        <Mail className="mr-2 size-3.5" />
        {buttonLabel}
      </Button>

      {isComposerOpen ? (
        <div className="editorial-card max-w-md rounded-xl border p-3 shadow-[var(--editorial-shadow)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[-9999px] top-auto size-px overflow-hidden opacity-0"
          >
            <label htmlFor="article-company">Company</label>
            <input
              id="article-company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={emailHoneypot}
              onChange={(event) => setEmailHoneypot(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              value={emailAddress}
              onChange={(event) => setEmailAddress(event.target.value)}
              placeholder="you@example.com"
              className="h-11 rounded-lg border-[color:var(--editorial-border)] bg-[var(--editorial-input)] text-[var(--editorial-text)] placeholder:text-[var(--editorial-placeholder)] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              type="button"
              onClick={sendArticleEmail}
              disabled={isSendingEmail}
              className="editorial-sans h-11 rounded-lg bg-[var(--color-brand-primary)] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:brightness-110"
            >
              {isSendingEmail ? "Sending..." : "Send"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsComposerOpen(false);
                setEmailHoneypot("");
              }}
              disabled={isSendingEmail}
              className="editorial-sans h-11 rounded-lg border-[color:var(--editorial-border)] bg-[var(--editorial-card)] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--editorial-text)] hover:brightness-110"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
