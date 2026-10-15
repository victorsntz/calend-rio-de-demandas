# Gorayeb Advocacia — guia de conteúdo (carrosséis e estáticos)

Reconhecimento feito em 14/out/2026 sobre a pasta do Drive
`Agência › Gorayeb Advocacia › CRIATIVOS` (março a outubro de 2026, 473 arquivos
em 64 pastas). Serve de base para produzir aqui carrosséis e estáticos novos,
na mesma linguagem, sem repetir o que já foi publicado.

## 1. Quem é o cliente (contexto que muda o texto)

- Escritório de advocacia **do agro**, sede em Araguari (MG), atuação no
  Triângulo Mineiro, sul de Goiás e Mato Grosso. Fundado em 2000 no MT.
- Rosto da marca: **Dr. Fernando Torbay Gorayeb** (sócio-fundador, advogado e
  produtor rural). Segundo personagem: **Seu Roberto Gorayeb**, pai, advogado
  desde 1970, 80 anos. Terceira: **Jéssica**, esposa e sócia administradora.
- Marca **F.T.G.** = iniciais do Fernando, e também Fidelidade, Transparência,
  Genialidade. Era a marca do gado da família antes de ser a do escritório.
  "Marcar é deixar nome" é o mito fundador que aparece em tudo.
- Assinatura obrigatória de todo conteúdo: **"Do agro. Pelo agro."**
- Áreas que viram pauta: direito agrário, sucessão e holding rural, CAR e
  crédito rural, contratos (arrendamento, parceria, CPR), tributário (ITR,
  VTN), recuperação judicial do produtor, seguro rural, fraudes contra o
  produtor, regularização fundiária e georreferenciamento, comércio exterior.
- Limites da OAB (estão no contrato): conteúdo informativo e educativo, sem
  promessa de resultado, sem "melhor/maior/líder", sem honorários, sem citar
  caso de cliente. Toda informação factual precisa ser verificável e, quando
  couber, citar a lei. **Nenhuma imagem gerada por IA simulando escritório,
  fazenda ou pessoas reais do cliente.**

## 2. Identidade visual (marca nova, em uso desde jun/2026)

Formato único: **1080 × 1350 px (4:5)**, PNG.

### Paleta (hex medidos nas peças)

