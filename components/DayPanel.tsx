"use client";

import { useState } from "react";
import type { AppStore } from "@/lib/store";
import type { AppState, DemandStatus, DemandType } from "@/lib/types";
import { DEMAND_TYPE_LABEL, STATUS_LABEL, STATUS_ORDER } from "@/lib/types";
import { dayLabel } from "@/lib/dates";
import { openDemandsOn } from "@/lib/planner";

interface Props {
  state: AppState;
  store: AppStore;
  date: string;
  onClose: () => void;
}

const TYPES = Object.keys(DEMAND_TYPE_LABEL) as DemandType[];

export default function DayPanel({ state, store, date, onClose }: Props) {
  const blocked = state.blocked.find((b) => b.date === date);
  const demands = state.demands
    .filter((d) => d.date === date)
    .sort((a, b) => a.clientId.localeCompare(b.clientId));
  const dayComments = state.comments.filter((c) => c.date === date);
  const activeClients = state.clients.filter((c) => c.active);

  const [newClient, setNewClient] = useState(activeClients[0]?.id ?? "");
  const [newType, setNewType] = useState<DemandType>("carrossel");
  const [newTitle, setNewTitle] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [dilute, setDilute] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const clientOf = (id: string) => state.clients.find((c) => c.id === id);

  const addDemand = () => {
    if (!newClient) return;
    store.addDemand({
      clientId: newClient,
      type: newType,
      title: newTitle.trim(),
      date,
      status: "criar",
    });
    setNewTitle("");
  };

  const block = () => {
    const open = openDemandsOn(state, date).length;
    const moved = store.blockDay(date, blockReason.trim(), dilute);
    setBlockReason("");
    setNotice(
      dilute && open > 0
        ? moved > 0
          ? `${moved} demanda${moved > 1 ? "s" : ""} diluída${moved > 1 ? "s" : ""} na semana.`
          : "Não havia dia livre para diluir — as demandas ficaram onde estavam."
        : "Dia marcado como ocupado.",
    );
  };

  return (
    <aside className="rise-in rounded-lg border border-line bg-card p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-xl capitalize">{dayLabel(date)}</h3>
        <button
          onClick={onClose}
          className="rounded border border-line px-2 py-0.5 text-sm text-muted hover:border-line-strong hover:text-foreground"
        >
          Fechar
        </button>
      </div>

      {notice && (
        <p className="mt-2 rounded border border-line bg-background px-2 py-1.5 text-sm">
          {notice}
        </p>
      )}

      {blocked ? (
        <div className="mt-3 rounded border border-line bg-background p-3">
          <p className="text-sm">
            <strong>Dia ocupado.</strong>
            {blocked.reason ? ` Motivo: ${blocked.reason}` : ""}
          </p>
          <button
            onClick={() => {
              store.unblockDay(date);
              setNotice(null);
            }}
            className="mt-2 rounded border border-line bg-card px-3 py-1 text-sm hover:border-line-strong"
          >
            Liberar este dia
          </button>
        </div>
      ) : (
        <div className="mt-3 rounded border border-line bg-background p-3">
          <p className="text-sm font-medium">Vou estar ocupado neste dia</p>
          <input
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            placeholder="Motivo (opcional) — ex.: gravação externa"
            className="mt-2 w-full rounded border border-line bg-card px-2 py-1.5 text-sm"
          />
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={dilute}
              onChange={(e) => setDilute(e.target.checked)}
            />
            Diluir as demandas deste dia no resto da semana
          </label>
          <button
            onClick={block}
            className="mt-2 rounded border border-line-strong bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-85"
          >
            Marcar como ocupado
          </button>
        </div>
      )}

      <h4 className="mt-4 text-xs uppercase tracking-widest text-muted">
        Demandas do dia ({demands.length})
      </h4>
      <ul className="mt-2 space-y-2">
        {demands.length === 0 && (
          <li className="text-sm text-muted">Nenhuma demanda neste dia.</li>
        )}
        {demands.map((d) => {
          const client = clientOf(d.clientId);
          return (
            <li key={d.id} className="rounded border border-line bg-background p-2">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block size-2.5 shrink-0 rounded-full"
                  style={{ background: client?.color ?? "#888" }}
                />
                <span className="truncate text-sm">
                  <strong>{client?.name ?? "?"}</strong> · {DEMAND_TYPE_LABEL[d.type]}
                  {d.title ? ` · ${d.title}` : ""}
                </span>
                <button
                  onClick={() => store.deleteDemand(d.id)}
                  className="ml-auto text-sm text-muted hover:text-foreground"
                  title="Excluir demanda"
                  aria-label="Excluir demanda"
                >
                  ✕
                </button>
              </div>
              {d.movedFrom && (
                <p className="mt-1 text-xs text-muted">
                  ↜ diluída de {dayLabel(d.movedFrom)}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-1">
                {STATUS_ORDER.map((s: DemandStatus) => (
                  <button
                    key={s}
                    onClick={() => store.setStatus(d.id, s)}
                    className={`rounded-full border px-2 py-0.5 text-xs ${
                      d.status === s
                        ? "border-line-strong bg-foreground text-background"
                        : "border-line bg-card text-muted hover:border-line-strong hover:text-foreground"
                    }`}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 rounded border border-line bg-background p-3">
        <p className="text-sm font-medium">Nova demanda</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <select
            value={newClient}
            onChange={(e) => setNewClient(e.target.value)}
            className="rounded border border-line bg-card px-2 py-1.5 text-sm"
            aria-label="Cliente"
          >
            {activeClients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as DemandType)}
            className="rounded border border-line bg-card px-2 py-1.5 text-sm"
            aria-label="Tipo"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {DEMAND_TYPE_LABEL[t]}
              </option>
            ))}
          </select>
        </div>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addDemand()}
          placeholder="Título (opcional)"
          className="mt-2 w-full rounded border border-line bg-card px-2 py-1.5 text-sm"
        />
        <button
          onClick={addDemand}
          className="mt-2 rounded border border-line-strong bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-85"
        >
          Adicionar
        </button>
      </div>

      <h4 className="mt-4 text-xs uppercase tracking-widest text-muted">
        Anotações deste dia
      </h4>
      <ul className="mt-2 space-y-1">
        {dayComments.map((c) => (
          <li key={c.id} className="text-sm">
            • {c.text}
          </li>
        ))}
      </ul>
      <div className="mt-2 flex gap-2">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && commentText.trim()) {
              store.addComment(commentText.trim(), date);
              setCommentText("");
            }
          }}
          placeholder="Anotar algo neste dia…"
          className="w-full rounded border border-line bg-card px-2 py-1.5 text-sm"
        />
        <button
          onClick={() => {
            if (commentText.trim()) {
              store.addComment(commentText.trim(), date);
              setCommentText("");
            }
          }}
          className="rounded border border-line bg-card px-3 py-1.5 text-sm hover:border-line-strong"
        >
          Anotar
        </button>
      </div>
    </aside>
  );
}
