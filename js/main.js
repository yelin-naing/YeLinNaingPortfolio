/* Shared by every page: the mobile menu, scroll reveals and the footer year.
   The site is plain HTML and every page works fully without this file. */
(function(){
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
  // Sections fade up once as they enter the screen. Only elements that
  // start below the screen are hidden, and each is revealed as soon as
  // any part of it scrolls into view, so nothing on screen is ever held
  // invisible. Without IntersectionObserver, or with reduced motion,
  // nothing is hidden at all.
  var REVEAL = [
    '.section-head', '.section-foot', '.prose', '.contact-panel',
    '.project-card', '.skill-logos', '.entry', '.cert'
  ].join(',');
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
    var below = Array.prototype.filter.call(document.querySelectorAll(REVEAL), function(el){
      return el.getBoundingClientRect().top > window.innerHeight;
    });
    var heard = false;
    var io = new IntersectionObserver(function(entries){
      heard = true;
      var batch = entries.filter(function(e){ return e.isIntersecting; })
                         .map(function(e){ return e.target; });
      // Items that arrive together (a row of cards) reveal in page order,
      // a few milliseconds apart.
      batch.sort(function(a, b){
        return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });
      batch.forEach(function(el, i){
        io.unobserve(el);
        el.style.setProperty('--reveal-delay', Math.min(i * STAGGER_MS, STAGGER_MAX) + 'ms');
        el.classList.remove('reveal-pending');
        el.classList.add('reveal-in');
      });
    });
    below.forEach(function(el){
      el.classList.add('reveal-pending');
      io.observe(el);
    });
    // The observer always reports once per element straight away. If that
    // never happens, show everything rather than risk hidden content.
    setTimeout(function(){
      if (heard) return;
      io.disconnect();
      below.forEach(function(el){ el.classList.remove('reveal-pending'); });
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
