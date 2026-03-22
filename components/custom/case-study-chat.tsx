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
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6 md:pb-6">
        <div className="pointer-events-auto flex w-full max-w-2xl items-end rounded-[1.75rem] border border-white/55 bg-[#f7f1ea]/82 p-3 shadow-[0_18px_50px_-22px_rgba(34,25,19,0.28)] backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setIsFocused(true)}
            className="flex-1 rounded-[1.25rem] border border-white/70 bg-white/78 px-4 py-3 text-left shadow-[0_18px_48px_-36px_rgba(34,25,19,0.18)] transition hover:bg-white/90"
          >
            <span className="block text-xs uppercase tracking-[0.22em] text-[#8b725f]">
              {dockLabel}
            </span>
            <span className="mt-1 block text-sm text-[#4b3d31]">
              {promptHint}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isFocused ? (
          <motion.div
            className="fixed inset-0 z-50 bg-[rgba(33,24,18,0.32)] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex size-full items-end justify-center p-3 sm:items-center sm:px-4 sm:py-6 md:px-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 12 }}
                className="flex size-full max-h-[92dvh] max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/50 bg-[#f7f1ea]/90 p-3 text-[#261d18] shadow-[0_40px_120px_-48px_rgba(34,25,19,0.45)] backdrop-blur-xl sm:max-h-[86vh] sm:rounded-[2rem] sm:p-4"
              >
                <div className="mb-3 flex items-center justify-between sm:mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#8b725f]">
                      Focus Mode
                    </p>
                    <h2 className="text-lg font-medium text-[#261d18]">
                      {overlayTitle}
                    </h2>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-full border-white/70 bg-white/70 text-[#4b3d31] hover:bg-white"
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
                      textareaClassName="border border-white/70 bg-white/80 text-[#261d18] placeholder:text-[#8b725f] shadow-[0_26px_90px_-44px_rgba(34,25,19,0.18)] backdrop-blur-sm focus-visible:ring-[#876b56]"
                      suggestedActionsClassName="border border-white/65 bg-[#f7f0e8] text-[#261d18] shadow-[0_18px_48px_-36px_rgba(34,25,19,0.18)] hover:bg-[#f1e6da]"
                      suggestedActions={suggestedActions}
                    />
                  </form>

                  <div
                    ref={messagesContainerRef}
                    className="mt-4 flex min-h-0 w-full flex-1 flex-col items-center gap-4 overflow-y-auto overflow-x-hidden sm:mt-6"
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
