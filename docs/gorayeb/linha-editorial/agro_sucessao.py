"""Bloco Sucessão e holding rural, dezembro de 2026 (07/12 a 18/12).

Quatro peças para aprovação: dois estáticos e dois carrosséis de 8 telas.
Fatos conferidos em 23/10/2026 nas fontes listadas em FONTES.
"""

FONTES = {
 "cc_sucessao": ("Código Civil, arts. 1.829 (ordem da herança), 1.789, 1.845 e 1.846 (herdeiros necessários e legítima de metade)",
   "https://www2.camara.leg.br/legin/fed/lei/2002/lei-10406-10-janeiro-2002-432893-normaatualizada-pl.html"),
 "cc_condominio": ("Código Civil, arts. 1.314, parágrafo único, 1.320, 1.322 e 1.420, §2º (condomínio, fim do condomínio, venda da coisa indivisível, garantia sobre coisa comum)",
   "https://www2.camara.leg.br/legin/fed/lei/2002/lei-10406-10-janeiro-2002-432893-normaatualizada-pl.html"),
 "cc_partilha": ("Código Civil, art. 2.019, e CPC, arts. 648 e 649 (bem que não admite divisão cômoda é vendido ou licitado, salvo acordo ou adjudicação com reposição)",
   "https://www2.camara.leg.br/legin/fed/lei/2015/lei-13105-16-marco-2015-780273-normaatualizada-pl.html"),
 "cc_doacao": ("Código Civil, arts. 544, 549, 1.390, 1.410, I, e 1.911 (doação como adiantamento de herança, limite da parte disponível, usufruto e cláusulas de inalienabilidade)",
   "https://www2.camara.leg.br/legin/fed/lei/2002/lei-10406-10-janeiro-2002-432893-normaatualizada-pl.html"),
 "cpc_inventario": ("CPC, arts. 610 e 611 (inventário em cartório quando todos são capazes e concordes, com advogado; abertura em até 2 meses)",
   "https://www2.camara.leg.br/legin/fed/lei/2015/lei-13105-16-marco-2015-780273-normaatualizada-pl.html"),
 "cnj_571": ("CNJ, Resolução 35/2007, art. 12-A, incluído pela Resolução 571/2024 (inventário em cartório com herdeiro menor ou incapaz)",
   "https://atos.cnj.jus.br/atos/detalhar/179"),
 "mg_itcd": ("Lei estadual 14.941/2003 (ITCD de Minas Gerais), arts. 5º, 10, 13 e 22, atualizada até a Lei 25.618/2025",
   "https://www.fazenda.mg.gov.br/export/sites/fazenda/empresas/legislacao_tributaria/leis/l14941_2003.pdf"),
 "mg_ritcd": ("Decreto estadual 43.981/2005 (Regulamento do ITCD), arts. 23 e 26 (desconto de 15% em 90 dias; prazo de 180 dias)",
   "https://www.fazenda.mg.gov.br/empresas/legislacao_tributaria/decretos/d43981_2005.html"),
 "almg_pl": ("ALMG, PL 2.881/2024 (altera o ITCD; emenda do governo em 2026, Mensagem 254/2026), em comissão em 23/10/2026",
   "https://www.almg.gov.br/projetos-de-lei/PL/2881/2024"),
 "lc_227": ("Lei Complementar 227/2026, arts. 154 e 156 (ITCMD progressivo; quotas avaliadas no mínimo pelo patrimônio líquido a valor de mercado)",
   "https://www.fazenda.mg.gov.br/empresas/legislacao_tributaria/leis/2026/lc227_2026.pdf"),
 "cf_itcmd": ("Constituição Federal, art. 155, §1º, VI, incluído pela EC 132/2023 (ITCMD progressivo)",
   "https://www2.camara.leg.br/legin/fed/consti/1988/constituicao-1988-5-outubro-1988-322142-normaatualizada-pl.html"),
 "cf_itbi": ("Constituição Federal, art. 156, §2º, I (ITBI não incide na integralização de capital, com ressalvas)",
   "https://www2.camara.leg.br/legin/fed/consti/1988/constituicao-1988-5-outubro-1988-322142-normaatualizada-pl.html"),
 "stf_796": ("STF, Tema 796 (RE 796.376): a imunidade do ITBI não alcança o valor dos bens que exceder o capital social a integralizar",
   "https://portal.stf.jus.br/jurisprudenciaRepercussao/verAndamentoProcesso.asp?incidente=4529914&numeroProcesso=796376&classeProcesso=RE&numeroTema=796"),
 "lei_9249": ("Lei 9.249/1995, art. 23 (integralização pelo valor da declaração ou de mercado; diferença tributada como ganho de capital)",
   "https://www2.camara.leg.br/legin/fed/lei/1995/lei-9249-26-dezembro-1995-349062-normaatualizada-pl.html"),
 "et_65": ("Estatuto da Terra (Lei 4.504/1964), art. 65, §§1º e 2º (imóvel rural não se divide abaixo do módulo, inclusive na herança e na partilha)",
   "https://www2.camara.leg.br/legin/fed/lei/1960-1969/lei-4504-30-novembro-1964-377628-normaatualizada-pl.html"),
 "lei_5868": ("Lei 5.868/1972, art. 8º (fração mínima de parcelamento; exceções do §4º, como o agricultor familiar)",
   "https://www2.camara.leg.br/legin/fed/lei/1970-1979/lei-5868-12-dezembro-1972-358040-normaatualizada-pl.html"),
}

