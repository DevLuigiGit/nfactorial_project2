import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Briefcase, Building2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JobCard } from "@/components/JobCard";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { Job } from "@/lib/types";

export function HomePage() {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.jobs
      .list()
      .then((data) => setJobs(data.slice(0, 6)))
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <div className="space-y-12">
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-white p-8 sm:p-12">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered job search
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Найди вакансию мечты с помощью AI-ассистента
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Mini LinkedIn / HH для IT-специалистов. Фильтры, описания компаний
            и умный помощник, который подскажет, что подтянуть.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-md font-medium bg-indigo-600 text-white hover:bg-indigo-700 h-11 px-6 text-base transition-colors"
            >
              <Briefcase className="h-4 w-4" />
              Смотреть вакансии
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/companies"
              className="inline-flex items-center justify-center gap-2 rounded-md font-medium border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 h-11 px-6 text-base transition-colors"
            >
              <Building2 className="h-4 w-4" />
              Компании
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Свежие вакансии
            </h2>
            <p className="text-sm text-slate-500">
              Последние открытые позиции от компаний-партнёров
            </p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-medium text-indigo-700 hover:text-indigo-900"
          >
            Все вакансии →
          </Link>
        </div>

        {error && (
          <Card>
            <CardContent className="p-6 text-sm text-rose-600">
              Не удалось загрузить вакансии: {error}.{" "}
              <span className="text-slate-500">
                Убедись, что backend запущен на :3001.
              </span>
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

        {jobs && jobs.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        )}

        {jobs && jobs.length === 0 && (
          <Card>
            <CardContent className="p-6 text-sm text-slate-500">
              Пока нет вакансий. Запусти backend и сделай{" "}
              <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">
                npm run seed
              </code>
              .
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <Card>
          <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-slate-900">
                Не знаешь с чего начать?
              </h3>
              <p className="text-sm text-slate-600">
                Открой AI-ассистента справа внизу — он подберёт вакансии под
                твои навыки и подскажет, что подтянуть.
              </p>
            </div>
            <Button
              variant="default"
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                document
                  .querySelector<HTMLButtonElement>(
                    'button[aria-label="Открыть AI-ассистента"]'
                  )
                  ?.click();
              }}
            >
              <Sparkles className="h-4 w-4" />
              Спросить AI
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
