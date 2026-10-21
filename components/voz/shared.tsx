"use client";

import { useEffect, useState } from "react";
import { engineLicense } from "@/lib/voz/client";
import { DESIGN_TAGS, designInstruct, languageLabel } from "@/lib/voz/languages";
import type {
  Catalog,
  EffectPreset,
  GenerateInput,
  LicenseCategory,
  Take,
  TtsEngine,
  TtsEngines,
  VoiceProfile,
} from "@/lib/voz/types";

export const inputClass = "rounded border border-line bg-card px-2 py-1.5 text-sm";
export const primaryButton =
  "rounded-full border border-line-strong bg-foreground px-4 py-1.5 text-sm text-background hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40";
export const secondaryButton =
  "rounded border border-line bg-card px-3 py-1.5 text-sm hover:border-line-strong disabled:cursor-not-allowed disabled:opacity-40";

export function Section({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-line bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs uppercase tracking-widest text-muted">{title}</p>
        {right}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

const LICENSE_COPY: Record<LicenseCategory, { label: string; hint: string; tone: string }> = {
  commercial: {
    label: "✓ Uso comercial liberado",
    hint: "A licença do modelo permite usar o áudio em trabalho de cliente.",
    tone: "border-line bg-background",
  },
  noncommercial: {
    label: "⚠ Só uso não comercial",
    hint: "A licença do modelo proíbe uso comercial. Serve para testar, não para entregar a cliente.",
    tone: "border-line-strong bg-foreground text-background",
  },
  restricted: {
    label: "? Licença com restrições",
    hint: "Leia a licença do modelo no Catálogo do VoiceStudio antes de usar com cliente.",
    tone: "border-line-strong bg-background",
  },
  unknown: {
    label: "? Licença a conferir",
    hint: "O catálogo não declara a licença desse motor. Confira antes de usar com cliente.",
    tone: "border-line-strong bg-background",
  },
};

export function LicenseBadge({ category }: { category: LicenseCategory }) {
  const copy = LICENSE_COPY[category];
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs ${copy.tone}`}
      title={copy.hint}
    >
      {copy.label}
    </span>
  );
}

/**
 * Motor sugerido: instalado, com licença comercial e, de preferência, que
 * clona voz (os que não clonam costumam falar um idioma só). Sem nenhum
 * comercial, o ativo no VoiceStudio, e o selo avisa o que isso significa.
 */
export function pickDefaultEngine(tts: TtsEngines | null, catalog: Catalog | null): string {
  if (!tts) return "";
  const commercial = tts.backends.filter(
    (b) => b.available && engineLicense(catalog, b.id) === "commercial",
  );
  return (commercial.find((b) => b.supports_cloning) ?? commercial[0])?.id ?? tts.active;
}

export function EngineBar({
  tts,
  catalog,
  engineId,
  onEngine,
  presets,
  preset,
  onPreset,
}: {
  tts: TtsEngines | null;
  catalog: Catalog | null;
  engineId: string;
  onEngine: (id: string) => void;
  presets: EffectPreset[];
  preset: string;
  onPreset: (id: string) => void;
}) {
  const engine = tts?.backends.find((b) => b.id === engineId);
  const available = tts?.backends.filter((b) => b.available) ?? [];
  const missing = tts?.backends.filter((b) => !b.available) ?? [];

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-line bg-card p-3 text-sm shadow-sm">
      <label className="flex min-w-0 max-w-full items-center gap-2">
        <span className="text-muted">Motor</span>
        <select
          value={engineId}
          onChange={(e) => onEngine(e.target.value)}
          className={`${inputClass} min-w-0 max-w-full`}
        >
          {available.map((b) => (
            <option key={b.id} value={b.id}>
              {b.display_name}
            </option>
          ))}
          {missing.length > 0 && (
            <optgroup label="Não instalados (instale no app VoiceStudio)">
              {missing.map((b) => (
                <option key={b.id} value={b.id} disabled>
                  {b.display_name}
                </option>
              ))}
            </optgroup>
          )}
        </select>
      </label>
      {engine && <LicenseBadge category={engineLicense(catalog, engine.id)} />}
      {presets.length > 0 && (
        <label className="flex items-center gap-2">
          <span className="text-muted">Acabamento</span>
          <select
            value={preset}
            onChange={(e) => onPreset(e.target.value)}
            className={inputClass}
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id} title={p.description}>
                {p.icon} {p.label}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}

export type VoiceChoice =
  | { mode: "default" }
  | { mode: "profile"; profileId: string }
  | { mode: "design"; picks: Record<string, string>; freeform: string }
  | { mode: "clone"; file: File | null; refText: string };

/**
 * Traduz a escolha de voz para os campos do /generate. `missing` explica o
 * que falta para a escolha valer (e trava o botão de narrar).
 */
export function voiceRequest(
  choice: VoiceChoice,
  profiles: VoiceProfile[],
  engine: TtsEngine | undefined,
): { params: Partial<GenerateInput>; label: string; missing?: string } {
  switch (choice.mode) {
    case "profile": {
      const p = profiles.find((v) => v.id === choice.profileId);
      if (!p) return { params: {}, label: "", missing: "Escolha uma voz salva." };
      return { params: { profileId: p.id }, label: p.name };
    }
    case "design": {
      const instruct =
        engine?.instruct_vocabulary === "freeform"
          ? choice.freeform.trim()
          : designInstruct(choice.picks);
      if (!instruct) return { params: {}, label: "", missing: "Descreva a voz que você quer." };
      return { params: { instruct }, label: `Voz desenhada (${instruct})` };
    }
    case "clone":
      if (!choice.file) return { params: {}, label: "", missing: "Envie um áudio de referência." };
      return {
        params: { refAudio: choice.file, refText: choice.refText.trim() || undefined },
        label: `Clone de ${choice.file.name}`,
      };
    default:
      return { params: {}, label: "Voz padrão do motor" };
  }
}

export function VoicePicker({
  engine,
  profiles,
  choice,
  onChange,
}: {
  engine: TtsEngine | undefined;
  profiles: VoiceProfile[];
  choice: VoiceChoice;
  onChange: (c: VoiceChoice) => void;
}) {
  const canClone = engine?.supports_cloning ?? false;
  const canDesign = engine?.supports_voice_design ?? false;
  const modes: [VoiceChoice["mode"], string, boolean][] = [
    ["profile", "Voz salva", canClone],
    ["design", "Desenhar voz", canDesign],
    ["clone", "Clonar na hora", canClone],
    ["default", "Voz padrão", true],
  ];

  // Trocar para um motor que não suporta o modo atual cai na voz padrão.
  useEffect(() => {
    if (
      (choice.mode === "design" && !canDesign) ||
      ((choice.mode === "profile" || choice.mode === "clone") && !canClone)
    ) {
      onChange({ mode: "default" });
    }
  }, [choice.mode, canClone, canDesign, onChange]);

  const select = (mode: VoiceChoice["mode"]) => {
    if (mode === choice.mode) return;
    if (mode === "profile") onChange({ mode, profileId: profiles[0]?.id ?? "" });
    else if (mode === "design") onChange({ mode, picks: {}, freeform: "" });
    else if (mode === "clone") onChange({ mode, file: null, refText: "" });
    else onChange({ mode: "default" });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {modes.map(([mode, label, enabled]) => (
          <button
            key={mode}
            type="button"
            disabled={!enabled}
            onClick={() => select(mode)}
            title={enabled ? undefined : "Esse motor não faz isso"}
            className={`rounded-full border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-35 ${
              choice.mode === mode
                ? "border-line-strong bg-foreground text-background"
                : "border-line bg-background hover:border-line-strong"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3">
        {choice.mode === "profile" &&
          (profiles.length === 0 ? (
            <p className="text-sm text-muted">Nenhuma voz salva ainda. Crie uma na aba Vozes.</p>
          ) : (
            <select
              value={choice.profileId}
              onChange={(e) => onChange({ mode: "profile", profileId: e.target.value })}
              className={`${inputClass} w-full max-w-sm`}
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {p.is_demo ? " (demo)" : ""}
                </option>
              ))}
            </select>
          ))}

        {choice.mode === "design" &&
          (engine?.instruct_vocabulary === "freeform" ? (
            <textarea
              value={choice.freeform}
              onChange={(e) => onChange({ ...choice, freeform: e.target.value })}
              rows={2}
              placeholder="Ex.: voz feminina calorosa, ritmo calmo, tom de conversa"
              className={`${inputClass} w-full`}
            />
          ) : (
            <div className="space-y-2">
              {DESIGN_TAGS.map((tag) => (
                <div key={tag.key} className="flex flex-wrap items-center gap-1.5">
                  <span className="w-16 text-xs text-muted">{tag.label}</span>
                  {tag.options.map((o) => {
                    const on = choice.picks[tag.key] === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() =>
                          onChange({
                            ...choice,
                            picks: { ...choice.picks, [tag.key]: on ? "" : o.value },
                          })
                        }
                        className={`rounded-full border px-2.5 py-0.5 text-xs ${
                          on
                            ? "border-line-strong bg-foreground text-background"
                            : "border-line bg-background hover:border-line-strong"
                        }`}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}

        {choice.mode === "clone" && (
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-sm">
              <span className="text-muted">
                Áudio de referência (até {engine?.max_ref_seconds ?? 20} s, uma pessoa, sem música)
              </span>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => onChange({ ...choice, file: e.target.files?.[0] ?? null })}
                className="mt-1 block w-full text-sm"
              />
            </label>
            <label className="text-sm">
              <span className="text-muted">O que é falado no áudio (opcional, melhora o clone)</span>
              <input
                value={choice.refText}
                onChange={(e) => onChange({ ...choice, refText: e.target.value })}
                className={`${inputClass} mt-1 w-full`}
              />
            </label>
          </div>
        )}

        {choice.mode === "default" && (
          <p className="text-sm text-muted">Usa a voz que vem com o motor.</p>
        )}
      </div>
    </div>
  );
}

/** Cronômetro para a espera da narração (em CPU leva um tempinho). */
export function useElapsed(running: boolean): number {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    const start = Date.now();
    setSeconds(0);
    const id = setInterval(() => setSeconds(Math.floor((Date.now() - start) / 1000)), 500);
    return () => clearInterval(id);
  }, [running]);
  return seconds;
}

export function takeFileName(text: string, language: string): string {
  const slug = text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 5)
    .join("-");
  const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
  return `${slug || "narracao"}-${language}-${stamp}.wav`;
}

export function TakeCard({ take, onRemove }: { take: Take; onRemove: () => void }) {
  return (
    <li className="rise-in rounded border border-line bg-background p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <span>
          {languageLabel(take.language)} · <strong>{take.voiceLabel}</strong>
        </span>
        <span className="text-xs text-muted">
          {take.duration.toFixed(1)} s de áudio · gerado em {take.genTime.toFixed(1)} s ·{" "}
          {take.engine}
        </span>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-muted italic">“{take.text}”</p>
      {take.droppedChunks > 0 && (
        <p className="mt-1 text-sm">
          ⚠ O motor pulou {take.droppedChunks} trecho(s) do roteiro. Escute antes de entregar.
        </p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <audio controls src={take.url} className="h-9 min-w-0 flex-1" />
        <a href={take.url} download={take.fileName} className={secondaryButton}>
          Baixar WAV
        </a>
        <button onClick={onRemove} className="px-2 text-sm text-muted hover:text-foreground">
          ✕
        </button>
      </div>
    </li>
  );
}
