import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

// ── Conversation Memory ───────────────────────────────────────────────────────
const sessionMemory = new Map<string, { role: string; content: string }[]>();
const MAX_HISTORY = 8;

// ── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
Ты AI-ассистент платформы вакансий JobBoard AI — аналог LinkedIn / HH.kz для Казахстана.
Твоя задача — помогать соискателям найти подходящую работу.

Правила:
- Отвечай только на русском языке
- Используй ТОЛЬКО данные из предоставленного контекста вакансий из базы данных
- Никогда не придумывай вакансии, компании, зарплаты или требования
- Если вакансий не найдено — скажи честно и предложи изменить критерии поиска
- Форматируй ответ читаемо: используй списки, выделяй ключевую информацию
- Отвечай конкретно и по делу, без лишней воды
- Если пользователь спрашивает про навыки — давай конкретные советы
- Помни контекст предыдущих сообщений в диалоге
`.trim();

// ── Tools ─────────────────────────────────────────────────────────────────────
async function jobSearchTool(params: {
  city?: string;
  grade?: string;
  workFormat?: string;
  skills?: string[];
}) {
  const jobs = await prisma.job.findMany({
    where: {
      ...(params.city && { city: params.city }),
      ...(params.grade && { grade: params.grade }),
      ...(params.workFormat && { workFormat: params.workFormat }),
    },
    include: { company: true },
    take: 5,
  });

  const parsed = jobs.map((j) => ({ ...j, skills: JSON.parse(j.skills) as string[] }));

  if (params.skills?.length) {
    return parsed.filter((j) =>
      params.skills!.some((s) =>
        j.skills.some((js) => js.toLowerCase().includes(s.toLowerCase()))
      )
    );
  }
  return parsed;
}

async function companyInfoTool(companyId: string) {
  return prisma.company.findUnique({
    where: { id: companyId },
    include: { jobs: true },
  });
}

async function skillGapTool(jobId: string, userSkills: string[]) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return null;
  const required = JSON.parse(job.skills) as string[];
  const missing = required.filter(
    (s) => !userSkills.some((u) => u.toLowerCase() === s.toLowerCase())
  );
  return { required, missing };
}

// ── Extract search params from free text ─────────────────────────────────────
function extractParams(text: string) {
  const t = text.toLowerCase();
  const p: { city?: string; grade?: string; workFormat?: string } = {};

  if (t.includes("алматы") || t.includes("almaty")) p.city = "Almaty";
  else if (t.includes("астана") || t.includes("astana")) p.city = "Astana";
  else if (t.includes("remote") || t.includes("удалён") || t.includes("удален")) p.city = "Remote";

  if (t.includes("junior") || t.includes("джуниор") || t.includes("джун") || t.includes("начинающ")) p.grade = "Junior";
  else if (t.includes("middle") || t.includes("мидл")) p.grade = "Middle";
  else if (t.includes("senior") || t.includes("сеньор") || t.includes("старш")) p.grade = "Senior";

  if (t.includes("remote") || t.includes("удалён") || t.includes("удален") || t.includes("дистанц")) p.workFormat = "Remote";
  else if (t.includes("офис") || t.includes("office")) p.workFormat = "Office";
  else if (t.includes("гибрид") || t.includes("hybrid")) p.workFormat = "Hybrid";

  return p;
}

// ── Kimi K2.6 via Ollama Cloud ────────────────────────────────────────────────
async function callKimi(messages: { role: string; content: string }[]): Promise<string> {
  const apiKey = process.env.OLLAMA_API_KEY;
  if (!apiKey) {
    console.warn("[AI] OLLAMA_API_KEY not set, using fallback");
    return null as unknown as string;
  }

  const resp = await fetch("https://api.ollama.com/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "kimi-k2.6",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      stream: false,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Kimi API ${resp.status}: ${err.slice(0, 200)}`);
  }

  const data = (await resp.json()) as { message: { content: string } };
  return data.message.content;
}

// ── Fallback rule-based response ──────────────────────────────────────────────
function fallbackAnswer(toolName: string, context: string): string {
  if (toolName === "jobSearchTool") return context || "Вакансий по критериям не найдено.";
  if (toolName === "companyInfoTool") return context || "Компания не найдена.";
  if (toolName === "skillGapTool") return context || "Вакансия не найдена.";
  return context;
}

