const FOLLOW_UPS = [
  {
    question: "Would you like to learn about my personal projects?",
    action: "Tell me about your personal projects",
  },
  {
    question:
      "Would you like me to walk you through one of those projects in more detail?",
    action: "Walk me through one of those projects in more detail",
  },
  {
    question: "Would you like me to share another insight I have written about?",
    action: "Share another insight you have written about",
  },
  {
    question:
      "Would you like me to walk through the tools and technologies I use most often?",
    action: "Walk through the tools and technologies you use most often",
  },
  {
    question: "Would you like a quick overview of my current role and focus areas?",
    action: "Give me a quick overview of your current role and focus areas",
  },
  {
    question:
      "Would you like to hear how those interests connect to the products I build?",
    action: "Explain how those interests connect to the products you build",
  },
  {
    question:
      "Would you like to learn more about the broader background behind my work?",
    action: "Tell me more about the broader background behind your work",
  },
  {
    question: "Would you like to explore another part of my background?",
    action: "Explore another part of your background",
  },
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

export type FollowUpQuestion = (typeof FOLLOW_UPS)[number]["question"];

export function getAllFollowUpQuestions() {
  return FOLLOW_UPS.map((entry) => entry.question);
}

export function extractFollowUpQuestion(text: string) {
  const normalizedText = text.trim();

  return FOLLOW_UPS.find((entry) => normalizedText.endsWith(entry.question))
    ?.question;
}

export function getFollowUpAction(question: FollowUpQuestion) {
  return FOLLOW_UPS.find((entry) => entry.question === question)?.action ?? question;
}

export function isAffirmativeReply(text: string) {
  const normalizedText = text.trim().toLowerCase();

  return AFFIRMATIVE_REPLIES.has(normalizedText);
}
