import type { AppState, Client, Demand } from "./types";
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
 * Cérebro do calendário: diluir dias bloqueados, gerar o plano do mês a
 * partir do ritmo diário de cada cliente (respeitando o teto do contrato),
 * acompanhar contratos e calcular o andamento da meta semanal.
 * Funções puras — recebem o estado e devolvem dados, sem efeitos.
 *
 * Dia útil aqui é seg–sáb (domingo é folga).
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

/** Andamento do contrato de carrosséis de um cliente. */
export interface ContractProgress {
  /** Entregues: os de antes do calendário + os postados aqui. */
  done: number;
  /** Já agendados no calendário e ainda não postados. */
  planned: number;
  /** Total contratado (0 = sem teto definido). */
  total: number;
  /** Quantos faltam entregar (0 quando sem teto). */
  remaining: number;
}

export function contractProgress(
  state: AppState,
  client: Client,
): ContractProgress {
  const mine = state.demands.filter(
    (d) => d.clientId === client.id && d.type === "carrossel",
  );
  const done =
    client.deliveredBefore + mine.filter((d) => d.status === "postado").length;
  const planned = mine.filter((d) => d.status !== "postado").length;
  const total = client.contract.carrossel;
  return {
    done,
    planned,
    total,
    remaining: total > 0 ? Math.max(0, total - done) : 0,
  };
}

/**
 * No ritmo diário atual, em que dia o contrato de carrosséis termina
 * (contando seg–sáb a partir de hoje). Null sem teto ou já concluído.
 */
export function projectedEnd(state: AppState, client: Client): string | null {
  const perDay = client.dailyQuota.carrossel;
  if (perDay <= 0) return null;
  const { total, remaining } = contractProgress(state, client);
  if (total <= 0 || remaining <= 0) return null;

  let days = Math.ceil(remaining / perDay);
  let day = todayKey();
  for (;;) {
    if (!isSunday(day)) days--;
    if (days <= 0) return day;
    day = addDays(day, 1);
  }
}

/** Proposta de demanda do plano mensal (ainda sem id — vira Demand ao aplicar). */
export interface PlannedDemand {
  clientId: string;
  type: "carrossel";
  title: string;
  date: string;
}

/**
 * Gera o plano do mês: para cada cliente ativo, completa cada dia útil
 * (seg–sáb, não bloqueado, de hoje em diante) até o ritmo diário de
 * carrosséis, parando quando o teto do contrato é atingido. Tweets não
 * entram — são o lote semanal de segunda.
 */
export function planMonth(
  state: AppState,
  year: number,
  month: number,
): PlannedDemand[] {
  const planned: PlannedDemand[] = [];
  const today = todayKey();

  const days = monthGrid(year, month)
    .flat()
    .filter(
      (day) =>
        inMonth(day, year, month) &&
        !isSunday(day) &&
        !isBlocked(state, day) &&
        day >= today,
    );

  for (const client of state.clients) {
    if (!client.active) continue;
    const perDay = client.dailyQuota.carrossel;
    if (perDay <= 0) continue;

    const { total } = contractProgress(state, client);
    const allMine = state.demands.filter(
      (d) => d.clientId === client.id && d.type === "carrossel",
    ).length;
    // Tudo que já existe (postado ou agendado) conta contra o teto.
    let remainingToPlan =
      total > 0 ? total - client.deliveredBefore - allMine : Infinity;

    for (const day of days) {
      if (remainingToPlan <= 0) break;
      const existing = state.demands.filter(
        (d) =>
          d.clientId === client.id &&
          d.type === "carrossel" &&
          d.date === day,
      ).length;
      for (let i = existing; i < perDay && remainingToPlan > 0; i++) {
        planned.push({ clientId: client.id, type: "carrossel", title: "", date: day });
        remainingToPlan--;
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

/** Situação de um cliente ativo no dia de hoje (para a régua de cobrança). */
export interface TodayStatus {
  client: Client;
  /** Carrosséis com data de hoje, qualquer status. */
  scheduled: number;
  /** Carrosséis postados hoje (pelo dia da postagem). */
  postedToday: number;
  perDay: number;
  progress: ContractProgress;
  end: string | null;
}

export function todayStatuses(state: AppState): TodayStatus[] {
  const today = todayKey();
  return state.clients
    .filter((c) => c.active)
    .map((client) => {
      const mine = state.demands.filter(
        (d) => d.clientId === client.id && d.type === "carrossel",
      );
      return {
        client,
        scheduled: mine.filter((d) => d.date === today).length,
        postedToday: mine.filter(
          (d) => d.status === "postado" && d.postadoAt === today,
        ).length,
        perDay: client.dailyQuota.carrossel,
        progress: contractProgress(state, client),
        end: projectedEnd(state, client),
      };
    });
}

/** O lote de tweets da semana atual já foi feito? */
export function tweetBatchDone(state: AppState): boolean {
  return state.tweetBatchWeeks.includes(mondayOf(todayKey()));
}

export interface Insight {
  kind: "sobrecarga" | "lote-tweets" | "atrasada" | "contrato";
  text: string;
  date?: string;
}

/** Avisos rápidos: lote de tweets pendente, dias sobrecarregados, atrasos, contratos no fim. */
export function insights(state: AppState): Insight[] {
  const result: Insight[] = [];
  const today = todayKey();
  const monday = mondayOf(today);

  const hasTweetClients = state.clients.some(
    (c) => c.active && c.dailyQuota.tweets > 0,
  );
  if (hasTweetClients && !tweetBatchDone(state) && !isSunday(today)) {
    result.push({
      kind: "lote-tweets",
      text:
        today === monday
          ? "Segunda-feira: dia de fazer o lote novo de tweets da semana"
          : "O lote de tweets desta semana ainda não foi feito",
    });
  }

  for (const day of weekDays(monday)) {
    const load = loadOn(state, day);
    if (load >= 6 && !isBlocked(state, day)) {
      result.push({
        kind: "sobrecarga",
        text: `${load} demandas abertas — considere diluir`,
        date: day,
      });
    }
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

  for (const client of state.clients) {
    if (!client.active) continue;
    const p = contractProgress(state, client);
    if (p.total > 0 && p.remaining > 0 && p.remaining <= 5) {
      result.push({
        kind: "contrato",
        text: `${client.name}: faltam só ${p.remaining} carrosséis para fechar o contrato de ${p.total}`,
      });
    }
  }

  return result;
}
