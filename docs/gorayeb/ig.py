#!/usr/bin/env python3
"""Baixa os slides e a legenda de um post do Instagram, pra usar de referência.

Uso:  python3 docs/gorayeb/ig.py "<link do post>" <pasta>

A página normal do post vem vazia pra quem não está logado, e o WebFetch
resolve DNS por fora do proxy e nem enxerga o domínio. O que funciona é o
endpoint de embed, que devolve o JSON com a URL de cada slide.

A rede do ambiente precisa permitir www.instagram.com e os hosts do CDN, que
são do tipo scontent-<regiao>-<n>.cdninstagram.com e mudam de região. Sem o
curinga *.cdninstagram.com o download das artes falha com 403 no proxy, mesmo
com a legenda vindo normalmente.

Depois de baixar, abrir CADA imagem e ler slide a slide. A legenda sozinha não
mostra a estrutura da peça, e foi assim que o carrossel da escala 6x1 saiu mais
pobre que a referência.
"""
import re, json, sys, os, requests
from urllib.parse import urlparse
UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
link, pasta = sys.argv[1], sys.argv[2]
codigo = re.search(r"/(?:p|reel|tv)/([A-Za-z0-9_-]+)", link).group(1)
s = requests.Session(); s.headers["User-Agent"] = UA
html = s.get(f"https://www.instagram.com/p/{codigo}/embed/captioned/", timeout=30).text
m = re.search(r'"contextJSON":"(.*?)"\}\]', html, re.S)
media = json.loads(json.loads(f'"{m.group(1)}"'))["gql_data"]["shortcode_media"]
nos = [e["node"] for e in media.get("edge_sidecar_to_children", {}).get("edges", [])] or [media]
os.makedirs(pasta, exist_ok=True)
leg = media.get("edge_media_to_caption", {}).get("edges", [])
open(f"{pasta}/legenda.txt","w").write(leg[0]["node"]["text"] if leg else "")
print(f"SLIDES: {len(nos)}")
hosts=set(); ok=0
for i, n in enumerate(nos, 1):
    url = n.get("video_url") or n["display_url"]
    hosts.add(urlparse(url).netloc)
    ext = "mp4" if n.get("video_url") else "jpg"
    alvo = f"{pasta}/{i:02d}.{ext}"
    try:
        r = s.get(url, timeout=60); open(alvo,"wb").write(r.content); ok+=1
    except Exception as e:
        print(f"  {i:02d} falhou: {type(e).__name__}")
    # texto alternativo que o Instagram gera: às vezes descreve a arte
    alt = n.get("accessibility_caption")
    if alt: print(f"  {i:02d} alt: {alt[:160]}")
print(f"BAIXADOS: {ok}/{len(nos)}")
print("HOSTS:", ", ".join(sorted(hosts)))
