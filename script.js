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

  // all spread images — intro id → actual spread element id
  var pairs = [
    { iId: 'iMain',      sId: 'left_main_image'      },
    { iId: 'iStocking',  sId: 'right_stocking_image' },
    { iId: 'iRightMain', sId: 'right_main_image'     },
    { iId: 'iModel',     sId: 'right_model_image'    },
    { iId: 'iDetail',    sId: 'left_detail_image'    },
    { iId: 'iObject',    sId: 'right_object'         },
    { iId: 'iShoe',      sId: 'left_shoe_object'     },
    { iId: 'iItem',      sId: 'right_item'           },
    { iId: 'iRibbon',    sId: 'right_ribbon_image'   }
  ];

  // t=0.3s — editorial images softly appear
  setTimeout(function () {
    pairs.forEach(function (p) {
      var el = document.getElementById(p.iId);
      el.style.transition = 'opacity 1.0s ease';
      el.style.opacity    = '1';
    });
  }, 300);

  // t=1.6s — images begin drifting to exact spread positions
  setTimeout(function () {
    pairs.forEach(function (p) {
      var introEl  = document.getElementById(p.iId);
      var spreadEl = document.getElementById(p.sId);

      var iR = introEl.getBoundingClientRect();
      var sR = spreadEl.getBoundingClientRect();

      var dx = (sR.left + sR.width  / 2) - (iR.left + iR.width  / 2);
      var dy = (sR.top  + sR.height / 2) - (iR.top  + iR.height / 2);
      var s  = sR.width / iR.width;

      introEl.style.transition =
        'transform 3.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      introEl.style.transform =
        'translate(' + dx.toFixed(2) + 'px,' + dy.toFixed(2) + 'px) scale(' + s.toFixed(4) + ')';
    });
  }, 1600);

  // t=2.4s — FANCIVE typography quietly appears mid-movement
  setTimeout(function () {
    brand.style.transition = 'opacity 1.8s ease, filter 1.8s ease';
    brand.style.opacity    = '1';
    brand.style.filter     = 'blur(0px)';
  }, 2400);

  // t=5.0s — images at destinations (1.6 + 3.4 = 5.0s)
  //   1. spread reveals (papers instantly, elements stagger)
  //   2. clip-path wipe sweeps overlay left → right (1.1s)
  setTimeout(function () {
    spread.classList.add('reveal-active');

    // slight delay so spread papers are rendered before wipe starts
    setTimeout(function () {
      overlay.classList.add('wipe-exit');
      overlay.style.pointerEvents = 'none';
    }, 80);
  }, 5000);

  // t=6.3s — wipe done, remove overlay from DOM
  setTimeout(function () {
    overlay.style.display = 'none';
  }, 6400);

  // t=7.2s — all entry animations done, unlock hover
  setTimeout(function () {
    spread.classList.add('reveal-done');
  }, 7200);
})();
