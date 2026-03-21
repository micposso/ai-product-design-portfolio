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

  usePersistedChatState({
    storageKey: `portfolio-chat-home:${id}`,
    input,
    setInput,
    messages,
    setMessages,
  });

  return (
    <div className="h-dvh overflow-hidden bg-background pt-16 pb-6 md:pt-20 md:pb-8">
      <div
        className={`mx-auto flex size-full max-w-3xl flex-col items-center overflow-hidden px-4 md:px-6 ${
          messages.length === 0 ? "justify-center" : ""
        }`}
      >
        {messages.length === 0 && <Overview />}

        <ImageCarousel messages={messages} />

        <form className="flex w-full max-w-[500px] flex-row gap-2 relative items-end">
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
    </div>
  );
}
