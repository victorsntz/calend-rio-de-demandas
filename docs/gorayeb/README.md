# Carrosséis da Gorayeb — como rodar

```bash
node docs/gorayeb/render.mjs docs/gorayeb/carrosseis/<nome>.json
```

Sai em `docs/gorayeb/saida/<nome>/pag-01.png`… em 1080 × 1350.

## O que tem aqui

- `guia-de-conteudo.md` — o reconhecimento da pasta do Drive: paleta, tipografia,
  anatomia dos carrosséis, as duas vozes e o que já foi publicado.
- `template/base.css` — os tokens da marca, as listras verdes, a escala
  tipográfica e o lockup F|G. É aqui que se mexe no visual.
- `assets/ftg-marca.png` — o jugo da marca, extraído do `Asset 51.png` do Drive.
  No lockup ele arqueia sobre o F e o G, e a haste vertical faz o traço entre
  as duas letras.
- `fontes/` — Arvo (títulos, slab) e Helvetica Neue (corpo).
- `carrosseis/*.json` — um arquivo por carrossel, com os slides e a legenda.

## O JSON de um carrossel

```jsonc
{
  "id": "nome-da-pasta-de-saida",
  "titulo": "Título interno, não entra na arte",
  "legenda_instagram": "A legenda do post.",
  "slides": [ { "tipo": "capa", "titulo": "...", "gancho": "..." } ]
}
```

Em qualquer campo de texto: `_assim_` sublinha a expressão, `*assim*` engrossa,
e a quebra de linha vira quebra de linha na arte.

### Tipos de slide

| tipo | campos | serve pra |
| --- | --- | --- |
| `capa` | `titulo`, `gancho`, `escala`, `arraste` | abrir o carrossel |
| `tese` | `tese`, `texto` | a frase-chave entre os dois fios dourados |
| `foto-texto` | `titulo`, `texto` | foto com overlay e um bloco curto |
| `citacao` | `citacao` | a fala em itálico dentro da caixa de borda fina |
| `lista` | `titulo`, `itens`, `remate` | até quatro itens, um por linha |
| `dado` | `numero`, `leitura`, `texto` | um número grande com a leitura embaixo |
| `fecho` | `sintese`, `cta` | fechar com assinatura e lockup |

Campos que valem em qualquer slide: `fundo` (`creme`, `areia`, `bordo`; sem
nada sai verde com listras), `foto` (caminho do arquivo) e `veu`
(`verde`, `marrom` ou `topo`, o escurecimento sobre a foto).
