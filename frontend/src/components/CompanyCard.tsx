import { Link } from "react-router-dom";
import { Building2, MapPin } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import type { Company } from "@/lib/types";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex gap-4">
        <div className="h-12 w-12 shrink-0 rounded-lg bg-indigo-50 grid place-items-center text-indigo-700">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company.name}
              className="h-full w-full rounded-lg object-contain p-1"
            />
          ) : (
            <Building2 className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <Link
            to={`/companies/${company.id}`}
            className="font-semibold text-slate-900 hover:text-indigo-700 transition-colors block truncate"
          >
            {company.name}
          </Link>
          <p className="text-sm text-slate-500 line-clamp-2">
            {company.description}
          </p>
          <div className="text-xs text-slate-500 inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {company.city}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
