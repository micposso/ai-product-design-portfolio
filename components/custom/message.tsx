"use client";

import { Attachment, CreateMessage, ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Streamdown } from "streamdown";

import { extractFollowUpQuestion } from "@/lib/follow-ups";
import {
  extractSourceTitles,
  stripSourceMetadata,
} from "@/lib/message-metadata";

import { MessageIcon, PencilEditIcon } from "./icons";
import { PreviewAttachment } from "./preview-attachment";
import { Weather } from "./weather";
import { AuthorizePayment } from "../flights/authorize-payment";
import { DisplayBoardingPass } from "../flights/boarding-pass";
import { CreateReservation } from "../flights/create-reservation";
import { FlightStatus } from "../flights/flight-status";
import { ListFlights } from "../flights/list-flights";
import { SelectSeats } from "../flights/select-seats";
import { VerifyPayment } from "../flights/verify-payment";

const REFUSAL_RECOVERY_PROMPT = "Want to learn about my professional experience?";

function isRefusalMessage(content: string) {
  const normalizedContent = content.toLowerCase();

  return (
    normalizedContent.includes("let's keep things in focus") ||
    normalizedContent.includes("keep our eyes on the prize") ||
    (normalizedContent.includes("professional background") &&
      normalizedContent.includes("professional experience")) ||
    normalizedContent.includes("outside scope")
  );
}

export const Message = ({
  chatId,
  role,
  content,
  toolInvocations,
  attachments,
  append,
}: {
  chatId: string;
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
  append?: (message: CreateMessage) => Promise<string | null | undefined>;
}) => {
  const normalizedContent =
    typeof content === "string" ? stripSourceMetadata(content) : content;
  const sourceTitles =
    typeof content === "string" ? extractSourceTitles(content) : [];
  const followUpQuestion =
    role === "assistant" && typeof normalizedContent === "string"
      ? extractFollowUpQuestion(normalizedContent)
      : undefined;
  const shouldShowRefusalRecovery =
    role === "assistant" &&
    typeof normalizedContent === "string" &&
    isRefusalMessage(normalizedContent);

  return (
    <motion.div
      className="flex w-full flex-row gap-4 px-4 md:px-0"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] border rounded-sm p-1 flex flex-col justify-center items-center shrink-0 text-zinc-500">
        {role === "assistant" ? (
          <MessageIcon size={16} />
        ) : (
          <PencilEditIcon size={16} />
        )}
      </div>

      <div className="flex flex-col gap-2 w-full">
        {normalizedContent && typeof normalizedContent === "string" && (
          <div className="flex flex-col gap-4 text-[0.95rem] leading-7 text-zinc-800 dark:text-zinc-300">
            <Streamdown>{normalizedContent}</Streamdown>

            {role === "assistant" && sourceTitles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {sourceTitles.map((title) => (
                  <span
                    key={title}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                  >
                    Based on: {title}
                  </span>
                ))}
              </div>
            ) : null}

            {shouldShowRefusalRecovery && append ? (
              <div>
                <button
                  type="button"
                  onClick={() =>
                    append({
                      role: "user",
                      content: REFUSAL_RECOVERY_PROMPT,
                    })
                  }
                  className="rounded-full border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  {REFUSAL_RECOVERY_PROMPT}
                </button>
              </div>
            ) : null}

            {followUpQuestion && append ? (
              <div>
                <button
                  type="button"
                  onClick={() =>
                    append({
                      role: "user",
                      content: followUpQuestion,
                    })
                  }
                  className="rounded-full border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  {followUpQuestion}
                </button>
              </div>
            ) : null}
          </div>
        )}

        {toolInvocations && (
          <div className="flex flex-col gap-4">
            {toolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === "result") {
                const { result } = toolInvocation;

                return (
                  <div key={toolCallId}>
                    {toolName === "getWeather" ? (
                      <Weather weatherAtLocation={result} />
                    ) : toolName === "displayFlightStatus" ? (
                      <FlightStatus flightStatus={result} />
                    ) : toolName === "searchFlights" ? (
                      <ListFlights chatId={chatId} results={result} />
                    ) : toolName === "selectSeats" ? (
                      <SelectSeats chatId={chatId} availability={result} />
                    ) : toolName === "createReservation" ? (
                      Object.keys(result).includes("error") ? null : (
                        <CreateReservation reservation={result} />
                      )
                    ) : toolName === "authorizePayment" ? (
                      <AuthorizePayment intent={result} />
                    ) : toolName === "displayBoardingPass" ? (
                      <DisplayBoardingPass boardingPass={result} />
                    ) : toolName === "verifyPayment" ? (
                      <VerifyPayment result={result} />
                    ) : (
                      <div>{JSON.stringify(result, null, 2)}</div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={toolCallId} className="skeleton">
                    {toolName === "getWeather" ? (
                      <Weather />
                    ) : toolName === "displayFlightStatus" ? (
                      <FlightStatus />
                    ) : toolName === "searchFlights" ? (
                      <ListFlights chatId={chatId} />
                    ) : toolName === "selectSeats" ? (
                      <SelectSeats chatId={chatId} />
                    ) : toolName === "createReservation" ? (
                      <CreateReservation />
                    ) : toolName === "authorizePayment" ? (
                      <AuthorizePayment />
                    ) : toolName === "displayBoardingPass" ? (
                      <DisplayBoardingPass />
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        )}

        {attachments && (
          <div className="flex flex-row gap-2">
            {attachments.map((attachment) => (
              <PreviewAttachment key={attachment.url} attachment={attachment} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
