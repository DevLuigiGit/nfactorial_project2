import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const companies = await prisma.company.findMany({
      include: { _count: { select: { jobs: true } } },
    });
    res.json(companies);
  } catch {
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
      include: { jobs: true },
    });
    if (!company) {
      res.status(404).json({ error: "Company not found" });
      return;
    }
    const parsed = {
      ...company,
      jobs: company.jobs.map((j) => ({ ...j, skills: JSON.parse(j.skills) })),
    };
    res.json(parsed);
  } catch {
    res.status(500).json({ error: "Failed to fetch company" });
  }
});

export default router;
