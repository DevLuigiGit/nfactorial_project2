import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(from?: number | null, to?: number | null) {
  if (!from && !to) return "Зарплата не указана";
  const fmt = (n: number) => n.toLocaleString("ru-RU");
  if (from && to) return `${fmt(from)} – ${fmt(to)} ₸`;
  if (from) return `от ${fmt(from)} ₸`;
  if (to) return `до ${fmt(to!)} ₸`;
  return "Зарплата не указана";
}

export function parseSkills(skills: string[] | string): string[] {
  if (Array.isArray(skills)) return skills;
  try {
    const parsed = JSON.parse(skills);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
