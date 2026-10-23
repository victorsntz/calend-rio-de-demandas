#!/usr/bin/env python3
"""Monta o PDF do plano do bloco Previdenciário Rural pra mandar à Dra. Elisa.

    python3 docs/gorayeb/calendario/plano-previdenciario/gerar.py

Lê conteudo.py, escreve o HTML em template/_plano-previdenciario.html (pra
herdar fontes e logos) e imprime em calendario/saida/ com Chromium.
"""
import html, os, subprocess, sys, datetime

AQUI = os.path.dirname(os.path.abspath(__file__))
GORAYEB = os.path.abspath(os.path.join(AQUI, "..", ".."))
import importlib.util

def carrega(caminho):
    spec = importlib.util.spec_from_file_location("conteudo_plano", caminho)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

# --conteudo <arquivo.py> escolhe o plano; sem ele, sai o bloco de 22/10
_args = sys.argv[1:]
CONTEUDO = os.path.join(AQUI, "conteudo.py")
if "--conteudo" in _args:
    CONTEUDO = os.path.abspath(_args[_args.index("--conteudo") + 1])
M = carrega(CONTEUDO)
F, GRADE, PECAS = M.F, M.GRADE, M.PECAS

e = html.escape
HOJE = getattr(M, "HOJE", datetime.date(2026, 10, 22))

