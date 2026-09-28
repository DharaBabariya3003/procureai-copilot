import express from "express";
import cors from "cors";
import { procurementRequestSchema } from "./types.js";
import { ProcurementAiService } from "./services/procurement-ai.service.js";

export function createApp(aiService: Pick<ProcurementAiService, "analyze">) {
  const app = express();
  app.disable("x-powered-by");
  app.use(cors());
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "procureai-copilot" });
  });

  app.post("/api/procurement/analyze", async (req, res) => {
    const parsed = procurementRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    }

    try {
      const result = await aiService.analyze(parsed.data.request);
      return res.json(result);
    } catch (error) {
      console.error("AI analysis failed", error);
      return res.status(502).json({
        error: "AI analysis failed",
        message: "The request could not be analyzed right now.",
      });
    }
  });

  return app;
}
