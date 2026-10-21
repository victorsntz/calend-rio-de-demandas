"use client";

import { useCallback, useEffect, useState } from "react";
import { voz, VozError } from "./client";
import type {
  Catalog,
  EffectPreset,
  Health,
  TranslationEngines,
  TtsEngines,
  VoiceProfile,
} from "./types";

export interface VozData {
  health: Health | null;
  /** Erro de acesso (senha) que trava o painel inteiro. */
  accessError: VozError | null;
  profiles: VoiceProfile[];
  tts: TtsEngines | null;
  translation: TranslationEngines | null;
  presets: EffectPreset[];
  catalog: Catalog | null;
  reload: () => void;
  reloadProfiles: () => Promise<void>;
}

/**
 * Acompanha o VoiceStudio: confere a saúde a cada 5 s enquanto ele liga (ou
 * está fora) e a cada 30 s quando está pronto; ao ficar pronto, carrega
 * vozes, motores e catálogo.
 */
export function useVoz(): VozData {
  const [health, setHealth] = useState<Health | null>(null);
  const [accessError, setAccessError] = useState<VozError | null>(null);
  const [profiles, setProfiles] = useState<VoiceProfile[]>([]);
  const [tts, setTts] = useState<TtsEngines | null>(null);
  const [translation, setTranslation] = useState<TranslationEngines | null>(null);
  const [presets, setPresets] = useState<EffectPreset[]>([]);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [tick, setTick] = useState(0);

  const ready = health?.status === "ok";

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const check = async () => {
      const h = await voz.health();
      if (!alive) return;
      if (h instanceof VozError) {
        setAccessError(h);
        setHealth(null);
      } else {
        setAccessError(null);
        setHealth(h);
      }
      const ok = !(h instanceof VozError) && h.status === "ok";
      timer = setTimeout(check, ok ? 30_000 : 5_000);
    };
    check();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [tick]);

  const reloadProfiles = useCallback(async () => {
    setProfiles(await voz.profiles());
  }, []);

  useEffect(() => {
    if (!ready) return;
    // Cada pedaço carrega por conta própria: um motor quebrado não derruba
    // a lista de vozes.
    voz.profiles().then(setProfiles, () => {});
    voz.ttsEngines().then(setTts, () => {});
    voz.translationEngines().then(setTranslation, () => {});
    voz.effectPresets().then(setPresets, () => {});
    // Sem catálogo, todo motor aparece como "licença a conferir".
    voz.catalog().then(setCatalog, () => setCatalog({ models: [] }));
  }, [ready, tick]);

  return {
    health,
    accessError,
    profiles,
    tts,
    translation,
    presets,
    catalog,
    reload: () => setTick((t) => t + 1),
    reloadProfiles,
  };
}
