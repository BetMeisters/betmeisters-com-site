/* BetMeisters News inside betmeisters.com/news (Owner 23 Nov 16:08: one site, one look).
   Runs after app.js: swaps the old .news masthead and footer for the BetMeisters.com ones,
   keeps the news section menu as a slim bar under the main menu, and adds the review honesty note. */
(function () {
  if (window.__mxSkin) return; window.__mxSkin = 1;
  var page = document.body.getAttribute('data-page') || '';
  var G = [["Home", "/", []],
    ["Tips", "/tips", [["Meister tips", "/tips"], ["Combos", "/combo"], ["Accas", "/acca"], ["Pro Picks", "/propicks"]]],
    ["Results", "/results", [["Results", "/results"], ["Performance", "/performance"], ["The Meisters", "/meisters"]]],
    ["News", "/news/", [["News home", "/news/"], ["Previews", "/news/previews.html"], ["Guides", "/news/guides.html"], ["Industry news", "/news/news.html"], ["Online casino", "/news/casino-news.html"], ["Bookmaker reviews", "/news/bookie-reviews.html"], ["Casino reviews", "/news/casino-reviews.html"]]]];
  var nav = G.map(function (g) {
    var on = g[0] === 'News';
    if (!g[2].length) return '<a href="' + g[1] + '">' + g[0] + '</a>';
    return '<span class="mx-gn"><a class="mx-top" href="' + g[1] + '"' + (on ? ' aria-current="page"' : '') + '>' + g[0] + ' <span class="mx-c" aria-hidden="true">▾</span></a><span class="mx-menu">' +
      g[2].map(function (c) { return '<a href="' + c[1] + '">' + c[0] + '</a>'; }).join('') + '</span></span>';
  }).join('');
  function mxBand(keep) {
    /* Owner 23 Nov 17:40: News gets a proper section band like Tips/Results (big on section pages, slim on articles) */
    var big = /^(home|news|previews|reviews|fpl|section|bonuses)$/.test(page);
    var T = { home: ['BetMeisters <span>News</span>', 'Previews, news, guides and honest bookmaker reviews, with the real chances behind the prices.'],
      news: ['Industry <span>news</span>', 'Betting and sports industry news, with the numbers behind each story.'],
      previews: ['Match and race <span>previews</span>', 'Football, racing and other sports, with fair chances from the sharp market.'],
      reviews: ['Bookmaker <span>reviews</span>', 'Scored on a published method. No score is for sale.'],
      fpl: ['Fantasy <span>Premier League</span>', 'Deadlines, chips, captains and transfers, with the market behind every call.'],
      section: ['Betting <span>guides</span>', 'Plain-English guides: odds, margins, handicaps, each way and more.'],
      bonuses: ['BetMeisters <span>News</span>', ''] };
    /* Keith 24 Nov 15:32: online casino section (casino news + casino reviews pages) */
    var bid = window.BMN_ID || (location.hash || '').slice(1);
    if (page === 'reviews' && bid === 'casino') T.reviews = ['Online casino <span>reviews</span>', 'UK-licensed casinos scored on a published method. No score is for sale.'];
    else if (page === 'reviews' && bid !== 'bookies') T.reviews = ['Bookmaker and casino <span>reviews</span>', 'Scored on a published method. No score is for sale.'];
    if (page === 'news' && bid === 'online-casino') T.news = ['Online casino <span>news</span>', 'Online casino, slots and live casino news for UK players, from primary sources.'];
    var isCas = false; try { var _o = ((window.BMN || {}).operators || []).filter(function (x) { return x.id === bid; })[0]; isCas = !!(_o && (_o.tags || [])[0] === 'Online casino'); } catch (e) {}
    var t = T[page] || ['BetMeisters <span>News</span>', ''];
    var kick = { article: 'BetMeisters News', review: isCas ? 'Casino review' : 'Bookmaker review', plain: 'BetMeisters News' }[page] || 'BetMeisters News';
    return '<div class="mx-band' + (big ? '' : ' slim') + '"><div class="mx-wrap">' +
      (big ? (page === 'home' ? '' : '<p class="mx-k">BetMeisters News</p>') + '<h1 class="mx-h">' + t[0] + '</h1>' + (t[1] ? '<p class="mx-d">' + t[1] + '</p>' : '') : '<p class="mx-k">' + kick + '</p>') +
      (keep ? '<div class="mx-tabs">' + keep + '</div>' : '') + '</div></div>';
  }
  /* Owner 23 Nov 17:46: Reviews last everywhere for now (thin, no affiliate deals yet); traffic comes through the news */
  (function () {
    var nav = document.querySelector('#hdr nav.sections');
    if (nav) { var r = Array.prototype.filter.call(nav.children, function (c) { var a = c.matches('a') ? c : c.querySelector('a'); return a && /reviews\.html/.test(a.getAttribute('href') || ''); })[0]; if (r) nav.appendChild(r); }
    if (page === 'home') {
      var main = document.getElementById('main'), hs = main ? main.querySelectorAll('.sec-h') : [];
      Array.prototype.forEach.call(hs, function (h) {
        if (!/^\s*Reviews/.test(h.textContent)) return;
        var group = [h], n = h.nextElementSibling;
        while (n && !n.classList.contains('sec-h') && !n.classList.contains('signup')) { group.push(n); n = n.nextElementSibling; }
        group.forEach(function (g) { main.appendChild(g); });
      });
    }
  })();
  /* Owner 23 Nov 18:18: news util bar matches .com (odds switch, same saved setting as the tips pages) */
  var mxOdds = 'dec'; try { mxOdds = localStorage.getItem('bm-odds2') || 'dec'; } catch (e) {}
  var hdr = document.getElementById('hdr');
  var secNav = hdr && hdr.querySelector('nav.sections');
  if (hdr) {
    var keep = secNav ? secNav.outerHTML : '';
    hdr.innerHTML = '<div class="mx-util"><div class="mx-wrap"><span>18+ only · Bet responsibly</span><span class="mx-odds"><span class="mx-ol">Odds</span><span class="mx-seg" role="group" aria-label="Odds format">' + [['dec','Decimal'],['frac','Fractional'],['us','US']].map(function (o) { return '<button type="button" data-mxodds="' + o[0] + '" aria-pressed="' + (o[0] === mxOdds ? 'true' : 'false') + '">' + o[1] + '</button>'; }).join('') + '</span></span></div></div>' +
      '<div class="mx-free"><div class="mx-wrap"><b>FREE UNTIL 1 JANUARY</b><span>Let the Meisters prove themselves. Every tip, Free and <span class="mx-pro">PRO</span>, is open to everyone until 1 January. After that, Pro tips are for subscribers.</span></div></div>' +
      '<header class="mx-mast" id="mx-mast"><div class="mx-wrap"><a class="mx-brand" href="/" aria-label="BetMeisters home"><img src="/favicon.svg" alt="" width="34" height="38"><span><b>BET</b>MEISTERS</span></a>' +
      '<button type="button" class="mx-btn" aria-expanded="false" aria-controls="mx-nav" aria-label="Menu"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
      '<nav class="mx-nav" id="mx-nav" aria-label="Main">' + nav + '</nav></div></header>' +
      mxBand(keep);
    var b = hdr.querySelector('.mx-btn'), m = hdr.querySelector('.mx-mast');
    Array.prototype.forEach.call(hdr.querySelectorAll('[data-mxodds]'), function (x) { x.addEventListener('click', function () { mxOdds = x.getAttribute('data-mxodds'); try { localStorage.setItem('bm-odds2', mxOdds); } catch (e) {} Array.prototype.forEach.call(hdr.querySelectorAll('[data-mxodds]'), function (y) { y.setAttribute('aria-pressed', y === x ? 'true' : 'false'); }); }); });
    if (b) b.addEventListener('click', function () { var o = m.getAttribute('data-open') === 'true'; m.setAttribute('data-open', String(!o)); b.setAttribute('aria-expanded', String(!o)); });
  }
  var ftr = document.getElementById('ftr');
  if (ftr) ftr.innerHTML = '<footer class="mx-foot"><div class="mx-wrap"><div class="mx-fcols">' +
    '<div><a class="mx-brand" href="/"><img src="/favicon.svg" alt="" width="30" height="34"><span><b>BET</b>MEISTERS</span></a><p>Independent tips from two Meisters, every one priced and kept on the record, plus news, previews, guides and bookmaker reviews. We are not a bookmaker and take no bets.</p><p>Contact: tom@betmeisters.com</p></div>' +
    '<div><h4>Tips</h4><a href="/tips">Meister tips</a><a href="/combo">Combos</a><a href="/acca">Accas</a><a href="/propicks">Pro Picks</a></div>' +
    '<div><h4>Results</h4><a href="/results">Results</a><a href="/performance">Performance</a><a href="/meisters">The Meisters</a><a href="/article-price-first">How we price a tip</a></div>' +
    '<div><h4>News</h4><a href="/news/">News home</a><a href="/news/previews.html">Previews</a><a href="/news/guides.html">Guides</a><a href="/news/fpl.html">FPL</a><a href="/news/casino-news.html">Online casino</a><a href="/news/bookie-reviews.html">Bookmaker reviews</a><a href="/news/casino-reviews.html">Casino reviews</a></div>' +
    '<div><h4>About</h4><a href="/news/how-we-score.html">How we score reviews</a><a href="/news/safer-gambling.html">Safer gambling</a><a href="/news/about.html">About us</a><a href="/privacy">Privacy and cookies</a></div></div>' +
    '<p class="mx-honest"><b>No tip is sold.</b> Every tip comes from the numbers (NCM) or from The Original Meister. <b>No review score is for sale.</b> We have no affiliate deals at present; if we ever earn commission from an operator, the review will say so.</p>' +
    '<div class="mx-rg"><span class="mx-age">18+</span><p>Only bet what you can afford to lose. Tips are opinions, not guarantees. Free, confidential help: <a href="https://www.begambleaware.org" rel="noopener">BeGambleAware.org</a> or the National Gambling Helpline on 0808 8020 133 (UK); 1-800-GAMBLER (US).</p></div>' +
    '<p class="mx-small">© 2026 BetMeisters. Times are UK time unless stated.</p></div></footer>';
  if (/^(review|reviews|how-we-score)$/.test(page)) {
    var main = document.getElementById('main');
    if (main && !main.querySelector('.mx-note')) { var n = document.createElement('p'); n.className = 'mx-note';
      n.innerHTML = '<b>No score is for sale.</b> We have no affiliate deals at present. If we ever earn commission from an operator, its review will say so, and the score will still come only from our published checks.';
      main.insertBefore(n, main.firstChild); }
    /* Owner 23 Nov 17:50 + 18:33 sweep: explanation boxes go to the bottom of the page; a one-line pointer stays at the top */
    if (main && !document.getElementById('about-review')) {
      var boxes = Array.prototype.slice.call(main.querySelectorAll('.mx-note, .desk-note'));
      if (boxes.length) {
        var sec = document.createElement('section'); sec.id = 'about-review'; sec.className = 'mx-about';
        sec.innerHTML = '<h2>About this ' + (page === 'review' ? 'review' : 'page') + '</h2>';
        boxes.forEach(function (x) { sec.appendChild(x); });
        var host = main.querySelector('.page') || main; host.appendChild(sec);
        var line = document.createElement('p'); line.className = 'mx-line';
        line.innerHTML = (page === 'review' ? 'Desk review · ' : '') + 'No score is for sale · <a href="#about-review">how we did this ↓</a>';
        var h1 = main.querySelector('h1'); if (h1 && h1.parentNode) h1.parentNode.insertBefore(line, h1); else main.insertBefore(line, main.firstChild);
      }
    }
  }
})();
