import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 3001),
  openAiApiKey: process.env.OPENAI_API_KEY ?? "",
  openAiModel: process.env.OPENAI_MODEL ?? "gpt-5.5",
};
