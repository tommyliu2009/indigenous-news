(function () {
  var W = '日一二三四五六';
  var d = new Date();
  var today = document.getElementById('today');
  if (today) {
    today.textContent = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 星期' + W[d.getDay()];
  }
  var key = 'ipgn-fs';
  var saved = 'md';
  try { saved = localStorage.getItem(key) || 'md'; } catch (e) {}
  if (['sm', 'md', 'lg'].indexOf(saved) < 0) saved = 'md';
  function apply(v) {
    document.documentElement.setAttribute('data-fs', v);
    try { localStorage.setItem(key, v); } catch (e) {}
    document.querySelectorAll('[data-fs-set]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-fs-set') === v ? 'true' : 'false');
    });
  }
  apply(saved);
  document.querySelectorAll('[data-fs-set]').forEach(function (b) {
    b.addEventListener('click', function () { apply(b.getAttribute('data-fs-set')); });
  });
  var page = document.body.getAttribute('data-page');
  document.querySelectorAll('.utilnav a').forEach(function (a) {
    if (a.getAttribute('data-nav') === page) a.setAttribute('aria-current', 'page');
  });

  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var topic = form.topic.value.trim();
    var message = form.message.value.trim();
    var agree = form.agree.checked;
    var errors = [];
    if (!name) errors.push('請填寫稱呼。');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('請填寫有效的電子郵件，格式需含 @。');
    if (!topic) errors.push('請填寫主旨。');
    if (message.length < 10) errors.push('訊息請至少寫 10 個字。');
    if (!agree) errors.push('請勾選「我了解此表單不會送出」。');
    status.hidden = false;
    if (errors.length) {
      status.className = 'callout error';
      status.textContent = errors.join('\n');
      status.focus();
      return;
    }
    form.reset();
    status.className = 'callout ok';
    status.textContent = '這是功能示例：訊息只留在這個畫面，沒有送到伺服器，也沒有工作人員會讀到。正式信箱公布前，請勿留下身分證字號或其他敏感資料。';
    status.focus();
  });
})();
