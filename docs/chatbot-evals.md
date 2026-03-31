# Chatbot Evals

This project uses `vitest` for deterministic chatbot evals.

The goal is not to grade model writing quality. The goal is to verify the routing and retrieval decisions that happen before the model writes an answer.

## What these evals cover

- `tests/rag.case-study-context.test.ts`
  Verifies that generic case study prompts become answerable when the user is on a case study page and that the current page is the top retrieved source.
- `tests/chat-route.case-study-context.test.ts`
  Verifies that `POST /api/chat` takes the answer path when case study page context is present and does not take that path for the same prompt without page context.

## How the harness works

There are two layers:

1. RAG evals

These tests call the real functions in [lib/rag.ts](C:\dev\gemini-chatbot\lib\rag.ts):

- `retrieveRelevantChunks`
- `classifyQueryIntent`
- `shouldAnswerFromProfile`

The helper in `tests/helpers/case-study-page-context.ts` builds the same `pageContext` object the case study page sends in production, including the full case study document text.

This makes the tests fast and stable because they do not depend on a live model call.

2. Route evals

These tests import [app/(chat)/api/chat/route.ts](C:\dev\gemini-chatbot\app\(chat)\api\chat\route.ts) and mock `streamText`.

That lets us test the route decision itself:

- with `pageContext.documentText`, the route should choose the answer branch
- without that context, the route should avoid the answer branch for the same generic prompt

Because `streamText` is mocked, the test only checks which branch was selected. It does not depend on Gemini output.

## Run the evals

```bash
npm test
```

For watch mode:

```bash
npm run test:watch
```

## How to add new evals

Add a new case to the RAG suite when you want to protect retrieval or intent logic.

Good candidates:

- a new prefilled prompt button
- a regression where the wrong case study wins
- a page-relative question like "summarize this"
- an insight page question that should behave like the case study flow

Use the route suite when you need to verify that request wiring still reaches the expected branch in `POST /api/chat`.

## What to assert

Prefer assertions on:

- top retrieved slug
- intent mode such as `answer`, `clarify`, or `refuse`
- whether the route used the answer system prompt

Avoid asserting on full assistant wording. That is model output and is naturally more brittle than testing retrieval and control flow.
