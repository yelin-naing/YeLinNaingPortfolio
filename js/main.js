/* Shared by every page: light/dark theme, smooth scrolling, the header,
   mobile menu, scroll reveals, skill tooltips and the footer year. The site
   is plain HTML and every page works fully without this file. */
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
    '.project-card', '.skill-logos', '.entry', '.cert',
    '.case-body > h2', '.finding', '.figure', '.data-table-wrap', '.note', '.code-block', '.case-nav a'
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

    // Restart an animation from its first frame: drop the old run, then add
    // the new one two frames later. Waiting for frames (rather than forcing a
    // layout) keeps scrolling smooth while things replay.
    function nextFrames(fn){ requestAnimationFrame(function(){ requestAnimationFrame(fn); }); }
    function replay(el, delay){
      if (isIntro.has(el)){
        el.style.animation = 'none';
        nextFrames(function(){ el.style.animation = ''; });
        return;
      }
      el.style.setProperty('--reveal-delay', delay + 'ms');
      if (el.classList.contains('reveal-in')){
        el.classList.remove('reveal-in');
        nextFrames(function(){ el.classList.add('reveal-in'); });
      } else {
        el.classList.remove('reveal-pending');
        el.classList.add('reveal-in');
      }
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

  // ===== SMOOTH SCROLLING =====
  // Lenis (js/vendor/lenis.min.js) smooths mouse-wheel and trackpad scrolling.
  // Touch scrolling stays native, code blocks and tables still scroll on
  // their own, and with reduced motion it isn't started at all.
  var root = document.documentElement;
  var header = document.querySelector('.site-header');
  var lenis = null;
  if (!reduce && window.Lenis){
    lenis = new window.Lenis({ lerp:0.1, smoothWheel:true, autoRaf:true, allowNestedScroll:true });
  }
  // Lenis honours the page's scroll-padding-top (header height + 16px, set
  // in the CSS), so targets land just below the header with no extra offset.
  function scrollToTarget(el){
    if (lenis) lenis.scrollTo(el, { duration:1.2 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block:'start' });
  }

  // In-page links (nav, "View My Projects", the skip link) glide to their
  // section, update the address bar and move keyboard focus there.
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname.replace(/index\.html$/, '') !== location.pathname.replace(/index\.html$/, '')) return;
    var id = decodeURIComponent(url.hash.slice(1));
    var el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (history.pushState) history.pushState(null, '', url.hash);
    scrollToTarget(el);
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll:true });
  });

  // Arriving at /#skills jumps (not glides) to the section. When the web
  // font swaps in, text above can re-wrap and push the section down, so
  // re-align once, unless the visitor has already started scrolling. Only
  // then is smooth scrolling switched on.
  var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  var target = null;
  try { target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1))); }
  catch(e){ /* malformed fragment: nothing to align */ }
  var userMoved = false;
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function(type){
    window.addEventListener(type, function(){ userMoved = true; }, {once:true, passive:true});
  });
  fontsReady.then(function(){
    if (target && !userMoved){
      if (lenis) lenis.scrollTo(target, { immediate:true, force:true });
      else target.scrollIntoView({block:'start'});
    }
    if (!lenis) root.classList.add('smooth-scroll');
  });

  // ===== HEADER, READING PROGRESS, BACK TO TOP =====
  // One rAF-throttled scroll handler: the header gains a shadow once the
  // page moves, slides away while scrolling down and returns on the way up;
  // a thin bar shows how far down the page you are; a back-to-top button
  // appears after the first screen.
  var progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  var toTop = document.createElement('button');
  toTop.type = 'button';
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>';
  document.body.appendChild(toTop);
  toTop.addEventListener('click', function(){
    if (lenis) lenis.scrollTo(0, { duration:1.4 });
    else window.scrollTo({ top:0, behavior: reduce ? 'auto' : 'smooth' });
    var brand = document.querySelector('.brand');
    if (brand) brand.focus({ preventScroll:true });
  });

  var lastY = window.scrollY, ticking = false;
  var headerHasFocus = false;
  if (header){
    header.addEventListener('focusin', function(){ headerHasFocus = true; header.classList.remove('is-hidden'); });
    header.addEventListener('focusout', function(){ headerHasFocus = false; });
  }
  function onScrollFrame(){
    ticking = false;
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    toTop.classList.toggle('is-visible', y > window.innerHeight * 0.8);
    if (header){
      header.classList.toggle('is-scrolled', y > 8);
      var menuOpen = links && links.classList.contains('open');
      if (!reduce && !menuOpen && !headerHasFocus && Math.abs(y - lastY) > 1){
        if (y > lastY && y > 160) header.classList.add('is-hidden');
        else if (y < lastY) header.classList.remove('is-hidden');
      }
      if (y <= 160) header.classList.remove('is-hidden');
    }
    lastY = y;
    if (spyAtBottom) spyAtBottom(y >= max - 2);
  }
  window.addEventListener('scroll', function(){
    if (!ticking){ ticking = true; requestAnimationFrame(onScrollFrame); }
  }, { passive:true });

  // ===== SCROLL SPY (home page) =====
  // The nav link for the section in the middle of the screen is underlined.
  var spyAtBottom = null;
  var navLinks = links ? Array.prototype.slice.call(links.querySelectorAll('a')) : [];
  var onHome = /^\/(index\.html)?$/.test(location.pathname);
  if (onHome && navLinks.length && 'IntersectionObserver' in window){
    links.classList.add('spy');
    var linkFor = {};
    navLinks.forEach(function(a){
      var href = a.getAttribute('href');
      var id = href === '/' ? 'home' : href === '/projects/' ? 'projects' : (href.indexOf('/#') === 0 ? href.slice(2) : null);
      if (id) linkFor[id] = a;
    });
    function setActive(id){
      navLinks.forEach(function(a){ a.classList.toggle('is-active', a === linkFor[id]); });
    }
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin:'-45% 0px -50% 0px' });
    Object.keys(linkFor).forEach(function(id){
      var sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
    // The last section may never reach the middle of the screen.
    spyAtBottom = function(atBottom){ if (atBottom) setActive('contact'); };
  }
  onScrollFrame();

  // ===== FOOTER YEAR =====
  // The HTML carries a static year as a fallback; this keeps it current.
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
