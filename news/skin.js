/* BetMeisters News inside betmeisters.com/news (Owner 23 Nov 16:08: one site, one look).
   Runs after app.js: swaps the old .news masthead and footer for the BetMeisters.com ones,
   keeps the news section menu as a slim bar under the main menu, and adds the review honesty note. */
(function () {
  if (window.__mxSkin) return; window.__mxSkin = 1;
  var page = document.body.getAttribute('data-page') || '';
  var G = [["Home", "/", []],
    ["Tips", "/tips", [["Meister tips", "/tips"], ["Combos", "/combo"], ["Accas", "/acca"], ["Pro Picks", "/propicks"]]],
    ["Results", "/results", [["Results", "/results"], ["Performance", "/performance"], ["The Meisters", "/meisters"]]],
    ["News", "/news/", [["News home", "/news/"], ["Previews", "/news/previews.html"], ["Bookmaker reviews", "/news/reviews.html"], ["Guides", "/news/guides.html"], ["Industry news", "/news/news.html"]]]];
  var nav = G.map(function (g) {
    var on = g[0] === 'News';
    if (!g[2].length) return '<a href="' + g[1] + '">' + g[0] + '</a>';
    return '<span class="mx-gn"><a class="mx-top" href="' + g[1] + '"' + (on ? ' aria-current="page"' : '') + '>' + g[0] + ' <span class="mx-c" aria-hidden="true">▾</span></a><span class="mx-menu">' +
      g[2].map(function (c) { return '<a href="' + c[1] + '">' + c[0] + '</a>'; }).join('') + '</span></span>';
  }).join('');
  var hdr = document.getElementById('hdr');
  var secNav = hdr && hdr.querySelector('nav.sections');
  if (hdr) {
    var keep = secNav ? secNav.outerHTML : '';
    hdr.innerHTML = '<div class="mx-util"><div class="mx-wrap"><span>18+ only · Bet responsibly</span><a href="https://www.begambleaware.org" rel="noopener">BeGambleAware.org</a></div></div>' +
      '<div class="mx-free"><div class="mx-wrap"><b>FREE UNTIL 1 JANUARY</b><span>Every tip, Free and Pro, is open to everyone until 1 January. <a href="/tips">See today\'s tips →</a></span></div></div>' +
      '<header class="mx-mast" id="mx-mast"><div class="mx-wrap"><a class="mx-brand" href="/" aria-label="BetMeisters home"><img src="/favicon.svg" alt="" width="34" height="38"><span><b>BET</b>MEISTERS</span></a>' +
      '<button type="button" class="mx-btn" aria-expanded="false" aria-controls="mx-nav" aria-label="Menu"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
      '<nav class="mx-nav" id="mx-nav" aria-label="Main">' + nav + '</nav></div></header>' +
      (keep ? '<div class="mx-sub"><div class="mx-wrap"><span class="mx-sub-k">News</span>' + keep + '</div></div>' : '');
    var b = hdr.querySelector('.mx-btn'), m = hdr.querySelector('.mx-mast');
    if (b) b.addEventListener('click', function () { var o = m.getAttribute('data-open') === 'true'; m.setAttribute('data-open', String(!o)); b.setAttribute('aria-expanded', String(!o)); });
  }
  var ftr = document.getElementById('ftr');
  if (ftr) ftr.innerHTML = '<footer class="mx-foot"><div class="mx-wrap"><div class="mx-fcols">' +
    '<div><a class="mx-brand" href="/"><img src="/favicon.svg" alt="" width="30" height="34"><span><b>BET</b>MEISTERS</span></a><p>Independent tips from two Meisters, every one priced and kept on the record, plus news, previews, guides and bookmaker reviews. We are not a bookmaker and take no bets.</p><p>Contact: tom@betmeisters.com</p></div>' +
    '<div><h4>Tips</h4><a href="/tips">Meister tips</a><a href="/combo">Combos</a><a href="/acca">Accas</a><a href="/propicks">Pro Picks</a></div>' +
    '<div><h4>Results</h4><a href="/results">Results</a><a href="/performance">Performance</a><a href="/meisters">The Meisters</a><a href="/article-price-first">How we price a tip</a></div>' +
    '<div><h4>News</h4><a href="/news/">News home</a><a href="/news/previews.html">Previews</a><a href="/news/reviews.html">Bookmaker reviews</a><a href="/news/guides.html">Guides</a><a href="/news/fpl.html">FPL</a></div>' +
    '<div><h4>About</h4><a href="/news/how-we-score.html">How we score reviews</a><a href="/news/safer-gambling.html">Safer gambling</a><a href="/news/about.html">About us</a><a href="/privacy">Privacy and cookies</a></div></div>' +
    '<p class="mx-honest"><b>No tip is sold.</b> Every tip comes from the numbers (NCM) or from The Original Meister. <b>No review score is for sale.</b> We have no affiliate deals at present; if we ever earn commission from an operator, the review will say so.</p>' +
    '<div class="mx-rg"><span class="mx-age">18+</span><p>Only bet what you can afford to lose. Tips are opinions, not guarantees. Free, confidential help: <a href="https://www.begambleaware.org" rel="noopener">BeGambleAware.org</a> or the National Gambling Helpline on 0808 8020 133 (UK); 1-800-GAMBLER (US).</p></div>' +
    '<p class="mx-small">© 2026 BetMeisters. Times are UK time unless stated.</p></div></footer>';
  if (/^(review|reviews|how-we-score)$/.test(page)) {
    var main = document.getElementById('main');
    if (main && !main.querySelector('.mx-note')) { var n = document.createElement('p'); n.className = 'mx-note';
      n.innerHTML = '<b>No score is for sale.</b> We have no affiliate deals at present. If we ever earn commission from an operator, its review will say so, and the score will still come only from our published checks.';
      main.insertBefore(n, main.firstChild); }
  }
})();
