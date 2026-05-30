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

  var spread       = document.querySelector('.spread-wrapper');
  var introScreen  = document.getElementById('introScreen');
  var introHero    = document.getElementById('introHeroImg');
  var introWordmark = document.getElementById('introWordmark');

  // ── Skip intro if already seen ────────────────────────
  if (sessionStorage.getItem('introSeen')) {
    // Remove intro immediately, show everything at once
    if (introScreen && introScreen.parentNode) {
      introScreen.parentNode.removeChild(introScreen);
    }
    document.querySelectorAll('.left-paper, .right-paper').forEach(function (p) {
      p.style.opacity = '1';
    });
    document.querySelectorAll('.el').forEach(function (el) {
      el.style.animation = 'none';
      el.style.transform = '';
    });
    var ribbon = document.getElementById('right_ribbon_image');
    if (ribbon) { ribbon.style.animation = 'drift-ribbon 7s ease-in-out infinite'; }
    spread.classList.add('reveal-done');
  } else {
    // First visit — run full intro sequence
    sessionStorage.setItem('introSeen', '1');

    // t=100ms  — hero starts blur-to-focus (3.0s transition)
    setTimeout(function () {
      introHero.classList.add('is-revealing');
    }, 100);

    // t=1900ms — wordmark fades in (hero ~60% through blur clear)
    setTimeout(function () {
      introWordmark.classList.add('is-revealing');
    }, 1900);

    // t=4000ms — intro begins fading out; spread reveal starts simultaneously
    setTimeout(function () {
      introScreen.classList.add('is-hiding');
      spread.classList.add('reveal-active');
    }, 4000);

    // t=5400ms — intro removed from DOM (after 1.4s fade)
    setTimeout(function () {
      if (introScreen && introScreen.parentNode) {
        introScreen.parentNode.removeChild(introScreen);
      }
    }, 5400);

    // spread animations complete: 4000ms offset + 4700ms = 8700ms
    setTimeout(function () {
      spread.classList.add('reveal-done');
    }, 8700);
  }

  function overlayNavigate(url) {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:#1a1816;opacity:0;z-index:9999;pointer-events:all;transition:opacity 0.65s cubic-bezier(0.4,0,0.2,1)';
    document.body.appendChild(overlay);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.style.opacity = '1';
      });
    });
    setTimeout(function () { window.location.href = url; }, 680);
  }

  // Navigate to collection page
  var collectionBtn = document.getElementById('right_collection');
  if (collectionBtn) {
    collectionBtn.addEventListener('click', function () { overlayNavigate('collection.html'); });
  }

  // Navigate to about page
  var aboutBtn = document.getElementById('right_about');
  if (aboutBtn) {
    aboutBtn.addEventListener('click', function () { overlayNavigate('about.html'); });
  }

  // Navigate to archive page
  var archiveBtn = document.getElementById('right_archive');
  if (archiveBtn) {
    archiveBtn.addEventListener('click', function () { overlayNavigate('archive.html'); });
  }
})();
