"use client";

import { useMemo, useState } from "react";
import type { AppStore } from "@/lib/store";
import type { AppState, Client, DemandType } from "@/lib/types";
import { DEMAND_TYPE_LABEL } from "@/lib/types";

interface Props {
  state: AppState;
  store: AppStore;
  onPick: (clientId: string) => void;
}

const QUOTA_TYPES: DemandType[] = ["carrossel", "estatico", "reels", "tweets"];

function quotaTotal(c: Client): number {
  return Object.values(c.quota).reduce((a, b) => a + (b ?? 0), 0);
}

/**
 * A teia: o estúdio no centro, cada cliente num nó ao redor. A espessura do
 * fio é a quota semanal; o tamanho do nó cresce com as demandas em aberto.
 */
export default function ClientWeb({ state, store, onPick }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const active = state.clients.filter((c) => c.active);

  const nodes = useMemo(() => {
    const W = 920;
    const H = 560;
    const cx = W / 2;
    const cy = H / 2;
    const rx = W / 2 - 110;
    const ry = H / 2 - 60;
    return active.map((c, i) => {
      const angle = (2 * Math.PI * i) / Math.max(1, active.length) - Math.PI / 2;
      const open = state.demands.filter(
        (d) => d.clientId === c.id && d.status !== "postado",
      ).length;
      return {
        client: c,
        x: cx + rx * Math.cos(angle),
        y: cy + ry * Math.sin(angle),
        r: 7 + Math.min(10, open * 1.4),
        open,
        anchor: (Math.cos(angle) > 0.25 ? "start" : Math.cos(angle) < -0.25 ? "end" : "middle") as
          | "start"
          | "end"
          | "middle",
      };
    });
  }, [active, state.demands]);

  const addClient = () => {
    const name = newName.trim();
    if (!name) return;
    const id = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    if (!id || state.clients.some((c) => c.id === id)) return;
    const palette = ["#8c5a3f", "#5f7161", "#a0616a", "#4f6d8f", "#b07d4e", "#6d5f8f"];
    store.upsertClient({
      id,
      name,
      color: palette[state.clients.length % palette.length],
      active: true,
      quota: { carrossel: 1, estatico: 1 },
    });
    setNewName("");
  };

  return (
    <section>
      <div className="rounded-lg border border-line bg-card p-2 shadow-sm">
        <svg viewBox="0 0 920 560" className="w-full" role="img" aria-label="Teia de clientes">
          {nodes.map((n) => (
            <line
              key={`l-${n.client.id}`}
              x1={460}
              y1={280}
              x2={n.x}
              y2={n.y}
              stroke={n.client.color}
              strokeWidth={0.6 + quotaTotal(n.client) * 0.8}
              opacity={hovered && hovered !== n.client.id ? 0.12 : 0.4}
            />
          ))}
          {nodes.map((n) => (
            <g
              key={n.client.id}
              className="cursor-pointer"
              onMouseEnter={() => setHovered(n.client.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onPick(n.client.id)}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={n.client.color}
                opacity={hovered && hovered !== n.client.id ? 0.35 : 1}
              />
              {n.open > 0 && (
                <text
                  x={n.x}
                  y={n.y + 3.5}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#f5f3f1"
                >
                  {n.open}
                </text>
              )}
              <text
                x={n.x + (n.anchor === "start" ? n.r + 5 : n.anchor === "end" ? -n.r - 5 : 0)}
                y={n.y < 280 ? n.y - n.r - 6 : n.y + n.r + 14}
                textAnchor={n.anchor}
                fontSize="13"
                fill="#111111"
                opacity={hovered && hovered !== n.client.id ? 0.3 : 0.85}
              >
                {n.client.name}
              </text>
            </g>
          ))}
          <circle cx={460} cy={280} r={34} fill="#111111" />
          <text x={460} y={276} textAnchor="middle" fontSize="12" fill="#f5f3f1">
            Fortunato
          </text>
          <text x={460} y={291} textAnchor="middle" fontSize="12" fill="#f5f3f1">
            Estúdio
          </text>
        </svg>
        <p className="px-2 pb-2 text-center text-sm text-muted">
          Fio mais grosso = mais conteúdos por semana · nó maior = mais demandas em aberto ·
          clique num cliente para ver só ele no calendário
        </p>
      </div>

      <h3 className="mt-6 text-xl">Clientes e quotas semanais</h3>
      <p className="mt-1 text-sm text-muted">
        A quota é quantos conteúdos de cada tipo o cliente recebe por semana — é ela que o
        botão &ldquo;Gerar plano do mês&rdquo; usa para preencher o calendário.
      </p>

      <div className="mt-3 overflow-x-auto rounded-lg border border-line bg-card shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-widest text-muted">
              <th className="p-2.5">Cliente</th>
              {QUOTA_TYPES.map((t) => (
                <th key={t} className="p-2.5 text-center">
                  {DEMAND_TYPE_LABEL[t]}
                </th>
              ))}
              <th className="p-2.5 text-center">Ativo</th>
            </tr>
          </thead>
          <tbody>
            {state.clients.map((c) => (
              <tr key={c.id} className={`border-b border-line last:border-0 ${c.active ? "" : "opacity-45"}`}>
                <td className="p-2.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={c.color}
                      onChange={(e) => store.upsertClient({ ...c, color: e.target.value })}
                      className="size-5 cursor-pointer rounded border-0 bg-transparent p-0"
                      title="Cor do cliente"
                      aria-label={`Cor de ${c.name}`}
                    />
                    <span>{c.name}</span>
                    {c.hubId && (
                      <span
                        className="rounded-full border border-line px-1.5 text-[10px] uppercase tracking-wider text-muted"
                        title={`No Fortunato Hub como "${c.hubId}"`}
                      >
                        hub
                      </span>
                    )}
                  </div>
                </td>
                {QUOTA_TYPES.map((t) => (
                  <td key={t} className="p-2.5 text-center">
                    <input
                      type="number"
                      min={0}
                      max={9}
                      value={c.quota[t] ?? 0}
                      onChange={(e) =>
                        store.upsertClient({
                          ...c,
                          quota: { ...c.quota, [t]: Math.max(0, Number(e.target.value) || 0) },
                        })
                      }
                      className="w-14 rounded border border-line bg-background px-1.5 py-1 text-center"
                      aria-label={`${DEMAND_TYPE_LABEL[t]} por semana de ${c.name}`}
                    />
                  </td>
                ))}
                <td className="p-2.5 text-center">
                  <input
                    type="checkbox"
                    checked={c.active}
                    onChange={(e) => store.upsertClient({ ...c, active: e.target.checked })}
                    aria-label={`${c.name} ativo`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addClient()}
          placeholder="Nome do novo cliente…"
          className="w-64 rounded border border-line bg-card px-2 py-1.5 text-sm"
        />
        <button
          onClick={addClient}
          className="rounded border border-line-strong bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-85"
        >
          Adicionar cliente
        </button>
      </div>
    </section>
  );
}