PECAS = []

# ---------------------------------------------------------------- estático 07/12
PECAS.append(dict(
 data="07/12 · segunda", formato="Estático", pilar="Empresarial · Sucessão e holding rural",
 titulo="Fim de ano, reunião de família: o momento certo para falar de sucessão",
 objetivo="Aproveitar o encontro de fim de ano para sugerir, com leveza, as perguntas que a família precisa conversar sobre o futuro da fazenda.",
 frase=("A família inteira vai estar na mesma mesa.", "Boa hora para falar da fazenda."),
 apoio="Quem toca a lida, quem quer ficar, onde estão os papéis. Conversa feita com calma evita decisão tomada às pressas.",
 legenda=[
  "A FAMÍLIA INTEIRA VAI ESTAR NA MESMA MESA. BOA HORA PRA FALAR DA FAZENDA.",
  "Dezembro junta quem mora longe, quem ficou na lida e quem já tem família própria. É raro ter todo mundo perto e com tempo. Por isso o fim de ano costuma ser a melhor hora para uma conversa que quase toda família adia: o que acontece com a fazenda quando os pais não estiverem mais à frente.",
  "Não precisa virar reunião de cartório. Algumas perguntas já abrem o caminho. Quem dos filhos quer continuar na atividade, e quem prefere seguir outro rumo? Quem decide o dia a dia hoje, e quem vai decidir amanhã? As matrículas, o CAR e o ITR estão em dia e no nome certo? Existe dívida, arrendamento ou parceria que o resto da família não conhece?",
  "Também ajuda saber o que a lei já decide quando ninguém planejou. A herança segue a ordem do Código Civil, e metade do patrimônio fica reservada aos herdeiros necessários: descendentes, ascendentes e cônjuge. Depois do falecimento, o inventário deve ser aberto em até dois meses, e em Minas o imposto sobre a herança vence em 180 dias.",
  "Cada família tem o seu jeito e o seu tempo. O importante é a conversa acontecer enquanto todos podem participar dela, e as decisões irem pro papel depois, com orientação jurídica. Marca aqui quem precisa estar nessa mesa.",
  "Fontes: Código Civil, arts. 1.829, 1.845 e 1.846; CPC, art. 611; Lei estadual 14.941/2003, art. 13.",
 ],
 fontes=["cc_sucessao", "cpc_inventario", "mg_itcd"],
))

