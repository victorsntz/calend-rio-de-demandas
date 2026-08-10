/**
 * Modelo de dados do Calendário de Demandas — exclusivo dos clientes de
 * carrossel do estúdio.
 *
 * Os tipos e status espelham o vocabulário do Fortunato Hub e do portal de
 * carrosséis (Carrossel, Tweets; "Aprovar Criação", "Fazer Postagem",
 * "Postado"), para que uma integração futura seja um mapeamento direto.
 *
 * O produto padrão é o pacote de 120 conteúdos: 60 carrosséis + 60 tweets,
 * entregues a 2 carrosséis/dia e 2 tweets/dia. Carrosséis são agendados um a
 * um no calendário; tweets são produzidos em LOTE semanal (cobrado toda
 * segunda), então não entram dia a dia.
 */

export type DemandType =
  | "carrossel"
  | "estatico"
  | "reels"
  | "tweets"
  | "stories"
  | "outro";

export const DEMAND_TYPE_LABEL: Record<DemandType, string> = {
  carrossel: "Carrossel",
  estatico: "Estático",
  reels: "Reels",
  tweets: "Tweets",
  stories: "Stories",
  outro: "Outro",
};

/** Ordem de produção: criar → aprovação → postagem → postado. */
export type DemandStatus = "criar" | "aprovacao" | "postagem" | "postado";

export const STATUS_ORDER: DemandStatus[] = [
  "criar",
  "aprovacao",
  "postagem",
  "postado",
];

export const STATUS_LABEL: Record<DemandStatus, string> = {
  criar: "A criar",
  aprovacao: "Em aprovação",
  postagem: "Fazer postagem",
  postado: "Postado",
};

/** Ritmo diário contratado (dias úteis, seg–sáb). */
export interface DailyQuota {
  carrossel: number;
  tweets: number;
}

/** Totais do contrato. 0 = sem limite definido. */
export interface ContractTotals {
  carrossel: number;
  tweets: number;
}

export interface Client {
  /** Slug estável (mesmo do portal, quando o cliente existe lá). */
  id: string;
  name: string;
  /** Cor do cliente nos chips do calendário e na teia. */
  color: string;
  active: boolean;
  /** Id do cliente no Fortunato Hub (integração futura). */
  hubId?: string;
  /** Quantos conteúdos por dia o contrato prevê. */
  dailyQuota: DailyQuota;
  /** Total contratado (pacote padrão: 60 carrosséis + 60 tweets). */
  contract: ContractTotals;
  /** Carrosséis entregues ANTES de o calendário começar a contar (ex.: Bussiki 31). */
  deliveredBefore: number;
  notes?: string;
}

export interface Demand {
  id: string;
  clientId: string;
  type: DemandType;
  title: string;
  /** Dia planejado, formato YYYY-MM-DD. */
  date: string;
  status: DemandStatus;
  /** Data original, quando a demanda foi diluída de um dia bloqueado. */
  movedFrom?: string;
  /** Quando foi marcada como postada (conta para a meta da semana). */
  postadoAt?: string;
  createdAt: string;
}

export interface BlockedDay {
  date: string;
  reason?: string;
}

export interface GoalConfig {
  /** Entregas (demandas postadas) por semana. */
  weeklyTarget: number;
  /** Auto-prêmio por bater a meta, definido pelo próprio Victor. */
  reward: string;
}

export interface Comment {
  id: string;
  text: string;
  /** Dia vinculado (opcional) — comentários podem ser gerais ou de um dia. */
  date?: string;
  createdAt: string;
}

export interface AppState {
  clients: Client[];
  demands: Demand[];
  blocked: BlockedDay[];
  goal: GoalConfig;
  comments: Comment[];
  /** Semanas (chave = segunda-feira) cuja celebração já foi exibida. */
  celebratedWeeks: string[];
  /** Semanas cujo prêmio o Victor marcou como resgatado. */
  claimedWeeks: string[];
  /** Semanas (chave = segunda-feira) em que o lote de tweets já foi feito. */
  tweetBatchWeeks: string[];
}
