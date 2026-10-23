"""Linha editorial de 26/10 a 18/12/2026, depois do e-mail da Dra. Elisa de 23/10.

O lançamento da área previdenciária ficou suspenso (eventos, cartilhas, chamada,
registros). O previdenciário sai uma vez por semana, às quartas, começando pelo vídeo
que informa a área. Segundas e sextas são do agronegócio e do empresarial, com os
vídeos gravados em setembro rodando nas segundas.

    python3 -I docs/gorayeb/calendario/plano-previdenciario/gerar.py \\
        --conteudo docs/gorayeb/linha-editorial/conteudo.py

Os posts previdenciários vêm de lancamento-previdenciario/conteudo.py, só com data
nova. Os novos do agronegócio e do empresarial estão em agro_*.py, nesta pasta.
"""
import datetime, importlib.util, json, os

AQUI = os.path.dirname(os.path.abspath(__file__))
GORAYEB = os.path.dirname(AQUI)

def _carrega(caminho, nome):
    spec = importlib.util.spec_from_file_location(nome, caminho)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

HOJE = datetime.date(2026, 10, 23)
SLUG = "linha-editorial"
ARQUIVO = "Linha_Editorial_Gorayeb"
TITULO_DOC = "Linha editorial · Gorayeb Advocacia"

PREV = _carrega(os.path.join(GORAYEB, "lancamento-previdenciario", "conteudo.py"), "prev")
AMB = _carrega(os.path.join(AQUI, "agro_ambiental.py"), "amb")
TRAB = _carrega(os.path.join(AQUI, "agro_trabalhista.py"), "trab")
SUC = _carrega(os.path.join(AQUI, "agro_sucessao.py"), "suc")

F = dict(PREV.F)
F.update({
 "inss_urbana": PREV.F["inss_urbana"],
 "inss_especial": PREV.F["inss_especial"],
 "lei_5764": ("Lei 5.764/1971 (cooperativas), arts. 68, IX, e 79 (ato cooperativo)", None),
 "stj_coop_rj": ("STJ, 3ª Turma, REsp 2.091.441 e REsp 2.110.361 (2024): crédito de ato cooperativo fora da recuperação judicial", None),
 "stj_coop_contas": ("STJ, REsp 1.102.688/RS: prestação de contas da cooperativa é da assembleia geral", None),
 "cf_5_xxvi": ("Constituição Federal, art. 5º, XXVI (impenhorabilidade da pequena propriedade rural trabalhada pela família)", None),
 "stf_961": ("STF, Tema 961, ARE 1.038.507 (2020): pequena propriedade formada por terrenos contínuos, até quatro módulos fiscais, mesmo dada em garantia", None),
 "cpc_833": ("Código de Processo Civil, art. 833, VIII e §1º: a proteção não vale contra a dívida do próprio bem, inclusive a de sua compra", None),
 "lei_12651": ("Lei 12.651/2012 (Código Florestal), art. 29: o CAR é obrigatório para todo imóvel rural e não serve como título de propriedade", None),
 "cf_191": ("Constituição Federal, art. 191 (usucapião especial rural, até 50 hectares, 5 anos)", None),
 "cc_1238": ("Código Civil, arts. 1.238 e 1.239 (usucapião extraordinária de 15 e 10 anos e especial rural)", None),
 "lrp_216a": ("Lei 6.015/1973, art. 216-A (usucapião em cartório, sem processo judicial)", None),
 "car_gov": ("Serviço Florestal Brasileiro · Cadastro Ambiental Rural", "https://www.car.gov.br"),
})
for m in (AMB, TRAB, SUC):
    F.update(m.FONTES)

def _redata(titulo, data):
    p = next(p for p in PREV.PECAS if p["titulo"] == titulo)
    p = dict(p, data=data, pilar="Previdenciário")
    p.pop("status", None) if "Depende" in p.get("status", "") else None
    return p

