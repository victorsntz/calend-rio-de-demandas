/**
 * Modelo de dados do Calendário de Demandas.
 *
 * Os tipos e status espelham o vocabulário já usado no Fortunato Hub e no
 * portal de carrosséis (Carrossel, Estático, Reels/Corte, Tweets; "Aprovar
 * Criação", "Fazer Postagem", "Postado"), para que uma integração futura seja
 * um mapeamento direto.
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

/** Quota semanal de produção por tipo de conteúdo. */
export type Quota = Partial<Record<DemandType, number>>;

export interface Client {
  /** Slug estável (mesmo do portal, quando o cliente existe lá). */
  id: string;
  name: string;
  /** Cor do cliente nos chips do calendário e na teia. */
  color: string;
  active: boolean;
  /** Id do cliente no Fortunato Hub (integração futura). */
  hubId?: string;
  quota: Quota;
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
}
