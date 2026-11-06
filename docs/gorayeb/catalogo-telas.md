# Catálogo de telas da FTG, nova IDV

Pedido do Victor em 06/11: guardar os modelos de tela que temos e fazer sempre
o rodízio deles. A versão visual, com as miniaturas, é o artefato
"FTG Advogados · catálogo de telas" (https://claude.ai/artifact/9Z1of5nyHDzmx6DgnkNFmP).
Os dados ficam em `catalogo/catalogo.json` e `catalogo/rodizio.json`, as
miniaturas em `catalogo/<código>.jpg` e os modelos feitos fora do template em
`modelos/` (HTML renderizado com `node modelos/foto.cjs <html> "<ids>" <pasta>`;
os caminhos `file://` dentro deles apontam pra fotos e fontes e precisam ser
ajustados na sessão que for usar).

## Regras do rodízio

- **Capa:** nunca o mesmo modelo nos últimos 3 posts. Entre os que podem, vai o
  que está há mais tempo sem sair.
- **C7 mapa** só quando a pauta é território. **C3 objeto desenhado** só quando
  existe coisa concreta pra desenhar. **CF** só o institucional fixado.
- **Miolo:** nenhum modelo duas vezes seguidas; pelo menos uma figura (M2, M8
  ou M9) por carrossel; no máximo duas telas com foto (M6, M7) por post.
- Nada passa por cima de rosto. Tela vazia não passa.

## Modelos

### Capa

- **C1 · Foto em cartão.** Pauta com uma boa foto de cenário. Foto em cartão arredondado em cima, título grande com peso misturado embaixo, fundo creme. Como: HTML (modelos/mapa-pinos-e-capa-cartao.html, #bpc1). Já usado: BPC 11/11.
- **C2 · Foto escurecendo.** Foto de paisagem que segura a metade de cima; o texto entra na parte escura. Serve pra capa e pra estático. Como: HTML (modelos/capa-escurece.html). Já usado: Georreferenciamento 13/11.
- **C3 · Objeto desenhado.** Quando a pauta tem uma coisa concreta (documento, cerca, porteira) e não há foto boa. Fundo creme, o objeto desenhado em destaque. Como: HTML (modelos/capa-objeto.html). Já usado: Documentos 18/11.
- **C4 · Tipográfica escura.** Pauta de pergunta ou frase forte, sem imagem que ajude. Verde fechado, listras, palavra em dourado. Como: template: capa-tipo + idv 2. Já usado: CAR 20/11.
- **C5 · Foto cheia com faixa.** Foto forte de campo ou rebanho. Título com seta e tags em contorno; faixa verde com listras no rodapé. Como: HTML (modelos/estudo.html, #t3). Já usado: estudo.
- **C6 · Céu aberto.** Foto com céu limpo em cima. Etiqueta, título em light com o trecho-chave em bold, texto de apoio embaixo à esquerda. Como: HTML (modelos/estudo.html, #t4). Já usado: estudo.
- **C7 · Mapa.** Só quando a pauta é território: onde vale, quais estados. Mapa em linha sobre a foto, pinos dourados. Como: HTML (modelos/estudo.html, #t1). Já usado: estudo.
- **CF · Institucional fixada.** Peça de marca, não entra no rodízio. Foto do time, moldura dourada, 'Quem somos', as três áreas. Como: HTML (modelos/capa-institucional.html). Já usado: Quem cuida do seu sossego.

### Miolo

- **M1 · Tese entre fios.** A frase-chave do post, com um parágrafo de explicação embaixo. Como: template: tese. Já usado: BPC tela 2.
- **M2 · Número gigante.** Quando um número é a informação inteira (idade, prazo, percentual). Ocupa a tela. Como: template: cifra, escala gigante, centro. Já usado: BPC tela 3.
- **M3 · Pílulas com ícone.** Três ou quatro itens curtos que pedem leitura rápida. Como: template: itens. Já usado: BPC tela 4.
- **M4 · Passo a passo numerado.** Sequência de ações, na ordem. Como: template: itens, numerada. Já usado: CAR tela 2.
- **M5 · Lista com remate.** Lista de documentos ou requisitos, fechando com a frase que amarra. Como: template: lista. Já usado: Documentos tela 4.
- **M6 · Lista com meia foto.** Lista curta com foto em cima. Item até 35 caracteres, remate até 45. Como: template: lista, meiaFoto. Já usado: Documentos tela 6.
- **M7 · Foto e chapa.** Foto em cima, título de uma linha e dois parágrafos na chapa. Como: template: corpo-foto. Já usado: Documentos tela 5.
- **M8 · Tabela antes e depois.** Comparar dois cenários (antes e depois de uma data, cliente e cooperado). Como: template: figura tabela. Já usado: Documentos tela 2.
- **M9 · Mapa com pinos.** Situar no território: estados, regiões, onde a regra muda. Como: HTML (modelos/mapa-pinos-e-capa-cartao.html, #car4). Já usado: CAR tela 4.
- **M10 · Pessoa em cartão.** Apresentar alguém do escritório. Foto inteira em cartão, rosto no mesmo tamanho em todas, cargo em etiqueta. Como: HTML (modelos/pessoa-cartao.html). Já usado: Institucional.

### Fecho

- **F1 · Fecho com listras.** Frase-síntese, um parágrafo, caixa de salvar e logo. Listras no fundo verde. Como: template: fecho, textura listras. Já usado: Documentos tela 8.

## Rodízio de capas até 18/12

| Data | Post | Capa | Situação |
| --- | --- | --- | --- |
| 06/11 | Institucional · quem cuida | CF · Institucional fixada | fixada, fora do rodízio |
| 11/11 | BPC/LOAS | C1 · Foto em cartão | feita |
| 13/11 | Georreferenciamento (estático) | C2 · Foto escurecendo | feita |
| 18/11 | Documentos da atividade rural | C3 · Objeto desenhado | feita |
| 20/11 | CAR pelo CPF | C4 · Tipográfica escura | feita |
| 23/11 | NR-31: o que é | C5 · Foto cheia com faixa | sugerida: trabalhador no campo, foto forte |
| 25/11 | Seu benefício foi calculado certo? | C6 · Céu aberto | sugerida |
| 27/11 | 13º, férias e rescisão do safrista | C1 · Foto em cartão | sugerida |
| 30/11 | Atualizações da NR-31 | C2 · Foto escurecendo | sugerida |
| 02/12 | Pensão por morte | C4 · Tipográfica escura | sugerida |
| 04/12 | EPI (estático) | C3 · Objeto desenhado | sugerida: capacete, luva e bota desenhados |
| 07/12 | Fim de ano, reunião de família (estático) | C5 · Foto cheia com faixa | sugerida |
| 09/12 | Auxílio-doença mudou de nome (estático) | C6 · Céu aberto | sugerida |
| 11/12 | Holding x inventário | C1 · Foto em cartão | sugerida |
| 14/12 | Sem planejamento, a fazenda pode ser dividida | C2 · Foto escurecendo | sugerida |
| 16/12 | Salário-maternidade rural | C4 · Tipográfica escura | sugerida |
| 18/12 | Holding rural, passo a passo (estático) | C3 · Objeto desenhado | sugerida: contrato social e matrícula desenhados |

Atualizar esta tabela a cada post produzido: a capa usada vira "feita" e
o resto do rodízio se ajusta pela regra dos 3 posts.
