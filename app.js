(function () {
  var CATS = ['族群文化', '部落新聞', '語言復振', '傳統祭儀', '土地與權益', '國際原住民新聞', '政策與補助'];
  var SITE = '原住民全球新聞網';
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  function esc(s) {
    return String(s || '').replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  if (typeof NEWS === 'undefined') {
    var main = $('#content');
    if (main && document.body.getAttribute('data-page') === 'home') {
      main.insertAdjacentHTML('afterbegin', '<p class="callout error" role="alert">新聞資料暫時無法載入。請稍後再試，或改讀關於我們。</p>');
    }
    return;
  }
  var N = NEWS.slice().sort(function (a, b) {
    return (b.date || '').localeCompare(a.date || '') || (b.id || '').localeCompare(a.id || '');
  });
  var state = { mode: 'home', cat: '', unit: '', q: '', shown: 3 };

  function href(n) { return 'article.html?id=' + encodeURIComponent(n.id); }
  function tag(n) { return '<span class="tag t-' + esc(n.category) + '">' + esc(n.category) + '</span>'; }
  function badges(n) { return n.sample ? '<span class="badge">示例</span>' : ''; }
  function meta(n) {
    var nation = n.nation && n.nationId
      ? '<a class="nation" href="nations.html#' + esc(n.nationId) + '">' + esc(n.nation) + '</a>'
      : (n.nation ? '<span class="unit">' + esc(n.nation) + '</span>' : '');
    return '<div class="meta">' + badges(n) + tag(n) + nation +
      '<span class="unit">' + esc(n.unit) + '</span><time datetime="' + esc(n.date) + '">' + esc(n.date || '日期待確認') + '</time></div>';
  }
  function sourceLine(n) {
    if (n.sample || !n.url) return '<p class="src muted">示例稿，沒有外部原文</p>';
    return '<a class="src" href="' + esc(n.url) + '" target="_blank" rel="noopener noreferrer">原始連結</a>';
  }
  function card(n, cls) {
    var sid = 'sum-' + n.id;
    return '<article class="' + (cls || 'card') + '" data-cat="' + esc(n.category) + '">' + meta(n) +
      '<h3><a href="' + href(n) + '">' + esc(n.title) + '</a></h3>' +
      '<p class="sum" id="' + sid + '">' + esc(n.summary) + '</p>' +
      '<button type="button" class="tog" aria-expanded="false" aria-controls="' + sid + '">展開摘要</button>' +
      sourceLine(n) + '</article>';
  }
  function folds() {
    $$('.sum').forEach(function (p) {
      var b = p.nextElementSibling;
      if (!b || !b.classList.contains('tog')) return;
      var overflow = p.scrollHeight > p.clientHeight + 2;
      b.hidden = !overflow && !p.classList.contains('open');
    });
  }
  function setTitle(t) { document.title = t ? (t + '｜' + SITE) : SITE; }
  function setH1(text) {
    var h1 = document.querySelector('main h1');
    if (h1) h1.textContent = text;
  }
  function announce(text) {
    var live = $('#result-live');
    if (live) live.textContent = text;
  }

  function side() {
    var units = {};
    N.forEach(function (n) {
      units[n.category] = units[n.category] || {};
      units[n.category][n.unit] = (units[n.category][n.unit] || 0) + 1;
    });
    var h = '<div class="box"><h2>來源單位</h2>';
    CATS.forEach(function (c) {
      if (!units[c]) return;
      h += '<p class="grp">' + esc(c) + '</p><ul class="units">';
      Object.keys(units[c]).sort(function (a, b) { return units[c][b] - units[c][a]; }).forEach(function (u) {
        var on = state.mode === 'cat' && state.cat === c && state.unit === u ? ' class="on"' : '';
        h += '<li><a href="#' + esc(c) + '/' + esc(u) + '"' + on + '>' + esc(u) + '<em>' + units[c][u] + '</em></a></li>';
      });
      h += '</ul>';
    });
    h += '</div><div class="box"><h2>最新示例</h2><ol class="latest">';
    N.slice(0, 8).forEach(function (n) {
      h += '<li><a href="' + href(n) + '">' + esc(n.title) + '</a><time>' + esc(n.date) + '｜' + esc(n.unit) + '</time></li>';
    });
    h += '</ol></div><div class="box"><h2>十六族導讀</h2><p>族別介紹在獨立頁面，不把民族誌寫成新聞。</p><p><a href="nations.html">閱讀十六族</a></p></div>';
    $$('.side').forEach(function (s) {
      if (s.id === 'related') return;
      s.innerHTML = h;
    });
  }

  function home() {
    state.mode = 'home';
    $('#home').hidden = false;
    $('#catview').hidden = true;
    setTitle('');
    setH1('新聞首頁');
    var l = N[0];
    if (!l) {
      $('#lead').innerHTML = '<p class="empty">目前沒有可顯示的稿件。</p>';
      $('#subs').innerHTML = '';
    } else {
      var sid = 'sum-lead';
      $('#lead').innerHTML = '<article class="lead">' + meta(l) + '<h2><a href="' + href(l) + '">' + esc(l.title) + '</a></h2>' +
        '<p class="sum" id="' + sid + '">' + esc(l.summary) + '</p>' +
        '<button type="button" class="tog" aria-expanded="false" aria-controls="' + sid + '">展開摘要</button>' +
        sourceLine(l) + '</article>';
      $('#subs').innerHTML = '<h2 class="kicker">焦點示例</h2>' + N.slice(1, 5).map(function (n) {
        return '<article class="subh">' + meta(n) + '<h3><a href="' + href(n) + '">' + esc(n.title) + '</a></h3></article>';
      }).join('');
    }
    $$('.block').forEach(function (b) {
      var rows = N.filter(function (n) { return n.category === b.getAttribute('data-cat'); }).slice(0, 4);
      b.hidden = !rows.length;
      var grid = b.querySelector('.grid');
      if (grid) grid.innerHTML = rows.map(function (n) { return card(n); }).join('');
    });
    markNav('首頁');
    announce('新聞首頁，共 ' + N.length + ' 則示例稿');
    side();
    folds();
  }

  function listRows() {
    return N.filter(function (n) {
      if (state.mode === 'search') {
        var hay = (n.title + n.summary + (n.nation || '') + n.category + n.unit).toLowerCase();
        return hay.indexOf(state.q.toLowerCase()) >= 0;
      }
      if (n.category !== state.cat) return false;
      if (state.unit && n.unit !== state.unit) return false;
      return true;
    });
  }

  function showList() {
    $('#home').hidden = true;
    $('#catview').hidden = false;
    var rows = listRows();
    var sampleAll = rows.length > 0 && rows.every(function (n) { return n.sample; });
    var title, metaHtml;
    if (state.mode === 'search') {
      title = '搜尋結果';
      setTitle('搜尋：「' + state.q + '」');
      metaHtml = '「' + esc(state.q) + '」共 ' + rows.length + ' 則' + (sampleAll ? '示例稿' : '') +
        ' · <a href="#首頁">回新聞首頁</a>';
    } else {
      title = state.cat + (state.unit ? '｜' + state.unit : '');
      setTitle(state.cat);
      metaHtml = '共 ' + rows.length + ' 則' + (sampleAll ? '示例稿' : '') +
        (state.unit ? ' · <a href="#' + esc(state.cat) + '">顯示此分類全部單位</a>' : '');
    }
    $('#ctitle').textContent = title;
    setH1(title);
    $('#cmeta').innerHTML = metaHtml;
    var slice = rows.slice(0, state.shown);
    $('#clist').innerHTML = slice.length
      ? slice.map(function (n) { return card(n, 'card row'); }).join('')
      : '<p class="empty">沒有符合的稿件。可換關鍵字，或回到新聞首頁。</p>';
    $('#more').hidden = rows.length <= state.shown;
    markNav(state.mode === 'cat' ? state.cat : '');
    announce(title + '，顯示 ' + slice.length + ' 則，共 ' + rows.length + ' 則');
    side();
    folds();
  }

  function markNav(cat) {
    $$('.catnav a').forEach(function (a) {
      var on = a.getAttribute('data-c') === cat;
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function route(scroll) {
    var raw = location.hash.replace(/^#/, '');
    var h = raw;
    try { h = decodeURIComponent(raw); } catch (e) {}
    state.shown = 3;
    state.unit = '';
    state.q = '';
    if (!h || h === '首頁') {
      state.mode = 'home';
      home();
    } else if (h.indexOf('搜尋/') === 0) {
      state.mode = 'search';
      state.q = h.slice(3).trim();
      var qEl = $('#q');
      if (qEl) qEl.value = state.q;
      if (!state.q) { home(); return; }
      showList();
    } else {
      var parts = h.split('/');
      var cat = parts[0];
      if (CATS.indexOf(cat) < 0) { home(); return; }
      state.mode = 'cat';
      state.cat = cat;
      state.unit = parts.slice(1).join('/');
      showList();
    }
    if (scroll) window.scrollTo(0, 0);
  }

  function bootArticle() {
    var id = new URLSearchParams(location.search).get('id');
    var n = N.filter(function (x) { return x.id === id; })[0];
    var root = $('#article');
    var related = $('#related');
    if (!n) {
      document.title = '找不到稿件｜' + SITE;
      root.innerHTML = '<p class="callout error" role="alert">找不到這則稿件。請回新聞首頁重新選擇。</p><p><a href="index.html">回新聞首頁</a></p>';
      if (related) related.innerHTML = '';
      return;
    }
    document.title = n.title + '｜' + SITE;
    var disclaimer = n.sample
      ? '<p class="sample-banner" role="note"><strong>示例稿。</strong>這不是採訪成品，沒有真實受訪者，也沒有對應已經發生的事件。日期只用來示範排序。</p>'
      : '';
    root.innerHTML = disclaimer + '<div class="article-body">' + meta(n) + '<h2>' + esc(n.title) + '</h2><p class="sum">' + esc(n.summary) + '</p>' + sourceLine(n) + '</div>';
    var more = N.filter(function (x) { return x.category === n.category && x.id !== n.id; }).slice(0, 4);
    if (related) {
      related.innerHTML = '<div class="box"><h2>同分類示例</h2><ol class="latest">' + more.map(function (x) {
        return '<li><a href="' + href(x) + '">' + esc(x.title) + '</a><time>' + esc(x.date) + '</time></li>';
      }).join('') + '</ol></div><div class="box"><h2>回到分類</h2><p><a href="index.html#' + esc(n.category) + '">' + esc(n.category) + '</a></p></div>';
    }
  }

  if (document.body.getAttribute('data-page') === 'article') {
    bootArticle();
    return;
  }
  if (document.body.getAttribute('data-page') !== 'home') return;

  var upd = $('#upd');
  if (upd && typeof UPDATED === 'string') upd.textContent = '資料更新：' + UPDATED;
  var count = $('#sample-count');
  if (count) count.textContent = String(N.length);

  var form = $('#searchform');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = $('#q').value.trim();
      location.hash = q ? ('搜尋/' + encodeURIComponent(q)) : '首頁';
    });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.tog');
    if (!t) return;
    var p = document.getElementById(t.getAttribute('aria-controls'));
    if (!p) return;
    var open = p.classList.toggle('open');
    t.setAttribute('aria-expanded', open ? 'true' : 'false');
    t.textContent = open ? '收合摘要' : '展開摘要';
  });
  $('#more').addEventListener('click', function () {
    state.shown += 3;
    showList();
    folds();
  });
  window.addEventListener('hashchange', function () { route(true); });
  window.addEventListener('resize', folds);
  window.addEventListener('load', folds);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(folds);
  route(false);
})();
