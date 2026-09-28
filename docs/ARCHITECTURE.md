# Architecture notes

## Boundary design

The browser talks only to the Express API. The API validates the request and delegates AI-specific work to `ProcurementAiService`.

The AI service uses the OpenAI Responses API with Zod-based Structured Outputs. This follows the current Node SDK pattern: `responses.parse()` plus `zodTextFormat()`, producing typed `output_parsed` data.

## Why structured output?

A procurement workflow needs machine-readable data. Free-form prose would require brittle parsing. The schema creates a contract between the AI and the application.

## Why validate model output?

AI output is external data. Even with structured outputs, the application validates the result before returning it to the UI.

## Human-in-the-loop

The current product stops at analysis and recommendation. It deliberately does not execute procurement actions. A production version should require an authorized human approval before any external side effect.

## Future tool-calling layer

A next version could expose narrowly scoped tools such as `searchSuppliers`, `getQuote`, or `createDraftOrder`. Tool calls should be validated, authorized and auditable, and consequential actions should remain behind explicit approval.
