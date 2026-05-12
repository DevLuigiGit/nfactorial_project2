import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, BriefcaseBusiness, Wifi, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { Job } from "@/lib/types";
import { formatSalary, parseSkills } from "@/lib/utils";

export function JobDetailsPage() {
  const { id = "" } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setJob(null);
    setError(null);
    api.jobs
      .byId(id)
      .then(setJob)
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-rose-600">
          Не удалось загрузить вакансию: {error}
        </CardContent>
      </Card>
    );
  }

  if (!job) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const skills = parseSkills(job.skills);

  return (
    <div className="space-y-6">
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Все вакансии
      </Link>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {job.title}
              </h1>
              {job.company && (
                <Link
                  to={`/companies/${job.companyId}`}
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-700 transition-colors"
                >
                  <Building2 className="h-4 w-4" />
                  {job.company.name}
                </Link>
              )}
            </div>
            <Badge variant="brand" className="text-sm px-3 py-1">
              {job.grade}
            </Badge>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <Tile icon={<MapPin className="h-4 w-4" />} label="Город" value={job.city} />
            <Tile
              icon={<Wifi className="h-4 w-4" />}
              label="Формат"
              value={job.workFormat}
            />
            <Tile
              icon={<BriefcaseBusiness className="h-4 w-4" />}
              label="Зарплата"
              value={formatSalary(job.salaryFrom, job.salaryTo)}
            />
          </div>

          {skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Требуемые навыки
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <Badge key={s} variant="outline">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">Описание</h3>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {job.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Tile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs text-slate-500 inline-flex items-center gap-1">
        {icon}
        {label}
      </div>
      <div className="text-sm font-medium text-slate-900 mt-0.5">{value}</div>
    </div>
  );
}
