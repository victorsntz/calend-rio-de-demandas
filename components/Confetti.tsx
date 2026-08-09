"use client";

import { useEffect, useMemo } from "react";

interface Props {
  reward: string;
  onDone: () => void;
}

const COLORS = ["#8c5a3f", "#5f7161", "#a0616a", "#4f6d8f", "#b07d4e", "#111111"];

/** Chuva de confetes + cartão do prêmio quando a meta da semana é batida. */
export default function Confetti({ reward, onDone }: Props) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        background: COLORS[i % COLORS.length],
        delay: `${((i * 13) % 20) / 10}s`,
        duration: `${2.4 + ((i * 7) % 14) / 10}s`,
        rotate: `${(i * 53) % 360}deg`,
      })),
    [],
  );

  useEffect(() => {
    const t = setTimeout(onDone, 5200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50" onClick={onDone}>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: p.left,
            background: p.background,
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `rotate(${p.rotate})`,
          }}
        />
      ))}
      <div className="flex h-full items-center justify-center p-6">
        <div className="rise-in max-w-sm rounded-lg border border-line-strong bg-card p-6 text-center shadow-2xl">
          <p className="text-3xl">🏆</p>
          <h3 className="mt-1 text-2xl">Meta da semana batida!</h3>
          <p className="mt-2 text-muted">Seu prêmio:</p>
          <p className="mt-1 text-lg italic">{reward}</p>
          <p className="mt-3 text-xs uppercase tracking-widest text-muted">
            toque para fechar
          </p>
        </div>
      </div>
    </div>
  );
}
