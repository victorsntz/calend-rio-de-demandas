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

**Viúva não passa.** O render costura as duas últimas palavras de cada linha
com espaço rígido, então nunca sobra palavra sozinha fechando um bloco. Em
título, tese, citação e frase curta a costura é mais firme: preposição e artigo
grudam na palavra seguinte. Se mesmo assim a quebra ficar feia, o jeito é
encurtar a frase ou marcar a quebra na mão com uma quebra de linha no JSON.

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
| `capa-foto` | `foto`, `etiqueta`, `titulo`, `sub`, `escala` | capa de foto cheia |
| `corpo-foto` | `foto`, `titulo` (2 linhas), `paragrafos` | foto em cima, chapa embaixo |
| `perspectiva` | `foto`, `itens`, `guia`, `titulo`, `fonte` | cifras deitadas no plano da foto |
| `figura` | `figura` + campos da figura | gráfico, mapa ou números |

### Os três modelos de foto

- **`capa-foto`**: foto sangrando, logo no alto, etiqueta de assunto e título
  no pé, com uma linha de apoio. `*assim*` engrossa a palavra que pesa.
- **`corpo-foto`**: foto na metade de cima, chapa verde embaixo com a marca
  F.T.G. em opacidade baixa. O título tem duas linhas: a primeira em regular,
  a segunda em bold itálico. Use `\n` pra separar.
- **`perspectiva`**: as cifras deitam no plano da foto. O campo `guia` controla
  a diagonal: `x0,y0` onde começa, `x1,y1` onde termina (em % do slide),
  `giro` e `incl` a inclinação, `escala0` e `escala1` o tamanho de quem está
  perto e de quem está longe. Escolha uma foto com perspectiva clara, como
  lavoura em curva de nível ou estrada se afastando.

### Fundos

Nenhum fundo é padrão em todo slide: a graça é variar dentro do carrossel.

| campo | valores |
| --- | --- |
| `fundo` | `offwhite`, `branco`, `creme`, `areia`, `bordo`, `marrom`; sem nada sai verde |
| `textura` | `listras`, `marca`, `marca-baixo`, `marca-esq` |
| `borda` | `dourada`, `bordo` |
| `foto` | caminho do arquivo, com `veu` em `verde`, `marrom` ou `topo` |
| `meiaFoto` | `true` põe a foto na metade de cima e o texto na de baixo |
| `foco` | `object-position` da foto em `meiaFoto` e `corpo-foto`, p. ex. `center 14%`, pra não cortar rosto |

### Figuras (`"tipo": "figura"`)

| `figura` | campos | serve pra |
| --- | --- | --- |
| `donut` | `valor` (0–100), `destaque`, `rotulo`, `resto` | uma proporção só |
| `barras` | `itens` de `{rotulo, valor, valorTexto, destaque}` | comparar 2 a 5 grandezas |
| `mapa` | `mapa` (`brasil`), `pontos` de `{lon, lat, raio, rotulo}` | situar no território |
| `numeros` | `itens` de `{numero, rotulo}` | até 4 cifras em diagonal |
| `tabela` | `colunas` (2) e `linhas` de `{criterio, a, b}` | comparar dois cenários |
| `cerca` | `rotuloA`, `rotuloB` | meio a meio de uma divisa, desenhado como cerca |

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

## Escolha de foto

Ordem de preferência: banco da Gorayeb primeiro, Pinterest depois. O banco está
no Drive, em `BANCO DE ARQUIVOS › FOTOS GORAYEB`, com Fernando, equipe,
escritório e as aplicações da marca. Essas podem publicar sem ressalva.

Buscando no Pinterest, o termo precisa dizer Brasil: *"fazenda brasileira
cerrado mineiro"* traz o que a gente quer, *"fazenda cerca"* traz Meio-Oeste
americano. Depois de baixar, abra em tamanho cheio e descarte duas coisas:

1. **Marca d'água** de banco de imagem ou assinatura de fotógrafo.
2. **Cara de IA**, que no agro é epidemia: madeira uniforme demais, gado
   simétrico, telhado regular demais, luz sem direção.

A procedência de tudo fica em `img/_creditos.json`.

Campos que valem em qualquer slide: `fundo` (`creme`, `areia`, `bordo`; sem
nada sai verde com listras), `foto` (caminho do arquivo) e `veu`
(`verde`, `marrom` ou `topo`, o escurecimento sobre a foto).
