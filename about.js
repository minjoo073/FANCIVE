(function () {
  var CANVAS_W = 1920;
  var CANVAS_H = 1080;

  function scaleWrapper() {
    var el = document.querySelector('.ab-wrapper');
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

  function triggerReady() {
    document.body.classList.add('is-visible');
    var wrapper = document.querySelector('.ab-wrapper');
    if (wrapper) wrapper.classList.add('is-ready');
  }

  var criticalIds = ['ab_obj1', 'ab_obj2', 'ab_obj3'];
  var imgs = criticalIds.map(function(id) { return document.getElementById(id); }).filter(Boolean);
  var loaded = 0;

  function onImgLoad() {
    loaded++;
    if (loaded >= imgs.length) triggerReady();
  }

  imgs.forEach(function(img) {
    if (img.complete && img.naturalWidth > 0) {
      onImgLoad();
    } else {
      img.addEventListener('load', onImgLoad);
      img.addEventListener('error', onImgLoad);
    }
  });

  setTimeout(triggerReady, 4000);

  function fadeNavigate(url) {
    document.body.style.transition = 'opacity 0.45s ease';
    document.body.style.opacity = '0';
    setTimeout(function () { window.location.href = url; }, 460);
  }

  var logo = document.getElementById('ab_brand_logo');
  if (logo) {
    logo.addEventListener('click', function (e) {
      e.preventDefault();
      fadeNavigate('index.html');
    });
  }

  var menuCollection = document.getElementById('ab_menu_collection');
  if (menuCollection) {
    menuCollection.addEventListener('click', function () {
      fadeNavigate('collection.html');
    });
  }

  var menuArchive = document.getElementById('ab_menu_archive');
  if (menuArchive) {
    menuArchive.addEventListener('click', function () {
      fadeNavigate('archive.html');
    });
  }
})();
