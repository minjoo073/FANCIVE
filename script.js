(function () {
  var SPREAD_W = 1917;
  var SPREAD_H = 967;

  function scaleSpread() {
    var spread = document.querySelector('.spread-wrapper');
    if (!spread) return;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var scale = Math.min(vw / SPREAD_W, vh / SPREAD_H);
    var x = (vw - SPREAD_W * scale) / 2;
    var y = (vh - SPREAD_H * scale) / 2;
    spread.style.transform =
      'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
  }

  window.addEventListener('resize', scaleSpread);
  scaleSpread();

  /* ── INTRO SEQUENCE ── */
  var overlay  = document.getElementById('introOverlay');
  var stocking = document.getElementById('introStocking');
  var brand    = document.getElementById('introBrand');
  var spread   = document.querySelector('.spread-wrapper');

  // t=1.2s — stocking begins slow scale-down toward spread position
  setTimeout(function () {
    stocking.style.transition =
      'transform 2.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 2.2s ease';
    stocking.style.transform  = 'scale(0.36) translateY(8%)';
    stocking.style.opacity    = '0.55';
  }, 1200);

  // t=2.8s — FANCIVE wordmark quietly appears
  setTimeout(function () {
    brand.style.transition = 'opacity 1.8s ease, filter 1.8s ease';
    brand.style.opacity    = '1';
    brand.style.filter     = 'blur(0px)';
  }, 2800);

  // t=4.2s — overlay dissolves, spread reveal begins simultaneously
  setTimeout(function () {
    overlay.style.transition    = 'opacity 1.8s ease';
    overlay.style.opacity       = '0';
    overlay.style.pointerEvents = 'none';
    spread.classList.add('reveal-active');
  }, 4200);

  // t=6.2s — overlay removed from DOM
  setTimeout(function () {
    overlay.style.display = 'none';
  }, 6200);

  // t=7.2s — all entry animations done, unlock hover interactions
  // reveal starts at 4.2s, max delay 1.1s + max duration 1.6s = 2.7s → ready ~6.9s
  setTimeout(function () {
    spread.classList.add('reveal-done');
  }, 7200);
})();