CSS = """
@font-face{font-family:Arvo;src:url(../fontes/arvo/Arvo-Regular.ttf);font-weight:400}
@font-face{font-family:Arvo;src:url(../fontes/arvo/Arvo-Bold.ttf);font-weight:700}
@font-face{font-family:Arvo;src:url(../fontes/arvo/Arvo-Italic.ttf);font-weight:400;font-style:italic}
@font-face{font-family:Hel;src:url(../fontes/helvetica/HelveticaNeueLight.otf);font-weight:300}
@font-face{font-family:Hel;src:url(../fontes/helvetica/HelveticaNeueRoman.otf);font-weight:400}
@font-face{font-family:Hel;src:url(../fontes/helvetica/HelveticaNeueMedium.otf);font-weight:500}
@font-face{font-family:Hel;src:url(../fontes/helvetica/HelveticaNeueBold.otf);font-weight:700}
:root{--verde:#1b2316;--areia:#d4c9aa;--bordo:#63260f;--dourado:#b8943d;--dourado-esc:#8a6f32;
  --creme:#ebe3c8;--papel:#f6f2e7;--tinta:#1b2316;--fraca:#5b604f;--linha:#d9d1bb}
@page{size:A4;margin:18mm 19mm 19mm}
@page capa{margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Hel,Helvetica,Arial,sans-serif;font-weight:300;color:var(--tinta);font-size:10.4pt;line-height:1.55;background:#fff}
.pag{position:relative;page-break-after:always}
.pag:last-child{page-break-after:auto}
h1,h2,h3{font-family:Arvo,Georgia,serif;font-weight:700;color:var(--tinta);line-height:1.15}
.eyebrow{font-family:Hel;font-weight:700;font-size:7.6pt;letter-spacing:.16em;text-transform:uppercase;color:var(--dourado-esc);margin-bottom:6mm}
p{margin-bottom:3.2mm}
b,strong{font-weight:500;color:var(--tinta)}

/* capa */
.capa{page:capa;width:210mm;height:297mm;overflow:hidden;background:var(--verde);color:var(--creme);display:flex;flex-direction:column;padding:26mm 22mm}
.capa .logo{height:15mm;align-self:flex-start}
.capa .meio{margin-top:auto;margin-bottom:auto}
.capa .eyebrow{color:var(--dourado)}
.capa h1{color:var(--creme);font-size:40pt;line-height:1.05;margin-bottom:7mm}
.capa h1 em{font-style:italic;font-weight:400;color:var(--dourado)}
.capa .sub{font-size:13pt;font-weight:300;color:var(--areia);max-width:130mm}
.capa .pe{font-size:8.6pt;color:var(--areia);letter-spacing:.04em;border-top:.3mm solid rgba(212,201,170,.35);padding-top:5mm}
.listras{position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.018) 0 22mm,transparent 22mm 44mm);pointer-events:none}

/* visão geral */
h2.sec{font-size:21pt;margin-bottom:6mm}
.nums{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm;margin:6mm 0 8mm}
.nums div{border-top:.6mm solid var(--dourado);padding-top:3mm}
.nums b{display:block;font-family:Arvo;font-weight:700;font-size:22pt;line-height:1}
.nums span{font-size:8.6pt;color:var(--fraca)}
.tres{display:grid;grid-template-columns:repeat(3,1fr);gap:6mm;margin:4mm 0 8mm}
.tres div{background:var(--papel);border-radius:3mm;padding:5mm}
.tres h3{font-size:11pt;margin-bottom:2mm}
.tres p{font-size:9.2pt;color:var(--fraca);margin:0}
ol.arco{list-style:none;counter-reset:a -1;margin:2mm 0 0}
ol.arco li{counter-increment:a;display:grid;grid-template-columns:9mm 1fr;padding:2.6mm 0;border-bottom:.25mm solid var(--linha)}
ol.arco li::before{content:counter(a);font-family:Arvo;font-weight:700;color:var(--dourado-esc)}
ol.arco li span{color:var(--fraca);font-size:9pt}

/* grade */
table.grade{width:100%;border-collapse:collapse;font-size:9.2pt;margin:2mm 0 8mm}
table.grade th{font-family:Hel;font-weight:700;font-size:7pt;letter-spacing:.12em;text-transform:uppercase;color:var(--dourado-esc);text-align:left;padding:0 3mm 2.4mm 0;border-bottom:.4mm solid var(--tinta)}
table.grade td{padding:2.4mm 3mm 2.4mm 0;border-bottom:.25mm solid var(--linha);vertical-align:top}
table.grade td.d{white-space:nowrap;font-weight:500;width:21mm}
table.grade td.f{white-space:nowrap;width:22mm;color:var(--fraca)}
table.grade tr.fora td{color:#9a9a8c;font-style:italic}
table.grade tr.lanc td{background:#efe6cc}
table.grade tr.lanc td.d{padding-left:2mm}
.caixa{break-inside:avoid;background:var(--verde);color:var(--creme);border-radius:3mm;padding:6mm 7mm}
.caixa h3{color:var(--creme);font-size:12pt;margin-bottom:3mm}
.caixa ol{padding-left:5mm}
.caixa li{margin-bottom:2.2mm;font-size:9.4pt}
.caixa b{color:var(--dourado)}

/* peça */
.topo{display:flex;justify-content:space-between;align-items:baseline;border-bottom:.4mm solid var(--tinta);padding-bottom:2.4mm;margin-bottom:5mm}
.topo .data{font-family:Arvo;font-weight:700;font-size:11pt}
.topo .fmt{font-family:Hel;font-weight:700;font-size:7.4pt;letter-spacing:.14em;text-transform:uppercase;color:var(--dourado-esc)}
.peca h2{font-size:16.5pt;margin-bottom:3mm;max-width:160mm}
.quem{display:inline-block;font-size:7.2pt;font-weight:500;letter-spacing:.06em;text-transform:uppercase;border:.3mm solid var(--dourado);color:var(--dourado-esc);border-radius:10mm;padding:.6mm 3mm;margin-bottom:3.6mm}
.obj{font-size:9.8pt;color:var(--fraca);border-left:.8mm solid var(--dourado);padding-left:4mm;margin-bottom:4.6mm}
h3.rot{font-family:Hel;font-weight:700;font-size:7pt;letter-spacing:.14em;text-transform:uppercase;color:var(--dourado-esc);margin:4.4mm 0 2.4mm}
.narr p{font-family:Arvo;font-size:10.2pt;line-height:1.5;margin-bottom:1.9mm}
ul.tela{list-style:none;columns:2;column-gap:7mm}
ul.tela li{position:relative;padding-left:5mm;margin-bottom:1.3mm;font-size:8.6pt;line-height:1.4;color:var(--fraca);break-inside:avoid}
ul.tela li::before{content:"";position:absolute;left:0;top:2.3mm;width:3.2mm;height:.35mm;background:var(--dourado)}
.telas{display:grid;grid-template-columns:1fr 1fr;gap:2.8mm}
.tel{border:.25mm solid var(--linha);border-radius:2.2mm;padding:3mm 3.6mm;break-inside:avoid}
.tel .n{font-family:Hel;font-weight:700;font-size:6.8pt;letter-spacing:.14em;text-transform:uppercase;color:var(--dourado-esc);margin-bottom:1.6mm}
.tel h4{font-family:Arvo;font-weight:700;font-size:9.8pt;line-height:1.22;margin-bottom:1.2mm}
.tel p{font-size:8.4pt;color:var(--fraca);margin:0;line-height:1.42}
.tel.capa-t{background:var(--verde);border-color:var(--verde)}
.tel.capa-t h4{color:var(--creme)} .tel.capa-t p{color:var(--dourado)} .tel.capa-t .n{color:var(--areia)}
.arte{break-inside:avoid;background:var(--verde);border-radius:3mm;padding:8mm 8mm;margin-bottom:3mm}
.arte .a{font-family:Arvo;font-weight:700;color:var(--creme);font-size:17pt;line-height:1.2}
.arte .b{font-family:Arvo;font-weight:700;color:var(--dourado);font-size:17pt;line-height:1.2;text-transform:uppercase;margin-top:1mm}
.arte .apoio{color:var(--areia);font-size:9.6pt;margin-top:5mm;max-width:140mm}
.leg{background:var(--papel);border-radius:3mm;padding:4mm 5mm}
.leg p{font-size:8.7pt;line-height:1.48;margin-bottom:1.9mm}
.leg p:first-child{font-weight:500}
.leg .nota{font-size:8.2pt;color:var(--fraca);font-style:italic;margin-top:2mm}
.nota-f{font-size:8.2pt;color:var(--fraca);background:var(--papel);border-radius:2mm;padding:2.6mm 3.6mm;margin-top:3.4mm}
.fontes{break-inside:avoid;margin-top:5mm;border-top:.25mm solid var(--linha);padding-top:2.6mm}
.fontes h3{font-family:Hel;font-weight:700;font-size:7pt;letter-spacing:.14em;text-transform:uppercase;color:var(--fraca);margin-bottom:2mm}
.fontes li{font-size:7.6pt;color:var(--fraca);margin:0 0 .9mm 4mm;line-height:1.4}
.fontes a{color:var(--dourado-esc);text-decoration:none;word-break:break-all}
.status{display:inline-block;background:#e4ecd9;color:#3f6a2e;font-size:8pt;font-weight:500;border-radius:2mm;padding:1.6mm 3.2mm;margin-bottom:3.6mm}
table.rot-t{width:100%;border-collapse:collapse;font-size:8.2pt;line-height:1.42}
table.rot-t th{font-family:Hel;font-weight:700;font-size:6.6pt;letter-spacing:.12em;text-transform:uppercase;color:var(--dourado-esc);text-align:left;padding:0 2.4mm 1.8mm 0;border-bottom:.35mm solid var(--tinta)}
table.rot-t td{padding:1.9mm 2.4mm 1.9mm 0;border-bottom:.25mm solid var(--linha);vertical-align:top;color:var(--fraca)}
table.rot-t td:first-child{white-space:nowrap;color:var(--dourado-esc);font-weight:500}
table.rot-t td:last-child{color:var(--tinta);font-family:Arvo;font-size:8.6pt}
.narr-b p{font-size:9.2pt}
/* calendário de 18 linhas e peça com tabela de roteiro cabem numa página */
.grade-longa table.grade{font-size:8.6pt}
.grade-longa table.grade td{padding:1.55mm 3mm 1.55mm 0}
.grade-longa .caixa{padding:4.6mm 6mm}
.grade-longa .caixa li{margin-bottom:1.4mm;font-size:8.8pt}
.com-tabela table.rot-t{font-size:7.7pt;line-height:1.36}
.com-tabela table.rot-t td{padding:1.4mm 2.2mm 1.4mm 0}
.com-tabela table.rot-t td:last-child{font-size:8.1pt}
.com-tabela .leg p{font-size:8.1pt;line-height:1.4;margin-bottom:1.3mm}
.com-tabela .obj{margin-bottom:3mm}
"""

