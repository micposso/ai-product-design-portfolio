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
  pageContext?: {
    type: "insight" | "case-study";
    slug: string;
  };
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
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-4 md:px-6 md:pb-6">
        <div className="pointer-events-auto flex w-full max-w-2xl items-end rounded-[1.75rem] border border-white/45 bg-background/90 p-3 shadow-[0_18px_50px_-22px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setIsFocused(true)}
            className="flex-1 rounded-[1.25rem] border border-zinc-200 bg-white px-4 py-3 text-left transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
          >
            <span className="block text-xs uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              {dockLabel}
            </span>
            <span className="mt-1 block text-sm text-zinc-700 dark:text-zinc-300">
              {promptHint}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isFocused ? (
          <motion.div
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex size-full items-center justify-center px-4 py-6 md:px-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 12 }}
                className="flex size-full max-h-[86vh] max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-black p-4 text-zinc-100 shadow-[0_40px_120px_-48px_rgba(15,23,42,0.92)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
                      Focus Mode
                    </p>
                    <h2 className="text-lg font-medium text-zinc-100">
                      {overlayTitle}
                    </h2>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsFocused(false)}
                    aria-label="Exit chat mode"
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                <div
                  className={`flex min-h-0 flex-1 flex-col items-center overflow-hidden ${
                    messages.length === 0 ? "justify-center" : ""
                  }`}
                >
                  <form className="flex w-full max-w-[560px] flex-row items-end gap-2">
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
                      textareaClassName="border border-white/10 bg-white/10 text-white placeholder:text-zinc-400 backdrop-blur-sm focus-visible:ring-zinc-500"
                      suggestedActionsClassName="border-white/10 bg-white/10 text-white hover:bg-white/15 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                      suggestedActions={suggestedActions}
                    />
                  </form>

                  <div
                    ref={messagesContainerRef}
                    className="mt-6 flex min-h-0 w-full flex-1 flex-col items-center gap-4 overflow-y-auto overflow-x-hidden"
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
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
