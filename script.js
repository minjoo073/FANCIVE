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

  /* ── INTRO: editorial collage → spread assembling ── */

  var overlay = document.getElementById('introOverlay');
  var brand   = document.getElementById('introBrand');
  var spread  = document.querySelector('.spread-wrapper');

  // intro image → actual spread element pairs
  var pairs = [
    { iId: 'introImg_main',     sId: 'left_main_image'      },
    { iId: 'introImg_stocking', sId: 'right_stocking_image' },
    { iId: 'introImg_detail',   sId: 'left_detail_image'    },
    { iId: 'introImg_model',    sId: 'right_model_image'    }
  ];

  // t=0.3s — editorial images softly appear
  setTimeout(function () {
    pairs.forEach(function (p) {
      var el = document.getElementById(p.iId);
      el.style.transition = 'opacity 1.0s ease';
      el.style.opacity    = '1';
    });
  }, 300);

  // t=1.6s — images begin drifting toward their exact spread positions
  // getBoundingClientRect() returns viewport coords of hidden spread elements
  setTimeout(function () {
    pairs.forEach(function (p) {
      var introEl  = document.getElementById(p.iId);
      var spreadEl = document.getElementById(p.sId);

      var iR = introEl.getBoundingClientRect();
      var sR = spreadEl.getBoundingClientRect();

      // translate center-to-center + scale to match spread element size
      var dx = (sR.left + sR.width  / 2) - (iR.left + iR.width  / 2);
      var dy = (sR.top  + sR.height / 2) - (iR.top  + iR.height / 2);
      var s  = sR.width / iR.width;

      introEl.style.transition =
        'transform 3.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      introEl.style.transform  =
        'translate(' + dx.toFixed(2) + 'px,' + dy.toFixed(2) + 'px) scale(' + s.toFixed(4) + ')';
    });
  }, 1600);

  // t=2.4s — FANCIVE typography quietly appears during movement
  setTimeout(function () {
    brand.style.transition = 'opacity 1.8s ease, filter 1.8s ease';
    brand.style.opacity    = '1';
    brand.style.filter     = 'blur(0px)';
  }, 2400);

  // t=5.0s — images arrive at destinations (1.6 + 3.4 = 5.0s)
  //          overlay dissolves + spread reveal begins simultaneously
  setTimeout(function () {
    overlay.style.transition    = 'opacity 2.0s ease';
    overlay.style.opacity       = '0';
    overlay.style.pointerEvents = 'none';
    spread.classList.add('reveal-active');
  }, 5000);

  // t=7.2s — overlay removed from DOM
  setTimeout(function () {
    overlay.style.display = 'none';
  }, 7200);

  // t=8.0s — all entry animations done, unlock hover interactions
  setTimeout(function () {
    spread.classList.add('reveal-done');
  }, 8000);
})();
