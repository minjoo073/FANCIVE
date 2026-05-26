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

  // Active season → collection
  var season01 = document.getElementById('ar_season01');
  if (season01) {
    season01.addEventListener('click', function () {
      fadeNavigate('collection.html');
    });
  }
})();