def fontes(p):
    itens = [F[k] for k in p.get("fontes", [])]
    if not itens and not p.get("fontes_nota"):
        return ""
    lis = "".join(
        f"<li>{f'<a href=\"{e(u)}\">{e(t)}</a>' if u else e(t)}</li>" for t, u in itens)
    extra = f"<li>{e(p['fontes_nota'])}</li>" if p.get("fontes_nota") else ""
    return f'<div class="fontes"><h3>Fontes</h3><ul>{lis}{extra}</ul></div>'

def peca(p):
    quem = f'<div class="quem">{e(p["quem"])}</div>' if p.get("quem") else ""
    corpo = ""
    if p.get("status"):
        corpo += f'<div class="status">{e(p["status"])}</div>'
    if "tabela" in p:
        cab, linhas = p["tabela"]
        corpo += '<h3 class="rot">Roteiro</h3><table class="rot-t"><thead><tr>' + "".join(f"<th>{e(c)}</th>" for c in cab) + "</tr></thead><tbody>"
        corpo += "".join("<tr>" + "".join(f"<td>{e(c)}</td>" for c in l) + "</tr>" for l in linhas) + "</tbody></table>"
    if "narracao_b" in p:
        tit, linhas = p["narracao_b"]
        corpo += f'<h3 class="rot">{e(tit)}</h3><div class="narr narr-b">' + "".join(f"<p>{e(x)}</p>" for x in linhas) + "</div>"
    if "fotos" in p:
        corpo += '<h3 class="rot">Sequência de fotos</h3><ul class="tela">' + "".join(f"<li>{e(x)}</li>" for x in p["fotos"]) + "</ul>"
    if "narracao" in p:
        rot = p.get("rotulo_fala") or ("Fala" if p.get("quem") and "Gravado" in p["quem"] else "Narração")
        corpo += f'<h3 class="rot">{rot}</h3><div class="narr">' + "".join(f"<p>{e(x)}</p>" for x in p["narracao"]) + "</div>"
        if p.get("tela"):
            corpo += '<h3 class="rot">O que aparece na tela</h3><ul class="tela">' + "".join(f"<li>{e(x)}</li>" for x in p["tela"]) + "</ul>"
    if "telas" in p:
        cards = []
        for i, (rot, tit, txt) in enumerate(p["telas"], 1):
            cls = "tel capa-t" if i == 1 else "tel"
            cards.append(f'<div class="{cls}"><div class="n">{i:02d} · {e(rot)}</div><h4>{e(tit)}</h4><p>{e(txt)}</p></div>')
        corpo += '<h3 class="rot">Tela a tela</h3><div class="telas">' + "".join(cards) + "</div>"
    if "frase" in p:
        a, b = p["frase"]
        corpo += f'<h3 class="rot">A arte</h3><div class="arte"><div class="a">{e(a)}</div><div class="b">{e(b)}</div><div class="apoio">{e(p["apoio"])}</div></div>'
    if "legenda" in p:
        if p.get("duas_paginas"):
            # peça longa demais pra uma folha: a legenda abre a segunda, com o cabeçalho repetido
            corpo += (f'<div style="break-before:page"></div><div class="topo"><span class="data">{e(p["data"])}</span>'
                      f'<span class="fmt">{e(p["titulo"])} · continuação</span></div>')
        nota = f'<p class="nota">{e(p["legenda_nota"])}</p>' if p.get("legenda_nota") else ""
        corpo += '<h3 class="rot">Legenda</h3><div class="leg">' + "".join(f"<p>{e(x)}</p>" for x in p["legenda"]) + nota + "</div>"
    if p.get("nota"):
        corpo += f'<div class="nota-f">{e(p["nota"])}</div>'
    return f"""<section class="pag peca{' com-tabela' if 'tabela' in p else ''}">
  <div class="topo"><span class="data">{e(p['data'])}</span><span class="fmt">{e(p['formato'])}</span></div>
  <h2>{e(p['titulo'])}</h2>{quem}
  <p class="obj">{e(p['objetivo'])}</p>
  {corpo}
  {fontes(p)}
</section>"""

