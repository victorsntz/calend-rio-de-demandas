import type { AppState, Client } from "./types";

/**
 * Clientes do estúdio (portal de carrosséis + Fortunato Hub). O calendário é
 * EXCLUSIVO dos clientes de carrossel, então só quem tem contrato de
 * carrossel começa ativo:
 *
 *   - Gabriel Bussiki — 1 carrossel/dia, contrato de 40 (31 já entregues
 *     antes do calendário — ajuste em "Feitos antes" se for 32).
 *   - Tio Huli — 3 carrosséis/dia.
 *
 * Os demais ficam cadastrados e inativos, já com o pacote padrão pré-definido
 * (2 carrosséis/dia + 2 tweets/dia; 120 conteúdos = 60 carrosséis + 60
 * tweets). Quando o Victor fechar/confirmar um cliente de carrossel, é um
 * clique em "Ativo" na aba Teia de clientes.
 */

const PALETTE = [
  "#8c5a3f",
  "#5f7161",
  "#a0616a",
  "#4f6d8f",
  "#8f7a4f",
  "#6d5f8f",
  "#3f8c7a",
  "#b07d4e",
  "#7a8c3f",
  "#8f4f6d",
  "#4e7db0",
  "#a08850",
  "#5a8c3f",
  "#8f5f4f",
  "#4f8f8c",
  "#9a6db0",
  "#b0684e",
  "#6d8f4f",
  "#4f5a8c",
  "#b04e7d",
  "#3f6d8c",
  "#8c8c3f",
  "#7d4eb0",
  "#4eb07d",
  "#8c3f5a",
  "#50a089",
];

interface SeedClient {
  id: string;
  name: string;
  hubId?: string;
  active?: boolean;
  daily?: { carrossel: number; tweets: number };
  contract?: { carrossel: number; tweets: number };
  deliveredBefore?: number;
}

/** Pacote padrão: 2 carrosséis + 2 tweets por dia; 60 + 60 no total. */
const STANDARD_DAILY = { carrossel: 2, tweets: 2 };
const STANDARD_CONTRACT = { carrossel: 60, tweets: 60 };

const SEED_CLIENTS: SeedClient[] = [
  // Clientes de carrossel com contrato em andamento
  {
    id: "gabriel-bussiki",
    name: "Gabriel Bussiki",
    active: true,
    daily: { carrossel: 1, tweets: 0 },
    contract: { carrossel: 40, tweets: 0 },
    deliveredBefore: 31,
  },
  {
    id: "tio-huli",
    name: "Tio Huli",
    active: true,
    daily: { carrossel: 3, tweets: 0 },
    contract: { carrossel: 0, tweets: 0 }, // sem teto definido — ajustar quando fechar
  },
  // Demais clientes do portal (inativos até virarem cliente de carrossel)
  { id: "victor-fortunato", name: "Victor Fortunato", hubId: "victor-fortunato" },
  { id: "gorayeb-advocacia", name: "Gorayeb Advocacia", hubId: "gorayeb" },
  { id: "fernando-gorayeb", name: "Fernando Gorayeb" },
  { id: "beauty-therapy", name: "Beauty Therapy", hubId: "beauty" },
  { id: "larissa-merola", name: "Dra. Larissa Merola", hubId: "larissa" },
  { id: "dani-carrijo", name: "Dani Carrijo", hubId: "dani" },
  { id: "edenilson-junior", name: "Edenilson Junior" },
  { id: "guilherme-marques", name: "Guilherme Marques" },
  { id: "isabel-ciribelli", name: "Dra. Isabel Ciribelli" },
  { id: "lucas-reis", name: "Lucas Reis" },
  { id: "benetro", name: "Benetro Importação" },
  { id: "felipe-venancio", name: "Felipe Venâncio" },
  { id: "fabricio-amorin", name: "Fabrício Amorin" },
  { id: "bela-brasao", name: "Bela Brasão" },
  { id: "julia-lazari", name: "Julia Lazari" },
  { id: "eric-delivery", name: "Eric Delivery" },
  { id: "kelvin-cleto", name: "Kelvin Cleto" },
  { id: "gu-alonge", name: "Gu Alonge" },
  // Clientes que só existem no Fortunato Hub
  { id: "lotus", name: "Lotus", hubId: "lotus" },
  { id: "eden-spa", name: "Éden Spa", hubId: "eden" },
  { id: "cafe-da-ana", name: "Café da Ana", hubId: "cafedaana" },
  { id: "protenus", name: "Protenus", hubId: "protenus" },
  { id: "rebeca-fortunato", name: "Rebeca Fortunato", hubId: "rebeca" },
  { id: "norte-sul", name: "Norte Sul", hubId: "nortesul" },
];

export function seedClients(): Client[] {
  return SEED_CLIENTS.map((c, i) => ({
    id: c.id,
    name: c.name,
    hubId: c.hubId,
    color: PALETTE[i % PALETTE.length],
    active: c.active ?? false,
    dailyQuota: c.daily ?? { ...STANDARD_DAILY },
    contract: c.contract ?? { ...STANDARD_CONTRACT },
    deliveredBefore: c.deliveredBefore ?? 0,
  }));
}

export function initialState(): AppState {
  return {
    clients: seedClients(),
    demands: [],
    blocked: [],
    goal: {
      // Bussiki (1/dia) + Tio Huli (3/dia) × 6 dias úteis
      weeklyTarget: 24,
      reward: "Um jantar especial no fim de semana 🍕",
    },
    comments: [],
    celebratedWeeks: [],
    claimedWeeks: [],
    tweetBatchWeeks: [],
  };
}
