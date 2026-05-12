import { Select } from "./ui/select";
import { Button } from "./ui/button";
import type { JobsMeta } from "@/lib/types";

export type JobFilterState = {
  city: string;
  grade: string;
  workFormat: string;
};

export const EMPTY_FILTERS: JobFilterState = {
  city: "",
  grade: "",
  workFormat: "",
};

interface JobFiltersProps {
  value: JobFilterState;
  meta: JobsMeta | null;
  onChange: (next: JobFilterState) => void;
  onReset: () => void;
}

export function JobFilters({ value, meta, onChange, onReset }: JobFiltersProps) {
  const hasAny = value.city || value.grade || value.workFormat;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">Город</label>
          <Select
            value={value.city}
            onChange={(e) => onChange({ ...value, city: e.target.value })}
          >
            <option value="">Все города</option>
            {meta?.cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">Грейд</label>
          <Select
            value={value.grade}
            onChange={(e) => onChange({ ...value, grade: e.target.value })}
          >
            <option value="">Любой</option>
            {meta?.grades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-600">
            Формат работы
          </label>
          <Select
            value={value.workFormat}
            onChange={(e) =>
              onChange({ ...value, workFormat: e.target.value })
            }
          >
            <option value="">Любой</option>
            {meta?.workFormats.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={!hasAny}
            onClick={onReset}
          >
            Сбросить
          </Button>
        </div>
      </div>
    </div>
  );
}
