/* BetMeisters MODERN layer (Owner 23 Nov 15:29). Runs after app.js: adds the home hero and folds tip-card detail behind 'Details'. */
(function () {
  var home = document.body.getAttribute('data-page') === 'home';
  var sg = function (v) { return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2); };
  function hero(f) {
    if (!home || window.BM_HOME2 || document.querySelector('.mh')) return; /* Owner 25 Nov: the home preview has its own compact strip */
    var root = document.querySelector('[data-page-root] main') || document.querySelector('main');
    if (!root) return;
    var r = (f && f.record) || null, c = f && f.clv;
    var h = document.createElement('section'); h.className = 'mh'; h.setAttribute('aria-label', 'BetMeisters');
    var nx = ((f && f.next) || []).slice(0, 3), uk = function (iso) { try { return new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(iso)); } catch (e) { return ''; } };
    var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); };
    var side = nx.length ? '<aside class="mh-next" aria-label="Next tips"><p class="mh-nk">Up next · free to read</p>' + nx.map(function (t) {
      return '<a class="mh-nt" href="/tips"><span class="mh-nm">' + uk(t.start) + ' UK · ' + esc(t.sport) + ' · ' + esc(t.who) + '</span><b>' + esc(t.sel) + ' <em>@ ' + Number(t.price).toFixed(2) + '</em></b><span class="mh-ne">' + esc(t.event) + (t.chance ? ' · our chance ' + Math.round(t.chance * 100) + '%' : '') + '</span></a>';
    }).join('') + '<a class="mh-all" href="/tips">All of today\'s tips →</a></aside>' : '';
    h.innerHTML = '<div class="in"><div class="mh-l"><h1>Every tip priced.<br><span>Every result kept.</span></h1>' +
      '<p>Our Meisters publish every tip before the start, with the price and the chance we give it. Winners and losers stay on the record. Every tip is free to read until 1 January.</p>' +
      '<div class="acts"><a class="cta" href="/tips">See today\'s tips →</a><a class="cta2" href="/meisters">How the Meisters work</a></div>' +
      (r ? '<div class="st"><div><b class="' + (r.pts >= 0 ? 'g' : '') + '">' + sg(r.pts) + '</b><span>points since 5 Nov</span></div><div><b>' + r.tips + '</b><span>settled tips</span></div><div><b>' + (r.roi >= 0 ? '+' : '−') + Math.abs(r.roi).toFixed(1) + '%</b><span>return on stakes</span></div>' +
        (c ? '<div><b>' + c.pct + '%</b><span>beat the closing price</span></div>' : '') + '</div>' : '') + '</div>' + side + '</div>';
    if (side) h.classList.add('has-next');
    root.insertBefore(h, root.firstChild);
  }
  function details() {
    Array.prototype.forEach.call(document.querySelectorAll('.htip'), function (t) {
      if (t.querySelector('.md-btn') || !t.querySelector('.htip-sm, .htip-pub')) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'md-btn'; b.setAttribute('aria-expanded', 'false'); b.textContent = 'Details ▾';
      b.addEventListener('click', function () { var o = t.classList.toggle('md-open'); b.setAttribute('aria-expanded', o ? 'true' : 'false'); b.textContent = o ? 'Less ▴' : 'Details ▾'; });
      var cd = t.querySelector('.htip-cd') || t.querySelector('.htip-ln');
      if (cd && cd.parentNode === t) cd.insertAdjacentElement('afterend', b); else t.appendChild(b);
    });
  }
  /* Owner 23 Nov 17:44: long explainer boxes move to the bottom of the page (still visible, nothing hidden);
     a one-line pointer stays where the box was. Applies to the separate-record notes and the Meister change note. */
  function moveNotes() {
    var main = document.querySelector('[data-page-root] main') || document.querySelector('main');
    if (!main) return;
    Array.prototype.forEach.call(document.querySelectorAll('.ac-note, .change-note'), function (n) {
      if (n.getAttribute('data-moved')) return;
      n.setAttribute('data-moved', '1');
      var acca = /Acca Meister results/.test(n.textContent), combo = /Combo Meister results/.test(n.textContent);
      var box0 = document.getElementById('about-record');
      if (box0) { box0.appendChild(n); return; }
      var line = document.createElement('p'); line.className = 'mv-line';
      line.innerHTML = (acca || combo ? '<b>Separate record:</b> not part of the main BetMeisters totals. ' : '<b>Record notes:</b> how the Meister records changed. ') + '<a href="#about-record">Why ↓</a>';
      n.parentNode.insertBefore(line, n);
      var box = document.getElementById('about-record');
      if (!box) { box = document.createElement('section'); box.id = 'about-record'; box.className = 'mv-box'; box.innerHTML = '<h2 class="sec-title">About this record</h2>'; main.appendChild(box); }
      box.appendChild(n);
    });
  }
  moveNotes();
  new MutationObserver(function () { moveNotes(); }).observe(document.body, { childList: true, subtree: true });
  /* Owner 23 Nov 17:55: Tips and Results headers as big as the home hero on wide screens, with a side panel
     (Tips: next tips; Results: latest results). Phones unchanged. */
  function sidePanel(f) {
    var pg = document.body.getAttribute('data-page');
    if (pg !== 'tips' && pg !== 'results') return;
    var head = document.querySelector('.page-head'), w = head && head.querySelector('.wrap');
    if (!w || head.querySelector('.ph-side')) return;
    var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); };
    var uk = function (iso) { try { return new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(iso)); } catch (e) { return ''; } };
    var html = '';
    if (pg === 'tips') {
      var nx = ((f && f.next) || []).slice(0, 3); if (!nx.length) return;
      html = '<p class="mh-nk">Up next · free to read</p>' + nx.map(function (t) {
        return '<a class="mh-nt" href="#next"><span class="mh-nm">' + uk(t.start) + ' UK · ' + esc(t.sport) + ' · ' + esc(t.who) + '</span><b>' + esc(t.sel) + ' <em>@ ' + Number(t.price).toFixed(2) + '</em></b><span class="mh-ne">' + esc(t.event) + (t.chance ? ' · our chance ' + Math.round(t.chance * 100) + '%' : '') + '</span></a>';
      }).join('');
    } else {
      var T = ((window.BM && BM.TIPS) || []).filter(function (t) { return t.phase === 2 && !t.hidden && /^(won|lost|void|placed|half-won|half-lost)$/.test(t.result) && (t.meister === 'meister' || t.meister === 'cruncher' || t.meister === 'ncmr'); })
        .sort(function (a, b) { return (b.settledAt || b.start) > (a.settledAt || a.start) ? 1 : -1; }).slice(0, 3);
      if (!T.length) return;
      var pts = function (t) { var s = t.stake || 1, p = t.price; return t.result === 'won' ? s * (p - 1) : t.result === 'lost' ? -s : t.result === 'half-won' ? s / 2 * (p - 1) : t.result === 'half-lost' ? -s / 2 : 0; };
      var sg = function (v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(2); };
      var who = { meister: 'The Original Meister', cruncher: 'Number Cruncher', ncmr: 'NCM Racing' };
      html = '<p class="mh-nk">Latest results</p>' + T.map(function (t) {
        var v = pts(t), w = /won/.test(t.result) ? 'Won' : /lost/.test(t.result) ? 'Lost' : t.result === 'placed' ? 'Placed' : 'Void';
        return '<div class="mh-nt"><span class="mh-nm">' + esc(t.sport) + ' · ' + esc(who[t.meister] || '') + '</span><b>' + esc(t.selection) + ' <em>@ ' + Number(t.price).toFixed(2) + '</em> <i class="ph-r ' + (v > 0 ? 'w' : v < 0 ? 'l' : '') + '">' + w + ' ' + sg(v) + '</i></b><span class="mh-ne">' + esc(t.event) + '</span></div>';
      }).join('');
    }
    var side = document.createElement('aside'); side.className = 'mh-next ph-side'; side.innerHTML = html;
    var left = document.createElement('div'); left.className = 'ph-l';
    while (w.firstChild) left.appendChild(w.firstChild);
    if (pg === 'results' && f && f.record) {
      var r = f.record, c = f.clv, sgn = function (v) { return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2); };
      var st = document.createElement('div'); st.className = 'st ph-st';
      st.innerHTML = '<div><b class="' + (r.pts >= 0 ? 'g' : '') + '">' + sgn(r.pts) + '</b><span>points since 5 Nov</span></div><div><b>' + r.tips + '</b><span>settled tips</span></div><div><b>' + (r.roi >= 0 ? '+' : '−') + Math.abs(r.roi).toFixed(1) + '%</b><span>return on stakes</span></div>' + (c ? '<div><b>' + c.pct + '%</b><span>beat the closing price</span></div>' : '');
      left.appendChild(st);
    }
    w.appendChild(left); w.appendChild(side); head.classList.add('ph-big');
  }
  if (/^(tips|results)$/.test(document.body.getAttribute('data-page') || '')) fetch('tips_feed.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(sidePanel).catch(function () { sidePanel(null); });
  /* Owner 23 Nov 17:58: a 'next step' link at the bottom of the three main pages (Home -> Tips -> Results -> Meisters) */
  (function nextStep() {
    var pg = document.body.getAttribute('data-page');
    var N = { home: ['/tips', 'See today\'s tips', 'Every open tip with its price, chance and edge.'],
      tips: ['/results', 'See how they did', 'Every result, winners and losers, on the record.'],
      results: ['/meisters', 'Meet the Meisters', 'Who picks the tips, and each Meister\'s own record.'] }[pg];
    var main = document.querySelector('[data-page-root] main') || document.querySelector('main');
    if (!N || !main || main.querySelector('.nx-step')) return;
    var a = document.createElement('a'); a.className = 'nx-step'; a.href = N[0];
    a.innerHTML = '<span class="nx-k">Next</span><b>' + N[1] + ' →</b><span class="nx-d">' + N[2] + '</span>';
    var box = document.getElementById('about-record'); if (box) main.insertBefore(a, box); else main.appendChild(a);
  })();
  if (home) fetch('tips_feed.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(hero).catch(function () { hero(null); });
  details();
  new MutationObserver(function () { details(); }).observe(document.body, { childList: true, subtree: true });
})();
