import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { city, grade, workFormat } = req.query as Record<string, string | undefined>;

    const jobs = await prisma.job.findMany({
      where: {
        ...(city && { city }),
        ...(grade && { grade }),
        ...(workFormat && { workFormat }),
      },
      include: { company: true },
      orderBy: { createdAt: "desc" },
    });

    const parsed = jobs.map((j) => ({ ...j, skills: JSON.parse(j.skills) }));
    res.json(parsed);
  } catch {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

router.get("/meta", async (_req: Request, res: Response) => {
  try {
    const [cities, grades, formats] = await Promise.all([
      prisma.job.findMany({ select: { city: true }, distinct: ["city"] }),
      prisma.job.findMany({ select: { grade: true }, distinct: ["grade"] }),
      prisma.job.findMany({ select: { workFormat: true }, distinct: ["workFormat"] }),
    ]);
    res.json({
      cities: cities.map((c) => c.city),
      grades: grades.map((g) => g.grade),
      workFormats: formats.map((f) => f.workFormat),
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch meta" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: { company: true },
    });
    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }
    res.json({ ...job, skills: JSON.parse(job.skills) });
  } catch {
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

export default router;
