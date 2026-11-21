"""Conteúdo do plano do bloco Previdenciário Rural, 23/10 a 21/11/2026.

É a fonte do PDF que vai pra Dra. Elisa. Só entra aqui o que ela precisa ler:
roteiro, objetivo e fonte de cada peça. Direção de motion, marcação de voz e
bastidor de produção ficam nos .md de roteiro, não aqui.
"""

F = {  # fontes, citadas por chave em cada peça
 "inss_rural": ("INSS · Aposentadoria por idade do trabalhador rural",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/aposentadorias/aposentadoria-por-idade-do-trabalhador-rural"),
 "inss_urbana": ("INSS · Aposentadoria por idade urbana (regra de transição)",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/aposentadorias/aposentadoria-por-idade-urbana"),
 "inss_contrib": ("INSS · Contribuição do segurado especial",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/contribuicao-do-segurado-especial"),
 "inss_pensao": ("INSS · Pensão por morte do segurado especial",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/pensoes/pensao-por-morte-do-a-segurado-a-especial"),
 "inss_incap": ("INSS · Auxílio por incapacidade temporária",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/beneficios-por-incapacidade/auxilio-por-incapacidade-temporaria"),
 "inss_sm": ("gov.br · Solicitar salário-maternidade rural",
   "https://www.gov.br/pt-br/servicos/solicitar-salario-maternidade-rural"),
 "inss_recurso": ("INSS · Recurso, dúvidas frequentes (prazo de 30 dias)",
   "https://www.gov.br/inss/pt-br/direitos-e-deveres/recurso/duvidas-frequentes"),
 "lei_11": ("Lei 8.213/91, art. 11, VII e §7º, na redação da Lei 11.718/2008 (segurado especial, 4 módulos fiscais, 120 pessoas/dia)", None),
 "lei_39": ("Lei 8.213/91, art. 39, I e parágrafo único (benefícios do segurado especial no valor de um salário mínimo)", None),
 "lei_48": ("Lei 8.213/91, art. 48, §§1º e 3º (idade rural e aposentadoria híbrida)", None),
 "lei_38b": ("Lei 8.213/91, arts. 38-A e 38-B, na redação da Lei 13.846/2019 (autodeclaração e cadastro do segurado especial)", None),
 "lei_106": ("Lei 8.213/91, art. 106, e IN PRES/INSS 128/2022, art. 116 (documentos de prova rural)", None),
 "lei_74": ("Lei 8.213/91, art. 74, I (pensão desde o óbito se pedida em até 90 dias; 180 dias para filhos menores de 16)", None),
 "lei_77": ("Lei 8.213/91, art. 77, §2º, V, e Portaria ME 424/2020 (duração da pensão do cônjuge)", None),
 "lei_103": ("Lei 8.213/91, art. 103 (prazo de 10 anos para revisão do ato de concessão)", None),
 "cf_201": ("Constituição Federal, art. 201, §7º, II, na redação da EC 103/2019 (idade reduzida do trabalhador rural)", None),
 "stj_1007": ("STJ, Tema 1.007 (REsp 1.674.221 e 1.788.404): tempo rural remoto, sem contribuição, conta na aposentadoria híbrida", None),
 "stj_629": ("STJ, Tema 629 (REsp 1.352.721/SP): sem prova material, a ação rural é extinta sem julgar o mérito e pode ser proposta de novo", None),
 "stj_120": ("STJ, 1ª Turma: atividade remunerada por mais de 120 dias no ano descaracteriza o segurado especial",
   "https://www.sedep.com.br/?p=92845"),
 "stj_modulos": ("STJ: área acima de 4 módulos fiscais, sozinha, não afasta a condição de segurado especial (entendimento reiterado)", None),
 "sum_149": ("Súmula 149 do STJ: prova exclusivamente testemunhal não basta para comprovar atividade rural", None),
 "tnu_14": ("Súmula 14 da TNU: o início de prova material não precisa cobrir todo o período de carência", None),
 "stf_2110": ("STF, ADI 2110 (2024): inconstitucional exigir carência para o salário-maternidade de contribuinte individual, segurada especial e facultativa", None),
}

GRADE = [
 ("23/10","sex","Vídeo","Lançamento: a Gorayeb abre a área de Direito Previdenciário","lanc"),
 ("24/10","sáb","Carrossel","Disputas com cooperativas · encerra o bloco de crédito rural, já aprovado","fora"),
 ("27/10","ter","Vídeo","Segurado especial: quem vive da roça tem aposentadoria","v1"),
 ("29/10","qui","Carrossel","Segurado especial: os três critérios e o que derruba cada um","c1"),
 ("31/10","sáb","Estático","Trabalho na terra, não contribuição mensal","e1"),
 ("03/11","ter","Vídeo","Trabalhou na roça e depois na cidade: como o tempo se soma","v2"),
 ("05/11","qui","Carrossel","Período rural negado pelo INSS: dá pra revisar","c2"),
 ("07/11","sáb","Estático","A idade de quem trabalha na roça não mudou","e2"),
 ("10/11","ter","Vídeo","A prova é o que decide · com o Dr. Gustavo","v3"),
 ("12/11","qui","Carrossel","Os documentos que o INSS aceita como prova","c3"),
 ("14/11","sáb","Estático","Papel guardado vira aposentadoria","e3"),
 ("17/11","ter","Vídeo","Pensão por morte no campo · com o Dr. Gustavo","v4"),
 ("19/11","qui","Carrossel","Pensão, salário-maternidade e auxílio-doença: o que a família rural tem","c4"),
 ("21/11","sáb","Estático","O ano de pedir não é o ano de começar a cuidar","e4"),
]

PECAS = []

# ---------------------------------------------------------------- lançamento
PECAS.append(dict(id="lanc", data="23/10 · sexta", formato="Vídeo · 50 segundos", quem="Narrado, sem rosto",
 titulo="A Gorayeb abre a área de Direito Previdenciário",
 objetivo="Apresentar a área nova e explicar por que ela nasce dentro de um escritório de agronegócio. É o único vídeo do bloco que cita a área inteira, rural e urbana.",
 narracao=[
  "A Gorayeb sempre cuidou do que o produtor construiu. A terra. O contrato. A safra.",
  "Mas tem uma coisa que a terra não garante sozinha. A renda de quem não pode mais trabalhar nela.",
  "Por isso a Gorayeb Advocacia abre a sua área de Direito Previdenciário.",
  "Aposentadoria rural e urbana. Planejamento previdenciário. Pensão por morte. Auxílio-doença e salário-maternidade. BPC e LOAS. Revisão de benefícios.",
  "Pra quem vive da roça. Pra família de quem vive da roça. E pra quem trabalha na cidade também.",
  "Do mesmo jeito de sempre. Caso por caso. Documento por documento.",
  "Gorayeb Advocacia. Direito Previdenciário.",
 ],
 tela=[
  "Terra, contrato e safra, uma imagem por palavra.",
  "“A renda de quem não pode mais trabalhar nela” sobre a imagem de um trabalhador rural mais velho, de costas.",
  "“Direito Previdenciário” em dourado, com a marca.",
  "A lista de serviços entrando um por um.",
  "Roça, família e cidade, uma imagem para cada público.",
  "Cartão final com a marca e “Direito Previdenciário”.",
 ],
 legenda=[
  "A GORAYEB ADVOCACIA ABRE SUA ÁREA DE DIREITO PREVIDENCIÁRIO.",
  "Sempre cuidamos do que o produtor rural construiu: a terra, os contratos, a safra. Agora cuidamos também da renda de quem não pode mais trabalhar nela.",
  "A nova área atende trabalhadores rurais e urbanos, aposentados, pensionistas e suas famílias, com análise individual de cada caso, nas etapas administrativa e judicial.",
  "Aposentadoria por idade rural e urbana, por tempo de contribuição, especial e por incapacidade. Planejamento previdenciário. Pensão por morte. Auxílio-doença e salário-maternidade. BPC/LOAS para idosos, pessoas com deficiência e pessoas com TEA. Revisão de benefícios.",
  "Nas próximas semanas, vamos falar aqui sobre os direitos previdenciários de quem vive da roça, começando pelo segurado especial. Dúvidas, chame no direct.",
 ],
 legenda_nota="Rascunho. Por ser institucional, a palavra final é de vocês.",
 nota="Roteiro proposto. Se vocês tiverem um vídeo de lançamento de referência, mandem que a gente adapta.",
 fontes=[], fontes_nota="Peça institucional. A lista de serviços segue o texto da área enviado pela Dra. Elisa em 22/10.",
))

# ---------------------------------------------------------------- vídeo 1
PECAS.append(dict(id="v1", data="27/10 · terça", formato="Vídeo · 60 segundos", quem="Narrado, sem rosto",
 titulo="Segurado especial: quem vive da roça tem aposentadoria",
 objetivo="Desfazer a ideia de que quem nunca teve carteira nem pagou INSS todo mês não tem direito. É a porta de entrada do bloco.",
 narracao=[
  "Seu pai trabalhou a vida inteira na roça. Levantou cedo, voltou tarde, criou os filhos daquele chão.",
  "Nunca teve carteira assinada. Nunca pagou INSS todo mês.",
  "E mesmo assim ele pode se aposentar.",
  "O nome disso é segurado especial. É quem vive do que planta ou do que cria, em família, sem empregado fixo.",
  "A idade é sessenta anos pro homem. Cinquenta e cinco pra mulher. A Reforma da Previdência não mexeu nisso.",
  "O que o INSS pede são quinze anos de trabalho na terra.",
  "Trabalho. Não contribuição.",
  "E aqui está o que derruba a maior parte dos pedidos. O INSS não aceita só a sua palavra.",
  "Bloco de notas do produtor. Contrato de parceria. Nota de entrega na cooperativa. Comprovante de ITR.",
  "Papel guardado é o que vira aposentadoria.",
 ],
 tela=[
  "“Sem carteira. Sem INSS todo mês.”",
  "“E mesmo assim pode se aposentar”, com “pode” em destaque.",
  "Os três critérios do segurado especial em lista.",
  "60 homem · 55 mulher.",
  "“15 anos de trabalho” e a palavra “contribuição” riscada.",
  "Os quatro documentos, um por vez.",
 ],
 fontes=["inss_rural","lei_11","lei_48","cf_201","inss_contrib","lei_106"],
))

# ---------------------------------------------------------------- carrossel 1
PECAS.append(dict(id="c1", data="29/10 · quinta", formato="Carrossel · 8 telas", quem=None,
 titulo="Segurado especial: os três critérios e o que derruba cada um",
 objetivo="Ajudar o produtor a saber se ele se enquadra, e mostrar o que costuma tirar o enquadramento antes do pedido.",
 telas=[
  ("Capa", "Segurado especial.", "Três critérios. E o que derruba cada um."),
  ("Quem é", "Quem vive do que tira da terra.", "O produtor que planta, cria, pesca ou extrai, sozinho ou com a família, e vive disso. Entram também o cônjuge e os filhos com mais de 16 anos que trabalham junto."),
  ("Critério 1", "A roça é o sustento.", "A atividade rural precisa ser o que mantém a família. Trabalho remunerado fora, na entressafra, é permitido até 120 dias no ano. Passou disso, o enquadramento cai."),
  ("Critério 2", "Até quatro módulos fiscais.", "É o tamanho da área explorada, e o módulo muda de município pra município. O STJ entende que área maior, sozinha, não tira o enquadramento: ela pesa junto com o resto da prova."),
  ("Critério 3", "Sem empregado fixo.", "Na safra pode contratar ajuda temporária, até 120 pessoas por dia somadas no ano. Empregado permanente descaracteriza."),
  ("Resumo", "Pode e não pode.", "Pode: família trabalhando junto, ajuda temporária na safra, bico na entressafra até 120 dias. Derruba: empregado fixo, emprego fora por mais de 120 dias no ano, renda principal que não vem da roça."),
  ("Atenção", "Tem que estar na roça na hora de pedir.", "O INSS exige que a pessoa ainda esteja na atividade rural quando pede, ou quando completou os requisitos. Quem já saiu da roça pode ter outro caminho: a aposentadoria híbrida, assunto do próximo vídeo."),
  ("Fecho", "Enquadramento se discute caso a caso.", "Salva esse carrossel e manda pra quem está chegando na idade."),
 ],
 fontes=["lei_11","inss_rural","stj_120","stj_modulos"],
))

# ---------------------------------------------------------------- estático 1
PECAS.append(dict(id="e1", data="31/10 · sábado", formato="Estático", quem=None,
 titulo="Trabalho na terra, não contribuição mensal",
 objetivo="Fixar numa frase só o ponto que mais confunde: a aposentadoria rural conta tempo de trabalho, não guia paga.",
 frase=("Na aposentadoria rural, o INSS conta o tempo de roça.", "Não a guia paga."),
 apoio="Quinze anos de atividade rural comprovada. A contribuição do segurado especial sai na venda da produção.",
 legenda=[
  "NA APOSENTADORIA RURAL, O INSS CONTA O TEMPO DE ROÇA. NÃO A GUIA PAGA.",
  "Quem trabalha na cidade se aposenta por tempo de contribuição: são os meses de recolhimento que contam. Na roça é diferente. Para o segurado especial, o que se comprova são quinze anos, ou cento e oitenta meses, de atividade rural.",
  "A contribuição existe, mas não sai por guia todo mês. Ela incide sobre a venda da produção: 1,2% mais 0,1% sobre a receita bruta. Quando quem compra é empresa, ela mesma desconta e recolhe. Desde outubro de 2021, essa comercialização também precisa ser registrada no eSocial.",
  "Quem quiser receber benefício acima de um salário mínimo pode, além disso, contribuir por conta própria, com alíquota de 20%.",
  "Fontes: INSS, páginas da aposentadoria por idade do trabalhador rural e da contribuição do segurado especial.",
 ],
 fontes=["inss_rural","inss_contrib"],
))

# ---------------------------------------------------------------- vídeo 2
PECAS.append(dict(id="v2", data="03/11 · terça", formato="Vídeo · 60 segundos", quem="Narrado, sem rosto",
 titulo="Trabalhou na roça e depois na cidade: como o tempo se soma",
 objetivo="Falar com quem começou na roça e foi pra cidade, e acha que perdeu aqueles anos. Apresenta a aposentadoria híbrida.",
 narracao=[
  "Muita gente começou na roça ainda criança. Depois foi pra cidade. Carteira assinada, comércio, fábrica.",
  "E chega perto da idade achando que os anos de roça se perderam.",
  "Não se perderam.",
  "O nome disso é aposentadoria híbrida. Ela soma o tempo de roça com o tempo de cidade. São quinze anos, juntando os dois.",
  "A diferença é a idade. Na híbrida vale a idade de quem trabalha na cidade. Sessenta e cinco anos pro homem. Sessenta e dois pra mulher.",
  "E o tempo de roça conta mesmo que seja antigo, de antes de mil novecentos e noventa e um, e mesmo que ninguém tenha pagado nada naquela época. Foi o que decidiu o Superior Tribunal de Justiça.",
  "O que precisa é provar que você trabalhou lá. Certidão de casamento ou de nascimento dos filhos com a profissão de lavrador. Documento da terra no nome do seu pai.",
  "Os anos de roça não somem. Só precisam de papel.",
 ],
 tela=[
  "“Roça” e “cidade” lado a lado, com um sinal de soma entre os dois.",
  "“Aposentadoria híbrida” em destaque.",
  "65 homem · 62 mulher.",
  "“Tempo antigo também conta”, com a referência ao STJ.",
  "Os documentos de família, um por vez.",
 ],
 nota="A idade de 62 anos para a mulher é a da regra de transição, para quem já era segurada do INSS até 13/11/2019, que é o caso de quem vai pedir a híbrida nos próximos anos.",
 fontes=["inss_rural","inss_urbana","lei_48","stj_1007"],
))

# ---------------------------------------------------------------- carrossel 2
PECAS.append(dict(id="c2", data="05/11 · quinta", formato="Carrossel · 8 telas", quem=None,
 titulo="Período rural negado pelo INSS: dá pra revisar",
 objetivo="Mostrar a quem teve tempo de roça recusado que a negativa não é a última palavra, e quais são os caminhos.",
 telas=[
  ("Capa", "O INSS negou seu tempo de roça.", "Não é a última palavra."),
  ("Por que nega", "Quase sempre é falta de papel.", "Autodeclaração que não bateu com as bases do governo, documento que não cobre o período pedido, testemunha sem nenhum documento junto."),
  ("Caminho 1", "Recurso em 30 dias.", "Da data em que você soube da negativa. Vai para a Junta de Recursos, pelo Meu INSS ou pelo 135."),
  ("Caminho 2", "Novo pedido com documento novo.", "Achou um papel que não tinha apresentado? Dá pra pedir de novo, agora com ele."),
  ("Caminho 3", "Justiça, com uma regra a favor do produtor.", "O STJ decidiu que, quando falta prova material do trabalho rural, o processo é encerrado sem julgar o mérito. Na prática, dá pra entrar de novo quando você conseguir o documento."),
  ("Já aposentado", "Tempo de roça que ficou de fora.", "Se o INSS concedeu a aposentadoria sem contar um período rural, dá pra pedir revisão. O prazo é de dez anos, contados a partir do primeiro pagamento."),
  ("O que separar", "Antes de qualquer caminho.", "A carta de negativa ou de concessão, a cópia do processo no Meu INSS, e todo documento rural, inclusive os que estão no nome dos pais e do cônjuge."),
  ("Fecho", "Negativa do INSS tem volta.", "Salva esse carrossel e manda pra quem ouviu um não."),
 ],
 fontes=["inss_recurso","stj_629","lei_103","lei_106"],
))

# ---------------------------------------------------------------- estático 2
PECAS.append(dict(id="e2", data="07/11 · sábado", formato="Estático", quem=None,
 titulo="A idade de quem trabalha na roça não mudou",
 objetivo="Responder ao medo mais comum depois da Reforma: o de que a idade rural também subiu.",
 frase=("A Reforma mexeu na idade da aposentadoria urbana.", "Na rural, não."),
 apoio="Sessenta anos pro homem, cinquenta e cinco pra mulher, com quinze anos de atividade rural. Na cidade, a mulher já precisa de sessenta e dois.",
 legenda=[
  "A REFORMA MEXEU NA IDADE DA APOSENTADORIA URBANA. NA RURAL, NÃO.",
  "Desde 2019 circula a ideia de que todo mundo vai ter que trabalhar mais pra se aposentar. Para o trabalhador rural, a idade continua a mesma: sessenta anos para o homem e cinquenta e cinco para a mulher, cinco anos a menos que na cidade.",
  "Na aposentadoria urbana, a idade da mulher subiu de sessenta para sessenta e dois anos, aos poucos, até 2023. A do homem continua sessenta e cinco.",
  "O tempo exigido do trabalhador rural também não mudou: quinze anos de atividade rural comprovada.",
  "De vez em quando aparece notícia de estudo propondo mudar a regra rural. Proposta não muda direito de ninguém. Vale a lei em vigor.",
  "Fontes: Constituição Federal, art. 201, §7º, II; INSS, páginas da aposentadoria por idade rural e urbana.",
 ],
 fontes=["cf_201","inss_rural","inss_urbana"],
))

# ---------------------------------------------------------------- vídeo 3
PECAS.append(dict(id="v3", data="10/11 · terça", formato="Vídeo · 70 segundos", quem="Gravado pelo Dr. Gustavo",
 titulo="A prova é o que decide",
 objetivo="Explicar, com o advogado da área na frente da câmera, como o INSS confere o trabalho rural hoje, e a mudança de 2023 que pouca gente conhece.",
 narracao=[
  "Eu sou o Dr. Gustavo, da área de Direito Previdenciário da Gorayeb.",
  "Na aposentadoria rural, quem decide não é a idade. É a prova.",
  "Hoje funciona assim. Você faz uma autodeclaração contando onde trabalhou, com quem e em que período. O INSS confere essa declaração com as bases de dados do governo. Se bater, ótimo. Se não bater, ele pede documento.",
  "E tem uma mudança que muita gente ainda não sabe. Para o tempo de roça a partir de 2023, a prova passa a ser só o cadastro do segurado especial. Se o seu cadastro não estiver em dia, esse tempo pode não aparecer.",
  "Para o tempo mais antigo, vale o papel. Nota de venda da produção. Contrato de arrendamento ou de parceria. ITR. Ficha da cooperativa. Certidão de casamento ou de nascimento dos filhos com a profissão de lavrador.",
  "Documento no nome do pai, da mãe ou do marido também ajuda, quando a família trabalhava junto.",
  "Testemunha ajuda. Mas sozinha não sustenta o pedido.",
  "Então o conselho é simples. Guarde tudo. E confira se o seu cadastro rural está atualizado.",
 ],
 tela=[
  "Nome e área do Dr. Gustavo na primeira fala.",
  "“Autodeclaração + conferência do INSS”.",
  "“A partir de 2023: só o cadastro”, em destaque.",
  "Os documentos aparecem escritos enquanto ele fala.",
  "“Testemunha sozinha não basta.”",
 ],
 fontes=["inss_rural","lei_38b","lei_106","sum_149"],
))

# ---------------------------------------------------------------- carrossel 3
PECAS.append(dict(id="c3", data="12/11 · quinta", formato="Carrossel · 8 telas", quem=None,
 titulo="Os documentos que o INSS aceita como prova",
 objetivo="Dar ao produtor a lista do que guardar, separada por origem, pra ele saber onde procurar.",
 telas=[
  ("Capa", "O que guardar pra provar", "que você trabalhou na roça."),
  ("Antes de tudo", "O cadastro do segurado especial.", "Para o tempo a partir de 2023, ele é a única prova. Para o tempo anterior, a autodeclaração confere com as bases do governo e o documento entra quando não bate."),
  ("Da produção", "O que mostra que você vendia.", "Bloco de notas do produtor. Nota fiscal de venda da produção. Comprovante de entrega na cooperativa."),
  ("Da terra", "O que mostra onde você trabalhava.", "Contrato de arrendamento, de parceria ou de comodato. Comprovante de pagamento do ITR. Documento do imóvel rural."),
  ("Da família", "O que mostra que a família era da roça.", "Certidão de casamento ou de nascimento dos filhos com a profissão de lavrador. Documentos no nome dos pais ou do cônjuge, quando trabalhavam juntos."),
  ("Da cooperativa", "O que mostra o vínculo.", "Ficha de associado e as notas de entrega de cada safra."),
  ("O que não basta", "Testemunha sozinha.", "Ela precisa vir junto de um começo de prova no papel. Mas o documento não precisa cobrir cada ano: alguns papéis espalhados pelo período, somados à testemunha, podem fechar a prova."),
  ("Fecho", "Pasta de papel velho é patrimônio.", "Salva esse carrossel e confere a sua hoje."),
 ],
 fontes=["lei_106","lei_38b","inss_rural","sum_149","tnu_14"],
))

# ---------------------------------------------------------------- estático 3
PECAS.append(dict(id="e3", data="14/11 · sábado", formato="Estático", quem=None,
 titulo="Papel guardado vira aposentadoria",
 objetivo="Transformar a lista do carrossel numa frase que circula no WhatsApp da família.",
 frase=("Nota de venda velha não é lixo.", "É prova de aposentadoria."),
 apoio="Bloco de produtor, contrato de parceria, ITR, nota da cooperativa. Cada papel liga o seu nome à terra num ano. É isso que o INSS confere.",
 legenda=[
  "NOTA DE VENDA VELHA NÃO É LIXO. É PROVA DE APOSENTADORIA.",
  "Muita prova de atividade rural se perde em faxina de gaveta. Bloco de notas do produtor, contrato de arrendamento ou de parceria, comprovante de ITR, nota de entrega na cooperativa, certidão de casamento com a profissão de lavrador: cada um desses papéis liga o nome de alguém à terra num determinado ano.",
  "Não precisa ter um documento para cada ano. Mas quanto mais papéis espalhados pelo período, mais forte fica o pedido.",
  "E para o tempo de roça a partir de 2023, o que vale é o cadastro do segurado especial. Vale conferir se o seu está em dia.",
  "Fontes: Lei 8.213/91, art. 106; IN PRES/INSS 128/2022, art. 116; Súmula 14 da TNU.",
 ],
 fontes=["lei_106","tnu_14","inss_rural"],
))

# ---------------------------------------------------------------- vídeo 4
PECAS.append(dict(id="v4", data="17/11 · terça", formato="Vídeo · 70 segundos", quem="Gravado pelo Dr. Gustavo",
 titulo="Pensão por morte no campo",
 objetivo="Falar com a viúva e os filhos do produtor: quem tem direito, quanto tempo dura, e o prazo que faz diferença no pagamento.",
 narracao=[
  "Quando o produtor que vive da roça falece, a família tem direito à pensão por morte. E muita viúva não pede porque acha que o marido não contribuía.",
  "Não precisa ter contribuído. Precisa provar que ele trabalhava na roça. A pensão rural é de um salário mínimo.",
  "Quem recebe: a esposa ou companheira e os filhos até vinte e um anos. Se não houver, os pais. Depois, os irmãos.",
  "E aqui tem uma regra que pega muita gente: quanto tempo a viúva recebe.",
  "Se ele trabalhava na roça há pelo menos dezoito meses, e o casamento ou a união tinha pelo menos dois anos, a duração depende da idade dela na data da morte. A partir de quarenta e cinco anos, é para a vida toda. Mais nova, tem prazo.",
  "Sem esses dezoito meses ou esses dois anos, a pensão dura quatro meses. A não ser que a morte tenha sido por acidente.",
  "União estável vale. Mas precisa provar. Filho em comum, mesmo endereço, conta conjunta.",
  "E o prazo para pedir importa. Pedindo em até noventa dias do falecimento, a pensão é paga desde a data da morte.",
 ],
 tela=[
  "“Não precisa ter contribuído.”",
  "Ordem dos dependentes: cônjuge e filhos, pais, irmãos.",
  "“18 meses de roça + 2 anos de união”.",
  "“A partir de 45 anos: vitalícia.”",
  "“90 dias” em destaque no fecho.",
 ],
 nota="Na pensão, o prazo de 90 dias vale para cônjuge e companheira. Para filhos menores de 16 anos, o prazo é de 180 dias. A tabela completa de duração por idade entra na legenda.",
 fontes=["inss_pensao","lei_39","lei_77","lei_74"],
))

# ---------------------------------------------------------------- carrossel 4
PECAS.append(dict(id="c4", data="19/11 · quinta", formato="Carrossel · 8 telas", quem=None,
 titulo="Pensão, salário-maternidade e auxílio-doença: o que a família rural tem",
 objetivo="Mostrar que a proteção do segurado especial vai além da aposentadoria, cobrindo a família nos momentos em que a renda para.",
 telas=[
  ("Capa", "Não é só aposentadoria.", "A família da roça tem mais direitos."),
  ("Salário-maternidade", "120 dias, um salário mínimo.", "Para a trabalhadora rural no nascimento do filho, na adoção ou guarda para adoção, e em caso de aborto não criminoso. O pedido é pelo Meu INSS, em até cinco anos."),
  ("Salário-maternidade", "O que o INSS pede.", "A comprovação do trabalho rural nos meses anteriores ao parto. Hoje o INSS pede dez meses. Em 2024 o STF considerou inconstitucional exigir carência nesse benefício, e a aplicação disso à trabalhadora rural ainda está sendo discutida."),
  ("Auxílio-doença", "Ficou mais de 15 dias sem trabalhar.", "Por doença ou acidente, comprovado em perícia. O segurado especial precisa comprovar doze meses de trabalho rural, e recebe um salário mínimo."),
  ("Auxílio-doença", "Quando não precisa dos doze meses.", "Em acidente de qualquer natureza e em doenças graves da lista do governo. E quando o afastamento vem do próprio trabalho, como acidente com máquina, ele é acidentário."),
  ("Pensão por morte", "Para quem fica.", "Cônjuge ou companheira e filhos até 21 anos, um salário mínimo. A duração para a viúva depende da idade dela: a partir de 45 anos, é vitalícia."),
  ("O que vale para todos", "Provar que trabalhava na roça.", "Nenhum desses benefícios exige guia paga. Todos exigem prova do trabalho rural, e para o tempo a partir de 2023, cadastro em dia."),
  ("Fecho", "Proteção que a família nem sabe que tem.", "Salva esse carrossel e manda pra quem está esperando filho na roça."),
 ],
 fontes=["inss_sm","stf_2110","inss_incap","inss_pensao","lei_39","inss_rural"],
))

# ---------------------------------------------------------------- estático 4
PECAS.append(dict(id="e4", data="21/11 · sábado", formato="Estático", quem=None,
 titulo="O ano de pedir não é o ano de começar a cuidar",
 objetivo="Fechar o bloco virando a chave para o planejamento previdenciário.",
 frase=("Aposentadoria rural se ganha com papel.", "E papel se junta em quinze anos, não em quinze dias."),
 apoio="Desde 2023, o tempo de roça só conta se estiver no cadastro do segurado especial. Conferir isso agora é o planejamento mais barato que existe.",
 legenda=[
  "APOSENTADORIA RURAL SE GANHA COM PAPEL. E PAPEL SE JUNTA EM QUINZE ANOS, NÃO EM QUINZE DIAS.",
  "A maioria dos pedidos negados não falha na idade. Falha na prova. E prova não se fabrica no ano em que a pessoa resolve parar: ela se acumula, safra por safra.",
  "Planejar a aposentadoria rural começa por três conferências. O cadastro do segurado especial, que desde 2023 é a única prova do tempo de roça. O extrato do CNIS, que mostra o que o INSS já enxerga. E a pasta de documentos de cada ano.",
  "Também é no planejamento que se decide se vale contribuir por conta própria para receber acima de um salário mínimo, ou se o caminho é a aposentadoria híbrida, para quem também trabalhou na cidade.",
  "Fontes: INSS, páginas da aposentadoria por idade do trabalhador rural e da contribuição do segurado especial.",
 ],
 fontes=["inss_rural","inss_contrib"],
))
