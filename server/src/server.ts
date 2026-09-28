import { createApp } from "./app.js";
import { config } from "./config.js";
import { ProcurementAiService } from "./services/procurement-ai.service.js";

const app = createApp(new ProcurementAiService());

app.listen(config.port, () => {
  console.log(`ProcureAI API running at http://localhost:${config.port}`);
});