// ── POST /api/ai/chat ─────────────────────────────────────────────────────────
router.post("/chat", async (req: Request, res: Response) => {
  const {
    message = "",
    city,
    grade,
    workFormat,
    skills,
    jobId,
    companyId,
    userSkills,
    sessionId = "default",
  } = req.body as {
    message?: string;
    city?: string;
    grade?: string;
    workFormat?: string;
    skills?: string[];
    jobId?: string;
    companyId?: string;
    userSkills?: string[];
    sessionId?: string;
  };

  const toolCalls: { tool: string; input: unknown; timestamp: string }[] = [];

  try {
    // ── Memory ────────────────────────────────────────────────────────────────
    if (!sessionMemory.has(sessionId)) sessionMemory.set(sessionId, []);
    const history = sessionMemory.get(sessionId)!;

    // ── Tool selection & execution ────────────────────────────────────────────
    let contextText = "";
    let activeTool = "jobSearchTool";
    let responseJobs: Awaited<ReturnType<typeof jobSearchTool>> | undefined;

    if (companyId) {
      activeTool = "companyInfoTool";
      toolCalls.push({ tool: activeTool, input: { companyId }, timestamp: new Date().toISOString() });
      const company = await companyInfoTool(companyId);
      if (company) {
        const jobsList = company.jobs.map((j) => `  - ${j.title} (${j.grade}, ${j.workFormat})`).join("\n");
        contextText = `Компания: ${company.name}\nОписание: ${company.description}\nГород: ${company.city}\nСайт: ${company.website ?? "—"}\nВакансий: ${company.jobs.length}\n${jobsList}`;
      } else {
        contextText = "Компания не найдена.";
      }
    } else if (jobId && userSkills) {
      activeTool = "skillGapTool";
      toolCalls.push({ tool: activeTool, input: { jobId, userSkills }, timestamp: new Date().toISOString() });
      const gap = await skillGapTool(jobId, userSkills);
      if (gap) {
        contextText = `Требуемые навыки: ${gap.required.join(", ")}\nТвои навыки: ${userSkills.join(", ")}\nНедостающие: ${gap.missing.length ? gap.missing.join(", ") : "все навыки есть!"}`;
      }
    } else {
      const extracted = extractParams(message);
      const searchParams = {
        city: city ?? extracted.city,
        grade: grade ?? extracted.grade,
        workFormat: workFormat ?? extracted.workFormat,
        skills,
      };
      toolCalls.push({ tool: activeTool, input: searchParams, timestamp: new Date().toISOString() });
      responseJobs = await jobSearchTool(searchParams);

      if (responseJobs.length > 0) {
        contextText = `Найдено вакансий: ${responseJobs.length}\n`;
        responseJobs.forEach((j) => {
          contextText += `\n• ${j.title} — ${j.company.name}\n  Город: ${j.city} | Грейд: ${j.grade} | Формат: ${j.workFormat}\n  Зарплата: ${j.salaryFrom?.toLocaleString() ?? "—"}–${j.salaryTo?.toLocaleString() ?? "—"} ₸\n  Навыки: ${j.skills.join(", ")}`;
        });
      } else {
        contextText = "Вакансий по данным критериям не найдено. Попробуй изменить фильтры.";
      }
    }

    // ── Build prompt for LLM ──────────────────────────────────────────────────
    const userContent = `[Данные из базы вакансий]\n${contextText}\n\n[Вопрос]: ${message || "Покажи доступные вакансии"}`;

    const messagesForLLM = [
      ...history.slice(-(MAX_HISTORY * 2)),
      { role: "user", content: userContent },
    ];

    // ── Call Kimi or fallback ─────────────────────────────────────────────────
    let answer: string;
    try {
      answer = await callKimi(messagesForLLM);
      if (!answer) answer = fallbackAnswer(activeTool, contextText);
    } catch (err) {
      console.error("[Kimi error]", err);
      answer = fallbackAnswer(activeTool, contextText);
    }

    // ── Save to memory ────────────────────────────────────────────────────────
    history.push({ role: "user", content: message || "запрос вакансий" });
    history.push({ role: "assistant", content: answer });
    if (history.length > MAX_HISTORY * 2) history.splice(0, 2);

    res.json({ answer, toolCalls, jobs: responseJobs, sessionId });
  } catch (err) {
    console.error("[AI ERROR]", err);
    res.status(500).json({ error: "AI assistant error" });
  }
});

// ── DELETE /api/ai/session/:id — clear memory ─────────────────────────────────
router.delete("/session/:sessionId", (req: Request, res: Response) => {
  sessionMemory.delete(req.params.sessionId);
  res.json({ cleared: true });
});

export default router;