def grade():
    rows = "".join(
        f'<tr class="{"fora" if k=="fora" else ("lanc" if k=="lanc" else "")}"><td class="d">{d} <span style="color:#9a9a8c">{s}</span></td><td class="f">{f}</td><td>{e(t)}</td></tr>'
        for d, s, f, t, k in GRADE)
    return rows

def html_doc():
    if hasattr(M, "CAPA"):
        return html_doc_m()
    capa = f"""<section class="pag capa"><div class="listras"></div>
  <img class="logo" src="../assets/logo-horizontal-claro.png" alt="Gorayeb Advocacia">
  <div class="meio">
    <p class="eyebrow">Plano de conteúdo · Instagram</p>
    <h1>Direito<br><em>Previdenciário</em></h1>
    <p class="sub">Lançamento da área e bloco de conteúdo para o produtor rural.<br>23 de outubro a 21 de novembro de 2026.</p>
  </div>
  <p class="pe">Preparado para a Dra. Elisa · {HOJE.strftime('%d/%m/%Y')}</p>
</section>"""

    visao = """<section class="pag">
  <p class="eyebrow">Visão geral</p>
  <h2 class="sec">Um lançamento e quatro semanas de conteúdo</h2>
  <p>O bloco abre com o vídeo de lançamento da área, que apresenta o Direito Previdenciário inteiro: rural e urbano, aposentadorias, pensão, auxílios, BPC/LOAS e revisão. A partir daí, as peças aprofundam um público só: <b>o produtor rural e a família dele</b>, que é quem já acompanha o perfil.</p>
  <p>É ali que a área nasce com mais força. Aposentadoria rural, prova de trabalho na roça, pensão da viúva do produtor: são dúvidas que esse público já tem, e que quase ninguém na região explica de forma clara. Os temas urbanos, como servidor público municipal e aposentadoria da pessoa com deficiência, ficam para um segundo bloco, em janeiro.</p>
  <div class="nums">
    <div><b>13</b><span>peças</span></div>
    <div><b>5</b><span>vídeos, contando o lançamento</span></div>
    <div><b>4</b><span>carrosséis</span></div>
    <div><b>4</b><span>estáticos</span></div>
  </div>
  <p class="eyebrow" style="margin-bottom:3mm">Por que esses três formatos</p>
  <div class="tres">
    <div><h3>Vídeo abre</h3><p>Toda terça. É o formato que o Instagram mais entrega para quem ainda não segue o perfil.</p></div>
    <div><h3>Carrossel detalha</h3><p>Toda quinta. É o que a pessoa salva e volta para ler quando precisa.</p></div>
    <div><h3>Estático fixa</h3><p>Todo sábado. Uma frase que cabe num print e circula no WhatsApp da família.</p></div>
  </div>
  <p class="eyebrow" style="margin-bottom:1mm">O fio da meada</p>
  <ol class="arco">
    <li><div><b>O que é a área.</b> <span>Vídeo de lançamento.</span></div></li>
    <li><div><b>Eu tenho direito?</b> <span>Segurado especial, os critérios, tempo de roça e não de contribuição.</span></div></li>
    <li><div><b>E se eu saí da roça, ou se o INSS negou?</b> <span>Aposentadoria híbrida, revisão, a idade que não mudou.</span></div></li>
    <li><div><b>Como eu provo?</b> <span>A prova que decide, os documentos aceitos, papel guardado.</span></div></li>
    <li><div><b>E a minha família?</b> <span>Pensão por morte, salário-maternidade, auxílio-doença e planejamento.</span></div></li>
  </ol>
</section>"""

    grade_pag = f"""<section class="pag">
  <p class="eyebrow">Calendário</p>
  <h2 class="sec">23 de outubro a 21 de novembro</h2>
  <table class="grade"><thead><tr><th>Data</th><th>Formato</th><th>Peça</th></tr></thead><tbody>{grade()}</tbody></table>
  <p style="font-size:9pt;color:var(--fraca)">Em itálico, a última peça do bloco de crédito rural, já aprovada, que sai no dia seguinte ao lançamento. Sugestão: fixar o vídeo de lançamento no topo do perfil durante todo o bloco.</p>
  <div class="caixa" style="margin-top:7mm">
    <h3>O que precisamos de vocês</h3>
    <ol>
      <li><b>Aprovação do lançamento e da legenda dele até amanhã cedo</b>, para publicar na sexta, 23/10.</li>
      <li><b>Gravação do Dr. Gustavo:</b> dois vídeos, <i>A prova é o que decide</i> (10/11) e <i>Pensão por morte no campo</i> (17/11). Roteiros prontos neste documento. O ideal é gravar os dois juntos até 06/11, para dar tempo de editar.</li>
      <li><b>Nome completo e número da OAB do Dr. Gustavo</b>, que entram na identificação dele nos vídeos.</li>
      <li><b>Aprovação dos demais roteiros</b> até 27/10. A partir daí, cada peça segue para a arte final.</li>
    </ol>
  </div>
</section>"""

    pecas = "\n".join(peca(p) for p in PECAS)
    return f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Plano de conteúdo · Direito Previdenciário</title>
