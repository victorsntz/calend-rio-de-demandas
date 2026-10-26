#!/usr/bin/env python3
"""Gera o Excel do calendário editorial para mandar ao marketing da Gorayeb.

Uso:  python3 docs/gorayeb/calendario/gerar.py [pasta de saída]

Junta duas coisas:
  - `plano.json`, que é o remanejamento feito aqui (o que já está no ar, o que
    entra nas próximas semanas e o que foi para o banco de pauta);

O formato segue o dia: terça é o vídeo com o Dr. Fernando, quinta é carrossel e
sábado é estático com legenda. É proposta, não lei — carrossel e estático trocam
de lugar sem problema. O que não troca é o vídeo da terça, que depende de agenda
e vale gravar em lote.

  - o calendário original, de onde vem o pilar trabalhista em diante, deslocado
    28 dias: até 21/11 a agenda é ocupada pelo estoque de vídeo já gravado e
    pelo bloco ambiental que o acompanha.

Sai um arquivo com quatro abas: a agenda viva, o que já está no ar, o banco de
pauta e o guia de pilares original. O nome carrega a data, para não sobrescrever
o que já foi enviado.

Atualizar quinzenalmente: marcar o que saiu em `plano.json`, acrescentar as
próximas semanas e rodar de novo.
"""
import datetime
import json
import sys
from pathlib import Path

import openpyxl
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side

AQUI = Path(__file__).resolve().parent
ORIGINAL = AQUI / "original.xlsx"
DESLOCAMENTO = datetime.timedelta(days=28)
PRIMEIRO_DESLOCADO = 25  # o pilar trabalhista em diante

VERDE = "1B2316"
AREIA = "D4C9AA"
CREME = "EBE3C8"
DOURADO = "B8943D"
BORDO = "63260F"

DS = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"]
# uma peça em vídeo por semana, na terça; as outras duas saem da agência
FORMATO_POR_DIA = {1: "vídeo", 3: "carrossel", 5: "estático"}
CABECA = ["Nº", "Data", "Dia", "Pilar", "Tipo", "Tema do post", "Formato", "Status", "Observação"]


def data_de(v):
    if hasattr(v, "date"):
        return v.date()
    return datetime.datetime.strptime(str(v)[:10], "%d/%m/%Y").date()


def le_original():
    wb = openpyxl.load_workbook(ORIGINAL, data_only=True)
    ws = wb["Calendário Editorial"]
    itens = {}
    for r in ws.iter_rows(min_row=5, values_only=True):
        n, data, mes, sem, pilar, tipo, tema, fmt, cta = (list(r) + [None] * 9)[:9]
        if n is None:
            continue
        itens[int(n)] = {
            "data": data_de(data),
            "pilar": str(pilar or "").strip(),
            "tipo": str(tipo or "").strip(),
            "tema": str(tema or "").strip(),
            "formato_sugerido": str(fmt or "").strip(),
            "cta": str(cta or "").strip(),
        }
    return wb, itens


def estilo_cabeca(ws, colunas):
    fundo = PatternFill("solid", fgColor=VERDE)
    for i, titulo in enumerate(colunas, start=1):
        c = ws.cell(1, i, titulo)
        c.font = Font(bold=True, color=CREME, size=11)
        c.fill = fundo
        c.alignment = Alignment(vertical="center")
    ws.freeze_panes = "A2"
    ws.row_dimensions[1].height = 24


def larguras(ws, pares):
    for col, larg in pares.items():
        ws.column_dimensions[col].width = larg


def pinta_status(celula, status):
    s = (status or "").lower()
    if "no ar" in s or "publicado" in s:
        celula.fill = PatternFill("solid", fgColor="D9E8D0")
    elif "pronta" in s:
        celula.fill = PatternFill("solid", fgColor=AREIA)
    elif "escritório" in s:
        celula.fill = PatternFill("solid", fgColor="F2D9C4")


