# Transforma um calendário em markdown na página de revisão (cada post vira alvo de comentário).
# Uso: python3 -I calendario/pagina.py calendario/2026-11-16_a_2026-12-31.md saida/calendario/index.html
import sys, re, html, os

ENTRADA, SAIDA = sys.argv[1], sys.argv[2]
md = open(ENTRADA).read()
periodo = re.search(r'^## (.+)$', md, flags=re.M).group(1)

def ricos(s):
    s = html.escape(s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', s)
    return s

def classe(peca):
    p = peca.lower()
    if 'tipo 1' in p: return 't1'
    if 'tipo 2' in p: return 't2'
    if 'estático' in p: return 'est'
    if 'vídeo' in p: return 'vid'
    if 'evento' in p: return 'evt'
    return 'sem'

# ---- cabeçalho: ritmo e os dois estáticos ----
ritmo = re.findall(r'^\| (Segunda|Quarta|Sexta) \| ([^|]+) \| ([^|]+) \|$', md, flags=re.M)
estaticos = md.split('### Os dois estáticos')[1].split('\nSubstitui')[0] if '### Os dois estáticos' in md else ''
alta = re.findall(r'^\d+\. (.+)$', md.split('## O que está em alta')[1].split('\n---')[0], flags=re.M)
pend = re.findall(r'^\d+\. (.+)$', md.split('## Pendências')[1].split('## Fontes')[0], flags=re.M)
fontes = re.findall(r'^- (.+)$', md.split('## Fontes')[1], flags=re.M)
resumo = re.findall(r'^\| ([^|]+) \| (\d+[^|]*) \|$', md.split('## Resumo do período')[1].split('## Pendências')[0], flags=re.M)

# ---- semanas ----
partes = re.split(r'\n## ((?:Esta s|S)emana[^\n]*)\n', md)
cartoes = []
for i in range(1, len(partes), 2):
    titulo, corpo = partes[i], partes[i + 1].split('\n## ')[0]
    nota = ' '.join(l for l in corpo.split('\n') if l and not l.startswith('|') and not l.startswith('---')).strip()
    itens = []
    for linha in corpo.split('\n'):
        if not linha.startswith('| ') or linha.startswith('| Data') or linha.startswith('| ---'): continue
        c = [x.strip() for x in linha.strip('|').split('|')]
        data, peca, tema, angulo, pilar = (c + [''] * 5)[:5]
        cls = classe(peca)
        pid = 'post-' + re.sub(r'\D', '', data) or 'post'
        selo = re.search(r'\*\*\((.+?)\)\*\*', peca)
        pronto = f' <span class="selo">{html.escape(selo.group(1))}</span>' if selo else ''
        peca = re.sub(r'\*\*\(.+?\)\*\*', '', peca).strip()
        itens.append(f'''<article class="post {cls}" data-comment-target id="{pid}">
  <div class="topo"><span class="dia">{ricos(data)}</span><span class="tag">{ricos(peca)}</span></div>
  <h3>{ricos(tema)}{pronto}</h3>
  {f'<p class="angulo">{ricos(angulo)}</p>' if angulo else ''}
  {f'<p class="pilar">{html.escape(pilar)}</p>' if pilar else ''}
  <button type="button" data-comentar>Comentar</button>
</article>''')
    cartoes.append(f'<section class="semana"><h2>{html.escape(titulo)}</h2>'
                   + (f'<p class="nota">{ricos(nota)}</p>' if nota else '')
                   + f'<div class="posts">{"".join(itens)}</div></section>')

def titulo_e_resto(texto):
    m = re.match(r'\*\*(.+?)\*\*:?\s*(.*)', texto.strip())
    return (m.group(1).rstrip(':.'), ricos(m.group(2))) if m else (ricos(texto), '')

bloco_est = ''
if estaticos:
    cards = []
    for l in estaticos.split('\n'):
        if not l.strip().startswith('- '): continue
        nivel2 = l.startswith('  ')
        t, resto = titulo_e_resto(l.strip()[2:])
        if nivel2 and cards: cards[-1][2].append((t, resto))
        else: cards.append((t, resto, []))
    bloco_est = '<section><h2>Os dois estáticos</h2><div class="ritmo dois">' + ''.join(
        f'<div><b>{html.escape(t)}</b><span>{resto}</span>'
        + ''.join(f'<span class="forma"><em>{html.escape(st)}</em> {sr}</span>' for st, sr in subs)
        + '</div>' for t, resto, subs in cards) + '</div></section>'

pagina = f'''<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Calendário Larissa Merola</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gloock&family=Sora:wght@300;400;500;600&display=swap">
<style>
:root{{--bg:#F3EEE6;--fg:#2E332A;--muted:#6B6F63;--line:#DCD4C6;--card:#FFFFFF;--saude:#CCD77F;
--t1:#343B30;--t2:#4D392A;--est:#8C7B6B;--vid:#78856F;--evt:#A08B6B;
--serif:'Gloock',Georgia,serif;--sans:'Sora',system-ui,sans-serif}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#22261F;--fg:#F0ECE4;--muted:#B3B6AA;--line:#3E453A;--card:#2C3228;--t1:#9DAA8F;--t2:#C8AE96;--est:#B6A58F;--vid:#A9B79B;--evt:#D0B88E;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#22261F;--fg:#F0ECE4;--muted:#B3B6AA;--line:#3E453A;--card:#2C3228;--t1:#9DAA8F;--t2:#C8AE96;--est:#B6A58F;--vid:#A9B79B;--evt:#D0B88E;color-scheme:dark}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:15px;line-height:1.5;padding:32px 16px 64px}}
.wrap{{max-width:1180px;margin:0 auto;display:flex;flex-direction:column;gap:40px}}
header{{display:flex;flex-direction:column;gap:12px;border-bottom:1px solid var(--line);padding-bottom:24px}}
h1{{font-family:var(--serif);font-weight:400;font-size:clamp(32px,5vw,52px);line-height:1.04;margin:0}}
.sub{{color:var(--muted);margin:0;max-width:70ch}}
.periodo{{margin:0;font-size:15px;font-weight:500;letter-spacing:.02em}}
.ritmo{{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px}}
.ritmo div{{background:var(--card);border:1px solid var(--line);padding:14px 16px;display:flex;flex-direction:column;gap:6px}}
.ritmo b{{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:600}}
.ritmo span{{font-size:14px}}
.ritmo .forma em{{font-style:normal;font-weight:600}}
.ritmo.dois div{{gap:10px}}
.ritmo.dois .forma{{padding-left:14px;border-left:2px solid var(--line)}}
h2{{font-size:13px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;color:var(--muted);margin:0 0 14px;display:flex;gap:12px;align-items:center}}
h2::after{{content:"";flex:1;height:1px;background:var(--line)}}
.nota{{margin:-6px 0 14px;color:var(--muted);font-size:14px}}
.posts{{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}}
.post{{background:var(--card);border:1px solid var(--line);border-top:5px solid var(--c);padding:16px 18px;display:flex;flex-direction:column;gap:8px;min-width:0}}
.post.t1{{--c:var(--t1)}}.post.t2{{--c:var(--t2)}}.post.est{{--c:var(--est)}}.post.vid{{--c:var(--vid)}}.post.evt{{--c:var(--evt)}}.post.sem{{--c:var(--line);opacity:.7}}
.topo{{display:flex;justify-content:space-between;gap:10px;align-items:baseline;flex-wrap:wrap}}
.dia{{font-weight:600;font-size:13px}}
.tag{{font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--c);text-align:right}}
.post h3{{font-family:var(--serif);font-weight:400;font-size:21px;line-height:1.2;margin:2px 0 0}}
.post h3 b{{font-weight:400}}
.selo{{display:inline-block;font-family:var(--sans);font-size:11px;letter-spacing:.08em;text-transform:uppercase;background:var(--saude);color:#343B30;padding:2px 7px;vertical-align:middle;margin-left:4px}}
.angulo{{margin:0;font-size:14px}}
.pilar{{margin:0;font-size:12px;color:var(--muted);letter-spacing:.04em}}
button{{align-self:flex-start;font:inherit;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:6px 10px;border:1px solid var(--fg);background:transparent;color:var(--fg);cursor:pointer;margin-top:auto}}
button:hover,button:focus-visible{{background:var(--saude);color:#343B30;border-color:var(--saude);outline:none}}
button[hidden]{{display:none}}
ol,ul{{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px;max-width:80ch}}
a{{color:inherit}}
.resumo{{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}}
.resumo div{{background:var(--card);border:1px solid var(--line);border-left:5px solid var(--line);padding:12px 14px}}
.resumo span{{display:block;font-family:var(--serif);font-size:34px;line-height:1}}
@media print{{
  @page{{size:A4;margin:14mm 12mm}}
  :root{{--bg:#fff;--card:#fff;--line:#CFC7B8;--fg:#2E332A;--muted:#5F6358}}
  body{{padding:0;font-size:10.5pt;background:#fff}}
  .wrap{{max-width:none;gap:16pt}}
  h1{{font-size:26pt}}
  h2{{font-size:9pt;margin-bottom:8pt}}
  .posts{{grid-template-columns:repeat(3,1fr);gap:8pt}}
  .ritmo{{grid-template-columns:repeat(3,1fr);gap:8pt}}
  .ritmo.dois{{grid-template-columns:repeat(2,1fr)}}
  .post{{padding:8pt 10pt;gap:4pt;border-top-width:3pt}}
  .post h3{{font-size:12.5pt}}
  .angulo{{font-size:9pt}}
  .pilar{{font-size:8pt}}
  .semana{{break-inside:avoid;page-break-inside:avoid}}
  button{{display:none}}
  a{{text-decoration:none}}
  header{{break-after:avoid}}
  .sub{{display:none}}
  .periodo{{font-size:11pt}}
}}
</style></head><body><div class="wrap">
<header>
<h1>Calendário de postagens</h1>
<p class="periodo">Dra. Larissa Merola · @dralarissamerola · {html.escape(periodo)}</p>
<p class="sub">Cada post tem botão Comentar: clique nele, ou abra o modo de comentários e clique no ponto exato.</p>
<div class="ritmo">{"".join(f'<div><b>{d}</b><span class="forma"><em>{ricos(o)}</em></span><span>{ricos(obs)}</span></div>' for d, o, obs in ritmo)}</div>
</header>
{bloco_est}
<section><h2>O que está em alta agora</h2><ol>{"".join(f"<li>{ricos(a)}</li>" for a in alta)}</ol></section>
{"".join(cartoes)}
<section><h2>Resumo do período</h2><div class="resumo">{"".join(f"<div><span>{q.split()[0]}</span>{html.escape(f)}{(' ' + ' '.join(q.split()[1:])) if len(q.split()) > 1 else ''}</div>" for f, q in resumo)}</div></section>
<section><h2>Pendências</h2><ol>{"".join(f"<li>{ricos(p)}</li>" for p in pend)}</ol></section>
<section><h2>Fontes</h2><ul>{"".join(f"<li>{ricos(f)}</li>" for f in fontes)}</ul></section>
</div>
<script>
(async()=>{{const b=document.querySelectorAll('[data-comentar]');let c=null;
try{{c=await window.claude?.use('comments')}}catch(e){{c=null}}
if(!c){{b.forEach(x=>x.hidden=true);return}}
b.forEach(x=>x.addEventListener('click',async()=>{{try{{await c.openComposer({{element:x.closest('[data-comment-target]')}})}}catch(e){{if(e&&e.code==='unavailable')b.forEach(y=>y.hidden=true)}}}}))}})();
</script></body></html>'''
os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
open(SAIDA, 'w').write(pagina)
print('semanas:', len(cartoes), '| posts:', pagina.count('data-comment-target'))
