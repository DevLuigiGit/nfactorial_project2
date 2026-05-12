import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

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
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { jobs: true },
  });
  return company;
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

router.post("/chat", async (req: Request, res: Response) => {
  const { message, city, grade, workFormat, skills, jobId, companyId, userSkills } = req.body as {
    message?: string;
    city?: string;
    grade?: string;
    workFormat?: string;
    skills?: string[];
    jobId?: string;
    companyId?: string;
    userSkills?: string[];
  };

  const toolCalls: { tool: string; input: unknown; timestamp: string }[] = [];

  try {
    if (companyId) {
      toolCalls.push({ tool: "companyInfoTool", input: { companyId }, timestamp: new Date().toISOString() });
      const company = await companyInfoTool(companyId);
      res.json({
        answer: company
          ? `${company.name} — ${company.description}. Открытых вакансий: ${company.jobs.length}.`
          : "Компания не найдена.",
        toolCalls,
      });
      return;
    }

    if (jobId && userSkills) {
      toolCalls.push({ tool: "skillGapTool", input: { jobId, userSkills }, timestamp: new Date().toISOString() });
      const gap = await skillGapTool(jobId, userSkills);
      if (!gap) {
        res.json({ answer: "Вакансия не найдена.", toolCalls });
        return;
      }
      const answer =
        gap.missing.length === 0
          ? `Отлично! У тебя есть все необходимые навыки: ${gap.required.join(", ")}.`
          : `Тебе не хватает: ${gap.missing.join(", ")}. Уже есть всё остальное из: ${gap.required.join(", ")}.`;
      res.json({ answer, toolCalls });
      return;
    }

    toolCalls.push({
      tool: "jobSearchTool",
      input: { city, grade, workFormat, skills },
      timestamp: new Date().toISOString(),
    });
    const jobs = await jobSearchTool({ city, grade, workFormat, skills });

    if (jobs.length === 0) {
      res.json({
        answer: "По твоим критериям ничего не найдено. Попробуй изменить фильтры.",
        toolCalls,
        jobs: [],
      });
      return;
    }

    const summary = jobs
      .map((j) => `• ${j.title} в ${j.company.name} (${j.city}, ${j.grade}, ${j.workFormat}) — ${j.salaryFrom?.toLocaleString()}–${j.salaryTo?.toLocaleString()} ₸`)
      .join("\n");

    res.json({
      answer: `Нашёл ${jobs.length} подходящих вакансий:\n\n${summary}`,
      toolCalls,
      jobs,
    });
  } catch {
    res.status(500).json({ error: "AI assistant error" });
  }
});

export default router;
