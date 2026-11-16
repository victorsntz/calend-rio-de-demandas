#!/usr/bin/env python3
"""Fecha um carrossel pra entrega: as artes em PNG, a legenda e as notas de fonte em TXT, num zip só.

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

    # peça com formatos diferentes (feed e stories) ganha o formato no nome do
    # arquivo, senão quem abre o zip não sabe qual é qual
    formatos = [s.get("formato", "feed") for s in spec.get("slides", [])]
    varios = len(set(formatos)) > 1
    nomes = [
        f"{i:02d}-{formatos[i - 1]}.png" if varios and i <= len(formatos) else f"{i:02d}.png"
        for i in range(1, len(pngs) + 1)
    ]

    MEDIDA = {"stories": "1080 x 1920", "youtube": "1280 x 720"}
    medidas = sorted({MEDIDA.get(f, "1080 x 1350") for f in formatos} or {"1080 x 1350"})

    legenda = spec.get("legenda_instagram", "").strip()
    titulo = spec.get("titulo", nome)
    # cabeçalho curto pra quem abre o txt saber de que peça é, separado da
    # legenda por uma linha de corte, que é o que vai pro Instagram
    texto = (
        f"{titulo}\n"
        f"{len(pngs)} {'artes' if varios else 'slides'} · {' e '.join(medidas)}\n"
        f"{'-' * 60}\n\n"
        f"{legenda}\n"
    )

    # notas de fonte: de onde saiu cada informação e quando a fonte foi
    # publicada. Pedido do Victor em 16/11, pra peça sair amparada.
    notas = spec.get("notas") or []
    if notas:
        texto_notas = (
            f"{titulo}\n"
            f"Notas de fonte\n"
            f"{'-' * 60}\n\n"
            + "\n\n".join(notas).strip() + "\n"
        )

    destino = destino or os.path.join(AQUI, "entrega")
    os.makedirs(destino, exist_ok=True)
    zip_path = os.path.join(destino, f"ftg-{nome}.zip")

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for f, destino_png in zip(pngs, nomes):
            z.write(os.path.join(artes, f), f"{nome}/{destino_png}")
        z.writestr(f"{nome}/legenda.txt", texto)
        if notas:
            z.writestr(f"{nome}/notas-de-fonte.txt", texto_notas)

    txt_path = os.path.join(destino, f"ftg-{nome}-legenda.txt")
    open(txt_path, "w", encoding="utf8").write(texto)

    notas_path = None
    if notas:
        notas_path = os.path.join(destino, f"ftg-{nome}-notas-de-fonte.txt")
        open(notas_path, "w", encoding="utf8").write(texto_notas)

    tamanho = os.path.getsize(zip_path) / 1024 / 1024
    conteudo = "artes + legenda" + (" + notas" if notas else "")
    print(f"{zip_path}  ({len(pngs)} {conteudo}, {tamanho:.1f} MB)")
    print(txt_path)
    if notas_path:
        print(notas_path)
    else:
        print("ATENÇÃO: esta peça não tem 'notas' no JSON. Sem notas de fonte ela não sobe.")
    return zip_path, txt_path


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("uso: python3 docs/gorayeb/empacota.py <carrossel.json> [saída]")
    empacota(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
