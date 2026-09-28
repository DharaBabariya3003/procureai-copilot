import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod/v4";
import { config } from "../config.js";
import { procurementAnalysisSchema, type ProcurementAnalysis } from "../types.js";

const ProcurementAnalysisSchema = z.object({
  summary: z.string(),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().int().positive().nullable(),
    category: z.string().nullable(),
  })),
  budget: z.object({ amount: z.number().nonnegative().nullable(), currency: z.string().nullable() }),
  deadline: z.object({ value: z.string().nullable(), confidence: z.enum(["high", "medium", "low"]) }),
  requirements: z.array(z.string()),
  missingInformation: z.array(z.string()),
  riskFlags: z.array(z.object({ severity: z.enum(["low", "medium", "high"]), message: z.string() })),
  recommendedAction: z.string(),
});

const instructions = `You are ProcureAI, an assistant for procurement operations.
Analyze a natural-language purchasing request and return only the requested structured object.
Never invent facts. Use null when a value is unknown. Identify missing information a procurement employee should clarify. Flag risks such as missing budget, ambiguous quantities, unclear specifications or unrealistic deadlines. Keep recommendations practical and concise. This is decision support: never place an order, approve spending or claim that a supplier was contacted. Preserve the user's language where practical.`;

export class ProcurementAiService {
  constructor(private readonly client = new OpenAI({ apiKey: config.openAiApiKey })) {}

  async analyze(request: string): Promise<ProcurementAnalysis> {
    const response = await this.client.responses.parse({
      model: config.openAiModel,
      instructions,
      input: request,
      text: { format: zodTextFormat(ProcurementAnalysisSchema, "procurement_analysis") },
    });

    if (!response.output_parsed) throw new Error("The model returned no structured analysis");
    return procurementAnalysisSchema.parse(response.output_parsed);
  }
}
