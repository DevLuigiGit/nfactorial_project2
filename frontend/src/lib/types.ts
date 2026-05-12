export type Company = {
  id: string;
  name: string;
  description: string;
  logoUrl?: string | null;
  website?: string | null;
  city: string;
};

export type Job = {
  id: string;
  title: string;
  description: string;
  city: string;
  grade: string;
  workFormat: string;
  salaryFrom?: number | null;
  salaryTo?: number | null;
  skills: string[] | string;
  companyId: string;
  company?: Company;
  createdAt?: string;
};

export type JobsMeta = {
  cities: string[];
  grades: string[];
  workFormats: string[];
};

export type ChatToolCall = {
  tool: string;
  input: unknown;
  timestamp: string;
};

export type ChatResponse = {
  answer: string;
  toolCalls?: ChatToolCall[];
  jobs?: Job[];
};

export type ChatRequest = {
  message?: string;
  city?: string;
  grade?: string;
  workFormat?: string;
  skills?: string[];
  jobId?: string;
  companyId?: string;
  userSkills?: string[];
};
