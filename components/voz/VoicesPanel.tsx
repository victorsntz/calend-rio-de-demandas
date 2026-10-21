"use client";

import { useState } from "react";
import { voz } from "@/lib/voz/client";
import { LANGUAGES } from "@/lib/voz/languages";
import type { TtsEngine, VoiceProfile } from "@/lib/voz/types";
import { Section, inputClass, primaryButton, secondaryButton } from "./shared";

interface Props {
  profiles: VoiceProfile[];
  engine: TtsEngine | undefined;
  onChanged: () => Promise<void>;
  onUse: (profileId: string) => void;
}

/** O banco de vozes da agência: ouvir, usar, clonar uma nova, apagar. */
export default function VoicesPanel({ profiles, engine, onChanged, onUse }: Props) {
  const [preview, setPreview] = useState<{ id: string; url: string } | null>(null);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [refText, setRefText] = useState("");
  const [language, setLanguage] = useState("pt");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const listen = async (id: string) => {
    try {
      if (preview) URL.revokeObjectURL(preview.url);
      setPreview({ id, url: await voz.profileAudio(id) });
    } catch (e) {
      setMessage((e as Error).message);
    }
  };

  const remove = async (p: VoiceProfile) => {
    if (!confirm(`Apagar a voz "${p.name}"? Não tem volta.`)) return;
    try {
      await voz.deleteVoice(p.id);
      await onChanged();
    } catch (e) {
      setMessage((e as Error).message);
    }
  };

  const create = async () => {
    if (!file) return;
    setBusy(true);
    setMessage(null);
    try {
      await voz.createVoice({ name: name.trim(), refAudio: file, refText: refText.trim(), language });
      await onChanged();
      setName("");
      setFile(null);
      setRefText("");
      setConsent(false);
      setMessage(`Voz "${name.trim()}" salva. Já aparece em Voz salva.`);
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const canCreate = name.trim() && file && consent && !busy;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <Section title={`Vozes salvas (${profiles.length})`}>
        {profiles.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma voz ainda. Clone a primeira ao lado.</p>
        ) : (
          <ul className="space-y-2">
            {profiles.map((p) => (
              <li key={p.id} className="rounded border border-line bg-background p-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-sm">{p.name}</strong>
                  <span className="rounded-full border border-line px-1.5 text-[10px] uppercase tracking-wider text-muted">
                    {p.kind === "design" ? "desenhada" : "clone"}
                  </span>
                  {p.is_demo ? (
                    <span className="rounded-full border border-line px-1.5 text-[10px] uppercase tracking-wider text-muted">
                      demo
                    </span>
                  ) : null}
                  <div className="ml-auto flex gap-1.5">
                    <button onClick={() => listen(p.id)} className={secondaryButton}>
                      Ouvir
                    </button>
                    <button
                      onClick={() => onUse(p.id)}
                      disabled={!engine?.supports_cloning}
                      title={engine?.supports_cloning ? undefined : "O motor escolhido não usa vozes salvas"}
                      className={secondaryButton}
                    >
                      Usar
                    </button>
                    <button
                      onClick={() => remove(p)}
                      className="px-2 text-sm text-muted hover:text-foreground"
                      title="Apagar voz"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                {p.description && <p className="mt-1 text-xs text-muted">{p.description}</p>}
                {preview?.id === p.id && (
                  <audio controls autoPlay src={preview.url} className="mt-2 h-9 w-full" />
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Clonar uma voz nova">
        <div className="space-y-2.5 text-sm">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome (ex.: Julia Lazari, narração institucional)"
            className={`${inputClass} w-full`}
          />
          <label className="block">
            <span className="text-muted">
              Gravação de referência: 10 a 20 s, uma pessoa só, sem música, sem eco.
            </span>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 block w-full"
            />
          </label>
          <input
            value={refText}
            onChange={(e) => setRefText(e.target.value)}
            placeholder="O que é falado na gravação (opcional)"
            className={`${inputClass} w-full`}
          />
          <label className="flex items-center gap-2">
            <span className="text-muted">Idioma da gravação</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className={inputClass}>
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-start gap-2 rounded border border-line bg-background p-2.5">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1"
            />
            <span>
              Tenho autorização por escrito da pessoa dona desta voz para cloná-la e usar nos
              conteúdos combinados.
            </span>
          </label>
          <button onClick={create} disabled={!canCreate} className={primaryButton}>
            {busy ? "Salvando…" : "Salvar voz"}
          </button>
          {message && <p>{message}</p>}
        </div>
      </Section>
    </div>
  );
}