def _agro(mod, titulo, data):
    p = next(p for p in mod.PECAS if p["titulo"] == titulo)
    return dict(p, data=data)

def _json(nome):
    return json.load(open(os.path.join(GORAYEB, "carrosseis", nome + ".json"), encoding="utf8"))

# --------------------------------------------------------------- vídeo da área
VIDEO_AREA = dict(data="28/10 · quarta", formato="Vídeo · 90 segundos", pilar="Previdenciário",
 quem="Narração institucional, sem gravação",
 titulo="Vídeo da área previdenciária",
 objetivo="Informar que a Gorayeb agora atua em Direito Previdenciário e mostrar a área inteira, no campo e na cidade: aposentadorias, planejamento, BPC/LOAS, benefícios da família e revisão.",
 tabela=(["Tempo","Cena","Na tela","Narração"],[
  ("0–5s","Campo ao amanhecer: estrada de terra, porteira.","A logo se formando.","(Trilha.)"),
  ("5–14s","Lavoura, gado, a cidade de longe.","","Há mais de vinte e cinco anos, a Gorayeb Advocacia caminha junto com quem produz e com as empresas da nossa região. Cuidando da terra, dos contratos, da família."),
  ("14–22s","Mãos calejadas; um senhor olhando a lavoura, de costas.","Direito Previdenciário.","Mas cuidar do futuro de uma família também é cuidar da aposentadoria. Por isso, a Gorayeb agora atua em Direito Previdenciário. No campo e na cidade."),
  ("22–34s","Trabalhador na lavoura; depois, um trabalhador de fábrica ou de obra.","Aposentadoria por idade, rural e urbana, especial e híbrida.","Cuidamos da aposentadoria por idade, rural e urbana. Da aposentadoria especial, de quem trabalha exposto a ruído, calor ou produto químico. E da híbrida, que soma o tempo de roça com o tempo de cidade."),
  ("34–41s","Mesa com carteira de trabalho e documentos.","Planejamento previdenciário.","Fazemos o planejamento previdenciário: olhar o seu histórico antes de pedir, para saber quando e por qual regra se aposentar."),
  ("41–51s","Avó com a neta; mãe com o filho.","BPC/LOAS: idosos, pessoas com deficiência, autismo.","Orientamos sobre o BPC, o benefício de um salário mínimo para idosos a partir de sessenta e cinco anos e para pessoas com deficiência, inclusive com autismo, de famílias de baixa renda."),
  ("51–62s","Família reunida na varanda; uma gestante.","Pensão por morte, salário-maternidade, auxílio por incapacidade temporária.","Cuidamos também da família: pensão por morte, salário-maternidade e auxílio por incapacidade temporária, o antigo auxílio-doença, para quem precisa se afastar do trabalho."),
  ("62–70s","Casal de aposentados conferindo um papel.","Revisão de benefícios.","E revisamos aposentadorias e pensões já concedidas, para conferir se o cálculo e o tempo de trabalho foram reconhecidos do jeito certo."),
  ("70–78s","Fundo verde da marca.","Todos os serviços entrando um a um, com ícone.","(Trilha.)"),
  ("78–90s","Porteira se abrindo; volta o campo.","Cartão final: Protegemos o patrimônio e o futuro de quem produz, da porteira à aposentadoria. E a logo.","Se você ou alguém da sua família tem dúvida sobre aposentadoria ou benefício do INSS, converse com a gente. Gorayeb Advocacia. Da porteira à aposentadoria."),
 ]),
 duas_paginas=True,
 legenda=[l for l in open(os.path.join(AQUI, "01-legenda-28-10.txt"), encoding="utf8").read().split("\n\n") if l.strip()],
 nota="Ninguém aparece falando: a voz é a da marca, sem imitar a de nenhum dos advogados. Se preferirem manter as fotos do Dr. Fernando e do Dr. Gustavo, como na versão anterior, elas entram com nome e OAB em 5–14s e em 22–34s, sem mudar a narração.",
 fontes=["inss_rural","inss_urbana","inss_especial","inss_bpc_idoso","inss_bpc_pcd","lei_12764","inss_incap","inss_pensao","lei_48","lei_103"],
)

