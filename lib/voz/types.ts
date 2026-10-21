/**
 * Contratos da API local do VoiceStudio (porta 3900) usados pelo Estúdio de
 * Voz. Só os campos que o painel lê; o backend devolve bem mais que isso.
 */

export interface Health {
  /** "ok" pronto, "starting" ligando, "offline" quando a ponte não alcança. */
  status: "ok" | "starting" | "offline";
  label?: string;
  device?: string;
  version?: string;
}

export interface VoiceProfile {
  id: string;
  name: string;
  kind: "clone" | "design";
  language: string;
  instruct: string;
  ref_text: string;
  description: string;
  is_demo: number;
  created_at: number;
}

export interface TtsEngine {
  id: string;
  display_name: string;
  available: boolean;
  reason: string | null;
  supports_cloning: boolean;
  supports_voice_design: boolean;
  /** "tags": desenho de voz por etiquetas fixas; "freeform": texto livre. */
  instruct_vocabulary: "tags" | "freeform";
  max_ref_seconds: number | null;
}

export interface TtsEngines {
  active: string;
  backends: TtsEngine[];
}

export interface TranslationEngine {
  id: string;
  display_name: string;
  category: "offline" | "online";
  needs_key: boolean;
  ready: boolean;
}

export interface TranslationEngines {
  active: string;
  engines: TranslationEngine[];
}

export interface EffectPreset {
  id: string;
  label: string;
  icon: string;
  description: string;
}

/** Categoria da licença do modelo, como o catálogo do VoiceStudio declara. */
export type LicenseCategory = "commercial" | "noncommercial" | "restricted" | "unknown";

export interface CatalogModel {
  repo_id: string;
  role: string;
  engines: string[];
  installed: boolean;
  size_gb: number;
  license_acceptance: {
    category: LicenseCategory;
    license: string | null;
    required: boolean;
    accepted: boolean;
  } | null;
}

export interface Catalog {
  models: CatalogModel[];
}

export interface GenerateInput {
  text: string;
  /** Código ISO 639-1 ("pt", "en"...) ou "auto". */
  language: string;
  engine?: string;
  profileId?: string;
  /** Desenho de voz (etiquetas ou texto livre, conforme o motor). */
  instruct?: string;
  refAudio?: File;
  refText?: string;
  speed?: number;
  effectPreset?: string;
}

export interface GeneratedAudio {
  blob: Blob;
  audioId: string;
  duration: number;
  genTime: number;
  /** Trechos do roteiro que o motor engoliu sem gerar som. */
  droppedChunks: number;
}

/** Um take gerado nesta sessão, pronto para ouvir e baixar. */
export interface Take {
  id: string;
  url: string;
  fileName: string;
  text: string;
  language: string;
  voiceLabel: string;
  engine: string;
  duration: number;
  genTime: number;
  droppedChunks: number;
  createdAt: number;
}

export interface GlossaryEntry {
  source: string;
  /** Vazio: o termo fica como está. */
  target: string;
  /** Idioma em que a troca vale; vazio vale para todos. */
  lang?: string;
}

export interface TranslateInput {
  segments: { id: string; text: string }[];
  sourceLang: string;
  targetLang: string;
  provider?: string;
}

export interface TranslateResult {
  translated: { id: string; text: string }[];
  target_lang: string;
  source_lang: string;
}

export interface CreateVoiceInput {
  name: string;
  refAudio: File;
  refText?: string;
  language?: string;
}
