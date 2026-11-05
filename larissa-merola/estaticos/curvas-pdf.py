# PDF em curvas a partir de um PDF do Chromium (page.pdf): o MuPDF reescreve cada página como SVG com o texto
# em caminhos, o cairosvg volta pra PDF e o pypdf junta. Sem fonte embutida no resultado.
# Uso: python3 -I estaticos/curvas-pdf.py entrada.pdf saida.pdf
import sys, re, warnings
warnings.filterwarnings('ignore')
import pymupdf, cairosvg
from pypdf import PdfReader, PdfWriter
ent, sai = sys.argv[1], sys.argv[2]
w = PdfWriter()
for i, page in enumerate(pymupdf.open(ent)):
    svg = page.get_svg_image(matrix=pymupdf.Identity, text_as_path=True)
    svg = re.sub(r'width="([\d.]+)"', r'width="\1pt"', svg, count=1); svg = re.sub(r'height="([\d.]+)"', r'height="\1pt"', svg, count=1)   # pt, não px
    tmp = f'{sai}.p{i + 1}.pdf'; cairosvg.svg2pdf(bytestring=svg.encode(), write_to=tmp); w.append(PdfReader(tmp))
w.write(sai)
r = PdfReader(sai); print(sai, len(r.pages), 'páginas, fontes:', [p.get('/Resources', {}).get('/Font') for p in r.pages])
