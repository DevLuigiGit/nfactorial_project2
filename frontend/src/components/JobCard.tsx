import { Link } from "react-router-dom";
import { MapPin, BriefcaseBusiness, Wifi } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { formatSalary, parseSkills } from "@/lib/utils";
import type { Job } from "@/lib/types";

export function JobCard({ job }: { job: Job }) {
  const skills = parseSkills(job.skills).slice(0, 5);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <Link
              to={`/jobs/${job.id}`}
              className="text-base font-semibold text-slate-900 hover:text-indigo-700 transition-colors line-clamp-2"
            >
              {job.title}
            </Link>
            {job.company?.name && (
              <Link
                to={`/companies/${job.companyId}`}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                {job.company.name}
              </Link>
            )}
          </div>
          <Badge variant="brand">{job.grade}</Badge>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {job.city}
          </span>
          <span className="inline-flex items-center gap-1">
            <Wifi className="h-3.5 w-3.5" />
            {job.workFormat}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
            <BriefcaseBusiness className="h-3.5 w-3.5" />
            {formatSalary(job.salaryFrom, job.salaryTo)}
          </span>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <Badge key={s} variant="outline">
                {s}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-md font-medium border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 h-8 px-3 text-xs transition-colors"
        >
          Подробнее →
        </Link>
      </CardFooter>
    </Card>
  );
}