# --------------------------------------------------------------- prontos do agronegócio
_coop = _json("disputas-cooperativas")
COOP = dict(data="26/10 · segunda", formato="Carrossel · 8 telas", pilar="Agronegócio · Crédito rural",
 status="Pronto e aprovado.",
 titulo="Disputas com cooperativas: o que fazer quando o produtor se sente lesado",
 objetivo="Mostrar que o cooperado é dono, e não cliente, e o que isso muda quando a relação com a cooperativa dá problema.",
 telas=[
  ("Capa","Na cooperativa, você não é cliente.","É dono. E isso muda os seus direitos quando dá problema."),
  ("A lei","O que a lei chama disso.","A operação entre a cooperativa e o cooperado é ato cooperativo. Não é compra e venda. Por isso o STJ afasta o Código de Defesa do Consumidor nessas relações."),
  ("Comparação","Cliente ou cooperado.","No lugar do Código de Defesa do Consumidor, a Lei 5.764/71 e o estatuto. No lugar do Procon, a assembleia. E um voto por cooperado, qualquer que seja a cota."),
  ("Recuperação judicial","A dívida da cooperativa fica de fora.","O STJ decidiu em 2024 que crédito de ato cooperativo não entra na recuperação judicial, junto com a CPR de liquidação física e o barter."),
  ("Na prática","Onde a disputa costuma nascer.","Juros acima do contrato, grão retido para cobrir dívida de terceiro, desconto sem a conta aberta, rateio de perdas sem assembleia, exclusão sem o processo do estatuto."),
  ("Assembleia","Não é formalidade.","Quem examina e aprova as contas da cooperativa é a assembleia geral. Faltar nela é abrir mão do lugar onde a sua voz pesa igual à dos outros."),
  ("O que juntar","Antes da conversa.","Estatuto e atas das últimas assembleias, extrato da conta de cooperado com as notas de entrega, contratos e CPRs assinados."),
  ("Fecho","A regra do jogo está no estatuto.","Quase ninguém leu o dele. Salve este carrossel e mande para quem é cooperado."),
 ],
 fontes=["lei_5764","stj_coop_rj","stj_coop_contas"],
)

_pat = _json("patrimonio-produtor-pf")
PATRIMONIO = dict(data="30/10 · sexta", formato="Estático", pilar="Agronegócio · Crédito rural",
 status="Pronto e aprovado. A fonte da exceção foi corrigida: é o art. 833, §1º do CPC, e não a Súmula 349 do STJ, que trata de FGTS.",
 titulo="Produtor pessoa física: a proteção do patrimônio",
 objetivo="Explicar a proteção da pequena propriedade rural contra penhora e a exceção que pega muita gente.",
 frase=("A pequena propriedade rural é impenhorável.","Menos pra quem financiou ela."),
 apoio=_pat["slides"][0]["apoio"],
 legenda=[l for l in _pat["legenda_instagram"].split("\n\n") if l.strip() and not l.startswith("Fontes")],
 fontes=["cf_5_xxvi","stf_961","cpc_833"],
)

# --------------------------------------------------------------- vídeos gravados em setembro
def _gravado(data, titulo, objetivo, fala, legenda, fontes):
    return dict(data=data, formato="Vídeo · 60 segundos", pilar="Agronegócio · Ambiental e fundiário",
     quem="Gravado em setembro", status="Gravado e editado. Pronto para publicar; nova, só a legenda.",
     titulo=titulo, objetivo=objetivo, narracao=fala, rotulo_fala="Fala gravada", legenda=legenda, fontes=fontes)

