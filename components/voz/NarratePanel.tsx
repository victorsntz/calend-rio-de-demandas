"use client";

import { useRef, useState } from "react";
import { LANGUAGES, estimateSeconds } from "@/lib/voz/languages";
import { Section, inputClass, primaryButton, secondaryButton, useElapsed } from "./shared";

interface Props {
  /** Narra com a voz/motor escolhidos no topo; lança erro em português. */
  narrate: (text: string, language: string, opts: { speed: number; signal: AbortSignal }) => Promise<unknown>;
  voicePicker: React.ReactNode;
  blockedReason?: string;
}

/** Roteiro → voz → take. O caminho mais curto até um áudio pronto. */
export default function NarratePanel({ narrate, voicePicker, blockedReason }: Props) {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("pt");
  const [speed, setSpeed] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);
  const elapsed = useElapsed(busy);

  const run = async () => {
    abort.current = new AbortController();
    setBusy(true);
    setError(null);
    try {
      await narrate(text.trim(), language, { speed, signal: abort.current.signal });
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const seconds = estimateSeconds(text);
  const disabledReason = !text.trim() ? "Escreva o roteiro." : blockedReason;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
      <Section
        title="Roteiro"
        right={
          <span className="text-xs text-muted">
            {text.length} caracteres{seconds > 0 && ` · ~${seconds} s de fala`}
          </span>
        }
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Cole aqui o texto do carrossel, do reels ou do anúncio. Pontuação manda no ritmo: vírgula respira, ponto final pausa."
          className={`${inputClass} w-full resize-y leading-relaxed`}
        />
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-muted">Idioma</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={inputClass}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2" title="Alguns motores ignoram a velocidade">
            <span className="text-muted">Velocidade</span>
            <input
              type="range"
              min={0.7}
              max={1.3}
              step={0.05}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="accent-foreground"
            />
            <span className="w-10 tabular-nums">{speed.toFixed(2)}×</span>
          </label>
        </div>
      </Section>

      <Section title="Voz">
        {voicePicker}
        <div className="mt-4 border-t border-line pt-3">
          {busy ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="animate-pulse">🎙️ Narrando… {elapsed} s</span>
              <button onClick={() => abort.current?.abort()} className={secondaryButton}>
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={run}
              disabled={Boolean(disabledReason)}
              title={disabledReason}
              className={primaryButton}
            >
              🎙️ Gerar narração
            </button>
          )}
          {!busy && disabledReason && text.trim() && (
            <p className="mt-2 text-sm text-muted">{disabledReason}</p>
          )}
          {error && <p className="mt-2 text-sm">⚠ {error}</p>}
          {busy && elapsed > 20 && (
            <p className="mt-2 text-xs text-muted">
              Sem placa de vídeo o motor roda no processador e demora mais. O primeiro take
              também baixa o modelo.
            </p>
          )}
        </div>
      </Section>
    </div>
  );
}
