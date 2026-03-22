"use client";

import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { useState } from "react";

import { Message as PreviewMessage } from "@/components/custom/message";
import { TypingIndicator } from "@/components/custom/typing-indicator";
import { usePersistedChatState } from "@/components/custom/use-persisted-chat-state";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";

import { ImageCarousel } from "./image-carousel";
import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";

const landingSuggestedActions = [
  {
    title: "Map the systems",
    label: "behind the AI products you have shipped",
    action: "Map the systems behind the AI products you have shipped lately.",
  },
  {
    title: "Walk me through",
    label: "a launch from prototype to release",
    action: "Walk me through a launch you took from prototype to release.",
  },
  {
    title: "Show me",
    label: "how you approach design engineering",
    action: "Show me how you approach design engineering on product teams.",
  },
  {
    title: "Which projects",
    label: "best represent your recent work?",
    action: "Which projects best represent your recent work right now?",
  },
];

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
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
      body: { id },
      initialMessages,
      maxSteps: 10,
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isEmptyState = messages.length === 0;

  usePersistedChatState({
    storageKey: `portfolio-chat-home:${id}`,
    input,
    setInput,
    messages,
    setMessages,
  });

  return (
    <div className="px-4 pb-6 md:px-6 md:pb-8">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col">
        <Overview carousel={<ImageCarousel messages={messages} />}>
          <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            {!isEmptyState ? (
              <div
                ref={messagesContainerRef}
                className="mb-4 flex min-h-0 flex-1 basis-0 flex-col items-center gap-4 overflow-y-auto overflow-x-hidden pr-1"
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
                  className="shrink-0 min-h-[24px] min-w-[24px]"
                />
              </div>
            ) : null}

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
                textareaClassName={
                  isEmptyState
                    ? "min-h-[180px] rounded-xl border border-white/60 bg-[#fffaf4] px-5 pb-14 pt-5 text-[15px] shadow-[0_26px_90px_-44px_rgba(34,25,19,0.18)] placeholder:text-[#8f7a67] focus-visible:ring-[#876b56]"
                    : undefined
                }
                suggestedActionsClassName={
                  isEmptyState
                    ? "rounded-lg border border-white/65 bg-[#f7f0e8] px-4 py-4 shadow-[0_18px_48px_-36px_rgba(34,25,19,0.18)] hover:bg-[#f1e6da]"
                    : undefined
                }
                suggestedActions={landingSuggestedActions}
              />
            </form>
          </div>
        </Overview>
      </div>
    </div>
  );
}