# ---------------------------------------------------------------- carrossel 11/12
PECAS.append(dict(
 data="11/12 · sexta", formato="Carrossel · 8 telas", pilar="Empresarial · Sucessão e holding rural",
 titulo="Holding familiar x inventário: diferenças de custo, tempo e conflito",
 objetivo="Comparar, sem promessa de economia, como o inventário e a holding familiar funcionam em custo, tempo e risco de conflito, e deixar claro que a holding não serve para toda família.",
 telas=[
  ("Capa", "Holding ou inventário?", "Os dois custam. Muda quando se paga, quanto tempo leva e quem decide."),
  ("O inventário", "É o caminho de quem não planejou.", "Deve ser aberto em até dois meses depois do falecimento. Se todos concordam e têm advogado, pode ser feito em cartório. Se há briga, vai para a Justiça."),
  ("No cartório", "Mais simples, mas exige acordo.", "Desde 2024, o CNJ permite inventário em cartório mesmo com herdeiro menor ou incapaz. A parte dele fica em fração de todos os bens, e o Ministério Público precisa concordar."),
  ("O imposto", "Em Minas, ITCD de 5%.", "Vence em 180 dias do falecimento. Pago em até 90 dias, com a declaração de bens entregue, tem desconto de 15%. Depois do prazo, vêm multa e juros."),
  ("A holding", "A família organiza a sucessão em vida.", "Os bens entram como capital de uma empresa da família, e os pais doam as quotas aos filhos com reserva de usufruto. Quando os pais falecem, as quotas já estão com os filhos e o usufruto se encerra."),
  ("Imposto na holding", "A holding também paga imposto.", "A doação das quotas paga ITCD. Em Minas, se a empresa tem menos de cinco anos, a base não fica abaixo do valor atualizado dos bens. E o valor dos imóveis que passar do capital social paga ITBI."),
  ("Conflito", "Regra combinada antes evita briga depois.", "No inventário, a divisão é discutida no luto. Na holding, ela é combinada em vida, no contrato social e no acordo de sócios. O que ficar fora da empresa ainda passa por inventário."),
  ("Fecho", "Holding não serve para toda família.", "Ela exige contador e manutenção todo ano, e depende do patrimônio, das dívidas e de quem vai tocar a fazenda. Marca aqui quem está pesando essa decisão."),
 ],
 nota="A alíquota de 5% é a vigente em Minas em 23/10/2026. A reforma tributária (EC 132/2023 e LC 227/2026) obriga os estados a adotar ITCD progressivo, e o projeto mineiro (PL 2.881/2024) ainda está em comissão na Assembleia. A alíquota será conferida de novo na semana da publicação.",
 fontes=["cpc_inventario", "cnj_571", "mg_itcd", "mg_ritcd", "cf_itcmd", "lc_227", "almg_pl", "cc_doacao", "cf_itbi", "stf_796"],
))

