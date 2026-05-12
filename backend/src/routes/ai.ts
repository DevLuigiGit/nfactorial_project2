import { Router, Request, Response } from "express";
import { runAssistant } from "../ai/service";

const router = Router();

router.post("/chat", async (req: Request, res: Response) => {
  try {
    const result = await runAssistant(req.body ?? {});

    if (result.toolCalls.length > 0) {
      console.log(
        "[AI_TOOL_CALLS]",
        JSON.stringify({ mode: result.mode, calls: result.toolCalls })
      );
    }

    res.json(result);
  } catch (err) {
    console.error("[ai] /chat error:", err);
    res.status(500).json({ error: "AI assistant error" });
  }
});

export default router;
