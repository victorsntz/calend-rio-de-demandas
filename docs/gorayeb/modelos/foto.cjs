const { chromium } = require('playwright');
(async () => {
  const [html, ids, out] = [process.argv[2], process.argv[3].split(' '), process.argv[4]];
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 1500 } });
  await p.goto('file://' + html); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  for (const id of ids) { const el = await p.$('#' + id); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(60); await el.screenshot({ path: out + '/' + id + '.png' }); }
  await b.close(); console.log('ok', ids.length);
})();
