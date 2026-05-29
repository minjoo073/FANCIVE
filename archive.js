(function () {
  var CANVAS_W = 1920;
  var CANVAS_H = 1080;

  function scaleWrapper() {
    var el = document.querySelector('.ar-wrapper');
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

  setTimeout(function () {
    document.body.classList.add('is-visible');
    var wrapper = document.querySelector('.ar-wrapper');
    if (wrapper) wrapper.classList.add('is-ready');
  }, 60);

  function fadeNavigate(url) {
    document.body.style.transition = 'opacity 0.45s ease';
    document.body.style.opacity = '0';
    setTimeout(function () { window.location.href = url; }, 460);
  }

  var logo = document.getElementById('ar_brand_logo');
  if (logo) {
    logo.addEventListener('click', function (e) {
      e.preventDefault();
      fadeNavigate('index.html');
    });
  }

  var menuCollection = document.getElementById('ar_menu_collection');
  if (menuCollection) {
    menuCollection.addEventListener('click', function () {
      fadeNavigate('collection.html');
    });
  }

  var menuAbout = document.getElementById('ar_menu_about');
  if (menuAbout) {
    menuAbout.addEventListener('click', function () {
      fadeNavigate('about.html');
    });
  }

  // ── Drum interaction ─────────────────────────────────
  var SEASONS = [
    { no: '04', name: 'A/W 2024', status: '—',           url: null },
    { no: '03', name: 'S/S 2025', status: '—',           url: null },
    { no: '01', name: 'S/S 2026', status: '7 LOOKS',     url: 'collection.html' },
    { no: '02', name: 'A/W 2025', status: 'FORTHCOMING', url: null },
  ];
  var N = SEASONS.length;
  var centerIdx = 2; // S/S 2026
  var isRotating = false;

  var drumItems = document.querySelectorAll('.ar-drum-item');
  // [0]=far-top  [1]=near-top  [2]=center  [3]=near-bottom
  var OFFSETS = [-2, -1, 0, 1];

  function getSeason(offset) {
    return SEASONS[(centerIdx + offset + N * 10) % N];
  }

  function renderDrum() {
    drumItems.forEach(function (el, i) {
      var s = getSeason(OFFSETS[i]);
      var isCenter = (i === 2);
      el.querySelector('.ar-season-no').textContent   = s.no;
      el.querySelector('.ar-season-name').textContent = s.name;
      el.querySelector('.ar-season-status').textContent = s.status;
      var arrow = el.querySelector('.ar-season-arrow');
      if (arrow) arrow.style.display = (isCenter && s.url) ? '' : 'none';
    });
  }

  function rotateDrum(delta) {
    if (isRotating) return;
    isRotating = true;
    centerIdx = (centerIdx + delta + N) % N;

    drumItems.forEach(function (el) {
      el.style.transition = 'opacity 0.18s ease';
      el.style.opacity    = '0';
    });

    setTimeout(function () {
      renderDrum();
      drumItems.forEach(function (el) {
        el.style.transition = 'opacity 0.28s ease';
        el.style.opacity    = '';
      });
      setTimeout(function () { isRotating = false; }, 320);
    }, 200);
  }

  renderDrum();

  // Near-top click → rotate up
  if (drumItems[1]) drumItems[1].addEventListener('click', function () { rotateDrum(-1); });
  // Near-bottom click → rotate down
  if (drumItems[3]) drumItems[3].addEventListener('click', function () { rotateDrum(1); });
  // Center click → navigate
  if (drumItems[2]) {
    drumItems[2].addEventListener('click', function () {
      var s = getSeason(0);
      if (s.url) fadeNavigate(s.url);
    });
  }

  // Wheel scroll anywhere on page
  var wheelCooldown = null;
  document.addEventListener('wheel', function (e) {
    if (isRotating || wheelCooldown) return;
    if (Math.abs(e.deltaY) < 40) return;
    rotateDrum(e.deltaY > 0 ? 1 : -1);
    wheelCooldown = setTimeout(function () { wheelCooldown = null; }, 600);
  }, { passive: true });
})();
