"use client";

import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { Message as PreviewMessage } from "@/components/custom/message";
import { TypingIndicator } from "@/components/custom/typing-indicator";
import { usePersistedChatState } from "@/components/custom/use-persisted-chat-state";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";
import { PageContext } from "@/lib/rag";

import { MultimodalInput } from "./multimodal-input";
import { Button } from "../ui/button";

export function CaseStudyChat({
  id,
  promptHint,
  dockLabel = "Chat About This Work",
  overlayTitle = "Ask about this case study",
  pageContext,
  suggestedActions,
}: {
  id: string;
  promptHint: string;
  dockLabel?: string;
  overlayTitle?: string;
  pageContext?: PageContext;
  suggestedActions?: Array<{
    title: string;
    label: string;
    action: string;
  }>;
}) {
  const {
    messages,
    handleSubmit,
    input,
    setInput,
    setMessages,
    append,
    isLoading,
    stop,
  } =
    useChat({
      id,
      body: { id, pageContext },
      initialMessages: [],
      maxSteps: 10,
    });

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  usePersistedChatState({
    storageKey: `portfolio-chat-context:${id}`,
    input,
    setInput,
    messages,
    setMessages,
  });

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFocused]);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6 md:pb-6">
        <div className="editorial-card pointer-events-auto flex w-full max-w-2xl items-end rounded-[1.75rem] border p-2 sm:p-3">
          <button
            type="button"
            onClick={() => setIsFocused(true)}
            className="flex-1 rounded-xl border border-[color:var(--editorial-border)] bg-[var(--editorial-input)] px-4 py-2.5 text-left text-[var(--editorial-text)] shadow-[var(--editorial-shadow)] transition hover:bg-[var(--editorial-input-hover)] sm:py-3"
          >
            <span className="editorial-sans block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-placeholder)]">
              {dockLabel}
            </span>
            <span className="mt-1 hidden text-sm text-[var(--editorial-text)] sm:block">
              {promptHint}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isFocused ? (
          <motion.div
            className="fixed inset-0 z-50 bg-[var(--editorial-overlay)] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex size-full items-end justify-center p-3 sm:items-center sm:px-4 sm:py-6 md:px-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 12 }}
                className="flex w-full max-w-[820px] max-h-[92dvh] flex-col overflow-hidden rounded-3xl bg-[var(--editorial-shell)] p-2 text-[var(--editorial-text)] shadow-[0_40px_110px_-52px_rgba(28,23,19,0.5)] sm:max-h-[86vh] sm:rounded-[2rem] sm:p-3"
              >
                <div className="flex h-full min-h-0 flex-col gap-2 rounded-[calc(1.5rem-0.5rem)]">
                  <div className="mb-1 flex items-center justify-between px-1 pt-1 sm:mb-2">
                    <div className="border-l border-[color:var(--editorial-border)] pl-4">
                      <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
                        Focus Mode
                      </p>
                      <h2 className="mt-1 text-base font-normal leading-7 text-[var(--editorial-text)]">
                        {overlayTitle}
                      </h2>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="editorial-card rounded-full border text-[var(--editorial-text)] hover:brightness-110"
                      onClick={() => setIsFocused(false)}
                      aria-label="Exit chat mode"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>

                  <div
                    className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[color:var(--editorial-border)] bg-[var(--editorial-subtle-surface)] p-2 text-[var(--editorial-text)] shadow-[var(--editorial-shadow)] sm:p-3 ${
                      messages.length === 0 ? "justify-start" : ""
                    }`}
                  >
                    <form className="relative flex w-full shrink-0 flex-row items-end gap-2">
                      <MultimodalInput
                        input={input}
                        setInput={setInput}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                        stop={stop}
                        attachments={attachments}
                        setAttachments={setAttachments}
                        messages={messages}
                        append={append}
                        textareaClassName="min-h-[104px] rounded-xl border border-[color:var(--editorial-border)] bg-[var(--editorial-input)] px-5 pb-14 pr-24 pt-4 text-[15px] leading-7 text-[var(--editorial-text)] shadow-[var(--editorial-shadow)] placeholder:text-[var(--editorial-placeholder)] focus-visible:border-[color:var(--editorial-border)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        textareaRows={messages.length === 0 ? 2 : 3}
                        suggestedActionsClassName="rounded-lg border border-[color:var(--editorial-border)] bg-[var(--editorial-input)] px-4 py-4 shadow-[var(--editorial-shadow)] hover:bg-[var(--editorial-input-hover)]"
                        suggestedActions={suggestedActions}
                      />
                    </form>

                    <div
                      ref={messagesContainerRef}
                      className={`mt-4 flex min-h-0 flex-1 basis-0 flex-col items-center gap-4 overflow-y-auto overflow-x-hidden pr-1 transition-all duration-500 ease-out ${
                        messages.length > 0
                          ? "min-h-[220px] sm:min-h-[260px] opacity-100"
                          : "min-h-0 max-h-0 opacity-0"
                      }`}
                    >
                      {messages.map((message) => (
                        <PreviewMessage
                          key={message.id}
                          chatId={id}
                          role={message.role}
                          content={message.content}
                          attachments={message.experimental_attachments}
                          toolInvocations={message.toolInvocations}
                          append={append}
                        />
                      ))}

                      {isLoading ? <TypingIndicator /> : null}

                      <div
                        ref={messagesEndRef}
                        className="shrink-0 min-w-[24px] min-h-[24px]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
