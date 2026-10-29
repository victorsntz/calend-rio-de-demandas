// Anti-viúva: a última linha de um título nunca fica com uma palavra só.
// Junta as duas últimas palavras com espaço inquebrável, respeitando tags (grifo etc.).
(function () {
  function nosDeTexto(el) {
    const out = [];
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) if (n.nodeValue.trim()) out.push(n);
    return out;
  }
  document.querySelectorAll('h1 span, h1, h2, h3, .rotulo-caixa, .cards .card b, .fecho2 .cta span, .sem-viuva').forEach(el => {
    const nos = nosDeTexto(el);
    if (!nos.length) return;
    const total = nos.map(n => n.nodeValue.trim().split(/\s+/).length).reduce((a, b) => a + b, 0);
    if (total < 3) return;
    const ult = nos[nos.length - 1];
    const palavras = ult.nodeValue.trim().split(/\s+/);
    if (palavras.length >= 2) {
      ult.nodeValue = ult.nodeValue.replace(/\s+(\S+)\s*$/, ' $1');
    } else if (nos.length >= 2) {
      const ant = nos[nos.length - 2];
      ant.nodeValue = ant.nodeValue.replace(/\s+$/, '') + ' ';
      ult.nodeValue = ult.nodeValue.replace(/^\s+/, '');
    }
  });
})();

// Sem palavra curta solta no fim da linha ("E", "a", "de", "que", "pra"...): cola no termo seguinte com espaço fixo.
(function () {
  const curtas = /(^|\s)([AEOaeo]|[Dd][aeo]s?|[Ee]m|[Nn][ao]s?|[Uu]ma?|[Pp]ra|[Pp]or|[Pp]el[ao]s?|[Qq]ue|[Ss]e|[Cc]om|[Aa]os?|[Àà]s?|[Oo]u|[Mm]as)\s(?=\S)/g;
  const alvos = document.querySelectorAll('.slide p, .slide .texto, .slide .convite, .slide li, .slide .sub, .slide h1, .slide h2, .slide .rotulo-caixa');
  alvos.forEach(el => {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) { if (n.nodeValue.trim()) n.nodeValue = n.nodeValue.replace(curtas, '$1$2\u00a0'); }
  });
})();
