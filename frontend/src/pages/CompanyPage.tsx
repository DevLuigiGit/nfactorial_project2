import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Building2, ExternalLink, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { JobCard } from "@/components/JobCard";
import { api } from "@/lib/api";
import type { Company, Job } from "@/lib/types";

export function CompanyPage() {
  const { id = "" } = useParams();
  const [data, setData] = useState<(Company & { jobs: Job[] }) | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setData(null);
    setError(null);
    api.companies
      .byId(id)
      .then(setData)
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-rose-600">
          Не удалось загрузить компанию: {error}
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/companies"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Все компании
      </Link>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 shrink-0 rounded-xl bg-indigo-50 grid place-items-center text-indigo-700">
              {data.logoUrl ? (
                <img
                  src={data.logoUrl}
                  alt={data.name}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <Building2 className="h-7 w-7" />
              )}
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <h1 className="text-2xl font-bold text-slate-900">{data.name}</h1>
              <div className="text-sm text-slate-500 inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {data.city}
              </div>
              {data.website && (
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1"
                >
                  {data.website.replace(/^https?:\/\//, "")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed">{data.description}</p>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Открытые вакансии ({data.jobs.length})
        </h2>
        {data.jobs.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-slate-500">
              У этой компании сейчас нет открытых вакансий.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {data.jobs.map((j) => {
              const { jobs: _unused, ...companyOnly } = data;
              void _unused;
              return (
                <JobCard key={j.id} job={{ ...j, company: companyOnly }} />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
