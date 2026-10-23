"""Linha editorial do lançamento da área previdenciária, 23/10 a 02/12/2026.

Os 18 posts do plano de marketing da Dra. Elisa, na ordem e nas datas fechadas com o
Victor. Fonte do PDF de aprovação:

    python3 docs/gorayeb/calendario/plano-previdenciario/gerar.py \\
        --conteudo docs/gorayeb/lancamento-previdenciario/conteudo.py

Linguagem do plano dela: "quem trabalha na roça com a família" no lugar de "segurado
especial" sempre que der; nada de promessa de resultado, valor, comparação ou chamada
de venda.
"""
import datetime

HOJE = datetime.date(2026, 10, 23)
SLUG = "linha-editorial-previdenciario"
ARQUIVO = "Linha_Editorial_Previdenciario_Gorayeb"

F = {
 "inss_rural": ("INSS · Aposentadoria por idade do trabalhador rural",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/aposentadorias/aposentadoria-por-idade-do-trabalhador-rural"),
 "inss_urbana": ("INSS · Aposentadoria por idade urbana e regra de transição",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/aposentadorias/aposentadoria-por-idade-urbana"),
 "inss_contrib": ("INSS · Contribuição do segurado especial",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/contribuicao-do-segurado-especial"),
 "inss_bpc_idoso": ("INSS · BPC/LOAS à pessoa idosa",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/beneficios-assistenciais/beneficio-assistencial-a-pessoa-idosa-bpc-loas"),
 "inss_bpc_pcd": ("INSS · BPC/LOAS à pessoa com deficiência",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/beneficios-assistenciais/beneficio-assistencial-a-pessoa-com-deficiencia-bpc-loas"),
 "inss_incap": ("INSS · Auxílio por incapacidade temporária",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/beneficios-por-incapacidade/auxilio-por-incapacidade-temporaria"),
 "inss_acid": ("INSS · Diferença entre o auxílio comum e o acidentário",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/beneficios-por-incapacidade/diferenca-entre-auxilio-por-incapacidade-temporaria-comum-ou-decorrente-de-acidente-de-trabalho"),
 "inss_pensao": ("INSS · Pensão por morte",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/pensoes/pensao-por-morte"),
 "inss_pensao_esp": ("INSS · Pensão por morte do segurado especial",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/pensoes/pensao-por-morte-do-a-segurado-a-especial"),
 "inss_pensao_valor": ("INSS · Valor da pensão por morte",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/pensoes/valor-da-pensao-por-morte"),
 "inss_sm": ("gov.br · Solicitar salário-maternidade rural",
   "https://www.gov.br/pt-br/servicos/solicitar-salario-maternidade-rural"),
 "inss_especial": ("INSS · Aposentadoria especial",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/aposentadorias/aposentadoria-especial"),
 "inss_recurso": ("INSS · Recurso, dúvidas frequentes (prazo de 30 dias)",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/recurso/duvidas-frequentes"),
 "inss_cnis": ("gov.br · Emitir extrato de contribuição (CNIS)",
   "https://www.gov.br/pt-br/servicos/emitir-extrato-de-contribuicao-cnis"),
 "lei_48": ("Lei 8.213/91, art. 48, §§1º e 3º (idade rural e aposentadoria híbrida)", None),
 "lei_106": ("Lei 8.213/91, art. 106, e IN PRES/INSS 128/2022, art. 116 (documentos de prova rural)", None),
 "lei_38b": ("Lei 8.213/91, arts. 38-A e 38-B, na redação da Lei 13.846/2019 (autodeclaração e cadastro rural)", None),
 "lei_39": ("Lei 8.213/91, art. 39, I e parágrafo único (benefícios rurais no valor de um salário mínimo)", None),
 "lei_74": ("Lei 8.213/91, art. 74, I (pensão desde o óbito se pedida em até 90 dias; 180 dias para filhos menores de 16)", None),
 "lei_103": ("Lei 8.213/91, art. 103 (prazo de 10 anos para revisão do ato de concessão)", None),
 "lei_8742": ("Lei 8.742/93 (LOAS), art. 20, §14: BPC ou benefício de até um salário mínimo de outro idoso ou pessoa com deficiência da família não entra no cálculo da renda", None),
 "lei_12764": ("Lei 12.764/2012, art. 1º, §2º: a pessoa com transtorno do espectro autista é pessoa com deficiência para todos os efeitos legais", None),
 "dec_6214": ("Decreto 6.214/2007, art. 4º, §1º: em menores de 16 anos, a avaliação considera a limitação compatível com a idade", None),
 "ec103": ("Emenda Constitucional 103/2019, arts. 19 e 21 (aposentadoria especial)", None),
 "cf_201": ("Constituição Federal, art. 201, §7º, II, na redação da EC 103/2019 (idade reduzida do trabalhador rural)", None),
 "stj_1007": ("STJ, Tema 1.007: tempo rural antigo, sem contribuição, conta na aposentadoria híbrida", None),
 "sum_149": ("Súmula 149 do STJ: prova só testemunhal não basta para comprovar atividade rural", None),
 "tnu_14": ("Súmula 14 da TNU: o começo de prova no papel não precisa cobrir todo o período", None),
 "stf_2110": ("STF, ADI 2110 (2024): inconstitucional exigir carência no salário-maternidade de contribuinte individual, segurada especial e facultativa", None),
 "stf_vida": ("STF, ADIs 2110 e 2111 (2024): a regra de transição da Lei 9.876/99 é obrigatória, o que encerrou a chamada revisão da vida toda", None),
 "site": ("Site do escritório, grupoftg.com.br, seção Equipe (nomes, cargos e OAB do Dr. Fernando)", "https://grupoftg.com.br"),
}

CAPA = dict(
 eyebrow="Linha editorial · Instagram e Facebook",
 titulo="Direito<br><em>Previdenciário</em>",
 sub="Lançamento da área: 18 posts, de 23 de outubro a 2 de dezembro de 2026, às segundas, quartas e sextas.",
 pe=f"Preparado para a Dra. Elisa · {HOJE.strftime('%d/%m/%Y')}",
)

VISAO_HTML = """
  <p class="eyebrow">Visão geral</p>
  <h2 class="sec">Os 18 posts do plano, com data e roteiro</h2>
  <p>Este documento segue o Plano de Marketing do lançamento da área previdenciária. Os temas são os que estão no plano, os dias são segunda, quarta e sexta, e o feed fica só com esse bloco até 2 de dezembro.</p>
  <p>A ordem mudou em dois pontos. <b>Os vídeos que dependem de gravação</b> ficaram nas sextas 6/11 e 20/11, para dar tempo de marcar com os advogados. <b>Os registros de evento</b> vêm sempre depois do evento: na grade original, alguns saíam no começo da mesma semana.</p>
  <p>Em todos os textos, <b>quem trabalha na roça com a família</b> no lugar de segurado especial, sempre que possível, e a frase-guia <b>Protegemos o patrimônio e o futuro de quem produz, da porteira à aposentadoria</b> no lançamento.</p>
  <div class="nums">
    <div><b>18</b><span>posts</span></div>
    <div><b>4</b><span>vídeos</span></div>
    <div><b>9</b><span>carrosséis</span></div>
    <div><b>5</b><span>estáticos e registros</span></div>
  </div>
  <p class="eyebrow" style="margin-bottom:1mm">Os públicos do plano, e onde cada um aparece</p>
  <ol class="arco">
    <li><div><b>Produtor rural com mais de 50 anos.</b> <span>Trabalho no campo, documentos, dúvidas frequentes, idade urbana x rural.</span></div></li>
    <li><div><b>Família do produtor.</b> <span>Pensão por morte, salário-maternidade rural.</span></div></li>
    <li><div><b>Idosos e famílias de pessoas com deficiência ou TEA.</b> <span>BPC/LOAS e BPC para crianças com TEA.</span></div></li>
    <li><div><b>Trabalhador urbano perto de se aposentar.</b> <span>Planejamento, aposentadoria especial, idade urbana x rural.</span></div></li>
    <li><div><b>Aposentados e pensionistas.</b> <span>Seu benefício foi calculado certo, auxílio-doença.</span></div></li>
  </ol>
"""

GRADE_TITULO = "23 de outubro a 2 de dezembro"
GRADE_NOTA = ("Os quatro registros e a chamada dependem das datas dos eventos. Se algum evento mudar, o post anda "
              "junto; se não acontecer, entra um tema educativo no lugar.")
PRECISAMOS = [
 "<b>Aprovação da legenda do lançamento</b> e do vídeo, para publicar hoje, 23/10.",
 "<b>Número da OAB do Dr. Gustavo</b>, para a tarja do vídeo. O do Dr. Fernando já está no site.",
 "<b>Gravação</b> dos vídeos de planejamento (6/11) e de dúvidas frequentes (20/11), de preferência juntos, até 3/11.",
 "<b>Datas e locais dos eventos</b>, para a chamada (11/11) e os registros.",
 "<b>Aprovação dos roteiros</b> com pelo menos 2 dias úteis antes de cada data.",
]

GRADE = [
 ("23/10","sex","Vídeo","Vídeo de lançamento da área","lanc"),
 ("26/10","seg","Vídeo","Trabalho no campo conta para a aposentadoria?",""),
 ("28/10","qua","Carrossel","Quais documentos provam a atividade rural",""),
 ("30/10","sex","Carrossel","BPC/LOAS: quem tem direito",""),
 ("02/11","seg","Carrossel","Seu benefício foi calculado certo?",""),
 ("04/11","qua","Estático","Auxílio-doença mudou de nome",""),
 ("06/11","sex","Vídeo","O que é planejamento previdenciário",""),
 ("09/11","seg","Carrossel","Pensão por morte: quem recebe",""),
 ("11/11","qua","Estático","Chamada para o evento de lançamento",""),
 ("13/11","sex","Carrossel","BPC para crianças com TEA: como funciona",""),
 ("16/11","seg","Carrossel","Salário-maternidade para trabalhadora rural",""),
 ("18/11","qua","Carrossel","Aposentadoria especial: quem trabalha com insalubridade",""),
 ("20/11","sex","Vídeo","Dúvidas frequentes sobre aposentadoria rural",""),
 ("23/11","seg","Fotos","Bastidores do evento de lançamento",""),
 ("25/11","qua","Carrossel","Aposentadoria por idade urbana x rural",""),
 ("27/11","sex","Fotos","Registro da palestra na cooperativa",""),
 ("30/11","seg","Fotos","Registro do café com contadores",""),
 ("02/12","qua","Fotos","Registro da palestra no sindicato rural",""),
]

PECAS = []

# 01 ------------------------------------------------------------------ lançamento
PECAS.append(dict(data="23/10 · sexta", formato="Vídeo · 75 segundos", quem="Gravado pelo Dr. Fernando e pelo Dr. Gustavo", duas_paginas=True,
 titulo="Vídeo de lançamento da área",
 objetivo="Apresentar a nova área e a equipe. O Dr. Fernando abre e fecha falando da relação do escritório com o agro e com as empresas; o Dr. Gustavo explica a área no meio.",
 tabela=(["Tempo","Cena","Animação","Fala"],[
  ("0–5s","Campo ao amanhecer: estrada de terra, lavoura, porteira.","A logo da Gorayeb se formando sobre a imagem.","(Trilha.)"),
  ("5–17s","Dr. Fernando no escritório.","Tarja: Dr. Fernando Torbay Gorayeb · OAB/MG 144.479.","Eu sou o Fernando Gorayeb, advogado e produtor rural. Há mais de vinte e cinco anos, a Gorayeb caminha junto com quem produz e com as empresas da nossa região. A gente cuida da terra, dos contratos, da família."),
  ("17–24s","Trabalhador rural mais velho, de costas, olhando a lavoura.","Texto: Direito Previdenciário.","Mas o futuro de quem produz não é só a terra. É também a aposentadoria. Por isso, agora a Gorayeb atua em Direito Previdenciário."),
  ("24–40s","Dr. Gustavo.","Tarja: Dr. Gustavo Freitas Marcelino · OAB/MG [número]. Linha do tempo com ícones de documentos rurais.","Quem trabalha na roça com a família tem direito a se aposentar, mesmo sem ter pago o INSS todo mês. O que decide é a prova: nota de venda da produção, contrato de parceria, ITR, certidão com a profissão de lavrador. A gente ajuda a juntar e organizar esses documentos."),
  ("40–50s","Dr. Gustavo.","Ícone do BPC.","Também orientamos sobre o BPC, o benefício de um salário mínimo para idosos a partir de sessenta e cinco anos e para pessoas com deficiência, inclusive com autismo, de famílias de baixa renda."),
  ("50–58s","Dr. Gustavo.","Ícone de revisão.","E revisamos aposentadorias e pensões já concedidas, para conferir se o cálculo e o tempo de trabalho foram reconhecidos do jeito certo."),
  ("58–66s","Fundo verde da marca.","Serviços entrando um a um, com ícone.","(Trilha.)"),
  ("66–75s","Dr. Fernando fecha.","Cartão final: Protegemos o patrimônio e o futuro de quem produz, da porteira à aposentadoria. E a logo.","Se você ou alguém da sua família tem dúvida sobre aposentadoria ou benefício do INSS, conversa com a gente. Gorayeb Advocacia. Da porteira à aposentadoria."),
 ]),
 nota="Se a gravação não sair a tempo, há uma versão sem gravação: os dois aparecem pelas fotos do site, com as tarjas, e as falas viram narração em voz institucional, falando do escritório e não em primeira pessoa.",
 legenda=[
  "A GORAYEB ADVOCACIA AGORA TAMBÉM ATUA EM DIREITO PREVIDENCIÁRIO.",
  "Protegemos o patrimônio e o futuro de quem produz, da porteira à aposentadoria.",
  "Há mais de 25 anos caminhamos junto com o produtor rural e com as empresas da nossa região, cuidando da terra, dos contratos e da família. Agora, cuidamos também da aposentadoria e dos benefícios do INSS.",
  "Oferecemos assessoria especializada em Direito Previdenciário, atuando na defesa dos direitos de trabalhadores urbanos e rurais, aposentados, pensionistas e seus familiares. Prestamos atendimento personalizado, com análise detalhada de cada caso, buscando a concessão do benefício mais vantajoso e a garantia da proteção social prevista em lei.",
  "Na nova área, você conta com o Dr. Gustavo Freitas Marcelino e com o Dr. Fernando Torbay Gorayeb.",
  "Aposentadoria rural e urbana. Planejamento previdenciário. BPC/LOAS para idosos, pessoas com deficiência e pessoas com TEA. Pensão por morte. Auxílio-doença e salário-maternidade. Revisão de benefícios.",
  "Se você ou alguém da sua família tem dúvida sobre aposentadoria ou benefício do INSS, converse com a gente.",
 ],
 fontes=["inss_rural","inss_bpc_idoso","inss_bpc_pcd","lei_12764","site"],
))

# 02 ------------------------------------------------------------------ vídeo aprovado
PECAS.append(dict(data="26/10 · segunda", formato="Vídeo · 60 segundos", quem="Narrado, já produzido",
 status="Vídeo já produzido e aprovado. Nova, só a legenda.",
 titulo="Trabalho no campo conta para a aposentadoria?",
 objetivo="Desfazer a ideia de que quem nunca teve carteira nem pagou INSS todo mês não tem direito.",
 narracao=[
  "Seu pai trabalhou a vida inteira na roça. Levantou cedo, voltou tarde, criou os filhos daquele chão. Nunca teve carteira assinada. Nunca pagou INSS todo mês. E mesmo assim ele pode se aposentar.",
  "O nome disso é segurado especial. É quem vive do que planta ou do que cria, em família, sem empregado fixo.",
  "A idade é sessenta anos pro homem. Cinquenta e cinco pra mulher. A Reforma da Previdência não mexeu nisso. O que o INSS pede são quinze anos de trabalho na terra. Trabalho. Não contribuição.",
  "E aqui está o que derruba a maior parte dos pedidos: o INSS não aceita só a sua palavra. Bloco de notas do produtor. Contrato de parceria. Nota de entrega na cooperativa. Comprovante de ITR. Papel guardado é o que vira aposentadoria.",
 ],
 legenda=[
  "TRABALHO NO CAMPO CONTA PARA A APOSENTADORIA?",
  "É a pergunta que mais aparece na conversa com quem trabalha na roça com a família. E a resposta é sim, mesmo para quem nunca pagou o INSS todo mês.",
  "Quem trabalha na roça com a família se aposenta aos 60 anos, se homem, e aos 55, se mulher, desde que comprove 15 anos de trabalho no campo. A Reforma da Previdência não mudou essa idade.",
  "O que se comprova é o tempo de trabalho, não a contribuição mensal. A contribuição de quem vive da roça sai na venda da produção.",
  "E é aqui que muito pedido trava: a prova. Bloco de notas do produtor, contrato de parceria, nota de entrega na cooperativa, comprovante de ITR. Cada papel guardado ajuda a mostrar que você trabalhou na terra naquele ano.",
  "Salve este vídeo e mande para quem está chegando na idade.",
 ],
 fontes=["inss_rural","inss_contrib","lei_48","cf_201","lei_106"],
))

# 03 ------------------------------------------------------------------ documentos
PECAS.append(dict(data="28/10 · quarta", formato="Carrossel · 8 telas",
 titulo="Quais documentos provam a atividade rural",
 objetivo="Dar a quem trabalha na roça com a família a lista do que guardar, separada por origem, para saber onde procurar.",
 telas=[
  ("Capa","Quais documentos provam","que você trabalhou na roça."),
  ("Antes de tudo","O cadastro rural no INSS.","Para o tempo de roça a partir de 2023, ele é a única prova. Para o tempo anterior, vale a autodeclaração, que o INSS confere nas bases do governo. Quando não bate, entram os documentos."),
  ("Da produção","O que mostra que você vendia.","Bloco de notas do produtor. Nota fiscal de venda da produção. Comprovante de entrega na cooperativa."),
  ("Da terra","O que mostra onde você trabalhava.","Contrato de arrendamento, de parceria ou de comodato. Comprovante de pagamento do ITR. Documento do imóvel rural."),
  ("Da família","O que mostra que a família era da roça.","Certidão de casamento ou de nascimento dos filhos com a profissão de lavrador. Documentos no nome dos pais ou do cônjuge, quando trabalhavam juntos."),
  ("Da cooperativa","O que mostra o vínculo.","Ficha de associado e as notas de entrega de cada safra."),
  ("O que não basta","Testemunha sozinha.","Ela precisa vir junto de um começo de prova no papel. Mas não é preciso ter um documento para cada ano: alguns papéis espalhados pelo período, somados à testemunha, podem fechar a prova."),
  ("Fecho","Pasta de papel velho é patrimônio.","Salve este carrossel e confira a sua."),
 ],
 fontes=["lei_106","lei_38b","inss_rural","sum_149","tnu_14"],
))

# 04 ------------------------------------------------------------------ BPC
PECAS.append(dict(data="30/10 · sexta", formato="Carrossel · 8 telas",
 titulo="BPC/LOAS: quem tem direito",
 objetivo="Explicar quem pode receber o BPC e qual é o primeiro passo, que quase sempre é o CadÚnico.",
 telas=[
  ("Capa","BPC/LOAS: um salário mínimo por mês.","Para quem tem direito, sem nunca ter contribuído."),
  ("O que é","Um benefício assistencial do INSS.","Paga um salário mínimo por mês ao idoso ou à pessoa com deficiência de família de baixa renda. Não é preciso ter contribuído para o INSS."),
  ("Quem pode · idoso","65 anos ou mais.","Brasileiro, nato ou naturalizado, ou português com residência fixa no Brasil."),
  ("Quem pode · deficiência","Qualquer idade, inclusive criança.","Impedimento de longo prazo, de pelo menos dois anos, de natureza física, mental, intelectual ou sensorial. A pessoa com autismo entra aqui."),
  ("A renda","Até 1/4 do salário mínimo por pessoa da família.","O INSS calcula com os dados do CadÚnico e dos próprios sistemas. BPC ou aposentadoria de até um salário mínimo de outro idoso ou pessoa com deficiência da casa não entra nessa conta."),
  ("O primeiro passo","CadÚnico em dia.","A família precisa estar inscrita e com o cadastro atualizado nos últimos dois anos. Depois, o pedido é feito pelo Meu INSS ou pelo 135. Na deficiência, há avaliação médica e social."),
  ("O que ele não tem","Não paga 13º e não deixa pensão.","Por isso vale conferir antes se a pessoa não tem direito a uma aposentadoria."),
  ("Fecho","Benefício que muita família nem sabe que existe.","Salve e mande para quem cuida de um idoso ou de uma pessoa com deficiência."),
 ],
 fontes=["inss_bpc_idoso","inss_bpc_pcd","lei_8742","lei_12764"],
))

# 05 ------------------------------------------------------------------ revisão
PECAS.append(dict(data="02/11 · segunda", formato="Carrossel · 8 telas",
 titulo="Seu benefício foi calculado certo?",
 objetivo="Falar com aposentados e pensionistas: onde o erro costuma estar, como conferir e qual é o prazo.",
 telas=[
  ("Capa","Seu benefício foi calculado certo?","Dá para conferir. E, se houver erro, dá para pedir revisão."),
  ("Onde está o erro","Quase sempre, em tempo que ficou de fora.","Tempo de roça, emprego antigo que não aparece no sistema, período trabalhado em condição insalubre, salários registrados errado ou faltando."),
  ("Como conferir","Dois papéis lado a lado.","A carta de concessão do benefício e o extrato do CNIS, que se tira no Meu INSS. Compare com a carteira de trabalho, os carnês e os documentos rurais."),
  ("O prazo","Dez anos.","Contados a partir do mês seguinte ao primeiro pagamento. Passou disso, a revisão do cálculo não é mais possível."),
  ("Pedido negado","Recurso em 30 dias.","Se o pedido foi negado, ou concedido com erro e a decisão chegou agora, o prazo para recorrer é de 30 dias da ciência da decisão."),
  ("Cuidado","Revisão não é garantia de aumento.","Depende do que está nos documentos. E a chamada revisão da vida toda foi encerrada pelo STF em 2024."),
  ("O que separar","Antes de qualquer pedido.","Carta de concessão, cópia do processo no Meu INSS, extrato do CNIS, carteiras de trabalho, carnês, PPP e documentos rurais."),
  ("Fecho","Benefício concedido também se confere.","Salve e mande para quem já é aposentado."),
 ],
 fontes=["lei_103","inss_recurso","inss_cnis","stf_vida"],
))

# 06 ------------------------------------------------------------------ auxílio
PECAS.append(dict(data="04/11 · quarta", formato="Estático",
 titulo="Auxílio-doença mudou de nome",
 objetivo="Atualizar o nome do benefício e explicar, na legenda, quem tem direito e a diferença para o acidentário.",
 frase=("Auxílio-doença mudou de nome.","Agora é auxílio por incapacidade temporária."),
 apoio="É o mesmo benefício: para quem fica mais de 15 dias sem conseguir trabalhar por doença ou acidente.",
 legenda=[
  "AUXÍLIO-DOENÇA MUDOU DE NOME. AGORA É AUXÍLIO POR INCAPACIDADE TEMPORÁRIA.",
  "O nome mudou com a Reforma da Previdência, mas o benefício é o mesmo: para quem fica mais de 15 dias seguidos sem conseguir trabalhar por doença ou acidente, comprovado em perícia.",
  "Em regra, são exigidas 12 contribuições. Para quem trabalha na roça com a família, contam 12 meses de trabalho rural comprovado. Não há carência em acidente de qualquer natureza e em algumas doenças graves listadas pelo governo.",
  "O pedido pode ser feito pelo Meu INSS, com análise do atestado, sem perícia presencial. O atestado precisa trazer o CID ou a descrição da doença, a data, o tempo de afastamento e a assinatura do médico.",
  "E existe o acidentário: quando o afastamento vem do próprio trabalho, para quem tem carteira assinada, inclusive no campo, e para o empregado doméstico. Ele não exige carência, garante 12 meses de estabilidade na volta e a empresa continua depositando o FGTS.",
  "Fontes: INSS, páginas do auxílio por incapacidade temporária e da diferença entre o comum e o acidentário.",
 ],
 fontes=["inss_incap","inss_acid","lei_39"],
))

# 07 ------------------------------------------------------------------ planejamento
PECAS.append(dict(data="06/11 · sexta", formato="Vídeo · 60 segundos", quem="Gravado pelo Dr. Gustavo",
 titulo="O que é planejamento previdenciário",
 objetivo="Mostrar, de forma simples, o que é o serviço de maior valor da área: olhar a aposentadoria antes de pedir.",
 narracao=[
  "Planejamento previdenciário é olhar a sua aposentadoria antes de pedir. E não depois.",
  "Funciona em três passos. Primeiro, o extrato do CNIS, que você tira no Meu INSS. Ele mostra tudo o que o INSS já sabe de você: os empregos, as contribuições, os salários. Se tem buraco ali, é ali que o seu benefício perde.",
  "Segundo, o tempo que não está no extrato. Tempo de roça, emprego antigo sem registro, período em condição insalubre. Esse tempo precisa de prova, e prova se junta com calma.",
  "Terceiro, a simulação. Depois da Reforma, existe mais de uma regra de transição. Para a mesma pessoa, uma regra pode dar um benefício maior, ou chegar antes, que a outra.",
  "Para quem trabalha na roça com a família, tem mais um ponto: desde 2023, o tempo de roça só aparece se o cadastro rural no INSS estiver em dia.",
  "Planejar não é se aposentar a qualquer custo. É saber quando pedir, por qual regra e com qual papel.",
 ],
 tela=[
  "Nome e OAB do Dr. Gustavo na primeira fala.",
  "Os três passos numerados: extrato, tempo que falta, simulação.",
  "“Desde 2023: cadastro rural em dia”, em destaque.",
  "Fecho: “Quando pedir. Por qual regra. Com qual papel.”",
 ],
 fontes=["inss_cnis","inss_urbana","inss_rural","inss_contrib"],
))

# 08 ------------------------------------------------------------------ pensão
PECAS.append(dict(data="09/11 · segunda", formato="Carrossel · 8 telas",
 titulo="Pensão por morte: quem recebe",
 objetivo="Explicar quem são os dependentes, quanto tempo a pensão dura para o cônjuge e o prazo que faz diferença no pagamento.",
 telas=[
  ("Capa","Pensão por morte:","quem recebe, e por quanto tempo."),
  ("Quem recebe","Na ordem da lei.","Primeiro, cônjuge ou companheiro e filhos até 21 anos, ou com invalidez ou deficiência. Se não houver, os pais. Depois, os irmãos nas mesmas condições."),
  ("União estável","Vale, mas precisa provar.","Filho em comum, mesmo endereço, conta conjunta. Para cônjuge e filhos, a dependência é presumida; para pais e irmãos, precisa ser comprovada."),
  ("O valor","Na cidade e na roça, é diferente.","Para quem trabalhava na roça com a família, um salário mínimo. Nos demais casos, metade da aposentadoria do falecido, mais 10% por dependente, até 100%. Nunca menos que um salário mínimo."),
  ("Quanto tempo","Para o cônjuge, depende da idade.","Com pelo menos 18 contribuições, ou 18 meses de trabalho rural, e 2 anos de casamento ou união: a partir de 45 anos, é vitalícia. Mais novo, tem prazo, de 3 a 20 anos."),
  ("A exceção","Quatro meses.","Sem as 18 contribuições ou os 2 anos de união, a pensão do cônjuge dura quatro meses. A não ser que a morte tenha sido por acidente."),
  ("O prazo","Peça em até 90 dias.","Pedindo em até 90 dias do falecimento, a pensão é paga desde a data da morte. Para filhos menores de 16 anos, o prazo é de 180 dias."),
  ("Fecho","Ninguém quer pensar nisso. Mas vale saber.","Salve este carrossel."),
 ],
 fontes=["inss_pensao","inss_pensao_esp","inss_pensao_valor","lei_74"],
))

# 09 ------------------------------------------------------------------ chamada evento
PECAS.append(dict(data="11/11 · quarta", formato="Estático",
 titulo="Chamada para o evento de lançamento",
 objetivo="Anunciar o café de lançamento da área. Se o café for só para convidados, o post anuncia o encontro, sem convite aberto.",
 status="Depende da data e do local do café.",
 frase=("Café da manhã de lançamento","da área de Direito Previdenciário."),
 apoio="[Dia da semana], [data] · [horário] · [local]. Uma manhã para falar de aposentadoria do produtor rural, BPC/LOAS e revisão de benefícios.",
 legenda=[
  "CAFÉ DA MANHÃ DE LANÇAMENTO DA ÁREA DE DIREITO PREVIDENCIÁRIO.",
  "No dia [data], recebemos clientes, parceiros, contadores e representantes de cooperativas e sindicatos rurais em [local] para apresentar a nova área do escritório.",
  "Na programação: a aposentadoria do produtor rural, com o [coordenador da área], e o BPC/LOAS e a revisão de benefícios, com o Dr. Gustavo Freitas Marcelino.",
  "Protegemos o patrimônio e o futuro de quem produz, da porteira à aposentadoria.",
 ],
 legenda_nota="Modelo para completar quando a data, o local e os palestrantes estiverem definidos.",
 fontes=[], fontes_nota="Programação do evento conforme o Plano de Marketing do lançamento.",
))

# 10 ------------------------------------------------------------------ BPC TEA
PECAS.append(dict(data="13/11 · sexta", formato="Carrossel · 7 telas",
 titulo="BPC para crianças com TEA: como funciona",
 objetivo="Falar com famílias de crianças com autismo: o direito existe, como é a avaliação e por onde começar.",
 telas=[
  ("Capa","BPC para crianças com autismo.","Como funciona e por onde começar."),
  ("A lei","Autismo é deficiência, para todos os efeitos legais.","É o que diz a lei desde 2012. Por isso, a pessoa com TEA pode ter direito ao BPC como pessoa com deficiência."),
  ("Criança tem direito","Não há idade mínima.","Na criança, o INSS avalia as limitações comparando com outras crianças da mesma idade."),
  ("A renda","A regra é a mesma de todo BPC.","Até 1/4 do salário mínimo por pessoa da família, com o CadÚnico atualizado nos últimos dois anos."),
  ("A avaliação","Médica e social, feita pelo INSS.","Ajuda levar o laudo, os relatórios das terapias e da escola: eles mostram como o autismo afeta o dia a dia da criança."),
  ("Atenção","O laudo sozinho não garante.","O INSS avalia se o impedimento é de longo prazo, de pelo menos dois anos, e o impacto na participação da criança."),
  ("Fecho","Informação que muda a vida de uma família.","Salve e mande para quem precisa saber."),
 ],
 fontes=["lei_12764","dec_6214","inss_bpc_pcd"],
))

# 11 ------------------------------------------------------------------ salário-maternidade
PECAS.append(dict(data="16/11 · segunda", formato="Carrossel · 7 telas",
 titulo="Salário-maternidade para trabalhadora rural",
 objetivo="Falar com a mulher que trabalha na roça com a família: o direito, o valor, o tempo de trabalho exigido e como pedir.",
 telas=[
  ("Capa","Salário-maternidade","para quem trabalha na roça com a família."),
  ("Quem tem direito","Nascimento, adoção ou guarda.","Também em caso de aborto não criminoso. Vale para a trabalhadora rural que vive da roça com a família."),
  ("Valor e duração","120 dias, um salário mínimo.","Pode começar até 28 dias antes do parto, com atestado médico."),
  ("Sem contribuição","Precisa provar o trabalho rural.","Não é preciso ter pago o INSS. O que se comprova é o trabalho na roça antes do parto. Hoje o INSS pede 10 meses. Em 2024 o STF considerou inconstitucional exigir carência nesse benefício, e a aplicação disso à trabalhadora rural ainda está em discussão."),
  ("Como pedir","Pelo Meu INSS.","Busque “salário-maternidade rural”. A autodeclaração rural pode ser feita ali mesmo, no aplicativo."),
  ("O prazo","Até cinco anos.","O pedido pode ser feito em até cinco anos depois do nascimento, da adoção ou da guarda."),
  ("Fecho","Direito que muita mãe da roça deixa de pedir.","Salve e mande para quem está esperando filho."),
 ],
 fontes=["inss_sm","lei_39","inss_rural","stf_2110"],
))

# 12 ------------------------------------------------------------------ especial
PECAS.append(dict(data="18/11 · quarta", formato="Carrossel · 8 telas",
 titulo="Aposentadoria especial: quem trabalha com insalubridade",
 objetivo="Explicar quem tem direito, as regras depois da Reforma e a importância do PPP.",
 telas=[
  ("Capa","Aposentadoria especial.","Para quem trabalha exposto ao que faz mal à saúde."),
  ("O que é","Exposição permanente.","A ruído, calor ou agentes químicos, por exemplo, acima dos limites da lei e durante toda a jornada, não de vez em quando."),
  ("O tempo","15, 20 ou 25 anos.","Conforme o agente. O caso mais comum é o de 25 anos de exposição."),
  ("Quem já contribuía em 2019","Regra de pontos.","Para quem era segurado até 13/11/2019: idade mais tempo de contribuição e de exposição somando 86, 76 ou 66 pontos, conforme o caso."),
  ("Quem começou depois","Idade mínima.","60, 58 ou 55 anos, com 25, 20 ou 15 anos de exposição."),
  ("A prova","O PPP.","Perfil Profissiográfico Previdenciário, fornecido pela empresa com base em laudo técnico. Desde 2023, em formato eletrônico."),
  ("No campo","Também pode valer.","O trabalhador rural com carteira assinada que lida com agrotóxico, máquina barulhenta ou calor excessivo pode ter tempo especial, se a exposição estiver no PPP."),
  ("Atenção","Dois cuidados.","Depois de aposentado, não dá para continuar na mesma atividade exposta, sob pena de o benefício ser cancelado. E a conversão de tempo especial em comum só vale para períodos até 13/11/2019."),
 ],
 fontes=["inss_especial","ec103"],
))

# 13 ------------------------------------------------------------------ dúvidas
PECAS.append(dict(data="20/11 · sexta", formato="Vídeo · 70 segundos", quem="Gravado pelo Dr. Gustavo",
 titulo="Dúvidas frequentes sobre aposentadoria rural",
 objetivo="Responder, em formato de pergunta e resposta, as dúvidas que mais aparecem sobre aposentadoria de quem trabalha na roça.",
 rotulo_fala="Fala, em pergunta e resposta",
 narracao=[
  "Preciso ter pago o INSS? Não. Quem trabalha na roça com a família comprova quinze anos de trabalho no campo, não de contribuição.",
  "A Reforma mudou a idade? Não. Continua sessenta anos para o homem e cinquenta e cinco para a mulher.",
  "Testemunha resolve? Sozinha, não. Ela precisa vir junto de um começo de prova no papel.",
  "Meu documento está no nome do meu pai. Vale? Ajuda, quando a família trabalhava junto.",
  "Saí da roça e fui para a cidade. Perdi aqueles anos? Não necessariamente. A aposentadoria híbrida soma os dois tempos, com a idade de quem trabalha na cidade: sessenta e cinco para o homem, sessenta e dois para a mulher.",
  "E o que eu faço hoje? Confere se o seu cadastro rural no INSS está em dia e junta os papéis de cada ano.",
 ],
 tela=[
  "Cada pergunta entra como título na tela antes da resposta.",
  "Nome e OAB do Dr. Gustavo na primeira fala.",
  "Números em destaque: 15 anos, 60 e 55, 65 e 62.",
 ],
 fontes=["inss_rural","inss_urbana","lei_48","sum_149","stj_1007"],
))

# 14 a 18 -------------------------------------------------------------- eventos e comparativo
def registro(data, titulo, objetivo, legenda):
    return dict(data=data, formato="Carrossel de fotos · 5 a 8 fotos", titulo=titulo, objetivo=objetivo,
     status="Depende do evento.",
     fotos=["Abertura: o ambiente, com a marca à vista.",
            "Quem conduziu, falando para o público.",
            "O público atento, sem close de quem não autorizou o uso da imagem.",
            "Detalhe: a cartilha, o material, o café.",
            "Fechamento: a equipe da área."],
     legenda=legenda,
     legenda_nota="Modelo para completar depois do evento. Só entram fotos de quem autorizou o uso de imagem, e nenhum cliente é citado pelo nome.",
     fontes=[], fontes_nota="Ações conforme o Plano de Marketing do lançamento.")

PECAS.append(registro("23/11 · segunda","Bastidores do evento de lançamento",
 "Mostrar como foi o café de lançamento, com foco na informação, sem cara de evento de vendas.",
 ["CAFÉ DA MANHÃ DE LANÇAMENTO DA ÁREA DE DIREITO PREVIDENCIÁRIO.",
  "Na [data], recebemos clientes e parceiros para apresentar a nova área do escritório. Falamos sobre a aposentadoria de quem trabalha na roça com a família, o BPC/LOAS e a revisão de benefícios.",
  "Obrigado a todos que estiveram com a gente.",
  "Protegemos o patrimônio e o futuro de quem produz, da porteira à aposentadoria."]))

PECAS.append(dict(data="25/11 · quarta", formato="Carrossel · 8 telas",
 titulo="Aposentadoria por idade urbana x rural",
 objetivo="Comparar, lado a lado, as duas aposentadorias por idade, para quem trabalhou na cidade, na roça ou nos dois.",
 telas=[
  ("Capa","Aposentadoria por idade:","cidade x roça."),
  ("A idade · cidade","65 anos para o homem. 62 para a mulher.","A da mulher subiu aos poucos depois da Reforma e chegou a 62 em 2023."),
  ("A idade · roça","60 anos para o homem. 55 para a mulher.","A Reforma não mexeu na idade de quem trabalha na roça."),
  ("O tempo","15 anos nas duas.","Na cidade, de contribuição. Na roça, de trabalho comprovado. Para o homem que começou a contribuir depois da Reforma, na cidade são 20."),
  ("A prova","O que cada uma olha.","Na cidade, o que está no CNIS. Na roça, o cadastro rural e os documentos de cada ano."),
  ("O valor","Calculado x salário mínimo.","Na cidade, sai da média dos salários. Na roça, é de um salário mínimo, a não ser para quem contribuiu por conta própria para receber mais."),
  ("Fez os dois?","Aposentadoria híbrida.","Soma o tempo de roça com o de cidade, com a idade de quem trabalha na cidade. O tempo de roça antigo, mesmo sem contribuição, conta."),
  ("Fecho","Cada caminho tem uma regra.","Salve e mande para quem está chegando na idade."),
 ],
 fontes=["inss_urbana","inss_rural","cf_201","inss_contrib","stj_1007"],
))

PECAS.append(registro("27/11 · sexta","Registro da palestra na cooperativa",
 "Registrar a palestra educativa na cooperativa parceira.",
 ["PALESTRA NA [NOME DA COOPERATIVA].",
  "Na [data], falamos com os cooperados sobre como comprovar o tempo trabalhado na roça para se aposentar, e sobre os direitos da família de quem produz.",
  "Obrigado à [cooperativa] pelo convite.",
  "Protegemos o patrimônio e o futuro de quem produz, da porteira à aposentadoria."]))

PECAS.append(registro("30/11 · segunda","Registro do café com contadores",
 "Registrar o café técnico com os contadores parceiros.",
 ["CAFÉ COM CONTADORES PARCEIROS.",
  "Na [data], recebemos contadores da região para uma conversa técnica sobre INSS: as regras que mais aparecem no dia a dia dos clientes deles e os pontos de atenção depois da Reforma.",
  "Obrigado a todos que participaram."]))

PECAS.append(registro("02/12 · quarta","Registro da palestra no sindicato rural",
 "Registrar a palestra educativa no sindicato rural e fechar o bloco de lançamento.",
 ["PALESTRA NO SINDICATO RURAL DE [CIDADE].",
  "Na [data], falamos com produtores e trabalhadores rurais sobre aposentadoria, documentos e os direitos da família de quem vive da roça.",
  "Obrigado ao sindicato pelo espaço.",
  "Protegemos o patrimônio e o futuro de quem produz, da porteira à aposentadoria."]))
