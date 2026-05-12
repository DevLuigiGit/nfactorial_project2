import { useEffect, useState } from "react";
import { CompanyCard } from "@/components/CompanyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { Company } from "@/lib/types";

export function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.companies
      .list()
      .then(setCompanies)
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Компании</h1>
        <p className="text-sm text-slate-500">
          Партнёры платформы, у которых есть открытые вакансии
        </p>
      </div>

      {error && (
        <Card>
          <CardContent className="p-6 text-sm text-rose-600">
            Не удалось загрузить компании: {error}
          </CardContent>
        </Card>
      )}

      {!companies && !error && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      )}

      {companies && (
        <div className="grid gap-4 sm:grid-cols-2">
          {companies.map((c) => (
            <CompanyCard key={c.id} company={c} />
          ))}
        </div>
      )}
    </div>
  );
}