CAR1 = _gravado("02/11 · segunda", "O que é o CAR e por que ele é obrigatório",
 "Abrir a série de três vídeos: o CAR é obrigatório e estar inscrito não basta.",
 ["Fazer o cadastro não quer dizer que a sua fazenda está regular. Em menos de um minuto vou te explicar o que é o CAR, por que ele é obrigatório e onde a maioria escorrega.",
  "CAR é o Cadastro Ambiental Rural. Nele entram a área total, a reserva legal, as áreas de preservação e a área que você usa para produzir. Desde o Código Florestal de 2012, ele é obrigatório para todo imóvel rural, pequeno ou grande.",
  "O cadastro é declarado pelo produtor e depois analisado pelo órgão ambiental. É nessa análise que aparecem as pendências: mapa diferente da realidade, reserva legal menor que a exigida, área de preservação aberta.",
  "E hoje o CAR pesa no bolso: é com base nele que o banco libera ou trava o crédito rural. Inscrever é só o começo. O que protege é o cadastro analisado e em dia."],
 ["FAZER O CAR NÃO QUER DIZER QUE A SUA FAZENDA ESTÁ REGULAR.",
  "O Cadastro Ambiental Rural é obrigatório para todo imóvel rural desde o Código Florestal de 2012. Nele entram a área total, a reserva legal, as áreas de preservação permanente e a área de produção.",
  "O cadastro é declarado pelo próprio produtor. Depois, o órgão ambiental analisa, e é nessa análise que aparecem as pendências: mapa diferente da realidade, reserva legal menor que a exigida, área de preservação aberta.",
  "E o CAR pesa no crédito rural: é com base nele que o banco libera ou trava o financiamento.",
  "Este é o primeiro de três vídeos sobre o CAR e a regularização da terra. O próximo sai na segunda que vem.",
  "Salve este vídeo e mande para quem fez o CAR e nunca mais olhou."],
 ["lei_12651","car_gov"])

CAR2 = _gravado("09/11 · segunda", "O CAR pode revelar um conflito de terra",
 "Mostrar que o CAR aponta sobreposição com o vizinho, mas não prova propriedade.",
 ["O que ninguém te conta: o CAR do vizinho pode estar desenhado dentro da sua terra, e você nem sabe. Vou te mostrar como descobrir isso, e o que o CAR pode e não pode fazer por você.",
  "Quando dois cadastros ocupam a mesma área, o sistema aponta sobreposição. Às vezes é erro de quem desenhou o mapa. Às vezes é alguém declarando como dela uma parte da sua terra. Descobrir cedo muda tudo: dá para resolver na conversa, com a correção do cadastro, antes de virar briga de divisa.",
  "Mas atenção: CAR não é documento de propriedade. A lei diz isso com todas as letras. Ter CAR não prova que a terra é sua. E o CAR do vizinho também não prova que ela é dele.",
  "Quem prova a propriedade é a matrícula, com o georreferenciamento certificado. O CAR é o alarme. A matrícula é a prova."],
 ["O CAR DO VIZINHO PODE ESTAR DESENHADO DENTRO DA SUA TERRA.",
  "Quando dois cadastros ocupam a mesma área, o sistema aponta sobreposição. Pode ser erro de quem desenhou o mapa ou alguém declarando como dele uma parte da sua terra. Descoberto cedo, dá para resolver com a correção do cadastro, antes de virar briga de divisa.",
  "Mas o CAR não é documento de propriedade. O próprio Código Florestal diz que ele não serve como título. Quem prova a propriedade é a matrícula, com o georreferenciamento certificado.",
  "O CAR é o alarme. A matrícula é a prova.",
  "Segundo vídeo da série sobre o CAR. O terceiro, na segunda que vem, fala de quando a posse ainda não está no papel.",
  "Marque aqui quem nunca conferiu o mapa do próprio CAR."],
 ["lei_12651","car_gov"])

