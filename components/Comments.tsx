"use client";

import { useState } from "react";
import type { AppStore } from "@/lib/store";
import type { AppState } from "@/lib/types";
import { dayLabel } from "@/lib/dates";

interface Props {
  state: AppState;
  store: AppStore;
  onJumpToDay: (date: string) => void;
}

/** Aba de comentários sob o calendário: notas gerais ou amarradas a um dia. */
export default function Comments({ state, store, onJumpToDay }: Props) {
  const [text, setText] = useState("");
  const [date, setDate] = useState("");

  const add = () => {
    if (!text.trim()) return;
    store.addComment(text.trim(), date || undefined);
    setText("");
    setDate("");
  };

  return (
    <section className="mt-8">
      <h3 className="text-xl">Comentários</h3>
      <p className="mt-1 text-sm text-muted">
        Notas soltas ou amarradas a um dia — combina com marcar um dia em que você não vai
        conseguir produzir.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Escrever um comentário…"
          className="min-w-64 flex-1 rounded border border-line bg-card px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded border border-line bg-card px-2 py-2 text-sm"
          aria-label="Dia (opcional)"
        />
        <button
          onClick={add}
          className="rounded border border-line-strong bg-foreground px-4 py-2 text-sm text-background hover:opacity-85"
        >
          Comentar
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {state.comments.length === 0 && (
          <li className="text-sm text-muted">Nenhum comentário ainda.</li>
        )}
        {state.comments.map((c) => (
          <li
            key={c.id}
            className="rise-in flex items-start gap-3 rounded-lg border border-line bg-card p-3 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              {c.date && (
                <button
                  onClick={() => onJumpToDay(c.date!)}
                  className="mr-2 rounded-full border border-line bg-background px-2 py-0.5 text-xs capitalize text-muted hover:border-line-strong hover:text-foreground"
                >
                  {dayLabel(c.date)}
                </button>
              )}
              <span className="text-sm">{c.text}</span>
              <p className="mt-1 text-xs text-muted">
                {new Date(c.createdAt).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <button
              onClick={() => store.deleteComment(c.id)}
              className="text-sm text-muted hover:text-foreground"
              title="Excluir comentário"
              aria-label="Excluir comentário"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