def roteiros(ws, caminho_conteudo):
    """Uma aba com o roteiro e a legenda de cada post, linha a linha.

    O Excel mostra no máximo mil e poucos caracteres por célula, então nada de
    jogar a legenda inteira num lugar só: cada tela, cada fala e cada parágrafo
    da legenda ocupa a sua linha. Pra copiar a legenda, seleciona as linhas dela.
    """
    import importlib.util

    spec = importlib.util.spec_from_file_location("conteudo_linha", caminho_conteudo)
    M = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(M)

    estilo_cabeca(ws, ["Data", "Post", "Parte", "Detalhe", "Texto"])
    ws.freeze_panes = "C2"
    l = 2
    faixa = PatternFill("solid", fgColor=AREIA)
    sub = PatternFill("solid", fgColor=CREME)

    for p in M.PECAS:
        data = p["data"].split(" · ")[0]
        # faixa de abertura do post: data, título, formato e situação
        ws.cell(l, 1, data)
        ws.cell(l, 2, p["titulo"])
        ws.cell(l, 3, p["formato"])
        ws.cell(l, 4, p.get("pilar", ""))
        ws.cell(l, 5, p.get("status") or p.get("quem") or "")
        for j in range(1, 6):
            c = ws.cell(l, j)
            c.fill = faixa
            c.font = Font(bold=True, size=11)
        l += 1

        def bloco(rotulo, linhas):
            nonlocal l
            for i, (det, txt) in enumerate(linhas):
                if not txt:
                    continue
                ws.cell(l, 3, rotulo if i == 0 else "")
                ws.cell(l, 4, det)
                ws.cell(l, 5, txt)
                ws.cell(l, 3).fill = sub
                l += 1

        bloco("Objetivo", [("", p["objetivo"])])
        if p.get("arte"):
            bloco("Arte", [("Capa e selo", p["arte"])])
        if "tabela" in p:
            cab, linhas = p["tabela"]
            bloco(p.get("rotulo_tabela", "Roteiro"),
                  [(x[0], " · ".join(f"{cab[i]}: {x[i]}" for i in range(1, len(cab)) if x[i])) for x in linhas])
        if "tabela_b" in p:
            rot, intro, cab, linhas = p["tabela_b"]
            bloco(rot, [("", intro)] +
                  [(x[0], " · ".join(f"{cab[i]}: {x[i]}" for i in range(1, len(cab)) if x[i])) for x in linhas])
        if "telas" in p:
            bloco("Tela a tela", [(f"{i:02d} · {rot}", f"{tit} {txt}") for i, (rot, tit, txt) in enumerate(p["telas"], 1)])
        if "narracao" in p:
            bloco(p.get("rotulo_fala", "Narração"), [(f"{i:02d}", x) for i, x in enumerate(p["narracao"], 1)])
        if "tela" in p:
            bloco("Na tela", [(f"{i:02d}", x) for i, x in enumerate(p["tela"], 1)])
        if "frase" in p:
            a, b = p["frase"]
            bloco("A arte", [("Frase", f"{a} {b}"), ("Apoio", p.get("apoio", ""))])
        if "legenda" in p:
            bloco("Legenda", [(f"{i:02d}", x) for i, x in enumerate(p["legenda"], 1)])
            if p.get("legenda_nota"):
                bloco("", [("Observação", p["legenda_nota"])])
        if p.get("nota"):
            bloco("", [("Observação", p["nota"])])
        bloco("Fontes", [(f"{i:02d}", M.F[k][0] + (f" · {M.F[k][1]}" if M.F[k][1] else ""))
                         for i, k in enumerate(p.get("fontes", []), 1)])
        if p.get("fontes_nota"):
            bloco("", [("Fonte", p["fontes_nota"])])
        l += 1  # uma linha em branco entre um post e o outro

    larguras(ws, {"A": 12, "B": 40, "C": 18, "D": 22, "E": 110})
    for r in ws.iter_rows(min_row=2, max_row=l):
        for c in r:
            c.alignment = Alignment(vertical="top", wrap_text=(c.column == 5))
    return l


