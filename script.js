(function () {
  var SPREAD_W = 1917;
  var SPREAD_H = 967;

  function scaleSpread() {
    var el = document.querySelector('.spread-wrapper');
    if (!el) return;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var scale = Math.min(vw / SPREAD_W, vh / SPREAD_H);
    var x = (vw - SPREAD_W * scale) / 2;
    var y = (vh - SPREAD_H * scale) / 2;
    el.style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
  }

  window.addEventListener('resize', scaleSpread);
  scaleSpread();

  var spread = document.querySelector('.spread-wrapper');

  // brief dark pause → papers appear → images blur-to-focus with stagger
  setTimeout(function () {
    spread.classList.add('reveal-active');
  }, 200);

  // images done: max delay 0.85s + duration 2.0s = 2.85s
  // texts done:  max delay 2.5s  + duration 1.4s = 3.9s
  // add reveal-done at 4.5s → unlock hover, float, drift
  setTimeout(function () {
    spread.classList.add('reveal-done');
  }, 4700);
})();
