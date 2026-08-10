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
