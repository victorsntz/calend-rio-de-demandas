#!/usr/bin/env python3
"""Fecha um carrossel pra entrega: as artes em PNG e a legenda em TXT, num zip só.

Uso:  python3 docs/gorayeb/empacota.py <carrossel.json> [pasta de saída]

Roda depois do render. Lê o JSON pra pegar a legenda e junta com os PNGs que
já estão em saida/<id>/. O zip sai com as artes numeradas na ordem do post e
um legenda.txt pronto pra colar no Instagram.
"""
import json
import os
import sys
import zipfile

AQUI = os.path.dirname(os.path.abspath(__file__))


def empacota(spec_path, destino=None):
    spec = json.load(open(spec_path, encoding="utf8"))
    nome = spec.get("id") or os.path.basename(spec_path).removesuffix(".json")
    artes = os.path.join(AQUI, "saida", nome)
    if not os.path.isdir(artes):
        raise SystemExit(f"não achei as artes em {artes}. Roda o render antes.")

    pngs = sorted(f for f in os.listdir(artes) if f.endswith(".png"))
    if not pngs:
        raise SystemExit(f"{artes} está sem PNG nenhum.")

    legenda = spec.get("legenda_instagram", "").strip()
    titulo = spec.get("titulo", nome)
    # cabeçalho curto pra quem abre o txt saber de que peça é, separado da
    # legenda por uma linha de corte, que é o que vai pro Instagram
    texto = (
        f"{titulo}\n"
        f"{len(pngs)} slides · 1080 x 1350\n"
        f"{'-' * 60}\n\n"
        f"{legenda}\n"
    )

    destino = destino or os.path.join(AQUI, "entrega")
    os.makedirs(destino, exist_ok=True)
    zip_path = os.path.join(destino, f"gorayeb-{nome}.zip")

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for i, f in enumerate(pngs, 1):
            z.write(os.path.join(artes, f), f"{nome}/{i:02d}.png")
        z.writestr(f"{nome}/legenda.txt", texto)

    txt_path = os.path.join(destino, f"gorayeb-{nome}-legenda.txt")
    open(txt_path, "w", encoding="utf8").write(texto)

    tamanho = os.path.getsize(zip_path) / 1024 / 1024
    print(f"{zip_path}  ({len(pngs)} artes + legenda, {tamanho:.1f} MB)")
    print(txt_path)
    return zip_path, txt_path


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("uso: python3 docs/gorayeb/empacota.py <carrossel.json> [saída]")
    empacota(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
