/**
 * Helpers de data baseados em strings YYYY-MM-DD (sem fuso — o calendário é
 * sempre no horário local do estúdio).
 */

export function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toKey(new Date());
}

export function addDays(key: string, n: number): string {
  const d = parseKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

/** Segunda-feira da semana do dia dado (semana = seg → dom). */
export function mondayOf(key: string): string {
  const d = parseKey(key);
  const dow = d.getDay(); // 0 = domingo
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  return toKey(d);
}

/** Os 7 dias da semana que começa na segunda dada. */
export function weekDays(mondayKey: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(mondayKey, i));
}

export function isWeekend(key: string): boolean {
  const dow = parseKey(key).getDay();
  return dow === 0 || dow === 6;
}

export function isSunday(key: string): boolean {
  return parseKey(key).getDay() === 0;
}

/**
 * Grade do mês em semanas completas (seg → dom), incluindo os dias vizinhos
 * que completam a primeira e a última semana.
 */
export function monthGrid(year: number, month: number): string[][] {
  const first = mondayOf(toKey(new Date(year, month, 1)));
  const weeks: string[][] = [];
  let cursor = first;
  for (;;) {
    const week = weekDays(cursor);
    weeks.push(week);
    cursor = addDays(cursor, 7);
    const d = parseKey(cursor);
    if (d.getFullYear() > year || (d.getFullYear() === year && d.getMonth() > month)) {
      break;
    }
  }
  return weeks;
}

export function inMonth(key: string, year: number, month: number): boolean {
  const d = parseKey(key);
  return d.getFullYear() === year && d.getMonth() === month;
}

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function monthLabel(year: number, month: number): string {
  return `${MONTHS[month]} ${year}`;
}

export const WEEKDAY_SHORT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

/** "seg, 12/08" — rótulo curto de um dia. */
export function dayLabel(key: string): string {
  const d = parseKey(key);
  const dow = d.getDay();
  const idx = dow === 0 ? 6 : dow - 1;
  return `${WEEKDAY_SHORT[idx]}, ${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1,
  ).padStart(2, "0")}`;
}

/** "12 a 18/08" — rótulo de uma semana a partir da segunda. */
export function weekLabel(mondayKey: string): string {
  const start = parseKey(mondayKey);
  const end = parseKey(addDays(mondayKey, 6));
  const dd = (d: Date) => String(d.getDate()).padStart(2, "0");
  const mm = (d: Date) => String(d.getMonth() + 1).padStart(2, "0");
  return `${dd(start)}/${mm(start)} a ${dd(end)}/${mm(end)}`;
}
