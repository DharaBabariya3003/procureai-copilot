# ProcureAI Copilot

**AI-assisted procurement workflow built with Node.js, TypeScript, React and OpenAI Structured Outputs.**

ProcureAI Copilot turns a natural-language purchasing request into a structured, reviewable procurement analysis. It extracts items, budget, deadline and requirements, identifies missing information, flags risks and recommends the next action.

This is a portfolio project designed to demonstrate practical AI engineering rather than a production procurement system.

## Why this project

Recall Space describes an AI-first product that automates purchasing and order processes. This project deliberately explores a similar problem space: using AI to transform unstructured operational requests into structured workflow data while keeping a human in the loop.

## Highlights

- Node.js + TypeScript + Express
- React + TypeScript frontend
- OpenAI Responses API
- Strict Structured Outputs with Zod validation
- REST API
- Separation of HTTP, domain and AI-provider concerns
- Automated API tests with Vitest + Supertest
- Docker Compose PostgreSQL setup
- Environment-based configuration
- Human approval boundary: the AI analyzes; it never places an order
- Clear architecture and engineering decision documentation

## Architecture

```text
                         +----------------------+
                         |      React UI        |
                         |  Procurement Console  |
                         +----------+-----------+
                                    |
                              JSON / REST
                                    |
                         +----------v-----------+
                         |   Express + TS API   |
                         | validation + errors  |
                         +----------+-----------+
                                    |
                         +----------v-----------+
                         | Procurement Service  |
                         +----------+-----------+
                                    |
                         +----------v-----------+
                         | OpenAI Responses API |
                         | Structured Outputs   |
                         +----------------------+

                         PostgreSQL (ready for
                         persistence in next step)
```

## Example

Input:

> We need 20 business laptops for our new Karlsruhe team. Budget is around €30,000. Delivery should be within four weeks. Prefer 16GB RAM and business-class devices.

The application can return:

- **Items:** 20 business laptops
- **Budget:** €30,000 EUR
- **Deadline:** within four weeks
- **Requirements:** 16GB RAM, business class
- **Missing information:** exact CPU/storage, supplier requirements, warranty
- **Risk flags:** any ambiguity or unrealistic constraint detected
- **Recommended action:** what a procurement employee should clarify next

## Project structure

```text
procureai-copilot/
├── client/                 # React + TypeScript UI
├── server/                 # Node.js + TypeScript API
│   ├── src/
│   │   ├── app.ts
│   │   ├── config.ts
│   │   ├── types.ts
│   │   └── services/
│   │       └── procurement-ai.service.ts
│   └── tests/
├── docs/
│   └── ARCHITECTURE.md
├── docker-compose.yml
└── README.md
```

## Run locally

### Requirements

- Node.js 20+
- npm 10+
- OpenAI API key for live AI analysis
- Docker Desktop is optional and only needed for PostgreSQL

### Backend

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux use `cp .env.example .env` instead of `copy`.

Set `OPENAI_API_KEY` in `.env`. The project uses `gpt-5.5` by default; the model can be changed through `OPENAI_MODEL`.

### Frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

### Tests

```bash
cd server
npm test
```

### Build

```bash
cd server && npm run build
cd ../client && npm run build
```

### PostgreSQL

```bash
docker compose up -d
```

The demo does not pretend to persist data yet. PostgreSQL is included so persistence can be added cleanly as the next iteration.

## API

### `GET /api/health`

Returns service status.

### `POST /api/procurement/analyze`

```json
{
  "request": "We need 20 business laptops for a new team. Budget is €30,000 and delivery is needed within four weeks."
}
```

The response is a strict, validated object containing summary, items, budget, deadline, requirements, missing information, risk flags and a recommended action.

## Engineering decisions

### Structured output instead of free-form text

The application asks the model for a strict schema and parses it with Zod. This creates a deterministic boundary between probabilistic AI output and application code.

### Provider isolation

OpenAI-specific code lives inside `ProcurementAiService`. The HTTP layer does not know how prompts or model calls work. This makes the service easier to test and replace.

### Human-in-the-loop

The AI only analyzes and recommends. It cannot place an order or spend money. A real workflow would add authorization, approval, audit logging and supplier integrations before any consequential action.

### Validation

Incoming requests are validated before the model call. Model output is also validated before it reaches the API client.

## Next iterations

- Persist procurement requests and analyses in PostgreSQL
- Authentication and role-based authorization
- Supplier comparison and quotation ingestion
- Human approval workflow
- Event-driven order processing
- OpenTelemetry/observability
- Rate limiting and abuse protection
- CI/CD with GitHub Actions
- AI evaluation dataset and regression tests
- Tool calling for controlled supplier/order operations

## Portfolio note

This project is intentionally honest about its scope. It demonstrates an AI workflow, API architecture, validation, testing and frontend integration without claiming production experience that it does not have.

## References

The implementation follows the current OpenAI Node SDK pattern for the Responses API and Zod-based Structured Outputs.