<style>{CSS}</style></head><body>{capa}{visao}{grade_pag}{pecas}</body></html>"""

def html_doc_m():
    c = M.CAPA
    capa = f"""<section class="pag capa"><div class="listras"></div>
  <img class="logo" src="../assets/logo-horizontal-claro.png" alt="Gorayeb Advocacia">
  <div class="meio">
    <p class="eyebrow">{c['eyebrow']}</p>
    <h1>{c['titulo']}</h1>
    <p class="sub">{c['sub']}</p>
  </div>
  <p class="pe">{c['pe']}</p>
</section>"""
    visao = f'<section class="pag">{M.VISAO_HTML}</section>'
    precisa = "".join(f"<li>{x}</li>" for x in M.PRECISAMOS)
    grade_pag = f"""<section class="pag{' grade-longa' if len(GRADE) > 15 else ''}">
  <p class="eyebrow">Calendário</p>
  <h2 class="sec">{M.GRADE_TITULO}</h2>
  <table class="grade"><thead><tr><th>Data</th><th>Formato</th><th>Post</th></tr></thead><tbody>{grade()}</tbody></table>
  <p style="font-size:9pt;color:var(--fraca)">{M.GRADE_NOTA}</p>
  <div class="caixa" style="margin-top:6mm"><h3>O que precisamos de vocês</h3><ol>{precisa}</ol></div>
