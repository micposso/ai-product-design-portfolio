import { google } from "@ai-sdk/google";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";

import { customMiddleware } from "./custom-middleware";

export const geminiProModel = wrapLanguageModel({
  // Keep the existing model role for callers that opt into PORTFOLIO_CHAT_MODEL=pro.
  // Gemini 3.8 Flash is the current stable model recommended for new users.
  model: google("gemini-3.8-flash"),
  middleware: customMiddleware,
});

export const geminiFlashModel = wrapLanguageModel({
  model: google("gemini-3.8-flash"),
  middleware: customMiddleware,
});
