import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export function NotFoundPage() {
  return (
    <Card>
      <CardContent className="p-10 text-center space-y-2">
        <p className="text-2xl font-bold text-slate-900">404</p>
        <p className="text-slate-500">Страница не найдена.</p>
        <Link
          to="/"
          className="inline-block text-sm font-medium text-indigo-700 hover:text-indigo-900"
        >
          ← На главную
        </Link>
      </CardContent>
    </Card>
  );
}
