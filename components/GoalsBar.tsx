"use client";

import { useState } from "react";
import type { AppStore } from "@/lib/store";
import type { AppState } from "@/lib/types";
import { mondayOf, todayKey, weekLabel } from "@/lib/dates";
import { streak, weekHistory, weekProgress } from "@/lib/planner";

interface Props {
  state: AppState;
  store: AppStore;
}

export default function GoalsBar({ state, store }: Props) {
  const [editing, setEditing] = useState(false);
  const [target, setTarget] = useState(String(state.goal.weeklyTarget));
  const [reward, setReward] = useState(state.goal.reward);

  const monday = mondayOf(todayKey());
  const prog = weekProgress(state, monday);
  const pct = Math.min(100, Math.round((prog.delivered / Math.max(1, prog.target)) * 100));
  const currentStreak = streak(state);
  const history = weekHistory(state, 8);
  const claimed = state.claimedWeeks.includes(monday);

  const save = () => {
    const n = Math.max(1, Number(target) || 1);
    store.setGoal(n, reward.trim() || "Definir um prêmio 🎁");
    setEditing(false);
  };

  return (
    <section className="rounded-lg border border-line bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">
            Meta da semana · {weekLabel(monday)}
          </p>
          <p className="text-2xl">
            {prog.delivered}
            <span className="text-muted"> / {prog.target} entregas</span>
            {currentStreak > 1 && (
              <span className="ml-2 text-base" title="Semanas seguidas batendo a meta">
                🔥 {currentStreak} semanas
              </span>
            )}
          </p>
        </div>

        <div className="min-w-40 flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1 text-sm text-muted">
            Prêmio: <em>{state.goal.reward}</em>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {prog.achieved &&
            (claimed ? (
              <span className="rounded-full border border-line bg-background px-3 py-1 text-sm">
                🏆 Prêmio resgatado
              </span>
            ) : (
              <button
                onClick={() => store.claimReward(monday)}
                className="rounded-full border border-line-strong bg-foreground px-3 py-1 text-sm text-background hover:opacity-85"
              >
                🏆 Meta batida — resgatar prêmio
              </button>
            ))}
          <button
            onClick={() => {
              setTarget(String(state.goal.weeklyTarget));
              setReward(state.goal.reward);
              setEditing((v) => !v);
            }}
            className="rounded border border-line bg-card px-3 py-1 text-sm hover:border-line-strong"
          >
            {editing ? "Fechar" : "Editar meta"}
          </button>
        </div>

        <div className="flex items-center gap-1" title="Últimas 8 semanas (da mais recente para a mais antiga)">
          {history.map((h) => (
            <span
              key={h.monday}
              title={`${weekLabel(h.monday)}: ${h.delivered}/${h.target}${h.achieved ? " ✓" : ""}`}
              className={`inline-block size-3 rounded-sm border ${
                h.achieved ? "border-line-strong bg-foreground" : "border-line bg-background"
              }`}
            />
          ))}
        </div>
      </div>

      {editing && (
        <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-line pt-3">
          <label className="text-sm">
            Entregas por semana
            <input
              type="number"
              min={1}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="mt-1 block w-28 rounded border border-line bg-background px-2 py-1.5"
            />
          </label>
          <label className="min-w-56 flex-1 text-sm">
            Auto-prêmio quando bater
            <input
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder="ex.: Sábado livre de culpa + cinema"
              className="mt-1 block w-full rounded border border-line bg-background px-2 py-1.5"
            />
          </label>
          <button
            onClick={save}
            className="rounded border border-line-strong bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-85"
          >
            Salvar
          </button>
        </div>
      )}
    </section>
  );
}
