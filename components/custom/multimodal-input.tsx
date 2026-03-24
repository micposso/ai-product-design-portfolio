"use client";

import { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  ChangeEvent,
  ComponentType,
  SVGProps,
} from "react";
import { toast } from "sonner";

import { ArrowUpIcon, PaperclipIcon, StopIcon } from "./icons";
import { PreviewAttachment } from "./preview-attachment";
import useWindowSize from "./use-window-size";
import { Button } from "../ui/button";
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
  onSuggestedAction?: () => void;
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [attachments, handleSubmit, setAttachments, width]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/files/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType,
        };
      } else {
        const { error } = await response.json();
        toast.error(error);
      }
    } catch (error) {
      toast.error("Failed to upload file, please try again!");
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined,
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error("Error uploading files!", error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments],
  );

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
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
                    onSuggestedAction?.();
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

      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="flex flex-row gap-2 overflow-x-scroll">
          {attachments.map((attachment) => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
          ))}

          {uploadQueue.map((filename) => (
            <PreviewAttachment
              key={filename}
              attachment={{
                url: "",
                name: filename,
                contentType: "",
              }}
              isUploading={true}
            />
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
          disabled={input.length === 0 || uploadQueue.length > 0}
        >
          <ArrowUpIcon size={14} />
        </Button>
      )}

      <Button
        className="absolute bottom-3 right-11 m-0.5 h-fit rounded-full border-[color:var(--editorial-border)] bg-[var(--editorial-card)] p-1.5 text-[var(--editorial-text)] shadow-[var(--editorial-shadow)] hover:brightness-110"
        onClick={(event) => {
          event.preventDefault();
          fileInputRef.current?.click();
        }}
        variant="outline"
        disabled={isLoading}
      >
        <PaperclipIcon size={14} />
      </Button>
    </div>
  );
}
