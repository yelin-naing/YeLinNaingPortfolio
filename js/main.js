/* Shared by every page: the mobile menu and the footer year.
   Everything else on the site is plain HTML and works without this file. */
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

  // ===== FOOTER YEAR =====
  // The HTML carries a static year as a fallback; this keeps it current.
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
