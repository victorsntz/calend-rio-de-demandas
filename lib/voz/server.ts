/**
 * Ponte servidor → VoiceStudio. O navegador nunca fala direto com a porta
 * 3900: o VoiceStudio recusa POST vindo de página de outro site, e a chave
 * da API (quando o VoiceStudio roda num servidor) fica só aqui no servidor.
 *
 * Variáveis de ambiente:
 *  - VOICESTUDIO_URL      onde o VoiceStudio responde (padrão 127.0.0.1:3900)
 *  - VOICESTUDIO_API_KEY  enviada como Bearer (a OMNIVOICE_API_KEY do servidor)
 *  - VOZ_SENHA            senha do painel; obrigatória se a URL não for local
 */
import { createHash, timingSafeEqual } from "node:crypto";

const DEFAULT_URL = "http://127.0.0.1:3900";

/**
 * Só as rotas que o painel usa. Configurações, instaladores e rotas de
 * sistema do VoiceStudio ficam de fora: a ponte não vira porta aberta.
 */
const ALLOWED: { method: string; pattern: RegExp }[] = [
  { method: "GET", pattern: /^health$/ },
  { method: "GET", pattern: /^profiles$/ },
  { method: "GET", pattern: /^profiles\/[\w-]+\/audio$/ },
  { method: "POST", pattern: /^profiles$/ },
  { method: "DELETE", pattern: /^profiles\/[\w-]+$/ },
  { method: "GET", pattern: /^engines\/(tts|translation|effects\/presets)$/ },
  { method: "GET", pattern: /^models$/ },
  { method: "POST", pattern: /^generate$/ },
  { method: "POST", pattern: /^dub\/translate$/ },
  { method: "POST", pattern: /^engines\/translation\/argos\/packs\/install$/ },
];

/** Cabeçalhos da resposta que o painel lê (metadados do take vêm aqui). */
const PASS_HEADERS = /^(content-type|content-disposition|x-audio-[\w-]+|x-gen-time|x-seed|x-omnivoice-[\w-]+)$/;

const LOOPBACK = new Set(["127.0.0.1", "localhost", "[::1]", "::1"]);

function jsonError(status: number, error: string, code: string) {
  return Response.json({ error, code }, { status });
}

function sameSecret(given: string, expected: string): boolean {
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function voiceStudioBase(): URL {
  const raw = process.env.VOICESTUDIO_URL?.trim() || DEFAULT_URL;
  return new URL(raw.endsWith("/") ? raw : `${raw}/`);
}

export async function proxyToVoiceStudio(req: Request, segments: string[]): Promise<Response> {
  const path = segments.map(encodeURIComponent).join("/");
  if (!ALLOWED.some((r) => r.method === req.method && r.pattern.test(path))) {
    return jsonError(404, "Essa rota do VoiceStudio não passa pelo painel.", "rota_bloqueada");
  }

  let base: URL;
  try {
    base = voiceStudioBase();
  } catch {
    return jsonError(500, "VOICESTUDIO_URL não é um endereço válido.", "url_invalida");
  }
  const senha = process.env.VOZ_SENHA;
  if (!LOOPBACK.has(base.hostname) && !senha) {
    return jsonError(
      503,
      "O VoiceStudio está num servidor remoto. Defina VOZ_SENHA antes de liberar o painel.",
      "sem_senha",
    );
  }
  if (senha && !sameSecret(req.headers.get("x-voz-senha") ?? "", senha)) {
    return jsonError(401, "Senha do Estúdio de Voz incorreta.", "senha");
  }

  const target = new URL(path, base);
  target.search = new URL(req.url).search;

  // Só o essencial segue adiante. Origin, Referer e cookies do navegador
  // ficam para trás: o VoiceStudio enxerga um cliente local comum.
  const headers = new Headers();
  for (const name of ["content-type", "accept"]) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }
  const apiKey = process.env.VOICESTUDIO_API_KEY;
  if (apiKey) headers.set("authorization", `Bearer ${apiKey}`);

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers,
      body: req.method === "GET" || req.method === "DELETE" ? undefined : await req.arrayBuffer(),
      cache: "no-store",
      // "Cancelar" no painel derruba também a espera aqui.
      signal: req.signal,
    });
  } catch {
    return jsonError(502, `Não encontrei o VoiceStudio em ${base.origin}.`, "offline");
  }

  const out = new Headers({ "cache-control": "no-store" });
  upstream.headers.forEach((value, name) => {
    if (PASS_HEADERS.test(name)) out.set(name, value);
  });
  return new Response(upstream.body, { status: upstream.status, headers: out });
}
