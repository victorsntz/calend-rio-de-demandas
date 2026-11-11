# Logo Elo Lipedema em curvas: cada letra vira <path> a partir das fontes (Gloock, Sora), nas posições que o
# Chromium usou pra renderizar estaticos/elo-logo.html (medidas em medidas-logo.json). Sai SVG + PDF sem fonte.
# Uso: python3 -I estaticos/elo-curvas.py <medidas.json> <saida/> <conjunto: marca|aprovada>
#   marca = Gloock + Sora (fontes da marca); aprovada = Liberation Serif + Inter, o que o Chromium usou nos mockups
#   enquanto o fonts.css apontava pra pasta errada (corrigido em 03/11).
import sys, json, re, os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
import cairosvg
from pypdf import PdfWriter, PdfReader

med = json.load(open(sys.argv[1])); out = sys.argv[2]; conjunto = sys.argv[3] if len(sys.argv) > 3 else 'marca'; os.makedirs(out, exist_ok=True)
CONJUNTOS = {'marca': {'elo': 'capa/fonts/87c6a93957.woff2', 'lipedema': 'capa/fonts/b017102516.woff2', 'por': 'capa/fonts/8c16347094.woff2'},
             'aprovada': {'elo': '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf', 'lipedema': '/usr/share/fonts/opentype/inter/Inter-Light.otf', 'por': '/usr/share/fonts/opentype/inter/Inter-Medium.otf'}}
FONTES = CONJUNTOS[conjunto]
MUSGO, SAUDE, BRANCO = '#343B30', '#CCD77F', '#FFFFFF'

def ascent_usado(t, fs, h):
    upm = t['head'].unitsPerEm; o = t['OS/2']; hh = t['hhea']
    pares = [(hh.ascent, -hh.descent), (o.sTypoAscender, -o.sTypoDescender), (o.usWinAscent, o.usWinDescent)]
    return min(pares, key=lambda p: abs((p[0] + p[1]) * fs / upm - h))[0]

def texto_paths(chave):
    d = med[chave]; t = TTFont(FONTES[chave]); upm = t['head'].unitsPerEm; cmap = t.getBestCmap(); gs = t.getGlyphSet()
    fs = d['fs']; asc = ascent_usado(t, fs, d['chars'][0]['h']); k = fs / upm; paths = []
    for c in d['chars']:
        ch = c['ch'].upper()
        if ch == ' ': continue
        g = gs[cmap[ord(ch)]]; pen = SVGPathPen(gs)
        base_y = c['top'] + asc * k
        g.draw(TransformPen(pen, (k, 0, 0, -k, c['x'], base_y)))   # escala + espelha y + origem na linha de base
        paths.append(pen.getCommands())
    return ' '.join(paths)

iso_src = open('capa/isotipo.svg').read()
iso_paths = ''.join(re.findall(r'<path[^>]*/>', iso_src))
iso_paths = re.sub(r'\sfill="[^"]*"', '', iso_paths)
vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', iso_src).group(1).split()]
i = med['iso']; esc = i['h'] / vb[3]; esc_w = i['w'] / vb[2]; esc = min(esc, esc_w)
iso_tx = i['x'] + (i['w'] - vb[2] * esc) / 2 - vb[0] * esc; iso_ty = i['y'] + (i['h'] - vb[3] * esc) / 2 - vb[1] * esc
r = med['risco']

elementos = {
    'simbolo': f'<g id="simbolo" transform="translate({iso_tx:.3f} {iso_ty:.3f}) scale({esc:.5f})">{iso_paths}</g>',
    'elo': f'<path id="elo" d="{texto_paths("elo")}"/>',
    'lipedema': f'<path id="lipedema" d="{texto_paths("lipedema")}"/>',
    'risco': f'<rect id="risco" x="{r["x"]}" y="{r["y"]:.2f}" width="{r["w"]}" height="{r["h"]}"/>',
    'por': f'<path id="por" d="{texto_paths("por")}"/>',
}
# caixa da arte (px do canvas 3000) com margem; largura física: ELO = 160 mm
PX_MM = 160 / (med['elo']['chars'][-1]['x'] + med['elo']['chars'][-1]['w'] - med['elo']['chars'][0]['x'])
x0, y0 = 500, 520; x1, y1 = 2500, 2480
W_mm, H_mm = (x1 - x0) * PX_MM, (y1 - y0) * PX_MM

def svg(cor, fundo=None, so=None):
    corpo = ''.join(v for k, v in elementos.items() if so is None or k in so)
    bg = f'<rect x="{x0}" y="{y0}" width="{x1-x0}" height="{y1-y0}" fill="{fundo}"/>' if fundo else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0} {y0} {x1-x0} {y1-y0}" width="{W_mm:.2f}mm" height="{H_mm:.2f}mm">'
            f'{bg}<g fill="{cor}">{corpo}</g><g fill="{SAUDE}"><use href="#risco"/></g></svg>')
# o risco fica verde-saúde nas duas versões; `elementos['risco']` é desenhado na cor da arte e coberto pelo <use>

versoes = [('01-arte-musgo-sem-fundo', MUSGO, None), ('02-arte-branca-sem-fundo', BRANCO, None),
           ('03-arte-musgo-fundo-branco', MUSGO, BRANCO), ('04-arte-branca-fundo-musgo', BRANCO, MUSGO)]
pdfs = []
for nome, cor, fundo in versoes:
    s = svg(cor, fundo); open(f'{out}/elo-camiseta-{nome}.svg', 'w').write(s)
    pdf = f'{out}/elo-camiseta-{nome}.pdf'; cairosvg.svg2pdf(bytestring=s.encode(), write_to=pdf); pdfs.append(pdf)
    cairosvg.svg2png(bytestring=s.encode(), write_to=f'{out}/elo-camiseta-{nome}.png', output_width=1500,
                     background_color=None if fundo else (MUSGO if cor == BRANCO else BRANCO))
w = PdfWriter()
for p in pdfs: w.append(PdfReader(p))
w.add_metadata({'/Title': 'Elo Lipedema, arte da camiseta em curvas', '/Author': 'Fortunato Estúdio'})
w.write(f'{out}/elo-camiseta-curvas.pdf')
# recortes por elemento pra revisão
caixas = {'simbolo': (i['x'], i['y'], i['w'], i['h']), 'elo': None, 'lipedema': None, 'risco': (r['x'], r['y'], r['w'], r['h']), 'por': None}
for ch in ['elo', 'lipedema', 'por']:
    cs = med[ch]['chars']; caixas[ch] = (cs[0]['x'], cs[0]['top'], cs[-1]['x'] + cs[-1]['w'] - cs[0]['x'], cs[0]['h'])
for k, (cx, cy, cw, chh) in caixas.items():
    m = 60; vbx = f'{cx-m} {cy-m} {cw+2*m} {chh+2*m}'
    s = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vbx}"><rect x="{cx-m}" y="{cy-m}" width="{cw+2*m}" height="{chh+2*m}" fill="{BRANCO}"/><g fill="{MUSGO}">{elementos[k]}</g>{"" if k != "risco" else ""}</svg>'
    if k == 'risco': s = s.replace(f'fill="{MUSGO}"', f'fill="{SAUDE}"')
    cairosvg.svg2png(bytestring=s.encode(), write_to=f'{out}/elemento-{k}.png', output_width=900)
print('arte', f'{W_mm:.1f} x {H_mm:.1f} mm', 'escala', PX_MM, 'mm/px; bloco (símbolo ao "por"):', f'{(med["por"]["chars"][0]["top"] + med["por"]["chars"][0]["h"] - i["y"]) * PX_MM:.1f} mm de altura')
