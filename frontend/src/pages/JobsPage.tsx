import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { JobCard } from "@/components/JobCard";
import {
  EMPTY_FILTERS,
  JobFilters,
  type JobFilterState,
} from "@/components/JobFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { Job, JobsMeta } from "@/lib/types";

export function JobsPage() {
  const [params, setParams] = useSearchParams();

  const filters = useMemo<JobFilterState>(
    () => ({
      city: params.get("city") ?? "",
      grade: params.get("grade") ?? "",
      workFormat: params.get("workFormat") ?? "",
    }),
    [params]
  );

  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [meta, setMeta] = useState<JobsMeta | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.jobs
      .meta()
      .then(setMeta)
      .catch(() => {
        // optional endpoint; if backend doesn't expose it, filter dropdowns get empty
        setMeta({ cities: [], grades: [], workFormats: [] });
      });
  }, []);

  useEffect(() => {
    setJobs(null);
    setError(null);
    api.jobs
      .list(filters)
      .then(setJobs)
      .catch((e: Error) => setError(e.message));
  }, [filters.city, filters.grade, filters.workFormat]);

  function applyFilters(next: JobFilterState) {
    const sp = new URLSearchParams();
    if (next.city) sp.set("city", next.city);
    if (next.grade) sp.set("grade", next.grade);
    if (next.workFormat) sp.set("workFormat", next.workFormat);
    setParams(sp, { replace: true });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Вакансии</h1>
        <p className="text-sm text-slate-500">
          Фильтруй по городу, грейду и формату работы
        </p>
      </div>

      <JobFilters
        value={filters}
        meta={meta}
        onChange={applyFilters}
        onReset={() => applyFilters(EMPTY_FILTERS)}
      />

      {error && (
        <Card>
          <CardContent className="p-6 text-sm text-rose-600">
            Ошибка загрузки: {error}
          </CardContent>
        </Card>
      )}

      {!jobs && !error && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      )}

      {jobs && jobs.length === 0 && (
        <Card>
          <CardContent className="p-10 text-center space-y-1">
            <p className="text-base font-medium text-slate-900">
              По заданным фильтрам ничего не найдено
            </p>
            <p className="text-sm text-slate-500">
              Попробуй сбросить фильтры или поменять параметры.
            </p>
          </CardContent>
        </Card>
      )}

      {jobs && jobs.length > 0 && (
        <>
          <p className="text-sm text-slate-500">
            Найдено: <span className="font-medium text-slate-900">{jobs.length}</span>
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
