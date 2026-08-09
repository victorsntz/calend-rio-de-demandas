# Calendário de Demandas — Fortunato Estúdio

Calendário inteligente para organizar a produção de conteúdo do estúdio
(carrosséis, estáticos, reels, tweets), com metas semanais, auto-prêmio e a
teia de clientes. Mesma identidade visual do portal
[`fortunato-carrosseis`](https://github.com/victorsntz/fortunato-carrosseis):
off-white `#f5f3f1`, EB Garamond, sem dark mode.

## O que ele faz

- **Calendário mensal** com as demandas de cada dia, coloridas por cliente.
  Clique num dia para abrir o painel: adicionar demanda, mudar status
  (A criar → Em aprovação → Fazer postagem → Postado), anotar algo.
- **Dia ocupado + diluição**: marque um dia em que você não vai produzir
  (gravação externa, compromisso…) e as demandas daquele dia são
  redistribuídas nos dias menos carregados da mesma semana. Demandas
  diluídas ficam marcadas com ↜ e lembram de onde vieram.
- **Gerar plano do mês**: cada cliente tem uma quota semanal por tipo de
  conteúdo (aba "Teia de clientes"). O plano cria as demandas que faltam
  para cumprir as quotas, espalhando nos dias úteis menos carregados e
  pulando os dias ocupados.
- **Meta da semana + auto-prêmio**: defina quantas entregas por semana e
  qual o seu prêmio por bater. Ao marcar a última demanda como postada,
  chove confete e o prêmio aparece para resgatar. Sequências de semanas
  batidas viram um 🔥 streak.
- **Teia de clientes**: o estúdio no centro, cada cliente num nó. Fio mais
  grosso = mais conteúdo por semana; nó maior = mais demandas em aberto.
  Clique num cliente para filtrar o calendário só nele.
- **Comentários** sob o calendário: notas gerais ou amarradas a um dia.
- **Avisos automáticos**: dias sobrecarregados (sugere diluir), clientes sem
  demanda na semana, demandas de dias passados ainda abertas.

## Dados

Tudo fica no `localStorage` do navegador — sem servidor, sem senha. Use
**Exportar backup** (JSON) de vez em quando; **Importar** restaura.

Os clientes vêm pré-cadastrados com a união do portal de carrosséis e do
Fortunato Hub (o selo `hub` marca quem já existe lá, para uma futura
integração). Quotas, cores e ativos são editáveis na aba "Teia de clientes".

## Rodar

```bash
npm install
npm run dev     # http://localhost:3000
```

Deploy: igual ao portal — repositório na Vercel, `git push` builda e publica.
