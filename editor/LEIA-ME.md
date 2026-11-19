# Editor de vídeos · Norte Sul

O Claude Code edita os vídeos da Norte Sul aqui dentro, seguindo o `ESTILO.md`.
Não é um editor de linha do tempo com botão: é uma esteira de comandos que o
Claude dirige e você aprova em três paradas.

## O que tem aqui

```
editor/
├── ESTILO.md          a lei do estilo, escrita pra gente ler
├── estilo.json        a mesma lei em formato de máquina, que as scripts leem
├── CLAUDE.md          como o Claude trabalha neste projeto
├── marca/             os logotipos, clara, escura e compacta
├── brutos/            material bruto; brutos/acervo/ tem as fotos de 1985 a 2026
├── trabalho/          roteiro, legendas, peças e prévia de cada projeto
├── renders/           o vídeo pronto
└── .claude/skills/editar-video/
    ├── SKILL.md       o manual que o Claude lê antes de editar
    ├── references/    fluxo detalhado, catálogo de peças, armadilhas de ffmpeg
    └── scripts/       as dez ferramentas
```

## Começar

Precisa de FFmpeg, Node 20+ e Chromium na máquina. Depois, uma vez só:

```bash
cd editor
node .claude/skills/editar-video/scripts/fontes.mjs
```

### A fonte

A marca usa **Helvetica Neue**, que é paga da Monotype e não pode viajar no
repositório. Copie os arquivos pra `editor/.fontes/` com estes nomes:

```
HelveticaNeue-Roman.otf      (ou -Regular)
HelveticaNeue-Medium.otf
HelveticaNeue-Bold.otf
HelveticaNeue-Italic.otf     (opcional)
HelveticaNeue-BoldItalic.otf (opcional)
```

Enquanto ela não estiver lá, a esteira roda com a **Inter**, que é a substituta
declarada no ESTILO. Dá pra aprovar layout, ritmo e texto. Mas o fiscal reprova
a entrega: nenhum arquivo vai pro telão com a fonte trocada.

## Usar

Peça pro Claude montar o vídeo. Ele passa por três paradas e espera você em cada:

1. **Corte e legenda.** Os tempos e o texto da tela.
2. **Roteiro de elementos.** O que entra na tela, segundo a segundo, com as peças
   renderizadas pra você olhar.
3. **Render.** Prévia rápida primeiro. Com seu aval, o arquivo final em
   `renders/`, já conferido contra o `ESTILO.md`.

Render sem as duas primeiras aprovações não acontece. É regra do projeto.

## O projeto em andamento

`trabalho/institucional-fenasan/` tem o institucional de 2min30 pro telão da
FENASAN 2026. O `roteiro.json` é o roteiro do cliente em formato de máquina;
mude lá e rode o `roteiro.mjs` de novo, nunca edite os derivados na mão.

## As dez ferramentas

| Script | O que faz |
| --- | --- |
| `fontes.mjs` | Procura a Helvetica Neue; sem ela, baixa a Inter. |
| `roteiro.mjs` | Abre o roteiro e escreve legendas, peças e montagem. |
| `sonda.mjs` | Olha o bruto e diz o que fazer: HDR, orientação, fps, áudio. |
| `sdr.mjs` | Converte HDR do iPhone pra SDR sem lavar a pele. |
| `transcrever.mjs` | Fala vira texto com tempo por palavra. |
| `legendas.mjs` | Blocos de legenda viram PNG e `.srt`. |
| `peca.mjs` | Renderiza qualquer peça do kit. |
| `montar.mjs` | Monta o vídeo a partir do roteiro em JSON. |
| `conferir.mjs` | O fiscal: cobra o `ESTILO.md` antes de você entregar. |
| `testar.mjs` | A esteira inteira num bruto de mentira. |

## O fiscal

O `conferir.mjs` é o que separa "ficou bonito" de "está no estilo". Ele mede:

- **A fonte:** se o render sairia com a substituta. Isso sozinho reprova.
- **O arquivo:** 1008x672, 30 fps, H.264, AAC, cor bt709.
- **O loop:** se o primeiro e o último quadro batem, pra rodar em laço no telão.
- **O texto:** travessão, emoji, palavra de texto de IA, dois destaques amarelos juntos.
- **A cobertura:** buraco de legenda acima de 1,5 s, porque o telão toca mudo.
- **As peças:** se o texto caiu fora da zona segura do painel.

Achou alguma, ele sai com erro e diz qual é. Passou limpo, pode entregar.
