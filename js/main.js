/* ============================================================
   EDIT THIS BLOCK — everything else is wired up already.
   Leave a value as "" and that link hides itself instead of
   showing visitors a dead button.
   ============================================================ */
var SITE = {
  linkedin: "",                    // e.g. "https://linkedin.com/in/ye-lin-naing"
  cv:       "./YeLinNaing(Leo).pdf",  // put the PDF next to this file, or "" to hide the button

  // Certificates. Each can be a hosted link OR a local file you drop in a
  // /certificates folder next to this page, e.g. "./certificates/ccai-2026.pdf"
  // These two are wired to demo files so you can see the viewer working.
  // Swap in your real certificate — a PDF, PNG or JPG opens in the viewer;
  // any other link opens in a new tab.
  cert1:    "./certificates/YeLinNaingGoogleDataAnalytics.pdf",
  cert2:    "./certificates/Ye Lin Naing - MySQL for Data Analytics Certificate.pdf",

  // Optional: a folder, Drive link, or page holding all of them.
  certsAll: ""
};

(function(){
  function wire(el, url, label){
    if (!el) return;
    if (url){
      el.setAttribute('href', url);
      if (label) el.textContent = label;
    } else {
      el.style.display = 'none';
    }
  }
  var li = document.getElementById('liLink');
  if (li){
    if (SITE.linkedin){
      li.setAttribute('href', SITE.linkedin);
      li.textContent = SITE.linkedin.replace(/^https?:\/\//,'');
    } else {
      li.closest('.code-line').style.display = 'none';
    }
  }
  wire(document.getElementById('certLink1'), SITE.cert1);
  wire(document.getElementById('certLink2'), SITE.cert2);

  // "View all" shows only if you've set a folder/collection link
  var allWrap = document.getElementById('certsAllWrap');
  var allBtn  = document.getElementById('certsAllBtn');
  if (allWrap && allBtn){
    if (SITE.certsAll) allBtn.setAttribute('href', SITE.certsAll);
    else allWrap.style.display = 'none';
  }

  var cv = document.getElementById('cvBtn');
  if (cv){
    if (SITE.cv) cv.setAttribute('href', SITE.cv);
    else {
      cv.style.display = 'none';
      var note = document.querySelector('.cv-note');
      if (note) note.textContent = 'CV available on request.';
    }
  }
})();
(function(){
  // ===== NAVIGATION =====
  var toggle = document.getElementById('navToggle');
  var links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  function closeMenu(){
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open menu');
  }

  toggle.addEventListener('click', function(e){
    e.stopPropagation();
    var open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  links.addEventListener('click', function(e){
    if (e.target.tagName === 'A') closeMenu();
  });

  document.addEventListener('click', function(e){
    if (!links.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeMenu();
  });

  // scroll spy — highlight whichever section is in view
  var anchors = Array.prototype.slice.call(links.querySelectorAll('a'));
  var targets = anchors.map(function(a){
    try { return document.querySelector(a.getAttribute('href')); }
    catch(err){ return null; }
  });

  function setActive(id){
    anchors.forEach(function(a){
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window){
    var vis = {};
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        vis[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0;
      });
      var bestId = null, bestVal = 0;
      Object.keys(vis).forEach(function(id){
        if (vis[id] > bestVal){ bestVal = vis[id]; bestId = id; }
      });
      if (bestId) setActive(bestId);
    }, {threshold:[0.15,0.35,0.6], rootMargin:'-70px 0px -45% 0px'});
    targets.forEach(function(t){ if (t) spy.observe(t); });
  }
})();
(function(){
  // ===== HERO NAME: typing animation =====
  var el = document.getElementById('heroTypedText');
  if (!el) return;
  var text = el.textContent;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function afterIntro(fn){
    if (window.__preload && !window.__preload.done) window.__preload.onDone(fn);
    else fn();
  }

  if (reduce){
    el.textContent = text;
    return;
  }

  el.textContent = '';
  el.classList.add('typing');
  var i = 0;

  function typeNext(){
    if (i < text.length){
      el.textContent += text.charAt(i);
      i++;
      setTimeout(typeNext, 95);
    } else {
      setTimeout(eraseNext, 1800);
    }
  }
  function eraseNext(){
    if (i > 0){
      i--;
      el.textContent = text.slice(0, i);
      setTimeout(eraseNext, 50);
    } else {
      setTimeout(typeNext, 500);
    }
  }
  afterIntro(function(){ setTimeout(typeNext, 150); });
})();

(function(){
  var lines = [
    [{t:'SELECT ',c:'kw'},{t:'name, role, skills',c:''}],
    [{t:'FROM ',c:'kw'},{t:'candidates',c:''}],
    [{t:'WHERE ',c:'kw'},{t:"skill_set CONTAINS ",c:''},{t:"'SQL'",c:'str'},{t:' AND ',c:'kw'},{t:"'Python'",c:''}],
    [{t:'AND ',c:'kw'},{t:'degree_class = ',c:''},{t:"'First Class Honours'",c:'str'}],
    [{t:'LIMIT ',c:'kw'},{t:'1;',c:''}]
  ];

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = [1,2,3,4,5].map(function(n){ return document.getElementById('l'+n); });
  var results = document.getElementById('results');
  var resultMeta = document.getElementById('resultMeta');
  var selectionWrap = document.getElementById('selectionWrap');

  function renderLineHTML(parts){
    return parts.map(function(p){
      return p.c ? '<span class="'+p.c+'">'+p.t+'</span>' : p.t;
    }).join('');
  }

  function showResults(){
    resultMeta.classList.add('show');
    setTimeout(function(){
      results.classList.add('show');
      selectionWrap.classList.add('show');
    }, reduce ? 0 : 150);
  }

  function afterIntro(fn){
    if (window.__preload && !window.__preload.done) window.__preload.onDone(fn);
    else fn();
  }

  if (reduce) {
    els.forEach(function(el, i){ el.innerHTML = renderLineHTML(lines[i]); });
    afterIntro(showResults);
    return;
  }

  var lineIndex = 0, charIndex = 0;
  var cursor = document.createElement('span');
  cursor.id = 'cursor';
  cursor.textContent = ' ';

  function flatten(parts){
    var out = [];
    parts.forEach(function(p){ for (var i=0;i<p.t.length;i++) out.push({ch:p.t[i], c:p.c}); });
    return out;
  }

  function typeNext(){
    if (lineIndex >= lines.length){
      cursor.remove();
      showResults();
      return;
    }
    var el = els[lineIndex];
    var flat = flatten(lines[lineIndex]);
    if (charIndex === 0) el.innerHTML = '';
    if (charIndex < flat.length){
      var seg = flat[charIndex];
      var span = document.createElement('span');
      if (seg.c) span.className = seg.c;
      span.textContent = seg.ch;
      el.appendChild(span);
      el.appendChild(cursor);
      charIndex++;
      setTimeout(typeNext, 14);
    } else {
      cursor.remove();
      lineIndex++;
      charIndex = 0;
      setTimeout(typeNext, 120);
    }
  }
  afterIntro(function(){ setTimeout(typeNext, 220); });
})();

(function(){
  // scroll progress + nav shadow
  var bar = document.getElementById('scrollProgress');
  var nav = document.querySelector('header.site');
  function onScroll(){
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - doc.clientHeight;
    var pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
    bar.style.width = pct + '%';
    nav.classList.toggle('scrolled', doc.scrollTop > 8);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // staggered scroll reveal
  var groups = document.querySelectorAll('section:not(.hero), footer');
  groups.forEach(function(group){
    var items = group.querySelectorAll('.reveal');
    items.forEach(function(el, i){ el.style.transitionDelay = (i * 70) + 'ms'; });
  });

  var revealEls = document.querySelectorAll('.reveal');

  function startReveals(){
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -60px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }
  }

  if (window.__preload && !window.__preload.done) window.__preload.onDone(startReveals);
  else startReveals();
})();

(function(){
  // interactive requirement matcher
  var data = {
    sql:        {label:"sql",              has:true,  note:"Core skill — joins, window functions, CTEs"},
    python:     {label:"python",           has:true,  note:"Used for data cleaning and analysis"},
    excel:      {label:"excel",            has:true,  note:"Pivot tables, lookups, running totals"},
    azure:      {label:"azure",            has:true,  note:"Provisioned and ran VMs for data work"},
    git:        {label:"git",              has:true,  note:"Daily use across all projects"},
    degree:     {label:"degree_computing", has:true,  note:"BSc (Hons) Computing, First Class"},
    onsite:     {label:"location_ne_uk",   has:true,  note:"Based in Newcastle upon Tyne"},
    nosponsor:  {label:"sponsorship_free", has:true,  note:"UK Graduate visa — right to work already"},
    tableau:    {label:"tableau",          has:false, note:"Planned to Learn in the future"},
    senior:     {label:"years_experience", has:false, note:"I'm a 2026 graduate, so this one's an honest no"},
    powerbi:    {label:"power_bi",         has:true, note:"He is trying to answer Microsoft Power BI Certificate exam (PL-300)"}
  };

  var chipRow = document.getElementById('chipRow');
  var whereLine = document.getElementById('whereLine');
  var verdict = document.getElementById('verdict');
  var verdictIcon = document.getElementById('verdictIcon');
  var verdictText = document.getElementById('verdictText');
  var verdictList = document.getElementById('verdictList');
  if (!chipRow) return;

  var selected = [];

  function esc(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function render(){
    // query line
    if (selected.length === 0){
      whereLine.innerHTML = '<span class="cm">-- pick a requirement above to start</span>';
    } else {
      var parts = selected.map(function(k){
        return '<span class="str">' + esc(data[k].label) + '</span>';
      });
      whereLine.innerHTML = '<span class="kw">WHERE</span> ' +
        parts.join('<span class="kw"> AND </span>') + ';';
    }

    // verdict
    verdict.classList.remove('match','partial');
    verdictList.innerHTML = '';

    if (selected.length === 0){
      verdictIcon.textContent = '–';
      verdictText.textContent = 'No requirements selected yet';
      return;
    }

    var met = selected.filter(function(k){ return data[k].has; });
    var missing = selected.filter(function(k){ return !data[k].has; });

    selected.forEach(function(k){
      var li = document.createElement('li');
      li.className = data[k].has ? 'yes' : 'no';
      var mark = document.createElement('span');
      mark.className = 'mark';
      mark.textContent = data[k].has ? '✓' : '~';
      var text = document.createElement('span');
      text.textContent = data[k].note;
      li.appendChild(mark);
      li.appendChild(text);
      verdictList.appendChild(li);
    });

    if (missing.length === 0){
      verdict.classList.add('match');
      verdictIcon.textContent = '✓';
      verdictText.textContent = met.length + ' of ' + selected.length + ' matched — let’s talk';
    } else {
      verdict.classList.add('partial');
      verdictIcon.textContent = '~';
      verdictText.textContent = met.length + ' of ' + selected.length + ' matched — close, and honest about the rest';
    }
  }

  chipRow.addEventListener('click', function(e){
    var chip = e.target.closest('.chip');
    if (!chip) return;
    var key = chip.getAttribute('data-key');
    var i = selected.indexOf(key);
    if (i === -1){ selected.push(key); chip.classList.add('on'); chip.setAttribute('aria-pressed','true'); }
    else { selected.splice(i,1); chip.classList.remove('on'); chip.setAttribute('aria-pressed','false'); }
    render();
  });

  Array.prototype.forEach.call(chipRow.querySelectorAll('.chip'), function(c){
    c.setAttribute('aria-pressed','false');
  });

  render();
})();

(function(){
  // ===== MASCOT: Leo the lion =====
  var dock    = document.getElementById('mascotDock');
  var btn     = document.getElementById('mascotBtn');
  var bubble  = document.getElementById('mascotBubble');
  var says    = document.getElementById('mascotSays');
  var closeBt = document.getElementById('bubbleClose');
  var eyes    = document.getElementById('mascotEyes');
  var lids    = document.getElementById('mascotLids');
  var ping    = document.getElementById('mascotPing');
  if (!dock) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hideTimer = null;
  var dismissed = false;

  function speak(msg, ms){
    if (dismissed) return;
    says.textContent = msg;
    bubble.classList.add('show');
    ping.classList.add('off');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function(){ bubble.classList.remove('show'); }, ms || 5200);
  }

  var tips = [
    "Hi. I'm mini ye lin not the analyst.",
    "He is a big One Piece fan and like listening to music.",
    "He've won multiple Star of the Shift awards at McDonald's and are working his way up to Crew Trainer.",
    "Every project here was actually built, not just planned.",
    "Ask him about the data projects. He'll talk for a while.",
    "Roar. That's all I've got, really."
  ];
  var tipIndex = 0;

  // --- click: roar + rotating tip ---
  btn.addEventListener('click', function(){
    dismissed = false;
    btn.classList.remove('roar');
    void btn.offsetWidth; // restart animation
    btn.classList.add('roar');
    setTimeout(function(){ btn.classList.remove('roar'); }, 650);
    if (typeof window.mascotHop === 'function') window.mascotHop();
    speak(tips[tipIndex % tips.length], 5600);
    tipIndex++;
  });

  closeBt.addEventListener('click', function(e){
    e.stopPropagation();
    bubble.classList.remove('show');
    dismissed = true;
    setTimeout(function(){ dismissed = false; }, 20000);
  });

  // --- eyes follow the pointer + 3D tilt ---
  var m3d       = document.getElementById('mascot3d');
  var faceLayer = document.getElementById('faceLayer');
  var maneLayer = document.getElementById('maneLayer');
  var shadow    = document.getElementById('mascotShadow');

  if (!reduce && window.matchMedia('(pointer:fine)').matches){
    window.addEventListener('mousemove', function(e){
      var r = btn.getBoundingClientRect();
      var cx = r.left + r.width/2;
      var cy = r.top + r.height/2;
      var dx = e.clientX - cx;
      var dy = e.clientY - cy;
      var dist = Math.hypot(dx, dy) || 1;

      // eyes
      var ox = (dx/dist) * Math.min(3.2, dist/40);
      var oy = (dy/dist) * Math.min(3.2, dist/40);
      eyes.style.transform = 'translate(' + ox.toFixed(2) + 'px,' + oy.toFixed(2) + 'px)';

      // 3D tilt of the whole head toward the cursor
      var ny = Math.max(-1, Math.min(1, dx / 320));
      var nx = Math.max(-1, Math.min(1, dy / 320));
      var rotY = ny * 16;
      var rotX = -nx * 13;
      m3d.style.transform = 'rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg)';

      // parallax: face sits proud of the mane
      faceLayer.style.transform = 'translate(' + (ny*2.6).toFixed(2) + 'px,' + (nx*2.2).toFixed(2) + 'px)';
      maneLayer.style.transform = 'translate(' + (-ny*1.4).toFixed(2) + 'px,' + (-nx*1.2).toFixed(2) + 'px)';

      // shadow shifts opposite, as if lit from above
      if (shadow){
        shadow.style.transform = 'translate(' + (-ny*4).toFixed(2) + 'px,0)';
        shadow.style.opacity = (1 - Math.abs(ny)*0.25).toFixed(2);
      }
    }, {passive:true});

    // settle back to neutral when the pointer leaves the window
    document.addEventListener('mouseleave', function(){
      m3d.style.transform = '';
      faceLayer.style.transform = '';
      maneLayer.style.transform = '';
      eyes.style.transform = '';
      if (shadow){ shadow.style.transform=''; shadow.style.opacity=''; }
    });
  }

  // --- blinking ---
  if (!reduce){
    (function blinkLoop(){
      var wait = 2600 + Math.random()*4200;
      setTimeout(function(){
        lids.classList.add('shut');
        eyes.classList.add('hidden');
        setTimeout(function(){
          lids.classList.remove('shut');
          eyes.classList.remove('hidden');
          blinkLoop();
        }, 130);
      }, wait);
    })();
  }

  // Silent by default: Leo only speaks when tapped, so he never talks over
  // a visitor's first impression. The ping dot invites the tap.
})();
(function(){
  // ===== CERTIFICATE VIEWER =====
  // PDFs render in an iframe, images inline. Anything else opens in a new tab.
  var box   = document.getElementById('certViewer');
  var panel = box && box.querySelector('.viewer-panel');
  var body  = document.getElementById('viewerBody');
  var title = document.getElementById('viewerTitle');
  var openL = document.getElementById('viewerOpen');
  var dlL   = document.getElementById('viewerDownload');
  if (!box) return;

  var lastFocus = null;

  function isViewable(url){
    return /\.(pdf|png|jpe?g|webp|gif)(\?.*)?$/i.test(url);
  }
  function isPdf(url){ return /\.pdf(\?.*)?$/i.test(url); }

  function open(url, label){
    lastFocus = document.activeElement;
    title.textContent = label || 'Certificate';
    openL.setAttribute('href', url);
    dlL.setAttribute('href', url);
    body.innerHTML = '';

    if (isPdf(url)){
      var frame = document.createElement('iframe');
      frame.setAttribute('title', label || 'Certificate');
      frame.src = url;
      // some browsers block inline PDF rendering — offer a way through
      frame.onerror = function(){
        body.innerHTML = '<p class="viewer-fallback">This browser won\'t display the PDF inline. Use "Open in new tab" above.</p>';
      };
      body.appendChild(frame);
    } else {
      var img = document.createElement('img');
      img.alt = label || 'Certificate';
      img.src = url;
      img.onerror = function(){
        body.innerHTML = '<p class="viewer-fallback">Could not load that file. Check the path in the SITE config at the top of this page\'s script.</p>';
      };
      body.appendChild(img);
    }

    box.hidden = false;
    document.body.classList.add('viewer-open');
    requestAnimationFrame(function(){ box.classList.add('open'); });
    setTimeout(function(){ if (panel) panel.focus && panel.focus(); }, 60);
  }

  function close(){
    box.classList.remove('open');
    document.body.classList.remove('viewer-open');
    setTimeout(function(){
      box.hidden = true;
      body.innerHTML = '';           // stop the PDF/image loading in the background
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }, 260);
  }

  box.addEventListener('click', function(e){
    if (e.target.hasAttribute && e.target.hasAttribute('data-close')) close();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && !box.hidden) close();
  });

  // intercept the certificate buttons
  ['certLink1','certLink2','certsAllBtn'].forEach(function(id){
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', function(e){
      var url = el.getAttribute('href');
      if (!url || url === '#') return;
      if (!isViewable(url)) return;   // external link → let it open normally
      e.preventDefault();
      var card = el.closest('.cert-card');
      var name = card ? (card.querySelector('.cert-title') || {}).textContent : null;
      open(url, name || 'Certificate');
    });
  });
})();
