(function () {
  'use strict';

  document.documentElement.classList.add('js');

  // 段落末の泣き別れ（「す。」だけの最終行など）を、字送りグリッドを 1 字ずらして解消する。
  // まず 1 字多く詰める追い込み、だめなら 1 字少なくして前の行から送る追い出しを試し、
  // 字間が許容範囲を外れる場合や効果がない場合は元に戻す。
  var SHORT_LAST_LINE = 3.5; // em：これ未満の最終行を泣き別れとみなす（約物込み 3 字）
  var MIN_TRACKING = -0.03;  // em：追い込みで許す字間の下限
  var MAX_TRACKING = 0.12;   // em：追い出しで許す字間の上限

  function lineBoxes(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var lines = [];
    Array.prototype.forEach.call(range.getClientRects(), function (r) {
      if (!r.width) return;
      var last = lines[lines.length - 1];
      if (last && Math.abs(last.top - r.top) < 2) {
        last.width += r.width;
      } else {
        lines.push({ top: r.top, width: r.width });
      }
    });
    return lines;
  }

  function hasShortLastLine(el, fontSize) {
    var lines = lineBoxes(el);
    return lines.length > 1 && lines[lines.length - 1].width < SHORT_LAST_LINE * fontSize;
  }

  function avoidWidows() {
    document.querySelectorAll('.text').forEach(function (p) {
      p.style.removeProperty('--n-adjust');
      var fontSize = parseFloat(getComputedStyle(p).fontSize);
      if (!hasShortLastLine(p, fontSize)) return;

      var fixed = ['1', '-1'].some(function (adjust) {
        p.style.setProperty('--n-adjust', adjust);
        var tracking = parseFloat(getComputedStyle(p).letterSpacing) / fontSize;
        return tracking >= MIN_TRACKING && tracking <= MAX_TRACKING &&
          !hasShortLastLine(p, fontSize);
      });
      if (!fixed) p.style.removeProperty('--n-adjust');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var targets = document.querySelectorAll('.js-fade');

    // 文字組の調整はフォント読み込み後と、版面の幅が変わったときに行う
    if (window.CSS && CSS.supports('width: 1cqi')) {
      var lastWidth = 0;
      new ResizeObserver(function (entries) {
        var w = entries[0].contentRect.width;
        if (w !== lastWidth) { lastWidth = w; avoidWidows(); }
      }).observe(document.querySelector('.bg')); // 画面幅に追従し、本文の組み替えで寸法が変わらない要素を監視する
      // Noto Sans JP はサブセット分割で順次届くので、読み込みのたびに組み直す
      if (document.fonts) {
        document.fonts.ready.then(avoidWidows);
        document.fonts.addEventListener('loadingdone', avoidWidows);
      }
    }

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
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
  });
})();
