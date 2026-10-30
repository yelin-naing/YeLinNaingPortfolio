/* Shared by every page: the mobile menu, light/dark theme, scroll reveals,
   skill tooltips and the footer year. The site is plain HTML and every page
   works fully without this file. */
(function(){
  // ===== LIGHT / DARK THEME =====
  // The inline script in <head> has already set data-theme (saved choice,
  // else the system setting). The button switches and remembers; until a
  // visitor chooses, the site keeps following the system setting.
  var html = document.documentElement;
  var themeBtn = document.querySelector('.theme-toggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var systemDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function currentTheme(){ return html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function applyTheme(t){
    html.setAttribute('data-theme', t);
    if (themeMeta) themeMeta.setAttribute('content', t === 'dark' ? '#0B1220' : '#FAFAF7');
    if (themeBtn){
      var label = t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
      themeBtn.setAttribute('aria-label', label);
      themeBtn.setAttribute('title', label);
    }
  }
  applyTheme(currentTheme());

  if (themeBtn){
    themeBtn.addEventListener('click', function(){
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', next); } catch(e){}
      var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (still){ applyTheme(next); return; }

      if (document.startViewTransition){
        // A circle of the new theme grows out from the button.
        var r = themeBtn.getBoundingClientRect();
        var x = r.left + r.width / 2, y = r.top + r.height / 2;
        var radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
        var vt = document.startViewTransition(function(){ applyTheme(next); });
        vt.ready.then(function(){
          html.animate(
            {clipPath:['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)']},
            {duration:550, easing:'cubic-bezier(.2,.7,.2,1)', pseudoElement:'::view-transition-new(root)'}
          );
        }).catch(function(){});
      } else {
        // Fallback: every colour fades across for a moment.
        html.classList.add('theme-fade');
        applyTheme(next);
        setTimeout(function(){ html.classList.remove('theme-fade'); }, 400);
      }
    });
  }
  // Follow system changes until the visitor picks a theme themselves.
  if (systemDark){
    var onSystem = function(e){
      var saved = null; try { saved = localStorage.getItem('theme'); } catch(err){}
      if (saved !== 'light' && saved !== 'dark') applyTheme(e.matches ? 'dark' : 'light');
    };
    if (systemDark.addEventListener) systemDark.addEventListener('change', onSystem);
    else if (systemDark.addListener) systemDark.addListener(onSystem);
  }

  // ===== MOBILE MENU =====
  var toggle = document.querySelector('.nav-toggle');
  var links  = document.getElementById('nav-links');
  if (toggle && links){
    function setOpen(open){
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    toggle.addEventListener('click', function(){
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    // Close after choosing a link, on Escape, or on a click elsewhere.
    links.addEventListener('click', function(e){
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && links.classList.contains('open')){
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', function(e){
      if (!links.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
  }

  // ===== SCROLL REVEALS =====
  // Sections fade up as they scroll into view, every time, in either
  // direction. Only elements that start below the screen are hidden at
  // load; after that an element is "re-armed" once it has left the screen
  // (plus a margin, so wiggling at the edge doesn't retrigger it) and plays
  // again on its next entry. Nothing on screen is ever held invisible.
  // Without IntersectionObserver, or with reduced motion, nothing moves.
  var REVEAL = [
    '.section-head', '.section-foot', '.prose', '.contact-panel',
    '.project-card', '.skill-logos', '.entry', '.cert'
  ].join(',');
  // These already animate in on page load (CSS); they replay on re-entry.
  var INTRO = '.hero h1, .hero-role, .hero-intro, .hero-facts, .hero .btn-row, .hero-links, .hero-photo, .page-head > *';
  var STAGGER_MS = 80;   // gap between items that enter together
  var STAGGER_MAX = 240;

  // ===== SKILL LOGOS =====
  // Each logo needs its position for the one-by-one pop-in (50ms apart, CSS).
  // A tap focuses the logo so its tooltip opens on touch screens too, and a
  // tooltip that would run past the screen edge is nudged back inside.
  Array.prototype.forEach.call(document.querySelectorAll('.skill-logo'), function(logo, i){
    logo.style.setProperty('--i', i);
    var tip = logo.querySelector('.logo-tip');
    function place(){
      if (!tip) return;
      tip.style.setProperty('--tip-shift', '0px');
      var r = tip.getBoundingClientRect(), edge = 8;
      var vw = document.documentElement.clientWidth, shift = 0;
      if (r.left < edge) shift = edge - r.left;
      else if (r.right > vw - edge) shift = (vw - edge) - r.right;
      tip.style.setProperty('--tip-shift', Math.round(shift) + 'px');
    }
    logo.addEventListener('mouseenter', place);
    logo.addEventListener('focus', place);
    logo.addEventListener('click', function(){ logo.focus(); });
  });

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window){
    var revealEls = Array.prototype.slice.call(document.querySelectorAll(REVEAL));
    var introEls  = Array.prototype.slice.call(document.querySelectorAll(INTRO));
    var isIntro = new Set(introEls);
    var armed = new Set();   // will animate on their next entry

    revealEls.forEach(function(el){
      if (el.getBoundingClientRect().top > window.innerHeight){
        el.classList.add('reveal-pending');
        armed.add(el);
      }
    });

    // Restart an animation from its first frame. Reading offsetWidth forces
    // the browser to drop the old run before the new one is applied.
    function replay(el, delay){
      if (isIntro.has(el)){
        el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
        return;
      }
      el.style.setProperty('--reveal-delay', delay + 'ms');
      el.classList.remove('reveal-pending', 'reveal-in'); void el.offsetWidth;
      el.classList.add('reveal-in');
    }

    var heard = false;
    var play = new IntersectionObserver(function(entries){
      heard = true;
      var batch = entries.filter(function(e){ return e.isIntersecting && armed.has(e.target); })
                         .map(function(e){ return e.target; });
      // Items that arrive together (a row of cards) play in page order,
      // a few milliseconds apart.
      batch.sort(function(a, b){
        return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });
      batch.forEach(function(el, i){
        armed.delete(el);
        replay(el, Math.min(i * STAGGER_MS, STAGGER_MAX));
      });
    });
    // Re-arm once an element is fully outside the screen plus 15% either way.
    var rearm = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (!e.isIntersecting) armed.add(e.target); });
    }, {rootMargin:'15% 0px 15% 0px'});

    revealEls.concat(introEls).forEach(function(el){ play.observe(el); rearm.observe(el); });

    // The observer always reports once per element straight away. If that
    // never happens, show everything rather than risk hidden content.
    setTimeout(function(){
      if (heard) return;
      play.disconnect(); rearm.disconnect();
      revealEls.forEach(function(el){ el.classList.remove('reveal-pending'); });
    }, 1500);
  }

  // ===== ANCHOR LINKS AND SMOOTH SCROLLING =====
  // Arriving at /#skills jumps (not glides) to the section. When the web
  // font swaps in, text above can re-wrap and push the section down, so
  // re-align once, unless the visitor has already started scrolling. Only
  // then is smooth scrolling switched on for clicks within the page.
  var root = document.documentElement;
  var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  var target = null;
  try { target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1))); }
  catch(e){ /* malformed fragment: nothing to align */ }
  var userMoved = false;
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function(type){
    window.addEventListener(type, function(){ userMoved = true; }, {once:true, passive:true});
  });
  fontsReady.then(function(){
    if (target && !userMoved) target.scrollIntoView({block:'start'});
    root.classList.add('smooth-scroll');
  });

  // ===== FOOTER YEAR =====
  // The HTML carries a static year as a fallback; this keeps it current.
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
