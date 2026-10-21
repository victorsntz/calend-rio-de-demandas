"use client";

import { useEffect, useState } from "react";
import { voz, VozError } from "@/lib/voz/client";
import { protectTerms } from "@/lib/voz/glossary";
import { LANGUAGES, languageLabel } from "@/lib/voz/languages";
import type { GlossaryEntry, TranslationEngines } from "@/lib/voz/types";
import { Section, inputClass, primaryButton, secondaryButton } from "./shared";

const GLOSSARY_KEY = "fortunato-voz-glossario";

const STATUS_LABEL: Record<Version["status"], string> = {
  traduzindo: "traduzindo…",
  pronta: "pronta",
  erro: "erro",
  falta_pacote: "falta pacote de idioma",
  narrando: "narrando…",
};

interface Version {
  status: "traduzindo" | "pronta" | "erro" | "falta_pacote" | "narrando";
  text: string;
  error?: string;
}

interface Props {
  translation: TranslationEngines | null;
  narrate: (text: string, language: string, opts: { speed: number; signal: AbortSignal }) => Promise<unknown>;
  voicePicker: React.ReactNode;
  blockedReason?: string;
}

function loadGlossary(): GlossaryEntry[] {
  try {
    const raw = localStorage.getItem(GLOSSARY_KEY);
    return raw ? (JSON.parse(raw) as GlossaryEntry[]) : [];
  } catch {
    return [];
  }
}

/** Parágrafos viram segmentos: o tradutor trabalha melhor em blocos curtos. */
function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t, i) => ({ id: `p${i}`, text: t }));
}

/**
 * Um roteiro, várias versões: traduz para cada idioma escolhido, deixa
 * revisar o texto e narra cada versão com a mesma voz.
 */
