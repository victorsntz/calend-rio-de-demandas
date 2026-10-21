import type { GlossaryEntry } from "./types";

/**
 * Glossário aplicado do nosso lado, para qualquer tradutor (o do VoiceStudio
 * só vale para o de IA). Cada termo vira um marcador que o tradutor deixa
 * passar intacto (ZQX0, ZQX1… testado no Argos) e volta na forma escolhida.
 * Sem forma escolhida, o termo volta como está: bom para nome de marca.
 * Cada termo vale para todos os idiomas ou só para o seu (`lang`).
 */
export function protectTerms(
  segments: { id: string; text: string }[],
  glossary: GlossaryEntry[],
  targetLang: string,
): { segments: { id: string; text: string }[]; restore: (text: string) => string } {
  const terms = glossary
    .filter((g) => !g.lang || g.lang === targetLang)
    .map((g) => ({ source: g.source.trim(), target: g.target.trim() || g.source.trim() }))
    .filter((g) => g.source)
    // Termo maior primeiro: "Fortunato Estúdio" antes de "Estúdio".
    .sort((a, b) => b.source.length - a.source.length);

  if (terms.length === 0) return { segments, restore: (t) => t };

  const patterns = terms.map(
    (t) =>
      new RegExp(
        `(?<![\\p{L}\\p{N}])${t.source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}])`,
        "giu",
      ),
  );

  return {
    segments: segments.map((s) => ({
      ...s,
      text: patterns.reduce((text, re, i) => text.replace(re, `ZQX${i}`), s.text),
    })),
    restore: (text) =>
      text.replace(/ZQX\s?(\d+)/gi, (m, i: string, at: number) => {
        const target = terms[Number(i)]?.target;
        if (!target) return m;
        // Começo de frase pede maiúscula ("carousel bueno…" → "Carousel bueno…").
        const sentenceStart = /(^|[.!?…]["”»)]?\s+)[¡¿"“«(]*$/.test(text.slice(0, at));
        return sentenceStart ? target[0].toLocaleUpperCase() + target.slice(1) : target;
      }),
  };
}
