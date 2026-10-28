# Bloco trabalhista rural: NR-31 e acerto de safra.
# Roteiros para aprovação da Gorayeb Advocacia. Fatos conferidos em fonte oficial em 23/10/2026.

FONTES = {
    "nr31": (
        "NR-31, texto consolidado publicado pelo MTE (última alteração: Portaria MTE nº 342/2024)",
        "https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-31-atualizada-2024-2.pdf",
    ),
    "nr31_pagina": (
        "Página oficial da NR-31 no portal do MTE",
        "https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/norma-regulamentadora-no-31-nr-31",
    ),
    "p22677": (
        "Portaria SEPRT nº 22.677/2020, nova redação da NR-31 (DOU 27/10/2020, vigência de um ano após a publicação)",
        "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/seguranca-e-saude-no-trabalho/sst-portarias/2020/portaria-seprt-n-o-22-677-nova-nr-31-retif.pdf",
    ),
    "p4219": (
        "Portaria MTP nº 4.219/2022, CIPATR passa a tratar de assédio (vigência em 20/03/2023)",
        "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/seguranca-e-saude-no-trabalho/sst-portarias/2022/portaria-mtp-no-4-219-altera-nrs-cipa.pdf",
    ),
    "p4223": (
        "Portaria MTP nº 4.223/2022, atomizador mecanizado só com cabine fechada e prazos de adequação por área (vigência em 03/01/2023)",
        "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/seguranca-e-saude-no-trabalho/sst-portarias/2022/portaria-mtp-no-4-223-altera-item-31-7-4-da-nr-31.pdf",
    ),
    "p4371": (
        "Portaria MTP nº 4.371/2022, definição de cabine fechada no glossário da NR-31",
        "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/seguranca-e-saude-no-trabalho/sst-portarias/2022/portaria-mtp-no-4-371-cabine-fechada-glossario-nr-31.pdf",
    ),
    "p342": (
        "Portaria MTE nº 342/2024, direito de recusa diante de risco grave e iminente (DOU 22/03/2024)",
        "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/seguranca-e-saude-no-trabalho/sst-portarias/2024/portaria-mte-no-342-direito-de-recusa-nr-01.pdf",
    ),
    "p104": (
        "Portaria MTE nº 104/2026, altera a NR-28: multa rural pelo art. 18 da Lei 5.889/1973 (DOU 30/01/2026, vigência na publicação)",
        "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/seguranca-e-saude-no-trabalho/sst-portarias/2026-1/portaria-mte-no-104-altera-da-nr-28.pdf",
    ),
    "nr3": (
        "NR-3, Embargo e Interdição (redação da Portaria SEPRT nº 1.068/2019)",
        "https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/arquivos/normas-regulamentadoras/nr-03_atualizada_2019.pdf",
    ),
    "nr6": (
        "NR-6, Equipamentos de Proteção Individual, texto consolidado do MTE",
        "https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-06-atualizada-2025-ii.pdf",
    ),
    "ferramenta_pgrtr": (
        "Tutorial oficial da Ferramenta de Avaliação de Risco do PGRTR (SIT/MTE com a OIT)",
        "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/pgr/manual-de-acesso-e-utilizacao-do-sistema-pgrtr.pdf",
    ),
    "lei5889": (
        "Lei nº 5.889/1973, trabalho rural (arts. 3º, 13, 14 e 18)",
        "https://www.planalto.gov.br/ccivil_03/LEIS/L5889.htm",
    ),
    "dec10854": (
        "Decreto nº 10.854/2021, arts. 94 a 97 (trabalho rural e contrato de safra)",
        "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/decreto/D10854.htm",
    ),
    "clt": (
        "CLT, arts. 147, 158, 161, 166 e 477",
        "https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm",
    ),
    "cf": (
        "Constituição Federal, art. 7º, XVII (terço de férias)",
        "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
    ),
    "sumula328": (
        "Súmula 328 do TST: o terço incide sobre férias integrais ou proporcionais, gozadas ou não",
        None,
    ),
    "lei4090": (
        "Lei nº 4.090/1962, 13º salário (art. 1º, § 3º, I: proporcional no contrato de safra)",
        "https://www.planalto.gov.br/ccivil_03/LEIS/L4090.htm",
    ),
    "lei4749": (
        "Lei nº 4.749/1965, parcelas do 13º (adiantamento até novembro, saldo até 20 de dezembro)",
        "https://www.planalto.gov.br/ccivil_03/LEIS/L4749.htm",
    ),
    "lei8036": (
        "Lei nº 8.036/1990, FGTS (arts. 15, 18 e 20, IX)",
        "https://www.planalto.gov.br/ccivil_03/LEIS/L8036consol.htm",
    ),
    "pa65": (
        "Precedente Administrativo nº 65 da SIT/MTE (Ato Declaratório SIT nº 9/2005): indenização do safrista se soma ao FGTS",
        None,
    ),
    "mos_esocial": (
        "Manual de Orientação do eSocial, versão S-1.3 consolidada até a NO S-1.3 12/2026, evento S-2299",
        "https://www.gov.br/esocial/pt-br/documentacao-tecnica/manuais/mos-s-1-3-consolidada-ate-a-no-s-1-3-12-2026.pdf",
    ),
}

