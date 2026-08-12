/* Preloader: cycles a greeting per language, then hands off to the page.
   Anything that should wait for it registers with window.__preload.onDone(). */
(function(){
  var el   = document.getElementById('preloader');
  var word = document.getElementById('preWord');
  var lang = document.getElementById('preLang');
  var fill = document.getElementById('preFill');

  var callbacks = [];
  window.__preload = {
    done: false,
    onDone: function(cb){ this.done ? cb() : callbacks.push(cb); }
  };

  function finish(){
    if (window.__preload.done) return;
    window.__preload.done = true;
    document.body.classList.remove('preloading');
    el.classList.add('done');
    setTimeout(function(){ if (el.parentNode) el.parentNode.removeChild(el); }, 650);
    callbacks.forEach(function(cb){ try { cb(); } catch(e){} });
    callbacks.length = 0;
  }

  var greetings = [
    ["မင်္ဂလာပါ", "Burmese"],
    ["你好",                                                  "Chinese"],
    ["สวัสดี",                      "Thai"],
    ["Xin chào",                                                  "Vietnamese"],
    ["こんにちは",                             "Japanese"],
    ["Hola",                                                            "Spanish"],
    ["Bonjour",                                                         "French"],
    ["Hello",                                                           "English"]
  ];

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Set to true if you'd rather returning visitors skip the intro
  // for the rest of their browser session.
  var ONCE_PER_SESSION = false;

  // Clear the flag left behind by an earlier version of this page
  if (!ONCE_PER_SESSION){ try { sessionStorage.removeItem('leoSeenIntro'); } catch(e){} }

  var seen = false;
  if (ONCE_PER_SESSION){
    try { seen = sessionStorage.getItem('leoSeenIntro') === '1'; } catch(e){}
  }

  if (seen || reduce){
    word.textContent = 'Hello';
    lang.textContent = 'English';
    fill.style.width = '100%';
    setTimeout(finish, reduce ? 420 : 180);
    return;
  }

  // STEP = how long each greeting stays on screen (ms).
  // Raise it to slow the intro down, lower it to speed it up.
  var STEP = 500;
  var ANIM = 320;   // how long the word takes to settle; the rest is hold time
  var i = 0;

  function show(n){
    word.textContent = greetings[n][0];
    lang.textContent = greetings[n][1];
    word.style.animation = 'none';
    lang.style.animation = 'none';
    void word.offsetWidth;
    word.style.animation = 'preWordIn ' + ANIM + 'ms cubic-bezier(.16,1,.3,1)';
    lang.style.animation = 'preLangIn ' + ANIM + 'ms ease';
    fill.style.transition = 'width ' + STEP + 'ms linear';
    fill.style.width = Math.round(((n + 1) / greetings.length) * 100) + '%';
  }

  show(0);
  setTimeout(function(){ if (!window.__preload.done) el.classList.add('hint'); }, 1400);
  var timer = setInterval(function(){
    i++;
    if (i >= greetings.length){
      clearInterval(timer);
      if (ONCE_PER_SESSION){ try { sessionStorage.setItem('leoSeenIntro','1'); } catch(e){} }
      setTimeout(finish, 420);
      return;
    }
    show(i);
  }, STEP);

  // Skip on click, tap, key, or scroll — nobody should be made to wait
  function skip(){ clearInterval(timer); if (ONCE_PER_SESSION){ try { sessionStorage.setItem('leoSeenIntro','1'); } catch(e){} } finish(); }
  el.addEventListener('click', skip);
  el.addEventListener('touchstart', skip, {passive:true});
  window.addEventListener('keydown', skip, {once:true});

  // Safety net: never trap anyone behind the overlay
  setTimeout(finish, 9000);
  // If something else on the page throws, don't kill the intro instantly —
  // just make sure it can't outlast its normal run.
  window.addEventListener('error', function(){ setTimeout(finish, 1200); });
})();
