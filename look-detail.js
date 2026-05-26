(function () {
  var CANVAS_W = 1920;
  var CANVAS_H = 1080;
  var TOTAL_LOOKS = 7;
  var POSES = ['a', 'b', 'c', 'd', 'e'];

  var lookDescs = [
    null,
    'Soft restraint pressed\ninto quiet fabric.',
    'Faded intimacy layered\nover washed structure.',
    'Cold distance held\nin woven negative space.',
    'Delicate compression,\na lingering atmosphere.',
    'Blurred at the edge —\nthe form resists.',
    'Intimate and undone,\nheld in pale reserve.',
    'A final arrangement,\nstill and deliberate.'
  ];

  // fallback colors used before image extraction completes
  var PALETTE_NAMES = ['OUTER', 'TOP', 'BOTTOM'];
  var lookPalettes = [
    null,
    { colors: ['#d8d4ce', '#e0dbd2', '#ccc4b8'] },
    { colors: ['#c8c4bf', '#d0ccc6', '#b8b2ac'] },
    { colors: ['#ccd0d4', '#d4d8da', '#c0c6ca'] },
    { colors: ['#d4cfc8', '#dedad4', '#c8c2ba'] },
    { colors: ['#c8ccce', '#d0d4d6', '#bec4c8'] },
    { colors: ['#dcd6d4', '#e4dedc', '#ccc6c4'] },
    { colors: ['#c0bcb8', '#cac6c2', '#b0aca8'] }
  ];

  var lookMaterialPositions = [
    null,
    { left: '1450px', top: '90px'  },  // VISCOSE — top right, above number
    { left: '1200px', top: '800px' },  // NYLON   — bottom center
    { left: '1000px', top: '810px' },  // ORGANZA — bottom left
    { left: '1480px', top: '76px'  },  // LINEN   — top right, above number
    { left: '1480px', top: '800px' },  // JERSEY  — bottom right
    { left: '1100px', top: '800px' },  // CHIFFON — bottom center-left
    { left: '1480px', top: '790px' },  // CREPE   — bottom right
  ];

  var lookNotePositions = [
    null,
    { left: '1590px', top: '490px' },  // below palette, far right
    { left: '1590px', top: '700px' },  // far right, lower
    { left: '1590px', top: '560px' },  // far right, mid
    { left: '1590px', top: '800px' },  // far right, bottom
    { left: '1200px', top: '825px' },  // below number, center (x differs from material)
    { left: '1590px', top: '560px' },  // far right, mid
    { left: '1200px', top: '815px' },  // below number, center
  ];

  var lookDetails = [
    null,
    { fabric: 'Sheer viscose\nLightweight slip layer',   styling: 'Loose silhouette\nCold, minimal layering',   material: 'VISCOSE', note: 'Unlined construction\nworn close to skin'          },
    { fabric: 'Draped nylon mesh\nBrushed cotton liner',  styling: 'Long-form silhouette\nFaded muted palette',  material: 'NYLON',   note: 'Extended hem\ndouble-layer construction'         },
    { fabric: 'Organza overlay\nWashed silk base',        styling: 'Negative space volume\nUndone structure',    material: 'ORGANZA', note: 'Raw edge left intentional\nsingle-needle stitch'  },
    { fabric: 'Linen-cotton blend\nRaw-edge finish',      styling: 'Compressed form\nQuiet tension',             material: 'LINEN',   note: 'Pre-washed once\nstone-ground surface'            },
    { fabric: 'Stretch cotton jersey\nLight rib knit',    styling: 'Open-edge silhouette\nCold restraint',       material: 'JERSEY',  note: 'Bias-cut hem\nno facing, no lining'              },
    { fabric: 'Chiffon drape\nWashed satin lining',       styling: 'Pale and undone\nIntimate distance',         material: 'CHIFFON', note: 'Slip layer hand-tacked\nsemi-opaque construction'  },
    { fabric: 'Wool crepe\nSilk organza trim',            styling: 'Deliberate cut\nFinal, still form',          material: 'CREPE',   note: 'Bone structure\nhidden, felt not seen'            }
  ];

  // ── Scale ────────────────────────────────────────────
  function scaleWrapper() {
    var el = document.querySelector('.ld-wrapper');
    if (!el) return;
    var vw = window.innerWidth, vh = window.innerHeight;
    var scale = Math.min(vw / CANVAS_W, vh / CANVAS_H);
    var x = (vw - CANVAS_W * scale) / 2;
    var y = (vh - CANVAS_H * scale) / 2;
    el.style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
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
  var currentId   = getHashId();
  var currentPose = 0;
  var isSwitching = false;

  // ── DOM refs ──────────────────────────────────────────
  var mainImg      = document.getElementById('ld_main_img');
  var thumbsEls    = document.querySelectorAll('.ld-thumb');
  var bgNum        = document.getElementById('ld_look_bg_num');
  var pageLabel    = document.getElementById('ld_page_look_num');
  var descEl       = document.getElementById('ld_look_desc');
  var prevBtn      = document.getElementById('ld_prev_btn');
  var nextBtn      = document.getElementById('ld_next_btn');
  var fabricEl     = document.getElementById('ld_detail_fabric');
  var stylingEl    = document.getElementById('ld_detail_styling');
  var paletteWrap = document.getElementById('ld_palette_wrap');
  var palBlocks   = document.querySelectorAll('.ld-palette-block');
  var palNames    = document.querySelectorAll('.ld-palette-name');
  var idxItems     = document.querySelectorAll('.ld-idx-item');
  var dotsEls      = document.querySelectorAll('.ld-dot');
  var archiveNumEl   = document.getElementById('ld_archive_num');
  var materialWordEl = document.getElementById('ld_material_word');
  var lookNoteEl     = document.getElementById('ld_look_note');

  // ── Colour extraction ────────────────────────────────
  var paletteCache = {};

  function extractColors(img) {
    var canvas = document.createElement('canvas');
    var sw = Math.min(img.naturalWidth,  200);
    var sh = Math.min(img.naturalHeight, 600);
    canvas.width  = sw;
    canvas.height = sh;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, sw, sh);
    // narrow centre column (20 % width) at 3 body-part y positions
    var cx = Math.floor(sw * 0.50);
    var hw = Math.floor(sw * 0.10);
    var x0 = Math.max(0, cx - hw);
    var pw = Math.min(hw * 2, sw - x0);
    var ph = Math.max(4, Math.floor(sh * 0.10)); // 10 % height patch
    var yFracs = [0.22, 0.50, 0.74];             // OUTER · TOP · BOTTOM
    return yFracs.map(function (yf) {
      var y0 = Math.max(0, Math.min(sh - ph, Math.floor(sh * yf - ph / 2)));
      var d  = ctx.getImageData(x0, y0, pw, ph).data;
      var r = 0, g = 0, b = 0;
      for (var i = 0; i < d.length; i += 4) { r += d[i]; g += d[i+1]; b += d[i+2]; }
      var n = d.length / 4;
      return 'rgb(' + Math.round(r/n) + ',' + Math.round(g/n) + ',' + Math.round(b/n) + ')';
    });
  }

  function applyPalette(id) {
    var p = lookPalettes[id];
    // names — always OUTER / TOP / BOTTOM
    palNames.forEach(function (n, i) { n.textContent = PALETTE_NAMES[i]; });
    // colors — from cache, else show fallback + extract async
    if (paletteCache[id]) {
      palBlocks.forEach(function (b, i) { b.style.background = paletteCache[id][i]; });
      return;
    }
    if (p) palBlocks.forEach(function (b, i) { b.style.background = p.colors[i]; });
    var tmp = new Image();
    tmp.onload = function () {
      try {
        var colors = extractColors(tmp);
        paletteCache[id] = colors;
        palBlocks.forEach(function (b, i) { b.style.background = colors[i]; });
      } catch (e) { /* keep fallback */ }
    };
    tmp.src = imgPath(id, POSES[0]);
  }

  // ── Update text / URL / index ─────────────────────────
  function updateLabels(id) {
    var pid = id > 1 ? id - 1 : TOTAL_LOOKS;
    var nid = id < TOTAL_LOOKS ? id + 1 : 1;
    if (pageLabel) pageLabel.textContent = 'LOOK ' + pad(id);
    if (descEl)    descEl.textContent    = lookDescs[id] || '';
    if (prevBtn)   prevBtn.textContent   = '← ' + pad(pid);
    if (nextBtn)   nextBtn.textContent   = pad(nid) + ' →';
    document.title = 'FANCIVE — LOOK ' + pad(id);
    history.replaceState(null, '', '#' + id);

    // Detail panel
    var detail = lookDetails[id];
    if (fabricEl)       fabricEl.textContent       = detail ? detail.fabric   : '';
    if (stylingEl)      stylingEl.textContent      = detail ? detail.styling  : '';
    if (materialWordEl) materialWordEl.textContent = detail ? detail.material : '';
    if (lookNoteEl)     lookNoteEl.textContent     = detail ? detail.note     : '';

    // Look index active state
    idxItems.forEach(function (el) {
      el.classList.toggle('is-current', parseInt(el.dataset.look, 10) === id);
    });

    // Archive number
    if (archiveNumEl) archiveNumEl.textContent = 'N° ' + pad(id);

    // Per-look note position
    var notePos = lookNotePositions[id];
    if (notePos && lookNoteEl) {
      lookNoteEl.style.left = notePos.left;
      lookNoteEl.style.top  = notePos.top;
    }

    // Per-look material word position
    var matPos = lookMaterialPositions[id];
    if (matPos && materialWordEl) {
      materialWordEl.style.left = matPos.left;
      materialWordEl.style.top  = matPos.top;
    }
  }

  // ── Thumbnail pose switch (within same look) ──────────
  // slow=true : 자동 순환 (부드럽게), slow=false : 썸네일 클릭 (빠르게)
  function setPose(poseIdx, slow) {
    if (poseIdx === currentPose || !mainImg) return;
    var outMs = slow ? 500 : 200;
    var inMs  = slow ? 650 : 240;

    mainImg.style.transition = 'opacity ' + (outMs / 1000) + 's ease-in';
    mainImg.style.opacity    = '0';

    setTimeout(function () {
      mainImg.src = imgPath(currentId, POSES[poseIdx]);
      // rAF×2 : src 반영 후 다음 렌더 프레임에 정확히 fade-in 시작
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          mainImg.style.transition = 'opacity ' + (inMs / 1000) + 's ease-out';
          mainImg.style.opacity    = '1';
        });
      });
    }, outMs);

    thumbsEls.forEach(function (t, i) {
      t.classList.toggle('is-active', i === poseIdx);
    });
    dotsEls.forEach(function (d, i) {
      d.classList.toggle('is-active', i === poseIdx);
    });
    currentPose = poseIdx;
  }

  // ── Look switch (in-place) ────────────────────────────
  function switchLook(newId) {
    if (newId === currentId || isSwitching) return;
    isSwitching = true;
    currentPose = 0;

    // Fade out main image + secondary + watermark number
    if (mainImg) {
      mainImg.style.transition = 'opacity 0.28s ease';
      mainImg.style.opacity    = '0';
    }
    if (paletteWrap) {
      paletteWrap.style.transition = 'opacity 0.28s ease';
      paletteWrap.style.opacity    = '0';
    }
    if (bgNum) {
      bgNum.style.transition = 'opacity 0.28s ease';
      bgNum.style.opacity    = '0';
    }
    if (materialWordEl) {
      materialWordEl.style.transition = 'opacity 0.22s ease';
      materialWordEl.style.opacity    = '0';
    }
    if (lookNoteEl) {
      lookNoteEl.style.transition = 'opacity 0.18s ease';
      lookNoteEl.style.opacity    = '0';
    }

    setTimeout(function () {
      currentId = newId;

      // Swap main image
      if (mainImg) {
        mainImg.src              = imgPath(currentId, POSES[0]);
        mainImg.style.transition = 'opacity 0.35s ease';
        mainImg.style.opacity    = '1';
      }

      // Swap colour palette
      applyPalette(currentId);
      if (paletteWrap) {
        paletteWrap.style.transition = 'opacity 0.35s ease';
        paletteWrap.style.opacity    = '1';
      }

      // Swap thumbnails
      thumbsEls.forEach(function (t, i) {
        t.src = imgPath(currentId, POSES[i]);
        t.classList.toggle('is-active', i === 0);
      });

      // Reset pose dots to first
      dotsEls.forEach(function (d, i) {
        d.classList.toggle('is-active', i === 0);
      });

      // Swap watermark number
      if (bgNum) {
        bgNum.textContent      = pad(currentId);
        bgNum.style.transition = 'opacity 0.55s ease';
        bgNum.style.opacity    = '0.04';
      }

      // Fade in editorial elements
      if (materialWordEl) {
        materialWordEl.style.transition = 'opacity 0.55s ease';
        materialWordEl.style.opacity    = '0.09';
      }
      if (lookNoteEl) {
        lookNoteEl.style.transition = 'opacity 0.35s ease';
        lookNoteEl.style.opacity    = '1';
      }

      // Update labels & URL
      updateLabels(currentId);

      setTimeout(function () { isSwitching = false; startCycle(); }, 550);
    }, 300);
  }

  // ── Initialise ────────────────────────────────────────
  updateLabels(currentId);
  if (bgNum) bgNum.textContent = pad(currentId);
  if (mainImg) mainImg.src = imgPath(currentId, POSES[0]);
  applyPalette(currentId);
  thumbsEls.forEach(function (t, i) {
    t.src = imgPath(currentId, POSES[i]);
    if (i === 0) t.classList.add('is-active');
    t.addEventListener('click', function () { setPose(i, false); startCycle(); });
  });

  // Initialise first dot
  if (dotsEls[0]) dotsEls[0].classList.add('is-active');

  // Hover over main image pauses auto-cycle
  if (mainImg) {
    mainImg.addEventListener('mouseenter', function () {
      if (cycleTimer) { clearInterval(cycleTimer); cycleTimer = null; }
    });
    mainImg.addEventListener('mouseleave', startCycle);
  }

  // ── Auto-cycle poses ──────────────────────────────────
  var cycleTimer = null;

  function startCycle() {
    if (cycleTimer) clearInterval(cycleTimer);
    cycleTimer = setInterval(function () {
      if (isSwitching) return;
      setPose((currentPose + 1) % POSES.length, true);
    }, 2800);
  }

  startCycle();

  // ── Look index click ──────────────────────────────────
  idxItems.forEach(function (el) {
    el.addEventListener('click', function () {
      switchLook(parseInt(el.dataset.look, 10));
    });
  });

  // ── Prev / Next buttons (in-place) ────────────────────
  if (prevBtn) prevBtn.addEventListener('click', function () {
    switchLook(currentId > 1 ? currentId - 1 : TOTAL_LOOKS);
  });
  if (nextBtn) nextBtn.addEventListener('click', function () {
    switchLook(currentId < TOTAL_LOOKS ? currentId + 1 : 1);
  });

  // ── Scroll navigation (in-place) ─────────────────────
  var scrollCooldown = false;
  document.addEventListener('wheel', function (e) {
    if (scrollCooldown || isSwitching) return;
    if (Math.abs(e.deltaY) < 30) return;
    scrollCooldown = true;
    var newId = e.deltaY > 0
      ? (currentId < TOTAL_LOOKS ? currentId + 1 : 1)
      : (currentId > 1 ? currentId - 1 : TOTAL_LOOKS);
    switchLook(newId);
    setTimeout(function () { scrollCooldown = false; }, 950);
  }, { passive: true });

  // ── Logo → collection ─────────────────────────────────
  var logo = document.getElementById('ld_brand_logo');
  if (logo) {
    logo.addEventListener('click', function (e) {
      e.preventDefault();
      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:#fbfbfb;opacity:0;z-index:9999;pointer-events:all;transition:opacity 0.35s ease';
      document.body.appendChild(overlay);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { overlay.style.opacity = '1'; });
      });
      setTimeout(function () { window.location.href = 'collection.html'; }, 370);
    });
  }

  // ── Menu navigation ───────────────────────────────────
  function fadeNav(url) {
    document.body.style.transition = 'opacity 0.45s ease';
    document.body.style.opacity = '0';
    setTimeout(function () { window.location.href = url; }, 460);
  }

  var menuSpans = document.querySelectorAll('#ld_menu_group span');
  menuSpans.forEach(function (span) {
    var text = span.textContent.trim();
    if (text === 'ABOUT') {
      span.style.cursor = 'pointer';
      span.addEventListener('click', function () { fadeNav('about.html'); });
    } else if (text === 'ARCHIVE') {
      span.style.cursor = 'pointer';
      span.addEventListener('click', function () { fadeNav('archive.html'); });
    }
  });

  // ── Entry animation ───────────────────────────────────
  setTimeout(function () {
    document.body.classList.add('is-visible');
    var wrapper = document.querySelector('.ld-wrapper');
    if (wrapper) wrapper.classList.add('is-ready');
  }, 60);
})();
