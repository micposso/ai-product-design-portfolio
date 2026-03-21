"use client";

import { Message } from "ai";
import { useEffect, useState } from "react";

const MAX_STORED_MESSAGES = 40;

type PersistedChatState = {
  input: string;
  messages: Array<Message>;
};

function isValidPersistedMessage(value: unknown): value is Message {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<Message>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.role === "string" &&
    (typeof candidate.content === "string" || Array.isArray(candidate.content))
  );
}

function readPersistedChatState(storageKey: string) {
  try {
    const rawValue = window.sessionStorage.getItem(storageKey);

    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as Partial<PersistedChatState>;
    const messages = Array.isArray(parsed.messages)
      ? parsed.messages.filter(isValidPersistedMessage).slice(-MAX_STORED_MESSAGES)
      : [];

    return {
      input: typeof parsed.input === "string" ? parsed.input : "",
      messages,
    };
  } catch {
    return null;
  }
}

export function usePersistedChatState({
  input,
  messages,
  setInput,
  setMessages,
  storageKey,
}: {
  input: string;
  messages: Array<Message>;
  setInput: (value: string) => void;
  setMessages: (messages: Array<Message>) => void;
  storageKey: string;
}) {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const persistedState = readPersistedChatState(storageKey);

    if (persistedState) {
      setMessages(persistedState.messages);
      setInput(persistedState.input);
    }

    setHasHydrated(true);
  }, [setInput, setMessages, storageKey]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (messages.length === 0 && input.trim().length === 0) {
      window.sessionStorage.removeItem(storageKey);
      return;
    }

    const nextState: PersistedChatState = {
      input,
      messages: messages.slice(-MAX_STORED_MESSAGES),
    };

    window.sessionStorage.setItem(storageKey, JSON.stringify(nextState));
  }, [hasHydrated, input, messages, storageKey]);
}
