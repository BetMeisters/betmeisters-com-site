/* BetMeisters site script: header, footer, tip cards, scorecards, charts. Reads data.js. */
(function () {
  "use strict";
  var BM = window.BM;
  /* Owner 1 Nov 2026: tips voided because our price data was wrong (single-feed prices) are kept in data.js and the Ledger but never shown on the site. */
  BM.TIPS = BM.TIPS.filter(function (t) { return !t.hidden; });
  /* Owner 26 Nov 09:59-10:01: Meister Specials, Pro Picks and TOM's NAP RETIRED. Site = 4 Meisters, Pro and Free, plus the (racing) NAP.
     The flags stay in data.js and the Ledger but are ignored everywhere on the site. */
  BM.TIPS.forEach(function (t) { delete t.special; delete t.proPick; delete t.humanNap; if (t.meister !== "ncmr") delete t.nap; }); /* NAPs are racing only (Owner 26 Nov) */
  /* Owner 6 Nov 09:34: the site shows Phase 2 only (from 5 Nov 06:00 UK). Phase 1 stays in full in data.js and the Ledger. */
  BM.TIPS = BM.TIPS.filter(function (t) { return t.phase === 2; });
  /* Owner 3 Nov 2026: The Close Meister (meister "close") is a tracking Meister for near misses. Its tips are kept out of TIPS so no total, chart or four-box layout changes; they are shown only in the Close Meister strip. */
  /* Owner 16 Nov 09:42: an acca is 4+ legs. Doubles/trebles stay in the Ledger (BM.ACCAS_ALL) but are not shown or counted on the site */
  BM.ACCAS_ALL = BM.ACCAS || []; BM.ACCAS = BM.ACCAS_ALL.filter(function (a) { return a.legs && a.legs.length >= 4 && a.legs.length <= 5; });
  /* Owner 22 Nov 09:40-09:44: what is sold is shown. Acca Meister = 4-5 leg accas only. 6+ leg accas move to the Large Accas Meister (LAM), retired at once:
     kept in data.js and the Ledger (BM.ACCAS_LARGE), not shown or counted on the site. 2-3 leg accas are exactly what the Combo Meister sells, so they are
     reassigned to the Combo Meister (original ids, picks and logs unchanged; nothing deleted). */
  BM.ACCAS_LARGE = BM.ACCAS_ALL.filter(function (a) { return a.legs && a.legs.length >= 6; }); BM.ACCAS_LARGE.forEach(function (a) { a.meisterRetired = "largeacca"; });
  BM.COMBOS = (BM.COMBOS || []).concat(BM.ACCAS_ALL.filter(function (a) { return a.legs && a.legs.length >= 2 && a.legs.length <= 3 && !(a.meister === "tom" || a.meister === "meister"); }).map(function (a) {
    var c = {}; for (var k in a) c[k] = a[k]; c.meister = "combo"; c.type = "Combo"; c.title = a.legs.length === 2 ? "Double" : "Treble"; c.movedFrom = "Acca Meister"; return c; }));
  BM.CLOSE = BM.TIPS.filter(function (t) { return t.meister === "close"; });
  BM.TIPS = BM.TIPS.filter(function (t) { return t.meister !== "close"; });
  /* Owner 9 Nov 08:19: Fine Margins retired. His tips stay in the site totals (headline, scorecards, total and Pro v Free charts, day totals) but he has no Meister lines, cards, filters or page, and his tips are not listed in open or settled lists */
  BM.MEISTERS = BM.MEISTERS.filter(function (m) { return m.id !== "margins"; });
  /* Owner 20 Nov 17:42-17:44: Old TOM retired, exactly like Fine Margins. TOM tips from 5 to 11 Nov were picks made with AI input
     (the hybrid TOM that will never be sold); from 12 Nov TOM is fully human (t.human). Old TOM tips are NOT deleted: they stay in
     data.js and the Ledger under meister "meister", and are re-labelled here as "tomold" (AHT, the AI Hybrid TOM) so every TOM line, box, chart and total on the
     site is Human TOM only, the record that will be sold. Retired Meisters are left out of the site totals (Owner 16 Nov). */
  BM.TIPS.forEach(function (t) { if (t.meister === "meister" && !t.human) { t.meister = "tomold"; t.retiredFrom = "meister"; } });
  /* Owner 20 Nov 18:23-18:27: old NCM racing (bookmaker method, 5-18 Nov) retired as NCMROLD, exactly like AHT: data.js and the Ledger keep it under "ncmr";
     the site shows NCMR from the exchange method (v2, from 19 Nov) only. */
  BM.TIPS.forEach(function (t) { if (t.meister === "ncmr" && t.racingMethod !== "v2") { t.meister = "ncmrold"; t.retiredFrom = "ncmr"; } });
  /* Owner 25 Nov 09:25: The Original Meister retired (TOM tips, Original Combo Meister and Original Acca Meister), exactly like FMM, AHT and NCMROLD.
     Nothing is deleted: data.js and the Ledger keep every TOM tip under "meister" and every OCM/OAM multiple under "tom"/"meister". Here TOM tips are
     re-labelled "tomret" (retired, left out of every list and total) and OCM/OAM multiples move to BM.COMBOS_OCM / BM.ACCAS_OAM (kept, not shown or counted).
     TOM may come back later, or as a new Meister. */
  BM.TIPS.forEach(function (t) { if (t.meister === "meister") { t.meister = "tomret"; t.retiredFrom = "meister"; } });
  BM.COMBOS_OCM = (BM.COMBOS || []).filter(function (a) { return a.meister === "tom" || a.meister === "meister"; }); BM.COMBOS_OCM.forEach(function (a) { a.meisterRetired = "ocm"; });
  BM.COMBOS = (BM.COMBOS || []).filter(function (a) { return !(a.meister === "tom" || a.meister === "meister"); });
  BM.ACCAS_OAM = (BM.ACCAS || []).filter(function (a) { return a.meister === "tom" || a.meister === "meister"; }); BM.ACCAS_OAM.forEach(function (a) { a.meisterRetired = "oam"; });
  BM.ACCAS = (BM.ACCAS || []).filter(function (a) { return !(a.meister === "tom" || a.meister === "meister"); });
  BM.MEISTERS = BM.MEISTERS.filter(function (m) { return m.id !== "meister"; });
  /* Owner 25 Nov 10:16: the Acca Meister retired (69 accas, 3 won). Every acca stays in data.js and the Ledger; none are shown or counted on the site. */
  BM.ACCAS_AM = BM.ACCAS || []; BM.ACCAS_AM.forEach(function (a) { a.meisterRetired = "acca"; }); BM.ACCAS = [];
  /* Owner 25 Nov 10:46: the Combo Meister is a Meister in his own right (proven: +15 pts on 96 combos). Every Combo Meister double/treble
     becomes a tip of meister "combo" here (data.js and the Ledger keep them in BM.COMBOS / the Combos sheets): price = the legs multiplied,
     chance = the leg chances multiplied, result from the legs, start = the first leg. It counts in every list, total, page and box like any Meister.
     Owner 25 Nov 10:53: the Racing Combo Meister (rcm) is merged into the Combo Meister: racing combos are CM tips too (racing keeps its own leg rules). */
  BM.COMBOS_CM = (BM.COMBOS || []).filter(function (a) { return a.legs && a.legs.length >= 2 && !a.hidden; });
  BM.COMBOS_CM.forEach(function (a) {
    var L = a.legs.slice().sort(function (x, y) { return new Date(x.start) - new Date(y.start); });
    var P = L.reduce(function (m, l) { return m * l.price; }, 1), C = L.reduce(function (m, l) { return m * (l.chance || 0); }, 1);
    var lost = L.some(function (l) { return l.result === "lost"; }), open = L.some(function (l) { return !l.result || l.result === "open"; });
    var f = L.reduce(function (m, l) { var r = l.result; return m * (r === "won" ? l.price : r === "void" ? 1 : r === "half-won" ? (1 + l.price) / 2 : r === "half-lost" ? 0.5 : 1); }, 1);
    var res = lost ? "lost" : open ? "open" : f > 1.0001 ? "won" : f < 0.9999 ? "lost" : "void";
    /* Keith 26 Nov 08:53: CLV on ALL Meisters. A combo has a close only when every leg has a Pinnacle closeChance (combo_close.py). */
    var CC = L.every(function (l) { return typeof l.closeChance === "number" && l.closeChance > 0; }) ? L.reduce(function (m, l) { return m * l.closeChance; }, 1) : null;
    var sports = {}; L.forEach(function (l) { sports[l.sport || "Football"] = 1; }); var sp = Object.keys(sports).length === 1 ? Object.keys(sports)[0] : "Multiple sports";
    BM.TIPS.push({ id: a.id, published: a.publishedAt || a.published || L[0].start, meister: "combo", phase: 2, combo: true, legs: L, comboRet: lost ? 0 : f,
      tier: "combo", sport: sp, comp: L.map(function (l) { return l.comp || ""; }).join(" + "),
      selection: L.length === 2 ? "Double" : "Treble",
      market: (L.length === 2 ? "Double" : "Treble") + " (" + L.length + " legs)", betType: "Multiple", event: L.map(function (l) { return l.sel + " (" + l.event + ")"; }).join(" + "),
      start: L[0].start, lastStart: L[L.length - 1].start, price: Math.round(P * 100) / 100, minPrice: null, prob: C, stake: a.stake || 1, bookie: "", result: res, note: a.note || "", nap: false, value: false, close: CC ? Math.round(1 / CC * 100) / 100 : null, closeChance: CC, clv: CC ? Math.round((P * CC - 1) * 10000) / 10000 : undefined });
  });
  BM.COMBOS = [];
  function isRetired(t) { return t.meister === "margins" || t.meister === "tomold" || t.meister === "ncmrold" || t.meister === "tomret"; }
  var SITE = BM.SITE, TIPS = BM.TIPS, MEISTERS = BM.MEISTERS;
  /* Owner 3 Nov: "with" totals include The Drift Meister AND The Close Meister; main ("without") totals leave both out. */
  function withAll() { return TIPS.concat(BM.CLOSE || []); }
  var CM_FROM = "2026-11-03T00:00:00+03:00";
  var page = document.body.getAttribute("data-page") || "home";

  /* ---------- small helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function load(k, d) { try { var v = localStorage.getItem("bm-" + k); return v == null ? d : v; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem("bm-" + k, v); } catch (e) { } }
  var oddsMode = load("odds2", "dec");
  /* Preview access: "visitor" (free tips only), "sub:<meisterId>" (that Meister's Pro tips), "full" (everything) */
  var access = load("access2", "full");
  function hasAccess(meisterId) { return access === "full" || access === "sub:" + meisterId; }
  var TIER_COLOR = { free: "#3ECFC6", pro: "#FFC629", nap: "#FF6B3D", hnap: "#5B8CFF", value: "#A9BDFF", special: "#D4EE3C", propick: "#B48CFF", premium: "#4DA3FF", mm: "#8B95A8" };
  var MCOLOR = { combo: "#2196D3", ncmp: "#6B46C1", tomret: "#9AA3B5", ncmrold: "#9AA3B5", tomold: "#9AA3B5", meister: "#D99A00", cruncher: "#119C93", ncmr: "#B5651D", margins: "#5B74D6", removed: "#7A8396", close: "#9A6BD1" };
  var MSHORT = { combo: "Combo Meister", ncmp: "NCM Premium Events", tomret: "The Original Meister (TOM, retired)", ncmrold: "NCM Racing Old (NCMROLD, retired)", tomold: "AI Hybrid TOM (AHT, retired)", meister: "The Original Meister", cruncher: "Number Cruncher Meister", ncmr: "NCM Racing Meister", margins: "Fine Margins Meister", removed: "The Drift Meister", close: "The Close Meister" };
  var MSUB = { combo: "Doubles and trebles with edge · own record", ncmp: "Big games, small edges · always positive · own record", meister: "The Original Meister's own tips", cruncher: "AI-assisted · stats and maths · best taken early", ncmr: "Number Cruncher racing · exchange method · own record", margins: "Edge of +2% to +5%", removed: "Withdrawn tips: shortened (old rule) or drifted", close: "Near misses, notional 0.5 pt" };
  var CM = { id: "close", name: "The Close Meister", short: "The Close Meister", initials: "CM" };
  function meisterById(id) { for (var i = 0; i < MEISTERS.length; i++) if (MEISTERS[i].id === id) return MEISTERS[i]; if (id === "close") return CM; return { name: id, initials: "?", id: id }; }

  /* ---------- brand marks ---------- */
  var B_PATH = "M21.5 74 V37.5 H30.5 A7 7 0 0 1 30.5 51.5 H21.5 M21.5 51.5 H29 A9.5 9.5 0 0 1 29 70.5 H18";
  var M_PTS = "58,74 58,34 65,34 70,48 75,34 82,34 82,74 75,74 75,54 71.5,64 68.5,64 65,54 65,74";
  function shield(c, label) {
    c = c || TIER_COLOR.pro;
    return '<svg viewBox="0 0 100 110" ' + (label ? 'role="img" aria-label="' + esc(label) + '"' : 'aria-hidden="true"') + '>' +
      '<path d="M50 8 H10 V50 C10 76 28 94 50 102 Z" fill="' + c + '"/>' +
      '<path d="M50 8 H90 V50 C90 76 72 94 50 102 Z" fill="#13285A"/>' +
      '<path d="M10 8 H90 V50 C90 76 72 94 50 102 C28 94 10 76 10 50 Z" fill="none" stroke="' + c + '" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="' + B_PATH + '" fill="none" stroke="#0B1A3A" stroke-width="7"/>' +
      '<polygon points="' + M_PTS + '" fill="' + c + '"/></svg>';
  }
  function miniShield() {
    return '<svg viewBox="0 0 100 110" aria-hidden="true"><path d="M50 8 H10 V50 C10 76 28 94 50 102 Z" fill="#0B1A3A"/><path d="M50 8 H90 V50 C90 76 72 94 50 102 Z" fill="none" stroke="#0B1A3A" stroke-width="10"/><path d="M10 8 H90 V50 C90 76 72 94 50 102 C28 94 10 76 10 50 Z" fill="none" stroke="#0B1A3A" stroke-width="10" stroke-linejoin="round"/></svg>';
  }
  var ICON = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 20.5l1.3-4.3A8.5 8.5 0 1 1 8 19.3z"/><path d="M9 9.5c.3 1.8 1.8 3.6 3.6 4.4l1.2-1 1.7.8-.4 1.6c-3 .2-6.6-3.2-6.9-6.3l1.5-.6.8 1.6z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 4l16 16M20 4L4 20"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>'
  };

  /* ---------- odds ---------- */
  var FRACS = ["1/10","1/8","1/7","1/6","1/5","2/9","1/4","2/7","3/10","1/3","4/11","2/5","4/9","5/11","1/2","8/15","11/20","4/7","8/13","4/6","8/11","3/4","4/5","5/6","17/20","10/11","20/21","1/1","21/20","11/10","6/5","5/4","13/10","11/8","7/5","6/4","31/20","8/5","13/8","17/10","7/4","9/5","15/8","19/10","39/20","2/1","21/10","85/40","11/5","9/4","23/10","12/5","5/2","13/5","27/10","11/4","14/5","29/10","3/1","16/5","10/3","7/2","4/1","9/2","5/1","11/2","6/1","13/2","7/1","15/2","8/1","17/2","9/1","10/1","11/1","12/1","14/1","16/1","18/1","20/1","22/1","25/1","28/1","33/1","40/1","50/1","66/1","100/1"].map(function (f) { var p = f.split("/"); return { s: f, v: p[0] / p[1] }; });
  /* Never round a price up: use the biggest standard fraction that is not above the real price. */
  function toFrac(d) {
    var x = d - 1, best = null;
    FRACS.forEach(function (f) { if (f.v <= x * 1.011 && (!best || f.v > best.v)) best = f; });
    if (!best || (x - best.v) / x > 0.02) return d.toFixed(2);
    return best.s === "1/1" ? "EVS" : best.s;
  }
  function fmtOdds(d) {
    if (!d) return "–";
    if (oddsMode === "dec") return d.toFixed(2);
    if (oddsMode === "us") return d >= 2 ? "+" + Math.round((d - 1) * 100) : "−" + Math.round(100 / (d - 1));
    return toFrac(d);
  }

  /* ---------- time ---------- */
  /* Owner 11 Nov 10:43: ITF / Challenger / UTR tennis runs to an order of play, so the start is shown as a "not before" time. */
  function oop(t) { return t && t.sport === "Tennis" && /\bITF\b|Challenger|UTR/i.test(t.comp || ""); }
  var SITE_TZ = "Europe/London";
  var ALT_LBL = window.BM_PUBLIC ? "your time" : "EAT";
  function ALT(tm, pre, post) { return tm.uk ? (pre || "") + tm.uk + " " + ALT_LBL + (post || "") : ""; }
  function fmtTime(iso) {
    var d = new Date(iso);
    /* Owner 20 Nov 12:43: the site reports in UK time (Europe/London, GMT/BST). EAT stays beside it in small text during the test.
       Property names kept for minimal change: .eat = the MAIN time (UK), .uk = the secondary time (EAT). */
    var day = new Intl.DateTimeFormat("en-GB", { timeZone: SITE_TZ, weekday: "short", day: "numeric", month: "short" }).format(d);
    var hm = { hour: "2-digit", minute: "2-digit", hourCycle: "h23" };
    var main = new Intl.DateTimeFormat("en-GB", Object.assign({ timeZone: SITE_TZ }, hm)).format(d);
    var alt = new Intl.DateTimeFormat("en-GB", Object.assign({ timeZone: "Africa/Kampala" }, hm)).format(d);
    if (window.BM_PUBLIC) { /* Owner 23 Nov 11:10: public site = UK time, plus the visitor's own local time when it differs; no Kampala/EAT */
      alt = ""; try { var lt = new Intl.DateTimeFormat("en-GB", hm).format(d); if (lt !== main) alt = lt; } catch (e) {}
    }
    return { day: day, eat: main, uk: alt };
  }
  function countdown(t) {
    var ms = new Date(t.start) - Date.now();
    if (t.result !== "open") return "";
    if (ms <= 0) return "In play · awaiting result";
    var m = Math.floor(ms / 60000), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mm = m % 60;
    return "Starts in " + (d ? d + "d " + h + "h" : h ? h + "h " + mm + "m" : mm + "m");
  }

  /* ---------- maths ---------- */
  function profit(t) {
    if (t.combo) return t.result === "lost" ? -t.stake : t.result === "open" ? 0 : t.stake * ((t.comboRet || 1) - 1); /* Owner 25 Nov: combos as tips (voids/half legs priced in) */
    /* NAP top-up (Owner 5 Nov rule): extra stake added later at the price then (napTopUp {stake, price}) */
    if (t.napTopUp && !t.ew) { var b = t.stake - t.napTopUp.stake, x = t.napTopUp; return t.result === "won" ? b * (t.price - 1) + x.stake * (x.price - 1) : t.result === "lost" ? -t.stake : 0; }
    if (t.ew) {
      var h = t.stake / 2, pl = h * (t.price - 1) * t.ew.frac;
      return t.result === "won" ? h * (t.price - 1) + pl : t.result === "placed" ? pl - h : t.result === "lost" ? -t.stake : 0;
    }
    /* Asian quarter lines (10 Nov): half-won = half the stake wins, half pushed; half-lost = half the stake lost, half pushed */
    return t.result === "won" ? t.stake * (t.price - 1) : t.result === "lost" ? -t.stake : t.result === "half-won" ? t.stake / 2 * (t.price - 1) : t.result === "half-lost" ? -t.stake / 2 : 0;
  }
  /* Owner 25 Nov 10:56: combos show each leg on its own line, not one long grey line */
  function comboLegsHTML(t) {
    var uk = function (d) { try { return new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" }) + " UK"; } catch (e) { return ""; } };
    return '<ol class="cm-legs">' + t.legs.map(function (l) { return '<li><b>' + esc(l.sel) + '</b> <span class="cm-px">@ ' + fmtOdds(l.price) + '</span><small>' + esc(l.event) + (l.comp ? " \u00b7 " + esc(l.comp) : "") + " \u00b7 " + uk(l.start) + "</small></li>"; }).join("") + "</ol>";
  }
  function edgeOf(t) {
    if (!t.prob) return null;
    var w = t.prob * t.price - 1;
    if (t.ew && t.probPlace) return (w + (t.probPlace * (1 + (t.price - 1) * t.ew.frac) - 1)) / 2;
    return w;
  }
  function stats(list) {
    var s = { n: list.length, open: 0, won: 0, lost: 0, void: 0, staked: 0, profit: 0 };
    list.forEach(function (t) {
      if (t.result === "open") s.open++;
      else if (t.result === "void") s.void++;
      else { var rk = t.result === "placed" || t.result === "half-lost" ? "lost" : t.result === "half-won" ? "won" : t.result; s[rk]++; if (t.result === "placed") s.placed = (s.placed || 0) + 1; if (t.result === "half-won") s.halfWon = (s.halfWon || 0) + 1; if (t.result === "half-lost") s.halfLost = (s.halfLost || 0) + 1; s.staked += t.stake; s.profit += profit(t); } /* Owner 26 Nov: half won counts as a win and half lost as a loss in W-L (they were left out) */
    });
    s.settled = s.won + s.lost;
    s.roi = s.staked ? s.profit / s.staked : null;
    s.strike = s.settled ? s.won / s.settled : null;
    return s;
  }
  function pts(x) { if (x == null) return "–"; var r = Math.round(x * 100) / 100; return (r > 0 ? "+" : r < 0 ? "−" : "") + Math.abs(r).toFixed(2); }
  function pct(x, signed) { if (x == null) return "–"; var r = Math.round(x * 1000) / 10; return (signed && r > 0 ? "+" : r < 0 ? "−" : "") + Math.abs(r).toFixed(1) + "%"; }
  function cls(x) { return x > 0.0001 ? "pos" : x < -0.0001 ? "neg" : ""; }
  /* Owner 24 Nov 19:52: Bet Value Checker on price-based picks only (NCM tips, Combo Meister, Acca Meister; TOM/OCM/OAM keep stats only, 46.005).
     Fair price = 1 / our fair chance. The punter types the price they can get and sees value v fair. */
  /* ON/OFF SWITCH for the whole Bet Value Checker: set to false to remove the menu item and every card panel/line (and drop "value" from PAGES in com/live_build.py to remove the page). */
  var VALUE_CHECKER = true;
  function vcMulti(a) { return VALUE_CHECKER && !(a.human || a.meister === "tom" || a.meister === "meister"); }
  function vcRow(ch, px, lbl) {
    if (!VALUE_CHECKER || !ch || !px) return "";
    var fair = 1 / ch, from = Math.ceil(fair * 100 - 1e-9) / 100;
    return '<div class="vcheck" data-ch="' + ch + '"><div class="vc-top"><span class="vc-lab">Value check</span><span class="vc-fair">Fair price <b>' + fair.toFixed(2) + '</b> \u00b7 value above that</span></div>' +
      '<div class="vc-row"><label class="vc-lbl">Your price <input class="vc-in" type="number" inputmode="decimal" step="0.01" min="1.01" placeholder="' + (+px).toFixed(2) + '" aria-label="The decimal price you can get' + (lbl ? " for " + esc(lbl) : "") + '"></label><span class="vc-out" aria-live="polite">Type the price you can get</span></div>' +
      '<a class="vc-more" href="/value">Check any bet \u2192</a></div>';
  }
  function vcLine(ch, ref) { if (!VALUE_CHECKER) return ""; var fair = 1 / ch, from = Math.ceil(fair * 100 - 1e-9) / 100; return '<p class="vc-line">Fair price <b>' + fair.toFixed(2) + '</b> \u00b7 value above that \u00b7 <a href="/value#' + ref + '">check your price \u2192</a></p>'; }
  function vcTip(t) { return t.result === "open" && new Date(t.start) > Date.now() && (t.meister === "cruncher" || t.meister === "ncmp") && t.prob && !t.ew ? vcLine(t.prob, "t-" + t.id) : ""; }
  document.addEventListener("input", function (e) {
    var t = e.target; if (!t || !t.classList || !t.classList.contains("vc-in")) return;
    var box = t.closest(".vcheck"), ch = +box.getAttribute("data-ch"), p = parseFloat(t.value), o = box.querySelector(".vc-out");
    if (!(p > 1)) { o.className = "vc-out"; o.textContent = "Type the price you can get"; return; }
    var v = p * ch - 1;
    o.className = "vc-out " + (v >= 0.02 ? "good" : v >= -0.02 ? "ok" : "bad");
    o.textContent = (v >= 0 ? "Value " : "Below fair ") + pct(v, true) + (v >= 0.02 ? " \u00b7 still worth taking" : v >= -0.02 ? " \u00b7 about fair" : " \u00b7 the bookmaker keeps " + (Math.round(-v * 1000) / 10) + "p of every \u00a31");
  });
  function byStart(a, b) { return new Date(a.start) - new Date(b.start); }
  function isRemoved(t) { return t.meister === "removed"; }
  function closeStrip() {
    var L = BM.CLOSE || [], s = stats(L);
    var openL = L.filter(function (t) { return t.result === "open"; }).sort(byStart), done = L.filter(function (t) { return t.result !== "open"; }).sort(byStart).reverse();
    var row = function (t) { var tm = fmtTime(t.start), p = t.result === "open" ? null : profit(t);
      return '<li><span class="cm-when">' + (t.result === "open" ? tm.day + " " + tm.eat : '<span class="res ' + t.result + '"' + resTitle(t) + '>' + resTxt(t) + "</span>") + '</span><span class="cm-sel"><b>' + esc(t.selection) + "</b> " + fmtOdds(t.price) + ' <small>' + esc(t.sport) + " · " + esc(t.event) + (t.edgeNote ? " · " + esc(t.edgeNote) : "") + "</small></span>" + (p == null ? "" : '<span class="num pts ' + cls(p) + '">' + pts(p) + "</span>") + "</li>"; };
    return '<section class="close-strip" id="close" aria-labelledby="h-close"><div class="cm-head"><span class="avatar close" aria-hidden="true">CM</span><div><h3 id="h-close">The Close Meister <small>tracking only</small></h3><p class="cm-sub">Near misses: selections that came within 2 points of our edge floor at two or more UK bookmakers. Notional 0.5 pt each, kept out of every total. It shows whether our floor is too strict.</p></div><p class="cm-sum">' + (L.length ? "Record <b>" + s.won + "–" + s.lost + '</b> · <b class="pts ' + cls(s.profit) + '">' + pts(s.profit) + " pts</b> · ROI " + pct(s.roi, true) + " · " + s.open + " open" : "Starts today") + "</p></div>" +
      (openL.length || done.length ? '<div class="cm-body' + (done.length ? " has-chart" : "") + '"><ul class="cm-list">' + openL.slice(0, 10).map(row).join("") + done.slice(0, 6).map(row).join("") + "</ul>" +
        /* Owner 3 Nov: test graph in the lower-right corner, shown once the first Close Meister tips settle */
        (done.length ? '<div class="cm-chart"><p class="cm-chart-h">Running profit (notional pts)</p><div data-cm-chart></div></div>' : "") + "</div>" : "") + "</section>";
  }
  function drawCloseCharts() { $$("[data-cm-chart]").forEach(function (el) { cumChart(el, BM.CLOSE || [], MCOLOR.close); }); }
  function active() { return TIPS.filter(function (t) { return !isRemoved(t); }); }
  /* Owner 5 Nov 10:34: during the test, In play and Upcoming show only Phase 2 (new-rule) tips. Phase 1 tips stay in the data, the stats, the charts and the Ledger. */
  function isP2(t) { return t.phase === 2; }
  function open() { return TIPS.filter(function (t) { return t.result === "open" && !isRemoved(t) && isP2(t) && !isRetired(t); }).sort(byStart); } /* Owner 9 Nov 08:15: retired Fine Margins tips are hidden from In play and Next tips; they still settle and count in the totals */
  function isLive(t) { return t.result === "open" && new Date(t.start) <= Date.now(); }
  function upcoming() { return open().filter(function (t) { return !isLive(t); }); }
  function live() { return open().filter(isLive); }
  function dayKey(iso) { return new Intl.DateTimeFormat("en-CA", { timeZone: SITE_TZ }).format(new Date(iso)); } /* Owner 20 Nov 12:43: every day boundary is the UK day */
  function ipScore(t) {
    // live scores switched off on the site 31 Oct: they only updated at each pass, so they went stale
    var race = /racing/i.test(t.sport) || t.betType === "Each way";
    return '<span class="ip-score none">' + (race ? "Result posted when the race is settled" : "Result posted when the match is settled") + '</span><span class="ip-more">Full tip and published time</span>';
  }
  function inPlayList(list) {
    return '<ul class="inplay-list">' + list.map(function (t) {
      var tm = fmtTime(t.start), lock = locked(t);
      /* Owner 6 Nov 09:47: in-play rows open to the full tip card (event, market, price, chance, published time) */
      return '<li><details><summary><span class="live-dot" aria-hidden="true"></span>' +
        '<span class="ip-time"><b>' + tm.eat + '</b> UK' + ALT(tm, "<small>", "</small>") + "</span>" +
        '<span class="ip-main"><span class="ip-sel">' + (lock ? "Pro tip · subscribers only" : selHTML(t)) + '</span><span class="ip-ev">' + esc(t.event) + " · " + esc(t.sport) + (t.comp && t.comp !== t.sport ? " · " + esc(t.comp) : "") + "</span>" + ipScore(t) + "</span>" +
        '<span class="ip-tier">' + tierPill(t) + "</span>" +
        '<span class="ip-who">' + whoTag(t.meister) + secTag(t) + "</span>" +
        '<span class="ip-num"><b>' + (lock ? "–" : fmtOdds(t.price)) + "</b>" + stakeLbl(t) + "</span></summary>" + '<div class="ip-body"><ul class="htips one">' + homeTip(t) + "</ul></div></details></li>";
    }).join("") + "</ul>";
  }
  /* Owner 12 Nov 12:45: accas in play (a leg has started, none lost, a leg still to finish) show with the in-play tips */
  function accasLive() {
    var now = Date.now();
    return (BM.ACCAS || []).filter(function (a) { return a.legs.some(function (l) { return new Date(l.start).getTime() <= now; }) && a.legs.every(function (l) { return l.result !== "lost"; }) && a.legs.some(function (l) { return !l.result || l.result === "open"; }); });
  }
  /* Owner 16 Nov 11:05 (flow): combos in play sit with the tips and accas in the one home In play section */
  function combosLive() { var now = Date.now(); return (BM.COMBOS || []).filter(function (a) { return a.legs.some(function (l) { return new Date(l.start).getTime() <= now; }) && a.legs.every(function (l) { return l.result !== "lost"; }) && a.legs.some(function (l) { return !l.result || l.result === "open"; }); }); }
  function isOCM(a) { return a.meister === "tom" || a.meister === "meister"; }
  function comboLiveRow(a) {
    var now = Date.now(), P = a.legs.reduce(function (m, l) { return m * l.price; }, 1);
    var won = a.legs.filter(function (l) { return /won|void/.test(l.result || ""); }).length, playing = a.legs.filter(function (l) { return (!l.result || l.result === "open") && new Date(l.start).getTime() <= now; }).length, toCome = a.legs.filter(function (l) { return new Date(l.start).getTime() > now; }).length;
    return '<a class="ip-acca ip-combo" href="/tips#' + esc(a.id) + '"><span class="live-dot" aria-hidden="true"></span><span class="ip-a-t"><b>' + (a.legs.length === 2 ? "Double" : "Treble") + " @ " + accaOdds(P) + '</b><small>' + won + " landed · " + playing + " in play · " + toCome + " to come · still alive</small></span>" + '<span class="badge combo' + (isOCM(a) ? " tom" : "") + '" title="' + (isOCM(a) ? "Original Combo Meister" : "Combo Meister") + '">' + (isOCM(a) ? "OC" : "CM") + '</span><span class="ip-a-go">Every leg →</span></a>';
  }
  function accaLiveRow(a) {
    var now = Date.now(), P = a.legs.reduce(function (m, l) { return m * l.price; }, 1);
    var won = a.legs.filter(function (l) { return /won|void/.test(l.result || ""); }).length, playing = a.legs.filter(function (l) { return (!l.result || l.result === "open") && new Date(l.start).getTime() <= now; }).length, toCome = a.legs.filter(function (l) { return new Date(l.start).getTime() > now; }).length;
    return '<a class="ip-acca" href="/acca#' + esc(a.id) + '"><span class="live-dot" aria-hidden="true"></span><span class="ip-a-t"><b>' + a.legs.length + "-fold acca @ " + accaOdds(P) + '</b><small>' + won + " landed · " + playing + " in play · " + toCome + " to come · still alive</small></span>" + '<span class="badge acca" title="Acca Meister">AM</span><span class="ip-a-go">Every leg →</span></a>';
  }
  function inPlaySection(sec, el, countEl, max) {
    /* Owner 13 Nov 09:46: accas in play live on the Accas page only; home and Tips show tips in play */
    /* Owner 16 Nov 11:05 (flow): on the home page ONE In play section holds tips, combos and accas; the Tips page stays tips only */
    /* Owner 17 Nov 10:13: accas and combos in play live on the Accas and Combos pages only; home In play = tips only */
    var multi = false;
    var l = applyFilt(live()).sort(byStart).reverse(), A = multi ? accasLive() : [], C = multi ? combosLive() : [];
    if (!sec) return;
    sec.hidden = !l.length && !A.length && !C.length;
    if (countEl) countEl.textContent = l.length + A.length + C.length;
    /* Owner 12 Nov 12:45: nothing vanishes between the off and the result; the home strip shows the first few and expands in place */
    var tipsH = l.length ? (max && l.length > max ? inPlayList(l.slice(0, max)) + '<div class="ip-rest" hidden>' + inPlayList(l.slice(max)) + '</div><button type="button" class="inplay-more ip-toggle">Show all ' + l.length + " tips in play ▾</button>" : inPlayList(l)) : "";
    var accH = A.length ? '<div class="ip-accas"><p class="ip-sub">Accas in play · ' + A.length + "</p>" + A.map(accaLiveRow).join("") + "</div>" : "";
    var cmbH = C.length ? '<div class="ip-accas ip-combos"><p class="ip-sub">Combos in play · ' + C.length + "</p>" + C.map(comboLiveRow).join("") + "</div>" : "";
    if (multi && l.length) tipsH = '<p class="ip-sub ip-sub-tips">Tips in play · ' + l.length + "</p>" + tipsH;
    el.innerHTML = tipsH + cmbH + accH;
    var tg = el.querySelector(".ip-toggle");
    if (tg) tg.addEventListener("click", function () { var r = el.querySelector(".ip-rest"), open = r.hidden; r.hidden = !open; tg.textContent = open ? "Show fewer ▴" : "Show all " + l.length + " tips in play ▾"; });
  }
  window.BMAccaLive = { list: accasLive, row: accaLiveRow };
  function settled() { return TIPS.filter(function (t) { return t.result !== "open" && !isRetired(t); }).sort(byStart); } /* Owner 9 Nov: retired Fine Margins not listed */
  function stakeTxt(s) { return s + (s === 1 ? " pt" : " pts"); }
  function stakeLbl(t) { return t.ew ? stakeTxt(t.stake / 2) + " e/w" : stakeTxt(t.stake); }
  function stakeHTML(t) { return t.ew ? '<span class="ew-wrap">' + stakeTxt(t.stake / 2) + '<small class="ew-under">e/w</small></span>' : stakeTxt(t.stake); }

  /* ---------- shared bits ---------- */
  /* Owner 20 Nov 09:34: NCM is the product we sell, so NCM tips say NCM Free / NCM Pro; TOM tips stay Free */
  function tierWord(t) { var w = t.tier === "pro" ? "Pro" : "Free"; return t.meister === "cruncher" ? "NCM " + w : t.meister === "ncmr" ? "NCMR " + w : t.meister === "ncmp" ? "NCMP " + w : t.meister === "combo" ? "Combo" : w; }
  function tierPills(t) {
    var h = '<span class="tier ' + t.tier + (t.meister === "ncmr" ? " ncmr" : t.meister === "ncmp" ? " ncmp" : t.meister === "combo" ? " combo" : "") + '">' + miniShield() + tierWord(t) + "</span>";
    if (t.nap) h += ' <span class="tier nap">' + miniShield() + "NAP</span>";
    if (t.humanNap) h += ' <span class="tier hnap">' + miniShield() + "NAP \u00b7 TOM</span>";
    if (false && isPremium(t)) h += ' <span class="tier premium" title="A Premium League tip: top European leagues, UEFA cups and international tournaments">' + miniShield() + "Premium League</span>"; /* Owner 20 Nov 20:14: Premium League tag, own colour, added on top of every other tag */ /* Owner 19 Nov 10:51: The Original Meister's own NAP, own label and colour */
    if (t.value) h += ' <span class="tier value">' + miniShield() + "Best Value</span>";
    if (t.special) h += ' <span class="tier special">' + miniShield() + "Meister Special</span>";
    if (t.proPick) h += ' <span class="tier propick">' + miniShield() + "Pro Pick</span>";
    if (t.tag) h += ' <span class="tier tag">' + esc(t.tag) + "</span>";
    return h;
  }
  function extraTags(t) {
    var h = "";
    if (t.nap) h += '<span class="mini-tag nap">NAP</span>';
    if (t.humanNap) h += '<span class="mini-tag hnap" title="The Original Meister\u2019s own NAP of the day: picked by The Original Meister, no AI input; stats added after publication">NAP \u00b7 TOM</span>';
    if (false && isPremium(t)) h += '<span class="mini-tag premium" title="Premium League: top European leagues, UEFA cups and international tournaments">Premium League</span>';
    /* Owner 20 Nov 17:45: TOM is TOM, no separate Human tag (AHT, the AI Hybrid TOM, is retired) */
    if (t.value) h += '<span class="mini-tag value">Best Value</span>';
    if (t.special) h += '<span class="mini-tag special">Meister Special</span>';
    if (t.proPick) h += '<span class="mini-tag propick" title="One of the day\u2019s five Pro Picks (Pro only; never a NAP or Special)">Pro Pick</span>';
    if (t.keithAgrees) h += '<span class="mini-tag agree" title="The Original Meister backs this tip too: the human and the maths agree">TOM agrees</span>';
    if (t.draft) h += '<span class="mini-tag plain" title="The Original Meister took this from the stats draft">Stats draft</span>';
    if (t.postponed && t.result === "open") h += '<span class="mini-tag postponed">' + (t.originalStart ? "Rescheduled" : "Postponed") + "</span>";
    if (isRemoved(t)) h += '<span class="mini-tag removed">The Drift Meister</span>';
    if (t.shortened && !isRemoved(t)) h += '<span class="mini-tag shortened" title="The price shortened after we tipped it and the exchanges still rate the published price as value">Shortened</span>';
    if (t.liquidity === "thin" && t.result === "open" && !isRemoved(t)) h += '<span class="mini-tag thin" title="Only small stakes are likely to be matched or accepted">Small stakes</span>';
    var e = edgeOf(t), tag = t.tag || (e != null && e > -0.02 && e < 0.02 && t.meister !== "ncmp" ? "Fair price" : ""); /* Owner 25 Nov: NCMP small edges are positive edges, never tagged Fair price */
    if (tag) h += '<span class="mini-tag plain">' + esc(tag) + "</span>";
    return h;
  }
  function selHTML(t) {
    return (t.cloth ? '<span class="cloth" title="Saddle-cloth number' + (t.draw ? ", drawn " + t.draw : "") + '">' + t.cloth + "</span>" : "") + esc(t.selection) + (t.draw ? ' <span class="draw-no">(draw ' + t.draw + ")</span>" : "");
  }
  /* Owner 20 Nov 09:24: Free v Pro compares NCM only (The Original Meister is always free and has his own boxes); labels NCM Free / NCM Pro. Totals unchanged. */
  function isNF(t) { return t.tier === "free" && t.meister === "cruncher"; }
  function isNP(t) { return t.tier === "pro" && t.meister === "cruncher"; }
  function tierPill(t) { return '<span class="tier ' + t.tier + (t.meister === "ncmr" ? " ncmr" : t.meister === "ncmp" ? " ncmp" : t.meister === "combo" ? " combo" : "") + '">' + miniShield() + tierWord(t) + "</span>"; }
  /* Owner 5 Nov 10:42: show the Meister section (e.g. TOMT) and the sport clearly on every tip since 5 November */
  var SEC_SPORT = { F: "Football", R: "Racing", T: "Tennis", B: "Basketball", U: "US sports", O: "Other sports", E: "eSports" };
  var SEC_PRE = { combo: "CM", ncmp: "NCMP", tomret: "TOM", ncmrold: "NCMROLD", tomold: "AHT", meister: "TOM", cruncher: "NCM", ncmr: "NCM", margins: "FMM" };
  function secOf(t) {
    if (t.section) return t.section;
    if (!SEC_PRE[t.meister]) return "";
    var k = t.sport === "Football" ? "F" : t.sport === "Horse racing" ? "R" : t.sport === "Tennis" ? "T" : t.sport === "Basketball" ? "B" : /(^|\u00b7 )(NBA|NHL|NFL|MLB|NCAA|WNBA)/.test(t.comp || "") ? "U" : "O"; /* Owner 7 Nov 08:49: US sports is its own category */
    return SEC_PRE[t.meister] + k;
  }
  function secTag(t) {
    if (t.phase !== 2) return "";
    var c = secOf(t); if (!c) return "";
    var k = t.sport === "Esports" ? "E" : c.slice(-1);
    return '<span class="sec-tag sec-' + k + '" title="' + esc(c) + ": " + esc(meisterById(t.meister).name) + ", " + SEC_SPORT[k] + '">' + (window.BM_PUBLIC ? "" : "<b>" + esc(c) + "</b>") + SEC_SPORT[k] + "</span>" + (t.usTag ? '<span class="sec-tag sec-U us-tag" title="Also counts as a US game"><b>US</b></span>' : "");
  }
  function whoTag(id) {
    var m = meisterById(id);
    return '<a class="who" href="/meisters#' + m.id + '"><span class="badge ' + m.id + '">' + esc(m.initials) + "</span>" + esc(m.short || m.name) + "</a>";
  }
  function locked(t) { return t.tier === "pro" && t.result === "open" && !isRemoved(t) && !hasAccess(t.meister); }
  function shareText(t) {
    var base = locked(t) ? "New BetMeisters Pro tip: " + t.event : (t.nap ? "BetMeisters NAP: " : "BetMeisters tip: ") + (t.cloth ? "No. " + t.cloth + " " : "") + t.selection + " (" + t.event + ") @ " + fmtOdds(t.price);
    return base + (SITE.url ? " " + SITE.url : "");
  }
  function shareButtons(text, light) {
    var e = encodeURIComponent(text);
    return '<div class="share">' +
      '<a class="share-btn" href="https://wa.me/?text=' + e + '" target="_blank" rel="noopener">' + ICON.wa + "WhatsApp</a>" +
      '<a class="share-btn" href="https://twitter.com/intent/tweet?text=' + e + '" target="_blank" rel="noopener">' + ICON.x + "Post on X</a>" +
      '<button type="button" class="share-btn" data-copy="' + esc(text) + '">' + ICON.link + "Copy</button></div>";
  }
  function toast(msg) {
    var el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); el.textContent = msg;
    document.body.appendChild(el); setTimeout(function () { el.remove(); }, 2200);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]"); if (!b) return;
    var text = b.getAttribute("data-copy");
    var done = function () { toast("Copied to clipboard"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text) ? done() : toast("Copy not available here"); });
    } else { fallbackCopy(text) ? done() : toast("Copy not available here"); }
  });
  function fallbackCopy(text) {
    try { var ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); var ok = document.execCommand("copy"); ta.remove(); return ok; } catch (e) { return false; }
  }

  function edgeLine(t) {
    if (!t.prob) return "";
    var e = edgeOf(t);
    var tg = !!t.tomMethod; /* Owner 24 Nov 10:54: TOM data-assisted picks show TOM's own chance and edge, with the public market chance beside them */
    var mid = t.ew && t.probPlace ? '<div><dt>Place</dt><dd>' + pct(t.probPlace) + "</dd></div>" : '<div><dt>Bookmaker</dt><dd>' + pct(1 / t.price) + "</dd></div>";
    return '<div class="tip-numbers"><dl class="edge-line"><div><dt>' + (t.ew ? "Win" : "Chance") + '</dt><dd>' + pct(t.prob) + "</dd></div>" + mid + '<div><dt>' + "Edge" + '</dt><dd class="pts ' + cls(e) + '">' + pct(e, true) + "</dd></div></dl>" +
      (t.minPrice ? '<p class="tip-market tip-take">Take ' + fmtOdds(t.minPrice) + " or bigger</p>" : '<p class="tip-market tip-take">&nbsp;</p>') + exchLine(t) + "</div>";
  }
  function exchLine(t) {
    if (t.result !== "open" || isRemoved(t)) return "";
    if (t.tomMethod) return '<details class="tip-market exch-line tom-how"><summary style="font-size:11.5px !important;font-weight:400;color:inherit;padding:0;min-height:0">How TOM priced it</summary>Chance and edge are TOM\u2019s own: the public market chance (' + pct(t.mktProb) + ') plus his grade ' + esc(t.tomGrade || "") + " (" + (t.tomPoints >= 0 ? "+" : "") + t.tomPoints + " pts). Best price checked on Oddschecker.</details>";
    var lq = { deep: "Big stakes usually fine", medium: "Medium stakes", thin: "Small stakes only" }[t.liquidity] || "";
    if (t.exch) {
      var at = fmtTime(t.exch.at);
      return '<p class="tip-market exch-line"><b>Exchange:</b> ' + fmtOdds(t.exch.price) + " on " + esc(t.exch.src || "Smarkets") + " · £" + Number(t.exch.avail).toLocaleString("en-GB") + " available at " + at.eat + " UK" + (lq ? ' · <span class="lq ' + t.liquidity + '">' + lq + "</span>" : "") + "</p>";
    }
    /* Owner 5 Nov 16:51: every open tip shows an Exchange line (keeps the cards aligned and says where the chance comes from) */
    var lqS = lq ? ' · <span class="lq ' + t.liquidity + '">' + lq + "</span>" : "";
    if (t.fairSrc === "Exchanges") return '<p class="tip-market exch-line"><b>Exchange:</b> chance from Smarkets + Matchbook; bet at the bookmaker price' + lqS + "</p>";
    /* Owner 9 Nov 14:16: checked on Betfair Exchange via the sharp market; exchNone = no current exchange price for this market */
    if (t.exchNone) return '<p class="tip-market exch-line"><b>Exchange:</b> no current Betfair Exchange price; chance from ' + esc(t.fairSrc || "the bookmakers") + ", bookmakers only" + lqS + "</p>";
    if (t.fairSrc) return '<p class="tip-market exch-line"><b>Exchange:</b> not checked; chance from ' + esc(t.fairSrc) + ", bookmakers only" + lqS + "</p>";
    return '<p class="tip-market exch-line"><b>Exchange:</b> no exchange market, bookmakers only' + lqS + "</p>";
  }
  /* ---------- tip card ---------- */
  function removedLine(t) {
    if (t.shortened && !isRemoved(t)) { var sh = t.shortened, st = sh.at ? fmtTime(sh.at) : null;
      return '<p class="removed-note shortened-note">Shortened' + (st ? " by " + st.day + " " + st.eat + " UK" : "") + ": now " + fmtOdds(sh.price) + ", tipped at " + fmtOdds(t.price) + ". The exchanges make the chance " + (sh.chance * 100).toFixed(1) + "%, so the published price still has an edge of " + (sh.edgeAtPublished >= 0 ? "+" : "") + (sh.edgeAtPublished * 100).toFixed(1) + "%. The market agrees with this tip. Settled at the published price.</p>"; }
    if (!isRemoved(t)) return "";
    var by = t.from ? meisterById(t.from) : null, rt = t.removedAt ? fmtTime(t.removedAt) : null;
    return '<p class="removed-note">' + (t.driftKind === "shortened" ? "Price shortened (old rule, to 1 Nov): withdrawn and moved to The Drift Meister" : "Price drifted: moved to The Drift Meister") + (rt ? " " + rt.day + " " + rt.eat + " UK" : "") + (t.removedPrice ? " at " + fmtOdds(t.removedPrice) : "") +
      (t.removedEdge != null ? " (edge " + (t.removedEdge >= 0 ? "+" : "") + (t.removedEdge * 100).toFixed(1) + "%)" : "") + (t.removedReason ? ". " + esc(t.removedReason) : "") +
      (by ? ". Originally " + esc(by.short || by.name) + "." : ".") + " Still settled at the published price.</p>";
  }
  function tipCard(t) {
    var tm = fmtTime(t.start), lock = locked(t);
    var body = lock
      ? '<p class="tip-event">' + esc(t.event) + "</p>" +
        '<div class="tip-locked">' + ICON.lock + '<p>Pro tip from ' + esc(meisterById(t.meister).name) + '. <a href="#join" data-join>Subscribe</a> to this Meister or get Full Meister Access to see it.</p></div>'
      : '<h3 class="tip-sel">' + selHTML(t) + '</h3><p class="tip-event">' + esc(t.event) + '</p><p class="tip-market">' + esc(t.market) + hcpExp(t) + (t.ew ? " (" + (t.stake / 2) + " pts each way = " + stakeTxt(t.stake) + " total)" : "") + (t.bookie ? " · best at " + esc(t.bookie) : "") + "</p>" + (oop(t) && t.result === "open" ? '<p class="tip-market oop-note">Order of play: the start is a "not before" time and often runs later.</p>' : "") + edgeLine(t) + vcTip(t) + removedLine(t);
    var first = t.result === "open"
      ? "<div><dt>" + (oop(t) ? "Not before" : "Start UK") + "</dt><dd>" + tm.eat + "</dd></div>"
      : '<div><dt>Result</dt><dd><span class="res ' + t.result + '"' + resTitle(t) + '>' + resTxt(t) + "</span></dd></div>";
    var third = t.result === "open"
      ? (t.ew ? '<div class="meta-ew"><dt>Stake</dt><dd><span class="ew-wrap">' + stakeTxt(t.stake / 2) + '<small class="ew-under">e/w</small></span></dd></div>' : "<div><dt>Stake</dt><dd>" + stakeTxt(t.stake) + "</dd></div>")
      : '<div><dt>P/L</dt><dd class="pts ' + cls(profit(t)) + '">' + pts(profit(t)) + "</dd></div>";
    var foot = t.result === "open"
      ? '<span class="countdown" data-countdown="' + t.id + '">' + countdown(t) + "</span>"
      : "<span>" + tm.day + " · " + tm.eat + " UK</span>";
    return '<article class="tip" data-tier="' + t.tier + '">' +
      '<div class="tip-head">' + tierPill(t) + whoTag(t.meister) + "</div>" +
      '<div class="tip-body"><div class="tip-chips">' + secTag(t) + '<span class="chip">' + esc(t.sport) + (t.comp && t.comp !== t.sport ? " · " + esc(t.comp) : "") + "</span>" + '<span class="tip-tags">' + extraTags(t) + "</span></div>" + body + "</div>" +
      '<dl class="tip-meta" style="margin:0">' + first +
      "<div><dt>Price</dt><dd>" + (lock ? "–" : fmtOdds(t.price)) + "</dd></div>" + third + "</dl>" +
      '<div class="tip-foot">' + foot + "<span>" + tm.day + " · " + (tm.uk ? tm.uk + " " + ALT_LBL : tm.eat + " UK") + "</span></div>" + pubLine(t) + "</article>";
  }
  /* Owner 6 Nov 09:33: the published time matters, so every tip shows when it went up and how far ahead of the start */
  function leadH(t) { return t.published ? (new Date(t.start) - new Date(t.published)) / 3600000 : null; }
  function leadTxt(h) { if (h == null) return ""; if (h < 1) return Math.round(h * 60) + " min"; if (h < 48) return (Math.round(h * 10) / 10) + " h"; return Math.round(h / 24) + " days"; }
  function pubLine(t) {
    if (!t.published) return "";
    var p = fmtTime(t.published);
    return '<p class="tip-pub">Published ' + p.day + " · " + p.eat + " UK · " + leadTxt(leadH(t)) + " before the start</p>";
  }

  /* ---------- scorecards ---------- */
  function clvLine(list) {
    var c = list.filter(function (t) { return typeof t.close === "number" && t.result !== "open" && t.result !== "void"; });
    if (!c.length) return "";
    var beat = c.filter(function (t) { return t.close < t.price; }), pb = 0;
    beat.forEach(function (t) { pb += profit(t); });
    return '<p class="clv-line"><b>Beat the starting / closing price on ' + beat.length + " of " + c.length + "</b> settled tips (" + Math.round(beat.length / c.length * 100) + "%), worth " + pts(pb) + " pts at the published price. Get on early for the best odds.</p>";
  }
  /* Owner 14 Nov 10:29: CLV is THE measure from now. CLV = published price x Pinnacle's closing fair chance - 1 (the edge still there at the off).
     Counted only where the close is matched to the same market; anything beyond +/-30% is treated as a mismatched market and left out. Racing is v SP, shown separately. */
  function clvOf(t) { return typeof t.clv === "number" && Math.abs(t.clv) <= 0.3 ? t.clv : null; }
  function clvStats(list) { var c = list.filter(function (t) { return t.result !== "void" && clvOf(t) != null; }), sum = 0, beat = 0; c.forEach(function (t) { sum += clvOf(t); if (clvOf(t) > 0) beat++; }); return { n: c.length, avg: c.length ? sum / c.length : null, beat: c.length ? beat / c.length : null }; }
  function clvTxt(v) { return v == null ? "\u2013" : (v >= 0 ? "+" : "\u2212") + Math.abs(v * 100).toFixed(1) + "%"; }
  /* Owner 14 Nov 10:29: PREMIUM LEAGUES = senior men's football in the big European leagues, the three UEFA club competitions and the major international tournaments and their qualifiers (no friendlies, no youth, no women's) */
  var PREM_DOM = /^(England[ \u00b7-]+(Premier League|Championship)$|Spain[ \u00b7-]+La ?Liga$|Italy[ \u00b7-]+Serie A$|Germany[ \u00b7-]+Bundesliga$|France[ \u00b7-]+Ligue 1$|Portugal[ \u00b7-]+(Primeira Liga|Liga Portugal)$|Netherlands[ \u00b7-]+Eredivisie$|Scotland[ \u00b7-]+Premiership$)/i;
  var PREM_EU = /^(International Clubs[ \u00b7-]+)?(UEFA[ \u00b7-]+)?(UEFA )?(Champions League|Europa League|Conference League|Europa Conference League)\b/i;
  var PREM_INT = /^International[ \u00b7-]+(UEFA Nations League|CONCACAF Nations League|World Cup|FIFA World Cup|European Championship|Euro 20|Africa Cup of Nations|Copa Am|Asian Cup|AFC Asian Cup|Gold Cup)/i;
  /* Owner 20 Nov 10:45: Premium Leagues widened for NEW picks only (published from 20 Nov 10:45): EFL League One/Two, Belgian Pro League, Turkish Super Lig;
     major domestic cups (FA Cup, Copa del Rey, Coupe de France, DFB-Pokal, Coppa Italia) from the last 32 are flagged per tip (premium: true). Older tips keep the old list. */
  var PREM_NEW = /^(England[ \u00b7-]+(League One|League Two)$|Belgium[ \u00b7-]+(Pro League|Jupiler Pro League|First Division A)$|Turkey[ \u00b7-]+(Super Lig|S\u00fcper Lig)$)/i;
  function isPremium(t) { if (typeof t.premium === "boolean") return t.premium; var c = t.comp || ""; if (!/football/i.test(t.sport || "") || /women|u1\d|u2\d|youth|friendl|reserve/i.test(c + " " + (t.event || ""))) return false; return PREM_DOM.test(c) || PREM_EU.test(c) || PREM_INT.test(c) || (String(t.published || "") >= "2026-11-20T10:45" && PREM_NEW.test(c)); }
  function scoreCard(name, list, opts) {
    opts = opts || {};
    var s = stats(list), recent = list.filter(function (t) { return t.result !== "open"; }).sort(byStart).slice(-12);
    var head = '<span class="score-mark' + (opts.tier ? " " + opts.tier : " all") + '" aria-hidden="true">' + shield(opts.color || (opts.tier ? TIER_COLOR[opts.tier] : TIER_COLOR.pro)) + "</span>";
    var title = '<div class="score-title"><h3 class="score-name' + (name.length > 12 ? " long" : "") + '">' + esc(name) + (opts.tag ? ' <span class="score-tag" title="' + esc(opts.tagTitle || "") + '">' + esc(opts.tag) + "</span>" : "") + "</h3>" + (opts.sub ? '<p class="score-sub">' + esc(opts.sub) + "</p>" : "") + "</div>";
    if (!list.length) {
      var none = name === "NAP" ? "No NAPs yet" : name.indexOf(" · ") > 0 ? "No tips yet" : "No " + name + " tips yet";
      return '<section class="score empty-score' + (opts.all ? " all" : "") + '" aria-label="' + esc(name) + ' scorecard">' +
        '<div class="score-top">' + title + head + "</div>" +
        '<p class="score-empty">' + none + "</p>" +
        '<p class="score-why">' + (name === "NAP" ? "One a day, always Pro." : "The record starts with the first tip.") + "</p>" +
        "<div></div><p class=\"score-note\">0 open · 0 void</p></section>";
    }
    return '<section class="score' + (opts.all ? " all" : "") + '" style="--sc:' + (opts.color || (opts.tier ? TIER_COLOR[opts.tier] : TIER_COLOR.pro)) + '" aria-label="' + esc(name) + ' scorecard">' +
      '<div class="score-top">' + title + head + "</div>" +
      '<p class="score-big pts ' + cls(s.profit) + '">' + pts(s.profit) + "<small>pts</small></p>" +
      '<dl class="kv"><div><dt>Won–Lost</dt><dd>' + s.won + "–" + s.lost + "</dd></div><div><dt>ROI</dt><dd>" + pct(s.roi, true) + "</dd></div><div><dt>Strike</dt><dd>" + pct(s.strike) + "</dd></div><div><dt>CLV</dt><dd>" + (function () { var c = clvStats(list); return c.n ? '<span class="pts ' + cls(c.avg) + '">' + clvTxt(c.avg) + "</span> <small>(" + c.n + ")</small>" : "\u2013"; })() + "</dd></div></dl>" +
      '<div class="wl-wrap"><div class="wl" aria-label="Last 12 results, oldest on the left, latest on the right">' + (recent.length ? recent.map(function (t, i) { return '<i class="' + t.result + (i === recent.length - 1 ? " latest" : "") + '" title="' + esc(t.selection) + ": " + resTxt(t) + " (" + fmtTime(t.start).day + ')"></i>'; }).join("") + '</div><div class="wl-key"><span>latest &rarr;</span></div>' : '<span class="score-note">No settled tips yet</span></div>') + "</div>" +
      '<p class="score-note">' + s.open + " open · " + s.void + " void</p>" +
      "</section>";
  }
  var REC_KEY = '<p class="rec-key"><b>Won–Lost</b> counts settled tips: 2–1 means two winners and one loser. An each-way tip that only places counts as lost, even though it can still return points. Voids and tips still to run are not counted. <b>ROI</b> is points won or lost ÷ points staked. <b>Strike</b> is the share of settled tips that won.</p>';
  function tierScores(list) {
    return '<div class="score-grid">' +
      scoreCard("All tips", list, { all: true, sub: "Every tier" }) +
      scoreCard("NCM Free", list.filter(isNF), { tier: "free" }) +
      scoreCard("NCM Pro", list.filter(isNP), { tier: "pro" }) +
      scoreCard("NAP", list.filter(function (t) { return t.nap; }), { tier: "nap" }) +
      scoreCard("Best Value", list.filter(function (t) { return t.value; }), { tier: "value" }) + "</div>" + REC_KEY;
  }

  var boardMM = load("boardmm", "without");
  function scoreBoard(el) {
    var withMM = boardMM === "with", base = withMM ? withAll() : active();
    var mm = TIPS.filter(isRemoved);
    var lab = function (f) { return base.filter(f); };
    var segBtn = function (v, txt) { return '<button type="button" data-boardmm="' + v + '" aria-pressed="' + (boardMM === v) + '">' + txt + "</button>"; };
    el.innerHTML =
      '<h3 class="board-h">Totals</h3>' +
      '<div class="score-grid g3 g2">' +
        scoreCard("With The Drift and Close Meisters", withAll(), { all: true, sub: "Every tip, including The Drift Meister (tips we withdrew when the price drifted) and The Close Meister (near misses, notional 0.5 pt)" }) +
        scoreCard("Without The Drift and Close Meisters", active(), { all: true, sub: "The main record: The Original, Number Cruncher and Fine Margins Meisters" }) +
      "</div>" +
      '<div class="board-bar"><h3 class="board-h">By label</h3><span class="board-seg"><span class="seg-label">The Drift and Close Meisters</span><span class="seg seg-light" role="group">' + segBtn("without", "Without") + segBtn("with", "With") + "</span></span></div>" +
      '<div class="score-grid">' +
        scoreCard("NCM Free", lab(isNF), { tier: "free", sub: withMM ? "With The Drift and Close Meisters" : "Without The Drift and Close Meisters" }) +
        scoreCard("NCM Pro", lab(isNP), { tier: "pro", sub: withMM ? "With The Drift and Close Meisters" : "Without The Drift and Close Meisters" }) +
        scoreCard("NAP", lab(function (t) { return t.nap; }), { tier: "nap", sub: "NCM's most confident selection (the stats)" }) +
        scoreCard("Best Value", lab(function (t) { return t.value; }), { tier: "value", sub: withMM ? "With The Drift and Close Meisters" : "Without The Drift and Close Meisters" }) +
        scoreCard("Meister Special", lab(function (t) { return t.special; }), { tier: "special", sub: "Highest edge, from any Meister" }) +
      "</div>" +
      '<h3 class="board-h">By Meister</h3>' +
      '<div class="score-grid g5">' + MEISTERS.map(function (m) {
        return scoreCard(MSHORT[m.id] || m.name, TIPS.filter(function (t) { return t.meister === m.id; }), { color: MCOLOR[m.id], sub: MSUB[m.id] });
      }).join("") + scoreCard(MSHORT.close, BM.CLOSE || [], { color: MCOLOR.close, sub: "Near misses, notional 0.5 pt" }) + "</div>" + REC_KEY;
    $$("[data-boardmm]", el).forEach(function (b) { b.addEventListener("click", function () { boardMM = b.getAttribute("data-boardmm"); save("boardmm", boardMM); scoreBoard(el); }); });
  }
  function meisterCharts(el) {
    var ms = MEISTERS.concat([CM]), src = function (id) { return id === "close" ? (BM.CLOSE || []) : TIPS.filter(function (t) { return t.meister === id; }); };
    /* Owner 3 Nov: row 1 The Original Meister; row 2 Number Cruncher + Fine Margins; row 3 The Drift + The Close Meister */
    el.innerHTML = '<div class="chart-grid five">' + ms.map(function (m) {
      return '<div class="panel mchart"><div class="mchart-h"><span class="mdot" style="background:' + MCOLOR[m.id] + '"></span><h3>' + esc(m.name) + (m.id === "close" ? ' <small class="mchart-note">tracking only, from 3 Nov</small>' : "") + '</h3></div><div class="mc" data-mc="' + m.id + '"></div></div>';
    }).join("") + "</div>";
    ms.forEach(function (m) { cumChart($('[data-mc="' + m.id + '"]', el), src(m.id), MCOLOR[m.id]); });
    var cmEl = $('[data-mc="close"]', el), cmS = stats(BM.CLOSE || []);
    if (cmEl && !cmS.settled && !cmS.void) cmEl.innerHTML = '<p class="empty">0.00 pts so far · ' + cmS.open + ' open. The line starts with the first settled Close Meister tip (tracking began 3 Nov).</p>';
  }
  function totalsChart(el) {
    multiChart(el, [
      { name: "Total with The Drift and Close Meisters", color: "#7A8396", dash: "6 4", test: function () { return true; } },
      { name: "Total without The Drift and Close Meisters", color: "var(--chart-line)", test: function (t) { return !isRemoved(t) && t.meister !== "close"; } }
    ], withAll());
  }
  function allMeistersChart(el) {
    multiChart(el, MEISTERS.map(function (m) { return { name: MSHORT[m.id], color: MCOLOR[m.id], test: function (t) { return t.meister === m.id; } }; })
      .concat([{ name: MSHORT.close, color: MCOLOR.close, from: CM_FROM, test: function (t) { return t.meister === "close"; } }]), withAll());
  }
  function multiChart(el, series, pool) {
    var list = (pool || TIPS).filter(function (t) { return t.result !== "open"; }).sort(byStart);
    if (!list.length) { el.innerHTML = '<p class="empty">The profit lines start with the first settled tip.</p>'; return; }
    var W = Math.max(320, Math.round(el.clientWidth || 600)), H = el.getAttribute("data-h") ? Math.min(+el.getAttribute("data-h"), Math.round(W * 0.55)) : W > 700 ? 300 : Math.round(W * 0.55), L = 50, R = 80, T = 14, B = 30;
    if (!el.__bmMResize) { el.__bmMResize = true; var rt2; window.addEventListener("resize", function () { clearTimeout(rt2); rt2 = setTimeout(function () { multiChart(el, series, pool); }, 150); }); }
    var vals = series.map(function (sr) { var run = 0; return [0].concat(list.map(function (t) { if (sr.test(t)) run += (sr.pf || profit)(t); return run; })); });
    var all = [].concat.apply([0], vals), lo = Math.min.apply(null, all), hi = Math.max.apply(null, all);
    var step = niceStep((hi - lo) || 1); lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step; if (hi === lo) hi = lo + step;
    var n = list.length;
    var x = function (i) { return L + (W - L - R) * i / n; }, y = function (v) { return T + (H - T - B) * (hi - v) / (hi - lo); };
    var grid = "", v;
    for (v = lo; v <= hi + 1e-9; v += step) grid += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '" style="stroke:var(--grid)" stroke-width="' + (Math.abs(v) < 1e-9 ? 1.5 : 1) + '"/><text class="axis" x="' + (L - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + pts(v).replace("+0.00", "0").replace("−0.00", "0") + "</text>";
    var ends = series.map(function (sr, k) { return { k: k, y: y(vals[k][n]), v: vals[k][n] }; }).sort(function (a, b) { return a.y - b.y; });
    for (var i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 16) ends[i].y = ends[i - 1].y + 16;
    var paths = series.map(function (sr, k) {
      /* a series with "from" (The Close Meister) starts at the first settled tip on or after that date */
      var si = 0; if (sr.from) { var f0 = new Date(sr.from); while (si < n && new Date(list[si].start) < f0) si++; }
      var d = vals[k].map(function (val, i) { return i < si ? "" : (i === si ? "M" : "L") + x(i).toFixed(1) + " " + y(val).toFixed(1); }).join(" ");
      return '<path d="' + d + '" fill="none" style="stroke:' + sr.color + '" stroke-width="' + (sr.faint ? 1.75 : 2.5) + '"' + (sr.faint ? ' stroke-opacity="0.6"' : "") + ' stroke-linejoin="round"' + (sr.dash ? ' stroke-dasharray="' + sr.dash + '"' : "") + "/>" +
        '<circle cx="' + x(n) + '" cy="' + y(vals[k][n]) + '" r="5" style="fill:' + sr.color + '"/>';
    }).join("");
    var labels = series.length > 6 ? "" : ends.map(function (e) { var sr = series[e.k]; return '<text x="' + (x(n) + 10) + '" y="' + (e.y + 5) + '" style="fill:' + sr.color + ';font:700 13px var(--f-data)">' + pts(e.v) + "</text>"; }).join("");
    var legend = '<div class="mlegend">' + series.map(function (sr, k) { return '<span><i style="background:' + sr.color + (sr.dash ? ";background:repeating-linear-gradient(90deg," + sr.color + " 0 6px,transparent 6px 10px)" : "") + '"></i>' + esc(sr.name) + " <b class=\"pts " + cls(vals[k][n]) + '">' + pts(vals[k][n]) + "</b></span>"; }).join("") + "</div>";
    el.innerHTML = '<div class="chart-wrap"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Running profit lines: ' + esc(series.map(function (sr, k) { return sr.name + " " + pts(vals[k][n]); }).join(", ")) + '">' + grid + paths + labels +
      '<text class="axis" x="' + L + '" y="' + (H - 8) + '">' + fmtTime(list[0].start).day + '</text><text class="axis" x="' + (W - R) + '" y="' + (H - 8) + '" text-anchor="end">' + fmtTime(list[n - 1].start).day + "</text>" +
      '<line class="xh" x1="0" x2="0" y1="' + T + '" y2="' + (H - B) + '" style="stroke:var(--ink-3)" stroke-dasharray="3 3" visibility="hidden"/><rect x="' + L + '" y="0" width="' + (W - L - R) + '" height="' + H + '" fill="transparent"/></svg><div class="chart-tip" hidden></div></div>' + legend;
    var svg = $("svg", el), tip = $(".chart-tip", el), xh = $(".xh", el);
    svg.addEventListener("mousemove", function (evt) {
      var r = svg.getBoundingClientRect(), sx = (evt.clientX - r.left) * W / r.width;
      var i = Math.max(1, Math.min(n, Math.round((sx - L) / ((W - L - R) / n))));
      xh.setAttribute("x1", x(i)); xh.setAttribute("x2", x(i)); xh.setAttribute("visibility", "visible");
      tip.hidden = false; tip.style.left = (x(i) * r.width / W) + "px"; tip.style.top = (T * r.height / H + 10) + "px";
      tip.innerHTML = esc(list[i - 1].selection) + " · " + list[i - 1].result + "<br>" + series.map(function (sr, k) { return esc(sr.name) + " <b>" + pts(vals[k][i]) + "</b>"; }).join("<br>");
    });
    svg.addEventListener("mouseleave", function () { tip.hidden = true; xh.setAttribute("visibility", "hidden"); });
  }
  function meisterTable() {
    var cols = [["NCM Free", "free", isNF], ["NCM Pro", "pro", isNP], ["NAP", "nap", function (t) { return t.nap; }], ["Best Value", "value", function (t) { return t.value; }], ["All tips", "all", function () { return true; }]];
    var rows = MEISTERS.map(function (m) {
      var mine = TIPS.filter(function (t) { return t.meister === m.id; });
      return '<div class="mrow"><div class="mrow-who">' + whoTag(m.id) + '</div><div class="mrow-tiles">' + cols.map(function (c) {
        var s = stats(mine.filter(c[2])), none = !s.settled && !s.open;
        return '<div class="mtile ' + c[1] + (none ? " none" : "") + '"><span class="mtile-h">' + c[0] + '</span>' +
          '<span class="mtile-pl pts ' + cls(s.profit) + '">' + pts(s.profit) + "</span>" +
          '<span class="mtile-row"><span>Won–Lost</span><b>' + s.won + "–" + s.lost + "</b></span>" +
          '<span class="mtile-row"><span>ROI</span><b class="pts ' + cls(s.roi || 0) + '">' + pct(s.roi, true) + "</b></span></div>";
      }).join("") + "</div></div>";
    }).join("");
    return '<div class="mtable" role="table" aria-label="Profit in points by Meister and tier">' + rows + "</div>" + REC_KEY;
  }

  /* ---------- Acca Meister settled list (Owner 12 Nov 10:11): same look as the settled-tips list, each acca expands into its betslip ---------- */
  var ACCA_FAC = { won: function (p) { return p; }, "half-won": function (p) { return (1 + p) / 2; }, "void": function () { return 1; }, "half-lost": function () { return 0.5; }, lost: function () { return 0; } };
  function accaOdds(p) { var t = fmtOdds(+(+p).toFixed(2)); return /^\d{4,}\.\d+$/.test(t) ? (+t).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : t; }
  function accaPrice(a) { return a.legs.reduce(function (m, l) { return m * l.price; }, 1); }
  function accaChance(a) { return a.legs.reduce(function (m, l) { return m * l.chance; }, 1); }
  function accaState(a) { if (a.legs.some(function (l) { return l.result === "lost"; })) return "lost"; if (a.legs.some(function (l) { return !l.result || l.result === "open"; })) return "open"; return "won"; }
  function accaPts(a) { var st = accaState(a); if (st === "open") return 0; if (st === "lost") return -a.stake; return a.stake * a.legs.reduce(function (m, l) { return m * (ACCA_FAC[l.result] ? ACCA_FAC[l.result](l.price) : 1); }, 1) - a.stake; }
  var LEG_RES = { open: "open", won: "won", lost: "lost", "void": "void", "half-won": "won", "half-lost": "lost" };
  function accaLegRow(l) {
    var r = l.result || "open";
    return '<li><span class="res ' + (LEG_RES[r] || "open") + '">' + esc(r.replace("-", " ")) + '</span><div style="min-width:0"><span class="sel">' + esc(l.sel) + '</span><span class="sub">' + esc(l.event) + " · " + fmtTime(l.start).eat + " UK" + (l.score ? " · " + esc(l.score) : "") + '</span></div><span class="num">' + fmtOdds(l.price) + '<small class="leg-edge ' + cls(l.price * l.chance - 1) + '">edge ' + pct(l.price * l.chance - 1, true) + '</small><small class="sub">chance ' + Math.round(l.chance * 100) + "%</small></span></li>";
  }
  function accaWho(a) { /* Owner 21 Nov 02:30: every combo/acca card names its Meister */
    var W = { combo: ["Combo Meister", "#0E7FB8"], tom: ["Original Combo Meister", "#D99A00"], rcm: ["Racing Combo Meister", "#B5651D"] };
    var w = /^ACCA-/.test(a.id || "") ? (a.meister === "tom" || a.meister === "meister" ? ["Original Acca Meister", "#D99A00"] : ["Acca Meister", "#5B74D6"]) : (W[a.meister] || ["Combo Meister", "#0E7FB8"]); /* Owner 23 Nov: OAM accas named correctly */
    return '<span class="acca-who" style="color:' + w[1] + '"><span class="mdot" style="background:' + w[1] + '"></span>' + w[0] + '</span>';
  }
  function accaList(list, extraCls, slotLabel) {
    /* Owner 12 Nov 10:28: each acca shows its first 2 legs; the rest open with "Show all N legs". */
    if (!list.length) return '<p class="empty">No settled accas yet.</p>';
    return '<ul class="res-list acca-list' + (extraCls ? " " + extraCls : "") + '">' + list.map(function (a) {
      var st = accaState(a), P = accaPrice(a), C = accaChance(a), p = accaPts(a);
      var legs = a.legs.slice().sort(function (x, y) { return new Date(x.start) - new Date(y.start); });
      var won = a.legs.filter(function (l) { return /won|void/.test(l.result || ""); }).length;
      return '<li id="' + esc(a.id) + '">' + (slotLabel ? slotLabel(a) : "") + '<div class="acca-sum"><span class="res ' + st + '">' + st + '</span><div style="min-width:0">' + accaWho(a) + '<span class="sel">' + esc(a.title) + ' <b class="acca-px">@ ' + accaOdds(P) + '</b></span>' +
        '<span class="acca-chips"><span class="acca-edge ' + cls(P * C - 1) + '">Edge ' + pct(P * C - 1, true) + '</span><span class="acca-legn">' + legs.length + ' legs</span><span class="acca-chip">Chance 1 in ' + Math.round(1 / C).toLocaleString("en-GB") + '</span></span>' +
        /* Owner 12 Nov 13:13: plain line with start time and what \u00a310 pays; gold countdown under it (in the old second chip row) */
        '<span class="sub acca-line">' + (st === "open" ? "First leg starts " + fmtTime(legs[0].start).eat + " UK" : won + " of " + legs.length + " legs landed") + " \u00b7 \u00a310 pays \u00a3" + Math.round(10 * P).toLocaleString("en-GB") + '</span>' +
        (st === "open" ? (function () { var nx = legs.filter(function (l) { return (!l.result || l.result === "open") && new Date(l.start) > Date.now(); })[0]; if (!nx) return '<span class="countdown acca-cd">In play \u00b7 waiting for the last legs</span>'; var pre = new Date(legs[0].start) <= Date.now() ? legWord(legs, nx) : "Starts in"; return '<span class="cd-line"><span class="countdown acca-cd" data-acca-start="' + nx.start + '" data-acca-pre="' + pre + '">' + countdown({ start: nx.start, result: "open" }).replace("Starts in", pre) + "</span>" + (pre !== "Starts in" ? wonTally(legs) : "") + "</span>"; })() : "") + '</div>' +
        '<span class="res-tags">' + ((a.meister === "tom" || a.meister === "meister") && /^ACCA-/.test(a.id || "") ? '<span class="badge acca tom" title="Original Acca Meister">OA</span>' : '<span class="badge acca" title="Acca Meister">AM</span>') + '</span><span class="num pts ' + cls(p) + '">' + (st === "open" ? "–" : pts(p)) + '</span></div>' +
        (st === "open" && vcMulti(a) && new Date(legs[0].start) > Date.now() ? vcRow(C, P, a.title) : "") + '<ol class="acca-legs">' + legs.slice(0, 2).map(accaLegRow).join("") + "</ol>" +
        (legs.length > 2 ? '<details class="acca-more"><summary>Show all ' + legs.length + ' legs</summary><ol class="acca-legs" start="3">' + legs.slice(2).map(accaLegRow).join("") + "</ol>" + (a.note ? '<p class="acca-note">' + esc(a.note) + "</p>" : "") + '<button type="button" class="acca-less" onclick="this.closest(\'details\').open=false">Show fewer legs \u25b4</button></details>' : (a.note ? '<details class="acca-more"><summary>More details</summary><p class="acca-note">' + esc(a.note) + '</p><button type="button" class="acca-less" onclick="this.closest(\'details\').open=false">Show less \u25b4</button></details>' : "")) + "</li>"; /* Owner 16 Nov 10:43: 2 legs shown, the rest and the note only on expand */
    }).join("") + "</ul>";
  }
  function accaRecord() {
    var set = (BM.ACCAS || []).filter(function (a) { return accaState(a) !== "open"; });
    var w = set.filter(function (a) { return accaState(a) === "won"; }).length, P = set.reduce(function (m, a) { return m + accaPts(a); }, 0), S = set.reduce(function (m, a) { return m + a.stake; }, 0);
    return { settled: set, n: set.length, won: w, pts: P, staked: S, open: (BM.ACCAS || []).filter(function (a) { return accaState(a) === "open"; }).length };
  }
  BM.accaUI = { dayKey: function (d) { return dayKey(d); }, dayLabel: function (k) { return dayLabel(k); }, list: accaList, record: accaRecord, state: accaState, pts: accaPts, price: accaPrice, chance: accaChance, ptsFmt: function (x) { return pts(x); }, legRow: accaLegRow, odds: function (x) { return accaOdds(x); }, time: function (d) { return fmtTime(d); }, esc: esc, cls: cls }; /* Owner 23 Nov 18:05: compact combo/acca rows on Results */

  /* ---------- results list + chart ---------- */
  function resultsList(list) {
    /* Owner 12 Nov 14:11-14:20: each result shows its bet type (cards open on the Results page, not here) */
    return '<ul class="res-list">' + list.map(function (t) {
      var tm = fmtTime(t.start);
      return '<li><span class="res ' + t.result + '"' + resTitle(t) + '>' + resTxt(t) + "</span><div style=\"min-width:0\"><span class=\"sel\">" + selHTML(t) + '</span><span class="sub">' + esc(betType(t)) + " · " + esc(t.event) + " · " + tm.day + "</span></div>" +
        '<span class="res-tags">' + tierPills(t) + '<span class="badge ' + t.meister + '" title="' + esc(meisterById(t.meister).name) + '">' + esc(meisterById(t.meister).initials) + '</span></span><span class="num pts ' + cls(profit(t)) + '">' + pts(profit(t)) + "</span></li>";
    }).join("") + "</ul>";
  }
  function niceStep(range) { var raw = range / 4, p = Math.pow(10, Math.floor(Math.log10(raw))), n = raw / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; }
  function cumChart(el, list, color) {
    list = list.filter(function (t) { return t.result !== "open"; }).sort(byStart);
    if (!list.length) { el.innerHTML = '<p class="empty">The profit line starts with the first settled tip.</p>'; return; }
    var W = Math.max(300, Math.round(el.clientWidth || 600)), H = W > 700 ? 300 : Math.max(200, Math.round(W * 0.42)), L = 50, R = 70, T = 14, B = 30, run = 0;
    /* fill the box: when the chart sits beside a taller panel, stretch it to the panel's height */
    var pnl = el.closest(".panel");
    if (pnl && el.clientWidth && W <= 700) {
      var avail = pnl.getBoundingClientRect().bottom - el.getBoundingClientRect().top - 22;
      if (avail > H) H = Math.round(avail);
    }
    if (!el.__bmResize) { el.__bmResize = true; var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { if (el.__bmList) cumChart(el, el.__bmList, el.__bmColor); }, 150); }); }
    el.__bmList = list; el.__bmColor = color; var lc = color || "var(--chart-line)";
    var pts_ = [{ v: 0, t: null }].concat(list.map(function (t) { run += profit(t); return { v: run, t: t }; }));
    var lo = Math.min(0, Math.min.apply(null, pts_.map(function (p) { return p.v; }))), hi = Math.max(0, Math.max.apply(null, pts_.map(function (p) { return p.v; })));
    var step = niceStep((hi - lo) || 1); lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step; if (hi === lo) hi = lo + step;
    var x = function (i) { return L + (W - L - R) * i / (pts_.length - 1); }, y = function (v) { return T + (H - T - B) * (hi - v) / (hi - lo); };
    var grid = "", v;
    for (v = lo; v <= hi + 1e-9; v += step) {
      grid += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '" style="stroke:var(--grid)" stroke-width="' + (Math.abs(v) < 1e-9 ? 1.5 : 1) + '"/>' +
        '<text class="axis" x="' + (L - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + pts(v).replace("+0.00", "0").replace("−0.00", "0") + "</text>";
    }
    var line = pts_.map(function (p, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(p.v).toFixed(1); }).join(" ");
    var area = line + " L" + x(pts_.length - 1).toFixed(1) + " " + y(0) + " L" + x(0) + " " + y(0) + " Z";
    var dots = pts_.slice(1).map(function (p, i) { return '<circle cx="' + x(i + 1) + '" cy="' + y(p.v) + '" r="4" style="fill:var(--surface);stroke:' + lc + '" stroke-width="2"/>'; }).join("");
    var last = pts_[pts_.length - 1];
    var first = fmtTime(list[0].start).day, lastD = fmtTime(list[list.length - 1].start).day;
    el.innerHTML = '<div class="chart-wrap"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Running profit in points after each settled tip, ending at ' + pts(last.v) + '">' + grid +
      '<path d="' + area + '" style="' + (color ? "fill:" + color + ";fill-opacity:0.13" : "fill:var(--chart-fill)") + '"/><path d="' + line + '" fill="none" style="stroke:' + lc + '" stroke-width="2.5" stroke-linejoin="round"/>' + dots +
      '<circle cx="' + x(pts_.length - 1) + '" cy="' + y(last.v) + '" r="6" style="fill:' + lc + '"/>' +
      '<text x="' + (x(pts_.length - 1) + 12) + '" y="' + (y(last.v) + 5) + '" style="fill:var(--ink);font:600 15px var(--f-data)">' + pts(last.v) + "</text>" +
      '<text class="axis" x="' + L + '" y="' + (H - 8) + '">' + first + '</text><text class="axis" x="' + (W - R) + '" y="' + (H - 8) + '" text-anchor="end">' + lastD + "</text>" +
      '<line class="xh" x1="0" x2="0" y1="' + T + '" y2="' + (H - B) + '" style="stroke:var(--ink-3)" stroke-dasharray="3 3" visibility="hidden"/>' +
      '<rect x="' + L + '" y="0" width="' + (W - L - R) + '" height="' + H + '" fill="transparent"/></svg><div class="chart-tip" hidden></div></div>';
    var svg = $("svg", el), tip = $(".chart-tip", el), xh = $(".xh", el);
    function show(evt) {
      var r = svg.getBoundingClientRect(), sx = (evt.clientX - r.left) * W / r.width;
      var i = Math.max(1, Math.min(pts_.length - 1, Math.round((sx - L) / ((W - L - R) / (pts_.length - 1)))));
      var p = pts_[i];
      xh.setAttribute("x1", x(i)); xh.setAttribute("x2", x(i)); xh.setAttribute("visibility", "visible");
      tip.hidden = false; tip.style.left = (x(i) * r.width / W) + "px"; tip.style.top = (y(p.v) * r.height / H) + "px";
      tip.innerHTML = esc(p.t.selection) + " · " + p.t.result + "<br>Running total <b>" + pts(p.v) + "</b>";
    }
    svg.addEventListener("mousemove", show);
    svg.addEventListener("mouseleave", function () { tip.hidden = true; xh.setAttribute("visibility", "hidden"); });
  }

  /* ---------- header & footer ---------- */
  var NAV = [["home", "/", "Home"], ["tips", "/tips", "Tips"], /* Combos tab added below once the first combo exists (Owner 16 Nov 10:17) */ ["results", "/results", "Results"], ["performance", "/performance", "Performance"], ["meisters", "/meisters", "Meisters"], ["newsx", ((window.BM && BM.NEWSFEED && BM.NEWSFEED.base) || "#"), "News ↗"]];
  /* Owner 25 Nov 10:46: Combos page retired (combos are Combo Meister tips) */ /* Owner 16 Nov 10:31: Tips, Combos, Accas */ /* Owner 12 Nov 13:20: products, then proof, then people and reading */
  /* Owner 23 Nov 15:53-16:08: one site, menu Home · Tips · Results · News (BM_MERGE) */
  var GNAV = [["home", "/", "Home", []],
    ["tips", "/tips", "Tips", [["Meisters tips", "/tips", "tips"], ].concat(VALUE_CHECKER ? [["Value checker", "/value", "value"]] : [])],
    ["results", "/results", "Results", [["Results", "/results", "results"], ["Performance", "/performance", "performance"], ["The Meisters", "/meisters", "meisters"]]],
    ["news", "/news/", "News", [["News home", "/news/", "nhome"], ["Previews", "/news/previews.html", "nprev"], ["Guides", "/news/guides.html", "nguide"], ["Industry news", "/news/news.html", "nnews"], ["Online casino", "/news/casino-news.html", "ncas"]]],
    /* Owner 25 Nov 15:24: reviews are their own section, not under News */ ["reviews", "/news/bookie-reviews.html", "Reviews", [["Bookmaker reviews", "/news/bookie-reviews.html", "nrev"], ["Casino reviews", "/news/casino-reviews.html", "ncrev"], ["How we score", "/news/how-we-score.html", "nhow"]]]];
  var activeNav = window.BM_MERGE ? page : ({ article: "news", review: "reviews", propicks: "tips" }[page] || page);
  function brand() { return '<a class="brand" href="/" aria-label="BetMeisters home">' + shield(TIER_COLOR.pro) + '<span class="brand-word"><span>BET</span>MEISTERS<small class="brand-tag">TRUST THE MEISTERS</small></span></a>'; }
  function header() {
    var seg = function (key, opts, cur) { return '<span class="seg" role="group">' + opts.map(function (o) { return '<button type="button" data-' + key + '="' + o[0] + '" aria-pressed="' + (o[0] === cur) + '">' + o[1] + "</button>"; }).join("") + "</span>"; };
    return '<div class="utility"><div class="wrap util-grid"><span class="rg">18+ only · Bet responsibly</span>' +
      (window.BM_PUBLIC ? "" : '<span class="util-access"><label class="seg-label" for="access-select">Preview as</label><select id="access-select" class="access-select">' +
      [["full", "Full Meister Access"], ["visitor", "Visitor · no subscription"]].concat(MEISTERS.filter(function (m) { return m.id !== "removed"; }).map(function (m) { return ["sub:" + m.id, m.name + " only"]; }))
        .map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === access ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") +
      "</select></span>") + /* Owner 23 Nov 09:41: public site hides Preview as, Join now and the test strip until launch (window.BM_PUBLIC) */
      '<span class="util-odds"><span class="seg-label">Odds</span>' + seg("odds", [["dec", "Decimal"], ["frac", "Fractional"], ["us", "US"]], oddsMode) + "</span></div></div>" +
      /* Owner 23 Nov 09:37: everything free until 1 January, Pro still labelled */ '<div class="free-banner"><div class="wrap"><b>FREE UNTIL 1 JANUARY</b><span>Let the Meisters prove themselves. Every tip, Free and <span class="fb-pro">PRO</span>, is open to everyone until 1 January. After that, Pro tips are for subscribers.</span></div></div>' +
      '<header class="mast" id="mast"><div class="wrap">' + brand() +
      '<button type="button" class="menu-btn" aria-expanded="false" aria-controls="site-nav" aria-label="Menu">' + ICON.menu + "</button>" +
      '<nav class="nav" id="site-nav" aria-label="Main">' + (window.BM_MERGE ? GNAV.map(function (g) {
        var on = g[3].some(function (c) { return c[2] === activeNav; }) || g[0] === activeNav || (g[0] === "reviews" && activeNav === "review");
        if (!g[3].length) return '<a href="' + g[1] + '"' + (on ? ' aria-current="page"' : "") + ">" + g[2] + "</a>";
        return '<span class="gn"><a class="gn-top" href="' + g[1] + '"' + (on ? ' aria-current="page"' : "") + ' aria-haspopup="true">' + g[2] + ' <span class="gn-c" aria-hidden="true">▾</span></a><span class="gn-menu">' + g[3].map(function (c) { return '<a href="' + c[1] + '"' + (c[2] === activeNav ? ' class="on"' : "") + ">" + c[0] + "</a>"; }).join("") + "</span></span>";
      }).join("") : NAV.map(function (n) { return '<a href="' + n[1] + '"' + (n[0] === activeNav ? ' aria-current="page"' : "") + (n[0] === "newsx" ? ' target="_blank" rel="noopener"' : "") + ">" + n[2] + "</a>"; }).join("")) + "</nav>" +
      (window.BM_PUBLIC ? "" : '<a class="join" href="#join" data-join>Join now</a>') + '</div></header>' +
      (SITE.sampleMode && !window.BM_PUBLIC ? '<div class="sample-bar"><div class="wrap"><strong>Test site</strong><span>' + esc(SITE.sampleNote) + "</span></div></div>" : "");
  }
  function footer() {
    return '<footer class="foot"><div class="wrap"><div class="foot-grid"><div>' + brand() +
      '<p>Independent tips from the Number Cruncher Meisters: every tip priced against the sharp market, and only tipped when the price has an edge. Every tip is published before the event, priced, and kept on the record whether it wins or loses.</p><p class="foot-contact">Contact: <a href="mailto:tom@betmeisters.com">tom@betmeisters.com</a></p><div class="foot-follow"><span>Follow us</span><a href="https://x.com/TheBetMeisters" target="_blank" rel="noopener" aria-label="BetMeisters on X"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.8-6.3L6.4 22H3.3l7.3-8.3L1 2h6.3l4.4 5.8L18.9 2zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20z"/></svg><b>X</b></a><a href="https://www.youtube.com/channel/UCr1opmSykVQ3hsCgVbYBMqA" target="_blank" rel="noopener" aria-label="BetMeisters on YouTube"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15.1V8.9l5.8 3.1-5.8 3.1z"/></svg><b>YouTube</b></a></div></div>' +
      '<div><h4>Tips</h4><ul><li><a href="/tips">All open tips</a></li><li><a href="/tips#nap">NAP of the day</a></li><li><a href="/results">Results & record</a></li><li><a href="/performance">Performance</a></li></ul></div>' +
      '<div><h4>BetMeisters</h4><ul><li><a href="/meisters">The Meisters</a></li><li><a href="/meisters#combo">Combo Meister</a></li><li><a href="/article-price-first">How we price a tip</a></li>' + (window.BM_PUBLIC ? '<li><a href="/privacy">Privacy and cookies</a></li><li><a href="#" onclick="window.bmCookies&&window.bmCookies();return false">Cookie settings</a></li>' : '') + '</ul></div>' +
      '' + (window.BM_MERGE ? '<div class="foot-rev"><h4>News</h4><ul><li><a href="/news/">News home</a></li><li><a href="/news/previews.html">Previews</a></li><li><a href="/news/guides.html">Guides</a></li><li><a href="/news/casino-news.html">Online casino</a></li></ul></div><div class="foot-rev"><h4>Reviews</h4><ul><li><a href="/news/bookie-reviews.html">Bookmaker reviews</a></li><li><a href="/news/casino-reviews.html">Casino reviews</a></li><li><a href="/news/how-we-score.html">How we score</a></li></ul></div>' : '<div class="foot-rev"><h4>BetMeisters.news</h4><ul><li><a href="' + esc((BM.NEWSFEED && BM.NEWSFEED.base) || "#") + '" target="_blank" rel="noopener">News, previews and guides ↗</a></li><li><a href="' + esc((BM.NEWSFEED && BM.NEWSFEED.base) || "#") + '" target="_blank" rel="noopener">Bookmaker reviews ↗</a></li></ul></div>') + '</div>' +
      '<div class="rg-box"><span class="age">18+</span><p>Only bet what you can afford to lose. Our tips are opinions, not guarantees, and past results do not predict future ones. If gambling stops being fun, get free, confidential help from <a href="https://www.gambleaware.org/" target="_blank" rel="noopener">GambleAware.org</a> or the National Gambling Helpline on <span class="mono">0808 8020 133</span> (UK).</p></div>' +
      '<div class="foot-small"><span>© 2026 BetMeisters.</span><span>' + (window.BM_PUBLIC ? "Times shown in UK time (GMT/BST), with your local time alongside if you are outside the UK." : "Times shown in UK time (GMT/BST), with your local time alongside if you are outside the UK.") + '</span><span>Contact <a href="mailto:tom@betmeisters.com">tom@betmeisters.com</a></span></div></div></footer>';
  }
  function mountChrome() {
    var h = $("#bm-header"), f = $("#bm-footer");
    if (h) h.outerHTML = header();
    if (f) f.outerHTML = footer();
    var mast = $("#mast"), btn = $(".menu-btn");
    if (btn) btn.addEventListener("click", function () { var o = mast.getAttribute("data-open") === "true"; mast.setAttribute("data-open", String(!o)); btn.setAttribute("aria-expanded", String(!o)); });
    $$("[data-odds]").forEach(function (b) { b.addEventListener("click", function () { oddsMode = b.getAttribute("data-odds"); save("odds2", oddsMode); refresh(); }); });
    var sel = $("#access-select");
    if (sel) sel.addEventListener("change", function () { access = sel.value; save("access2", access); refresh(); toast(sel.options[sel.selectedIndex].text); });
    document.addEventListener("click", function (e) { if (e.target.closest("[data-join]")) { e.preventDefault(); toast("Memberships open after the test period"); } });
  }
  function syncControls() {
    $$("[data-odds]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-odds") === oddsMode)); });
    var sel = $("#access-select"); if (sel) sel.value = access;
  }

  /* ---------- page sections ---------- */
  /* Owner 23 Nov 07:12: plain explainer for .5 handicaps; the market line keeps the bookmaker's name (Asian handicap) */
  /* Owner 26 Nov 10:28: quarter/whole lines can settle as half won, half lost or stake back: plain words on every result badge */
  function resTxt(t) {
    var r = t.result, line = /handicap|total|spread|draw no bet/i.test((t.market || "") + " " + (t.betType || ""));
    return r === "half-won" ? "\u00bd won" : r === "half-lost" ? "\u00bd lost" : r === "void" && line ? "stake back" : r;
  }
  function resTitle(t) {
    var r = t.result;
    return r === "half-won" ? ' title="Half the stake won at the price, the other half returned"' : r === "half-lost" ? ' title="Half the stake lost, the other half returned"' : r === "void" ? ' title="The stake was returned (no win, no loss)"' : "";
  }
  /* Owner 26 Nov 10:23: quarter and whole lines are back, so EVERY handicap and total carries a plain "How it settles" line,
     worked out from the actual line for each possible score (full win, half win, stake back, half loss, loss). */
  function hcpExp(t) {
    if (!t || t.legs) return "";
    var sel = t.selection || "", mk = (t.market || "") + " " + (t.betType || "");
    var unit = t.sport === "Football" ? "goal" : (/goals/i.test(sel + mk) ? "goal" : "point");
    var U = function (n) { return n + " " + unit + (n === 1 ? "" : "s"); };
    var split = function (L) { var q = Math.round(L * 4); return (Math.abs(q) % 2 === 1) ? [L - 0.25, L + 0.25] : [L]; };
    var res = function (x, Ls) { var o = Ls.map(function (l) { var d = x + l; return d > 1e-9 ? "w" : d < -1e-9 ? "l" : "p"; }).join(""); return o.length === 1 ? o + o : o; };
    var WORD = { ww: "full win", wp: "half wins, half your stake back", pw: "half wins, half your stake back", pp: "stake back", pl: "half your stake back, half lost", lp: "half your stake back, half lost", ll: "lost" };
    var groups = function (vals, lab) { var out = [], cur = null; vals.forEach(function (v) { if (cur && cur.r === v.r) cur.to = v.k; else { cur = { r: v.r, from: v.k, to: v.k }; out.push(cur); } }); return out.map(function (g) { var l = lab(g); return '<span class="hx-row">' + l.charAt(0).toUpperCase() + l.slice(1) + ': <b class="hx-' + g.r.charAt(0) + g.r.charAt(1) + '">' + WORD[g.r] + "</b></span>"; }).join(""); };
    var mt = /\b(over|under)\s+(\d+(?:\.\d+)?)/i.exec(sel);
    if (mt && /total|goals|points/i.test(mk + sel)) {
      var over = /over/i.test(mt[1]), L = +mt[2], Ls = split(L), lo = Math.max(0, Math.floor(L) - 2), hi = Math.ceil(L) + 2, V = [];
      for (var n = lo; n <= hi; n++) V.push({ k: n, r: res(over ? n - 0 : -n, Ls.map(function (l) { return over ? -l : l; })) });
      var txt = groups(V, function (g) { var a = g.from, b = g.to; if (a === lo && b === hi) return "any total"; if (a === lo) return (b === 0 ? "0" : b + " or fewer") + " " + unit + "s"; if (b === hi) return a + " or more " + unit + "s"; return a === b ? "exactly " + U(a) : a + "–" + b + " " + unit + "s"; });
      return '<span class="hcp-exp"><b class="hx-h">How it settles</b>' + txt + "</span>";
    }
    var mh = /^(.*?)\s([+-]\d+(?:\.\d+)?)\b/.exec(sel);
    if (mh && /handicap|spread/i.test(mk)) {
      var team = mh[1].replace(/\s*\(.*$/, ""), L2 = +mh[2], Ls2 = split(L2), top = Math.max(3, Math.ceil(Math.abs(L2)) + 2), W = [];
      for (var m = top; m >= -top; m--) W.push({ k: m, r: res(m, Ls2) });
      var lab = function (g) { var a = g.from, b = g.to; /* a > b */
        var one = function (m) { return m > 0 ? team + " win by " + U(m) : m === 0 ? "draw" : team + " lose by " + U(-m); };
        if (a === top && b === -top) return "any result";
        if (a === top) return b > 0 ? team + " win by " + b + "+" : b === 0 ? team + " win or draw" : team + " win, draw or lose by up to " + U(-b);
        if (b === -top) return a < 0 ? team + " lose by " + (-a) + "+" : a === 0 ? "draw or " + team + " lose" : team + " lose, draw or win by up to " + U(a);
        return a === b ? one(a) : one(a) + " or " + one(b).replace(team + " ", "");
      };
      var hx = groups(W, lab); if (unit === "point") hx = hx.replace(/win, draw or lose/g, "win or lose").replace(/lose, draw or win/g, "lose or win").replace(/<span class="hx-row">Draw:.*?<\/span>/g, "");
      return '<span class="hcp-exp"><b class="hx-h">How it settles</b>' + hx + "</span>";
    }
    if (/draw no bet/i.test(mk + sel)) return '<span class="hcp-exp"><b class="hx-h">How it settles</b><span class="hx-row">Win: <b class="hx-ww">full win</b></span><span class="hx-row">Draw: <b class="hx-pp">stake back</b></span><span class="hx-row">Lose: <b class="hx-ll">lost</b></span></span>';
    return "";
  }

  function heroPicks() {
    /* Owner 22 Nov 18:09: ONE top row on the home page, up to FIVE boxes, any mix of NAP, Special and Pro Pick (Pro Picks no longer have their own home row).
       NAPs always on the left (NCM NAP, then TOM's NAP; several TOM NAPs share one box); then Specials and Pro Picks together in start order.
       Each box shows one tip and drops off when it starts; extra picks queue behind the fifth box ("Next up"). Boxes stay on the Meister, Pro Picks and Performance pages. */
    var up = upcoming().filter(function (t) { return !(t.postponed && !t.originalStart); });
    var naps = up.filter(function (t) { return t.nap; }).sort(byStart);
    var hn = up.filter(function (t) { return !t.nap && t.humanNap; }).sort(byStart);
    var rest = up.filter(function (t) { return !t.nap && !t.humanNap && (t.special || t.proPick); }).sort(byStart);
    var feat = naps.map(function (t) { return { kind: "nap", list: [t] }; });
    if (hn.length) feat.push({ kind: "hnap", list: hn });
    /* Owner 22 Nov 18:17: never a bare row. Fewer than three boxes -> top up with the highest-edge open NCM Pro tips (Top Pro tip), then everything after the NAPs in start order. */
    var short = 3 - feat.length - rest.length;
    if (short > 0) {
      /* Owner 22 Nov 18:24: Pro first, then NCM Free tips if still short (any day, today or tomorrow) */
      var cand = up.filter(function (t) { return !t.nap && !t.humanNap && !t.special && !t.proPick && t.meister === "cruncher" && t.prob && t.price && t.price * t.prob > 1; });
      var byE = function (a, b) { return (b.price * b.prob) - (a.price * a.prob); };
      var fill = cand.filter(function (t) { return t.tier === "pro"; }).sort(byE).concat(cand.filter(function (t) { return t.tier !== "pro"; }).sort(byE)).slice(0, short);
      rest = rest.concat(fill).sort(byStart);
    }
    rest.forEach(function (t) { feat.push({ kind: t.special ? "special" : t.proPick ? "propick" : t.tier === "pro" ? "pro" : "free", list: [t] }); });
    var out = feat.slice(0, 5);
    if (feat.length > 5 && out[4].kind !== "hnap") out[4] = { kind: out[4].kind, list: [out[4].list[0]].concat(feat.slice(5).map(function (g) { return g.list[0]; })) };
    return out;
  }
  function openAcca(fit) {
    /* Owner 12 Nov 10:09: same rules and rotation as Specials/NAPs. The box shows the BIGGEST-EDGE open acca whose first leg has not started
       (and that was published 1h+ before its first leg); when it starts, the next best takes the box. If every open acca has started,
       the box keeps the biggest-edge one still alive (no leg lost, a leg still to play) with "Next leg in"; it leaves when none is left. */
    var now = Date.now();
    var edge = function (a) { return a.legs.reduce(function (m, l) { return m * l.price; }, 1) * a.legs.reduce(function (m, l) { return m * l.chance; }, 1) - 1; };
    var firstStart = function (a) { return Math.min.apply(null, a.legs.map(function (l) { return new Date(l.start).getTime(); })); };
    var alive = (BM.ACCAS || []).filter(function (a) { return (!fit || fit(a)) && a.legs.every(function (l) { return l.result !== "lost"; }) && a.legs.some(function (l) { return (!l.result || l.result === "open") && new Date(l.start).getTime() > now; }); });
    var byEdge = function (x, y) { return edge(y) - edge(x); };
    var fresh = alive.filter(function (a) { return firstStart(a) > now && firstStart(a) - new Date(a.publishedAt).getTime() >= 3600000; }).sort(byEdge);
    /* Owner 16 Nov 08:20: home acca boxes only show accas you can still back (first leg not started); in-play accas live on the Accas page */
    return fresh[0] || alive.filter(function (a) { return firstStart(a) > now; }).sort(byEdge)[0] || null;
  }
  /* Owner 20 Nov 11:34: say which leg is next: "Second leg in", "Third leg in" ... and "Last leg in" for the final one */
  /* Owner 20 Nov 12:30: legs won so far next to the countdown, e.g. "1/2 won", "3/8 won" (voids shown separately) */
  function wonTally(legs) { var w = legs.filter(function (l) { return l.result === "won" || l.result === "half-won"; }).length, v = legs.filter(function (l) { return l.result === "void"; }).length; return ' <span class="won-tally">' + w + "/" + legs.length + " won" + (v ? " \u00b7 " + v + " void" : "") + "</span>"; }
  function legWord(legs, nx) { var i = legs.indexOf(nx), N = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"]; if (i < 0) return "Next leg in"; if (i === legs.length - 1) return "Last leg in"; return (N[i] || "Next") + " leg in"; }
  var ACCA_COL = "#FF5FA2";
  function accaCard(a, kind) {
    /* Owner 12 Nov 10:27: two acca boxes side by side under the three tip boxes: up to 6 legs, and 7+ legs (long odds). Same structure in both so they line up. */
    var P = a.legs.reduce(function (m, l) { return m * l.price; }, 1), C = a.legs.reduce(function (m, l) { return m * l.chance; }, 1);
    var legs = a.legs.slice().sort(function (x, y) { return new Date(x.start) - new Date(y.start); });
    var first = legs.filter(function (l) { return !l.result || l.result === "open"; })[0] || legs[0], tm = fmtTime(first.start);
    var started = new Date(legs[0].start) <= Date.now(), pre = started ? legWord(legs, first) : "First leg in";
    var cd = countdown({ start: first.start, result: "open" }).replace("Starts in", pre);
    var share = "BetMeisters acca: " + a.title + " @ " + accaOdds(P) + " (" + legs.map(function (l) { return l.sel + " " + fmtOdds(l.price); }).join(", ") + "). \u00a310 returns \u00a3" + Math.round(10 * P).toLocaleString("en-GB") + " if all " + legs.length + " win; our chance about 1 in " + Math.round(1 / C) + ". 18+ BeGambleAware.org" + (SITE.url ? " " + SITE.url + "/acca.html" : "");
    var lab = kind === "long" ? ["Today\u2019s big-odds acca", "Accas with edge \u00b7 7 to 10 legs"] : ["Today\u2019s top acca", "Accas with edge \u00b7 up to 6 legs"];
    var SHOW = legs.length <= 6 ? (legs.length <= 5 ? legs.length : 4) : 4;
    return '<article class="hero-card acca-half" aria-label="' + lab[0] + ': ' + esc(a.title) + '">' +
      '<div class="hc-top"><span class="shield">' + shield(ACCA_COL) + '</span><p class="hc-label">' + lab[0] + '<small>' + lab[1] + '</small></p>' +
      '<a class="who hc-who" href="/acca#' + esc(a.id) + '"><span class="badge acca" title="Acca Meister">AM</span></a></div>' +
      '<div class="ah-title"><h2 class="hc-sel"><a href="/acca#' + esc(a.id) + '">' + legs.length + '-fold</a><small>' + esc(a.type.replace(/ \(.*\)$/, "")) + '</small></h2><span class="ah-price">' + accaOdds(P) + '</span></div>' +
      '<dl class="hc-stats ah-stats"><div><dt>' + (started ? "Next leg" : "First leg") + '</dt><dd>' + tm.eat + ' <small>UK</small>' + ALT(tm, '<small class="hc-uk">', "</small>") + '</dd></div>' +
      '<div><dt>Our chance</dt><dd>1 in ' + Math.round(1 / C).toLocaleString("en-GB") + '</dd></div><div><dt>Edge</dt><dd class="' + cls(P * C - 1) + '">' + pct(P * C - 1, true) + '</dd></div>' +
      '<div><dt>Stake</dt><dd>' + a.stake + ' pt</dd></div><div><dt>\u00a310 returns</dt><dd class="price">\u00a3' + Math.round(10 * P).toLocaleString("en-GB") + '</dd></div></dl>' +
      '<ul class="ac-mini">' + legs.slice(0, SHOW).map(function (l) { return '<li><span><small class="t">' + fmtTime(l.start).eat + '</small>' + esc(l.sel) + '</span><b>' + fmtOdds(l.price) + '</b></li>'; }).join("") +
      (legs.length > SHOW ? '<li class="more"><span>+ ' + (legs.length - SHOW) + ' more legs</span></li>' : '') + '</ul>' +
      (vcMulti(a) && !started ? vcLine(C, "m-" + a.id) : "") + '<div class="cd-row"><p class="countdown hc-count" data-acca-start=""' + first.start + '" data-acca-pre="' + pre + '">' + cd + '</p>' + (started ? wonTally(legs) : "") + '</div>' +
      '<div class="ah-foot"><a class="aw-cta" href="/acca#' + esc(a.id) + '">See every leg and the acca record \u2192</a>' +
      '<p class="ac-sep">Separate record \u00b7 not part of the main BetMeisters totals</p>' +
      '<div class="hc-share">' + shareButtons(share) + '</div></div></article>';
  }
  /* live countdown for the acca box (to the first leg, or the next unstarted leg once one has started) */
  setInterval(function () { $$("[data-acca-start]").forEach(function (el) { el.textContent = countdown({ start: el.getAttribute("data-acca-start"), result: "open" }).replace("Starts in", el.getAttribute("data-acca-pre")); }); }, 30000);
  /* Owner 12 Nov 13:32: home tip cards in the acca-card flow (header band, one tag row, title @ price, chips, plain lines, gold countdown) */
  function homeTip(t, o) {
    o = o || {};
    var lock = locked(t), tm = fmtTime(t.start), e = edgeOf(t), m = meisterById(t.meister);
    var badge = '<a class="who hc-who" href="/meisters#' + m.id + '" title="' + esc(m.name) + '" aria-label="' + esc(m.name) + '"><span class="badge ' + m.id + '">' + esc(m.initials) + "</span></a>"; /* Owner 12 Nov 15:24: one circle per Meister, no repeated code beside it */
    var left = o.label ? '<span class="shield">' + shield(o.col) + '</span><p class="hc-label" style="color:' + o.col + '">' + o.label + "<small>" + o.sub + "</small></p>" : tierPill(t);
    var tags = secTag(t) + extraTags(t).replace(o.label === "Meister Special" ? /<span class="mini-tag special">Meister Special<\/span>/ : /$^/, "") + (o.label ? '<span class="tier-mini">' + tierWord(t) + "</span>" : "");
    var where = esc(t.sport) + (t.comp && t.comp !== t.sport ? " · " + esc(t.comp) : "");
    var cd = t.result === "open" ? '<p class="countdown htip-cd" data-countdown="' + t.id + '">' + countdown(t) + "</p>" : '<p class="htip-ln htip-res">Result <span class="res ' + t.result + '"' + resTitle(t) + '>' + resTxt(t) + '</span> \u00b7 <b class="pts ' + cls(profit(t)) + '">' + pts(profit(t)) + " pts</b>" + (t.settledNote ? " \u00b7 " + esc(t.settledNote) : "") + "</p>";
    if (oop(t) && t.result === "open") cd += '<p class="htip-sm">Order of play: the start is a \u201cnot before\u201d time and often runs later.</p>';
    var body = lock
      ? '<h3 class="htip-sel">Pro tip · subscribers only</h3><p class="htip-ev" title="' + esc(t.event) + '">' + esc(t.event) + '</p><p class="htip-ln">' + where + '</p><p class="htip-ln"><a href="#join" data-join>Subscribe</a> to ' + esc(m.short || m.name) + " or get Full Meister Access to see it.</p>"
      : '<h3 class="htip-sel">' + selHTML(t) + ' <b class="htip-px">@ ' + fmtOdds(t.price) + "</b></h3>" +
        (t.combo ? comboLegsHTML(t) : '<p class="htip-ev" title="' + esc(t.event + " · " + (t.sport || "") + (t.comp ? " · " + t.comp : "")) + '">' + esc(t.event) + " · " + where + "</p>") +
        '<div class="acca-chips">' + (e != null ? '<span class="acca-edge ' + cls(e) + '">' + (t.tomMethod ? '<span title="TOM\u2019s own assessment: market chance plus his grade">Edge</span> ' : "Edge ") + pct(e, true) + "</span>" : "") + (t.prob ? '<span class="acca-chip">' + (t.ew ? "Win" : "Chance") + " " + pct(t.prob) + "</span>" : "") + (t.ew && t.probPlace ? '<span class="acca-chip">Place ' + pct(t.probPlace) + "</span>" : '<span class="acca-chip">Bookmaker ' + pct(1 / t.price) + "</span>") + "</div>" + vcTip(t);
    var lines = '<p class="htip-ln">' + (oop(t) ? "Not before " : "Starts ") + tm.eat + " UK · " + ALT(tm, "", " · ") + (t.ew ? stakeTxt(t.stake / 2) + " e/w" : stakeTxt(t.stake)) + (!lock && t.minPrice ? " · take " + fmtOdds(t.minPrice) + "+" : "") + "</p>" + cd +
      (lock ? "" : '<p class="htip-sm">' + esc(t.market) + hcpExp(t) + (t.bookie ? " · best at " + esc(t.bookie) : "") + "</p>" + exchLine(t).replace('class="tip-market exch-line"', 'class="htip-sm htip-exch"')) +
      pubLine(t).replace('class="tip-pub"', 'class="htip-sm htip-pub"') + (o.next || "") + (o.share ? '<div class="htip-share">' + shareButtons(shareText(t)) + "</div>" : "");
    return '<li class="htip' + (o.dark ? " dark" : "") + '" data-tier="' + t.tier + '" data-m="' + t.meister + '"' + (o.label && /^NAP \u00b7 TOM|^TOM\u2019s NAP/.test(o.label) ? " data-hnap" : o.label && /^NAP/.test(o.label) ? " data-nap" : "") + '><div class="htip-hd">' + left + badge + '</div><div class="htip-tags">' + tags + "</div>" + body + lines + "</li>";
  }
  /* sweep 16 Nov: one MMA label (feeds send Ufc_Mma / Mixed-Martial-Arts) */
  (function () { var fx = function (o) { if (o && /^(ufc_mma|mixed-martial-arts)$/i.test(o.sport || "")) o.sport = "MMA"; };
    try { (window.BM.TIPS || []).forEach(fx); (window.BM.ACCAS || []).forEach(function (a) { fx(a); (a.legs || []).forEach(fx); }); } catch (e) {} })();
  function heroCard(g) {
    if (g.list && g.list[0]) {
      var tt = g.list[0], napLab = g.kind === "nap" || g.kind === "hnap", nm = g.kind === "hnap" ? "NAP \u00b7 TOM" : "NAP", lab = napLab ? (dayKey(tt.start) !== dayKey(new Date().toISOString()) ? nm + " \u00b7 " + dayLabel(dayKey(tt.start)).split(" \u00b7 ")[0] : (g.kind === "hnap" ? "TOM\u2019s NAP" : nm) + " of the day") : g.kind === "propick" ? "Pro Pick" : g.kind === "pro" ? "Top Pro tip" : g.kind === "free" ? "Top Free tip" : "Meister Special";
      var nx = g.list[1] ? '<p class="htip-sm hc-next">Next up: <b>' + (locked(g.list[1]) ? "Pro tip" : esc(g.list[1].selection)) + "</b> \u00b7 " + esc(g.list[1].event) + " \u00b7 " + fmtTime(g.list[1].start).eat + " UK" + (g.list.length > 2 ? " \u00b7 then " + (g.list.length - 2) + " more" : "") + "</p>" : "";
      return homeTip(tt, { dark: true, share: true, label: lab, sub: g.kind === "hnap" ? "The Original Meister\u2019s pick of the day" : napLab ? "Our most confident selection" : g.kind === "propick" ? "One of today\u2019s best Pro tips" : g.kind === "pro" ? "Highest edge among our open Pro tips" : g.kind === "free" ? "Highest edge among our open Free tips" : "One of our highest-edge open tips", col: g.kind === "hnap" ? TIER_COLOR.hnap : napLab ? TIER_COLOR.nap : g.kind === "propick" ? TIER_COLOR.propick : g.kind === "pro" ? TIER_COLOR.pro : g.kind === "free" ? TIER_COLOR.free : TIER_COLOR.special, next: nx });
    }
    var meta = {
      nap: { label: "NAP of the day", sub: "Our most confident selection", col: TIER_COLOR.nap, css: "nap" },
      hnap: { label: "TOM\u2019s NAP of the day", sub: "The Original Meister\u2019s pick of the day", col: TIER_COLOR.hnap, css: "hnap" },
      special: { label: "Meister Special", sub: "One of our three highest-edge open tips", col: TIER_COLOR.special, css: "special" },
      value: { label: "Best Value", sub: "Biggest edge at 3+ bookmakers", col: TIER_COLOR.value, css: "value" }
    }[g.kind];
    var t = g.list[0];
    if (!t) return '<article class="hero-card ' + meta.css + ' empty-card"><div class="hc-top"><span class="shield">' + shield(meta.col) + '</span><p class="hc-label">' + meta.label + "<small>None open right now. The next one is added at the next pass.</small></p></div></article>";
    var tm = fmtTime(t.start), lock = locked(t), e = edgeOf(t);
    /* Owner 9 Nov 10:23: NAPs can run for more than a day and there can be several; the box shows the soonest, labelled with its day when not today */
    if (g.kind === "nap" && dayKey(t.start) !== dayKey(new Date().toISOString())) meta = { label: "NAP · " + dayLabel(dayKey(t.start)).split(" · ")[0], sub: meta.sub, col: meta.col, css: meta.css };
    var nxt = g.list[1] ? '<p class="hc-next">Next up: <b>' + (locked(g.list[1]) ? "Pro tip" : esc(g.list[1].selection)) + "</b> · " + esc(g.list[1].event) + " · " + fmtTime(g.list[1].start).eat + " UK</p>" : "";
    return '<article class="hero-card ' + meta.css + '" aria-label="' + meta.label + '">' +
      '<div class="hc-top"><span class="shield">' + shield(meta.col) + '</span><p class="hc-label">' + meta.label + "<small>" + meta.sub + " · " + tierWord(t) + " tip</small></p>" + whoTag(t.meister).replace('class="who"', 'class="who hc-who"').replace(/<\/span>[^<]*<\/a>$/, "</span>" + (MCODE[t.meister] || "") + "</a>") + "</div>" +
      '<h2 class="hc-sel">' + (lock ? "Pro tip · subscribers only" : selHTML(t)) + "</h2>" +
      '<p class="hc-event">' + esc(t.event) + " · " + esc(t.market) + "</p>" +
      '<p class="hc-comp">' + esc(t.sport) + (t.comp && t.comp !== t.sport ? " · " + esc(t.comp) : "") + (t.postponed ? ' · <span class="mini-tag postponed">Rescheduled</span>' : "") + "</p>" +
      '<dl class="hc-stats"><div><dt>' + (oop(t) ? "Not before" : "Starts") + '</dt><dd>' + tm.eat + ' <small>UK</small>' + ALT(tm, '<small class="hc-uk">', "</small>") + '</dd></div><div><dt>Price</dt><dd class="price">' + (lock ? "–" : fmtOdds(t.price)) + "</dd></div><div><dt>Stake</dt><dd>" + stakeHTML(t) + "</dd></div>" +
      "<div><dt>" + (t.tomMethod ? "Chance" : "Our chance") + "</dt><dd>" + (t.prob && !lock ? pct(t.ew && t.probPlace ? t.probPlace : t.prob) + (t.ew && t.probPlace ? " <small>place</small>" : "") : "–") + "</dd></div>" +
      "<div><dt>" + "Edge" + "</dt><dd class=\"" + (e != null && !lock ? cls(e) : "") + "\">" + (e != null && !lock ? pct(e, true) : "–") + "</dd></div></dl>" +
      (lock ? "" : exchLine(t).replace('tip-market exch-line', 'hc-exch')) +
      '<p class="countdown hc-count" data-countdown="' + t.id + '">' + countdown(t) + "</p>" + nxt +
      '<div class="hc-share">' + shareButtons(shareText(t)) + "</div></article>";
  }
  function napHero(el) {
    var g = heroPicks();
    /* Owner 12 Nov 12:57: three compact acca cards (same design as the Accas page): best 2-4, best 5-6, best 7-10 legs, each rotating like the Specials */
    var SLOTS = [["4-fold acca", 4, 4], ["Top acca", 5, 6], ["Big-odds acca", 7, 10]];
    /* Owner 17 Nov 10:00: the NEXT THREE open accas still to back (first leg not started, no leg lost), soonest first, each labelled by its size band */
    SLOTS.push(["Long-odds acca", 11, 99]);
    var nowA = Date.now(), fsA = function (x) { return Math.min.apply(null, x.legs.map(function (l) { return new Date(l.start).getTime(); })); };
    var picks = (BM.ACCAS || []).filter(function (x) { return x.legs.length >= 4 && x.legs.every(function (l) { return l.result !== "lost"; }) && fsA(x) > nowA; }).sort(function (x, y) { return fsA(x) - fsA(y); }).slice(0, 3)
      .map(function (a) { var sl = SLOTS.filter(function (z) { return a.legs.length >= z[1] && a.legs.length <= z[2]; })[0]; return { a: a, lab: sl ? sl[0] : "Acca" }; });
    var nOpenA = (BM.ACCAS || []).filter(function (x) { return x.legs.length >= 4 && x.legs.every(function (l) { return l.result !== "lost"; }) && fsA(x) > nowA; }).length;
    if (!picks.length) picks = SLOTS.map(function (sl) { var a = openAcca(function (x) { return x.legs.length >= sl[1] && x.legs.length <= sl[2]; }); return a ? { a: a, lab: sl[0] } : null; }).filter(Boolean);
    var labOf = function (a) { for (var i = 0; i < picks.length; i++) if (picks[i].a === a) { var sl = SLOTS.filter(function (x) { return x[0] === picks[i].lab; })[0];
      /* Owner 12 Nov 12:59: dark header band like the old acca boxes */
      var dayA = dayKey(new Date(Math.min.apply(null, a.legs.map(function (l) { return new Date(l.start).getTime(); }))).toISOString()) === dayKey(new Date().toISOString()) ? "Today" : "Tomorrow";
      return '<div class="acca-hd"><span class="shield">' + shield(ACCA_COL) + '</span><p class="hc-label">' + picks[i].lab + '<small>' + dayA + ' \u00b7 ' + a.legs.length + ' legs \u00b7 not tips</small></p><a class="who hc-who" href="/acca#' + esc(a.id) + '"><span class="badge acca" title="Acca Meister">AM</span></a></div>'; } return ""; };
    var boxes = picks.length ? '<div class="sec-head acca-home-head"><div><p class="eyebrow">Acca Meister \u00b7 separate record</p><h2 class="sec-title">Accas with edge</h2></div><a class="more" href="/acca">All accas (' + nOpenA + ' to back)</a></div>' + accaList(picks.map(function (p) { return p.a; }), "two home-accas", labOf) : "";
    var heroTips = g.map(function (x) { return x.list[0]; }).filter(Boolean);
    /* Owner 16 Nov 07:30 sweep: no featured tips open -> one slim strip instead of three empty boxes */
    /* Owner 22 Nov 14:08: no empty placeholder boxes (same as Pro Picks): only boxes with a tip are shown */
    el.innerHTML = (heroTips.length ? '<ul class="htips hero-row" aria-label="Featured tips">' + g.filter(function (x) { return x.list && x.list.length; }).map(function (x) { var h = heroCard(x).replace(/^<li /, '<li style="border-top-color:' + (TIER_COLOR[x.kind] || TIER_COLOR.special) + '" '); return /^<li/.test(h) ? h : "<li class=\"htip dark empty\">" + h + "</li>"; }).join("") + "</ul>" :
      '<div class="hero-none"><span class="shield">' + shield(TIER_COLOR.special) + '</span><p><b>NAP, Meister Specials and Pro Picks</b><small>None open right now. New ones are added at the next pass.</small></p><a class="more" href="/tips">All open tips</a></div>') +
      '<div class="home-bar">' + tipsBar(heroTips, "the " + heroTips.length + " featured tips") + "</div>" +
      "";
    /* Owner 22 Nov 18:21: ONE "Combos & Accas" row on the home page: combos and accas mixed, soonest first leg first (off time decides), up to five boxes (three in view, swipe/scroll for more); links to All combos and All accas. Pages for each are unchanged. */
    var aEl = $("#acca-home"); if (aEl) aEl.innerHTML = "";
    var cEl = $("#combo-home");
    if (cEl) {
      var nowC = Date.now(), fsC = function (x) { return Math.min.apply(null, x.legs.map(function (l) { return new Date(l.start).getTime(); })); };
      var CL = (BM.COMBOS || []).filter(function (x) { return x.legs.every(function (l) { return l.result !== "lost"; }) && fsC(x) > nowC; });
      var AL = (BM.ACCAS || []).filter(function (x) { return x.legs.length >= 4 && x.legs.every(function (l) { return l.result !== "lost"; }) && fsC(x) > nowC; });
      var isC = function (x) { return CL.indexOf(x) >= 0; };
      var MX = CL.concat(AL).sort(function (x, y) { return fsC(x) - fsC(y); }).slice(0, 5);
      var isT = function (x) { return x.meister === "tom" || x.meister === "meister"; };
      var dlOf = function (x) { var d = dayKey(new Date(fsC(x)).toISOString()); return d === dayKey(new Date().toISOString()) ? "Today" : dayLabel(d).split(" \u00b7 ")[0]; };
      var labC = function (x) {
        if (!isC(x) && isT(x)) return '<div class="acca-hd"><span class="shield">' + shield(ACCA_COL) + '</span><p class="hc-label">OAM ' + x.legs.length + '-fold<small>' + dlOf(x) + ' \u00b7 Original Acca Meister \u00b7 not tips</small></p><a class="who hc-who" href="/acca#' + esc(x.id) + '"><span class="badge acca tom" title="Original Acca Meister">OA</span></a></div>'; /* Owner 22 Nov 19:30 */
        if (!isC(x)) { var sl = SLOTS.filter(function (z) { return x.legs.length >= z[1] && x.legs.length <= z[2]; })[0];
          return '<div class="acca-hd"><span class="shield">' + shield(ACCA_COL) + '</span><p class="hc-label">' + (sl ? sl[0] : "Acca") + '<small>' + dlOf(x) + ' \u00b7 ' + x.legs.length + ' legs \u00b7 not tips</small></p><a class="who hc-who" href="/acca#' + esc(x.id) + '"><span class="badge acca" title="Acca Meister">AM</span></a></div>'; }
        return '<div class="acca-hd"><span class="shield">' + shield("#7FD3FF") + '</span><p class="hc-label">' + esc(x.title) + '<small>' + dlOf(x) + " \u00b7 " + (isT(x) ? "Original Combo Meister" : "Combo Meister") + '</small></p><a class="who hc-who" href="/tips#' + esc(x.id) + '"><span class="badge acca combo' + (isT(x) ? " tom" : "") + '" title="' + (isT(x) ? "Original Combo Meister" : "Combo Meister") + '">' + (isT(x) ? "OC" : "CM") + "</span></a></div>"; };
      var items = MX.map(function (x) {
        var h = accaList([x], "", labC).replace(/^<ul[^>]*>/, "").replace(/<\/ul>$/, "");
        if (isC(x)) h = h.split("/acca#").join("combo.html#").replace(/<span class="badge acca" title="Acca Meister">AM<\/span>/g, "");
        return h; }).join("");
      cEl.innerHTML = MX.length ? '<section class="acca-home combo-home mixed-ca" aria-label="Combos and accas"><div class="sec-head acca-home-head"><div><p class="eyebrow">Not tips \u00b7 separate records</p><h2 class="sec-title">Combos &amp; Accas</h2></div><span class="more-pair"><a class="more" href="/tips">All combos (' + CL.length + ')</a><a class="more" href="/acca">All accas (' + AL.length + ')</a></span></div>' +
          '<ul class="res-list acca-list two home-accas">' + items + "</ul></section>" +
          '<div class="home-bar">' + accaBar(MX, isC) + "</div>" :
        '<div class="hero-none" style="border-top-color:#7FD3FF"><span class="shield">' + shield("#7FD3FF") + '</span><p><b>Combos</b><small>None to back right now. New ones are added at the next pass.</small></p><span class="more-pair"><a class="more" href="/tips">All combos</a><a class="more" href="/acca">All accas</a></span></div>';
    }
  }
  function heroIds() { return heroPicks().map(function (g) { return g.list[0] && g.list[0].id; }).filter(Boolean); }
  function nextTips(el, n) {
    var list = upcoming().slice(0, n || 4);
    el.innerHTML = list.length ? '<ul class="htips d-only">' + list.map(function (t) { return homeTip(t); }).join("") + "</ul>" + '<div class="tlist m-only">' + list.map(tipRow).join("") + "</div>" + '<div class="home-bar">' + tipsBar(list, "the next " + list.length + (list.length === 1 ? " tip" : " tips")) + "</div>" : '<div class="empty">No more open tips right now. New tips are published ' + (window.BM_PUBLIC ? "through the day, from 07:00 UK." : "from 07:00 UK.") + '</div>';
  }
  var dp = { meister: "all", sport: "all", day: "all", sort: "start", all: false };
  /* Owner 12 Nov 12:20: "What the price says" rows as a reusable block (home: only what the home page shows; Tips: under each day) */
  function priceRowHTML(r) {
    return '<div class="data-row"><p class="lbl">' + r.lbl + "<span>" + r.sub + "</span>" + (r.event ? "<span>" + esc(r.event) + "</span>" : "") + "</p>" +
      '<div class="bar-track" role="img" aria-label="Bookmaker chance ' + pct(1 / r.price) + (r.prob ? ", our chance " + pct(r.prob) : "") + '"><div class="bar-fill" style="width:' + (r.lock ? 0 : 100 / r.price).toFixed(1) + '%"></div>' +
      (r.prob && !r.lock ? '<span class="bar-mark" style="left:calc(' + (r.prob * 100).toFixed(1) + '% - 1.5px)"></span>' : "") + "</div>" +
      '<span class="num">' + (r.lock ? "–" : pct(1 / r.price)) + (!r.lock && r.edge != null ? '<span class="edge-chip ' + cls(r.edge) + '" title="Edge">' + pct(r.edge, true) + "</span>" : "") + "</span></div>";
  }
  function tipPriceRow(t) { var lock = locked(t), m = meisterById(t.meister), tm = fmtTime(t.start); return { lbl: lock ? "Pro selection" : selHTML(t), sub: tm.eat + " UK · " + esc(t.sport) + " · " + esc(m.short || m.name), event: t.event, price: t.price, prob: t.prob, edge: edgeOf(t), lock: lock }; }
  var PRICE_LEGEND = '<div class="legend"><span><i style="background:var(--navy-3)"></i>Chance implied by the price</span><span><i style="background:var(--orange)"></i>Our chance</span><span><b class="edge-chip pos">+3.0%</b> Edge</span></div>';
  /* Owner 12 Nov 12:28-12:37: "What the price says" fold-out bar (CTA header + chart), used under each Tips day and under each home block */
  function priceBar(rows, what, inner) {
    if (!rows.length) return "";
    var ed = rows.filter(function (r) { return !r.lock && r.edge != null; }), avg = ed.length ? ed.reduce(function (m, r) { return m + r.edge; }, 0) / ed.length : null, top = ed.slice().sort(function (a, b) { return b.edge - a.edge; })[0];
    return '<details class="day-price"><summary><span class="dpx-ic" aria-hidden="true">%</span><span class="dpx-t"><b>What the price says</b><small>Our chance v the bookmaker’s for ' + what + '</small></span>' +
      '<span class="dpx-chips">' + (avg != null ? '<span class="dpx-chip pos">Avg edge ' + pct(avg, true) + '</span>' : "") + (top ? '<span class="dpx-chip">Biggest ' + pct(top.edge, true) + ' · ' + top.lbl.replace(/<[^>]+>/g, "") + '</span>' : "") + '</span><span class="dpx-btn">See the chart</span></summary>' +
      (inner || '<div class="data-rows">' + rows.map(priceRowHTML).join("") + "</div>") + PRICE_LEGEND + "</details>";
  }
  function dayPrice(items) {
    var rows = items.filter(function (t) { return t.price; }).map(tipPriceRow);
    return priceBar(rows, "these " + rows.length + (rows.length === 1 ? " tip" : " tips"));
  }
  function tipsBar(list, what) { var rows = list.filter(function (t) { return t && t.price; }).map(tipPriceRow); return priceBar(rows, what); }
  function accaBar(accas, isCmb) {
    var rows = [], inner = accas.map(function (a) {
      var P = a.legs.reduce(function (m, l) { return m * l.price; }, 1), C = a.legs.reduce(function (m, l) { return m * l.chance; }, 1);
      var legs = a.legs.slice().sort(function (x, y) { return new Date(x.start) - new Date(y.start); });
      var cm = isCmb && isCmb(a);
      var r = { lbl: (cm ? a.title : a.legs.length + "-fold acca") + " @ " + accaOdds(P), sub: (cm ? (a.meister === "tom" || a.meister === "meister" ? "Original Combo Meister" : "Combo Meister") : (a.meister === "tom" || a.meister === "meister") ? "Original Acca Meister" : "Acca Meister") + " · first leg " + fmtTime(legs[0].start).eat + " UK · our chance 1 in " + Math.round(1 / C).toLocaleString("en-GB"), event: esc(a.type), price: P, prob: C, edge: P * C - 1 };
      rows.push(r);
      return '<div class="data-rows">' + priceRowHTML(r) + '</div><details class="dp-legs"><summary>Show the ' + legs.length + " legs</summary>" + '<div class="data-rows">' + legs.map(function (l) { return priceRowHTML({ lbl: esc(l.sel), sub: fmtTime(l.start).eat + " UK", event: l.event, price: l.price, prob: l.chance, edge: l.price * l.chance - 1 }); }).join("") + "</div></details>";
    }).join("");
    return priceBar(rows, "these " + accas.length + (isCmb ? (accas.length === 1 ? " combo or acca" : " combos and accas") : accas.length === 1 ? " acca" : " accas") + " and every leg", inner);
  }
  function homePrice(el) {
    var seen = {}, groups = [];
    var add = function (title, rows) { rows = rows.filter(function (r) { var k = r.key; if (seen[k]) return false; seen[k] = 1; return true; }); if (rows.length) groups.push([title, rows]); };
    var tipR = function (t) { var r = tipPriceRow(t); r.key = t.id; return r; };
    add("Featured tips", heroIds().map(function (id) { return TIPS.filter(function (t) { return t.id === id; })[0]; }).filter(Boolean).map(tipR));
    add("Next tips", upcoming().slice(0, 4).map(tipR));
    var acc = [openAcca(function (a) { return a.legs.length <= 6; }), openAcca(function (a) { return a.legs.length > 6 && a.legs.length <= 10; })].filter(Boolean);
    /* Owner 12 Nov 12:26: each boxed acca is one row in the same style (whole-acca chance v price), with ALL its legs in a fold-out underneath (no de-duplication across accas) */
    var accaHTML = acc.map(function (a) {
      var P = a.legs.reduce(function (m, l) { return m * l.price; }, 1), C = a.legs.reduce(function (m, l) { return m * l.chance; }, 1);
      var legs = a.legs.slice().sort(function (x, y) { return new Date(x.start) - new Date(y.start); });
      var row = priceRowHTML({ lbl: a.legs.length + "-fold acca @ " + accaOdds(P), sub: "Acca Meister \u00b7 first leg " + fmtTime(legs[0].start).eat + " UK \u00b7 our chance 1 in " + Math.round(1 / C).toLocaleString("en-GB"), event: esc(a.type), price: P, prob: C, edge: P * C - 1 });
      return row + '<details class="dp-legs"><summary>Show the ' + legs.length + " legs</summary>" + '<div class="data-rows">' + legs.map(function (l) { return priceRowHTML({ lbl: esc(l.sel), sub: fmtTime(l.start).eat + " UK", event: l.event, price: l.price, prob: l.chance, edge: l.price * l.chance - 1 }); }).join("") + "</div></details>";
    }).join("");
    el.innerHTML = groups.length || acc.length ? groups.map(function (g) { return '<h3 class="dp-group">' + g[0] + '</h3><div class="data-rows">' + g[1].map(priceRowHTML).join("") + "</div>"; }).join("") +
      (acc.length ? '<h3 class="dp-group">Accas</h3><div class="data-rows dp-accas">' + accaHTML + "</div>" : "") + PRICE_LEGEND +
      '<p class="dp-more"><a href="/tips">Every open tip, day by day, on the Tips page →</a></p>' : '<p class="empty">The numbers appear with the next tips.</p>';
  }
  function dataPanel(el) {
    var cmUp = BM.CLOSE.filter(function (t) { return t.result === "open" && isP2(t) && new Date(t.start) > Date.now(); }).sort(byStart);
    var src = dp.meister === "close" ? cmUp : upcoming();
    if (!src.length) { el.innerHTML = '<p class="empty">The numbers appear with the next tips.</p>'; return; }
    var days = [], sports = [], ms = [];
    src.forEach(function (t) { var k = dayKey(t.start); if (days.indexOf(k) < 0) days.push(k); if (sports.indexOf(t.sport) < 0) sports.push(t.sport); if (ms.indexOf(t.meister) < 0) ms.push(t.meister); });
    days.sort(); sports.sort();
    var list = src.filter(function (t) { return (dp.meister === "all" || t.meister === dp.meister) && (dp.sport === "all" || t.sport === dp.sport) && (dp.day === "all" || dayKey(t.start) === dp.day); });
    var ek = function (t) { return locked(t) || edgeOf(t) == null ? -9 : edgeOf(t); };
    if (dp.sort === "edge") list.sort(function (x, y) { return ek(y) - ek(x); });
    else if (dp.sort === "chance") list.sort(function (x, y) { return (locked(y) ? 0 : 1 / y.price) - (locked(x) ? 0 : 1 / x.price); });
    var LIMIT = 8, shown = dp.all ? list : list.slice(0, LIMIT);
    var opt = function (v, label, cur) { return '<option value="' + esc(v) + '"' + (cur === v ? " selected" : "") + ">" + esc(label) + "</option>"; };
    var controls = '<div class="narrow dp-ctl">' +
      '<label class="nf"><span class="seg-label">Meister</span><select data-dp="meister">' + opt("all", "All Meisters", dp.meister) + MEISTERS.filter(function (m) { return ms.indexOf(m.id) >= 0; }).map(function (m) { return opt(m.id, m.name, dp.meister); }).join("") + (cmUp.length || dp.meister === "close" ? opt("close", "The Close Meister", dp.meister) : "") + "</select></label>" +
      '<label class="nf"><span class="seg-label">Sport</span><select data-dp="sport">' + opt("all", "All sports", dp.sport) + sports.map(function (x) { return opt(x, x, dp.sport); }).join("") + "</select></label>" +
      '<label class="nf"><span class="seg-label">Day</span><select data-dp="day">' + opt("all", "All days", dp.day) + days.map(function (k) { return opt(k, dayLabel(k), dp.day); }).join("") + "</select></label>" +
      '<label class="nf"><span class="seg-label">Sort</span><select data-dp="sort">' + opt("start", "Start time", dp.sort) + opt("edge", "Biggest edge", dp.sort) + opt("chance", "Most likely", dp.sort) + "</select></label></div>";
    var rows = shown.length ? '<div class="data-rows">' + shown.map(function (t) {
      var lock = locked(t), mkt = 1 / t.price, e = edgeOf(t), tm = fmtTime(t.start), m = meisterById(t.meister);
      return '<div class="data-row"><p class="lbl">' + (lock ? "Pro selection" : selHTML(t)) + "<span>" + tm.eat + " UK · " + esc(t.sport) + " · " + esc(m.short || m.name) + "</span><span>" + esc(t.event) + "</span></p>" +
        '<div class="bar-track" role="img" aria-label="Bookmaker chance ' + pct(mkt) + (t.prob ? ", our chance " + pct(t.prob) : "") + '"><div class="bar-fill" style="width:' + (lock ? 0 : mkt * 100).toFixed(1) + '%"></div>' +
        (t.prob && !lock ? '<span class="bar-mark" style="left:calc(' + (t.prob * 100).toFixed(1) + '% - 1.5px)"></span>' : "") + "</div>" +
        '<span class="num">' + (lock ? "–" : pct(mkt)) + (!lock && e != null ? '<span class="edge-chip ' + cls(e) + '" title="Edge">' + pct(e, true) + "</span>" : "") + "</span></div>";
    }).join("") + "</div>" : '<p class="empty">No open tips match these choices.</p>';
    var more = list.length > LIMIT ? '<p class="dp-more"><button type="button" class="pill small" data-dp-all>' + (dp.all ? "Show top " + LIMIT : "Show all " + list.length) + "</button> <span>" + shown.length + " of " + list.length + " shown</span></p>" : (list.length ? '<p class="dp-more"><span>' + list.length + " shown</span></p>" : "");
    el.innerHTML = controls + rows + more +
      '<div class="legend"><span><i style="background:var(--navy-3)"></i>Chance implied by the price</span><span><i style="background:var(--orange)"></i>Our chance (shown on live tips)</span><span><b class="edge-chip pos">+3.0%</b> <b class="edge-chip neg">−9.8%</b> Edge</span></div>' +
      '<dl class="explain"><div><dt>Implied chance</dt><dd>1 ÷ decimal price. A 2.00 price says 50%. It includes the bookmaker\'s margin, so it runs a little high.</dd></div>' +
      '<div><dt>Our chance</dt><dd>Our own estimate, written down before we look at the odds and kept for checking later.</dd></div>' +
      '<div><dt>Edge</dt><dd>Our chance × price − 1. From 20 Nov every Number Cruncher tip has an edge of +5% to +14%, the band where our record shows real value; +14% or more is treated as a price error and not tipped. NCM Pro = prices 2.00 to 5.99, our strongest range; NCM Free = everything else, open to everyone. <a href="/article-price-first">How it works</a>.</dd></div></dl>';
    $$("[data-dp]", el).forEach(function (sel) { sel.addEventListener("change", function () { dp[sel.getAttribute("data-dp")] = sel.value; dp.all = false; dataPanel(el); }); });
    var mb = $("[data-dp-all]", el); if (mb) mb.addEventListener("click", function () { dp.all = !dp.all; dataPanel(el); });
  }
  /* Owner 12 Nov 14:01: News and Reviews in the card style (header band, one tag row, fixed-height text, CTA) */
  var NEWS_COL = { Method: "#5AA9FF", Industry: "#A9B4C8", Preview: "#7CE38B", BetMeisters: "#FFC629" };
  function newsCard(s) {
    var col = NEWS_COL[s.category] || "#A9B4C8", d = new Date(s.date + "T12:00:00+03:00");
    var ds = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    return '<li class="ccard" style="border-top-color:' + col + '"><a class="ccard-a" href="' + s.href + '"><div class="ccard-hd"><p class="hc-label" style="color:' + col + '">' + esc(s.category) + "<small>" + ds + " · " + s.readMins + " min read</small></p></div>" +
      '<div class="ccard-tags"><span class="ccard-tag" style="box-shadow:inset 3px 0 0 ' + col + '">' + esc(s.category) + '</span><span class="ccard-tag">' + s.readMins + " min</span></div>" +
      '<h3 class="ccard-t">' + esc(s.title) + '</h3><p class="ccard-p">' + esc(s.standfirst) + '</p><span class="ccard-go">Read the story →</span></a></li>';
  }
  function newsBlock(el, n) {
    var list = BM.NEWS.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }).slice(0, n || 3);
    el.innerHTML = '<ul class="ccards c3">' + list.map(newsCard).join("") + "</ul>";
  }
  /* Owner 18 Nov 11:30: .com = tips; news and reviews come from BetMeisters.news (news_feed.js, refreshed at every .news batch) */
  var FEED_COL = { Guide: "#FFC629", News: "#A9B4C8", "Racing card": "#7CE38B", Football: "#5AA9FF", "Other sports": "#FF9F5A", "Big match preview": "#C79BFF", FPL: "#38E1C6", Preview: "#7CE38B" };
  function feedCard(a) {
    var col = FEED_COL[a.label] || "#A9B4C8", d = new Date(a.date), ds = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: SITE_TZ });
    return '<li class="ccard nf" style="border-top-color:' + col + '"><a class="ccard-a" href="' + esc(a.href) + '"><div class="ccard-hd"><p class="hc-label" style="color:' + col + '">' + esc(a.label) + "<small>" + ds + (a.read ? " · " + a.read + " min read" : "") + "</small></p></div>" +
      '<h3 class="ccard-t">' + esc(a.title) + '</h3><p class="ccard-p">' + esc(a.dek) + '</p><span class="ccard-go">' + (window.BM_MERGE ? "Read →" : "Read on BetMeisters.news ↗") + '</span></a></li>';
  }
  function feedNews(el) {
    var F = BM.NEWSFEED || { articles: [] }, L = F.articles || [];
    if ($("#news-more") && F.base) $("#news-more").href = F.base;
    el.innerHTML = L.length ? '<ul class="ccards c3 nf-grid">' + L.map(feedCard).join("") + "</ul>" : '<p class="empty">News, previews and guides are on <a href="' + esc(F.base || "#") + '" target="_blank" rel="noopener">BetMeisters.news</a>.</p>';
  }
  function feedReviews(el) {
    var F = BM.NEWSFEED || {}, R = F.reviews || [];
    el.innerHTML = R.length ? '<ul class="ccards c3">' + R.map(function (r) { return '<li class="ccard rv" style="border-top-color:var(--yellow)"><a class="ccard-a" href="' + esc(r.href) + '"><div class="ccard-hd"><p class="hc-label" style="color:var(--yellow)">' + esc(r.name) + '<small>' + esc(r.kind || "Bookmaker review") + '</small></p></div><p class="ccard-p">' + esc(r.summary) + '</p><span class="ccard-go">' + (window.BM_MERGE ? "Read the review →" : "Read on BetMeisters.news ↗") + '</span></a></li>'; }).join("") + "</ul>" :
      '<div class="nf-soon"><p><b>Bookmaker reviews are coming to BetMeisters.news.</b> Every operator scored on evidence: licence, prices, payments and safer gambling tools.</p><a class="more" href="' + esc(F.base || "#") + '" target="_blank" rel="noopener">Visit BetMeisters.news ↗</a></div>';
  }
  function reviewRegion(r) { var t = r.summary + " " + r.name; return /crypto|Curaçao|Anjouan/i.test(t) ? "Crypto" : /US states|US sportsbook|Big US/i.test(t) ? "US" : /South Africa/i.test(t) ? "South Africa" : "UK & Ireland"; }
  function reviewCard(r) {
    var reg = reviewRegion(r), ini = esc(r.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase());
    return '<li class="ccard rv" style="border-top-color:var(--yellow)"><a class="ccard-a" href="' + r.href + '"><div class="ccard-hd"><span class="mono-badge sm" aria-hidden="true">' + ini + '</span><p class="hc-label" style="color:var(--yellow)">' + esc(r.name) + "<small>Bookmaker review</small></p></div>" +
      '<div class="ccard-tags"><span class="ccard-tag" style="box-shadow:inset 3px 0 0 var(--yellow)">' + reg + '</span><span class="ccard-tag">No commissions</span></div>' +
      '<p class="ccard-p">' + esc(r.summary) + '</p><p class="ccard-best"><b>Best for:</b> ' + esc(r.bestFor) + '</p><span class="ccard-go">Read the review →</span></a></li>';
  }
  function reviewCards(el, homeOnly) {
    /* Owner 12 Nov 14:04: rows of three (home: one row; Reviews page: full rows of three) */
    var ord = { "UK & Ireland": 0, US: 1, "South Africa": 2, Crypto: 3 };
    var list = homeOnly ? BM.REVIEWS.slice().sort(function (a, b) { return ord[reviewRegion(a)] - ord[reviewRegion(b)]; }).slice(0, 6) : BM.REVIEWS; /* Owner 12 Nov 14:07: home shows two rows of three, UK & Ireland first */
    el.innerHTML = '<ul class="ccards c3">' + list.map(reviewCard).join("") + "</ul>";
  }

  /* Owner 12 Nov 15:21: tab bar in the filter-pill style, used on Meisters, News and Reviews */
  function tabBar(el, label, tabs, cur, onPick) {
    el.innerHTML = '<div class="filters pg-tabs" role="tablist" aria-label="' + esc(label) + '"><span class="seg-label">' + esc(label) + "</span>" + tabs.map(function (t) {
      return '<button type="button" class="pill" role="tab" data-tab="' + esc(t[0]) + '" aria-pressed="' + (t[0] === cur) + '" aria-selected="' + (t[0] === cur) + '">' + (t[2] ? '<span class="mdot" style="background:' + t[2] + '"></span>' : "") + esc(t[1]) + (t[3] != null ? ' <b class="tab-n">' + t[3] + "</b>" : "") + "</button>"; }).join("") + "</div>";
    $$("[data-tab]", el).forEach(function (b) { b.addEventListener("click", function () { onPick(b.getAttribute("data-tab")); }); });
  }
  /* ---------- filters (tips & results pages) ---------- */
  var filt = { tier: "all", meister: "all", when: "all", day: "all", sport: "all", bt: "all", q: "", edge: 0 };
  function betType(t) {
    if (t.betType) return t.betType;
    var m = (t.market || "") + " " + (t.selection || "");
    var R = [[/double|treble|acca|accumulator/i, "Multiple"], [/scorecast|wincast/i, "Scorecast"], [/goalscorer|to score/i, "Goalscorer"],
      [/both teams/i, "BTTS"], [/correct score|exact score/i, "Correct score"], [/half.?time ?\/ ?full.?time|ht\/ft/i, "Half-time/Full-time"],
      [/corner/i, "Corners"], [/card|booking/i, "Cards"], [/draw no bet/i, "Draw no bet"], [/double chance/i, "Double chance"],
      [/handicap|spread|puck line/i, "Handicap"], [/player|points|rebounds|assists|shots|aces|passing|rushing|receiving/i, "Player props"],
      [/set betting|sets|frame/i, "Set / frame betting"], [/forecast|tricast/i, "Forecast"], [/first half|1st half|second half|2nd half|quarter|period/i, "Half / period"],
      [/total|over|under/i, "Over/Under"], [/outright|to win the|winner of|top scorer|relegat|promot/i, "Outright"]];
    for (var i = 0; i < R.length; i++) if (R[i][0].test(m)) return R[i][1];
    if (t.ew || /each way/i.test(m)) return "Each way";
    return "Win / match result";
  }
  function dayLabel(k) {
    var today = dayKey(new Date().toISOString()), tmr = dayKey(new Date(Date.now() + 864e5).toISOString()), yst = dayKey(new Date(Date.now() - 864e5).toISOString());
    var d = new Date(k + "T12:00:00+03:00"), nice = new Intl.DateTimeFormat("en-GB", { timeZone: SITE_TZ, weekday: "long", day: "numeric", month: "long" }).format(d);
    return (k === today ? "Today · " : k === tmr ? "Tomorrow · " : k === yst ? "Yesterday · " : "") + nice;
  }
  /* day / sport / search controls; options come from the list on screen */
  function narrowBar(el, list, onChange) {
    if (!el) return;
    var days = [], sports = [], bts = [];
    var onTips = document.body.getAttribute("data-page") === "tips"; /* Owner 25 Nov 11:13: Tips lists only sports and bet types we have open tips in; Results keeps every sport ever tipped */
    list.forEach(function (t) { var k = dayKey(t.start); if (days.indexOf(k) < 0) days.push(k); if (onTips && t.result !== "open") return; if (sports.indexOf(t.sport) < 0) sports.push(t.sport); var bt = betType(t); if (bts.indexOf(bt) < 0) bts.push(bt); });
    days.sort(); sports.sort();
    if (filt.day !== "all" && days.indexOf(filt.day) < 0) days.push(filt.day);
    if (filt.sport !== "all" && sports.indexOf(filt.sport) < 0) sports.push(filt.sport);
    /* Owner 9 Nov 09:45: Search was glitchy. Cause: every keystroke / change re-built the whole bar, so a tap on Search could land on
       a button that had just been replaced. Now the bar is built once and only re-built when its options change; typing is debounced. */
    var sig = JSON.stringify([days, sports, bts.slice().sort(), filt.day, filt.sport, filt.bt]);
    if (el.__bmSig === sig && $("#f-q", el)) { el.__bmOnChange = onChange; if (document.activeElement !== $("#f-q", el)) $("#f-q", el).value = filt.q; return; }
    el.__bmSig = sig; el.__bmOnChange = onChange;
    onChange = function () { el.__bmOnChange(); };
    var hadFocus = document.activeElement && document.activeElement.id === "f-q", caret = hadFocus ? document.activeElement.selectionStart : 0;
    el.innerHTML = '<div class="narrow">' +
      '<label class="nf"><span class="seg-label">Day</span><select id="f-day"><option value="all">All days</option>' + days.map(function (k) { return '<option value="' + k + '"' + (filt.day === k ? " selected" : "") + ">" + esc(dayLabel(k)) + "</option>"; }).join("") + "</select></label>" +
      '<label class="nf"><span class="seg-label">Sport</span><select id="f-sport"><option value="all">All sports</option>' + sports.map(function (x) { return '<option' + (filt.sport === x ? " selected" : "") + ">" + esc(x) + "</option>"; }).join("") + "</select></label>" +
      '<label class="nf"><span class="seg-label">Bet type</span><select id="f-bt"><option value="all">All bet types</option>' + bts.sort().map(function (x) { return '<option' + (filt.bt === x ? " selected" : "") + ">" + esc(x) + "</option>"; }).join("") + "</select></label>" +
      '<label class="nf nf-q"><span class="seg-label">Event</span><input id="f-q" type="search" placeholder="Team, horse, race, league" value="' + esc(filt.q) + '"></label>' +
      '<div class="nf-btns"><button type="button" class="pill small nf-go" data-search>Search</button><button type="button" class="pill small" data-clear>Clear</button><button type="button" class="pill small" data-expand="1">Expand all</button><button type="button" class="pill small" data-expand="0">Collapse all</button></div></div>';
    $("#f-day", el).addEventListener("change", function (e) { filt.day = e.target.value; onChange(); });
    $("#f-sport", el).addEventListener("change", function (e) { filt.sport = e.target.value; onChange(); });
    $("#f-bt", el).addEventListener("change", function (e) { filt.bt = e.target.value; onChange(); });
    var qT = null;
    $("#f-q", el).addEventListener("input", function (e) { filt.q = e.target.value; clearTimeout(qT); qT = setTimeout(onChange, 250); });
    $("#f-q", el).addEventListener("search", function (e) { filt.q = e.target.value; clearTimeout(qT); onChange(); });
    /* Owner 5 Nov 11:46: explicit Search button (filters also apply as you change them); Enter in the event box searches too */
    var go = function () { clearTimeout(qT); filt.day = $("#f-day", el).value; filt.sport = $("#f-sport", el).value; filt.bt = $("#f-bt", el).value; filt.q = $("#f-q", el).value; onChange(); };
    $("[data-search]", el).addEventListener("click", go);
    $("#f-q", el).addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); go(); } });
    $("[data-clear]", el).addEventListener("click", function () { clearTimeout(qT); filt.day = "all"; filt.sport = "all"; filt.bt = "all"; filt.q = ""; $("#f-q", el).value = ""; onChange(); });
    $$("[data-expand]", el).forEach(function (b) { b.addEventListener("click", function () { var open = b.getAttribute("data-expand") === "1"; $$("details.trow").forEach(function (d) { d.open = open; }); }); });
    if (hadFocus) { var q = $("#f-q", el); q.focus(); try { q.setSelectionRange(caret, caret); } catch (e) { } }
  }
  function narrow(list) {
    var q = filt.q.trim().toLowerCase();
    return list.filter(function (t) {
      return (filt.day === "all" || dayKey(t.start) === filt.day) && (filt.sport === "all" || t.sport === filt.sport) && (filt.bt === "all" || betType(t) === filt.bt) &&
        (!q || [t.event, t.comp, t.sport, locked(t) ? "" : t.selection].join(" ").toLowerCase().indexOf(q) >= 0);
    });
  }
  /* compact row: one line per tip, opens to the full card */
  function tipRow(t) {
    var tm = fmtTime(t.start), lock = locked(t), done = t.result !== "open";
    var right = done
      ? '<span class="res ' + t.result + '"' + resTitle(t) + '>' + resTxt(t) + '</span><span class="tr-pl pts ' + cls(profit(t)) + '">' + pts(profit(t)) + "</span>"
      : '<span class="tr-price">' + (lock ? "–" : fmtOdds(t.price)) + '</span><span class="tr-stake">' + stakeLbl(t) + "</span>";
    return '<details class="trow" data-tier="' + t.tier + '"><summary>' +
      '<span class="tr-time">' + tm.eat + ' UK' + ALT(tm, "<small>", "</small>") + '</span>' +
      '<span class="tr-main"><span class="tr-sel">' + (lock ? ICON.lock + " Pro tip" : selHTML(t)) + '</span><span class="tr-ev">' + (t.combo ? t.legs.map(function (l) { return esc(l.sel) + " @ " + fmtOdds(l.price) + " (" + esc(l.event) + ")"; }).join(" \u00b7 ") : esc(t.event) + " · " + esc(t.sport) + (t.comp && t.comp !== t.sport ? " · " + esc(t.comp) : "")) + "</span></span>" +
      '<span class="tr-tags">' + tierPill(t) + '<span class="badge ' + t.meister + '" title="' + esc(meisterById(t.meister).name) + '">' + esc(meisterById(t.meister).initials) + "</span>" + secTag(t) + extraTags(t) + "</span>" +
      '<span class="tr-right">' + right + '</span><span class="tr-chev" aria-hidden="true"></span></summary>' +
      '<div class="tr-body"><ul class="htips one">' + homeTip(t) + "</ul></div></details>";
  }
  function tipList(list, emptyMsg, newestFirst, withPrice) {
    if (!list.length) return '<div class="empty">' + emptyMsg + "</div>";
    var groups = [], cur = null;
    list.forEach(function (t) { var k = dayKey(t.start); if (!cur || cur.k !== k) { cur = { k: k, items: [] }; groups.push(cur); } cur.items.push(t); });
    return groups.map(function (g) {
      return '<section class="tday"><h3 class="tday-h">' + esc(dayLabel(g.k)) + ' <span class="count">' + g.items.length + (g.items.length === 1 ? " tip" : " tips") + '</span></h3><div class="tlist">' + g.items.map(tipRow).join("") + "</div>" + (withPrice ? dayPrice(g.items) : "") + "</section>";
    }).join("");
  }
  function filterBar(el, onChange) {
    var tiers = [["all", "All tiers", null], ["free", "NCM Free", TIER_COLOR.free], ["pro", "NCM Pro", TIER_COLOR.pro], ["pfree", "NCMP Free", "#C9B6FF"], ["ppro", "NCMP Pro", "#6B46C1"], ["racing", "NCMR", "#B5651D"], ["combo", "Combo", "#2196D3"], ["nap", "NAP", TIER_COLOR.nap]]; /* Owner 26 Nov: Pro Picks and Meister Special filters retired */ /* Owner 20 Nov 20:21: Premium League filter */
    /* Owner 5 Nov 11:47: Phase 2 has three Meisters; the Drift and Close Meister and Best Value filters are gone (their records stay in the data) */
    if (["allwith", "removed", "close"].indexOf(filt.meister) >= 0) filt.meister = "all";
    if (filt.tier === "value") filt.tier = "all";
    var ms = [["all", "All Meisters"]].concat(MEISTERS.filter(function (m) { return m.id !== "removed"; }).map(function (m) { return [m.id, m.name]; }));
    el.innerHTML = '<div class="filters" role="group" aria-label="Filter by tier"><span class="seg-label">Tier</span>' + tiers.map(function (t) { return '<button type="button" class="pill" data-ft="' + t[0] + '" aria-pressed="' + (filt.tier === t[0]) + '">' + (t[2] ? '<span class="dot" style="background:' + t[2] + '"></span>' : "") + t[1] + "</button>"; }).join("") + "</div>" +
      '<div class="filters" role="group" aria-label="Filter by Meister"><span class="seg-label">Meister</span>' + ms.map(function (m) { return '<button type="button" class="pill" data-fm="' + m[0] + '" aria-pressed="' + (filt.meister === m[0]) + '">' + (MCOLOR[m[0]] ? '<span class="dot" style="background:' + MCOLOR[m[0]] + '"></span>' : "") + esc(m[1]) + "</button>"; }).join("") + "</div>";
    $$("[data-ft]", el).forEach(function (b) { b.addEventListener("click", function () { filt.tier = b.getAttribute("data-ft"); filterBar(el, onChange); onChange(); }); });
    $$("[data-fm]", el).forEach(function (b) { b.addEventListener("click", function () { filt.meister = b.getAttribute("data-fm"); filterBar(el, onChange); onChange(); }); });
    /* Owner 12 Nov 10:41: minimum-edge filter, 1 to 25%, type a number or use the slider */
    var ed = document.createElement("div"); ed.className = "filters edge-filter"; ed.setAttribute("role", "group"); ed.setAttribute("aria-label", "Filter by minimum edge");
    ed.innerHTML = '<span class="seg-label">Min edge</span><input type="range" min="0" max="25" step="1" value="' + filt.edge + '" aria-label="Minimum edge slider"><input type="number" min="1" max="25" step="1" inputmode="numeric" placeholder="1-25" value="' + (filt.edge || "") + '" aria-label="Minimum edge in percent"><span class="edge-unit">%</span><span class="edge-read">' + (filt.edge ? "Edge " + filt.edge + "% or more" : "Any edge") + '</span>' + (filt.edge ? '<button type="button" class="pill" data-fe-clear>Clear</button>' : "");
    el.appendChild(ed);
    var rng = ed.querySelector('input[type="range"]'), num = ed.querySelector('input[type="number"]'), rd = ed.querySelector(".edge-read");
    var setE = function (v, from) { v = Math.max(0, Math.min(25, Math.round(+v || 0))); filt.edge = v; if (from !== "r") rng.value = v; if (from !== "n") num.value = v || ""; rd.textContent = v ? "Edge " + v + "% or more" : "Any edge"; onChange(); };
    rng.addEventListener("input", function () { setE(rng.value, "r"); });
    num.addEventListener("input", function () { setE(num.value, "n"); });
    var clr = ed.querySelector("[data-fe-clear]"); if (clr) clr.addEventListener("click", function () { filt.edge = 0; filterBar(el, onChange); onChange(); });
  }
  function applyFilt(list) {
    return list.filter(function (t) {
      return (filt.tier === "all" || (filt.tier === "nap" ? t.nap : filt.tier === "hnap" ? t.humanNap : filt.tier === "value" ? t.value : filt.tier === "special" ? t.special : filt.tier === "premium" ? isPremium(t) : filt.tier === "propick" ? t.proPick : filt.tier === "human" ? t.human : filt.tier === "free" ? isNF(t) : filt.tier === "pro" ? isNP(t) : filt.tier === "pfree" ? (t.meister === "ncmp" && t.tier !== "pro") : filt.tier === "ppro" ? (t.meister === "ncmp" && t.tier === "pro") : filt.tier === "racing" ? t.meister === "ncmr" : filt.tier === "combo" ? t.meister === "combo" : t.tier === filt.tier)) && (filt.meister === "all" ? !isRemoved(t) : filt.meister === "allwith" ? true : t.meister === filt.meister) && (!filt.edge || (edgeOf(t) != null && edgeOf(t) * 100 >= filt.edge - 1e-9));
    });
  }

  /* ---------- Phase 2 views (rebuild, 6 Nov) ---------- */
  /* Owner 25 Nov 12:24: one short dated list, the same as 'About these numbers' on the Performance page */
  var CHANGE_NOTE = '<p class="change-note"><b>5 November:</b> the record starts. Every tip is published before the start with its price and stake, and stays on the record.<br><b>10 November:</b> AI tips published 5 to 9 November under TOM moved to the Number Cruncher. No result, price or stake changed; only the Meister label.<br><b>16 November:</b> the Combo Meister starts as a trial.<br><b>19 November:</b> the NCM Racing Meister starts its own record, with the exchange method; earlier racing tips stay in the full record.<br><b>25 November:</b> The Original Meister (TOM) and the Acca Meister retire; their tips, combos and accas stay in our full ledger and are left out of these numbers. TOM stays with us as a human voice. The Combo Meister becomes a full Meister and NCM Premium Events starts: four Meisters, the Number Cruncher first.</p>';
  var P2M = ["cruncher", "ncmp", "ncmr", "combo"]; /* Owner 25 Nov 10:46: Combo Meister joins as the 4th Meister */ /* Owner 25 Nov 09:50: NCM Premium Events, own record, in site totals */ /* Owner 25 Nov: TOM retired */ /* Owner 20 Nov 10:53: NCM Racing Meister, own record, still in site totals */ /* Owner 9 Nov 08:15: Fine Margins retired; its tips stay in the site totals and the data, but it has no lines, cards, charts or open-tip rows of its own */
  var SPORTC = { F: "#2E9E5B", R: "#B5651D", T: "#B8A200", B: "#FF8A00", U: "#C8102E", O: "#8A5CD1", E: "#0E9AA7" };
  var SPK = ["F", "R", "T", "B", "U", "O", "E"]; /* Owner 10 Nov 08:57: basketball is its own sport; NBA and college games also carry a US tag */ /* Owner 8 Nov 19:11: eSports is its own sport */
  var SPORTN = { F: "Football", R: "Racing", T: "Tennis", B: "Basketball", U: "US sports", O: "Other sports", E: "eSports" };
  var SPORTDASH = { F: "", R: "7 4", T: "2 4", O: "10 3 2 3" };
  var MCODE = { combo: "CM", ncmp: "NCMP", tomret: "TOM", ncmrold: "NCMROLD", tomold: "AHT", meister: "TOM", cruncher: "NCM", ncmr: "NCMR", margins: "FMM" };
  function p2() { return TIPS.filter(function (t) { return isP2(t) && !isRemoved(t) && !isRetired(t); }); } /* Owner 16 Nov 07:41: every total counts LIVE Meisters only (retired FMM left out everywhere) */
  function p2Set() { return p2().filter(function (t) { return t.result !== "open"; }).sort(byStart); }
  function sportK(t) { if (t.sport === "Esports") return "E"; var c = secOf(t); return c ? c.slice(-1) : "O"; }
  /* Owner 8 Nov 19:11: TOM's personal (manual, non-stats) picks tracked separately */
  function isPersonal(t) { return t.meister === "meister" && !!t.personal; }
  function measures(list) {
    var s = stats(list), exp = 0, expW = 0, wins = 0, ed = 0, ne = 0, cl = 0, beat = 0;
    list.forEach(function (t) {
      var e = edgeOf(t);
      if (e != null) { ed += e; ne++; }
      if (t.result === "open" || t.result === "void") return;
      if (e != null) exp += t.stake * e;
      if (t.prob) expW += t.prob;
      if (t.result === "won") wins++;
      if (typeof t.close === "number") { cl++; if (t.close < t.price) beat++; }
    });
    s.exp = exp; s.expW = expW; s.wins = wins; s.avgEdge = ne ? ed / ne : null; s.closeN = cl; s.beat = cl ? beat / cl : null;
    return s;
  }
  function tile(label, big, sub, c) { return '<div class="hl-tile"><p class="hl-label">' + label + '</p><p class="hl-big ' + (c || "") + '">' + big + '</p><p class="hl-sub">' + sub + "</p></div>"; }
  /* Owner 6 Nov 09:46: average odds = simple average of the published price over every non-void tip */
  function avgOdds(list) { var l = list.filter(function (t) { return t.result !== "void" && t.price; }), sum = 0; l.forEach(function (t) { sum += t.price; }); return l.length ? { v: sum / l.length, n: l.length } : null; }
  function oddsTxt(a) { return a ? a.v.toFixed(2) : "–"; }
  function headline(el, list, opt) {
    var m = measures(list), d = m.profit - m.exp, dw = m.wins - m.expW, r1 = function (x) { return Math.round(x * 10) / 10; };
    var h = tile("Running profit", pts(m.profit) + "<small>pts</small>", m.settled + m.void + " settled · " + pts(m.staked).replace("+", "") + " pts staked · ROI " + pct(m.roi, true), cls(m.profit)) +
      tile("Profit v expected", (d >= 0 ? "+" : "−") + Math.abs(d).toFixed(2) + "<small>pts</small>", "Made " + pts(m.profit) + " pts; our edges expected " + pts(m.exp), cls(d)) +
      (function () { var cv = clvStats(list); return tile("Average CLV", clvTxt(cv.avg), cv.n ? cv.n + " tips v the fair price at the close" : "Measured from each tip's closing price", cv.avg == null ? "" : cls(cv.avg)); })() +
      tile("Beat SP / closing price", m.beat == null ? "–" : pct(m.beat), m.closeN ? m.closeN + " tips so far: racing v SP, other sports v the closing fair price" : "Closing prices tracked from 6 Nov", m.beat == null ? "" : m.beat >= 0.5 ? "pos" : "neg") +
      tile("Average edge", m.avgEdge == null ? "–" : pct(m.avgEdge, true), "Across every tip published", "");
    /* Owner 19 Nov 19:26: even number of boxes everywhere (6 without the odds block, 8 with it) */
    if (!(opt && opt.odds)) { var dec0 = m.won + m.lost; h += tile("Strike rate", dec0 ? pct(m.won / dec0) : "–", m.won + " won of " + dec0 + " decided (voids out) · our chances expected " + m.expW.toFixed(1), ""); }
    if (opt && opt.odds) {
      var pr = avgOdds(list.filter(isNP)), fr = avgOdds(list.filter(isNF));
      h += tile("Average odds · NCM Pro", oddsTxt(pr), pr ? pr.n + " NCM Pro tips" : "No NCM Pro tips yet", "") + tile("Average odds · NCM Free", oddsTxt(fr), fr ? fr.n + " NCM Free tips" : "No NCM Free tips yet", "");
      var dec = m.won + m.lost; h += tile("Strike rate", dec ? pct(m.won / dec) : "–", m.won + " won of " + dec + " decided (voids out) · average odds " + oddsTxt(avgOdds(list)), "");
    }
    el.innerHTML = '<div class="hl-grid' + (opt && opt.odds ? " hl7" : " hl6") + '">' + h + "</div>";
  }
  function oddsTable(list) {
    var cols = [["All", function () { return true; }], ["NCM Pro", isNP], ["NCM Free", isNF]].concat(SPK.map(function (k) { return [SPORTN[k], function (t) { return sportK(t) === k; }]; }));
    cols = cols.filter(function (c, i) { return i === 0 || list.some(c[1]); });
    return '<div class="odds-row"><p class="eyebrow">Average odds</p><div class="odds-cells' + (cols.length > 7 ? " many" : "") + '" style="--n:' + cols.length + '">'  + cols.map(function (c) { var a = avgOdds(list.filter(c[1])); return '<div class="oc"><span>' + c[0] + "</span><b>" + oddsTxt(a) + "</b><small>" + (a ? a.n + (a.n === 1 ? " tip" : " tips") : "none yet") + "</small></div>"; }).join("") + "</div></div>";
  }
  function p2Board(el) {
    var L = p2();
    /* Owner 20 Nov 09:36: group the boxes by who feeds them: NCM only, then TOM only, then the boxes any Meister can feed. Each group flows on from the last. */
    var rac = function (f) { return L.filter(function (t) { return sportK(t) === "R" && f(t); }); };
    var grp = function (code, col, title, sub) { return '<div class="perf-group" style="--gc:' + col + '"><p class="perf-group-k">' + code + '</p><div><h3>' + title + '</h3><p>' + sub + "</p></div></div>"; };
    var meisterCard = function (id) { var ml = L.filter(function (t) { return t.meister === id; }); if (window.BM_PERF2) { MKEY = setKey(ml); MOPEN = ml.filter(function (t) { return t.result === "open"; }).length; if (!MKEY) { MEMPTY = true; EMP = []; return ""; } } return scoreCard(MSHORT[id], L.filter(function (t) { return t.meister === id; }), { color: MCOLOR[id], sub: MCODE[id] + " \u00b7 " + MSUB[id] }); };
    var lead = function (t) { return typeof t.leadMin === "number" ? t.leadMin : (new Date(t.start) - new Date(t.published)) / 60000; };
    var v2 = rac(function (t) { return t.racingMethod === "v2" && t.meister === "ncmr"; });
    var NR = function (f) { return L.filter(function (t) { return t.meister === "ncmr" && f(t); }); };
    var NC = function (f) { return L.filter(function (t) { return t.meister === "cruncher" && f(t); }); };
    var TM = function (f) { return L.filter(function (t) { return t.meister === "meister" && f(t); }); };
    var chart = (function () {
        var napL = L.filter(function (t) { return t.nap; }), hnL = L.filter(function (t) { return t.humanNap; });
        var line = function (list) { var c = 0; return list.filter(function (t) { return t.result !== "open"; }).sort(byStart).map(function (t) { c += profit(t); return c; }); };
        var a = line(napL), b = line(hnL), all = [0].concat(a, b), mx = Math.max.apply(null, all.map(Math.abs).concat([1])), n = Math.max(a.length, b.length, 1);
        var W = 520, H = 190, P = 24, X = function (i) { return P + (W - 2 * P) * (i / Math.max(n, 1)); }, Y = function (v) { return H / 2 - (H / 2 - P) * v / mx; };
        var path = function (arr, col) { if (!arr.length) return ""; var d = "M" + X(0) + "," + Y(0) + arr.map(function (v, i) { return " L" + X(i + 1).toFixed(1) + "," + Y(v).toFixed(1); }).join(""); return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' + '<circle cx="' + X(arr.length).toFixed(1) + '" cy="' + Y(arr[arr.length - 1]).toFixed(1) + '" r="4.5" fill="' + col + '"/>'; };
        var lastTxt = function (arr) { return arr.length ? (arr[arr.length - 1] >= 0 ? "+" : "\u2212") + Math.abs(arr[arr.length - 1]).toFixed(2) + " pts" : "no settled NAPs yet"; };
        var svg = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="NCM NAP v TOM NAP running points" style="width:100%;height:auto;display:block">' +
          '<line x1="' + P + '" x2="' + (W - P) + '" y1="' + Y(0) + '" y2="' + Y(0) + '" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="4 4"/>' + path(a, TIER_COLOR.nap) + path(b, TIER_COLOR.hnap) + "</svg>";
        var chart = '<section class="score napvnap" style="grid-column:span 2;--sc:' + TIER_COLOR.hnap + '"><div class="score-top"><div class="score-title"><h3 class="score-name long">NCM NAP v TOM NAP</h3><p class="score-sub">Running points, each NAP at 1.5 pt, in settled order: the stats against TOM\u2019s pick</p></div><span class="score-mark hnap" aria-hidden="true"></span></div>' +
          '<div style="padding:8px 16px 14px">' + svg + '<p style="margin-top:8px;font-size:14px;color:#4A556B"><b style="color:' + TIER_COLOR.nap + '">\u25cf NAP</b> ' + a.length + " settled \u00b7 " + lastTxt(a) + ' &nbsp; <b style="color:' + TIER_COLOR.hnap + '">\u25cf NAP \u00b7 TOM</b> ' + b.length + " settled \u00b7 " + lastTxt(b) + "</p></div></section>";
        return chart;
    })();
    /* Owner 25 Nov 11:51 (performance draft, window.BM_PERF2): boxes with no settled tip yet fold into one line under their group, so every group shows only real records */
    var EMP = [];
    var MKEY = "", MOPEN = 0, MEMPTY = false;
    var setKey = function (l) { return l.filter(function (t) { return t.result !== "open" && t.result !== "void"; }).map(function (t) { return t.id; }).sort().join(","); };
    var SC = function (n, l, o) { if (window.BM_PERF2) { var k = setKey(l); if (!k) { EMP.push(n); return ""; } if (k === MKEY) return ""; /* same tips as the Meister's own box */ } return scoreCard(n, l, o); };
    var endG = function () { var h = (MEMPTY ? '<p class="perf-empty"><b>The record starts with the first result.</b> ' + MOPEN + " tip" + (MOPEN === 1 ? " is" : "s are") + " open now; every box fills in as they settle.</p>" : EMP.length ? '<p class="perf-empty">No settled tips yet: ' + EMP.map(esc).join(" · ") + ". They appear here after their first result.</p>" : ""); EMP = []; MEMPTY = false; return "</div>" + h; };
    el.innerHTML =
      /* Owner 20 Nov 18:44: every Meister group is the same shape, two rows of four: row 1 = Meister, NAP (always the first special, the most premium tip), then the next specials; row 2 = tiers and sports. */
      grp("NCM", MCOLOR.cruncher, "Number Cruncher Meister only", "AI-assisted: stats and maths, every sport except horse racing. Every box here is NCM tips only.") +
      '<div class="score-grid g4">' +
      meisterCard("cruncher") +
      SC("NCM Pro", L.filter(isNP), { tier: "pro", sub: "Our elite tips: prices 2.00 to 5.99" }) +
      SC("NCM Free", L.filter(isNF), { tier: "free", sub: "Open to everyone" }) +
      SC("Football \u00b7 NCM", NC(function (t) { return sportK(t) === "F"; }), { color: SPORTC.F, sub: "NCM football tips" }) +
      endG() +
      /* Owner 25 Nov: TOM retired, his group removed (record kept in data.js and the Ledger) */
      /* Owner 20 Nov 18:27: NCMR = exchange method from 19 Nov only (old method retired as NCMROLD) */
      grp("NCMP", MCOLOR.ncmp, "NCM Premium Events only", "Big games, small edges: the Number Cruncher on the biggest events, every tip with a positive edge from 1.5%. Its record starts on 25 November.") +
      '<div class="score-grid g4">' +
      meisterCard("ncmp") +
      SC("NCMP Pro", L.filter(function (t) { return t.meister === "ncmp" && t.tier === "pro"; }), { tier: "pro", sub: "Edge 4.5% to 13.49%" }) +
      SC("NCMP Free", L.filter(function (t) { return t.meister === "ncmp" && t.tier !== "pro"; }), { tier: "free", sub: "Edge 1.5% to 4.49%" }) +
      SC("Football \u00b7 NCMP", L.filter(function (t) { return t.meister === "ncmp" && sportK(t) === "F"; }), { color: SPORTC.F, sub: "Top leagues and European competitions" }) +
      endG() +
      grp("NCMR", MCOLOR.ncmr, "NCM Racing Meister only", "The Number Cruncher's horse racing, as its own Meister. Its record starts on 19 November, with the exchange method.") +
      '<div class="score-grid g4">' +
      meisterCard("ncmr") +
      SC("NCMR Pro", NR(function (t) { return t.tier === "pro"; }), { tier: "pro", sub: "Racing Pro tips" }) +
      SC("NCMR Free", NR(function (t) { return t.tier !== "pro"; }), { tier: "free", sub: "Racing Free tips" }) +
      /* Owner 26 Nov 10:01: four boxes per Meister (Meister, Pro, Free + one); the racing NAP takes the fourth box (shown even before its first result) */
      scoreCard("Racing NAP", NR(function (t) { return t.nap; }), { tier: "nap", sub: "1.5 pt, racing only, from 26 Nov" }) +
      endG() +
      grp("CM", MCOLOR.combo, "Combo Meister only", "Doubles and trebles, every leg priced above our fair price. A separate trial from 16 November, a full Meister from 25 November.") +
      '<div class="score-grid g4">' +
      meisterCard("combo") +
      SC("Doubles", L.filter(function (t) { return t.meister === "combo" && t.legs && t.legs.length === 2; }), { color: "#2196D3", sub: "Two-leg combos, 1 point" }) +
      SC("Trebles", L.filter(function (t) { return t.meister === "combo" && t.legs && t.legs.length === 3; }), { color: "#2196D3", sub: "Three-leg combos, half a point" }) +
      SC("Football combos", L.filter(function (t) { return t.meister === "combo" && t.sport === "Football"; }), { color: SPORTC.F, sub: "Every leg football" }) +
      endG() +
      /* Owner 26 Nov 10:01: "From any Meister" group removed with Meister Specials */
      REC_KEY;
  }

  /* Owner 14 Nov 09:28: PRO PICKS = the day's best five Pro tips (never a NAP or Special), from 14 Nov; own stat boxes, chart and day-by-day record */
  /* Owner 17 Nov 10:20: Pro Picks made visible every day: home strip, a results line, a page */
  function todaysProPicks() {
    var today = dayKey(new Date().toISOString());
    return p2().filter(function (t) { return t.proPick && (dayKey(t.proPickAt || t.published) === today || dayKey(t.start) === today); }).sort(byStart);
  }
  function priceBand(p) { return p < 1.8 ? "odds-on" : p < 2.2 ? "around evens" : p < 3.1 ? "6/5 to 2/1" : p < 5 ? "2/1 to 4/1" : "4/1 or bigger"; }
  function proPicksLine() {
    var L = p2().filter(function (t) { return t.proPick; });
    if (!L.length) return "";
    var d = new Date(); d.setDate(d.getDate() - 1); var yk = dayKey(d.toISOString());
    var cnt = function (X) { var o = { won: 0, lost: 0, void: 0, open: 0, pts: 0 }; X.forEach(function (t) { if (t.result === "open") o.open++; else if (t.result === "void") o.void++; else if (/won/.test(t.result)) o.won++; else o.lost++; if (t.result !== "open") o.pts += profit(t); }); o.settled = o.won + o.lost; return o; };
    var Y = L.filter(function (t) { return dayKey(t.start) === yk; }), sy = cnt(Y), sa = cnt(L);
    var pts = function (x) { return (x >= 0 ? "+" : "\u2212") + Math.abs(x).toFixed(2) + " pts"; };
    var ys = !Y.length ? "none picked" : sy.settled ? sy.won + " won, " + sy.lost + " lost" + (sy.void ? ", " + sy.void + " void" : "") + ', <b class="' + (sy.pts >= 0 ? "pos" : "neg") + '">' + pts(sy.pts) + "</b>" + (sy.open ? " (" + sy.open + " still running)" : "") : Y.length + " still running";
    return '<p class="pp-line"><span class="pp-dot"></span><b>Pro Picks</b> yesterday: ' + ys + ' \u00b7 since 14 Nov: ' + sa.settled + ' settled, ' + sa.won + ' won, ' + sa.lost + ' lost' + (sa.void ? ", " + sa.void + " void" : "") + ', <b class="' + (sa.pts >= 0 ? "pos" : "neg") + '">' + pts(sa.pts) + '</b> <a href="/performance">Pro Picks record \u2192</a></p>';
  }
  function proPicksStrip(el) {
    /* Owner 17 Nov 10:32: same boxes as the NAP / Specials row, rows of three, soonest off first; started picks drop off like the Specials */
    if (!el) return;
    var T = todaysProPicks().filter(function (t) { return t.result === "open" && new Date(t.start) > new Date(); });
    var head = '<div class="sec-head"><div><p class="eyebrow">The day\u2019s best five Pro tips \u00b7 one per competition</p><h2 class="sec-title" id="h-pp">Today\u2019s Pro Picks</h2></div><a class="more" href="/performance">Pro Picks record</a></div>';
    el.innerHTML = '<section class="pp-home" aria-labelledby="h-pp">' + head + (T.length ? '<ul class="htips hero-row pp-hero">' + T.slice(0, 3).map(function (t, i) {
        /* Owner 17 Nov 10:35: one row of 3 like the Specials; the rest queue behind and move in as each one starts ("Next up" on the third box) */
        var q = i === 2 ? T.slice(3) : [], nx = q.length ? '<p class="htip-sm hc-next">Next up: <b>' + (locked(q[0]) ? "Pro tip" : esc(q[0].selection)) + "</b> \u00b7 " + esc(q[0].event) + " \u00b7 " + fmtTime(q[0].start).eat + " UK" + (q.length > 1 ? " \u00b7 then " + (q.length - 1) + " more" : "") + "</p>" : "";
        return homeTip(t, { dark: true, share: true, label: "Pro Pick", sub: "One of today\u2019s five best Pro tips", col: TIER_COLOR.propick, next: nx }); }).join("") + "</ul>" : '<p class="pf-note">Today\u2019s Pro Picks have all started. Results are on the record.</p>') + proPicksLine() + "</section>";
    /* match the NAP / Specials box height so every box on the page lines up */
    var fit = function () { var h = 0; document.querySelectorAll("#nap .hero-row > li").forEach(function (x) { h = Math.max(h, x.offsetHeight); }); el.querySelectorAll(".pp-hero > li").forEach(function (x) { x.style.minHeight = h && window.innerWidth > 760 ? h + "px" : ""; }); };
    fit(); setTimeout(fit, 300); window.addEventListener("resize", fit);
  }
  function proPicksBoard(el) {
    var L = p2().filter(function (t) { return t.proPick; }).sort(byStart);
    if (!L.length) { el.innerHTML = '<p class="empty">Pro Picks start on 14 November.</p>'; return; }
    var today = dayKey(new Date().toISOString()), tod = L.slice().sort(byStart).filter(function (t) { return dayKey(t.start) === today || (dayKey(t.proPickAt || t.published) === today); });
    var rows = tod.map(function (t) {
      var ft = fmtTime(t.start), e = edgeOf(t);
      return '<tr><td class="mono">' + esc(ft.eat) + ' <small>UK</small>' + ALT(ft, "<br><small>", "</small>") + '</td><td>' + (locked(t) ? '<b>\ud83d\udd12 Pro selection</b><small class="pp-ev"><br>' + esc(t.sport) + ' \u00b7 for subscribers</small>' : '<b>' + esc(t.selection) + '</b><small class="pp-ev"><br>' + esc(t.event) + ' \u00b7 ' + esc(t.comp || t.sport) + '</small>') + '</td><td class="mono">' + (locked(t) ? esc(priceBand(t.price)) : t.price) + '</td><td class="mono pp-ch">' + (t.prob ? pct(t.prob) : "\u2013") + '</td><td class="mono pos">' + (locked(t) ? "Pro" : e == null ? "\u2013" : pct(e, true)) + '</td><td>' + (t.result === "open" ? "Open" : '<b class="pts ' + cls(profit(t)) + '">' + t.result.toUpperCase() + " " + pts(profit(t)) + "</b>") + "</td></tr>";
    }).join("");
    var byDay = {}; L.forEach(function (t) { var k = dayKey(t.start); (byDay[k] = byDay[k] || []).push(t); });
    var run = 0, dayRows = Object.keys(byDay).sort().map(function (k) { var s = stats(byDay[k]); run += s.profit; return '<tr><td>' + esc(dayLabel(k)) + '</td><td class="mono">' + byDay[k].length + '</td><td class="mono">' + s.won + "\u2013" + s.lost + (s.void ? " (" + s.void + " void)" : "") + (s.open ? " \u00b7 " + s.open + " open" : "") + '</td><td class="mono pts ' + cls(s.profit) + '">' + pts(s.profit) + '</td><td class="mono pts ' + cls(run) + '">' + pts(run) + "</td></tr>"; }).reverse().join("");
    el.innerHTML = (tod.length ? '<div class="pf-panel" style="border-top-color:' + TIER_COLOR.propick + '"><div class="pf-hd"><h3>Today\u2019s Pro Picks</h3><p>Up to five NCM Pro tips a day, chosen by the numbers: edge +6% to +12% at the current price, at least 2 hours before the start, highest edge first; never a NAP or a Special.</p></div><div class="pf-body"><table class="tbl pp-tbl"><thead><tr><th>Starts</th><th>Pick</th><th>Price</th><th class="pp-ch">Chance</th><th>Edge</th><th>Result</th></tr></thead><tbody>' + rows + "</tbody></table></div></div>" : "") +
      '<div id="pp-head" style="margin:16px 0"></div>' +
      '<div class="pf-panel" style="border-top-color:' + TIER_COLOR.propick + '"><div class="pf-hd"><h3>Pro Picks running profit</h3><p>Points after each settled Pro Pick, 1 pt each at the published price.</p></div><div class="pf-body"><div id="pp-chart"></div></div></div>' +
      '<div class="pf-panel" style="border-top-color:' + TIER_COLOR.propick + ';margin-top:16px"><div class="pf-hd"><h3>Day by day</h3><p>Every day of Pro Picks, newest first.</p></div><div class="pf-body"><table class="tbl pp-tbl"><thead><tr><th>Day</th><th>Picks</th><th>Won\u2013Lost</th><th>Pts</th><th>Running</th></tr></thead><tbody>' + dayRows + "</tbody></table></div></div>";
    headline($("#pp-head"), L);
    multiChart($("#pp-chart"), [{ name: "Pro Picks", color: TIER_COLOR.propick, test: function () { return true; } }], L);
  }
  /* Owner 14 Nov 10:29: "Measure us by CLV, not profit. Do from now and show me." */
  function clvBoard(el) {
    var L = p2(), all = clvStats(L);
    var since = function (d) { return L.filter(function (t) { return dayKey(t.start) >= d; }); };
    var d7 = new Date(Date.now() - 6 * 864e5).toISOString(), w = clvStats(since(dayKey(d7))), off = clvStats(since("2026-11-14"));
    var ncm = clvStats(L.filter(function (t) { return t.meister === "cruncher"; })), tom = clvStats(L.filter(function (t) { return t.meister === "meister"; }));
    var tl = function (lab, c, sub) { return tile(lab, clvTxt(c.avg), sub, c.avg == null ? "" : cls(c.avg)); };
    var h = tl("Average CLV", all, all.n + " tips measured since 5 Nov") +
      tile("Beat the close", all.beat == null ? "\u2013" : pct(all.beat), "Share of tips still value at the off", all.beat == null ? "" : all.beat >= 0.5 ? "pos" : "neg") +
      tl("From 14 Nov (official)", off, off.n ? off.n + " tips measured so far" : "First closes land as today's games start") +
      tl("Last 7 days", w, w.n + " tips") + tl("NCM", ncm, ncm.n + " tips");
    var by = {}; L.forEach(function (t) { if (clvOf(t) == null || t.result === "void") return; var k = dayKey(t.start); (by[k] = by[k] || []).push(clvOf(t)); });
    var ks = Object.keys(by).sort();
    ks.forEach(function (k) { var v = by[k]; by[k].avg = v.reduce(function (x, y) { return x + y; }, 0) / v.length; by[k].beat = v.filter(function (x) { return x > 0; }).length / v.length; });
    /* Owner 15 Nov 09:04: box looked empty and misaligned. Zero line now sits where the data needs it (no dead space), and a second chart (beat the close by day) fills the panel. */
    var barSvg = function (vals, fmt, label, ref) {
      var W = 640, H = 260, top = 24, bot = 26, pmax = Math.max(0, Math.max.apply(null, vals)), nmin = Math.min(0, Math.min.apply(null, vals));
      if (ref != null) pmax = Math.max(pmax, ref);
      var span = (pmax - nmin) || 0.1, ph = H - top - bot - (nmin < 0 ? 16 : 0), zero = top + pmax / span * ph, sc = ph / span;
      var slot = (W - 20) / Math.max(1, vals.length), bw = Math.min(56, slot - 10);
      var out = '<line x1="10" x2="' + (W - 10) + '" y1="' + zero.toFixed(1) + '" y2="' + zero.toFixed(1) + '" stroke="currentColor" opacity=".3"/>';
      if (ref != null) { var ry = zero - ref * sc; out += '<line x1="10" x2="' + (W - 10) + '" y1="' + ry.toFixed(1) + '" y2="' + ry.toFixed(1) + '" stroke="currentColor" stroke-dasharray="4 4" opacity=".35"/>'; }
      out += vals.map(function (a, i) { var k = ks[i], x = 10 + i * slot + (slot - bw) / 2, hg = Math.abs(a) * sc, y = a >= 0 ? zero - hg : zero, good = ref != null ? a >= ref : a >= 0;
        return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(1, hg).toFixed(1) + '" rx="3" fill="' + (good ? "var(--pos, #1f8f4e)" : "var(--neg, #c0392b)") + '"><title>' + dayLabel(k) + ": " + fmt(a) + " over " + by[k].length + ' tips</title></rect>' +
          '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (a >= 0 ? y - 5 : y + hg + 14).toFixed(1) + '" text-anchor="middle" font-size="14" font-weight="600" fill="currentColor">' + fmt(a) + "</text>" +
          '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="13" fill="currentColor" opacity=".7">' + k.slice(8) + "/" + k.slice(5, 7) + "</text>"; }).join("");
      return '<svg viewBox="0 0 ' + W + " " + H + '" width="100%" role="img" aria-label="' + label + '">' + out + "</svg>";
    };
    var svg = ks.length ? barSvg(ks.map(function (k) { return by[k].avg; }), clvTxt, "Average CLV by day") : '<p class="panel-sub">No closing prices yet.</p>';
    var svg2 = ks.length ? barSvg(ks.map(function (k) { return by[k].beat; }), function (x) { return pct(x); }, "Beat the close by day", 0.5) : "";
    var groups = [["NCM Pro", isNP], ["NCM Free", isNF], ["NAP", function (t) { return t.nap; }]]
      .concat(["F", "T", "B", "U"].map(function (k) { return [SPORTN[k], function (t) { return sportK(t) === k; }]; }));
    var rows = groups.map(function (g) { var c = clvStats(L.filter(g[1])); return "<tr><td>" + esc(g[0]) + '</td><td class="n">' + c.n + '</td><td class="n pts ' + (c.avg == null ? "" : cls(c.avg)) + '">' + clvTxt(c.avg) + '</td><td class="n">' + (c.beat == null ? "\u2013" : pct(c.beat)) + "</td></tr>"; }).join("");
    var R = L.filter(function (t) { return sportK(t) === "R" && t.racingMethod === "v2" && typeof t.close === "number" && t.close > 1 && t.result !== "void"; }), rb = R.filter(function (t) { return t.price > 1 + (t.close - 1) * 0.98; }).length; /* Owner 19 Nov: racing v2 measured against Betfair SP (net of 2% commission) */
    el.innerHTML = '<div class="hl-grid hl6">' + h + "</div>" +
      '<div class="two-col" style="margin-top:16px"><div class="panel"><h3>Average CLV by day</h3><p class="panel-sub">Above the line = our prices were better than the closing price.</p>' + svg + (svg2 ? '<h3 style="margin-top:18px">Beat the close by day</h3><p class="panel-sub">Share of tips priced above the close. Dashed line = 50%.</p>' + svg2 : "") + "</div>" +
      '<div class="panel"><h3>CLV by group</h3><p class="panel-sub">Tips with a matched closing price.</p><div class="table-box"><table class="data"><thead><tr><th>Group</th><th class="n">Tips</th><th class="n">CLV</th><th class="n">Beat</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
      (R.length ? '<p class="panel-sub" style="margin-top:10px">Racing v2 (from 19 Nov; v Betfair starting price, net of 2% commission, not part of CLV): beat BSP on <b>' + rb + " of " + R.length + "</b>.</p>" : "") + "</div></div>" +
      '<p class="rec-key"><b>CLV (closing line value)</b> = our published price \u00d7 Pinnacle\u2019s fair chance just before the start \u2212 1. Positive means the edge was still there when the market closed: the best early sign that tips are genuinely good value, long before profit settles down. Official from 14 Nov; earlier days come from the snapshots we already had (none for 12\u201313 Nov). Left out: markets Pinnacle doesn\u2019t price the same way (team totals, three-way handicaps, set betting, youth and women\u2019s games) and any close beyond \u00b130%, which usually means a mismatched market.</p>';
  }
  function p2Total(el) { multiChart(el, [{ name: "Total", color: "var(--chart-line)", test: function () { return true; } }], p2()); }
  /* Owner 10 Nov 14:05: same result, but at the closing price (SP in racing); where no closing price was recorded, the published price is kept (good faith). Shows the gain from getting on early. */
  function closeProfit(t) {
    var c = typeof t.close === "number" && t.close > 1 ? t.close : null;
    if (!c) return profit(t);
    var u = {}; for (var k in t) u[k] = t[k]; u.price = c; delete u.napTopUp; return profit(u);
  }
  function p2Meisters(el) {
    var ser = P2M.map(function (id) { return { name: MSHORT[id], color: MCOLOR[id], test: function (t) { return t.meister === id; } }; });
    ser.push({ name: "NCM at closing prices", color: "#5FC4BA", dash: "6 3", faint: true, pf: closeProfit, test: function (t) { return t.meister === "cruncher"; } });
    /* Owner 15 Nov 09:42: second dashed line for TOM at closing prices */
    multiChart(el, ser, p2());
    /* Owner 10 Nov 14:10: beat-the-close figures under the chart (NCM, settled tips with a recorded closing price) */
    var Cof = function (id) { return p2().filter(function (t) { return t.meister === id && t.result !== "open" && t.result !== "void" && typeof t.close === "number" && t.close > 1; }); };
    var C = Cof("cruncher"), CT = Cof("meister");
    if (!C.length) return;
    var av = function (l) { var x = 0; l.forEach(function (t) { x += t.price / t.close - 1; }); return x / l.length; };
    var beat = C.filter(function (t) { return t.close < t.price; }).length;
    var fmt = function (v) { return (v >= 0 ? "+" : "\u2212") + Math.abs(v * 100).toFixed(1) + "%"; };
    var parts = [["R", "Racing v SP"], ["F", "Football"], ["B", "Basketball"], ["T", "Tennis"]].map(function (k) {
      var l = C.filter(function (t) { return sportK(t) === k[0]; }); return l.length >= 5 ? "<span>" + k[1] + " <b>" + fmt(av(l)) + "</b></span>" : ""; }).join("");
    var box = el.parentNode.querySelector(".close-strip2"); if (!box) { box = document.createElement("div"); box.className = "close-strip2"; el.parentNode.appendChild(box); }
    box.innerHTML = '<p class="cs2-main">NCM beat the closing price on <b>' + beat + " of " + C.length + "</b> tips (" + Math.round(beat / C.length * 100) + "%), by <b>" + fmt(av(C)) + "</b> on average.</p>" + '<p class="cs2-sports">' + parts + "</p>" +
      (CT.length ? (function () { var bt = CT.filter(function (t) { return t.close < t.price; }).length; return '<p class="cs2-main" style="margin-top:10px">TOM beat the closing price on <b>' + bt + " of " + CT.length + "</b> tips (" + Math.round(bt / CT.length * 100) + "%), by <b>" + fmt(av(CT)) + "</b> on average.</p>"; })() : "");
  }
  /* Owner 25 Nov 11:28: homepage preview (home-new.html): compact proof strip split with the lead story, Meisters at a glance, made v expected */
  var GL_NAME = { cruncher: "Number Cruncher", ncmp: "Premium Events", ncmr: "Racing", combo: "Combo Meister" };
  function glanceFig(list) {
    var S = list.filter(function (t) { return t.result !== "open"; }), m = measures(S), wk = Date.now() - 7 * 864e5, p7 = 0, n7 = 0;
    S.forEach(function (t) { if (new Date(t.start).getTime() >= wk) { p7 += profit(t); n7++; } });
    var all = list.slice().sort(byStart);
    m.p7 = p7; m.n7 = n7; m.first = all.length ? all[0].start : null; m.avgEdgeAll = measures(list).avgEdge;
    return m;
  }
  function shortDay(iso) { return iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: SITE_TZ }) : "–"; }
  function proofStrip(el) {
    if (!el) return;
    var m = measures(p2Set()), F = BM.NEWSFEED || { articles: [] }, A = (F.articles || []).slice(0, 3), lead = A[0];
    var st = function (big, lab, c) { return '<a class="pf-st" href="/performance"><b class="' + (c || "") + '">' + big + "</b><span>" + lab + "</span></a>"; };
    el.innerHTML = '<div class="pf-in"><div class="pf-l"><h1>Every tip priced. <span>Every result kept.</span></h1>' +
      '<p class="pf-sub">Four Meisters. Every tip published before the start, with its price and our chance. Winners and losers stay on the record.</p>' +
      '<div class="pf-stats">' + st(pts(m.profit), "points since 5 Nov", m.profit >= 0 ? "g" : "") + st(pct(m.roi, true), "return on stakes") +
      (m.beat != null ? st(Math.round(m.beat * 100) + "%", "beat the closing price") : "") + st(p2Set().filter(function (t) { return t.result !== "void"; }).length, "settled tips") + "</div>" +
      '<div class="pf-acts"><a class="pf-cta" href="/tips">See today\'s tips →</a><a class="pf-cta2" href="/meisters">Meet the Meisters</a></div></div>' +
      (lead ? '<div class="pf-news"><p class="pf-nk">Latest news</p><a class="pf-lead" href="' + esc(lead.href) + '"><span class="pf-lab">' + esc(lead.label) + " · " + shortDay(lead.date) + "</span><b>" + esc(lead.title) + "</b><span class=\"pf-dek\">" + esc(lead.dek) + "</span></a>" +
        A.slice(1).map(function (a) { return '<a class="pf-more" href="' + esc(a.href) + '"><span class="pf-lab">' + esc(a.label) + "</span>" + esc(a.title) + "</a>"; }).join("") +
        '<a class="pf-all" href="' + esc(F.base || "/news/") + '">All news →</a></div>' : "") + "</div>";
  }
  function meistersGlance(el, chartEl) {
    if (!el) return;
    var row = function (lab, list, color, tot) {
      var m = glanceFig(list), lw = m.won + " – " + m.lost, nt = list.filter(function (t) { return t.result !== "open" && t.result !== "void"; }).length;
      return "<tr" + (tot ? ' class="gl-tot"' : "") + '><th scope="row">' + (color ? '<i class="gl-dot" style="background:' + color + '"></i>' : "") + lab + '</th><td class="pts ' + cls(m.profit) + '"><b>' + pts(m.profit) + "</b></td><td>" + pct(m.roi, true) + "</td><td>" + nt + "</td><td>" + lw + "</td><td>" + (m.avgEdgeAll != null ? pct(m.avgEdgeAll, true) : "–") +
        "</td><td>" + (m.closeN >= 5 ? Math.round(m.beat * 100) + "%" : "–") + '</td><td class="pts ' + cls(m.p7) + '">' + (m.n7 ? pts(m.p7) : "–") + "</td><td>" + shortDay(m.first) + "</td></tr>";
    };
    el.innerHTML = '<div class="gl-wrap"><table class="glance"><thead><tr><th scope="col">Meister</th><th scope="col">Points</th><th scope="col">Return</th><th scope="col">Tips</th><th scope="col">Won – lost</th><th scope="col">Avg edge</th><th scope="col">Beat close</th><th scope="col">Last 7 days</th><th scope="col">Since</th></tr></thead><tbody>' +
      P2M.map(function (id) { return row('<a href="/meisters#' + id + '">' + GL_NAME[id] + "</a>", p2().filter(function (t) { return t.meister === id; }), MCOLOR[id]); }).join("") +
      row("All Meisters", p2(), "", true) + '</tbody></table></div><p class="gl-note">Settled tips at the advised stake. Avg edge = our chance × the price, minus 1, at publication. Beat close = the price we gave was bigger than the closing price (shown from 5 tips). <a href="/performance">Every chart and table →</a></p>';
    if (chartEl) multiChart(chartEl, P2M.map(function (id) { return { name: GL_NAME[id], color: MCOLOR[id], test: function (t) { return t.meister === id; } }; }).concat([{ name: "All Meisters", color: "var(--chart-line)", test: function () { return true; } }]), p2()); /* Owner 25 Nov 11:39: total line on top of the four Meister lines */
  }
  function madeVExpected(el) {
    if (!el) return;
    var rows = P2M.concat(["all"]).map(function (id) {
      var m = measures(p2Set().filter(function (t) { return id === "all" || t.meister === id; }));
      /* Owner 25 Nov 12:08: every live Meister always has a row (Premium Events shows zeros until its first result) */
      return "<tr" + (id === "all" ? ' class="gl-tot"' : "") + '><th scope="row">' + (id === "all" ? "All" : '<i class="gl-dot" style="background:' + MCOLOR[id] + '"></i>' + GL_NAME[id]) + '</th><td class="pts ' + cls(m.exp) + '">' + pts(m.exp) + '</td><td class="pts ' + cls(m.profit) + '"><b>' + pts(m.profit) + "</b></td><td>" + Math.round(m.expW) + " → " + m.wins + "</td></tr>";
    }).join("");
    var a = measures(p2Set()), d = a.profit - a.exp;
    el.innerHTML = '<p class="mve-lead">The edge on our tips said <b>' + pts(a.exp) + "</b> points. We have made <b class=\"pts " + cls(a.profit) + '">' + pts(a.profit) + "</b>, " + (d >= 0 ? "<b>" + pts(d) + "</b> more than expected: some of that is luck, and luck can turn." : "<b>" + pts(-d).replace("+", "") + "</b> less than expected: that is bad luck, and the edge is what we control.") + "</p>" + '<p class="mve-note">Each tip\'s edge (our chance × price, minus 1) times its stake gives the points we expect over time. Short runs swing either way; over hundreds of tips the two lines should meet.</p>' +
      '<div class="gl-wrap"><table class="glance mve"><thead><tr><th scope="col">Meister</th><th scope="col">Edge said</th><th scope="col">Made</th><th scope="col">Winners (exp → won)</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
      '<div class="mve-chart"><p class="mve-ck">Made v expected, tip by tip</p><div id="mve-chart" data-h="190"></div></div>';
    /* Owner 25 Nov 11:42: small chart under the table: running points made against running points the edge expected */
    multiChart($("#mve-chart"), [{ name: "Expected from the edge", color: "#9AA3B5", dash: "6 4", pf: function (t) { var e = edgeOf(t); return t.result === "void" || e == null ? 0 : t.stake * e; }, test: function () { return true; } },
      { name: "Made", color: "var(--chart-line)", test: function () { return true; } }], p2());
  }
  /* Owner 25 Nov 11:50: home preview news + reviews in the new style (lead story like the header news card, headline list beside it; compact review cards) */
  function newsHome2(el) {
    if (!el) return;
    var F = BM.NEWSFEED || { articles: [] }, A = (F.articles || []).slice(0, 6), lead = A[0];
    if (!lead) return;
    var meta = function (a) { return '<span class="nh-meta"><i style="background:' + (FEED_COL[a.label] || "#A9B4C8") + '"></i>' + esc(a.label) + " · " + shortDay(a.date) + (a.read ? " · " + a.read + " min read" : "") + "</span>"; };
    var big = function (a) { return '<a class="nh-lead" href="' + esc(a.href) + '">' + meta(a) + (a.kicker ? '<span class="nh-kick">' + esc(a.kicker) + "</span>" : "") + "<b>" + esc(a.title) + '</b><span class="nh-dek">' + esc(a.dek) + '</span><span class="nh-go">Read the story →</span></a>'; };
    /* Owner 25 Nov 11:55: two lead stories stacked (no empty space), the rest as headlines */
    el.innerHTML = '<div class="nh"><div class="nh-leads">' + A.slice(0, 2).map(big).join("") + "</div>" +
      '<div class="nh-list">' + A.slice(2).map(function (a) { return '<a class="nh-item" href="' + esc(a.href) + '">' + meta(a) + "<b>" + esc(a.title) + '</b><span class="nh-idek">' + esc(a.dek) + "</span></a>"; }).join("") + "</div></div>";
  }
  function reviewsHome2(el) {
    if (!el) return;
    var R = (BM.NEWSFEED || {}).reviews || [];
    if (!R.length) return;
    el.innerHTML = '<ul class="rh">' + R.map(function (r) { var cas = /casino/i.test(r.kind || ""); return '<li><a class="rh-card" href="' + esc(r.href) + '"><span class="rh-top"><b>' + esc(r.name) + '</b><span class="rh-kind' + (cas ? " cas" : "") + '">' + (cas ? "Casino" : "Sportsbook") + '</span></span>' + (r.score != null ? '<span class="rh-score"><b>' + Number(r.score).toFixed(1) + '</b><i>' + (r.desk ? 'Desk review' : 'Score') + '' + '</i></span>' : '') + '<span class="rh-sum">' + esc(r.summary) + '</span><span class="rh-go">Read the review →</span></a></li>'; }).join("") + "</ul>";
  }
  function p2Sections(el) {
    /* Owner 6 Nov 11:45: twelve dashed/dotted lines were unreadable; now four small charts, one per sport, three solid Meister lines each */
    var keyH = '<div class="sm-key">' + P2M.map(function (id) { return '<span><i style="background:' + MCOLOR[id] + '"></i><b>' + MCODE[id] + '</b> ' + MSHORT[id] + "</span>"; }).join("") + "</div>", kEl = el.id ? $("#" + el.id + "-key") : null;
    if (kEl) kEl.innerHTML = keyH;
    /* Owner 7 Nov 09:44: five sport charts left a gap; the Sport v sport chart moves up into the sixth cell, Pro v Free goes full width below */
    el.innerHTML = (kEl ? "" : keyH) + '<div class="sm-grid">' + ["F", "R", "T", "U", "B", "E", "O", "A"].map(function (k) { return '<div class="sm-cell' + (k === "A" ? ' sm-all' : '') + '" style="--sc:' + (SPORTC[k] || "#22356b") + '"><p class="sm-h">' + (k === "A" ? "Sport v sport" : k === "P" ? "TOM: personal v stats" : SPORTN[k]) + ' <b class="pts" data-smt="' + k + '"></b></p><div data-sm="' + k + '" data-h="210"></div></div>'; }).join("") + "</div>";
    ["F", "R", "T", "U", "B", "E", "O", "A"].forEach(function (k) {
      var pool = p2().filter(function (t) { return k === "A" || sportK(t) === k; }), tot = 0;
      if (k === "A") { pool.forEach(function (t) { if (t.result !== "open") tot += profit(t); }); var ta = $('[data-smt="A"]', el); ta.textContent = pts(tot); ta.className = "pts " + cls(tot); p2Sports($('[data-sm="A"]', el)); return; }
      pool.forEach(function (t) { if (t.result !== "open") tot += profit(t); });
      var tb = $('[data-smt="' + k + '"]', el); tb.textContent = pts(tot); tb.className = "pts " + cls(tot);
      /* Owner 10 Nov 09:21: faint grey line for the retired FMM so TOM + NCM + FMM add up to the header total */
      var ser = P2M.map(function (id) { return { name: MCODE[id], color: MCOLOR[id], test: function (t) { return t.meister === id; } }; });
      if (pool.some(function (t) { return t.meister === "margins"; })) ser.push({ name: "FMM (retired)", color: "#9AA3B5", dash: "4 4", faint: true, test: function (t) { return t.meister === "margins"; } });
      multiChart($('[data-sm="' + k + '"]', el), ser, pool);
    });
  }

  function p2Tiers(el) { multiChart(el, [{ name: "NCM Pro", color: TIER_COLOR.pro, test: isNP }, { name: "NCM Free", color: TIER_COLOR.free, test: isNF }], p2()); }
  function p2Sports(el) { multiChart(el, SPK.map(function (k) { return { name: SPORTN[k], color: SPORTC[k], test: function (t) { return sportK(t) === k; } }; }), p2()); }
  function mTable(rows) {
    return '<div class="table-box"><table class="data"><thead><tr><th>Group</th><th class="n">Tips</th><th class="n">Won–Lost</th><th class="n">Staked</th><th class="n">P/L</th><th class="n">ROI</th><th class="n">Expected</th><th class="n">Avg edge</th><th class="n">Open</th></tr></thead><tbody>' +
      rows.map(function (r) { var m = measures(r[1]); return "<tr><td>" + r[0] + '</td><td class="n">' + m.n + '</td><td class="n">' + m.won + "–" + m.lost + '</td><td class="n">' + (Math.round(m.staked * 100) / 100) + '</td><td class="n pts ' + cls(m.profit) + '">' + pts(m.profit) + '</td><td class="n">' + pct(m.roi, true) + '</td><td class="n pts ' + cls(m.exp) + '">' + pts(m.exp) + '</td><td class="n">' + (m.avgEdge == null ? "–" : pct(m.avgEdge, true)) + '</td><td class="n">' + m.open + "</td></tr>"; }).join("") +
      "</tbody></table></div>";
  }
  function sectionTable() {
    var L = p2(), rows = [];
    P2M.forEach(function (id) { SPK.forEach(function (k) { var c = MCODE[id] + k; rows.push(['<span class="sec-tag sec-' + k + '"><b>' + c + "</b>" + SPORTN[k] + "</span>", L.filter(function (t) { return t.meister === id && sportK(t) === k; })]); }); });
    return mTable(rows);
  }
  function bandTable(kind) {
    var L = p2(), B = kind === "edge" ? [[-1, 0.02, "Under +2%"], [0.02, 0.03, "+2% to +3%"], [0.03, 0.05, "+3% to +5%"], [0.05, 0.1, "+5% to +10%"], [0.1, 9, "+10% or more"]]
      : [[0, 2, "Under 2.0"], [2, 3, "2.0 to 2.99"], [3, 5, "3.0 to 4.99"], [5, 10, "5.0 to 9.99"], [10, 999, "10.0 or more"]];
    return mTable(B.map(function (b) { return [b[2], L.filter(function (t) { var v = kind === "edge" ? edgeOf(t) : t.price; return v != null && v >= b[0] && v < b[1]; })]; }));
  }
  function p1Line() {
    var s = stats(TIPS.filter(function (t) { return !isP2(t) && !isRemoved(t); }));
    return "Phase 1 (28 Oct to 5 Nov, old rules, three main Meisters): " + s.won + "–" + s.lost + ", " + pts(s.profit) + " pts, ROI " + pct(s.roi, true) + ".";
  }

  /* ---------- extra Phase 2 views ---------- */
  function tierMatrix() {
    var L = p2(), cols = [["All", function () { return true; }], ["NCM Pro", isNP], ["NCM Free", isNF], ["NAP", function (t) { return t.nap; }]];
    var cell = function (list) { var s = stats(list); return list.length ? '<b class="pts ' + cls(s.profit) + '">' + pts(s.profit) + '</b><small>' + s.won + "–" + s.lost + (s.roi == null ? "" : " · " + pct(s.roi, true)) + "</small>" : '<small>–</small>'; };
    var rows = P2M.map(function (id) { var mine = L.filter(function (t) { return t.meister === id; }); return "<tr><td>" + whoTag(id) + "</td>" + cols.map(function (c) { return '<td class="n mx">' + cell(mine.filter(c[1])) + "</td>"; }).join("") + "</tr>"; }).join("");
    var tot = "<tr class=\"tot\"><td><b>All tips</b></td>" + cols.map(function (c) { return '<td class="n mx">' + cell(L.filter(c[1])) + "</td>"; }).join("") + "</tr>";
    return '<div class="table-box"><table class="data mxt"><thead><tr><th>Meister</th>' + cols.map(function (c) { return '<th class="n">' + c[0] + "</th>"; }).join("") + "</tr></thead><tbody>" + rows + tot + "</tbody></table></div>";
  }
  function chanceTable() {
    var S = p2Set().filter(function (t) { return t.result !== "void" && t.prob; });
    var B = [[0, 0.2, "Under 20%"], [0.2, 0.35, "20% to 35%"], [0.35, 0.5, "35% to 50%"], [0.5, 0.65, "50% to 65%"], [0.65, 1.01, "65% or more"]];
    return '<div class="table-box"><table class="data"><thead><tr><th>Our chance</th><th class="n">Tips</th><th class="n">Expected winners</th><th class="n">Actual winners</th><th class="n">Difference</th><th class="n">P/L</th></tr></thead><tbody>' +
      B.map(function (b) { var l = S.filter(function (t) { return t.prob >= b[0] && t.prob < b[1]; }), ew = 0, aw = 0, p = 0; l.forEach(function (t) { ew += t.prob; if (t.result === "won") aw++; p += profit(t); }); var d = aw - ew;
        return "<tr><td>" + b[2] + '</td><td class="n">' + l.length + '</td><td class="n">' + (Math.round(ew * 10) / 10) + '</td><td class="n">' + aw + '</td><td class="n pts ' + cls(d) + '">' + (d > 0 ? "+" : d < 0 ? "−" : "") + Math.abs(Math.round(d * 10) / 10) + '</td><td class="n pts ' + cls(p) + '">' + pts(p) + "</td></tr>"; }).join("") +
      "</tbody></table></div>";
  }
  /* Owner 16 Nov 07:12: fixed results grid by Meister (scales to many Meisters: one row per Meister): last 7 days, month by month, and to date */
  function meisterRecord(el) {
    if (!el) return;
    var S = p2Set(), ids = P2M.slice(), mk = function (t) { return dayKey(t.start).slice(0, 7); };
    var days = []; S.forEach(function (t) { var k = dayKey(t.start); if (days.indexOf(k) < 0) days.push(k); }); days.sort(); days = days.slice(-7).reverse();
    var months = []; S.forEach(function (t) { var k = mk(t); if (months.indexOf(k) < 0) months.push(k); }); months.sort();
    var short = function (k) { var d = new Date(k + "T12:00:00+03:00"); return new Intl.DateTimeFormat("en-GB", { timeZone: SITE_TZ, weekday: "short", day: "numeric", month: "short" }).format(d); };
    var mon = function (k) { var d = new Date(k + "-15T12:00:00+03:00"); return new Intl.DateTimeFormat("en-GB", { timeZone: SITE_TZ, month: "long", year: "numeric" }).format(d); };
    var cell = function (l) { if (!l.length) return '<td class="n mr-c"><span class="mr-nil">–</span></td>'; var s = stats(l); return '<td class="n mr-c"><b class="pts ' + cls(s.profit) + '">' + pts(s.profit) + "</b><small>" + s.won + "–" + s.lost + (s.void ? " · " + s.void + "v" : "") + "</small></td>"; };
    var name = function (id) { return '<th scope="row" class="mr-m"><span class="mdot" style="background:' + MCOLOR[id] + '"></span>' + MCODE[id] + "<small>" + esc(MSHORT[id]) + "</small></th>"; };
    var rowsOf = function (colKeys, keyFn) {
      return ids.map(function (id) { var L = S.filter(function (t) { return t.meister === id; }); return "<tr>" + name(id) + colKeys.map(function (k) { return cell(L.filter(function (t) { return keyFn(t) === k; })); }).join("") + "</tr>"; }).join("") +
        '<tr class="mr-tot"><th scope="row" class="mr-m">Total<small>Live Meisters</small></th>' + colKeys.map(function (k) { return cell(S.filter(function (t) { return ids.indexOf(t.meister) >= 0 && keyFn(t) === k; })); }).join("") + "</tr>";
    };
    var t1 = '<div class="mr-scroll"><table class="data mr"><caption>Last 7 days played</caption><thead><tr><th>Meister</th>' + days.map(function (k) { return '<th class="n">' + short(k) + "</th>"; }).join("") + "</tr></thead><tbody>" + rowsOf(days, function (t) { return dayKey(t.start); }) + "</tbody></table></div>";
    var t2 = '<details class="mr-x"><summary>Month by month</summary><div class="mr-scroll"><table class="data mr"><thead><tr><th>Meister</th>' + months.map(function (k) { return '<th class="n">' + mon(k) + "</th>"; }).join("") + "</tr></thead><tbody>" + rowsOf(months, mk) + "</tbody></table></div>";
    var tot = function (id, L, label) { var s = stats(L), c = clvStats(L); return "<tr" + (id ? "" : ' class="mr-tot"') + ">" + (id ? name(id) : '<th scope="row" class="mr-m">' + label + "<small>Live Meisters</small></th>") + '<td class="n">' + s.settled + '</td><td class="n">' + s.won + "–" + s.lost + '</td><td class="n">' + s.staked.toFixed(1) + '</td><td class="n pts ' + cls(s.profit) + '"><b>' + pts(s.profit) + '</b></td><td class="n ' + cls(s.roi || 0) + '">' + (s.roi == null ? "–" : pct(s.roi, true)) + '</td><td class="n ' + (c.avg == null ? "" : cls(c.avg)) + '">' + clvTxt(c.avg) + "</td></tr>"; };
    var t3 = '<details class="mr-x"><summary>Total to date <small>since 5 November</small></summary><div class="mr-scroll"><table class="data mr"><thead><tr><th>Meister</th><th class="n">Settled</th><th class="n">Won–Lost</th><th class="n">Staked</th><th class="n">P/L</th><th class="n">ROI</th><th class="n">CLV</th></tr></thead><tbody>' +
      ids.map(function (id) { return tot(id, S.filter(function (t) { return t.meister === id; })); }).join("") + tot(null, S.filter(function (t) { return ids.indexOf(t.meister) >= 0; }), "Total") + "</tbody></table></div>";
    el.innerHTML = '<div class="table-box mr-box">' + t1 + t2.replace(/<\/div>$/, '</div></details>') + t3.replace(/<\/div>$/, '</div></details>') + '</div><p class="rec-key">Points at advised stakes, by the day each game started (UK time); W–L under each figure, v = void. One row per live Meister, so new Meisters join the grid automatically. Earlier test Meisters are left out of these rows (their tips stay in the overall record).</p>';
  }
  function dayTable() {
    var S = p2Set(), days = [];
    /* Owner 8 Nov 09:42/09:46: Daily Record groups by the day the event started, Kampala time (same day as the rest of the site), so late results count on their own day */
    var pk = function (t) { return dayKey(t.start); };
    S.forEach(function (t) { var k = pk(t); if (days.indexOf(k) < 0) days.push(k); });
    days.sort();
    var run = 0;
    return '<div class="table-box"><table class="data"><thead><tr><th>Day played</th><th class="n">Tips</th><th class="n">Won–Lost</th><th class="n">NCM</th><th class="n">NCMP</th><th class="n">NCMR</th><th class="n">CM</th><th class="n">Day P/L</th><th class="n">Running</th></tr></thead><tbody>' +
      days.map(function (k) { var l = S.filter(function (t) { return pk(t) === k; }), s = stats(l); run += s.profit;
        var by = function (id) { var p = 0; l.forEach(function (t) { if (t.meister === id) p += profit(t); }); return '<td class="n pts ' + cls(p) + '">' + pts(p) + "</td>"; };
        return "<tr><td>" + dayLabel(k) + '</td><td class="n">' + l.length + '</td><td class="n">' + s.won + "–" + s.lost + "</td>" + by("cruncher") + by("ncmp") + by("ncmr") + by("combo") + '<td class="n pts ' + cls(s.profit) + '"><b>' + pts(s.profit) + '</b></td><td class="n pts ' + cls(run) + '">' + pts(run) + "</td></tr>"; }).join("") +
      "</tbody></table></div>" + '<p class="rec-key">By the day each game was played (UK time), so a late finish counts on the day it started. <b>Tips</b> are settled tips only; games still to run are added when they finish. <b>Day P/L</b> and <b>Running</b> include every tip since 5 November, including early test tips (none since 9 November), so they can differ slightly from TOM + NCM + NCMR.</p>';
  }
  function todayStrip(el) {
    var today = dayKey(new Date().toISOString()), L = p2().filter(function (t) { return dayKey(t.start) === today && !isRetired(t); }); /* retired FMM not on today's card */ /* Owner 12 Nov 15:14: every number here is TODAY'S EVENTS (games starting today, Kampala), never when the tip was published */
    if (!L.length) { el.innerHTML = ""; return; }
    var s = stats(L), c = function (f) { return L.filter(f).length; };
    el.innerHTML = '<div class="today-strip"><div><p class="hl-label">Today\'s card</p><p class="ts-big">' + L.length + ' tips</p><p class="hl-sub">UK day \u00b7 ' + c(function (t) { return t.result === "open" && new Date(t.start) > Date.now(); }) + ' to start</p></div>' +
      /* Owner 25 Nov 11:10: six boxes, each headed by the exact tier pill used on the tips, showing where today's card comes from */
      [["NCM Free", "free", "", function (t) { return t.meister === "cruncher" && t.tier !== "pro"; }], ["NCM Pro", "pro", "", function (t) { return t.meister === "cruncher" && t.tier === "pro"; }],
       ["NCMP Free", "free", " ncmp", function (t) { return t.meister === "ncmp" && t.tier !== "pro"; }], ["NCMP Pro", "pro", " ncmp", function (t) { return t.meister === "ncmp" && t.tier === "pro"; }],
       ["NCMR", "pro", " ncmr", function (t) { return t.meister === "ncmr"; }], ["Combo", "combo", " combo", function (t) { return t.meister === "combo"; }]].map(function (b) {
        return '<div class="ts-m"><p class="hl-label ts-mlab"><span class="tier ' + b[1] + b[2] + '">' + miniShield() + b[0] + '</span></p><p class="ts-big">' + c(b[3]) + "</p></div>"; }).join("") +
      /* Owner 22 Nov 13:51: shorter strip wording (no repeated 'today', voids shown) */
      /* Owner 20 Nov 11:06: NAP / Specials box removed (it only spaced the bar); with NCMR the bar is 8 boxes on one line */
      /* Owner 9 Nov 16:42: same boundary as the Daily Record (games played today, Kampala), so the two always match */
      (function () { var D = p2Set().filter(function (t) { return dayKey(t.start) === today; }), d = stats(D), op = p2().filter(function (t) { return t.result === "open" && dayKey(t.start) === today; }).length;
        return '<div><p class="hl-label">Today so far</p><p class="ts-big pts ' + cls(d.profit) + '">' + (D.length ? pts(d.profit) : "–") + '</p><p class="hl-sub">' + D.filter(function (t) { return /won|placed/.test(t.result); }).length + " won · " + D.filter(function (t) { return /lost/.test(t.result); }).length + " lost" + (D.filter(function (t) { return t.result === "void"; }).length ? " · " + D.filter(function (t) { return t.result === "void"; }).length + " void" : "") + " \u00b7 " + op + " to finish</p></div>"; })() + /* Owner 25 Nov 11:19: one line */
      /* Owner 16 Nov 10:32: site Meisters together first; then the separate records at the end: Combo (blue), then Acca (pink) */
      /* Owner 25 Nov 10:46: Combo box now one of the four Meister boxes */ "</div>";
      /* Owner 25 Nov: Acca Meister retired, its box removed */
  }

  function leadTable() {
    var S = p2Set(), B = [[0, 3, "Under 3 hours"], [3, 6, "3 to 6 hours"], [6, 12, "6 to 12 hours"], [12, 24, "12 to 24 hours"], [24, 1e9, "24 hours or more"]];
    return '<div class="table-box"><table class="data"><thead><tr><th>Published before the start</th><th class="n">Tips</th><th class="n">Won–Lost</th><th class="n">Staked</th><th class="n">P/L</th><th class="n">ROI</th><th class="n">Beat the close</th></tr></thead><tbody>' +
      B.map(function (b) { var l = S.filter(function (t) { var h = leadH(t); return h != null && h >= b[0] && h < b[1]; }), s = stats(l), m = measures(l);
        return "<tr><td>" + b[2] + '</td><td class="n">' + l.length + '</td><td class="n">' + s.won + "–" + s.lost + '</td><td class="n">' + (Math.round(s.staked * 100) / 100) + '</td><td class="n pts ' + cls(s.profit) + '"><b>' + pts(s.profit) + '</b></td><td class="n">' + (s.roi == null ? "–" : pct(s.roi, true)) + '</td><td class="n">' + (m.beat == null ? "–" : pct(m.beat) + " (" + m.closeN + ")") + "</td></tr>"; }).join("") +
      "</tbody></table></div>";
  }
  function latestSnap(el) {
    var S = p2().filter(function (t) { return t.result !== "open"; }), sum = function (l) { var p = 0; l.forEach(function (t) { p += profit(t); }); return p; };
    var today = dayKey(new Date().toISOString()), yd = dayKey(new Date(Date.now() - 864e5).toISOString()), dk = function (t) { return dayKey(t.start); }; /* Owner 11 Nov 00:04: count by the day the game started (Kampala), same as the Daily Record, so late settlements after midnight stay on their own day */
    var T0 = S.filter(function (t) { return dk(t) === today; }), Y0 = S.filter(function (t) { return dk(t) === yd; });
    var last = S.slice().sort(function (a, b) { return new Date(b.settledAt || b.start) - new Date(a.settledAt || a.start); }).slice(0, 10), lw = last.filter(function (t) { return /won/.test(t.result); }).length, ll = last.filter(function (t) { return /lost|placed/.test(t.result); }).length;
    var best = S.filter(function (t) { return t.result === "won"; }).sort(function (a, b) { return profit(b) - profit(a); })[0];
    var cell = function (lab, big, sub, c) { return '<div class="snap"><p class="hl-label">' + lab + '</p><p class="snap-big pts ' + (c || "") + '">' + big + '</p><p class="hl-sub">' + sub + "</p></div>"; };
    el.innerHTML = '<div class="snap-grid">' +
      cell("Today", T0.length ? pts(sum(T0)) : "–", T0.length + " settled", cls(sum(T0))) +
      cell("Yesterday", Y0.length ? pts(sum(Y0)) : "–", Y0.length + " settled", cls(sum(Y0))) +
      (function () { var cv = clvStats(p2()); return cell("Average CLV", clvTxt(cv.avg), (cv.beat == null ? "" : pct(cv.beat) + " beat the close · ") + cv.n + " tips", cv.avg == null ? "" : cls(cv.avg)); })() +
      (best ? cell("Biggest winner", pts(profit(best)), esc(best.selection) + " @ " + fmtOdds(best.price), "pos") : "") + "</div>";
  }
  /* ---------- Performance "stat land" (Owner 12 Nov 14:37: internal page, lots of boxes, every sport, every Meister, expected, beating the price) ---------- */
  function pfSvgLine(series, opt) {
    opt = opt || {}; var W = 900, H = opt.h || 260, L = 46, R = 70, T = 12, B = 26;
    var all = []; series.forEach(function (s) { all = all.concat(s.pts); }); all.push(0);
    var lo = Math.min.apply(null, all), hi = Math.max.apply(null, all); if (hi - lo < 1) { hi += 1; lo -= 1; }
    var pad = (hi - lo) * 0.08; lo -= pad; hi += pad;
    var n = Math.max.apply(null, series.map(function (s) { return s.pts.length; }));
    var X = function (i) { return L + (W - L - R) * (n < 2 ? 0 : i / (n - 1)); }, Y = function (v) { return T + (H - T - B) * (1 - (v - lo) / (hi - lo)); };
    var grid = "", step = niceStep(hi - lo); for (var g = Math.ceil(lo / step) * step; g <= hi; g += step) grid += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(g).toFixed(1) + '" y2="' + Y(g).toFixed(1) + '" class="pf-grid' + (Math.abs(g) < 1e-9 ? " zero" : "") + '"/><text x="' + (L - 6) + '" y="' + (Y(g) + 4).toFixed(1) + '" class="pf-ax" text-anchor="end">' + (Math.round(g * 100) / 100) + "</text>";
    var ends = series.filter(function (s) { return s.pts.length && !s.noEnd; }).map(function (s) { var last = s.pts[s.pts.length - 1]; return { s: s, v: last, y: Y(last) + 4 }; }).sort(function (a, b) { return a.y - b.y; });
    for (var k = 1; k < ends.length; k++) if (ends[k].y - ends[k - 1].y < 14) ends[k].y = ends[k - 1].y + 14;
    var lines = series.map(function (s) { var d = s.pts.map(function (v, i) { return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1); }).join(" ");
      return '<path d="' + d + '" fill="none" stroke="' + s.col + '" stroke-width="' + (s.w || 2.2) + '"' + (s.dash ? ' stroke-dasharray="' + s.dash + '"' : "") + "/>"; }).join("") +
      ends.map(function (e) { return '<text x="' + (W - R + 6) + '" y="' + e.y.toFixed(1) + '" class="pf-end" fill="' + e.s.col + '">' + (opt.pct ? (e.v * 100).toFixed(0) + "%" : pts(e.v)) + "</text>"; }).join("");
    var key = '<div class="pf-key">' + series.map(function (s) { return '<span><i style="background:' + s.col + (s.dash ? ';opacity:.6' : "") + '"></i>' + esc(s.name) + "</span>"; }).join("") + "</div>";
    return '<svg viewBox="0 0 ' + W + " " + H + '" class="pf-svg" role="img">' + grid + lines + "</svg>" + key;
  }
  function pfBars(items, opt) {
    opt = opt || {}; if (!items.length) return '<p class="empty">No data yet.</p>';
    var mx = Math.max.apply(null, items.map(function (x) { return Math.abs(x.v); })) || 1;
    return '<div class="pf-bars">' + items.map(function (x) { var w = Math.abs(x.v) / mx * 50;
      return '<div class="pf-bar"><span class="pf-bl">' + x.label + '</span><span class="pf-bt"><span class="pf-bf ' + (x.v >= 0 ? "pos" : "neg") + '" style="' + (x.v >= 0 ? "left:50%" : "right:50%") + ";width:" + w.toFixed(1) + '%"></span><span class="pf-b0"></span></span><span class="pf-bv ' + cls(x.v) + '">' + (opt.fmt ? opt.fmt(x.v) : pts(x.v)) + (x.sub ? "<small>" + x.sub + "</small>" : "") + "</span></div>"; }).join("") + "</div>";
  }
  function pfBox(label, big, sub, c) { return '<div class="pf-box"><p class="pf-bl2">' + label + '</p><p class="pf-big ' + (c || "") + '">' + big + '</p><p class="pf-sub">' + sub + "</p></div>"; }
  function pfPanel(title, sub, body, col) { return '<section class="pf-panel" style="border-top-color:' + (col || "var(--yellow)") + '"><div class="pf-hd"><h3>' + title + "</h3>" + (sub ? "<p>" + sub + "</p>" : "") + '</div><div class="pf-body">' + body + "</div></section>"; }
  function streaks(list) { var w = 0, l = 0, bw = 0, bl = 0; list.forEach(function (t) { if (t.result === "won" || t.result === "half-won") { w++; l = 0; } else if (t.result === "lost" || t.result === "half-lost" || t.result === "placed") { l++; w = 0; } bw = Math.max(bw, w); bl = Math.max(bl, l); }); return { w: bw, l: bl }; }
  function perfX(el) {
    var A = p2Set().filter(function (t) { return !isRetired(t) || true; }), S = A.filter(function (t) { return t.result !== "void"; });
    var m = measures(A), st = streaks(S), r2 = function (x) { return (Math.round(x * 100) / 100).toFixed(2); };
    var won = S.filter(function (t) { return /won/.test(t.result); }), lost = S.filter(function (t) { return /lost|placed/.test(t.result); }); /* Owner 20 Nov 11:06: same counts as Settled tips (placed each-way counts as lost) */
    var avgW = won.length ? won.reduce(function (a, t) { return a + t.price; }, 0) / won.length : 0, avgL = lost.length ? lost.reduce(function (a, t) { return a + t.price; }, 0) / lost.length : 0;
    var best = S.slice().sort(function (a, b) { return profit(b) - profit(a); })[0];
    var days = {}; A.forEach(function (t) { var k = dayKey(t.start); days[k] = (days[k] || 0) + profit(t); }); var dk = Object.keys(days).sort();
    var bestD = dk.slice().sort(function (a, b) { return days[b] - days[a]; })[0], worstD = dk.slice().sort(function (a, b) { return days[a] - days[b]; })[0];
    var upDays = dk.filter(function (k) { return days[k] > 0; }).length;
    var withC = A.filter(function (t) { return typeof t.close === "number" && t.close > 1; }), clvAvg = withC.length ? withC.reduce(function (a, t) { return a + (t.price / t.close - 1); }, 0) / withC.length : null;
    var closeP = A.reduce(function (a, t) { return a + closeProfit(t); }, 0);
    var stk = function (l) { return l.reduce(function (a, t) { return a + t.stake; }, 0); };
    var roiOf = function (l) { var s = stats(l); return s.staked ? s.profit / s.staked : null; };
    var pro = A.filter(isNP), fre = A.filter(isNF), nap = A.filter(function (t) { return t.nap; }), spc = A.filter(function (t) { return t.special; });
    var boxes = [
      pfBox("Settled tips", String(m.settled + m.void), m.won + " won · " + m.lost + " lost · " + m.void + " void"),
      pfBox("Points", pts(m.profit), r2(m.staked) + " pts staked", cls(m.profit)),
      pfBox("Return on stakes", pct(m.roi, true), "Profit ÷ staked", cls(m.roi)),
      pfBox("Strike rate", pct(m.won / Math.max(1, m.won + m.lost)), "Winners ÷ decided tips"),
      pfBox("Expected points", pts(m.exp), "Sum of edge × stake", cls(m.exp)),
      pfBox("Actual v expected", pts(m.profit - m.exp), "Luck so far (+ = running hot)", cls(m.profit - m.exp)),
      pfBox("Winners v expected", (m.wins - m.expW >= 0 ? "+" : "−") + Math.abs(m.wins - m.expW).toFixed(1), m.wins + " won from " + m.expW.toFixed(1) + " expected", cls(m.wins - m.expW)),
      pfBox("Average edge", m.avgEdge == null ? "–" : pct(m.avgEdge, true), "Across every tip published", "pos"),
      pfBox("Beat the close", m.beat == null ? "–" : pct(m.beat), m.closeN + " tips with a closing price", m.beat >= 0.5 ? "pos" : "neg"),
      pfBox("Average CLV", clvTxt(clvStats(p2()).avg), clvStats(p2()).n + " tips v the close", clvStats(p2()).avg == null ? "" : cls(clvStats(p2()).avg)),
      pfBox("At closing prices", pts(closeP), "Same tips settled at the close", cls(closeP)),
      pfBox("Value of getting on early", pts(m.profit - closeP), "Published price v close", cls(m.profit - closeP)),
      pfBox("Average odds (winners)", avgW.toFixed(2), won.length + " winners"),
      pfBox("Average odds (losers)", avgL.toFixed(2), lost.length + " losers"),
      pfBox("Biggest winner", best ? pts(profit(best)) : "–", best ? esc(best.selection) + " @ " + fmtOdds(best.price) : "", "pos"),
      pfBox("Longest winning run", String(st.w), "Settled tips in a row"),
      pfBox("Longest losing run", String(st.l), "Settled tips in a row", "neg"),
      pfBox("Winning days", upDays + " of " + dk.length, "Days in profit (by start day)"),
      pfBox("Best day", bestD ? pts(days[bestD]) : "–", bestD ? dayLabel(bestD) : "", "pos"),
      pfBox("Worst day", worstD ? pts(days[worstD]) : "–", worstD ? dayLabel(worstD) : "", "neg"),
      pfBox("Tips per day", ((m.settled + m.void) / Math.max(1, dk.length)).toFixed(1), (m.settled + m.void) + " settled tips · " + dk.length + " days"),
      /* Owner 20 Nov 11:06: five more boxes so the board is 5 even rows of 6: one per Meister, then the labels on their own */
      (function () { return P2M.map(function (id) { var l = A.filter(function (t) { return t.meister === id; }), q = stats(l); return pfBox(MCODE[id] + " points", pts(q.profit), l.length + " tips · ROI " + (q.staked ? pct(q.profit / q.staked, true) : "–"), cls(q.profit)); }).join(""); })(),
      pfBox("NCM Pro ROI", roiOf(pro) == null ? "–" : pct(roiOf(pro), true), pro.length + " NCM Pro tips · " + pts(stats(pro).profit) + " pts", cls(stats(pro).profit)),
      pfBox("NCM Free ROI", roiOf(fre) == null ? "–" : pct(roiOf(fre), true), fre.length + " NCM Free tips · " + pts(stats(fre).profit) + " pts", cls(stats(fre).profit)),
      (function () { var l = A.filter(function (t) { return t.meister === "ncmp" && t.tier === "pro"; }); return pfBox("NCMP Pro ROI", roiOf(l) == null ? "–" : pct(roiOf(l), true), l.length + " NCMP Pro tips · " + pts(stats(l).profit) + " pts", cls(stats(l).profit)); })(),
      (function () { var l = A.filter(function (t) { return t.meister === "ncmp" && t.tier !== "pro"; }); return pfBox("NCMP Free ROI", roiOf(l) == null ? "–" : pct(roiOf(l), true), l.length + " NCMP Free tips · " + pts(stats(l).profit) + " pts", cls(stats(l).profit)); })(),
      (function () { var nn = A.filter(function (t) { return t.nap; }); return pfBox("Racing NAP", nn.length ? pts(stats(nn).profit) : "–", nn.length + " racing NAPs (from 26 Nov)", nn.length ? cls(stats(nn).profit) : ""); })()
    ].join("");
    /* charts */
    var run = 0, ex = 0, cl = 0, aP = [], eP = [], cP = []; A.forEach(function (t) { run += profit(t); ex += t.result === "void" ? 0 : t.stake * (edgeOf(t) || 0); cl += closeProfit(t); aP.push(run); eP.push(ex); cP.push(cl); });
    var ch1 = pfSvgLine([{ name: "Actual points", pts: aP, col: "#22356b", w: 2.6 }, { name: "Expected (edge × stake)", pts: eP, col: "#2FAE6A", dash: "6 5" }, { name: "At closing prices", pts: cP, col: "#D99A00", dash: "2 4" }]);
    var bc = 0, bn = 0, bcs = []; withC.forEach(function (t) { bn++; if (t.close < t.price) bc++; bcs.push(bc / bn); });
    var ch2 = bcs.length ? pfSvgLine([{ name: "Share of tips beating the close (cumulative)", pts: bcs, col: "#119C93" }, { name: "50% line", pts: bcs.map(function () { return 0.5; }), col: "#A9B4C8", dash: "4 4", w: 1.4, noEnd: true }], { pct: true, h: 220 }) : '<p class="empty">No closing prices yet.</p>';
    var mser = P2M.map(function (id) { var r = 0, arr = []; A.forEach(function (t) { if (t.meister === id) r += profit(t); arr.push(r); }); return { name: MSHORT[id], pts: arr, col: MCOLOR[id] }; });
    var ch3 = pfSvgLine(mser, { h: 240 });
    var sser = SPK.filter(function (k) { return A.some(function (t) { return sportK(t) === k; }); }).map(function (k) { var r = 0, arr = []; A.forEach(function (t) { if (sportK(t) === k) r += profit(t); arr.push(r); }); return { name: SPORTN[k], pts: arr, col: SPORTC[k] }; });
    var ch4 = pfSvgLine(sser, { h: 260 });
    var dayBars = pfBars(dk.map(function (k) { return { label: dayLabel(k).split(" · ").pop(), v: days[k] }; }));
    /* sport cards */
    var sportCards = SPK.map(function (k) { var l = A.filter(function (t) { return sportK(t) === k; }); if (!l.length) return ""; var q = measures(l), s2 = streaks(l.filter(function (t) { return t.result !== "void"; }));
      var r = 0, arr = []; l.forEach(function (t) { r += profit(t); arr.push(r); });
      return '<div class="pf-sport" style="border-top-color:' + SPORTC[k] + '"><div class="pf-sh"><b>' + SPORTN[k] + "</b><span class=\"pts " + cls(q.profit) + '">' + pts(q.profit) + "</span></div>" +
        '<div class="pf-mini">' + pfSvgLine([{ name: "", pts: arr, col: SPORTC[k] }], { h: 120 }).replace(/<div class="pf-key">.*<\/div>$/, "") + "</div>" +
        '<dl class="pf-dl"><div><dt>Tips</dt><dd>' + q.n + "</dd></div><div><dt>W–L</dt><dd>" + q.won + "–" + q.lost + "</dd></div><div><dt>ROI</dt><dd class=\"" + cls(q.roi || 0) + '">' + (q.roi == null ? "–" : pct(q.roi, true)) + "</dd></div><div><dt>Strike</dt><dd>" + pct(q.won / Math.max(1, q.won + q.lost)) + "</dd></div>" +
        "<div><dt>Expected</dt><dd>" + pts(q.exp) + "</dd></div><div><dt>Avg edge</dt><dd>" + (q.avgEdge == null ? "–" : pct(q.avgEdge, true)) + "</dd></div><div><dt>Beat close</dt><dd>" + (q.beat == null ? "–" : pct(q.beat)) + "</dd></div><div><dt>CLV</dt><dd class=\"" + (clvStats(l).avg == null ? "" : cls(clvStats(l).avg)) + '">' + clvTxt(clvStats(l).avg) + "</dd></div></dl></div>"; }).join("");
    /* breakdown bars */
    var grp = function (keyFn, minN) { var g = {}; A.forEach(function (t) { var k = keyFn(t); if (!k) return; (g[k] = g[k] || []).push(t); }); return Object.keys(g).filter(function (k) { return g[k].length >= (minN || 1); }).map(function (k) { var s = stats(g[k]); return { label: esc(k), v: s.profit, sub: g[k].length + " tips · " + (s.staked ? pct(s.profit / s.staked, true) : "–") }; }).sort(function (a, b) { return b.v - a.v; }); };
    var WD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var byBet = pfBars(grp(betType, 3)), byComp = grp(function (t) { return t.comp || t.sport; }, 3), byWd = pfBars(grp(function (t) { return WD[new Date(dayKey(t.start) + "T12:00:00Z").getUTCDay()]; }));
    var byHour = pfBars(grp(function (t) { var h = +new Intl.DateTimeFormat("en-GB", { timeZone: SITE_TZ, hour: "2-digit", hourCycle: "h23" }).format(new Date(t.start)); var b = h < 6 ? "00–06 UK" : h < 12 ? "06–12 UK" : h < 18 ? "12–18 UK" : "18–24 UK"; return b; }));
    var compTop = pfBars(byComp.slice(0, 8)), compBot = pfBars(byComp.slice(-8).reverse());
    var msBars = pfBars([].concat.apply([], P2M.map(function (id) { return SPK.map(function (k) { var l = A.filter(function (t) { return t.meister === id && sportK(t) === k; }); if (!l.length) return null; var s = stats(l); return { label: MCODE[id] + " · " + SPORTN[k], v: s.profit, sub: l.length + " tips" }; }).filter(Boolean); })).sort(function (a, b) { return b.v - a.v; }));
    el.innerHTML =
      pfPanel("Stat board", "Every settled tip since 5 November, advised stakes at the published price", '<div class="pf-boxes">' + boxes + "</div>", "#FFC629") +
      pfPanel("Actual v expected v closing price", "Running points: what we made, what our edges said we should make, and the same tips at the closing price", ch1, "#22356b") +
      '<div class="pf-two">' + pfPanel("Beating the closing price", "Share of tips whose price was bigger than the close, as it builds up", ch2, "#119C93") + pfPanel("Every Meister", "Running points by Meister", ch3, "#D99A00") + "</div>" +
      pfPanel("Every sport", "Running points by sport", ch4, "#2E9E5B") +
      pfPanel("Sport by sport", "Each sport on its own: points, record, return, expected, edge, beating the close and longest runs", '<div class="pf-sports">' + sportCards + "</div>", "#2E9E5B") +
      pfPanel("Day by day", "Points by the day the games started (UK)", dayBars, "#5AA9FF") +
      '<div class="pf-two">' + pfPanel("Meister × sport", "Points for every Meister in every sport", msBars, "#D99A00") + pfPanel("By bet type", "Bet types with 3+ tips", byBet, "#8A5CD1") + "</div>" +
      '<div class="pf-two">' + pfPanel("Best competitions", "3+ tips, most points first", compTop, "#2FAE6A") + pfPanel("Worst competitions", "3+ tips, fewest points first", compBot, "#d4553f") + "</div>" +
      '<div class="pf-two">' + pfPanel("By weekday", "Day of the start (UK)", byWd, "#5AA9FF") + pfPanel("By time of day", "Start time (UK)", byHour, "#5AA9FF") + "</div>" +
      pfPanel("By edge band", "Return by the edge we had at publication", bandTable("edge"), "#2FAE6A") + pfPanel("By price band", "Return by the published price", bandTable("price"), "#FFC629") +
      pfPanel("Are our chances right?", "Each settled tip grouped by the chance we gave it. If our chances are right, actual winners land close to expected winners in every band; a small sample swings either way.", chanceTable(), "#119C93") +
      pfPanel("Meister × tier", "", tierMatrix(), "#D99A00") +
      pfPanel("Every section", "Expected = the profit our edges said we should make on the settled tips. We judge a section only after about 50 tips.", sectionTable(), "#2E9E5B") +
      pfPanel("By published time", "Settled tips grouped by how long before the start they were published. Early tips get the best prices but the thinnest markets.", leadTable(), "#5AA9FF") +
      pfPanel("Daily record", "", dayTable(), "#A9B4C8");
  }
  /* ---------- pages ---------- */
  var RENDER = {
    home: function () {
      (function () { var e = $("#nap"); if (e) e.innerHTML = ""; })(); /* Owner 25 Nov 10:26: top Free/Pro/NAP/Specials row removed; NAP, Specials and Pro Picks show as tags on the Next tips boxes */
      (function () { var e = $("#propicks-home"); if (e) e.innerHTML = ""; })(); /* Owner 22 Nov 18:09: Pro Picks join the single top row */
      nextTips($("#next-tips"), 6);
      var c = upcoming().length; $("#open-count").textContent = "All " + c + " open tips";
      inPlaySection($("#in-play-sec"), $("#in-play"), $("#in-play-n"), 3);
      todayStrip($("#today-strip"));
      $("#latest-list").innerHTML = resultsList(p2Set().filter(function (t) { return !isRetired(t); }).slice(-6).reverse());
      /* Owner 9 Nov 08:27: small boxes under Last six, measuring only those six tips (form and activity) */
      (function () {
        var L6 = p2Set().filter(function (t) { return !isRetired(t); }).slice(-6), tot = 0;
        L6.forEach(function (t) { tot += profit(t); });
        var n = function (f) { return L6.filter(f).length; };
        var w = n(function (t) { return /won|placed/.test(t.result); }), l = n(function (t) { return /lost/.test(t.result); });
        var pro = n(isNP), fr = n(isNF);
        var ncr = n(function (t) { return t.meister === "ncmr"; }), ncm = n(function (t) { return t.meister === "cruncher"; });
        var box = function (lab, big, sub, c) { return '<div class="ls-box"><p class="hl-label">' + lab + '</p><p class="ls-big ' + (c || "") + '">' + big + '</p><p class="hl-sub">' + sub + "</p></div>"; };
        $("#latest-list").insertAdjacentHTML("beforeend", '<div class="ls-boxes">' +
          box("Last six", pts(tot), w + " won · " + l + " lost", "pts " + cls(tot)) +
          (window.BM_HOME2 ? box("By Meister", P2M.map(function (id) { var k = n(function (t) { return t.meister === id; }); return k ? k + " " + MCODE[id] : ""; }).filter(Boolean).join(" · "), "in the last six", "ls-small") + box("Pro v Free", n(function (t) { return t.tier === "pro"; }) + " / " + n(function (t) { return t.tier === "free"; }), "NCM and NCMP, in the last six") :
          box("NCM Pro v Free", pro + " / " + fr, "in the last six") +
          box("NCM v NCMR", ncm + " / " + ncr, "in the last six")) + "</div>");
      })();
      /* Owner 16 Nov 11:05 (flow): latest settled combo and acca under Last six, each linking to its own record */
      (function () {
        var lr = function (l) { var r = l.result || "open", p = l.price; return r === "won" ? p : r === "void" ? 1 : r === "half-won" ? (1 + p) / 2 : r === "half-lost" ? 0.5 : r === "lost" ? 0 : null; };
        var done = function (a) { return a.legs.some(function (l) { return l.result === "lost"; }) || a.legs.every(function (l) { return l.result && l.result !== "open"; }); };
        var last = function (a) { return Math.max.apply(null, a.legs.map(function (l) { return new Date(l.start).getTime(); })); };
        var pick = function (L) { return (L || []).filter(done).sort(function (x, y) { return last(y) - last(x); })[0]; };
        var line = function (a, kind, href, lab) { if (!a) return "";
          var lost = a.legs.some(function (l) { return l.result === "lost"; }), ret = lost ? 0 : a.legs.reduce(function (m, l) { return m * lr(l); }, 1), pt = lost ? -a.stake : a.stake * ret - a.stake;
          var P = a.legs.reduce(function (m, l) { return m * l.price; }, 1), d = dayLabel(dayKey(new Date(last(a)).toISOString())).split(" \u00b7 ")[0];
          return '<a class="ls-multi ' + kind + '" href="' + href + "#" + esc(a.id) + '"><span class="ls-m-k">' + lab + '</span><span class="ls-m-t">' + esc(a.title || (a.legs.length + "-fold")) + " @ " + accaOdds(P) + "<small>" + d + " · " + (lost ? "Lost" : "Won") + '</small></span><b class="pts ' + cls(pt) + '">' + pts(pt) + "</b></a>"; };
        var h = line(pick(BM.COMBOS), "combo", "combo.html", "Latest combo"); /* Owner 25 Nov: Acca Meister retired */
        if (h) $("#latest-list").insertAdjacentHTML("beforeend", '<div class="ls-multis">' + h + "</div>");
      })();
      p2Total($("#latest-chart"));
      if ($("#latest-snap")) latestSnap($("#latest-snap"));
      feedNews($("#news-block"));
      feedReviews($("#review-cards"));
      if (window.BM_HOME2) (function () { /* Owner 25 Nov 11:42: form strip of the last 30 settled tips under Last six (fills the panel, shows the losers too) */
        var L = p2Set().slice(-30), tot = 0, w = 0, l = 0; L.forEach(function (t) { tot += profit(t); if (/won|placed/.test(t.result)) w++; else if (/lost/.test(t.result)) l++; });
        $("#latest-list").insertAdjacentHTML("beforeend", '<div class="form30"><p class="mve-ck">Form, last 30 settled tips <span>oldest → newest</span></p><div class="f30">' + L.map(function (t) { var r = /won|placed/.test(t.result) ? "w" : /lost/.test(t.result) ? "l" : "v"; return '<i class="' + r + '" title="' + esc(t.selection + " · " + MCODE[t.meister] + " · " + pts(profit(t))) + '" style="--mc:' + MCOLOR[t.meister] + '"></i>'; }).join("") + '</div><p class="f30-sum">' + w + " won · " + l + ' lost · <b class="pts ' + cls(tot) + '">' + pts(tot) + "</b> pts · the thin stripe under each block is the Meister's colour</p></div>");
      })();
      if (window.BM_HOME2) { newsHome2($("#news-block")); reviewsHome2($("#review-cards")); proofStrip($("#proof")); meistersGlance($("#glance"), $("#glance-chart")); madeVExpected($("#mve")); }
    },
    tips: function () {
      var draw = function () {
        var today = dayKey(new Date().toISOString()), tmr = dayKey(new Date(Date.now() + 864e5).toISOString());
        var CMOPEN = BM.CLOSE.filter(function (t) { return t.result === "open" && isP2(t) && new Date(t.start) > Date.now(); }).sort(byStart), CMSET = BM.CLOSE.filter(function (t) { return t.result !== "open"; }).sort(byStart);
        var src = filt.meister === "close" ? CMOPEN : filt.meister === "removed" || filt.meister === "allwith" ? (filt.meister === "allwith" ? withAll() : TIPS).filter(function (t) { return (filt.meister === "allwith" || isRemoved(t)) && t.result === "open" && isP2(t) && new Date(t.start) > Date.now(); }).sort(byStart) : upcoming();
        var base = applyFilt(src), allSettled = applyFilt(filt.meister === "close" ? CMSET : filt.meister === "allwith" ? settled().concat(CMSET).sort(byStart) : settled());
        narrowBar($("#when-bar"), base.concat(allSettled), draw);
        var o = narrow(base), s = narrow(allSettled).reverse().slice(0, 20);
        inPlaySection($("#in-play-sec"), $("#in-play"), $("#in-play-n"));
        $("#open-tips").innerHTML = tipList(o, "No open tips match these filters.", false, true);
        $("#settled-tips").innerHTML = tipList(s, "No settled tips match these filters.");
        $("#open-n").textContent = o.length;
      };
      if (location.hash === "#nap") filt.tier = "nap";
      filterBar($("#tip-filters"), draw); draw();
    },
    performance: function () {
      /* Owner 12 Nov 12:20: the numbers and the charts moved off the home page */
      todayStrip($("#pf-today"));
      headline($("#p2-headline"), p2(), { odds: true });
      p2Board($("#scorecards"));
      if (window.BM_PERF2) { meistersGlance($("#glance"), $("#glance-chart")); madeVExpected($("#mve")); }
      if ($("#pf-mrec")) meisterRecord($("#pf-mrec"));
      if ($("#pf-clv")) clvBoard($("#pf-clv"));
      p2Meisters($("#all-meisters-chart"));
      p2Sections($("#sections-chart"));
      p2Tiers($("#tiers-chart"));
      if ($("#pf-x")) { if (window.BM_PERF2 && $("#pf-x-d")) { var xd = $("#pf-x-d"); if (xd.open) perfX($("#pf-x")); else if (!xd.__bm) { xd.__bm = 1; xd.addEventListener("toggle", function () { if (xd.open && !$("#pf-x").innerHTML) perfX($("#pf-x")); }); } } else perfX($("#pf-x")); }
    },
    propicks: function () {
      if ($("#pp-line")) $("#pp-line").innerHTML = proPicksLine();
      if ($("#pf-propicks")) proPicksBoard($("#pf-propicks"));
    },
    results: function () {
      if ($("#pp-line")) $("#pp-line").innerHTML = proPicksLine();
      /* Owner 12 Nov 14:48/14:50: Results is just the results (every settled tip and acca, with the filter chart), no duplicates; every other chart, grid and table lives on Performance */
      if ($("#res-headline")) headline($("#res-headline"), p2());
      if ($("#res-m3")) p2Meisters($("#res-m3"));
      var resLimit = 40;
      var draw = function () {
        var cmSet = BM.CLOSE.filter(function (t) { return t.result !== "open"; }), all = applyFilt(filt.meister === "close" ? cmSet.sort(byStart) : filt.meister === "allwith" ? settled().concat(cmSet).sort(byStart) : settled()), run = 0;
        narrowBar($("#res-narrow"), all, draw);
        var list = narrow(all);
        if ($("#res-chart")) cumChart($("#res-chart"), list);
        var s = stats(list);
        $("#res-summary").textContent = s.settled + " settled · " + s.won + " won · " + s.lost + " lost · " + pts(s.profit) + " pts · ROI " + pct(s.roi, true);
        /* Owner 12 Nov 14:52: same day-grouped list as the Tips page; every tip drops down into its card */
        var rows = list.slice().reverse(), total = rows.length;
        rows = rows.slice(0, resLimit);
        $("#res-table").innerHTML = tipList(rows, "No settled tips match these filters.") + (total > rows.length ? '<p style="text-align:center;margin-top:14px"><button type="button" class="pill" id="res-more">Show ' + Math.min(40, total - rows.length) + " more (" + (total - rows.length) + " hidden)</button></p>" : "");
        var mb = $("#res-more"); if (mb) mb.addEventListener("click", function () { resLimit += 40; draw(); });
      };
      filterBar($("#res-filters"), draw); draw();
    },
    meisters: function () {
      var upRow = function (t) {
        var tm = fmtTime(t.start), lock = locked(t);
        return '<li><span class="up-when"><b>' + tm.day + "</b><small>" + (oop(t) ? "nb " : "") + tm.eat + " UK</small></span><div style=\"min-width:0\"><span class=\"sel\">" + (lock ? "Pro tip · members only" : selHTML(t)) + '</span><span class="sub">' + esc(t.event) + " · " + esc(t.market) + (t.published ? " · published " + fmtTime(t.published).eat + " UK" : "") + '</span><span class="up-tags">' + tierPills(t) + secTag(t) + '</span></div><span class="num">' + (lock ? "–" : fmtOdds(t.price)) + "</span></li>";
      };
      var resRow = function (t) {
        var tm = fmtTime(t.start), p = profit(t);
        return '<li><span class="up-when"><span class="res ' + t.result + '"' + resTitle(t) + '>' + resTxt(t) + "</span><small>" + tm.day + "</small></span><div style=\"min-width:0\"><span class=\"sel\">" + selHTML(t) + '</span><span class="sub">' + esc(t.event) + " · " + esc(t.market) + '</span><span class="up-tags">' + tierPills(t) + secTag(t) + '</span></div><span class="num pts ' + cls(p) + '">' + pts(p) + "</span></li>";
      };
      var ROWS = 6;
      var MS = MEISTERS.filter(function (m) { return P2M.indexOf(m.id) >= 0; });
      var html = MS.map(function (m) {
        var mine = p2().filter(function (t) { return t.meister === m.id; }), s = stats(mine);
        var old = stats(TIPS.filter(function (t) { return t.meister === m.id && !isP2(t); }));
        var nextUp = mine.filter(function (t) { return t.result === "open" && new Date(t.start) > Date.now(); }).sort(byStart);
        var inPlay = mine.filter(function (t) { return t.result === "open" && new Date(t.start) <= Date.now(); }).sort(byStart);
        var recent = mine.filter(function (t) { return t.result !== "open"; }).sort(byStart).reverse();
        var lead = function (t) { return typeof t.leadMin === "number" ? t.leadMin : (new Date(t.start) - new Date(t.published)) / 60000; };
        /* Owner 20 Nov 18:48: every Meister page uses the same order as the Performance page: NAP first (the most premium tip), then the other specials,
           Premium Leagues, the Pro / Free tiers, then each sport (or, for NCMR, the publish-time boxes). Only the Meister's live record is used. */
        /* Owner 25 Nov 12:05: same logic as the Performance page: boxes with no settled tip fold into one line, boxes identical to the Meister's whole record are left out */
        var setK = function (l) { return l.filter(function (t) { return t.result !== "open" && t.result !== "void"; }).map(function (t) { return t.id; }).sort().join(","); };
        var allK = setK(mine), EMPTY = [];
        var C = function (t, f, o) { var l = mine.filter(f), k = setK(l); if (!k) { if (l.length || !/ \u00b7 /.test(t)) EMPTY.push(t); return ""; } if (k === allK) return ""; return scoreCard(t, l, o); };
        var sportCards = function (keys) { return keys.map(function (k) { return C(SPORTN[k] + " \u00b7 " + MCODE[m.id], function (t) { return sportK(t) === k; }, { color: SPORTC[k], sub: m.name + ", " + (/^(US|eS)/.test(SPORTN[k]) ? SPORTN[k] : SPORTN[k].toLowerCase()) }); }).join(""); };
        var cards = m.id === "ncmr" ?
          C("Racing NAP", function (t) { return t.nap; }, { tier: "nap", sub: "When one qualifies" }) +
          C("NCMR Pro", function (t) { return t.tier === "pro"; }, { tier: "pro", sub: "Racing Pro tips" }) +
          C("NCMR Free", function (t) { return t.tier !== "pro"; }, { tier: "free", sub: "Racing Free tips" }) +
          C("1\u20132 h before", function (t) { return lead(t) < 120; }, { color: SPORTC.R, sub: "Published 1 to 2 hours before the off" }) +
          C("2\u20134 h before", function (t) { return lead(t) >= 120; }, { color: SPORTC.R, sub: "Published 2 to 4 hours before the off" })
          : m.id === "ncmp" ?
          C("NCMP Pro", function (t) { return t.tier === "pro"; }, { tier: "pro", sub: "Edge 4.5% to 13.49%" }) +
          C("NCMP Free", function (t) { return t.tier !== "pro"; }, { tier: "free", sub: "Edge 1.5% to 4.49%" }) +
          sportCards(["F", "B", "U", "T", "O"])
          : m.id === "combo" ?
          C("Doubles", function (t) { return t.legs && t.legs.length === 2; }, { color: MCOLOR.combo, sub: "Two-leg combos, 1 point" }) +
          C("Trebles", function (t) { return t.legs && t.legs.length === 3; }, { color: MCOLOR.combo, sub: "Three-leg combos, half a point" }) +
          sportCards(["F", "R", "B", "T", "U", "O", "E"])
          : m.id === "meister" ?
          C("NAP \u00b7 TOM", function (t) { return t.humanNap; }, { tier: "hnap", sub: "TOM's NAP, from 19 Nov" }) +
          C("Meister Special", function (t) { return t.special; }, { tier: "special", sub: "TOM's Specials" }) +
          sportCards(["R", "F", "T", "B", "U", "O", "E"])
          :
          C("NCM Pro", isNP, { tier: "pro", sub: "Prices 2.00 to 5.99" }) +
          C("NCM Free", isNF, { tier: "free", sub: "Open to everyone" }) +
          sportCards(["F", "T", "B", "U", "O", "E"]);
        var upAll = inPlay.concat(nextUp), upShow = upAll.slice(0, ROWS);
        var upList = upShow.length ? '<ul class="res-list up-list">' + upShow.map(function (t) { return isLive(t) ? upRow(t).replace('<span class="up-when">', '<span class="up-when"><span class="res live">In play</span>') : upRow(t); }).join("") + "</ul>" : '<p class="empty">No open tips right now.</p>';
        upList += '<p class="m-more">' + (upAll.length > ROWS ? '<a href="/tips">+ ' + (upAll.length - ROWS) + " more open tips</a>" : "&nbsp;") + "</p>";
        var resList = recent.length ? '<ul class="res-list up-list">' + recent.slice(0, ROWS).map(resRow).join("") + "</ul>" : '<p class="empty">No settled tips yet.</p>';
        resList += '<p class="m-more">' + (recent.length > ROWS ? '<a href="/results">All ' + recent.length + " results</a>" : "&nbsp;") + "</p>";
        var mc = MCOLOR[m.id], P = function (t, sub, body, extra) { return '<section class="pf-panel' + (extra || "") + '" style="border-top-color:' + mc + '"><div class="pf-hd"><h3>' + t + "</h3>" + (sub ? "<p>" + sub + "</p>" : "") + '</div><div class="pf-body">' + body + "</div></section>"; };
        return '<section class="m-tab" id="' + m.id + '" data-mtab="' + m.id + '" aria-labelledby="h-' + m.id + '" style="--mc:' + mc + '">' +
          '<div class="m-hero" style="border-top-color:' + mc + '"><span class="avatar ' + m.id + '" aria-hidden="true">' + esc(m.initials) + '</span><div class="m-hero-t"><h2 id="h-' + m.id + '">' + esc(m.name) + '</h2><p>' + esc(m.who) + " \u00b7 " + esc(m.role) + '</p></div><div class="m-hero-r"><span class="m-hero-l">Record</span><b>' + s.won + "\u2013" + s.lost + '</b><b class="pts ' + cls(s.profit) + '">' + pts(s.profit) + ' pts</b><span>ROI ' + pct(s.roi, true) + "</span></div></div>" +
          P("The numbers", "Every " + MCODE[m.id] + " tip since " + (m.id === "meister" ? "12 November" : m.id === "ncmr" ? "19 November" : m.id === "ncmp" ? "25 November" : m.id === "combo" ? "16 November" : "5 November") + ", advised stakes at the published price", '<div class="m-hl" data-mhl="' + m.id + '"></div><div class="m-odds">' + oddsTable(p2().filter(function (t) { return t.meister === m.id; })) + "</div>") +
          (function () { var n0 = (cards.match(/<section class="score/g) || []).length; if (!n0) return P("Every section", "", '<p class="perf-empty" style="margin:0"><b>The record starts with the first result.</b> ' + mine.filter(function (t) { return t.result === "open"; }).length + " tips are open now; every box fills in as they settle.</p>"); return ""; })() +
          ((cards.match(/<section class="score/g) || []).length ? P(m.id === "combo" ? "By type and sport" : m.id === "ncmp" ? "By tier and sport" : m.id === "ncmr" ? "By NAP, tier and timing" : "By tier and sport", "Points, record and the last 12 results in every section" + (EMPTY.length ? ". No settled tips yet: " + esc(EMPTY.join(" \u00b7 ")) : ""), (function () { /* Owner 20 Nov 09:39: fill every row: 10 cards = 2 rows of 5, 12 = 3 rows of 4 */ var n = (cards.match(/<section class="score/g) || []).length, c = n % 5 === 0 ? 5 : n % 4 === 0 ? 4 : n % 3 === 0 ? 3 : 0; return '<div class="score-grid g4 m-g4">' + cards + "</div>"; })()) : "") + /* Owner 25 Nov 13:00: every Meister's boxes four across, the same size as on Performance */
          /* Owner 25 Nov 13:00: numbers first, then the boxes, the chart, next up and results; the About text moves to the end */
          P("Running profit by section", "All of " + MCODE[m.id] + " (solid) and each sport (dashed)", '<div class="mc" data-pc="' + m.id + '"></div>') +
          '<div class="pf-two">' + P("Next up <span class=\"tab-n\">" + upAll.length + "</span>", "In play first, then the next to start", upList) + P("Recent results <span class=\"tab-n\">" + recent.length + "</span>", "Newest first", resList) + "</div>" +
          P("About " + MCODE[m.id] + " and how it works", esc(m.who), '<p class="m-bio">' + esc(m.bio) + '</p><div class="p2-chips">' + m.specialities.map(function (x) { return '<span class="chip">' + esc(x) + "</span>"; }).join("") + '</div><details class="p2-method"><summary>How this Meister works</summary><ul>' + m.method.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></details>") +
          "</section>";
      }).join("");
      /* Owner 12 Nov 15:21: one Meister at a time, chosen with tabs (deep links #meister / #cruncher still work) */
      $("#meister-list").innerHTML = '<section aria-labelledby="h-mvm"><div class="sec-head"><div><p class="eyebrow">Every Meister side by side</p><h2 class="sec-title" id="h-mvm">Meister v Meister</h2></div><a class="more" href="/performance#h-mvm">Charts on Performance</a></div><div class="panel gl-panel"><div id="m-glance"></div></div></section>' + /* Owner 25 Nov 12:05: Meister v Meister at the top of the Meisters page */
        '<div id="m-tabs"></div>' + CHANGE_NOTE.replace('class="', 'class="pf-note ') + html;
      meistersGlance($("#m-glance"));
      var mcur = (location.hash || "").slice(1); if (!MS.some(function (m) { return m.id === mcur; })) mcur = MS[0].id;
      var showM = function () {
        tabBar($("#m-tabs"), "Meister", MS.map(function (m) { var st = stats(p2().filter(function (t) { return t.meister === m.id; })); return [m.id, m.name, MCOLOR[m.id], pts(st.profit)]; }), mcur, function (t) { mcur = t; try { history.replaceState(null, "", "#" + t); } catch (e) { } showM(); });
        $$("[data-mtab]").forEach(function (sec) { sec.hidden = sec.getAttribute("data-mtab") !== mcur; });
        MS.forEach(function (m) { if (m.id === mcur) { var mine = p2().filter(function (t) { return t.meister === m.id; }); multiChart($('[data-pc="' + m.id + '"]'), [{ name: "All", color: MCOLOR[m.id], test: function () { return true; } }].concat(SPK.filter(function (k) { return mine.some(function (t) { return t.result !== "open" && sportK(t) === k; }); }).map(function (k) { return { name: SPORTN[k], color: SPORTC[k], dash: "5 3", test: function (t) { return sportK(t) === k; } }; })), mine); } });
      };
      MS.forEach(function (m) {
        var mine = p2().filter(function (t) { return t.meister === m.id; });
        headline($('[data-mhl="' + m.id + '"]'), mine);
        multiChart($('[data-pc="' + m.id + '"]'), [{ name: "All", color: MCOLOR[m.id], test: function () { return true; } }].concat(SPK.filter(function (k) { return mine.some(function (t) { return t.result !== "open" && sportK(t) === k; }); }).map(function (k) { return { name: SPORTN[k], color: SPORTC[k], dash: "5 3", test: function (t) { return sportK(t) === k; } }; })), mine);
      });
      showM();
    },
    news: function () {
      /* Owner 12 Nov 15:21: News page in the card style, with category tabs */
      var all = BM.NEWS.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }), cur = (location.hash || "").slice(1) || "all";
      var cats = ["BetMeisters", "Method", "Industry", "Preview"];
      var draw = function () {
        tabBar($("#news-tabs"), "Show", [["all", "All stories", null, all.length]].concat(cats.map(function (c) { return [c, c, NEWS_COL[c], all.filter(function (s) { return s.category === c; }).length]; })), cur, function (t) { cur = t; try { history.replaceState(null, "", t === "all" ? location.pathname : "#" + t); } catch (e) { } draw(); });
        var L = cur === "all" ? all : all.filter(function (s) { return s.category === cur; });
        $("#news-list").innerHTML = L.length ? '<ul class="ccards c3">' + L.map(newsCard).join("") + "</ul>" : '<p class="empty">No stories in this section yet.</p>';
      };
      draw();
    },
    article: function () {
      var el = $("#share"); if (el) el.innerHTML = shareButtons(document.title + (SITE.url ? " " + SITE.url : ""));
    },
    reviews: function () {
      /* Owner 12 Nov 15:21: Reviews page in the card style, with region tabs */
      var regs = ["UK & Ireland", "US", "South Africa", "Crypto"], cur = "all";
      var draw = function () {
        tabBar($("#review-tabs"), "Region", [["all", "All bookmakers", null, BM.REVIEWS.length]].concat(regs.map(function (r) { return [r, r, null, BM.REVIEWS.filter(function (x) { return reviewRegion(x) === r; }).length]; })), cur, function (t) { cur = t; draw(); });
        var L = cur === "all" ? BM.REVIEWS : BM.REVIEWS.filter(function (x) { return reviewRegion(x) === cur; });
        $("#review-cards").innerHTML = L.length ? '<ul class="ccards c3">' + L.map(reviewCard).join("") + "</ul>" : '<p class="empty">No reviews for this region yet.</p>';
      };
      draw();
    },
    review: function () { RENDER.article(); }
  };

  function refresh() { syncControls(); (RENDER[page] || function () { })(); }
  mountChrome();
  refresh();
  /* Owner 15 Nov 09:57: mobile review. Preview selector into the menu, one-line test note, filters folded behind a button (tier row stays), results day summary. */
  (function mobileUX() {
    var mob = window.matchMedia && window.matchMedia("(max-width: 760px)").matches;
    var mast = $("#mast"); if (mast) document.documentElement.style.setProperty("--mast-h", mast.offsetHeight + "px");
    var sb = $(".sample-bar"); if (sb) sb.addEventListener("click", function () { sb.classList.toggle("open"); });
    /* Owner 16 Nov 10:31: the selector follows the window width both ways (a widened window put it back in the yellow bar, label above the dropdown in the menu) */
    (function placeAccess() {
      var ua = $(".util-access"), nav = $("#site-nav"), home = $(".utility .util-grid"), odds = $(".util-odds"); if (!ua || !nav || !home) return;
      var mq = window.matchMedia("(max-width: 760px)");
      var put = function () { if (mq.matches) { if (!ua.classList.contains("in-nav")) { ua.classList.add("in-nav"); nav.appendChild(ua); } } else if (ua.classList.contains("in-nav")) { ua.classList.remove("in-nav"); home.insertBefore(ua, odds); } };
      put(); if (mq.addEventListener) mq.addEventListener("change", put); else if (mq.addListener) mq.addListener(put);
    })();
    var fold = function (boxSel, extraSel) {
      var box = $(boxSel); if (!box || box.getAttribute("data-folded")) return;
      box.setAttribute("data-folded", "1");
      var btn = document.createElement("button"); btn.type = "button"; btn.className = "pill more-filt"; btn.setAttribute("aria-expanded", "false"); btn.textContent = "More filters \u25be";
      box.parentNode.insertBefore(btn, box.nextSibling);
      var targets = function () { var t = $$(".filters", box).slice(1); (extraSel || []).forEach(function (x) { var e = $(x); if (e) t.push(e); }); return t; };
      var set = function (open) { targets().forEach(function (e) { e.classList.toggle("m-fold", !open); }); btn.setAttribute("aria-expanded", String(open)); btn.textContent = open ? "Fewer filters \u25b4" : "More filters \u25be"; };
      btn.addEventListener("click", function () { set(btn.getAttribute("aria-expanded") !== "true"); });
      set(false);
      new MutationObserver(function () { if (btn.getAttribute("aria-expanded") !== "true") set(false); }).observe(box, { childList: true });
    };
    if (mob) { fold("#tip-filters", ["#when-bar"]); fold("#res-filters", ["#res-narrow"]); fold("#ac-filters"); }
    if (page === "results") {
      var S = p2().filter(function (t) { return t.result !== "open"; }), dk = function (t) { return dayKey(t.start); };
      var td = dayKey(new Date().toISOString()), yd = dayKey(new Date(Date.now() - 864e5).toISOString());
      var line = function (lab, l) { var p = 0, w = 0, lo = 0; l.forEach(function (t) { p += profit(t); if (/won|placed/.test(t.result)) w++; else if (/lost/.test(t.result)) lo++; }); return '<span><b>' + lab + '</b> <b class="pts ' + cls(p) + '">' + pts(p) + "</b> \u00b7 " + w + "\u2013" + lo + " (" + l.length + " settled)</span>"; };
      var m = $("main.wrap"); if (m && !$(".res-sum")) { var d = document.createElement("div"); d.className = "res-sum"; d.innerHTML = line("Today", S.filter(function (t) { return dk(t) === td; })) + line("Yesterday", S.filter(function (t) { return dk(t) === yd; })); var rt = $("#res-table"); if (rt) rt.parentNode.insertBefore(d, rt); else m.insertBefore(d, m.firstChild); } /* Owner 23 Nov 18:14: filters straight under the header like Tips; the Today/Yesterday line sits above the results list */
    }
  })();
  var liveCount = live().length;
  setInterval(function () {
    if (live().length !== liveCount) { liveCount = live().length; refresh(); return; }
    $$("[data-countdown]").forEach(function (el) {
      var t = TIPS.filter(function (x) { return x.id === el.getAttribute("data-countdown"); })[0]; if (t) el.textContent = countdown(t);
    });
  }, 30000);
})();