export default function TranslatePanel({ translation, narrate, voicePicker, blockedReason }: Props) {
  const [source, setSource] = useState("pt");
  const [text, setText] = useState("");
  const [targets, setTargets] = useState<string[]>(["en", "es"]);
  const [provider, setProvider] = useState("");
  const [glossary, setGlossary] = useState<GlossaryEntry[]>([]);
  const [versions, setVersions] = useState<Record<string, Version>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => setGlossary(loadGlossary()), []);
  useEffect(() => {
    if (provider || !translation) return;
    const active = translation.engines.find((e) => e.id === translation.active && e.ready);
    setProvider(active?.id ?? translation.engines.find((e) => e.ready)?.id ?? "");
  }, [translation, provider]);

  const saveGlossary = (next: GlossaryEntry[]) => {
    setGlossary(next);
    try {
      localStorage.setItem(GLOSSARY_KEY, JSON.stringify(next));
    } catch {
      /* sem storage: o glossário vale até recarregar */
    }
  };

  const patch = (lang: string, v: Partial<Version>) =>
    setVersions((all) => ({ ...all, [lang]: { ...all[lang], ...v } as Version }));

  const translateOne = async (lang: string) => {
    patch(lang, { status: "traduzindo", error: undefined, text: "" });
    try {
      const { segments, restore } = protectTerms(paragraphs(text), glossary, lang);
      const res = await voz.translate({
        segments,
        sourceLang: source,
        targetLang: lang,
        provider: provider || undefined,
      });
      patch(lang, {
        status: "pronta",
        text: res.translated.map((s) => restore(s.text)).join("\n\n"),
      });
    } catch (e) {
      const err = e as VozError;
      patch(lang, {
        status: err.code === "argos_pack_missing" ? "falta_pacote" : "erro",
        error: err.message,
      });
    }
  };

  // Um idioma por vez: tradutor offline e narração disputam o mesmo processador.
  const translateAll = async () => {
    setBusy(true);
    setVersions({});
    for (const lang of targets) await translateOne(lang);
    setBusy(false);
  };

  const installPack = async (lang: string) => {
    patch(lang, { status: "traduzindo", error: "Baixando o pacote de idioma…" });
    try {
      await voz.installArgosPack(source, [lang]);
      await translateOne(lang);
    } catch (e) {
      patch(lang, { status: "erro", error: (e as Error).message });
    }
  };

  const narrateOne = async (lang: string) => {
    const v = versions[lang];
    if (!v?.text.trim()) return;
    patch(lang, { status: "narrando", error: undefined });
    try {
      await narrate(v.text.trim(), lang, { speed: 1, signal: new AbortController().signal });
      patch(lang, { status: "pronta" });
    } catch (e) {
      patch(lang, { status: "pronta", error: (e as Error).message });
    }
  };

  const narrateAll = async () => {
    setBusy(true);
    for (const lang of targets) if (versions[lang]?.text) await narrateOne(lang);
    setBusy(false);
  };

  const ready = Object.values(versions).some((v) => v.text);
  const readyEngines = translation?.engines.filter((e) => e.ready) ?? [];
  const otherEngines = translation?.engines.filter((e) => !e.ready) ?? [];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Section title="Roteiro original">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Cole o roteiro. Cada parágrafo vira um bloco de tradução."
            className={`${inputClass} w-full resize-y leading-relaxed`}
          />
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              <span className="text-muted">Escrito em</span>
              <select
                value={source}
                onChange={(e) => {
                  setSource(e.target.value);
                  setTargets((t) => t.filter((l) => l !== e.target.value));
                }}
                className={inputClass}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-muted">Tradutor</span>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className={inputClass}
              >
                {readyEngines.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.display_name}
                  </option>
                ))}
                {otherEngines.length > 0 && (
                  <optgroup label="Configure no app VoiceStudio">
                    {otherEngines.map((e) => (
                      <option key={e.id} value={e.id} disabled>
                        {e.display_name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </label>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-sm text-muted">Versões em</span>
            {LANGUAGES.filter((l) => l.code !== source).map((l) => {
              const on = targets.includes(l.code);
              return (
                <button
                  key={l.code}
                  onClick={() =>
                    setTargets((t) => (on ? t.filter((x) => x !== l.code) : [...t, l.code]))
                  }
                  className={`rounded-full border px-2.5 py-0.5 text-sm ${
                    on
                      ? "border-line-strong bg-foreground text-background"
                      : "border-line bg-background hover:border-line-strong"
                  }`}
                >
                  {l.flag} {l.label}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={translateAll}
              disabled={busy || !text.trim() || targets.length === 0 || !provider}
              className={primaryButton}
            >
              Traduzir
            </button>
            <button
              onClick={narrateAll}
              disabled={busy || !ready || Boolean(blockedReason)}
              title={blockedReason}
              className={secondaryButton}
            >
              Narrar todas as versões
            </button>
          </div>
        </Section>

        <div className="space-y-4">
          <Section title="Voz das versões">{voicePicker}</Section>
          <Section title="Glossário da marca">
            <p className="text-xs text-muted">
              Termos que o tradutor não pode inventar. Ex.: Carrossel → carousel só no 🇺🇸
              (senão vira “merry-go-round”) e Carrossel → carrusel no 🇪🇸. Lado direito vazio
              mantém o termo como está em todos os idiomas, bom para nome de marca. Singular e
              plural contam como termos diferentes.
            </p>
            <ul className="mt-2 space-y-1.5">
              {glossary.map((g, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <input
                    value={g.source}
                    onChange={(e) =>
                      saveGlossary(glossary.map((x, j) => (j === i ? { ...x, source: e.target.value } : x)))
                    }
                    placeholder="Termo"
                    className={`${inputClass} w-full`}
                  />
                  <span className="text-muted">→</span>
                  <input
                    value={g.target}
                    onChange={(e) =>
                      saveGlossary(glossary.map((x, j) => (j === i ? { ...x, target: e.target.value } : x)))
                    }
                    placeholder="Vira (vazio = igual)"
                    className={`${inputClass} w-full`}
                  />
                  <select
                    value={g.lang ?? ""}
                    onChange={(e) =>
                      saveGlossary(glossary.map((x, j) => (j === i ? { ...x, lang: e.target.value } : x)))
                    }
                    title="Em qual idioma essa troca vale (🌐 = todos)"
                    className={`${inputClass} w-16 shrink-0 px-1`}
                  >
                    <option value="">🌐</option>
                    {LANGUAGES.filter((l) => l.code !== source).map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => saveGlossary(glossary.filter((_, j) => j !== i))}
                    className="px-1 text-muted hover:text-foreground"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => saveGlossary([...glossary, { source: "", target: "" }])}
              className={`${secondaryButton} mt-2`}
            >
              + Termo
            </button>
          </Section>
        </div>
      </div>

      {Object.keys(versions).length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {targets
            .filter((lang) => versions[lang])
            .map((lang) => {
              const v = versions[lang];
              return (
                <Section
                  key={lang}
                  title={languageLabel(lang)}
                  right={<span className="text-xs text-muted">{STATUS_LABEL[v.status]}</span>}
                >
                  {v.status === "traduzindo" ? (
                    <p className="animate-pulse text-sm text-muted">{v.error ?? "Traduzindo…"}</p>
                  ) : (
                    <textarea
                      value={v.text}
                      onChange={(e) => patch(lang, { text: e.target.value })}
                      rows={6}
                      className={`${inputClass} w-full resize-y leading-relaxed`}
                    />
                  )}
                  {v.error && v.status !== "traduzindo" && (
                    <p className="mt-2 text-sm">⚠ {v.error}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {v.status === "falta_pacote" && (
                      <button onClick={() => installPack(lang)} className={secondaryButton}>
                        Baixar pacote {source} → {lang}
                      </button>
                    )}
                    {v.text && (
                      <button
                        onClick={() => narrateOne(lang)}
                        disabled={busy || v.status === "narrando" || Boolean(blockedReason)}
                        className={secondaryButton}
                      >
                        {v.status === "narrando" ? "Narrando…" : "Narrar esta versão"}
                      </button>
                    )}
                  </div>
                </Section>
              );
            })}
        </div>
      )}
    </div>
  );
}
