import type { Metadata } from "next";
import VoiceStudio from "@/components/voz/VoiceStudio";

export const metadata: Metadata = {
  title: "Fortunato Estúdio — Estúdio de Voz",
  description: "Narração, versões traduzidas e banco de vozes do estúdio.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <VoiceStudio calendarHref="/" />;
}
