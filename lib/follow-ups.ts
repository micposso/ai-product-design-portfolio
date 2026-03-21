const FOLLOW_UP_QUESTIONS = [
  "Would you like to learn about my personal projects?",
  "Would you like me to walk you through one of those projects in more detail?",
  "Would you like me to share another insight I have written about?",
  "Would you like me to walk through the tools and technologies I use most often?",
  "Would you like a quick overview of my current role and focus areas?",
  "Would you like to hear how those interests connect to the products I build?",
  "Would you like to learn more about the broader background behind my work?",
  "Would you like to explore another part of my background?",
] as const;

const AFFIRMATIVE_REPLIES = new Set([
  "absolutely",
  "go ahead",
  "ok",
  "okay",
  "please do",
  "sure",
  "tell me more",
  "yes",
  "yes please",
  "yeah",
  "yep",
]);

export type FollowUpQuestion = (typeof FOLLOW_UP_QUESTIONS)[number];

export function getAllFollowUpQuestions() {
  return [...FOLLOW_UP_QUESTIONS];
}

export function extractFollowUpQuestion(text: string) {
  const normalizedText = text.trim();

  return FOLLOW_UP_QUESTIONS.find((question) =>
    normalizedText.endsWith(question),
  );
}

export function isAffirmativeReply(text: string) {
  const normalizedText = text.trim().toLowerCase();

  return AFFIRMATIVE_REPLIES.has(normalizedText);
}
