import type {
  ChatRequest,
  ChatResponse,
  Company,
  Job,
  JobsMeta,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = BASE_URL ? `${BASE_URL}${path}` : path;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    let detail = "";
    try {
      const body = (await res.json()) as { error?: string };
      detail = body.error ? `: ${body.error}` : "";
    } catch {
      // ignore
    }
    throw new Error(`HTTP ${res.status}${detail}`);
  }
  return (await res.json()) as T;
}

export type JobsQuery = {
  city?: string;
  grade?: string;
  workFormat?: string;
};

export const api = {
  jobs: {
    list(query: JobsQuery = {}) {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      const qs = params.toString();
      return request<Job[]>(`/api/jobs${qs ? `?${qs}` : ""}`);
    },
    byId(id: string) {
      return request<Job>(`/api/jobs/${id}`);
    },
    meta() {
      return request<JobsMeta>("/api/jobs/meta");
    },
  },
  companies: {
    list() {
      return request<Company[]>("/api/companies");
    },
    byId(id: string) {
      return request<Company & { jobs: Job[] }>(`/api/companies/${id}`);
    },
  },
  ai: {
    chat(body: ChatRequest) {
      return request<ChatResponse>("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
  },
};