USUC = _gravado("16/11 · segunda", "Usucapião rural: quando o pequeno produtor pode regularizar a posse",
 "Fechar a série: quando a posse não está no papel, a usucapião é o caminho até a matrícula.",
 ["Se você mora e trabalha há anos numa terra que não está no seu nome, esse vídeo é para você. Existe um caminho na lei para transformar essa posse em propriedade.",
  "Chama usucapião especial rural, e está na Constituição. São cinco requisitos: área de até 50 hectares; cinco anos de posse sem interrupção e sem ninguém contestar; a terra produzindo pelo trabalho seu ou da sua família; moradia nela; e você não pode ser dono de outro imóvel. E terra pública não entra.",
  "Não se encaixa? Existem outras modalidades, com prazos maiores, de dez e quinze anos. E quando não há conflito, dá para fazer em cartório, sem processo na Justiça.",
  "O primeiro passo é juntar prova da posse: contas, notas, fotos, testemunhas, tudo que mostre há quanto tempo você está ali."],
 ["MORA E TRABALHA HÁ ANOS NUMA TERRA QUE NÃO ESTÁ NO SEU NOME?",
  "A Constituição prevê a usucapião especial rural para quem preenche cinco requisitos: área de até 50 hectares, cinco anos de posse sem interrupção e sem oposição, a terra produzindo pelo trabalho da pessoa ou da família, moradia no imóvel e nenhum outro imóvel no nome. Terra pública não entra.",
  "Quem não se encaixa pode ter outras modalidades, com prazos de dez e quinze anos. E, quando não há conflito, o pedido pode ser feito em cartório, sem processo judicial.",
  "O primeiro passo é juntar prova da posse: contas, notas, fotos e testemunhas que mostrem há quanto tempo você está ali.",
  "Último vídeo da série sobre o CAR e a regularização da terra.",
  "Mande este vídeo para quem vive essa situação."],
 ["cf_191","cc_1238","lrp_216a"])

PECAS = [
 COOP,
 VIDEO_AREA,
 PATRIMONIO,
 CAR1,
 _redata("Trabalho no campo conta para a aposentadoria?", "04/11 · quarta"),
 _agro(AMB, AMB.PECAS[0]["titulo"], "06/11 · sexta"),
 CAR2,
 _redata("BPC/LOAS: quem tem direito", "11/11 · quarta"),
 _agro(AMB, AMB.PECAS[1]["titulo"], "13/11 · sexta"),
 USUC,
 _redata("Quais documentos provam a atividade rural", "18/11 · quarta"),
 _agro(AMB, AMB.PECAS[2]["titulo"], "20/11 · sexta"),
 _agro(TRAB, TRAB.PECAS[0]["titulo"], "23/11 · segunda"),
 _redata("Seu benefício foi calculado certo?", "25/11 · quarta"),
 _agro(TRAB, TRAB.PECAS[3]["titulo"], "27/11 · sexta"),
 _agro(TRAB, TRAB.PECAS[2]["titulo"], "30/11 · segunda"),
 _redata("Pensão por morte: quem recebe", "02/12 · quarta"),
 _agro(TRAB, TRAB.PECAS[1]["titulo"], "04/12 · sexta"),
 _agro(SUC, SUC.PECAS[0]["titulo"], "07/12 · segunda"),
 _redata("Auxílio-doença mudou de nome", "09/12 · quarta"),
 _agro(SUC, SUC.PECAS[1]["titulo"], "11/12 · sexta"),
 _agro(SUC, SUC.PECAS[2]["titulo"], "14/12 · segunda"),
 _redata("Salário-maternidade para trabalhadora rural", "16/12 · quarta"),
 _agro(SUC, SUC.PECAS[3]["titulo"], "18/12 · sexta"),
]

def _fmt(p):
    return p["formato"].split(" · ")[0].replace("Carrossel de fotos", "Fotos")

