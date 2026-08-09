import type { AppState, Demand, DemandType } from "./types";
import {
  addDays,
  inMonth,
  isSunday,
  mondayOf,
  monthGrid,
  parseKey,
  todayKey,
  weekDays,
} from "./dates";

/**
 * Cérebro do calendário: diluir dias bloqueados, gerar o plano do mês a partir
 * das quotas dos clientes e calcular o andamento da meta semanal.
 * Funções puras — recebem o estado e devolvem dados, sem efeitos.
 */

/** Demandas ainda não postadas de um dia. */
export function openDemandsOn(state: AppState, date: string): Demand[] {
  return state.demands.filter((d) => d.date === date && d.status !== "postado");
}

function isBlocked(state: AppState, date: string): boolean {
  return state.blocked.some((b) => b.date === date);
}

function loadOn(state: AppState, date: string): number {
  return state.demands.filter((d) => d.date === date && d.status !== "postado")
    .length;
}

/**
 * Dias que podem receber demandas diluídas: mesma semana do dia bloqueado
 * (seg → sáb), sem dias bloqueados nem dias que já passaram. Se a semana não
 * tiver espaço, avança para a semana seguinte.
 */
function diluteCandidates(state: AppState, blockedDate: string): string[] {
  const today = todayKey();
  const pick = (monday: string) =>
    weekDays(monday).filter(
      (day) =>
        day !== blockedDate &&
        !isSunday(day) &&
        !isBlocked(state, day) &&
        day >= today,
    );

  let monday = mondayOf(blockedDate);
  for (let hop = 0; hop < 8; hop++) {
    const days = pick(monday);
    if (days.length > 0) return days;
    monday = addDays(monday, 7);
  }
  return [];
}

export interface DiluteMove {
  demandId: string;
  from: string;
  to: string;
}

/**
 * Distribui as demandas abertas de um dia bloqueado nos dias vizinhos,
 * sempre escolhendo o dia menos carregado (e, em empate, o mais próximo).
 */
export function planDilution(state: AppState, date: string): DiluteMove[] {
  const demands = openDemandsOn(state, date);
  if (demands.length === 0) return [];

  const candidates = diluteCandidates(state, date);
  if (candidates.length === 0) return [];

  const load = new Map<string, number>(
    candidates.map((day) => [day, loadOn(state, day)]),
  );
  const origin = parseKey(date).getTime();
  const distance = (day: string) =>
    Math.abs(parseKey(day).getTime() - origin);

  return demands.map((demand) => {
    const best = [...candidates].sort(
      (a, b) =>
        load.get(a)! - load.get(b)! || distance(a) - distance(b),
    )[0];
    load.set(best, load.get(best)! + 1);
    return { demandId: demand.id, from: date, to: best };
  });
}

/** Proposta de demanda do plano mensal (ainda sem id — vira Demand ao aplicar). */
export interface PlannedDemand {
  clientId: string;
  type: DemandType;
  title: string;
  date: string;
}

/**
 * Gera o plano do mês: para cada cliente ativo e cada semana do mês, cria as
 * demandas que faltam para cumprir a quota semanal, espalhando nos dias úteis
 * menos carregados. Semanas com menos de 3 dias úteis dentro do mês ficam com
 * o mês vizinho.
 */
