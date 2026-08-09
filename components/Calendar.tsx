"use client";

import { useMemo, useState } from "react";
import type { AppState, Demand } from "@/lib/types";
import { DEMAND_TYPE_LABEL } from "@/lib/types";
import {
  WEEKDAY_SHORT,
  dayLabel,
  inMonth,
  monthLabel,
  todayKey,
} from "@/lib/dates";
import { monthGrid } from "@/lib/dates";
import { insights, planMonth, type PlannedDemand } from "@/lib/planner";

interface Props {
  state: AppState;
  year: number;
  month: number;
  onNavigate: (year: number, month: number) => void;
  filter: string | null;
  onFilterChange: (clientId: string | null) => void;
  selectedDay: string | null;
  onSelectDay: (date: string | null) => void;
  onApplyPlan: (planned: PlannedDemand[]) => void;
}

function clientOf(state: AppState, id: string) {
  return state.clients.find((c) => c.id === id);
}

function DemandChip({ state, demand }: { state: AppState; demand: Demand }) {
  const client = clientOf(state, demand.clientId);
  const done = demand.status === "postado";
  return (
    <div
      className={`flex items-center gap-1 rounded-sm px-1 py-px text-[11px] leading-4 truncate ${
        done ? "opacity-45 line-through" : ""
      }`}
      style={{ background: `${client?.color ?? "#888"}1f` }}
      title={`${client?.name ?? "?"} — ${DEMAND_TYPE_LABEL[demand.type]}${
        demand.title ? `: ${demand.title}` : ""
      }`}
    >
      <span
        className="inline-block size-1.5 shrink-0 rounded-full"
        style={{ background: client?.color ?? "#888" }}
      />
      <span className="truncate">
        {DEMAND_TYPE_LABEL[demand.type]}
        {demand.title ? ` · ${demand.title}` : ""}
      </span>
      {demand.movedFrom && <span title={`Diluída de ${dayLabel(demand.movedFrom)}`}>↜</span>}
    </div>
  );
}

