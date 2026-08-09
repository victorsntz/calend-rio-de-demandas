import type { AppState, Client } from "./types";

/**
 * Clientes iniciais: união do portal de carrosséis (`fortunato-carrosseis`,
 * lib/clients.ts) com os clientes do Fortunato Hub que ainda não estão no
 * portal. `hubId` guarda o id no Hub para integração futura.
 *
 * A quota semanal padrão (1 carrossel + 1 estático) é só um ponto de partida —
 * tudo é editável na aba "Teia de clientes".
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
}

const SEED_CLIENTS: SeedClient[] = [
  // Clientes do portal de carrosséis
  { id: "victor-fortunato", name: "Victor Fortunato", hubId: "victor-fortunato" },
  { id: "gorayeb-advocacia", name: "Gorayeb Advocacia", hubId: "gorayeb" },
  { id: "fernando-gorayeb", name: "Fernando Gorayeb" },
  { id: "beauty-therapy", name: "Beauty Therapy", hubId: "beauty" },
  { id: "larissa-merola", name: "Dra. Larissa Merola", hubId: "larissa" },
  { id: "dani-carrijo", name: "Dani Carrijo", hubId: "dani" },
  { id: "tio-huli", name: "Tio Huli" },
  { id: "gabriel-bussiki", name: "Gabriel Bussiki" },
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
    active: c.active ?? true,
    quota: { carrossel: 1, estatico: 1 },
  }));
}

export function initialState(): AppState {
  return {
    clients: seedClients(),
    demands: [],
    blocked: [],
    goal: {
      weeklyTarget: 10,
      reward: "Um jantar especial no fim de semana 🍕",
    },
    comments: [],
    celebratedWeeks: [],
    claimedWeeks: [],
  };
}