def _area(p):
    return p.get("pilar", "").split(" · ")[0]

GRADE = [(p["data"].split(" · ")[0], p["data"].split(" · ")[1][:3], _fmt(p), p["titulo"],
          "lanc" if p is VIDEO_AREA else "", _area(p)) for p in PECAS]

_n = lambda f: sum(1 for p in PECAS if _fmt(p) == f)
_prev = sum(1 for p in PECAS if _area(p) == "Previdenciário")

CAPA = dict(
 eyebrow="Linha editorial · Instagram e Facebook",
 titulo="Agronegócio,<br>Empresarial e<br><em>Previdenciário</em>",
 sub="26 de outubro a 18 de dezembro de 2026. Segundas e sextas, agronegócio e empresarial. Quartas, previdenciário.",
 pe=f"Preparado para a Dra. Elisa · {HOJE.strftime('%d/%m/%Y')}",
)

VISAO_HTML = f"""
  <p class="eyebrow">Visão geral</p>
  <h2 class="sec">O que mudou depois do seu e-mail</h2>
  <p><b>O lançamento da área previdenciária fica suspenso.</b> Saem da grade os eventos, a chamada, os registros e as cartilhas, até que seja o momento oportuno.</p>
  <p><b>O previdenciário sai uma vez por semana, sempre às quartas.</b> Começa em 28/10 com o vídeo que informa a área, agora falando de todos os benefícios, no campo e na cidade. Depois vêm os conteúdos do cronograma, um por semana.</p>
  <p><b>Segundas e sextas são do agronegócio e do empresarial.</b> Os três vídeos gravados em setembro rodam nas segundas, em sequência, porque formam uma série: o CAR, o conflito de terra que o CAR revela e a usucapião.</p>
  <div class="nums">
    <div><b>{len(PECAS)}</b><span>posts</span></div>
    <div><b>{_n('Vídeo')}</b><span>vídeos, 3 já gravados</span></div>
    <div><b>{_n('Carrossel')}</b><span>carrosséis</span></div>
    <div><b>{_n('Estático')}</b><span>estáticos</span></div>
  </div>
  <p class="eyebrow" style="margin-bottom:1mm">Os assuntos, um bloco de cada vez</p>
  <ol class="arco">
    <li><div><b>Crédito rural.</b> <span>Cooperativas e proteção do patrimônio. As duas peças já estão prontas e aprovadas.</span></div></li>
    <li><div><b>Ambiental e fundiário.</b> <span>Os três vídeos gravados, reserva legal e APP, georreferenciamento e como consultar o CAR.</span></div></li>
    <li><div><b>Trabalhista rural.</b> <span>NR-31, fiscalização e o fechamento do ano com o trabalhador de safra.</span></div></li>
    <li><div><b>Empresarial: sucessão e holding.</b> <span>Em dezembro, quando a família se reúne.</span></div></li>
    <li><div><b>Previdenciário, às quartas.</b> <span>{_prev} posts: o vídeo da área, aposentadoria no campo, BPC/LOAS, documentos, revisão, pensão, auxílio e salário-maternidade.</span></div></li>
  </ol>
"""

GRADE_TITULO = "26 de outubro a 18 de dezembro"
GRADE_NOTA = ("Os outros cinco temas previdenciários do cronograma (BPC para crianças com TEA, aposentadoria especial, "
              "planejamento, dúvidas frequentes e idade urbana x rural) seguem em janeiro, no mesmo ritmo de um por semana. "
              "Natal, 29/12 e virada de ano ficam como já estavam.")
PRECISAMOS = [
 "<b>Aprovação do roteiro e da legenda do vídeo da área</b>, para publicar na quarta, 28/10.",
 "<b>Aprovação dos demais roteiros</b> com pelo menos 2 dias úteis antes de cada data.",
 "Se o vídeo da área levar as fotos dos advogados, <b>o número da OAB do Dr. Gustavo</b>.",
]
