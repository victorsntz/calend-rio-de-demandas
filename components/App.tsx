"use client";

import { useRef, useState } from "react";
import { useAppState } from "@/lib/store";
import Calendar from "./Calendar";
import DayPanel from "./DayPanel";
import GoalsBar from "./GoalsBar";
import TodayPanel from "./TodayPanel";
import ClientWeb from "./ClientWeb";
import Comments from "./Comments";
import Confetti from "./Confetti";

type Tab = "calendario" | "teia";

export default function App() {
  const store = useAppState();
  const { state } = store;

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [tab, setTab] = useState<Tab>("calendario");
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  if (!state) {
    return (
      <main className="flex min-h-screen items-center justify-center text-muted">
        Carregando o calendário…
      </main>
    );
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `calendario-demandas-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const ok = store.importState(String(reader.result));
      if (!ok) alert("Arquivo inválido — exporte um backup pelo próprio calendário.");
    };
    reader.readAsText(file);
  };

  const jumpToDay = (date: string) => {
    const [y, m] = date.split("-").map(Number);
    setYear(y);
    setMonth(m - 1);
    setSelectedDay(date);
    setTab("calendario");
  };

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-8">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-line-strong pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Fortunato Estúdio
          </p>
          <h1 className="text-4xl">Calendário de Demandas</h1>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={exportJson}
            className="rounded border border-line bg-card px-3 py-1.5 hover:border-line-strong"
            title="Baixa um backup em JSON de tudo (clientes, demandas, metas, comentários)"
          >
            Exportar backup
          </button>
          <button
            onClick={() => fileInput.current?.click()}
            className="rounded border border-line bg-card px-3 py-1.5 hover:border-line-strong"
          >
            Importar
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importJson(f);
              e.target.value = "";
            }}
          />
        </div>
      </header>

      <div className="mt-5 space-y-4">
        <GoalsBar state={state} store={store} />
        <TodayPanel state={state} store={store} />
      </div>

      <nav className="mt-6 flex gap-1 border-b border-line">
        {(
          [
            ["calendario", "Calendário"],
            ["teia", "Teia de clientes"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`-mb-px rounded-t border-x border-t px-4 py-2 ${
              tab === key
                ? "border-line bg-card"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "calendario" ? (
        <>
          <div
            className={`mt-5 grid gap-5 ${selectedDay ? "lg:grid-cols-[1fr_360px]" : ""}`}
          >
            <Calendar
              state={state}
              year={year}
              month={month}
              onNavigate={(y, m) => {
                setYear(y);
                setMonth(m);
              }}
              filter={filter}
              onFilterChange={setFilter}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              onApplyPlan={store.applyPlan}
            />
            {selectedDay && (
              <DayPanel
                key={selectedDay}
                state={state}
                store={store}
                date={selectedDay}
                onClose={() => setSelectedDay(null)}
              />
            )}
          </div>
          <Comments state={state} store={store} onJumpToDay={jumpToDay} />
        </>
      ) : (
        <div className="mt-5">
          <ClientWeb
            state={state}
            store={store}
            onPick={(id) => {
              setFilter(id);
              setTab("calendario");
            }}
          />
        </div>
      )}

      {store.celebrating && (
        <Confetti reward={state.goal.reward} onDone={store.stopCelebrating} />
      )}

      <footer className="mt-14 border-t border-line pt-4 text-center text-xs text-muted">
        Fortunato Estúdio — os dados vivem neste navegador; use “Exportar backup” de vez em
        quando.
      </footer>
    </main>
  );
}
