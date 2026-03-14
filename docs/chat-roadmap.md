# Chat Roadmap

## Completed Today

- [x] Made the portfolio chatbot publicly accessible without requiring login for basic use.
- [x] Updated the chatbot voice to respond in first person as Michael.
- [x] Moved profile knowledge into `content/profile.md`.
- [x] Replaced the general chatbot behavior with profile-focused RAG.
- [x] Added humorous off-topic refusals.
- [x] Improved follow-up flow with clickable follow-up chips.
- [x] Added support for short affirmative replies like `yes` to resolve to the previous follow-up.
- [x] Improved job-history retrieval for questions about current role, previous role, and teaching experience.
- [x] Added source badges to grounded assistant responses.
- [x] Added a recovery button on refusal replies: `Want to learn about my professional experience?`

## Next Phase

- [ ] Add `Insights` content into the RAG knowledge base.
- [ ] Replace placeholder case study content and add real case studies into the RAG knowledge base.
- [ ] Improve retrieval for short follow-up questions like `before that`, `what about teaching`, and `tell me more`.
- [ ] Make refusal handling more structured so recovery actions are easier to detect and render.

## Session State

- [ ] Persist chat state in the browser session so conversations survive refreshes.
- [ ] Preserve conversational context like the last resolved follow-up topic.
- [ ] Decide whether chat memory should live only per browser session or across returning visits.

## Resume Workflow

- [ ] Design a resume request flow inside the chatbot.
- [ ] Add a CTA like `Email me Michael's resume`.
- [ ] Collect user name and email in a safe, explicit form flow.
- [ ] Send the resume through a server-side email provider such as Resend or SendGrid.
- [ ] Add abuse protection and rate limiting for resume requests.

## Suggested Implementation Order

1. Add browser session chat memory.
2. Add `Insights` into RAG.
3. Add the resume request and email flow.
4. Add real case study content into RAG.
