"""Peças de novembro/2026, pilar Ambiental e Fundiário: Reserva Legal e APP no CAR,
georreferenciamento e consulta do CAR pelo CPF.

Fatos conferidos em 23/10/2026 no texto compilado do Planalto (Lei 12.651/2012,
Lei 6.015/1973, Decreto 4.449/2002 e Decreto 12.689/2025), nas páginas do INCRA e
do SICAR (car.gov.br) e na notícia do IRIB sobre a decisão da Justiça Federal.
"""

FONTES = {
 "cf_rl": ("Lei 12.651/2012 (Código Florestal), art. 12: Reserva Legal de 20% fora da Amazônia Legal e de 35% em área de cerrado dentro dela",
   "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12651.htm"),
 "cf_app": ("Lei 12.651/2012, art. 4º, I, IV e XI: faixas de APP em rios (30 a 500 m), nascentes e olhos d'água (raio de 50 m) e veredas (50 m)",
   "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12651.htm"),
 "stf_adc42": ("STF, ADC 42 e ADI 4.903 (2018): o entorno de nascentes e olhos d'água intermitentes também é APP", None),
 "cf_15": ("Lei 12.651/2012, art. 15: cômputo da APP no cálculo da Reserva Legal, sem abertura de área nova e com a APP conservada ou em recuperação",
   "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12651.htm"),
 "cf_61a": ("Lei 12.651/2012, art. 61-A: faixas menores de recomposição de APP em área rural consolidada até 22/07/2008, conforme os módulos fiscais",
   "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12651.htm"),
 "cf_18": ("Lei 12.651/2012, art. 18, §4º, e art. 30: o registro da Reserva Legal no CAR desobriga a averbação no Cartório de Registro de Imóveis; a averbação antiga vale no cadastro",
   "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12651.htm"),
 "cf_66": ("Lei 12.651/2012, arts. 66, 67 e 68: recompor em até 20 anos, regeneração natural ou compensação; regra do imóvel de até 4 módulos fiscais em 22/07/2008",
   "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12651.htm"),
 "cf_59": ("Lei 12.651/2012, art. 59, §§2º a 5º, na redação da Lei 14.595/2023: adesão ao PRA em 1 ano da notificação, termo de compromisso e conversão de multas",
   "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12651.htm"),
 "cf_29": ("Lei 12.651/2012, art. 29, §2º: o CAR não é título de propriedade nem dispensa o georreferenciamento da Lei 10.267/2001",
   "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12651.htm"),
 "lrp_176": ("Lei 6.015/1973, art. 176, §§3º a 5º, e art. 225, §3º: memorial georreferenciado no desmembramento, parcelamento, remembramento, transferência e ações judiciais; certificação pelo INCRA",
   "https://www.planalto.gov.br/ccivil_03/leis/l6015compilada.htm"),
 "d4449": ("Decreto 4.449/2002, arts. 9º e 10, texto compilado: a certificação não reconhece domínio; exigência em desmembramento, parcelamento, remembramento e transferência",
   "https://www.planalto.gov.br/ccivil_03/decreto/2002/d4449.htm"),
 "d12689": ("Decreto 12.689, de 21/10/2025: revoga as etapas por área e fixa a exigência a partir de 21/10/2029",
   "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/d12689.htm"),
 "jf_ma": ("IRIB: decisão provisória da 3ª Vara Federal Cível do Maranhão na Ação Popular 1086967-47.2025.4.01.3700 (maio/2026) suspende o Decreto 12.689 para imóveis com prazo já vencido e o mantém, por ora, para imóveis abaixo de 101 hectares",
   "https://www.irib.org.br/justica-federal-reestabelece-obrigatoriedade-de-certificacao-georreferenciada-pelo-incra/"),
 "irib_nt": ("IRIB, Nota Técnica CPRI 03/2025: o decreto adia a certificação, não o georreferenciamento",
   "https://www.irib.org.br/irib-esclarece-novas-regras-para-georreferenciamento-de-imoveis-rurais-apos-decreto-no-12-689-2025/"),
 "incra_cert": ("INCRA: certificação de imóvel rural pelo SIGEF, por profissional credenciado",
   "https://www.gov.br/incra/pt-br/assuntos/governanca-fundiaria/certificacao-imoveis"),
 "sicar_govbr": ("SICAR: acesso ao CAR pela conta gov.br desde 19/12/2024, vínculo de representantes e familiares",
   "https://www.car.gov.br/#/acesso-pelo-gov-br"),
 "sicar_central": ("SICAR: o que a Central do Proprietário/Possuidor permite fazer",
   "https://www.car.gov.br/#/saibaMaisSobreCentral"),
 "sicar_situacao": ("SICAR, Consultar um CAR: situações Ativo, Pendente, Suspenso e Cancelado e quadro de sobreposições do demonstrativo",
   "https://www.car.gov.br/#/consultar"),
 "sfb_manual": ("Serviço Florestal Brasileiro, Manual da Central do Proprietário/Possuidor do SICAR (2023): escolha do imóvel, demonstrativo, Central de Mensagens, retificação",
   "https://www.car.gov.br/manual/central"),
 "sicar_estados": ("SICAR, estados com sistema próprio de CAR (Goiás e Mato Grosso entre eles; Minas usa o sistema federal)",
   "https://www.car.gov.br/estados/status"),
 "ief_mg": ("Agência Minas: o IEF analisa o CAR em Minas e publica editais de notificação e de convocação para o PRA",
   "https://www.agenciaminas.mg.gov.br/noticia/ief-divulga-quinto-edital-de-notificacao-de-analises-do-cadastro-ambiental-rural/"),
}