def monta(destino: Path):
    plano = json.loads((AQUI / "plano.json").read_text(encoding="utf8"))
    wb_orig, itens = le_original()

    reservados = set()
    for chave, lista in plano["banco_de_pauta"].items():
        if isinstance(lista, list) and lista and isinstance(lista[0], int):
            reservados |= set(lista)
    reservados |= {x["n"] for x in plano["banco_de_pauta"]["fora_de_pauta"]}
    reservados |= {x["n"] for x in plano["no_ar"] if x["n"]}
    # "item 7 — resgatado...", "item 15 — vídeo gravado": o número vem logo após "item"
    import re
    for it in plano["agenda"]:
        m = re.match(r"item (\d+)", it["origem"])
        if m:
            reservados.add(int(m.group(1)))

    wb = openpyxl.Workbook()

    # ---- aba 1: a agenda viva -------------------------------------------
    ws = wb.active
    ws.title = "Agenda"
    estilo_cabeca(ws, CABECA)
    linha = 2
    ocupadas = {datetime.date.fromisoformat(x["data"]) for x in plano["agenda"]}

    for a in plano["agenda"]:
        d = datetime.date.fromisoformat(a["data"])
        ws.cell(linha, 1, "")
        ws.cell(linha, 2, d.strftime("%d/%m/%Y"))
        ws.cell(linha, 3, DS[d.weekday()])
        ws.cell(linha, 4, a["pilar"])
        ws.cell(linha, 5, a["tipo"])
        ws.cell(linha, 6, a["tema"])
        ws.cell(linha, 7, a["formato"])
        c = ws.cell(linha, 8, a["status"])
        pinta_status(c, a["status"])
        ws.cell(linha, 9, a["origem"])
        linha += 1

    # novembro em diante, deslocado
    for n in sorted(itens):
        if n < PRIMEIRO_DESLOCADO or n in reservados:
            continue
        it = itens[n]
        d = it["data"] + DESLOCAMENTO
        # a agenda escrita à mão manda: dezembro foi montado item a item
        while d in ocupadas:
            d += datetime.timedelta(days=2)
        ocupadas.add(d)
        ws.cell(linha, 1, n)
        ws.cell(linha, 2, d.strftime("%d/%m/%Y"))
        ws.cell(linha, 3, DS[d.weekday()])
        ws.cell(linha, 4, it["pilar"])
        ws.cell(linha, 5, it["tipo"])
        ws.cell(linha, 6, it["tema"])
        ws.cell(linha, 7, FORMATO_POR_DIA.get(d.weekday(), "a definir"))
        ws.cell(linha, 8, "a produzir")
        ws.cell(linha, 9, f"item {n} do original, +28 dias")
        linha += 1

    larguras(ws, {"A": 6, "B": 12, "C": 10, "D": 34, "E": 11, "F": 74, "G": 14, "H": 24, "I": 28})
    for r in ws.iter_rows(min_row=2, max_row=linha - 1):
        for c in r:
            c.alignment = Alignment(vertical="top", wrap_text=(c.column == 6))

    # ---- aba 2: o que já está no ar --------------------------------------
    ws2 = wb.create_sheet("Já no ar")
    estilo_cabeca(ws2, ["Nº", "Tema previsto no calendário", "Como já foi publicado"])
    for i, x in enumerate(plano["no_ar"], start=2):
        ws2.cell(i, 1, x["n"] if x["n"] else "—")
        ws2.cell(i, 2, x["tema"])
        ws2.cell(i, 3, x["como"])
    larguras(ws2, {"A": 6, "B": 62, "C": 62})
    for r in ws2.iter_rows(min_row=2):
        for c in r:
            c.alignment = Alignment(vertical="top", wrap_text=True)

    # ---- aba 3: banco de pauta -------------------------------------------
    ws3 = wb.create_sheet("Banco de pauta")
    estilo_cabeca(ws3, ["Nº", "Tema", "Para onde vai", "Motivo"])
    l = 2
    # cada chave do banco é uma lista de números do calendário original ou um
    # grupo de peças soltas, com o motivo; o rótulo sai de "rotulos_banco" no plano.json
    for chave, valor in plano["banco_de_pauta"].items():
        rotulo = plano.get("rotulos_banco", {}).get(chave, chave.replace("_", " "))
        if chave == "fora_de_pauta":
            for x in valor:
                ws3.cell(l, 1, x["n"]); ws3.cell(l, 2, itens[x["n"]]["tema"])
                ws3.cell(l, 3, "fora de pauta"); ws3.cell(l, 4, x["motivo"]); l += 1
        elif isinstance(valor, list) and valor and isinstance(valor[0], int):
            for n in valor:
                ws3.cell(l, 1, n); ws3.cell(l, 2, itens[n]["tema"]); ws3.cell(l, 3, rotulo)
                ws3.cell(l, 4, "o pilar volta nessa data"); l += 1
        elif isinstance(valor, dict) and "pecas" in valor:
            for p in valor["pecas"]:
                ws3.cell(l, 1, p.get("n", "")); ws3.cell(l, 2, f'{p["tema"]} ({p["formato"]})')
                ws3.cell(l, 3, rotulo); ws3.cell(l, 4, valor["motivo"]); l += 1
    larguras(ws3, {"A": 6, "B": 66, "C": 30, "D": 56})
    for r in ws3.iter_rows(min_row=2):
        for c in r:
            c.alignment = Alignment(vertical="top", wrap_text=True)

    # ---- aba 4: roteiro e legenda de cada post ---------------------------
    # mesma fonte do PDF, pra não existirem duas versões do mesmo texto
    conteudo = AQUI.parent / "linha-editorial" / "conteudo.py"
    if conteudo.exists():
        roteiros(wb.create_sheet("Roteiros e legendas"), conteudo)

    # ---- aba 5: o guia original, sem mexer -------------------------------
    ws4 = wb.create_sheet("Guia de Pilares")
    orig = wb_orig["Guia de Pilares e Lógica"]
    for i, r in enumerate(orig.iter_rows(values_only=True), start=1):
        for j, v in enumerate(r, start=1):
            ws4.cell(i, j, v)
    larguras(ws4, {"A": 14, "B": 40, "C": 70, "D": 46})

    destino.mkdir(parents=True, exist_ok=True)
    hoje = datetime.date.fromisoformat(plano["atualizado_em"])
    caminho = destino / f"Calendario_Editorial_Gorayeb_{hoje.strftime('%Y-%m-%d')}.xlsx"
    wb.save(caminho)
    print(f"{caminho}  ({linha - 2} linhas na agenda)")
    return caminho


if __name__ == "__main__":
    monta(Path(sys.argv[1]) if len(sys.argv) > 1 else AQUI / "saida")
