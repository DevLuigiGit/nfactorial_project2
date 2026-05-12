import "dotenv/config";
import express from "express";
import cors from "cors";
import jobsRouter from "./routes/jobs";
import companiesRouter from "./routes/companies";
import aiRouter from "./routes/ai";
import { isLlmEnabled } from "./ai/service";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/jobs", jobsRouter);
app.use("/api/companies", companiesRouter);
app.use("/api/ai", aiRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(
    `🤖 AI assistant mode: ${isLlmEnabled() ? "LLM (Ollama)" : "rule-based fallback"}`
  );
});
