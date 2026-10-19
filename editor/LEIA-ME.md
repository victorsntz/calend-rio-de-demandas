# Editor de vídeos · Fortunato Estúdio

O Claude Code edita os Reels, vlogs e cortes do estúdio aqui dentro, seguindo o
`ESTILO.md`. Não é um editor de linha do tempo com botão: é uma esteira de
comandos que o Claude dirige e você aprova em três paradas.

## O que tem aqui

```
editor/
├── ESTILO.md          a lei do estilo, escrita pra gente ler
├── estilo.json        a mesma lei em formato de máquina, que as scripts leem
├── CLAUDE.md          como o Claude trabalha neste projeto
├── brutos/            seus vídeos gravados, uma pasta por projeto
├── trabalho/          os intermediários (transcrição, legendas, peças, prévia)
├── renders/           o vídeo pronto
└── .claude/skills/reels-edit/
    ├── SKILL.md       o manual que o Claude lê antes de editar
    ├── references/    fluxo detalhado, catálogo de peças, armadilhas de ffmpeg
    └── scripts/       as nove ferramentas
```

## Começar

Precisa de FFmpeg, Node 20+ e Chromium na máquina. Depois, uma vez só:

```bash
cd editor
node .claude/skills/reels-edit/scripts/fontes.mjs    # baixa a STIX Two Text
node .claude/skills/reels-edit/scripts/grao.mjs      # gera a textura de grão
```

Sem `npm install`, sem conta em lugar nenhum. Só pra transcrever automático é
que entra uma chave da ElevenLabs, em `ELEVENLABS_API_KEY` ou num `.env` aqui
(que não sobe pro GitHub). Sem chave também dá: você escreve os blocos de
legenda na mão.

## Usar

Jogue o vídeo em `brutos/2026-10-19-nome-do-video/` e peça pro Claude editar.
Ele passa por três paradas e espera você em cada uma:

1. **Corte e legenda.** Ele mostra o corte proposto e o texto já limpo, sem
   "né" e sem "tipo", com a ortografia arrumada. Você aprova ou manda mudar.
2. **Roteiro de elementos.** O que entra na tela, segundo a segundo, com as
   peças renderizadas pra você olhar. Você aprova ou manda mudar.
3. **Render.** Prévia rápida primeiro. Com seu aval, o arquivo final em
   `renders/`, já conferido contra o `ESTILO.md`.

Render sem as duas primeiras aprovações não acontece. É regra do projeto.

## As nove ferramentas

| Script | O que faz |
| --- | --- |
| `fontes.mjs` | Baixa a STIX Two Text. |
| `grao.mjs` | Gera a textura de grão de papel. |
| `sonda.mjs` | Olha o bruto e diz o que fazer: HDR, orientação, fps, áudio. |
| `sdr.mjs` | Converte HDR do iPhone pra SDR sem lavar a pele. |
| `transcrever.mjs` | Fala vira texto com tempo por palavra. |
| `legendas.mjs` | Texto vira blocos de 3 a 5 palavras, depois vira PNG e `.srt`. |
| `peca.mjs` | Renderiza qualquer peça do kit: gancho, cartela, pílula, citação, lista, número, assinatura, monograma, imagem. |
| `montar.mjs` | Monta o vídeo a partir do roteiro em JSON. |
| `conferir.mjs` | O fiscal: cobra o `ESTILO.md` antes de você postar. |

## O fiscal

O `conferir.mjs` é o que separa "ficou bonito" de "está no estilo". Ele mede:

- **O arquivo:** 1080x1920, 30 fps, H.264, AAC, cor bt709, duração e volume.
- **O texto:** travessão, emoji, palavra de texto de IA, o molde "não é sobre X,
  é sobre Y", caixa alta fora de rótulo, ênfase verde a mais.
- **As peças:** se o texto caiu fora da zona segura do Instagram, se tem dois
  verdes na tela ao mesmo tempo.

Achou alguma, ele sai com erro e diz qual é. Passou limpo, pode postar.

## Mudar o estilo

O `ESTILO.md` manda. Mudou uma regra lá, mude o número correspondente no
`estilo.json` e as nove ferramentas já saem obedecendo. Diga "salva isso" pro
Claude e ele escreve nos dois, anota na seção 9 do `ESTILO.md` e faz o commit.

## O que ainda falta no ESTILO.md

- **Seção 8, Referências:** vazia. Entram de 3 a 5 vídeos, e pra cada um o que
  roubar (o princípio) e o que deixar (o visual que é dele).
- **Seção 9, Notas:** vazia, e é assim mesmo. Ela cresce a cada vídeo editado.