</section>"""
    pecas = "\n".join(peca(p) for p in PECAS)
    return f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Plano de conteúdo · Direito Previdenciário</title>
<style>{CSS}</style></head><body>{capa}{visao}{grade_pag}{pecas}</body></html>"""

# versão de tela, pra revisar e comentar: mesmas páginas, como folhas sobre
# um fundo, e o grid cedendo no celular
TELA = """
:root{--fundo:#e7e2d4}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--fundo:#12170f}}
:root[data-theme="dark"]{--fundo:#12170f}
html,body{background:var(--fundo)}
body{padding:24px 0}
.pag{width:min(210mm,calc(100% - 32px));margin:0 auto 24px;background:#fff;
  padding:clamp(22px,6vw,22mm) clamp(18px,5.5vw,20mm);border-radius:4px;
  box-shadow:0 1px 2px rgba(0,0,0,.08),0 8px 28px rgba(0,0,0,.10)}
.capa{height:auto;min-height:min(297mm,150vw);padding:clamp(26px,7vw,26mm) clamp(20px,6vw,22mm)}
.fontes a{word-break:normal}
@media (max-width:640px){
  body{font-size:15px}
  .capa h1{font-size:44px}
  .nums{grid-template-columns:1fr 1fr}
  .tres,.telas{grid-template-columns:1fr}
  ul.tela{columns:1}
  table.grade td.f{display:none}
  table.grade th:nth-child(2){display:none}
}
"""

