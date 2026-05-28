(function () {
  var CANVAS_W = 1920;
  var CANVAS_H = 1080;

  function scaleWrapper() {
    var el = document.querySelector('.c-wrapper');
    if (!el) return;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var scale = Math.min(vw / CANVAS_W, vh / CANVAS_H);
    var x = (vw - CANVAS_W * scale) / 2;
    var y = (vh - CANVAS_H * scale) / 2;
    el.style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
  }

  window.addEventListener('resize', scaleWrapper);
  scaleWrapper();

  // Entry: fade out dark overlay, trigger image animations simultaneously
  setTimeout(function () {
    var overlay = document.getElementById('c-page-overlay');
    if (overlay) overlay.classList.add('is-gone');
    var wrapper = document.querySelector('.c-wrapper');
    if (wrapper) wrapper.classList.add('is-ready');
  }, 60);

  // 애니메이션 종료 후 fill 해제 — opacity:1 명시해야 초기 hidden state 덮어씀
  setTimeout(function () {
    var imgs = document.querySelectorAll('#c_hero_main,#c_look01,#c_look02,#c_look03,#c_look04,#c_look05,#c_look06');
    imgs.forEach(function (img) {
      img.style.animation  = 'none';
      img.style.opacity    = '1';
      img.style.transform  = '';
    });
  }, 3500);

  // Neighbor fade on hover
  var LOOK_IDS = ['c_look01','c_look02','c_look03','c_look04','c_look05','c_look06','c_hero_main'];
  var SCALE_MAP = { c_look04: 1.04 };
  var hoveredId = null;

  LOOK_IDS.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('mouseenter', function() {
      hoveredId = id;
      LOOK_IDS.forEach(function(otherId) {
        var other = document.getElementById(otherId);
        if (!other) return;
        if (otherId === id) {
          other.style.opacity = '1';
          other.style.transform = 'translateY(-5px)';
        } else {
          other.style.opacity = '0.45';
          other.style.transform = '';
        }
      });
    });

    el.addEventListener('mouseleave', function() {
      if (hoveredId !== id) return;
      hoveredId = null;
      LOOK_IDS.forEach(function(otherId) {
        var other = document.getElementById(otherId);
        if (!other) return;
        other.style.opacity = '1';
        other.style.transform = '';
      });
    });
  });

  // Navigate to look detail page
  function magneticNavigate(url) {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:#F1F0F0;opacity:0;z-index:9999;pointer-events:all;transition:opacity 0.7s ease';
    document.body.appendChild(overlay);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { overlay.style.opacity = '1'; });
    });
    setTimeout(function () { window.location.href = url; }, 730);
  }

  [1, 2, 3, 4, 5, 6].forEach(function (n) {
    var id = n < 10 ? '0' + n : '' + n;
    var el = document.getElementById('c_look' + id);
    if (el) {
      el.addEventListener('click', function () {
        magneticNavigate('look-detail.html#' + n);
      });
    }
  });

  // Hero main image → look 7
  var hero = document.getElementById('c_hero_main');
  if (hero) {
    hero.style.cursor = 'pointer';
    hero.addEventListener('click', function () {
      magneticNavigate('look-detail.html#7');
    });
  }

  // Navigate back to main
  var logo = document.getElementById('c_brand_logo');
  if (logo) {
    logo.addEventListener('click', function (e) {
      e.preventDefault();
      fadeNavigate('index.html');
    });
  }

  function fadeNavigate(url) {
    document.body.style.transition = 'opacity 0.45s ease';
    document.body.style.opacity = '0';
    setTimeout(function () { window.location.href = url; }, 460);
  }

  // Menu navigation
  var menuSpans = document.querySelectorAll('#c_menu_group span');
  menuSpans.forEach(function (span) {
    var text = span.textContent.trim();
    if (text === 'ABOUT') {
      span.style.cursor = 'pointer';
      span.addEventListener('click', function () { fadeNavigate('about.html'); });
    } else if (text === 'ARCHIVE') {
      span.style.cursor = 'pointer';
      span.addEventListener('click', function () { fadeNavigate('archive.html'); });
    }
  });
})();