PECAS = [
    dict(
        data="23/11 · segunda",
        formato="Carrossel · 8 telas",
        pilar="Agronegócio · Trabalhista rural",
        titulo="NR-31: o que é e para quem essa norma se aplica",
        objetivo="Explicar ao produtor que emprega o que é a NR-31, quem ela alcança e o que ela pede na rotina da fazenda.",
        telas=[
            (
                "Capa",
                "NR-31: o que é e para quem vale",
                "É a norma de segurança e saúde do trabalho rural. Vale para lavoura, criação, floresta e aquicultura.",
            ),
            (
                "O que é",
                "Uma norma do Ministério do Trabalho",
                "A Lei 5.889/1973, a lei do trabalho rural, manda seguir as regras de segurança fixadas pelo Ministério. Essas regras estão na NR-31. O texto atual veio da Portaria SEPRT 22.677/2020 e vale desde 27 de outubro de 2021.",
            ),
            (
                "Onde vale",
                "Cinco atividades no mesmo campo",
                "Agricultura, pecuária, silvicultura, exploração florestal e aquicultura. Entra também a atividade industrial feita dentro da propriedade rural. E a frente de trabalho conta como parte da fazenda.",
            ),
            (
                "Quem responde",
                "O empregador rural, dono da terra ou não",
                "É quem toca a atividade com ajuda de empregados, pessoa física ou empresa, proprietário ou arrendatário. Quem presta serviço no campo para terceiros com equipe própria também responde.",
            ),
            (
                "PGRTR",
                "O programa que organiza tudo",
                "Cada propriedade precisa do seu Programa de Gerenciamento de Riscos no Trabalho Rural, com inventário de riscos e plano de ação. Ele é revisto a cada três anos. Com até 50 empregados, dá para montar numa ferramenta gratuita do governo.",
            ),
            (
                "Pelo tamanho",
                "O que muda com o número de empregados",
                "Com 20 ou mais fixos, a fazenda monta a CIPATR, a comissão de prevenção de acidentes e de assédio. De 11 a 50, o SESTR fica dispensado se o empregador ou um preposto fizer a capacitação. Com 51 ou mais, o SESTR com profissional de segurança é obrigatório, e na safra o temporário entra na soma.",
            ),
            (
                "Na prática",
                "O que a norma cobra no dia a dia",
                "Exame médico antes de começar e uma vez por ano. EPI de graça e treinamento antes da função, com certificado. Água potável e fresca, banheiro na frente de trabalho e material de primeiros socorros.",
            ),
            (
                "Fecho",
                "O risco é da lida. O cuidado é do empregador.",
                "Conhecer a NR-31 é o primeiro passo para pôr a fazenda em dia. Salve este carrossel e mande para quem contrata no campo.",
            ),
        ],
        fontes=["lei5889", "p22677", "nr31", "nr31_pagina", "ferramenta_pgrtr", "dec10854"],
    ),
    dict(
        data="27/11 · sexta",
        formato="Estático",
        pilar="Agronegócio · Trabalhista rural",
        titulo="Falta de EPI pode gerar multa e até interdição da fazenda",
        objetivo="Mostrar o que a NR-31 exige sobre EPI e o que a fiscalização pode fazer quando ele falta, sem alarme e com a regra certa.",
        frase=(
            "Faltou EPI, vem a multa.",
            "Risco grave, vem a interdição.",
        ),
        apoio="Pela NR-31, o EPI é gratuito, tem CA, a entrega fica registrada e o uso é exigido pelo empregador.",
        legenda=[
            "FALTA DE EPI PODE GERAR MULTA E ATÉ INTERDIÇÃO NA FAZENDA",
            "O QUE A NORMA PEDE. A NR-31 manda o empregador rural fornecer o EPI de graça, adequado ao risco e em bom estado. Só vale equipamento com Certificado de Aprovação, o CA. A entrega fica registrada em ficha, livro ou sistema, e o uso precisa ser orientado e exigido. No campo entram também chapéu contra o sol, perneira contra animais peçonhentos e a roupa de aplicação de agrotóxico, conforme o risco de cada tarefa.",
            "A MULTA. Desde 30 de janeiro de 2026, com a Portaria MTE 104/2026, a infração de segurança no trabalho rural é multada pelo critério da Lei 5.889/1973, que calcula o valor por empregado em situação irregular. Quanto mais gente sem o equipamento, maior a conta. E os valores passam por reajuste todo ano.",
            "A INTERDIÇÃO. Quando o auditor-fiscal encontra risco grave e iminente, a NR-3 permite parar a atividade, a máquina, o setor ou o estabelecimento inteiro. A regra é interditar a menor parte onde está o risco. Enquanto a atividade fica parada, os salários continuam sendo pagos normalmente.",
            "O trabalhador também tem a sua parte. Recusar sem motivo o EPI fornecido é falta prevista na CLT e na própria NR-31. Por isso a ficha de entrega assinada e o certificado do treinamento valem tanto quanto o equipamento.",
            "Fontes: NR-31 (itens 31.2.4, 31.6 e 31.7.6), NR-6, NR-3, NR-28 com a redação da Portaria MTE nº 104/2026, Lei 5.889/1973 (art. 18) e CLT (arts. 158, 161 e 166).",
        ],
        fontes=["nr31", "nr6", "nr3", "p104", "lei5889", "clt"],
    ),
    dict(
        data="30/11 · segunda",
        formato="Carrossel · 8 telas",
        pilar="Agronegócio · Trabalhista rural",
        titulo="Atualizações da NR-31 e prazos de adequação",
        objetivo="Mostrar ao produtor o que mudou na NR-31 desde 2021, o prazo da cabine fechada que segue correndo e a nova forma de cálculo da multa rural.",
        telas=[
            (
                "Capa",
                "NR-31: o que mudou e que prazo ainda corre",
                "A norma nova vale desde outubro de 2021. Depois disso ganhou ajustes, e um prazo de adequação segue aberto.",
            ),
            (
                "Comissão",
                "A CIPATR passou a cuidar de assédio",
                "Desde 20 de março de 2023, ela é a Comissão Interna de Prevenção de Acidentes e de Assédio do Trabalho Rural. Vale para a fazenda com 20 ou mais empregados fixos. O treinamento dos membros inclui prevenção ao assédio sexual e a outras violências.",
            ),
            (
                "Agrotóxico",
                "Atomizador só com cabine fechada",
                "Desde janeiro de 2023, o atomizador mecanizado só aplica agrotóxico em máquina com cabine fechada, original ou adaptada. A adaptada precisa de estrutura de proteção contra capotagem. O prazo para adequar depende da área aplicada.",
            ),
            (
                "Prazos",
                "Quanto tempo cada fazenda tem",
                "Até 25 hectares, 120 meses; até 50 hectares, 96 meses. De 51 a 100 hectares, 84 meses. Mais de 100 hectares, 60 meses. Vale conferir com o responsável pela segurança em que ponto a sua fazenda está.",
            ),
            (
                "Enquanto o prazo corre",
                "Sem cabine, só com cuidado registrado",
                "O PGRTR precisa explicar por que a cabine ainda não é viável e como o operador fica protegido. É proibido o atomizador acoplado e a aplicação no mesmo sentido do vento. Se a névoa atingir o operador, a aplicação para na hora.",
            ),
            (
                "Direito de recusa",
                "Com risco grave, o trabalhador pode parar",
                "Desde março de 2024, ele pode interromper a tarefa quando vê risco grave e iminente, avisando o superior na hora. O empregador só pode exigir a volta depois de corrigir o problema. E quem parou por motivo razoável fica protegido de punição injustificada.",
            ),
            (
                "Multa",
                "Desde janeiro de 2026, a multa conta por empregado",
                "A Portaria MTE 104/2026 mudou a NR-28: infração da NR-31 passou a seguir o cálculo da Lei 5.889/1973, por empregado em situação irregular. Vale para autos lavrados desde 30 de janeiro de 2026.",
            ),
            (
                "Fecho",
                "Prazo longo também vence.",
                "Vale conferir a data do último PGRTR, a máquina de aplicação e a ficha de EPI. Salve este carrossel e mande para quem cuida da segurança na fazenda.",
            ),
        ],
        fontes=["p22677", "p4219", "p4223", "p4371", "p342", "p104", "nr31", "lei5889"],
    ),
    dict(
        data="04/12 · sexta",
        formato="Carrossel · 8 telas",
        pilar="Agronegócio · Trabalhista rural",
        titulo="13º, férias e rescisão do trabalhador de safra: o que fechar antes do fim do ano",
        objetivo="Listar as verbas do safrista no fim do contrato, com a regra e a data de cada uma, para o produtor fechar o acerto no prazo.",
        telas=[
            (
                "Capa",
                "Fim de safra: o que fechar com o safrista",
                "13º, férias, indenização, FGTS e prazo do acerto. Cada verba tem sua regra e sua data.",
            ),
            (
                "O contrato",
                "Contrato de safra tem começo e fim",
                "É o contrato que dura conforme a estação, do preparo do solo até a colheita. Quando a safra acaba, o contrato acaba junto, e a conta precisa fechar.",
            ),
            (
                "13º salário",
                "O 13º do safrista é proporcional",
                "Vale 1/12 do salário por mês, e 15 dias ou mais contam como mês cheio. Quem segue na fazenda recebe a primeira parcela até 30 de novembro e a segunda até 20 de dezembro, que este ano cai num domingo. Se a safra acabou antes, o proporcional vai no acerto, descontado o que já foi adiantado.",
            ),
            (
                "Férias",
                "Férias proporcionais, com um terço",
                "Contrato a prazo que termina antes de 12 meses dá direito a férias proporcionais. É 1/12 por mês, e a fração acima de 14 dias conta como mês. Em cima desse valor vem o terço constitucional.",
            ),
            (
                "Indenização",
                "A verba que é só do safrista",
                "No fim normal do contrato, a Lei 5.889/1973 garante 1/12 do salário mensal por mês de serviço, ou fração acima de 14 dias. Para o Ministério do Trabalho e para o TST, ela se soma ao FGTS, não entra no lugar dele.",
            ),
            (
                "FGTS",
                "8% todo mês, inclusive sobre o 13º",
                "O depósito vence no dia 20 do mês seguinte. No acerto entram o mês da saída e o anterior, se ainda não pagos. No fim normal da safra não há a multa de 40%, que é da dispensa sem justa causa, e o trabalhador pode sacar o saldo.",
            ),
            (
                "Prazo",
                "Dez dias para fechar tudo",
                "Verbas pagas e documentos entregues em até 10 dias do fim do contrato, com o desligamento informado no eSocial no mesmo prazo. O exame demissional também é feito em até 10 dias, salvo exame clínico com menos de 90 dias. Atrasar o acerto gera multa a favor do trabalhador, no valor de um salário.",
            ),
            (
                "Fecho",
                "Safra fechada, conta fechada.",
                "Quem acerta no prazo começa a próxima safra sem pendência. Salve este carrossel e mande para quem contrata na safra.",
            ),
        ],
        fontes=["lei5889", "dec10854", "lei4090", "lei4749", "clt", "cf", "sumula328", "pa65", "lei8036", "nr31", "mos_esocial"],
    ),
]