PECAS = [

 # ------------------------------------------------------------ 06/11 carrossel
 dict(
  data="06/11 · sexta",
  formato="Carrossel · 8 telas",
  pilar="Agronegócio · Ambiental",
  titulo="Reserva Legal e APP: como funciona dentro do CAR",
  objetivo="Mostrar ao produtor do Cerrado mineiro quanto a lei pede de Reserva Legal e de APP, o que mudou com o CAR e quais são os caminhos quando falta área.",
  telas=[
   ("Capa", "Reserva Legal e APP.", "As duas áreas que todo CAR precisa mostrar no mapa. E que o órgão ambiental confere na análise."),
   ("Reserva Legal", "20% da área do imóvel.", "Fora da Amazônia Legal, como aqui no Triângulo Mineiro, a lei pede 20% com vegetação nativa. No Cerrado dentro da Amazônia Legal, são 35%. A APP pode entrar nessa conta, desde que esteja conservada e isso não sirva para abrir área nova."),
   ("APP de rio", "A faixa cresce com o rio.", "Rio com menos de 10 metros de largura pede 30 metros de mata em cada margem. A faixa aumenta com a largura do rio e chega a 500 metros. Em área já aberta antes de 22/07/2008, a faixa a recompor é menor e depende do tamanho do imóvel."),
   ("Nascente e vereda", "50 metros de proteção.", "Em volta de nascente e olho d'água, o raio protegido é de 50 metros. Na vereda, tão comum no Cerrado, a faixa é de 50 metros a partir do brejo."),
   ("Cartório", "Averbar não é mais obrigatório.", "Com a Reserva Legal registrada no CAR, não precisa averbar na matrícula. Quem já averbou pode usar a certidão do cartório no cadastro."),
   ("Faltou reserva", "Três caminhos na lei.", "Quem tinha menos reserva que o exigido em 22/07/2008 pode recompor em até 20 anos, deixar a mata voltar sozinha ou compensar em outra área. Imóvel de até 4 módulos fiscais nessa data fica com a vegetação nativa que tinha naquele dia."),
   ("PRA", "O programa que regulariza.", "O órgão ambiental analisa o CAR, aponta o passivo e notifica o produtor, que tem 1 ano para aderir ao PRA. Assinado e cumprido o termo de compromisso, as multas por desmate anterior a 22/07/2008 viram serviço ambiental."),
   ("Fecho", "Reserva e APP no lugar certo do mapa.", "Salve este carrossel para conferir o seu CAR com calma. E mande para quem precisa."),
  ],
  fontes=["cf_rl", "cf_15", "cf_app", "stf_adc42", "cf_61a", "cf_18", "cf_66", "cf_59"],
 ),

 # ------------------------------------------------------------ 13/11 estático
 dict(
  data="13/11 · sexta",
  formato="Estático",
  pilar="Agronegócio · Fundiário",
  titulo="Georreferenciamento: obrigatoriedade e prazos para imóveis rurais",
  objetivo="Explicar quando o georreferenciamento certificado é exigido e como ficou o prazo depois do Decreto 12.689/2025 e da decisão provisória da Justiça Federal de maio de 2026.",
  frase=("O prazo do georreferenciamento mudou.", "E a Justiça ainda está discutindo."),
  nota="A decisão de maio de 2026 é provisória. Conferir o andamento da ação popular na semana da publicação.",
  apoio="Antes de vender, dividir ou transferir a terra, pergunte ao cartório de registro de imóveis o que ele está exigindo hoje.",
  legenda=[
   "O PRAZO DO GEORREFERENCIAMENTO MUDOU. E A JUSTIÇA AINDA ESTÁ DISCUTINDO.",
   "Georreferenciamento é o mapa oficial da terra, com as coordenadas de cada vértice da divisa. Ele é exigido no cartório para registrar desmembramento, parcelamento, remembramento e qualquer transferência de imóvel rural, como venda, doação ou partilha. Nas ações judiciais sobre imóvel rural, como a usucapião, a lei também pede o memorial georreferenciado.",
   "Quem faz o levantamento é um profissional credenciado no INCRA, que envia os dados ao SIGEF, o sistema de gestão fundiária do INCRA. Se a área não se sobrepõe a nenhuma outra já cadastrada, a certificação sai pelo próprio sistema, com planta e memorial prontos para levar ao cartório. A certificação confere o desenho, não prova que a terra é sua: quem prova é a matrícula. E o CAR não substitui o georreferenciamento, o próprio Código Florestal diz isso.",
   "Até outubro de 2025, a exigência vinha por etapas, conforme o tamanho da área. Os imóveis maiores já estavam obrigados havia anos, e a última etapa, a dos imóveis com menos de 25 hectares, venceria em novembro de 2025. O Decreto 12.689, de 21 de outubro de 2025, acabou com as etapas e passou a exigência para 21 de outubro de 2029, para todos os tamanhos.",
   "Em maio de 2026, uma decisão provisória da Justiça Federal no Maranhão, numa ação popular, suspendeu o decreto para os imóveis cujo prazo já tinha vencido pela regra antiga. Com isso, imóvel com 101 hectares ou mais voltou a precisar da certificação para vender, dividir ou transferir. Abaixo de 101 hectares, vale 2029 até nova decisão. O processo continua, e a regra ainda pode mudar. Antes de qualquer negócio com a terra, vale perguntar ao cartório de registro de imóveis o que ele está exigindo.",
   "Fontes: Lei 6.015/1973, arts. 176 e 225; Decreto 4.449/2002, art. 10, com a redação do Decreto 12.689/2025; Lei 12.651/2012, art. 29; INCRA; IRIB.",
  ],
  fontes=["lrp_176", "d4449", "d12689", "jf_ma", "irib_nt", "incra_cert", "cf_29"],
 ),

 # ------------------------------------------------------------ 20/11 carrossel
 dict(
  data="20/11 · sexta",
  formato="Carrossel · 8 telas",
  pilar="Agronegócio · Ambiental",
  titulo="Passo a passo para consultar seu CAR pelo CPF",
  objetivo="Ensinar o produtor a entrar sozinho na Central do Proprietário/Possuidor e a ler o que importa: situação, sobreposição, notificação e retificação.",
  telas=[
   ("Capa", "Seu CAR pelo CPF.", "Com a conta gov.br, você abre o cadastro da fazenda e vê o que o órgão ambiental anda dizendo dele."),
   ("Passo 1", "Tenha a conta gov.br.", "Desde 19/12/2024, a Central do CAR só abre com a conta gov.br. Quem ainda não tem cria a sua no site gov.br."),
   ("Passo 2", "Entre no car.gov.br.", "Clique em Central do Proprietário/Possuidor e depois em Entrar com gov.br. Em Goiás e Mato Grosso, o CAR tem sistema próprio, no site do órgão ambiental do estado."),
   ("Passo 3", "Escolha o imóvel.", "Aparecem os imóveis em que o seu CPF está declarado como proprietário, possuidor ou representante. Se o CAR está no nome de outra pessoa da família, ela pode vincular você pela própria Central."),
   ("Passo 4", "A situação do cadastro.", "Ativo, pendente, suspenso ou cancelado. Pendente aparece quando há declaração errada, sobreposição ou notificação ainda não atendida."),
   ("Passo 5", "Olhe as sobreposições.", "No demonstrativo, um quadro mostra se o mapa invade outro CAR, terra indígena, unidade de conservação ou área embargada. Ali estão a área e o percentual de cada sobreposição."),
   ("Passo 6", "Leia as mensagens.", "Na Central de Mensagens chegam as notificações do órgão ambiental, que em Minas é o IEF. Achou erro no cadastro? A correção se chama retificação e é feita pela aba Retificação da própria Central."),
   ("Fecho", "Notificação tem prazo.", "Prazo perdido pode levar ao cancelamento do CAR. Salve este passo a passo e mande para quem precisa."),
  ],
  fontes=["sicar_govbr", "sicar_central", "sfb_manual", "sicar_situacao", "sicar_estados", "ief_mg"],
 ),
]


if __name__ == "__main__":
    for p in PECAS:
        print(p["data"], "|", p["formato"], "|", p["titulo"])
        for k in p["fontes"]:
            assert k in FONTES, k