def html_tela():
    doc = html_doc().replace("../fontes/", "fontes/").replace("../assets/", "assets/")
    doc = doc.replace("<title>Plano de conteúdo · Direito Previdenciário</title>",
                      "<title>Plano Direito Previdenciário</title>"
                      '<meta name="viewport" content="width=device-width,initial-scale=1">')
    return doc.replace("</style>", TELA + "</style>")

if __name__ == "__main__":
    if "--tela" in _args:
        import shutil
        d = _args[_args.index("--tela") + 1]
        os.makedirs(os.path.join(d, "fontes", "arvo"), exist_ok=True)
        os.makedirs(os.path.join(d, "fontes", "helvetica"), exist_ok=True)
        os.makedirs(os.path.join(d, "assets"), exist_ok=True)
        for f in ("Arvo-Regular.ttf", "Arvo-Bold.ttf", "Arvo-Italic.ttf"):
            shutil.copy(os.path.join(GORAYEB, "fontes", "arvo", f), os.path.join(d, "fontes", "arvo", f))
        for f in ("HelveticaNeueLight.otf", "HelveticaNeueRoman.otf", "HelveticaNeueMedium.otf", "HelveticaNeueBold.otf"):
            shutil.copy(os.path.join(GORAYEB, "fontes", "helvetica", f), os.path.join(d, "fontes", "helvetica", f))
        shutil.copy(os.path.join(GORAYEB, "assets", "logo-horizontal-claro.png"), os.path.join(d, "assets"))
        open(os.path.join(d, "index.html"), "w", encoding="utf8").write(html_tela())
        print(os.path.join(d, "index.html"))
        sys.exit(0)

    tpl = os.path.join(GORAYEB, "template", f"_{getattr(M, 'SLUG', 'plano-previdenciario')}.html")
    open(tpl, "w", encoding="utf8").write(html_doc())
    saida = os.path.join(GORAYEB, "calendario", "saida")
    os.makedirs(saida, exist_ok=True)
    pdf = os.path.join(saida, f"{getattr(M, 'ARQUIVO', 'Plano_Previdenciario_Gorayeb')}_{HOJE.isoformat()}.pdf")
    js = f"""
const pw = require('/opt/node-tools/node_modules/playwright');
(async () => {{
  const b = await pw.chromium.launch();
  const p = await b.newPage();
  await p.goto('file://{tpl}', {{waitUntil:'networkidle'}});
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({{path:'{pdf}', format:'A4', printBackground:true, preferCSSPageSize:true,
    displayHeaderFooter:true, headerTemplate:'<span></span>',
    footerTemplate:'<div style="width:100%;font-family:Helvetica,Arial;font-size:7px;color:#8a8a7a;padding:0 20mm;display:flex;justify-content:space-between"><span>Gorayeb Advocacia · Direito Previdenciário</span><span class="pageNumber"></span></div>',
    }});
  await b.close();
}})();"""
    subprocess.run(["node", "-e", js], check=True)
    print(pdf)