# ---------------------------------------------------------------- carrossel 14/12
PECAS.append(dict(
 data="14/12 · segunda", formato="Carrossel · 8 telas", pilar="Empresarial · Sucessão e holding rural",
 titulo="Sem planejamento, a fazenda pode ser dividida ou vendida no inventário",
 objetivo="Mostrar o que a lei faz com a fazenda quando não há planejamento: condomínio entre herdeiros, limite para dividir a terra e risco de venda, e quais ferramentas existem em vida.",
 telas=[
  ("Capa", "Uma fazenda. Vários herdeiros.", "Sem planejamento, quem decide o destino da terra é a partilha."),
  ("Sem testamento", "A lei escolhe quem herda.", "A herança vai para os filhos, junto com o cônjuge conforme o regime de casamento. Se ninguém se organizou antes, a fazenda entra inteira no inventário."),
  ("Condomínio", "Todo mundo dono de tudo.", "Cada herdeiro recebe uma fração da área inteira, não um pedaço demarcado. Para arrendar a terra ou dar a área toda em garantia, precisa do acordo de todos."),
  ("Dividir", "Nem toda terra pode ser repartida.", "A lei proíbe dividir imóvel rural, inclusive na herança, abaixo da fração mínima de parcelamento do município. Há exceções, como a do agricultor familiar."),
  ("No inventário", "O que não se divide pode ser vendido.", "Se a área não comporta divisão e não cabe na parte de um só herdeiro, a lei manda vender e repartir o dinheiro. Isso não acontece se todos aceitarem ficar juntos, ou se um herdeiro ficar com a terra pagando a parte dos outros."),
  ("Depois do inventário", "O condomínio pode acabar na Justiça.", "Qualquer herdeiro pode pedir o fim do condomínio a qualquer tempo. Se a terra for indivisível e ninguém comprar a parte dos outros, ela vai à venda, com preferência para os próprios donos."),
  ("Caminhos", "O que dá para decidir em vida.", "Testamento, que pode destinar até a metade do patrimônio. Doação aos filhos com reserva de usufruto, respeitando a parte de cada um. E a holding familiar, quando faz sentido."),
  ("Fecho", "Quem planeja, escolhe. Quem não planeja, deixa a partilha escolher.", "Marca aqui quem precisa ter essa conversa em casa."),
 ],
 fontes=["cc_sucessao", "cc_condominio", "et_65", "lei_5868", "cc_partilha", "cc_doacao"],
))

# ---------------------------------------------------------------- estático 18/12
PECAS.append(dict(
 data="18/12 · sexta", formato="Estático", pilar="Empresarial · Sucessão e holding rural",
 titulo="Passo a passo para constituir uma holding rural com segurança jurídica",
 objetivo="Mostrar as etapas de uma holding rural bem feita, na ordem certa, sem tratar a holding como modelo pronto.",
 frase=("Holding rural não nasce no contrato social.", "Nasce no diagnóstico."),
 apoio="Patrimônio e família, tipo de sociedade, regras entre sócios, registro, impostos e doação das quotas. Nessa ordem.",
 legenda=[
  "HOLDING RURAL NÃO NASCE NO CONTRATO SOCIAL. NASCE NO DIAGNÓSTICO.",
  "PRIMEIRO, O RETRATO. Levantar os bens, com matrícula, CAR, CCIR e ITR; as dívidas e as garantias dadas; o regime de casamento dos pais e dos filhos; e quem, de fato, toca a fazenda. Sem esse retrato não dá para saber se a holding serve para família, nem qual formato serve.",
  "DEPOIS, A FORMA E AS REGRAS. Escolhe-se o tipo de sociedade, como a limitada, e escreve-se o contrato social. O acordo de sócios completa: quem administra, como um sócio entra e sai, o que acontece com as quotas num divórcio ou num falecimento, e se elas podem ser vendidas para alguém de fora.",
  "ENTÃO, OS BENS ENTRAM NA EMPRESA. A sociedade é registrada na Junta Comercial e cada imóvel é transferido na matrícula, no cartório de registro de imóveis. A Constituição afasta o ITBI nessa entrada, com limites: o STF decidiu que o valor que passar do capital social paga o imposto. No Imposto de Renda, o bem pode entrar pelo valor da declaração ou pelo de mercado, e a diferença a maior é tributada como ganho de capital.",
  "POR FIM, A DOAÇÃO DAS QUOTAS. Os pais doam as quotas aos filhos, em geral com reserva de usufruto e cláusulas como inalienabilidade e incomunicabilidade, e a doação paga ITCD. Antes de assinar, o contador confere o regime tributário, porque a renda da fazenda passa a ser tributada na empresa, com outras regras. Cada etapa tem documento e custo próprios, e o que serve para uma família não serve de modelo para outra. Marca aqui quem está pensando em organizar o patrimônio.",
  "Fontes: Constituição Federal, art. 156, §2º, I; STF, Tema 796; Lei 9.249/1995, art. 23; Código Civil, arts. 1.390 e 1.911; Lei estadual 14.941/2003.",
 ],
 fontes=["cf_itbi", "stf_796", "lei_9249", "cc_doacao", "mg_itcd"],
))
