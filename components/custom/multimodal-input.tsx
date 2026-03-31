"use client";

import { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Mail } from "lucide-react";
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  ComponentType,
  SVGProps,
} from "react";
import { toast } from "sonner";

import { ArrowUpIcon, StopIcon } from "./icons";
import useWindowSize from "./use-window-size";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const defaultSuggestedActions = [
  {
    title: "Tell me about",
    label: "your professional experience",
    action: "Tell me about your professional experience",
  },
  {
    title: "What have you",
    label: "built lately?",
    action: "What have you built lately?",
  },
];

type SuggestedAction = {
  title: string;
  label: string;
  action: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

export function MultimodalInput({
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  append,
  handleSubmit,
  textareaClassName,
  textareaRows = 3,
  suggestedActionsClassName,
  suggestedActions = defaultSuggestedActions,
  onSuggestedAction,
}: {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<Message>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  textareaClassName?: string;
  textareaRows?: number;
  suggestedActionsClassName?: string;
  suggestedActions?: Array<SuggestedAction>;
  onSuggestedAction?: (
    action: string,
  ) => Promise<string | null | undefined> | void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 0}px`;
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [emailHoneypot, setEmailHoneypot] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [attachments, handleSubmit, setAttachments, width]);

  const sendConversationEmail = useCallback(async () => {
    if (messages.length === 0) {
      toast.error("Start a conversation before emailing it.");
      return;
    }

    if (!emailAddress.trim()) {
      toast.error("Enter an email address.");
      return;
    }

    setIsSendingEmail(true);

    try {
      const response = await fetch("/api/conversation-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailAddress.trim(),
          company: emailHoneypot,
          messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "Unable to email this conversation right now.");
        return;
      }

      toast.success(`Conversation sent to ${emailAddress.trim()}.`);
      setIsEmailComposerOpen(false);
      setEmailAddress("");
      setEmailHoneypot("");
    } catch {
      toast.error("Unable to email this conversation right now.");
    } finally {
      setIsSendingEmail(false);
    }
  }, [emailAddress, emailHoneypot, messages]);

  const copyConversationToClipboard = useCallback(async () => {
    if (messages.length === 0) {
      toast.error("Start a conversation before copying it.");
      return;
    }

    const transcript = messages
      .map((message) => {
        if (typeof message.content !== "string") {
          return null;
        }

        const content = message.content.trim();

        if (!content) {
          return null;
        }

        return `${message.role === "assistant" ? "MichaelPosso.ai" : "You"}\n${content}`;
      })
      .filter(Boolean)
      .join("\n\n");

    if (!transcript) {
      toast.error("There is no conversation text to copy yet.");
      return;
    }

    try {
      await navigator.clipboard.writeText(transcript);
      toast.success("Conversation copied to clipboard.");
    } catch {
      toast.error("Unable to copy the conversation right now.");
    }
  }, [messages]);

  return (
    <div className="relative w-full flex flex-col gap-4">
      <AnimatePresence initial={false}>
        {isEmailComposerOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="editorial-card flex flex-col gap-3 rounded-xl border p-3 shadow-[var(--editorial-shadow)]"
          >
            <div>
              <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
                Email this conversation
              </p>
              <p className="mt-1 text-sm text-[var(--editorial-text)]">
                We&apos;ll send a copy with the subject line
                {" "}
                <span className="editorial-sans font-semibold">
                  Conversation with michaelposso.ai
                </span>
                .
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[-9999px] top-auto size-px overflow-hidden opacity-0"
              >
                <label htmlFor="conversation-company">Company</label>
                <input
                  id="conversation-company"
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
              <Button
                type="button"
                onClick={sendConversationEmail}
                disabled={isSendingEmail}
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
          </motion.div>
        ) : null}
      </AnimatePresence>

      {messages.length === 0 &&
        attachments.length === 0 &&
        (
          <div className="grid w-full gap-3 md:px-0 md:max-w-none sm:grid-cols-2">
            {suggestedActions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.05 * index }}
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={async () => {
                    if (onSuggestedAction) {
                      await onSuggestedAction(suggestedAction.action);
                      return;
                    }

                    append({
                      role: "user",
                      content: suggestedAction.action,
                    });
                  }}
                  className={`w-full rounded-lg border border-[color:var(--editorial-border)] bg-[var(--editorial-card)] p-3 text-left text-sm text-[var(--editorial-text)] shadow-[var(--editorial-shadow)] transition hover:brightness-110 ${suggestedActionsClassName ?? ""}`}
                >
                  <span className="flex items-start gap-3">
                    {suggestedAction.icon ? (
                      <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--editorial-border)]">
                        <suggestedAction.icon className="size-4" />
                      </span>
                    ) : null}
                    <span className="flex flex-col items-start">
                      <span className="editorial-sans text-xs font-semibold uppercase tracking-[0.16em] text-inherit">
                        {suggestedAction.title}
                      </span>
                      <span className="mt-1 text-[var(--editorial-text)]">
                        {suggestedAction.label}
                      </span>
                    </span>
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
        )}

      <Textarea
        ref={textareaRef}
        placeholder="Ask about launches, systems, or the thinking behind the work..."
        value={input}
        onChange={handleInput}
        className={`min-h-[24px] overflow-hidden resize-none rounded-lg text-base bg-muted border-none ${textareaClassName ?? ""}`}
        rows={textareaRows}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            if (isLoading) {
              toast.error("Please wait for the model to finish its response!");
            } else {
              submitForm();
            }
          }
        }}
      />

      {isLoading ? (
        <Button
          className="absolute bottom-3 right-3 m-0.5 h-fit rounded-full bg-[var(--color-brand-primary)] p-1.5 text-white hover:brightness-110"
          onClick={(event) => {
            event.preventDefault();
            stop();
          }}
        >
          <StopIcon size={14} />
        </Button>
      ) : (
        <Button
          className="absolute bottom-3 right-3 m-0.5 h-fit rounded-full bg-[var(--color-brand-primary)] p-1.5 text-white hover:brightness-110"
          onClick={(event) => {
            event.preventDefault();
            submitForm();
          }}
          disabled={input.length === 0}
        >
          <ArrowUpIcon size={14} />
        </Button>
      )}

      {messages.length > 0 ? (
        <>
          <Button
            type="button"
            variant="outline"
            className="absolute bottom-3 right-11 m-0.5 h-fit rounded-full border-[color:var(--editorial-border)] bg-[var(--editorial-card)] p-1.5 text-[var(--editorial-text)] shadow-[var(--editorial-shadow)] hover:brightness-110"
            onClick={(event) => {
              event.preventDefault();
              copyConversationToClipboard();
            }}
            disabled={isLoading}
            aria-label="Copy this conversation"
          >
            <Copy size={14} />
          </Button>

          <Button
            type="button"
            variant="outline"
            className="absolute bottom-3 right-[76px] m-0.5 h-fit rounded-full border-[color:var(--editorial-border)] bg-[var(--editorial-card)] p-1.5 text-[var(--editorial-text)] shadow-[var(--editorial-shadow)] hover:brightness-110"
            onClick={(event) => {
              event.preventDefault();
              setIsEmailComposerOpen((current) => !current);
            }}
            disabled={isLoading}
            aria-label="Email this conversation"
          >
            <Mail size={14} />
          </Button>
        </>
      ) : null}
    </div>
  );
}
