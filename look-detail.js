(function () {
  var CANVAS_W = 1920;
  var CANVAS_H = 1080;
  var TOTAL_LOOKS = 7;

  // Per-look image positions from collection-sub-design-spec
  var LAYOUT = [
    null,
    // look 01
    [
      { p: 'a', x: 31,   y: 47,  w: 468, h: 644 },
      { p: 'b', x: 469,  y: 47,  w: 470, h: 716 },
      { p: 'c', x: 960,  y: 47,  w: 462, h: 840 },
      { p: 'd', x: 1437, y: 100, w: 455, h: 329 },
      { p: 'e', x: 1437, y: 444, w: 455, h: 347 },
    ],
    // look 02
    [
      { p: 'a', x: 32,   y: 47,  w: 558, h: 774 },
      { p: 'b', x: 548,  y: 47,  w: 376, h: 542 },
      { p: 'c', x: 968,  y: 47,  w: 452, h: 785 },
      { p: 'd', x: 1437, y: 100, w: 453, h: 330 },
      { p: 'e', x: 1437, y: 443, w: 453, h: 347 },
    ],
    // look 03
    [
      { p: 'a', x: 31,   y: 47,  w: 567, h: 676 },
      { p: 'b', x: 501,  y: 47,  w: 421, h: 556 },
      { p: 'c', x: 968,  y: 47,  w: 453, h: 868 },
      { p: 'd', x: 1436, y: 100, w: 455, h: 329 },
      { p: 'e', x: 1436, y: 444, w: 454, h: 346 },
    ],
    // look 04
    [
      { p: 'a', x: 30,   y: 47,  w: 566, h: 615 },
      { p: 'b', x: 572,  y: 47,  w: 339, h: 691 },
      { p: 'c', x: 968,  y: 47,  w: 453, h: 875 },
      { p: 'd', x: 1436, y: 100, w: 456, h: 328 },
      { p: 'e', x: 1436, y: 444, w: 456, h: 348 },
    ],
    // look 05
    [
      { p: 'a', x: 31,   y: 47,  w: 528, h: 727 },
      { p: 'b', x: 508,  y: 47,  w: 416, h: 556 },
      { p: 'c', x: 968,  y: 47,  w: 454, h: 796 },
      { p: 'd', x: 1436, y: 100, w: 454, h: 330 },
      { p: 'e', x: 1436, y: 440, w: 457, h: 487 },
    ],
    // look 06
    [
      { p: 'a', x: 31,   y: 47,  w: 610, h: 600 },
      { p: 'b', x: 499,  y: 47,  w: 415, h: 709 },
      { p: 'c', x: 969,  y: 47,  w: 451, h: 869 },
      { p: 'd', x: 1436, y: 100, w: 456, h: 329 },
      { p: 'e', x: 1436, y: 443, w: 456, h: 440 },
    ],
    // look 07
    [
      { p: 'a', x: 31,   y: 47,  w: 527, h: 657 },
      { p: 'b', x: 555,  y: 47,  w: 368, h: 570 },
      { p: 'c', x: 969,  y: 47,  w: 454, h: 800 },
      { p: 'd', x: 1437, y: 100, w: 456, h: 331 },
      { p: 'e', x: 1437, y: 444, w: 456, h: 396 },
    ],
  ];

  var DESCS = [
    null,
    // look 01
    [
      { text: 'Washed grey cardigan,\nwhite slip beneath.',                                                  left: 31,  bottom: 255 },
      { text: 'Softness structured through layering—\nfaded intimacy, held without grip.',                   left: 175, bottom: 98  },
    ],
    // look 02
    [
      { text: 'Grey mesh drifts over a floor-length skirt.\nThe body recedes into layered tone.',            left: 190, bottom: 165 },
      { text: 'Presence made quiet, texture made thin—\nsomething worn, something half-remembered.',         left: 32,  bottom: 97  },
    ],
    // look 03
    [
      { text: 'Pale boucle cropped against a soft skirt,\nthe silhouette caught between stillness and fall.',left: 22,  bottom: 295 },
      { text: 'White absorbs the cold without resistance.\nA shape that lingers after leaving.',             left: 170, bottom: 100 },
    ],
    // look 04
    [
      { text: 'Lace unravels at the hem of black.\nSharp heel, scattered thread—',                          left: 65,  bottom: 275 },
      { text: 'tension held between weight and dissolution.\nDark restraint frayed at its own edge.',        left: 22,  bottom: 97  },
    ],
    // look 05
    [
      { text: 'Sheer mesh over slip, tulle at the waist.\nThe look undoes itself deliberately.',             left: 40,  bottom: 217 },
      { text: 'Transparency layered into depth—\ntenderness worn as resistance.',                            left: 185, bottom: 100 },
    ],
    // look 06
    [
      { text: 'Hood drawn close, the body turns away.\nAn oversized silhouette swallowed in black.',        left: 18,  bottom: 265 },
      { text: 'No gesture offered, no surface given.\nWithdrawal as its own quiet form.',                    left: 165, bottom: 97  },
    ],
    // look 07
    [
      { text: 'Ivory lace gathers at the floor.\nA cardigan dropped over without urgency.',                 left: 185, bottom: 310 },
      { text: 'The whole thing reads like something kept—\nnot quite letting go.',                           left: 28,  bottom: 99  },
    ],
  ];

  // ── Scale ────────────────────────────────────────────
  function scaleWrapper() {
    var el = document.querySelector('.ld-wrapper');
    if (!el) return;
    var vw = window.innerWidth, vh = window.innerHeight;
    var scale = Math.min(vw / CANVAS_W, vh / CANVAS_H);
    var tx = (vw - CANVAS_W * scale) / 2;
    var ty = (vh - CANVAS_H * scale) / 2;
    el.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
  }
  window.addEventListener('resize', scaleWrapper);
  scaleWrapper();

  // ── Helpers ──────────────────────────────────────────
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function imgPath(id, pose) {
    return 'assets/images/collection_sub/look_' + pad(id) + '_' + pose + '.png';
  }

  function getHashId() {
    var h = parseInt(window.location.hash.replace('#', ''), 10);
    return (isNaN(h) || h < 1 || h > TOTAL_LOOKS) ? 1 : h;
  }

  // ── State ─────────────────────────────────────────────
  var currentId  = getHashId();
  var isSwitching = false;

  // ── DOM refs ──────────────────────────────────────────
  var slidesEl    = document.getElementById('ld_slides');
  var lookLabel   = document.getElementById('ld_look_label');
  var lookNum     = document.getElementById('ld_look_num');
  var descLayer   = document.getElementById('ld_desc_layer');
  var ghostNum    = document.getElementById('ld_ghost_num');
  var idxCurrent  = document.getElementById('ld_idx_current');
  var idxFill     = document.getElementById('ld_idx_fill');
  var idxTrack    = document.getElementById('ld_idx_track');

  function renderDescs(frags) {
    descLayer.innerHTML = '';
    if (!frags) return;
    frags.forEach(function (f) {
      var div = document.createElement('div');
      div.className = 'ld-desc-frag';
      div.textContent = f.text;
      div.style.left   = f.left   + 'px';
      div.style.bottom = f.bottom + 'px';
      descLayer.appendChild(div);
    });
  }

  // ── Build look slides ─────────────────────────────────
  var slideEls = [];

  for (var i = 1; i <= TOTAL_LOOKS; i++) {
    var slide = document.createElement('div');
    slide.className = 'ld-slide';
    slide.dataset.look = i;

    var imgs = LAYOUT[i];
    for (var j = 0; j < imgs.length; j++) {
      var d = imgs[j];
      var img = document.createElement('img');
      img.className = 'ld-img';
      img.src = imgPath(i, d.p);
      img.alt = '';
      img.style.cssText =
        'left:'   + d.x + 'px;' +
        'top:'    + d.y + 'px;' +
        'width:'  + d.w + 'px;' +
        'height:' + d.h + 'px;' +
        'z-index:' + (j + 1) + ';';
      slide.appendChild(img);
    }

    slidesEl.appendChild(slide);
    slideEls.push(slide);
  }

  // ── UI update ─────────────────────────────────────────
  function updateUI(id) {
    if (lookNum) lookNum.textContent = 'LOOK ' + pad(id);
    if (ghostNum) {
      if (!document.body.classList.contains('is-visible')) {
        ghostNum.textContent = pad(id);
      } else {
        ghostNum.style.transition = 'opacity 0.25s ease';
        ghostNum.style.opacity = '0';
        setTimeout(function () {
          ghostNum.textContent = pad(id);
          ghostNum.style.transition = 'opacity 0.55s ease';
          ghostNum.style.opacity = '0.02';
        }, 270);
      }
    }
    if (descLayer) {
      if (!document.body.classList.contains('is-visible')) {
        renderDescs(DESCS[id]);
      } else {
        descLayer.style.transition = 'opacity 0.2s ease';
        descLayer.style.opacity = '0';
        setTimeout(function () {
          renderDescs(DESCS[id]);
          descLayer.style.opacity = '1';
        }, 200);
      }
    }
    document.title = 'FANCIVE — LOOK ' + pad(id);
    history.replaceState(null, '', '#' + id);
    if (idxCurrent) idxCurrent.textContent = pad(id);
    if (idxFill) idxFill.style.width = (id / TOTAL_LOOKS * 100) + '%';
  }

  // ── Image stagger helpers ─────────────────────────────
  function revealImages(slide, instant) {
    var imgs = slide.querySelectorAll('.ld-img');
    if (instant) {
      imgs.forEach(function (img) {
        img.style.transition = 'none';
        img.style.opacity = '1';
      });
    } else {
      imgs.forEach(function (img) {
        img.style.transition = 'none';
        img.style.opacity = '0';
      });
      imgs.forEach(function (img, i) {
        setTimeout(function () {
          img.style.transition = 'opacity 0.9s ease';
          img.style.opacity = '1';
        }, 180 + i * 80);
      });
    }
  }

  function hideImages(slide) {
    slide.querySelectorAll('.ld-img').forEach(function (img) {
      img.style.transition = 'opacity 0.5s ease';
      img.style.opacity = '0';
    });
  }

  // ── Show look ─────────────────────────────────────────
  function showLook(id, instant) {
    slideEls.forEach(function (s) {
      var isTarget = parseInt(s.dataset.look, 10) === id;
      s.classList.toggle('is-current', isTarget);
      if (isTarget) revealImages(s, instant);
    });
    updateUI(id);
  }

  // ── Switch look ───────────────────────────────────────
  function switchLook(newId) {
    if (newId === currentId || isSwitching) return;
    isSwitching = true;
    var oldId = currentId;
    currentId = newId;

    slideEls.forEach(function (s) {
      var sid = parseInt(s.dataset.look, 10);
      if (sid === oldId) {
        hideImages(s);
        setTimeout(function () { s.classList.remove('is-current'); }, 500);
      } else if (sid === newId) {
        s.classList.add('is-current');
        revealImages(s, false);
      }
    });

    updateUI(newId);
    setTimeout(function () { isSwitching = false; }, 1100);
  }

  // ── Initialize ────────────────────────────────────────
  showLook(currentId, false);

  // ── Scroll navigation ─────────────────────────────────
  var scrollTimer = null;
  document.addEventListener('wheel', function (e) {
    if (isSwitching || scrollTimer) return;
    if (Math.abs(e.deltaY) < 60) return;
    var newId = e.deltaY > 0
      ? (currentId < TOTAL_LOOKS ? currentId + 1 : 1)
      : (currentId > 1 ? currentId - 1 : TOTAL_LOOKS);
    switchLook(newId);
    scrollTimer = setTimeout(function () { scrollTimer = null; }, 1200);
  }, { passive: true });

  // ── Keyboard navigation ───────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (isSwitching) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      switchLook(currentId < TOTAL_LOOKS ? currentId + 1 : 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      switchLook(currentId > 1 ? currentId - 1 : TOTAL_LOOKS);
    }
  });

  // ── Track click ───────────────────────────────────────
  if (idxTrack) {
    idxTrack.addEventListener('click', function (e) {
      var rect = idxTrack.getBoundingClientRect();
      var ratio = (e.clientX - rect.left) / rect.width;
      var newId = Math.max(1, Math.min(TOTAL_LOOKS, Math.ceil(ratio * TOTAL_LOOKS)));
      switchLook(newId);
    });
  }

  // ── Logo → collection (fade transition) ───────────────
  var logo = document.getElementById('ld_logo');
  if (logo) {
    logo.addEventListener('click', function (e) {
      e.preventDefault();
      document.body.style.transition = 'opacity 0.35s ease';
      document.body.style.opacity = '0';
      setTimeout(function () { window.location.href = 'collection.html'; }, 360);
    });
  }

  // ── Nav → about / archive (fade transition) ───────────
  function bindNavFade(id, href) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', function (e) {
      e.preventDefault();
      document.body.style.transition = 'opacity 0.35s ease';
      document.body.style.opacity = '0';
      setTimeout(function () { window.location.href = href; }, 360);
    });
  }
  bindNavFade('ld_nav_about',   'about.html');
  bindNavFade('ld_nav_archive', 'archive.html');

  // ── Entry animation ───────────────────────────────────
  setTimeout(function () {
    document.body.classList.add('is-visible');
  }, 220);

  // ── Custom cursor ─────────────────────────────────────
  var cursor = document.createElement('div');
  cursor.id = 'ld_cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', function (e) {
    cursor.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
    cursor.classList.add('is-active');
  });

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest('a, .ld-idx, .ld-img, #ld_nav_menu span')) {
      cursor.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest('a, .ld-idx, .ld-img, #ld_nav_menu span')) {
      cursor.classList.remove('is-hovering');
    }
  });

  document.addEventListener('mouseleave', function () {
    cursor.classList.remove('is-active');
  });
})();
