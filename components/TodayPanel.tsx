"use client";

import type { AppStore } from "@/lib/store";
import type { AppState } from "@/lib/types";
import { dayLabel, isSunday, mondayOf, todayKey } from "@/lib/dates";
import { todayStatuses, tweetBatchDone } from "@/lib/planner";

interface Props {
  state: AppState;
  store: AppStore;
}

/**
 * A régua de cobrança do dia: o lote de tweets da semana (cobrado toda
 * segunda) e o ritmo de carrosséis de cada cliente ativo, com o andamento do
 * contrato e a projeção de quando termina.
 */
export default function TodayPanel({ state, store }: Props) {
  const today = todayKey();
  const monday = mondayOf(today);
  const statuses = todayStatuses(state);
  const hasTweetClients = state.clients.some(
    (c) => c.active && c.dailyQuota.tweets > 0,
  );
  const batchDone = tweetBatchDone(state);
  const sunday = isSunday(today);

  if (statuses.length === 0) return null;

  return (
    <section className="rounded-lg border border-line bg-card p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs uppercase tracking-widest text-muted">
          Cobranças de hoje · <span className="capitalize">{dayLabel(today)}</span>
        </p>
        {sunday && <span className="text-sm text-muted">domingo — folga 😌</span>}
      </div>

      {hasTweetClients && (
        <div
          className={`mt-3 flex flex-wrap items-center gap-2 rounded border p-2.5 ${
            batchDone
              ? "border-line bg-background"
              : "border-line-strong bg-background"
          }`}
        >
          <span className="text-sm">
            🐦 <strong>Lote de tweets da semana</strong>
            {!batchDone && today === monday && (
              <span className="ml-1">— segunda é dia de lote novo!</span>
            )}
          </span>
          <button
            onClick={() => store.toggleTweetBatch(monday)}
            className={`ml-auto rounded-full border px-3 py-1 text-sm ${
              batchDone
                ? "border-line bg-card text-muted hover:border-line-strong"
                : "border-line-strong bg-foreground text-background hover:opacity-85"
            }`}
          >
            {batchDone ? "Feito ✓ (desfazer)" : "Marcar como feito"}
          </button>
        </div>
      )}

      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {statuses.map(({ client, scheduled, postedToday, perDay, progress, end }) => {
          const dayOk = postedToday >= perDay;
          return (
            <li
              key={client.id}
              className="rounded border border-line bg-background p-2.5"
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block size-2.5 shrink-0 rounded-full"
                  style={{ background: client.color }}
                />
                <strong className="truncate text-sm">{client.name}</strong>
                {!sunday && (
                  <span
                    className={`ml-auto rounded-full border px-2 py-0.5 text-xs ${
                      dayOk
                        ? "border-line bg-card text-muted"
                        : "border-line-strong"
                    }`}
                  >
                    hoje: {postedToday}/{perDay} postado{perDay > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-xs text-muted">
                {scheduled > 0
                  ? `${scheduled} no calendário hoje`
                  : "nada agendado hoje"}
                {progress.total > 0 && (
                  <>
                    {" · contrato "}
                    <strong className="text-foreground">
                      {progress.done}/{progress.total}
                    </strong>
                    {progress.remaining > 0
                      ? ` · restam ${progress.remaining}`
                      : " · concluído 🎉"}
                    {end && (
                      <span className="capitalize">{` · ~termina ${dayLabel(end)}`}</span>
                    )}
                  </>
                )}
              </p>
              {progress.total > 0 && (
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.round((progress.done / progress.total) * 100))}%`,
                      background: client.color,
                    }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
