"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AppState,
  BlockedDay,
  Client,
  Comment,
  Demand,
  DemandStatus,
} from "./types";
import { initialState } from "./seed";
import { mondayOf, todayKey } from "./dates";
import { planDilution, weekProgress, type PlannedDemand } from "./planner";

const STORAGE_KEY = "fortunato-calendario-v1";

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function load(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppState;
    if (!Array.isArray(parsed.clients) || !Array.isArray(parsed.demands)) {
      return null;
    }
    // Campos novos ganham default ao carregar estados antigos.
    return { ...initialState(), ...parsed };
  } catch {
    return null;
  }
}

/**
 * Estado do app com persistência em localStorage.
 *
 * O estado começa `null` no servidor e no primeiro render do cliente (evita
 * mismatch de hidratação) e é carregado num effect.
 */
export function useAppState() {
  const [state, setState] = useState<AppState | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    setState(load() ?? initialState());
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (loaded.current && state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const update = useCallback((fn: (s: AppState) => AppState) => {
    setState((s) => (s ? fn(s) : s));
  }, []);

  const addDemand = useCallback(
    (d: Omit<Demand, "id" | "createdAt">) => {
      update((s) => ({
        ...s,
        demands: [
          ...s.demands,
          { ...d, id: uid(), createdAt: new Date().toISOString() },
        ],
      }));
    },
    [update],
  );

  const updateDemand = useCallback(
    (id: string, patch: Partial<Demand>) => {
      update((s) => ({
        ...s,
        demands: s.demands.map((d) => (d.id === id ? { ...d, ...patch } : d)),
      }));
    },
    [update],
  );

  const deleteDemand = useCallback(
    (id: string) => {
      update((s) => ({
        ...s,
        demands: s.demands.filter((d) => d.id !== id),
      }));
    },
    [update],
  );

  /**
   * Avança/define o status. Ao marcar "postado", registra o dia da entrega e,
   * se a meta da semana acabou de ser batida, dispara a celebração (uma vez
   * por semana).
   */
  const setStatus = useCallback(
    (id: string, status: DemandStatus) => {
      update((s) => {
        const demands = s.demands.map((d) =>
          d.id === id
            ? {
                ...d,
                status,
                postadoAt:
                  status === "postado"
                    ? (d.postadoAt ?? todayKey())
                    : undefined,
              }
            : d,
        );
        const next = { ...s, demands };
        if (status === "postado") {
          const monday = mondayOf(todayKey());
          const prog = weekProgress(next, monday);
          if (prog.achieved && !s.celebratedWeeks.includes(monday)) {
            next.celebratedWeeks = [...s.celebratedWeeks, monday];
            setCelebrating(true);
          }
        }
        return next;
      });
    },
    [update],
  );

  /** Bloqueia um dia e devolve quantas demandas foram diluídas. */
  const blockDay = useCallback(
    (date: string, reason: string, dilute: boolean): number => {
      let moved = 0;
      update((s) => {
        if (s.blocked.some((b) => b.date === date)) return s;
        const blocked: BlockedDay[] = [...s.blocked, { date, reason: reason || undefined }];
        let demands = s.demands;
        if (dilute) {
          const moves = planDilution(s, date);
          moved = moves.length;
          const byId = new Map(moves.map((m) => [m.demandId, m]));
          demands = s.demands.map((d) => {
            const m = byId.get(d.id);
            return m ? { ...d, date: m.to, movedFrom: m.from } : d;
          });
        }
        return { ...s, blocked, demands };
      });
      return moved;
    },
    [update],
  );

  const unblockDay = useCallback(
    (date: string) => {
      update((s) => ({
        ...s,
        blocked: s.blocked.filter((b) => b.date !== date),
      }));
    },
    [update],
  );

  const setGoal = useCallback(
    (weeklyTarget: number, reward: string) => {
      update((s) => ({ ...s, goal: { weeklyTarget, reward } }));
    },
    [update],
  );

  const claimReward = useCallback(
    (monday: string) => {
      update((s) =>
        s.claimedWeeks.includes(monday)
          ? s
          : { ...s, claimedWeeks: [...s.claimedWeeks, monday] },
      );
    },
    [update],
  );

  const addComment = useCallback(
    (text: string, date?: string) => {
      update((s) => ({
        ...s,
        comments: [
          {
            id: uid(),
            text,
            date,
            createdAt: new Date().toISOString(),
          } satisfies Comment,
          ...s.comments,
        ],
      }));
    },
    [update],
  );

  const deleteComment = useCallback(
    (id: string) => {
      update((s) => ({
        ...s,
        comments: s.comments.filter((c) => c.id !== id),
      }));
    },
    [update],
  );

  const upsertClient = useCallback(
    (client: Client) => {
      update((s) => {
        const exists = s.clients.some((c) => c.id === client.id);
        return {
          ...s,
          clients: exists
            ? s.clients.map((c) => (c.id === client.id ? client : c))
            : [...s.clients, client],
        };
      });
    },
    [update],
  );

  const applyPlan = useCallback(
    (planned: PlannedDemand[]) => {
      update((s) => ({
        ...s,
        demands: [
          ...s.demands,
          ...planned.map((p) => ({
            ...p,
            id: uid(),
            status: "criar" as const,
            createdAt: new Date().toISOString(),
          })),
        ],
      }));
    },
    [update],
  );

  const importState = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as AppState;
      if (!Array.isArray(parsed.clients) || !Array.isArray(parsed.demands)) {
        return false;
      }
      setState({ ...initialState(), ...parsed });
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    state,
    celebrating,
    stopCelebrating: () => setCelebrating(false),
    addDemand,
    updateDemand,
    deleteDemand,
    setStatus,
    blockDay,
    unblockDay,
    setGoal,
    claimReward,
    addComment,
    deleteComment,
    upsertClient,
    applyPlan,
    importState,
  };
}

export type AppStore = ReturnType<typeof useAppState>;
