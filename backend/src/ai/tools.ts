import prisma from "../db";

export type JobSearchInput = {
  city?: string;
  grade?: string;
  workFormat?: string;
  skills?: string[];
};

export async function jobSearchTool(input: JobSearchInput) {
  const jobs = await prisma.job.findMany({
    where: {
      ...(input.city && { city: input.city }),
      ...(input.grade && { grade: input.grade }),
      ...(input.workFormat && { workFormat: input.workFormat }),
    },
    include: { company: true },
    take: 10,
  });

  const parsed = jobs.map((j) => ({
    ...j,
    skills: JSON.parse(j.skills) as string[],
  }));

  if (input.skills?.length) {
    return parsed.filter((j) =>
      input.skills!.some((s) =>
        j.skills.some((js) => js.toLowerCase().includes(s.toLowerCase()))
      )
    );
  }
  return parsed;
}

export async function companyInfoTool(input: { companyId?: string; name?: string }) {
  if (input.companyId) {
    return prisma.company.findUnique({
      where: { id: input.companyId },
      include: { jobs: true },
    });
  }
  if (input.name) {
    return prisma.company.findFirst({
      where: { name: { contains: input.name } },
      include: { jobs: true },
    });
  }
  return null;
}

export async function skillGapTool(input: { jobId: string; userSkills: string[] }) {
  const job = await prisma.job.findUnique({ where: { id: input.jobId } });
  if (!job) return null;
  const required = JSON.parse(job.skills) as string[];
  const missing = required.filter(
    (s) => !input.userSkills.some((u) => u.toLowerCase() === s.toLowerCase())
  );
  return { jobTitle: job.title, required, missing };
}

export const toolSchemas = [
  {
    type: "function" as const,
    function: {
      name: "jobSearchTool",
      description:
        "Search job vacancies in the database by city, grade, work format and skills. Use this when the user asks to find or recommend jobs.",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "City name, e.g. Almaty, Astana, Remote",
          },
          grade: {
            type: "string",
            description: "Seniority grade: Junior, Middle or Senior",
          },
          workFormat: {
            type: "string",
            description: "Work format: Remote, Office, Hybrid",
          },
          skills: {
            type: "array",
            items: { type: "string" },
            description:
              "Tech skills to match, e.g. React, TypeScript, Node.js",
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "companyInfoTool",
      description:
        "Get information about a company by id or partial name. Returns description and open vacancies.",
      parameters: {
        type: "object",
        properties: {
          companyId: { type: "string", description: "Internal company id" },
          name: {
            type: "string",
            description: "Company name or part of it",
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "skillGapTool",
      description:
        "Given a job id and the user's current skills, return which required skills the user is missing.",
      parameters: {
        type: "object",
        properties: {
          jobId: { type: "string", description: "Vacancy id" },
          userSkills: {
            type: "array",
            items: { type: "string" },
            description: "List of skills the user already has",
          },
        },
        required: ["jobId", "userSkills"],
      },
    },
  },
];