| Papel | Cor | Hex |
| --- | --- | --- |
| Verde mata (fundo principal dos slides de texto) | ![](https://placehold.co/16/162211/162211) | `#162211` (variações `#172212`, `#1a2217`) |
| Creme (fundo claro alternativo e texto sobre verde) | ![](https://placehold.co/16/ebe3c8/ebe3c8) | `#ebe3c8` |
| Areia (creme mais escuro, fundo de slide) | ![](https://placehold.co/16/d4c8a8/d4c8a8) | `#d4c8a8` |
| Dourado (linhas, logo F.T.G., pílulas de CTA) | ![](https://placehold.co/16/b9953e/b9953e) | `#b9953e` (caixa de CTA `#8a6f32`) |
| Bordô terra (fundo de impacto) | ![](https://placehold.co/16/380f00/380f00) | `#380f00` |
| Marrom café (overlay sobre foto, caixas de CTA escuras) | ![](https://placehold.co/16/431a0a/431a0a) | `#431a0a` |
| Terracota (fundo de citação, jul) | ![](https://placehold.co/16/6b2d14/6b2d14) | `#6b2d14` |
| Verde-oliva (destaque de palavra, raro) | ![](https://placehold.co/16/5f7a3a/5f7a3a) | `~#5f7a3a` |

**Listras verdes** (o elemento da marca, do `Asset 51.png` do Drive): faixas
verticais alternando `#121610` e `#1b2217`. No arquivo original de 2161 px de
largura o período é 468 px, na proporção escuro 108 / claro 39 / escuro 108 /
claro 213. Em peça de 1080 px isso vira um período de 234 px. Está montado em
`template/base.css` na classe `.listras`.

**Marca F.T.G.**: o jugo dourado arqueia sobre as letras F e G, e a haste
vertical faz o traço entre elas. O símbolo isolado está em
`assets/ftg-marca.png`, extraído do mesmo arquivo da marca.

Regras de uso observadas:
- O verde é a base. Creme e bordô entram para quebrar o ritmo (1 a 2 slides
  por carrossel). Branco puro só em linha fina de caixa e em legenda sobre foto.
- Fundo verde às vezes leva **listras verticais sutis** (textura de madeira)
  e o fechamento usa **textura de grão de soja em creme**.
- Foto sempre com **overlay escuro** (verde ou marrom) para o texto creme ler.

### Tipografia

- **Títulos**: **Arvo Bold**, caixa alta, tracking apertado (confirmado pelo
  Victor em 15/out, arquivos em `fontes/arvo/`).
- **Subtítulos e frases-chave**: a mesma slab em regular, caixa baixa,
  frequentemente com **sublinhado** na expressão que importa
  ("não espera", "vira briga", "financiamento travado").
- **Citações**: slab em itálico dentro de caixa de borda fina e cantos
  arredondados.
- **Corpo**: **Helvetica Neue** (Light para texto corrido, Bold para o que
  precisa pesar), em blocos curtos sobre foto. Em slides de dado (mapa,
  números) o corpo é a slab regular. Arquivos em `fontes/helvetica/`.
- **Assinatura**: "Do agro, pelo agro." em slab regular pequeno. Fica no
  rodapé (centro ou direita) ou no topo esquerdo (estáticos de julho).
- **@gorayebadvocacia** em slab regular pequeno, topo centralizado nos slides
  internos; rodapé esquerdo nos estáticos.

### Logo

Monograma **F|G com chifres** mais "GORAYEB ADVOCACIA" em sans bold caixa
alta. Dourado sobre fundo escuro, verde escuro sobre creme. Aparece só na capa
(topo centralizado) e no último slide. Nos slides internos não entra.

## 3. Anatomia de um carrossel (padrão set/out, 9 a 11 slides)

1. **Capa**: foto cheia (campo, escritório, objeto simbólico) + título em slab
   caixa alta em 2 a 3 linhas, uma palavra em corpo maior + sublinha com o
   gancho dentro de caixa de borda fina + pílula "Arrasta pro lado ▶" + logo.
2. **Contexto** (foto + texto curto, 2 frases): a dor ou o mito.
3. **Virada** (slide de texto sobre verde): uma frase-tese entre duas linhas
   douradas, depois 1 parágrafo em sans.
4. **Pergunta/citação** (foto + caixa itálica): "O que é X e por que fazer Y".
5. a 8. **Desenvolvimento**: alterna foto com bloco de texto justificado e
   slide flat (verde ou creme) com título bold + lista ou parágrafo. Cada slide
   carrega **uma ideia só**.
9. **Caminhos/solução** (creme): "Existem caminhos pra isso:" + lista curta +
   "Cada família tem o seu."
10. **Reenquadre** (foto): "Planejar não é pensar na morte. É proteger quem
    fica."
11. **Fechamento** (creme com textura de soja): frase de síntese em slab bold +
    caixa de CTA ("Segue a gente e cuide do futuro de quem você ama." /
    "Segue o perfil e vem junto.") + "DO AGRO, PELO AGRO." + logo.

Estáticos seguem o mesmo DNA em um quadro: fundo flat (verde, bordô ou creme),
frase de 2 linhas em slab (primeira linha regular, segunda em bold caixa alta,
ou o contrário), uma linha dourada acima e abaixo, assinatura e @ no rodapé.
Datas comemorativas usam foto real da equipe + "11/08 Dia do Advogado".

## 4. Linguagem

Duas vozes, mesmo conteúdo:

**Instagram (legendas e slides)**: conversa de porteira. "A gente", "pra",
"tá", "Seu Roberto", "calma, lavrador". Frases curtas, uma por linha. Metáforas
do campo para explicar direito ("a mesma lógica de quem cerca a propriedade e
tranca a porteira: cuidar antes, pra não remediar depois"). Humor leve e
afetivo, nunca piada com a lei. Fecha sempre com "Do agro. Pelo agro." e, nos
carrosséis, um CTA de salvar/compartilhar ("Salva esse post e manda pra aquele
amigo que tá penando com o CAR").

**LinkedIn (arquivo `legendas_gorayeb_linkedin_tom_tecnico.txt`)**: versão
técnica do mesmo post. Cita artigo de lei, resolução e número. Sem gíria,
sem emoji, 4 hashtags no fim. Mesma assinatura.

Fórmulas de título que se repetem (e funcionam):
- Contraste em duas frases: "Dinheiro perdido volta. Terra perdida, quase nunca."
- Negação + correção: "Não é por falta de trabalho. Por falta de planejamento."
- Provérbio novo: "No agro, quem se antecipa protege. Quem espera, remedia."
- Pergunta direta: "Cancelaram seu CAR?", "Sua terra é sua no papel?"
- Diagnóstico de moda: "Holding rural virou moda. E com a moda, veio um monte
  de bobagem."

Palavras-âncora: terra, porteira, lida, patrimônio, família, geração, papel,
gaveta, safra, calendário da fazenda, "da porteira pra dentro / pra fora".

## 5. O que já foi publicado (não repetir sem ângulo novo)

Carrosséis: CAR cancelado (jun) · Equipe (jul) · Trajetória (jul) · Embrapa
(jul) · Adir Leonel e o Nelore (ago) · Arroba do boi (ago) · Planejamento
patrimonial e sucessão (ago) · Seguro rural, negativas (ago) · Tarifas dos EUA
(ago) · Endividado não é falido (ago) · Crédito rural travado e CAR (ago) · Sua
terra é sua no papel? georreferenciamento (ago) · CAR em dia (ago) ·
Arrendamento, 5 cláusulas (set) · Carteira em números (set) · Golpe no produtor
(set) · Cerrado Mineiro, café e IG (set) · DITR 2026 (set) · Endividamento em
Minas, 20 municípios (set) · Alerta de fraude com o nome do escritório (set) ·
Mitos da holding rural (set) · O que significa F.T.G. (set).

Estáticos: 9 frases de posicionamento ("Patrimônio de uma vida não se protege
com improviso", "Quem não conhece a lida, não entende a causa", "A terra não
espera", "Contrato bom não é desconfiança") + datas (Mães, Pecuarista,
Agricultor, Pais, Advogado, Cliente) + série de setembro ([01-09] a [09-09]).

Reels: 14 cortes do podcast com o Seu Roberto (ago) e 7 cortes anteriores (jul).

## 6. Onde está cada coisa no Drive (ids de pasta)

- CRIATIVOS: `1Y82l_m9TR6O10NXjt8ftqpoFMeVIoOGd`
- Junho `1CbYJGOIBOnTeqiPLFCDvtsnXPWLMxTrg` · Julho `1xcZO8_mG9AsZstA7xFkPmcUStsWvK203`
  · Agosto `1LanAf_Pg2pddnhOaWSl71ebr6wcnlyBP` · Setembro `1am3P2zOr2YCoTSU7hSAkQF43blnLZAsa`
  · Outubro `1ozMa5T_zVTGtXNw4PZVVw4CRPNXnv1Fo` (só "Legendas Linkedin", espelho de jun a set)
- Cada mês tem CARROSSÉIS / ESTÁTICOS / REELS; cada carrossel é uma subpasta
  com `pág N.png` (ou `tela N.png`) e, quando existe, `legenda.txt`.
- Marca nova (arquivo aberto): `Prelúdio/Gorayeb.ai`. Marca antiga (2019, não
  usar): `BANCO DE ARQUIVOS/MARCA BRUNO DESIGNER`.
- Fotos reais para usar: `BANCO DE ARQUIVOS/FOTOS GORAYEB`, `FOTOS GORAYEB
  IMERSÃO`, `FOTOS SELEÇÃO`.

## 7. Como diferenciar o que vamos fazer aqui

Extensão combinada com o Victor: **5 a 7 slides por carrossel**, contra os 9 a
11 das peças de setembro.

Decisões sugeridas para os novos carrosséis (a confirmar com o Victor):
- Manter paleta, slab e assinatura. Isso é a marca, não o template.
- Mudar o esqueleto: abrir com o **dado ou a cena**, não com o título; usar o
  bordô como slide de "alerta" único no meio; fechar com uma pergunta ao
  leitor em vez de "segue a gente".
- Um recurso visual novo por carrossel (mapa, linha do tempo, antes/depois,
  comparação em duas colunas), sempre com a mesma gramática de linhas douradas.
- Texto nos slides ainda mais curto que o atual (máx. 2 frases por slide) e
  a legenda assume a explicação.
