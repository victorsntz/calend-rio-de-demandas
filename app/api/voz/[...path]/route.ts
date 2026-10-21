import { proxyToVoiceStudio } from "@/lib/voz/server";

export const runtime = "nodejs";
// Narrar em CPU pode levar minutos. O teto real depende da hospedagem
// (na Vercel, do plano); rodando local não há limite.
export const maxDuration = 300;

interface Ctx {
  params: Promise<{ path: string[] }>;
}

export async function GET(req: Request, { params }: Ctx) {
  return proxyToVoiceStudio(req, (await params).path);
}

export async function POST(req: Request, { params }: Ctx) {
  return proxyToVoiceStudio(req, (await params).path);
}

export async function DELETE(req: Request, { params }: Ctx) {
  return proxyToVoiceStudio(req, (await params).path);
}
