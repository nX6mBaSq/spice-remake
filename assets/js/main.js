(function () {
  'use strict';

  document.documentElement.classList.add('js');

  document.addEventListener('DOMContentLoaded', function () {
    // ハンバーガーメニュー
    var btn = document.querySelector('.menu-btn');
    var nav = document.getElementById('global-nav');

    function setMenu(open) {
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      nav.hidden = !open;
      document.body.classList.toggle('is-menu-open', open);
    }

    btn.addEventListener('click', function () {
      setMenu(btn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !nav.hidden) {
        setMenu(false);
        btn.focus();
      }
    });

    // カードのフェードイン
    var targets = document.querySelectorAll('.js-fade');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    targets.forEach(function (el) { io.observe(el); });
  });
})();
