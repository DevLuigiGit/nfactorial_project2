import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { api } from "@/lib/api";
import type { ChatResponse, ChatToolCall, Job } from "@/lib/types";
import { cn, formatSalary } from "@/lib/utils";

type Message =
  | { role: "user"; text: string }
  | {
      role: "assistant";
      text: string;
      jobs?: Job[];
      toolCalls?: ChatToolCall[];
    };

const SUGGESTIONS = [
  "Junior React в Алматы",
  "Удалённые вакансии для бэкендера",
  "Какие навыки подтянуть для Frontend",
];

export function AiAssistantPanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text:
        "Привет! Я AI-ассистент JobBoard. Спроси, например: «Подбери Junior React вакансии в Алматы» или «Какие навыки подтянуть».",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  function parseQuery(text: string) {
    const lower = text.toLowerCase();
    const cityMatch = ["almaty", "алматы", "astana", "астана"].find((c) =>
      lower.includes(c)
    );
    const gradeMatch = ["junior", "middle", "senior"].find((g) =>
      lower.includes(g)
    );
    const formatMatch = ["remote", "удал", "office", "офис", "hybrid"].find(
      (f) => lower.includes(f)
    );

    const cityMap: Record<string, string> = {
      almaty: "Almaty",
      алматы: "Almaty",
      astana: "Astana",
      астана: "Astana",
    };
    const formatMap: Record<string, string> = {
      remote: "Remote",
      удал: "Remote",
      office: "Office",
      офис: "Office",
      hybrid: "Hybrid",
    };

    const skills = [
      "React",
      "TypeScript",
      "Node",
      "Python",
      "Go",
      "SQL",
      "Next",
      "Vue",
    ].filter((s) => lower.includes(s.toLowerCase()));

    return {
      message: text,
      city: cityMatch ? cityMap[cityMatch] : undefined,
      grade: gradeMatch
        ? gradeMatch[0].toUpperCase() + gradeMatch.slice(1)
        : undefined,
      workFormat: formatMatch ? formatMap[formatMatch] : undefined,
      skills: skills.length ? skills : undefined,
    };
  }

  async function send(text: string) {
    if (!text.trim() || busy) return;
    const q = text.trim();
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setBusy(true);
    try {
      const body = parseQuery(q);
      const res: ChatResponse = await api.ai.chat(body);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: res.answer,
          jobs: res.jobs,
          toolCalls: res.toolCalls,
        },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: `Не удалось получить ответ: ${(e as Error).message}`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors grid place-items-center"
          aria-label="Открыть AI-ассистента"
        >
          <Sparkles className="h-6 w-6" />
        </button>
      )}

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white border-l border-slate-200 shadow-2xl flex flex-col transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-indigo-600 text-white">
              <Bot className="h-4 w-4" />
            </span>
            <div>
              <div className="font-semibold text-slate-900">AI Ассистент</div>
              <div className="text-xs text-slate-500">
                Подберёт вакансии и подскажет навыки
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </Button>
        </header>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[90%] rounded-lg px-3.5 py-2.5 text-sm whitespace-pre-wrap",
                m.role === "user"
                  ? "ml-auto bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 text-slate-800"
              )}
            >
              <div>{m.text}</div>

              {m.role === "assistant" && m.jobs && m.jobs.length > 0 && (
                <div className="mt-3 space-y-2">
                  {m.jobs.slice(0, 3).map((j) => (
                    <a
                      key={j.id}
                      href={`/jobs/${j.id}`}
                      className="block rounded-md border border-slate-200 bg-slate-50 p-2 hover:bg-slate-100 transition-colors"
                    >
                      <div className="font-medium text-slate-900 text-sm">
                        {j.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {j.company?.name} · {j.city} · {j.grade}
                      </div>
                      <div className="text-xs text-slate-700 mt-0.5">
                        {formatSalary(j.salaryFrom, j.salaryTo)}
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {m.role === "assistant" && m.toolCalls && m.toolCalls.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {m.toolCalls.map((tc, idx) => (
                    <Badge key={idx} variant="outline">
                      🔧 {tc.tool}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}

          {busy && (
            <div className="inline-flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Ассистент думает…
            </div>
          )}

          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          className="border-t border-slate-200 p-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Спроси у AI…"
            disabled={busy}
          />
          <Button type="submit" size="icon" disabled={busy || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
}
