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
- `assets/logo-*.png` e `assets/simbolo-ftg.png` — os **logos oficiais**, tirados
  de `ENTREGA › LOGOS E SÍMBOLOS` no Drive. A logo nunca é redesenhada: o render
  só escolhe a versão certa pro fundo (`claro` em chapa escura e foto, `escuro`
  em creme e areia).
- `assets/mapas/mapas.json` — a silhueta do Brasil em path de SVG, em projeção
  de Mercator, derivada do Natural Earth 1:110m (domínio público).
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
| `figura` | `figura` + campos da figura | gráfico, mapa ou números |

### Figuras (`"tipo": "figura"`)

| `figura` | campos | serve pra |
| --- | --- | --- |
| `donut` | `valor` (0–100), `destaque`, `rotulo`, `resto` | uma proporção só |
| `barras` | `itens` de `{rotulo, valor, valorTexto, destaque}` | comparar 2 a 5 grandezas |
| `mapa` | `mapa` (`brasil`), `pontos` de `{lon, lat, raio, rotulo}` | situar no território |
| `numeros` | `itens` de `{numero, rotulo}` | até 4 cifras em diagonal |

Todas aceitam `legenda` (a frase que explica), `fonte` (de onde veio o número) e
`alt` (a descrição pra quem usa leitor de tela).

**Regras das figuras.** No máximo duas cores de dado por figura, o resto neutro.
Toda fatia e toda barra leva rótulo direto, nunca só cor. Um eixo só, nunca dois.
A paleta de dados é dourado `#b8943d` para o destaque, terracota `#a8552c` para o
contraponto e areia `#d4c9aa` para o resto. Esse par foi conferido contra a chapa
verde e passa nos testes de daltonismo e de contraste; qualquer cor nova precisa
passar pelo mesmo teste antes de entrar.

**Número sem fonte não entra na arte.** O contrato com a Gorayeb exige que toda
informação factual seja verificável.

Campos que valem em qualquer slide: `fundo` (`creme`, `areia`, `bordo`; sem
nada sai verde com listras), `foto` (caminho do arquivo) e `veu`
(`verde`, `marrom` ou `topo`, o escurecimento sobre a foto).