export function planMonth(
  state: AppState,
  year: number,
  month: number,
): PlannedDemand[] {
  const planned: PlannedDemand[] = [];
  const extraLoad = new Map<string, number>();
  const loadWithPlan = (day: string) =>
    loadOn(state, day) + (extraLoad.get(day) ?? 0);

  const weeks = monthGrid(year, month);

  for (const week of weeks) {
    const workdays = week.filter(
      (day) =>
        inMonth(day, year, month) &&
        !isSunday(day) &&
        parseKey(day).getDay() !== 6 &&
        !isBlocked(state, day),
    );
    if (workdays.length < 3) continue;

    for (const client of state.clients) {
      if (!client.active) continue;
      for (const [type, quota] of Object.entries(client.quota) as [
        DemandType,
        number,
      ][]) {
        if (!quota || quota <= 0) continue;
        const existing = state.demands.filter(
          (d) =>
            d.clientId === client.id &&
            d.type === type &&
            mondayOf(d.date) === week[0],
        ).length;
        const alreadyPlanned = planned.filter(
          (p) =>
            p.clientId === client.id &&
            p.type === type &&
            mondayOf(p.date) === week[0],
        ).length;

        for (let i = existing + alreadyPlanned; i < quota; i++) {
          const day = [...workdays].sort(
            (a, b) => loadWithPlan(a) - loadWithPlan(b) || (a < b ? -1 : 1),
          )[0];
          planned.push({
            clientId: client.id,
            type,
            title: "",
            date: day,
          });
          extraLoad.set(day, (extraLoad.get(day) ?? 0) + 1);
        }
      }
    }
  }

  return planned;
}

export interface WeekProgress {
  monday: string;
  delivered: number;
  target: number;
  achieved: boolean;
}

/** Entregas (demandas postadas) da semana, contadas pelo dia da postagem. */
export function weekProgress(state: AppState, monday: string): WeekProgress {
  const delivered = state.demands.filter(
    (d) => d.status === "postado" && d.postadoAt && mondayOf(d.postadoAt) === monday,
  ).length;
  return {
    monday,
    delivered,
    target: state.goal.weeklyTarget,
    achieved: delivered >= state.goal.weeklyTarget,
  };
}

/** Histórico das últimas N semanas (mais recente primeiro), para os prêmios. */
export function weekHistory(state: AppState, n: number): WeekProgress[] {
  const current = mondayOf(todayKey());
  return Array.from({ length: n }, (_, i) =>
    weekProgress(state, addDays(current, -7 * i)),
  );
}

/** Semanas seguidas (terminando na atual ou anterior) com meta batida. */
export function streak(state: AppState): number {
  const current = mondayOf(todayKey());
  let count = 0;
  let monday = weekProgress(state, current).achieved
    ? current
    : addDays(current, -7);
  for (;;) {
    if (!weekProgress(state, monday).achieved) break;
    count++;
    monday = addDays(monday, -7);
  }
  return count;
}

export interface Insight {
  kind: "sobrecarga" | "sem-demanda" | "atrasada";
  text: string;
  date?: string;
}

/** Avisos rápidos: dias sobrecarregados, clientes parados e demandas atrasadas. */
export function insights(state: AppState): Insight[] {
  const result: Insight[] = [];
  const today = todayKey();
  const monday = mondayOf(today);

  const thisWeek = weekDays(monday);
  for (const day of thisWeek) {
    const load = loadOn(state, day);
    if (load >= 5 && !isBlocked(state, day)) {
      result.push({
        kind: "sobrecarga",
        text: `${load} demandas abertas — considere diluir`,
        date: day,
      });
    }
  }

  const idle = state.clients.filter(
    (c) =>
      c.active &&
      Object.values(c.quota).some((q) => (q ?? 0) > 0) &&
      !state.demands.some(
        (d) => d.clientId === c.id && mondayOf(d.date) === monday,
      ),
  );
  if (idle.length > 0) {
    const names = idle.slice(0, 4).map((c) => c.name).join(", ");
    const rest = idle.length > 4 ? ` e mais ${idle.length - 4}` : "";
    result.push({
      kind: "sem-demanda",
      text: `Sem demanda nesta semana: ${names}${rest}`,
    });
  }

  const overdue = state.demands.filter(
    (d) => d.status !== "postado" && d.date < today,
  );
  if (overdue.length > 0) {
    result.push({
      kind: "atrasada",
      text: `${overdue.length} demanda${overdue.length > 1 ? "s" : ""} de dias passados ainda aberta${overdue.length > 1 ? "s" : ""}`,
    });
  }

  return result;
}
