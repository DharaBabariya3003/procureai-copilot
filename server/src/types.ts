import { z } from "zod";

export const procurementRequestSchema = z.object({
  request: z.string().trim().min(20).max(5000),
});

export const procurementAnalysisSchema = z.object({
  summary: z.string(),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().int().positive().nullable(),
    category: z.string().nullable(),
  })),
  budget: z.object({
    amount: z.number().nonnegative().nullable(),
    currency: z.string().nullable(),
  }),
  deadline: z.object({
    value: z.string().nullable(),
    confidence: z.enum(["high", "medium", "low"]),
  }),
  requirements: z.array(z.string()),
  missingInformation: z.array(z.string()),
  riskFlags: z.array(z.object({
    severity: z.enum(["low", "medium", "high"]),
    message: z.string(),
  })),
  recommendedAction: z.string(),
});

export type ProcurementAnalysis = z.infer<typeof procurementAnalysisSchema>;
