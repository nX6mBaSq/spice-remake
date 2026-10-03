(function () {
  'use strict';

  document.documentElement.classList.add('js');

  document.addEventListener('DOMContentLoaded', function () {
    var targets = document.querySelectorAll('.js-fade');
    var floatCta = document.getElementById('float-cta');

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      if (floatCta) floatCta.classList.add('is-visible');
      return;
    }

    // カードのフェードイン
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    targets.forEach(function (el) { io.observe(el); });

    // 追従CTA：ファーストビュー・お問い合わせ・フッターのいずれかが見えている間は隠す
    if (floatCta) {
      var hiders = [
        document.querySelector('.hero'),
        document.getElementById('contact'),
        document.querySelector('.footer')
      ].filter(Boolean);
      var visible = new Set();
      var ctaIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        floatCta.classList.toggle('is-visible', visible.size === 0);
      });
      hiders.forEach(function (el) { ctaIo.observe(el); });
    }
  });
})();