export default function Calendar({
  state,
  year,
  month,
  onNavigate,
  filter,
  onFilterChange,
  selectedDay,
  onSelectDay,
  onApplyPlan,
}: Props) {
  const [planPreview, setPlanPreview] = useState<PlannedDemand[] | null>(null);
  const today = todayKey();
  const weeks = useMemo(() => monthGrid(year, month), [year, month]);
  const tips = useMemo(() => insights(state), [state]);

  const demandsOn = (day: string) =>
    state.demands
      .filter((d) => d.date === day)
      .filter((d) => !filter || d.clientId === filter)
      .sort((a, b) => a.clientId.localeCompare(b.clientId));

  const blockedOn = (day: string) => state.blocked.find((b) => b.date === day);

  const prev = () => onNavigate(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1);
  const next = () => onNavigate(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1);

  const openPlanPreview = () => setPlanPreview(planMonth(state, year, month));

  const planByClient = useMemo(() => {
    if (!planPreview) return [];
    const count = new Map<string, number>();
    for (const p of planPreview) {
      count.set(p.clientId, (count.get(p.clientId) ?? 0) + 1);
    }
    return [...count.entries()]
      .map(([id, n]) => ({ client: clientOf(state, id), n }))
      .sort((a, b) => b.n - a.n);
  }, [planPreview, state]);

  return (
    <section>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            className="rounded border border-line bg-card px-2.5 py-1 hover:border-line-strong"
            aria-label="Mês anterior"
          >
            ‹
          </button>
          <h2 className="min-w-44 text-center text-2xl">{monthLabel(year, month)}</h2>
          <button
            onClick={next}
            className="rounded border border-line bg-card px-2.5 py-1 hover:border-line-strong"
            aria-label="Próximo mês"
          >
            ›
          </button>
        </div>
        <button
          onClick={() => {
            const now = new Date();
            onNavigate(now.getFullYear(), now.getMonth());
          }}
          className="rounded border border-line bg-card px-3 py-1 text-sm hover:border-line-strong"
        >
          Hoje
        </button>

        <div className="ml-auto flex items-center gap-2">
          <select
            value={filter ?? ""}
            onChange={(e) => onFilterChange(e.target.value || null)}
            className="max-w-52 rounded border border-line bg-card px-2 py-1.5 text-sm"
            aria-label="Filtrar por cliente"
          >
            <option value="">Todos os clientes</option>
            {state.clients
              .filter((c) => c.active)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
          <button
            onClick={openPlanPreview}
            className="rounded border border-line-strong bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-85"
          >
            Gerar plano do mês
          </button>
        </div>
      </div>

      {tips.length > 0 && (
        <ul className="mt-3 space-y-1">
          {tips.map((tip, i) => (
            <li key={i} className="text-sm text-muted">
              <span className="mr-1">
                {tip.kind === "sobrecarga" ? "◍" : tip.kind === "atrasada" ? "⏲" : "◌"}
              </span>
              {tip.date ? (
                <button
                  className="underline decoration-line underline-offset-2 hover:decoration-line-strong"
                  onClick={() => onSelectDay(tip.date!)}
                >
                  {dayLabel(tip.date)}: {tip.text}
                </button>
              ) : (
                tip.text
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 grid grid-cols-7 border-b border-line pb-1 text-center text-xs uppercase tracking-widest text-muted">
        {WEEKDAY_SHORT.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="divide-y divide-line border-b border-line">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 divide-x divide-line">
            {week.map((day) => {
              const inThisMonth = inMonth(day, year, month);
              const blocked = blockedOn(day);
              const demands = demandsOn(day);
              const isToday = day === today;
              const selected = day === selectedDay;
              return (
                <button
                  key={day}
                  onClick={() => onSelectDay(day)}
                  className={`flex min-h-24 flex-col items-stretch justify-start p-1 text-left transition-colors md:min-h-28 ${
                    inThisMonth ? "" : "opacity-40"
                  } ${selected ? "bg-foreground/5" : "hover:bg-foreground/[0.03]"}`}
                  style={
                    blocked
                      ? {
                          backgroundImage:
                            "repeating-linear-gradient(-45deg, transparent, transparent 6px, #11111110 6px, #11111110 8px)",
                        }
                      : undefined
                  }
                >
                  <div className="flex items-center gap-1">
                    <span
                      className={`inline-flex size-6 items-center justify-center rounded-full text-sm ${
                        isToday ? "bg-foreground text-background" : ""
                      }`}
                    >
                      {Number(day.slice(8))}
                    </span>
                    {blocked && (
                      <span className="text-[10px] uppercase tracking-wider text-muted">
                        ocupado
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 space-y-0.5">
                    {demands.slice(0, 4).map((d) => (
                      <DemandChip key={d.id} state={state} demand={d} />
                    ))}
                    {demands.length > 4 && (
                      <div className="text-[11px] text-muted">
                        + {demands.length - 4} demanda{demands.length - 4 > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {planPreview && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-foreground/30 p-4"
          onClick={() => setPlanPreview(null)}
        >
          <div
            className="rise-in max-h-[80vh] w-full max-w-md overflow-y-auto rounded-lg border border-line bg-card p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl">Plano de {monthLabel(year, month)}</h3>
            {planPreview.length === 0 ? (
              <p className="mt-3 text-sm text-muted">
                As quotas semanais deste mês já estão preenchidas — nada a criar.
              </p>
            ) : (
              <>
                <p className="mt-2 text-sm text-muted">
                  Serão criadas <strong>{planPreview.length}</strong> demandas nos dias úteis
                  menos carregados, respeitando a quota semanal de cada cliente e pulando os
                  dias em que você marcou que estará ocupado.
                </p>
                <ul className="mt-3 space-y-1 text-sm">
                  {planByClient.map(({ client, n }) => (
                    <li key={client?.id ?? "?"} className="flex items-center gap-2">
                      <span
                        className="inline-block size-2 rounded-full"
                        style={{ background: client?.color ?? "#888" }}
                      />
                      {client?.name ?? "?"}
                      <span className="ml-auto text-muted">{n}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setPlanPreview(null)}
                className="rounded border border-line bg-card px-3 py-1.5 text-sm hover:border-line-strong"
              >
                Cancelar
              </button>
              {planPreview.length > 0 && (
                <button
                  onClick={() => {
                    onApplyPlan(planPreview);
                    setPlanPreview(null);
                  }}
                  className="rounded border border-line-strong bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-85"
                >
                  Criar {planPreview.length} demandas
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
