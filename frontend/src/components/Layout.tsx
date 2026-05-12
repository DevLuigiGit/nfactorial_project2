import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { AiAssistantPanel } from "./AiAssistantPanel";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} JobBoard AI — учебный проект nFactorial</span>
          <span>React · Vite · Tailwind · shadcn-style</span>
        </div>
      </footer>
      <AiAssistantPanel />
    </div>
  );
}
