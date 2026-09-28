import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import type { ProcurementAnalysis } from "../src/types.js";

const mockAnalysis: ProcurementAnalysis = {
  summary: "20 business laptops are requested.",
  items: [{ name: "business laptop", quantity: 20, category: "IT hardware" }],
  budget: { amount: 30000, currency: "EUR" },
  deadline: { value: "within four weeks", confidence: "high" },
  requirements: ["16GB RAM", "business class"],
  missingInformation: ["exact CPU and storage requirements"],
  riskFlags: [],
  recommendedAction: "Clarify exact specifications before supplier selection.",
};

const fakeService = { analyze: async () => mockAnalysis };

describe("ProcureAI API", () => {
  it("returns health status", async () => {
    const response = await request(createApp(fakeService)).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("rejects invalid input", async () => {
    const response = await request(createApp(fakeService))
      .post("/api/procurement/analyze")
      .send({ request: "too short" });
    expect(response.status).toBe(400);
  });

  it("returns structured analysis", async () => {
    const response = await request(createApp(fakeService))
      .post("/api/procurement/analyze")
      .send({ request: "We need 20 business laptops for our new team with a budget of 30000 EUR." });
    expect(response.status).toBe(200);
    expect(response.body.items[0].quantity).toBe(20);
    expect(response.body.budget.currency).toBe("EUR");
  });
});
