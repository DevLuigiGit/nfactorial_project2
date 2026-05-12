import { Ollama } from "ollama";
import {
  companyInfoTool,
  jobSearchTool,
  skillGapTool,
  toolSchemas,
  type JobSearchInput,
} from "./tools";
import { SYSTEM_PROMPT } from "./prompts";

export type ToolCallRecord = {
  tool: string;
  input: unknown;
  timestamp: string;
  resultCount?: number;
};

export type AssistantResult = {
  answer: string;
  toolCalls: ToolCallRecord[];
  jobs?: unknown[];
  mode: "llm" | "rule-based";
};

type ChatBody = {
  message?: string;
  city?: string;
  grade?: string;
  workFormat?: string;
  skills?: string[];
  jobId?: string;
  companyId?: string;
  userSkills?: string[];
};

const HOST = process.env.OLLAMA_HOST || "https://ollama.com";
const MODEL = process.env.OLLAMA_MODEL || "kimi-k2.6:cloud";
const API_KEY = process.env.OLLAMA_API_KEY;

const client = API_KEY
  ? new Ollama({
      host: HOST,
      headers: { Authorization: `Bearer ${API_KEY}` },
    })
  : null;

export function isLlmEnabled() {
  return Boolean(API_KEY);
}

async function executeTool(
  name: string,
  args: Record<string, unknown>
): Promise<{ data: unknown; resultCount?: number }> {
  switch (name) {
    case "jobSearchTool": {
      const data = await jobSearchTool(args as JobSearchInput);
      return { data, resultCount: data.length };
    }
    case "companyInfoTool": {
      const data = await companyInfoTool(
        args as { companyId?: string; name?: string }
      );
      return { data, resultCount: data ? 1 : 0 };
    }
    case "skillGapTool": {
      const data = await skillGapTool(
        args as { jobId: string; userSkills: string[] }
      );
      return { data, resultCount: data ? 1 : 0 };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function runLlm(body: ChatBody): Promise<AssistantResult> {
  if (!client) throw new Error("Ollama client not configured");

  const fallbackContext =
    [
      body.city && `Город: ${body.city}`,
      body.grade && `Грейд: ${body.grade}`,
      body.workFormat && `Формат: ${body.workFormat}`,
      body.skills?.length && `Навыки: ${body.skills.join(", ")}`,
      body.jobId && `ID вакансии: ${body.jobId}`,
      body.companyId && `ID компании: ${body.companyId}`,
      body.userSkills?.length &&
        `Мои навыки: ${body.userSkills.join(", ")}`,
    ]
      .filter(Boolean)
      .join("\n") || "Подбери подходящие IT-вакансии.";

  const userMessage = body.message ?? fallbackContext;

  const messages: { role: string; content: string; tool_calls?: unknown }[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userMessage },
  ];

  const toolCalls: ToolCallRecord[] = [];
  let collectedJobs: unknown[] | undefined;

  for (let step = 0; step < 3; step += 1) {
    const response = await client.chat({
      model: MODEL,
      messages: messages as never,
      tools: toolSchemas as never,
      stream: false,
    });

    const msg = response.message as {
      role: string;
      content: string;
      tool_calls?: Array<{
        function: { name: string; arguments: Record<string, unknown> };
      }>;
    };

    if (msg.tool_calls && msg.tool_calls.length > 0) {
      messages.push({
        role: "assistant",
        content: msg.content ?? "",
        tool_calls: msg.tool_calls,
      });

      for (const call of msg.tool_calls) {
        const args = call.function.arguments;
        const { data, resultCount } = await executeTool(call.function.name, args);
        toolCalls.push({
          tool: call.function.name,
          input: args,
          timestamp: new Date().toISOString(),
          resultCount,
        });
        if (call.function.name === "jobSearchTool" && Array.isArray(data)) {
          collectedJobs = data;
        }
        messages.push({
          role: "tool",
          content: JSON.stringify(data),
        });
      }
      continue;
    }

    return {
      answer: msg.content?.trim() || "Не удалось сформулировать ответ.",
      toolCalls,
      jobs: collectedJobs,
      mode: "llm",
    };
  }

  return {
    answer:
      "Не удалось получить окончательный ответ от LLM за 3 шага. Покажу что нашёл.",
    toolCalls,
    jobs: collectedJobs,
    mode: "llm",
  };
}

async function runRuleBased(body: ChatBody): Promise<AssistantResult> {
  const toolCalls: ToolCallRecord[] = [];

  if (body.companyId) {
    const company = await companyInfoTool({ companyId: body.companyId });
    toolCalls.push({
      tool: "companyInfoTool",
      input: { companyId: body.companyId },
      timestamp: new Date().toISOString(),
      resultCount: company ? 1 : 0,
    });
    return {
      answer: company
        ? `${company.name} — ${company.description}. Открытых вакансий: ${company.jobs.length}.`
        : "Компания не найдена.",
      toolCalls,
      mode: "rule-based",
    };
  }

  if (body.jobId && body.userSkills) {
    const gap = await skillGapTool({
      jobId: body.jobId,
      userSkills: body.userSkills,
    });
    toolCalls.push({
      tool: "skillGapTool",
      input: { jobId: body.jobId, userSkills: body.userSkills },
      timestamp: new Date().toISOString(),
      resultCount: gap ? 1 : 0,
    });
    if (!gap) {
      return { answer: "Вакансия не найдена.", toolCalls, mode: "rule-based" };
    }
    const answer =
      gap.missing.length === 0
        ? `Отлично! У тебя есть все необходимые навыки: ${gap.required.join(", ")}.`
        : `Тебе не хватает: ${gap.missing.join(", ")}. Уже есть всё остальное из: ${gap.required.join(", ")}.`;
    return { answer, toolCalls, mode: "rule-based" };
  }

  const input: JobSearchInput = {
    city: body.city,
    grade: body.grade,
    workFormat: body.workFormat,
    skills: body.skills,
  };
  const jobs = await jobSearchTool(input);
  toolCalls.push({
    tool: "jobSearchTool",
    input,
    timestamp: new Date().toISOString(),
    resultCount: jobs.length,
  });

  if (jobs.length === 0) {
    return {
      answer: "По твоим критериям ничего не найдено. Попробуй изменить фильтры.",
      toolCalls,
      jobs: [],
      mode: "rule-based",
    };
  }

  const summary = jobs
    .map(
      (j) =>
        `• ${j.title} в ${j.company.name} (${j.city}, ${j.grade}, ${j.workFormat})`
    )
    .join("\n");

  return {
    answer: `Нашёл ${jobs.length} подходящих вакансий:\n\n${summary}`,
    toolCalls,
    jobs,
    mode: "rule-based",
  };
}

export async function runAssistant(body: ChatBody): Promise<AssistantResult> {
  if (!isLlmEnabled()) return runRuleBased(body);
  try {
    return await runLlm(body);
  } catch (err) {
    console.error("[ai] LLM failed, falling back to rule-based:", err);
    const result = await runRuleBased(body);
    return {
      ...result,
      answer: `(LLM недоступен, ответ в rule-based режиме)\n${result.answer}`,
    };
  }
}
