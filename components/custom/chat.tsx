"use client";

import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { Boxes, BriefcaseBusiness, Eye, Route } from "lucide-react";
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
    icon: Boxes,
  },
  {
    title: "Walk me through",
    label: "a launch from prototype to release",
    action: "Walk me through a launch you took from prototype to release.",
    icon: Route,
  },
  {
    title: "Show me",
    label: "how you approach design engineering",
    action: "Show me how you approach design engineering on product teams.",
    icon: Eye,
  },
  {
    title: "Which projects",
    label: "best represent your recent work?",
    action: "Which projects best represent your recent work right now?",
    icon: BriefcaseBusiness,
  },
];

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
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
  const isExpanded = isPromptExpanded || !isEmptyState;

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
        <Overview
          carousel={<ImageCarousel messages={messages} />}
          expanded={isExpanded}
          panelTitle={
            <div className="w-full border-l border-[color:var(--editorial-border)] pl-4 pb-2">
              <p className="editorial-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--editorial-text)]">
                Want to chat?
              </p>
              <p className="mt-1 text-base font-normal leading-7 text-[var(--editorial-text)]">
                Explore the products, process, and decisions behind the work.
              </p>
            </div>
          }
        >
          <div className="flex min-h-0 w-full flex-col overflow-hidden">
            <div
              ref={messagesContainerRef}
              className={`mb-4 flex flex-1 basis-0 flex-col items-center gap-4 overflow-y-auto overflow-x-hidden pr-1 transition-all duration-500 ease-out ${
                isExpanded
                  ? "min-h-[220px] sm:min-h-[260px] opacity-100"
                  : "min-h-0 max-h-0 opacity-0"
              }`}
            >
              {!isEmptyState
                ? messages.map((message) => (
                    <PreviewMessage
                      key={message.id}
                      chatId={id}
                      role={message.role}
                      content={message.content}
                      attachments={message.experimental_attachments}
                      toolInvocations={message.toolInvocations}
                      append={append}
                    />
                  ))
                : null}

              {isLoading ? <TypingIndicator /> : null}

              <div
                ref={messagesEndRef}
                className="shrink-0 min-h-[24px] min-w-[24px]"
              />
            </div>

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
                    ? "min-h-[104px] rounded-xl border border-[color:var(--editorial-border)] bg-[var(--editorial-input)] px-5 pb-14 pr-24 pt-4 text-[15px] leading-7 text-[var(--editorial-text)] shadow-[var(--editorial-shadow)] placeholder:text-[var(--editorial-placeholder)] focus-visible:border-[color:var(--editorial-border)] focus-visible:ring-0 focus-visible:ring-offset-0"
                    : undefined
                }
                textareaRows={isEmptyState ? 2 : 3}
                suggestedActionsClassName={
                  isEmptyState
                    ? "rounded-lg border border-[color:var(--editorial-border)] bg-[var(--editorial-input)] px-4 py-4 shadow-[var(--editorial-shadow)] hover:bg-[var(--editorial-input-hover)]"
                    : undefined
                }
                suggestedActions={landingSuggestedActions}
                onSuggestedAction={() => setIsPromptExpanded(true)}
              />
            </form>
          </div>
        </Overview>
      </div>
    </div>
  );
}
