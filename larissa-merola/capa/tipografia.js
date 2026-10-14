// Anti-viúva: a última linha de um título nunca fica com uma palavra só.
// Junta as duas últimas palavras com espaço inquebrável, respeitando tags (grifo etc.).
(function () {
  function nosDeTexto(el) {
    const out = [];
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) if (n.nodeValue.trim()) out.push(n);
    return out;
  }
  document.querySelectorAll('h1 span, h2, .sem-viuva').forEach(el => {
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
