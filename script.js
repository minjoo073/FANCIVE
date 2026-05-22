(function () {
  var SPREAD_W = 1917;
  var SPREAD_H = 967;

  function scaleSpread() {
    var spread = document.querySelector('.spread-wrapper');
    if (!spread) return;

    var vw = window.innerWidth;
    var vh = window.innerHeight;

    var scale = Math.min(vw / SPREAD_W, vh / SPREAD_H);

    // center the scaled spread in the viewport
    var x = (vw - SPREAD_W * scale) / 2;
    var y = (vh - SPREAD_H * scale) / 2;

    spread.style.transform =
      'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
  }

  window.addEventListener('resize', scaleSpread);
  scaleSpread();
})();
