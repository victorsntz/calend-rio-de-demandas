"use client";

import type {
  Catalog,
  CreateVoiceInput,
  EffectPreset,
  GenerateInput,
  GeneratedAudio,
  Health,
  LicenseCategory,
  TranslateInput,
  TranslateResult,
  TranslationEngines,
  TtsEngines,
  VoiceProfile,
} from "./types";

const SENHA_KEY = "fortunato-voz-senha";

export function readSenha(): string {
  try {
    return localStorage.getItem(SENHA_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveSenha(senha: string) {
  try {
    localStorage.setItem(SENHA_KEY, senha);
  } catch {
    /* navegador sem storage: a senha vale só até recarregar */
  }
}

export class VozError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly payload?: unknown,
  ) {
    super(message);
  }
}

/** Mensagens do VoiceStudio que merecem tradução para o time. */
const FRIENDLY: Record<string, string> = {
  model_licence_required:
    "Esse motor pede o aceite da licença do modelo. Abra o VoiceStudio em Catálogo de modelos e aceite (ou escolha outro motor).",
  argos_pack_missing: "Falta o pacote de idioma do tradutor offline para esse par.",
  offline: "O VoiceStudio não está respondendo. Ele está aberto?",
  senha: "Senha do Estúdio de Voz incorreta.",
};

/**
 * Normaliza os formatos de erro do VoiceStudio ({detail: "..."},
 * {detail: {code, message}}, {error, code}) e os da própria ponte.
 */
async function toError(res: Response): Promise<VozError> {
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    /* corpo sem JSON */
  }
  const b = (body ?? {}) as Record<string, unknown>;
  const detail = b.detail as Record<string, unknown> | string | undefined;
  const code =
    (typeof b.code === "string" && b.code) ||
    (detail && typeof detail === "object" && typeof detail.code === "string" && detail.code) ||
    (typeof b.step === "string" ? "starting" : undefined);
  const raw =
    (typeof b.error === "string" && b.error) ||
    (typeof detail === "string" && detail) ||
    (detail && typeof detail === "object" && typeof detail.message === "string" && detail.message) ||
    `O VoiceStudio respondeu ${res.status}.`;
  const message = (code && FRIENDLY[code]) || raw;
  return new VozError(message, res.status, code || undefined, body);
}

async function call(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const senha = readSenha();
  if (senha) headers.set("x-voz-senha", senha);
  const res = await fetch(`/api/voz/${path}`, { ...init, headers, cache: "no-store" });
  if (!res.ok) throw await toError(res);
  return res;
}

async function getJson<T>(path: string): Promise<T> {
  return (await call(path)).json() as Promise<T>;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await call(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json() as Promise<T>;
}

export const voz = {
  /** Nunca lança: "ligando" e "fora do ar" também são respostas. */
  async health(): Promise<Health | VozError> {
    try {
      const res = await fetch("/api/voz/health", {
        headers: readSenha() ? { "x-voz-senha": readSenha() } : {},
        cache: "no-store",
      });
      const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (body.status === "ok" || body.status === "starting") return body as unknown as Health;
      if (body.code === "senha" || body.code === "sem_senha" || body.code === "url_invalida") {
        return new VozError(String(body.error), res.status, body.code);
      }
      return { status: "offline" };
    } catch {
      return { status: "offline" };
    }
  },

  profiles: () => getJson<VoiceProfile[]>("profiles"),
  ttsEngines: () => getJson<TtsEngines>("engines/tts"),
  translationEngines: () => getJson<TranslationEngines>("engines/translation"),
  effectPresets: async () => (await getJson<{ presets: EffectPreset[] }>("engines/effects/presets")).presets,
  catalog: () => getJson<Catalog>("models"),

  /** A amostra da voz vem como blob: um <audio src> não manda a senha. */
  async profileAudio(id: string): Promise<string> {
    const res = await call(`profiles/${encodeURIComponent(id)}/audio`);
    return URL.createObjectURL(await res.blob());
  },

  async generate(input: GenerateInput, signal?: AbortSignal): Promise<GeneratedAudio> {
    const form = new FormData();
    form.set("text", input.text);
    form.set("language", input.language);
    if (input.engine) form.set("engine", input.engine);
    if (input.profileId) form.set("profile_id", input.profileId);
    if (input.instruct) form.set("instruct", input.instruct);
    if (input.refAudio) form.set("ref_audio", input.refAudio);
    if (input.refText) form.set("ref_text", input.refText);
    if (input.speed && input.speed !== 1) form.set("speed", String(input.speed));
    if (input.effectPreset) form.set("effect_preset", input.effectPreset);

    const res = await call("generate", { method: "POST", body: form, signal });
    return {
      blob: await res.blob(),
      audioId: res.headers.get("x-audio-id") ?? Math.random().toString(36).slice(2),
      duration: Number(res.headers.get("x-audio-duration") ?? 0),
      genTime: Number(res.headers.get("x-gen-time") ?? 0),
      droppedChunks: Number(res.headers.get("x-omnivoice-dropped-chunks") ?? 0),
    };
  },

  translate: (input: TranslateInput) =>
    postJson<TranslateResult>("dub/translate", {
      segments: input.segments,
      source_lang: input.sourceLang,
      target_lang: input.targetLang,
      provider: input.provider,
      quality: "fast",
    }),

  installArgosPack: (sourceLang: string, targetLangs: string[]) =>
    postJson<unknown>("engines/translation/argos/packs/install", {
      source_lang: sourceLang,
      target_langs: targetLangs,
    }),

  async createVoice(input: CreateVoiceInput): Promise<VoiceProfile> {
    const form = new FormData();
    form.set("name", input.name);
    form.set("kind", "clone");
    form.set("ref_audio", input.refAudio);
    if (input.refText) form.set("ref_text", input.refText);
    form.set("language", input.language || "Auto");
    return (await call("profiles", { method: "POST", body: form })).json();
  },

  deleteVoice: async (id: string) => {
    await call(`profiles/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};

/**
 * A licença mais restritiva entre os modelos de um motor. Se o catálogo não
 * lista o motor, a licença fica "unknown": melhor conferir que presumir.
 */
export function engineLicense(catalog: Catalog | null, engineId: string): LicenseCategory {
  const models = (catalog?.models ?? []).filter(
    (m) => m.role === "TTS" && m.engines.includes(engineId),
  );
  if (models.length === 0) return "unknown";
  const cats = models.map((m) => m.license_acceptance?.category ?? "unknown");
  if (cats.includes("noncommercial")) return "noncommercial";
  if (cats.every((c) => c === "commercial")) return "commercial";
  return cats.includes("restricted") ? "restricted" : "unknown";
}
