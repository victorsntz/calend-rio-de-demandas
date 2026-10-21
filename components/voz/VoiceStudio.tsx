"use client";

import { useCallback, useEffect, useState } from "react";
import { readSenha, saveSenha, voz } from "@/lib/voz/client";
import { useVoz } from "@/lib/voz/useVoz";
import type { Take } from "@/lib/voz/types";
import NarratePanel from "./NarratePanel";
import TranslatePanel from "./TranslatePanel";
import VoicesPanel from "./VoicesPanel";
import {
  EngineBar,
  TakeCard,
  VoicePicker,
  inputClass,
  pickDefaultEngine,
  primaryButton,
  takeFileName,
  voiceRequest,
  type VoiceChoice,
} from "./shared";

type Tab = "narrar" | "traduzir" | "vozes";

const PREFS_KEY = "fortunato-voz-prefs";

function loadPrefs(): { engineId?: string; preset?: string } {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/**
 * Estúdio de Voz: narração, versões traduzidas e banco de vozes da agência,
 * em cima do VoiceStudio rodando na máquina (ou num servidor do estúdio).
 */
export default function VoiceStudio({ calendarHref }: { calendarHref?: string }) {
  const data = useVoz();
  const [tab, setTab] = useState<Tab>("narrar");
  const [engineId, setEngineId] = useState("");
  const [preset, setPreset] = useState("broadcast");
  const [choice, setChoice] = useState<VoiceChoice>({ mode: "default" });
  const [takes, setTakes] = useState<Take[]>([]);

  // Motor: o último usado (se ainda existir) ou o sugerido pela licença.
  useEffect(() => {
    if (engineId || !data.tts || !data.catalog) return;
    const prefs = loadPrefs();
    const saved = data.tts.backends.find((b) => b.id === prefs.engineId && b.available);
    setEngineId(saved?.id ?? pickDefaultEngine(data.tts, data.catalog));
    if (prefs.preset) setPreset(prefs.preset);
  }, [data.tts, data.catalog, engineId]);

  useEffect(() => {
    if (!engineId) return;
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ engineId, preset }));
    } catch {
      /* preferência é conveniência; sem storage, segue o jogo */
    }
  }, [engineId, preset]);

  const engine = data.tts?.backends.find((b) => b.id === engineId);
  const voice = voiceRequest(choice, data.profiles, engine);

  const narrate = useCallback(
    async (text: string, language: string, opts: { speed: number; signal: AbortSignal }) => {
      const audio = await voz.generate(
        { text, language, engine: engineId || undefined, effectPreset: preset, speed: opts.speed, ...voice.params },
        opts.signal,
      );
      const take: Take = {
        id: audio.audioId,
        url: URL.createObjectURL(audio.blob),
        fileName: takeFileName(text, language),
        text,
        language,
        voiceLabel: voice.label,
        engine: engine?.display_name ?? engineId,
        duration: audio.duration,
        genTime: audio.genTime,
        droppedChunks: audio.droppedChunks,
        createdAt: Date.now(),
      };
      setTakes((all) => [take, ...all]);
      return take;
    },
    [engineId, preset, voice.params, voice.label, engine],
  );

  const removeTake = (id: string) =>
    setTakes((all) => {
      const gone = all.find((t) => t.id === id);
      if (gone) URL.revokeObjectURL(gone.url);
      return all.filter((t) => t.id !== id);
    });

  const picker = (
    <VoicePicker engine={engine} profiles={data.profiles} choice={choice} onChange={setChoice} />
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-8">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-line-strong pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">Fortunato Estúdio</p>
          <h1 className="text-4xl">Estúdio de Voz</h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <StatusPill status={data.health?.status} label={data.health?.label} device={data.health?.device} />
          {calendarHref && (
            <a
              href={calendarHref}
              className="rounded border border-line bg-card px-3 py-1.5 hover:border-line-strong"
            >
              ← Calendário
            </a>
          )}
        </div>
      </header>

      {data.accessError?.code === "senha" ? (
        <SenhaGate message={data.accessError.message} onSaved={data.reload} />
      ) : data.accessError ? (
        <section className="rise-in mx-auto mt-8 max-w-xl rounded-lg border border-line-strong bg-card p-5 shadow-sm">
          <h2 className="text-2xl">Configuração pendente</h2>
          <p className="mt-1 text-sm">{data.accessError.message}</p>
          <p className="mt-2 text-xs text-muted">Veja “VoiceStudio num servidor” no README.</p>
        </section>
      ) : data.health?.status === "offline" ? (
        <OfflineCard />
      ) : data.health?.status !== "ok" ? (
        <p className="mt-10 animate-pulse text-center text-muted">
          {data.health?.label ? `O VoiceStudio está ligando: ${data.health.label}` : "Procurando o VoiceStudio…"}
        </p>
      ) : (
        <>
          <div className="mt-5">
            <EngineBar
              tts={data.tts}
              catalog={data.catalog}
              engineId={engineId}
              onEngine={setEngineId}
              presets={data.presets}
              preset={preset}
              onPreset={setPreset}
            />
          </div>

          <nav className="mt-6 flex gap-1 border-b border-line">
            {(
              [
                ["narrar", "Narrar"],
                ["traduzir", "Traduzir e narrar"],
                ["vozes", "Vozes"],
              ] as [Tab, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`-mb-px rounded-t border-x border-t px-4 py-2 ${
                  tab === key
                    ? "border-line bg-card"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-5">
            {tab === "narrar" && (
              <NarratePanel narrate={narrate} voicePicker={picker} blockedReason={voice.missing} />
            )}
            {tab === "traduzir" && (
              <TranslatePanel
                translation={data.translation}
                narrate={narrate}
                voicePicker={picker}
                blockedReason={voice.missing}
              />
            )}
            {tab === "vozes" && (
              <VoicesPanel
                profiles={data.profiles}
                engine={engine}
                onChanged={data.reloadProfiles}
                onUse={(profileId) => {
                  setChoice({ mode: "profile", profileId });
                  setTab("narrar");
                }}
              />
            )}
          </div>

          {takes.length > 0 && (
            <section className="mt-8">
              <div className="flex items-baseline justify-between gap-2 border-b border-line pb-2">
                <h2 className="text-2xl">Takes desta sessão</h2>
                <span className="text-xs text-muted">
                  Ficam só nesta aba do navegador. Baixe o que for usar.
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {takes.map((t) => (
                  <TakeCard key={t.id} take={t} onRemove={() => removeTake(t.id)} />
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <footer className="mt-14 border-t border-line pt-4 text-center text-xs text-muted">
        Fortunato Estúdio · as vozes rodam no VoiceStudio, na nossa máquina. Todo áudio sai com
        marca d&apos;água inaudível de voz gerada por IA.
      </footer>
    </main>
  );
}

function StatusPill({ status, label, device }: { status?: string; label?: string; device?: string }) {
  const copy =
    status === "ok"
      ? `● VoiceStudio pronto${device ? ` (${device === "cpu" ? "processador" : device})` : ""}`
      : status === "starting"
        ? `◌ Ligando${label ? `: ${label}` : ""}`
        : status === "offline"
          ? "○ VoiceStudio fora do ar"
          : "◌ Conectando…";
  return <span className="text-muted">{copy}</span>;
}

function OfflineCard() {
  return (
    <section className="rise-in mx-auto mt-8 max-w-2xl rounded-lg border border-line bg-card p-5 shadow-sm">
      <p className="text-xs uppercase tracking-widest text-muted">Antes de narrar</p>
      <h2 className="mt-1 text-2xl">O VoiceStudio não está rodando</h2>
      <p className="mt-2 text-sm">
        Este painel é o volante. O motor é o VoiceStudio, um app gratuito que roda as vozes no
        próprio computador. Liga ele uma vez e esta página acha sozinha.
      </p>
      <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm">
        <li>
          Instale o VoiceStudio (só na primeira vez). No Mac ou Linux, no Terminal:
          <code className="mt-1 block rounded border border-line bg-background px-2 py-1.5 font-mono text-xs">
            curl -fsSL https://voicestudio.sh/install | sh
          </code>
          No Windows, no PowerShell:
          <code className="mt-1 block rounded border border-line bg-background px-2 py-1.5 font-mono text-xs">
            irm https://voicestudio.sh/install | iex
          </code>
        </li>
        <li>Abra o app VoiceStudio e espere ele terminar de ligar.</li>
        <li>
          Em <strong>Catálogo de modelos</strong>, instale um motor com licença comercial:
          MOSS-TTS-Nano (leve, roda sem placa de vídeo) ou VoxCPM2 (mais rico, pede GPU ou Mac
          M1 em diante).
        </li>
      </ol>
      <p className="mt-4 text-xs text-muted">
        Tentando de novo a cada 5 segundos. Se o VoiceStudio roda em outro computador ou num
        servidor, configure VOICESTUDIO_URL (veja o README).
      </p>
    </section>
  );
}

function SenhaGate({ message, onSaved }: { message: string; onSaved: () => void }) {
  const [senha, setSenha] = useState(readSenha());
  return (
    <section className="rise-in mx-auto mt-8 max-w-md rounded-lg border border-line bg-card p-5 shadow-sm">
      <h2 className="text-2xl">Senha do Estúdio de Voz</h2>
      <p className="mt-1 text-sm text-muted">
        {readSenha() ? message : "Este painel pede senha. Quem cuida do estúdio sabe qual é."}
      </p>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          saveSenha(senha);
          onSaved();
        }}
      >
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className={`${inputClass} flex-1`}
          autoFocus
        />
        <button className={primaryButton}>Entrar</button>
      </form>
    </section>
  );
}
