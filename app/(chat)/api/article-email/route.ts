import { NextResponse } from "next/server";
import { z } from "zod";

const SITE_NAME = "michaelposso.ai";
const SUBJECT = "Article from michaelposso.ai";
const INTRO = "Here is the article you requested from michaelposso.ai.";
const RESEND_FALLBACK_FROM = "Michael Posso <onboarding@resend.dev>";

const ArticleEmailSchema = z.object({
  email: z.string().email(),
  company: z.string().max(0).optional().default(""),
  articleTitle: z.string().min(1).max(200),
  articleUrl: z.string().url(),
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtmlEmail(articleTitle: string, articleUrl: string) {
  const safeTitle = escapeHtml(articleTitle);
  const safeUrl = escapeHtml(articleUrl);

  return `
    <div style="background:#f5efe8;padding:32px 16px;">
      <div style="max-width:720px;margin:0 auto;background:#fffaf5;border:1px solid #d1b8a7;border-radius:20px;padding:32px;">
        <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#2d6b47;">
          ${SITE_NAME}
        </p>
        <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:32px;line-height:1.1;color:#2f2a26;">
          ${safeTitle}
        </h1>
        <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#4a433d;">
          ${INTRO}
        </p>
        <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#4a433d;">
          <a href="${safeUrl}" style="color:#2d6b47;text-decoration:underline;">
            Read the article
          </a>
        </p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#6c6259;word-break:break-all;">
          ${safeUrl}
        </p>
      </div>
    </div>
  `;
}

function buildTextEmail(articleTitle: string, articleUrl: string) {
  return `${SITE_NAME}\n\n${INTRO}\n\n${articleTitle}\n${articleUrl}`;
}

function parseEmailAddress(fromAddress: string) {
  const match = fromAddress.match(/<([^>]+)>/);

  return (match?.[1] ?? fromAddress).trim();
}

function parseDomainFromEmailAddress(emailAddress: string) {
  const [, domain = ""] = emailAddress.split("@");

  return domain.toLowerCase();
}

async function sendArticleEmail({
  from,
  to,
  subject,
  html,
  text,
}: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      text,
    }),
  });
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured." },
      { status: 500 },
    );
  }

  try {
    const json = await request.json();
    const validated = ArticleEmailSchema.safeParse(json);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    const { articleTitle, articleUrl, email } = validated.data;
    const fromAddress = process.env.EMAIL_FROM ?? RESEND_FALLBACK_FROM;
    const html = buildHtmlEmail(articleTitle, articleUrl);
    const text = buildTextEmail(articleTitle, articleUrl);

    let response = await sendArticleEmail({
      from: fromAddress,
      to: email,
      subject: SUBJECT,
      html,
      text,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const senderEmailAddress = parseEmailAddress(fromAddress);
      const senderDomain = parseDomainFromEmailAddress(senderEmailAddress);
      const resendRejectedUnverifiedDomain =
        response.status === 403 &&
        errorBody.toLowerCase().includes("domain is not verified");

      if (resendRejectedUnverifiedDomain) {
        response = await sendArticleEmail({
          from: RESEND_FALLBACK_FROM,
          to: email,
          subject: SUBJECT,
          html,
          text,
        });

        if (!response.ok) {
          const fallbackErrorBody = await response.text();

          return NextResponse.json(
            {
              error: `Resend rejected EMAIL_FROM (${senderDomain}) and the fallback sender also failed. ${fallbackErrorBody}`,
            },
            { status: 502 },
          );
        }

        return NextResponse.json({ success: true, fallbackSender: true });
      }

      return NextResponse.json(
        { error: `Resend could not send the email. ${errorBody}` },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to send the article right now." },
      { status: 500 },
    );
  }
}
