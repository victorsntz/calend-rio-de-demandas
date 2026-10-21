/**
 * Idiomas oferecidos no painel. O VoiceStudio aceita o código ISO 639-1; a
 * lista é curta de propósito (os idiomas que os motores comerciais cobrem).
 */
export const LANGUAGES: { code: string; label: string; flag: string }[] = [
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "Inglês", flag: "🇺🇸" },
  { code: "es", label: "Espanhol", flag: "🇪🇸" },
  { code: "fr", label: "Francês", flag: "🇫🇷" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "de", label: "Alemão", flag: "🇩🇪" },
  { code: "ja", label: "Japonês", flag: "🇯🇵" },
  { code: "ko", label: "Coreano", flag: "🇰🇷" },
  { code: "zh", label: "Chinês", flag: "🇨🇳" },
  { code: "ru", label: "Russo", flag: "🇷🇺" },
  { code: "ar", label: "Árabe", flag: "🇸🇦" },
  { code: "tr", label: "Turco", flag: "🇹🇷" },
  { code: "pl", label: "Polonês", flag: "🇵🇱" },
];

export function languageLabel(code: string): string {
  const lang = LANGUAGES.find((l) => l.code === code);
  return lang ? `${lang.flag} ${lang.label}` : code;
}

/**
 * Desenho de voz por etiquetas (motores com instruct_vocabulary "tags").
 * O valor vai em inglês, como o modelo espera; o rótulo é nosso.
 */
export const DESIGN_TAGS: {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}[] = [
  {
    key: "gender",
    label: "Gênero",
    options: [
      { value: "female", label: "Feminina" },
      { value: "male", label: "Masculina" },
    ],
  },
  {
    key: "age",
    label: "Idade",
    options: [
      { value: "child", label: "Criança" },
      { value: "teenager", label: "Adolescente" },
      { value: "young adult", label: "Jovem adulta" },
      { value: "middle-aged", label: "Meia-idade" },
      { value: "elderly", label: "Idosa" },
    ],
  },
  {
    key: "pitch",
    label: "Tom",
    options: [
      { value: "very low pitch", label: "Bem grave" },
      { value: "low pitch", label: "Grave" },
      { value: "moderate pitch", label: "Médio" },
      { value: "high pitch", label: "Agudo" },
      { value: "very high pitch", label: "Bem agudo" },
    ],
  },
  {
    key: "style",
    label: "Estilo",
    options: [{ value: "whisper", label: "Sussurrada" }],
  },
];

/** Monta o instruct ("female, young adult, low pitch") a partir das escolhas. */
export function designInstruct(picks: Record<string, string>): string {
  return DESIGN_TAGS.map((t) => picks[t.key])
    .filter(Boolean)
    .join(", ");
}

/** Estimativa grosseira de duração da fala: ~15 caracteres por segundo. */
export function estimateSeconds(text: string): number {
  return Math.round(text.trim().length / 15);
}
