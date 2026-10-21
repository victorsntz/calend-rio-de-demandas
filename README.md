# Calendário de Demandas — Fortunato Estúdio

Calendário inteligente **exclusivo dos clientes de carrossel** do estúdio,
com ritmo diário por contrato, cobranças do dia, metas com auto-prêmio e a
teia de clientes. Mesma identidade visual do portal
[`fortunato-carrosseis`](https://github.com/victorsntz/fortunato-carrosseis):
off-white `#f5f3f1`, EB Garamond, sem dark mode.

## O modelo comercial que ele reflete

- **Pacote padrão: 120 conteúdos** — 60 carrosséis + 60 tweets, entregues a
  **2 carrosséis/dia + 2 tweets/dia** (dias úteis, seg–sáb).
- **Tweets são produzidos em lote semanal** — não entram dia a dia no
  calendário; toda segunda o app (e um lembrete no celular) cobra o lote novo.
- **Clientes ativos** (lista fechada em ago/2026): Julia Lazari, Eric Roza,
  Kelvin Cleto, Fabrício Amorin e Felipe Venâncio no pacote padrão, mais as
  exceções — Gabriel Bussiki (1 carrossel/dia, contrato de 40, ~31 já
  entregues; o app mostra a contagem regressiva e a data projetada de
  término) e Tio Huli / Hulisses Dias (3 carrosséis/dia).
- Os demais clientes ficam cadastrados e **inativos**, já com o pacote padrão
  pré-preenchido: fechou contrato de carrossel, é um clique em "Ativo".

## O que ele faz

- **Cobranças de hoje**: logo abaixo da meta, um painel mostra o lote de
  tweets da semana (com check) e, por cliente, quantos carrosséis já foram
  postados hoje vs. o ritmo contratado, o andamento do contrato
  (ex.: 31/40 · restam 9) e quando termina no ritmo atual.
- **Calendário mensal** com os carrosséis de cada dia, coloridos por
  cliente. Clique num dia para abrir o painel: adicionar demanda, mudar
  status (A criar → Em aprovação → Fazer postagem → Postado), anotar algo.
- **Dia ocupado + diluição**: marque um dia em que você não vai produzir e
  as demandas daquele dia são redistribuídas nos dias menos carregados da
  mesma semana, marcadas com ↜.
- **Gerar plano do mês**: completa cada dia útil até o ritmo diário de cada
  cliente ativo, **sem passar do teto do contrato** e pulando dias ocupados.
- **Meta da semana + auto-prêmio**: defina quantas entregas por semana e
  qual o seu prêmio por bater. Ao postar a última, chove confete e o prêmio
  aparece para resgatar. Semanas seguidas batidas viram um 🔥 streak.
- **Teia de clientes**: o estúdio no centro, cada cliente ativo num nó. Fio
  mais grosso = mais conteúdo por dia; nó maior = mais demandas em aberto.
- **Comentários** sob o calendário: notas gerais ou amarradas a um dia.
- **Avisos automáticos**: lote de tweets pendente, dias sobrecarregados,
  demandas atrasadas e contratos a ≤5 carrosséis do fim.

## Dados

Tudo fica no `localStorage` do navegador — sem servidor, sem senha. Use
**Exportar backup** (JSON) de vez em quando; **Importar** restaura. Quem já
usou a versão de quotas semanais migra automaticamente (demandas, metas e
comentários sobrevivem; a lista de clientes é re-semeada no modelo novo).

O selo `hub` marca clientes que existem no Fortunato Hub, para uma futura
integração. Ritmos, contratos, cores e ativos são editáveis na aba "Teia de
clientes".

## Rodar

```bash
npm install
npm run dev     # http://localhost:3000
```

Deploy: igual ao portal — repositório na Vercel, `git push` builda e publica.

## Estúdio de Voz (`/voz`)

Narração, versões traduzidas e banco de vozes do estúdio, no botão
**🎙️ Estúdio de Voz** do cabeçalho. É o painel; o motor é o
[VoiceStudio](https://github.com/debpalash/VoiceStudio), um app gratuito
que roda os modelos de voz no próprio computador (sem pagar por minuto e sem
mandar o áudio dos clientes para fora).

```
navegador ──► /api/voz/* (servidor Next) ──► VoiceStudio :3900 ──► modelo de voz
```

O navegador nunca fala direto com o VoiceStudio: ele recusa pedidos vindos de
página de outro site, e a chave da API fica só no servidor. A ponte libera
apenas as rotas que o painel usa (vozes, motores, narrar, traduzir);
configurações e instaladores do VoiceStudio ficam de fora.

### O que dá para fazer

- **Narrar**: cola o roteiro, escolhe idioma e voz, gera, escuta e baixa o WAV.
- **Traduzir e narrar**: um roteiro vira versões em vários idiomas, cada uma
  editável antes de narrar, todas com a mesma voz.
- **Glossário da marca**: termos que o tradutor não pode inventar. Sem ele o
  tradutor offline transforma "Carrossel" em "merry-go-round". Cada termo vale
  para um idioma (Carrossel → carousel no inglês, carrusel no espanhol) ou
  para todos; deixar o lado direito vazio mantém o termo igual, bom para
  nome de marca. Funciona com qualquer tradutor: o termo vira um marcador
  (ZQX0) que passa intacto pela tradução e volta na forma escolhida.
- **Vozes**: ouvir, usar, apagar e clonar uma voz nova a partir de 10 a 20 s
  de gravação. Salvar exige marcar que existe autorização por escrito da
  pessoa dona da voz.
- **Selo de licença**: o painel lê o catálogo do VoiceStudio e mostra se o
  modelo do motor escolhido libera uso comercial. Abre sugerindo o primeiro
  motor comercial instalado que clona voz.

### Licença dos motores: leia antes de entregar a cliente

O motor padrão do VoiceStudio (OmniVoice) tem pesos **CC-BY-NC: uso não
comercial**. Serve para testar, não para trabalho de cliente. Motores com
licença comercial (Apache-2.0) que falam português e clonam voz:

| Motor | Bom para | Hardware |
|---|---|---|
| MOSS-TTS-Nano | começar já, notebook comum | roda no processador (~20 s para 10 s de áudio) |
| VoxCPM2 | mais qualidade, desenho de voz | GPU NVIDIA ou Mac M1 em diante |
| Confucius4-TTS | mesma voz em vários idiomas | GPU NVIDIA |

Instale pelo **Catálogo de modelos** do app VoiceStudio. O próprio
VoiceStudio é AGPL-3.0: usar para produzir áudio é tranquilo; oferecer o
VoiceStudio modificado como serviço para terceiros obriga a abrir o código.
Todo áudio sai com marca d'água inaudível (AudioSeal) de voz gerada por IA.

### Rodar na máquina

1. Instale o VoiceStudio (uma vez): `curl -fsSL https://voicestudio.sh/install | sh`
   no Mac/Linux ou `irm https://voicestudio.sh/install | iex` no Windows.
2. Abra o app e instale um motor comercial no Catálogo de modelos.
3. `npm run dev` e abra http://localhost:3000/voz. O painel acha o VoiceStudio
   em `127.0.0.1:3900` sozinho.

### VoiceStudio num servidor (time inteiro usando)

Na Vercel, o painel não alcança o VoiceStudio do notebook de ninguém. Para a
equipe toda usar, suba o VoiceStudio num servidor com GPU (há `docker
compose` no repositório dele) e configure:

| Onde | Variável | Para quê |
|---|---|---|
| servidor do VoiceStudio | `OMNIVOICE_API_KEY` | chave longa e aleatória |
| servidor do VoiceStudio | `OMNIVOICE_ALLOWED_ORIGINS` | o endereço público dele, se for acessado por nome (ex.: `https://voz.seudominio.com`) |
| Vercel / `.env.local` | `VOICESTUDIO_URL` | endereço do VoiceStudio (padrão `http://127.0.0.1:3900`) |
| Vercel / `.env.local` | `VOICESTUDIO_API_KEY` | a mesma `OMNIVOICE_API_KEY` |
| Vercel / `.env.local` | `VOZ_SENHA` | senha do painel; **obrigatória** quando a URL não é local |

Use HTTPS entre os dois. Sem `VOZ_SENHA`, a ponte se recusa a falar com um
VoiceStudio remoto (senão qualquer pessoa com o link usaria a GPU do estúdio).
Narrar no processador pode passar de um minuto; a rota pede até 300 s, e o
teto real depende do plano da Vercel.

### O que fica onde

- Vozes salvas: no VoiceStudio.
- Takes: só na aba aberta do navegador. Baixe o que for usar.
- Glossário e motor escolhido: no `localStorage` deste navegador.
