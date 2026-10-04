/* ============================================================
   ROLE FILTER — shared by the home page and /projects/.
   Choosing a role highlights every element whose data-roles list
   contains it ("data", "qa", or both) and dims the rest. Nothing
   is hidden. An element with data-roles="" matches only "All".

   The control is a radio group: Tab reaches the selected option,
   arrow keys (and Home/End) move and select, as with any set of
   radio buttons.
   ============================================================ */
(function(){
  var box = document.getElementById('roleFilter');
  if (!box) return;
  var radios = Array.prototype.slice.call(box.querySelectorAll('[role="radio"]'));
  var items  = Array.prototype.slice.call(document.querySelectorAll('[data-roles]'));
  var note   = document.getElementById('roleFilterNote');
  var names  = {data:'Data Analyst', qa:'QA Tester'};

  function matches(el, role){
    if (role === 'all') return true;
    return (' ' + el.getAttribute('data-roles') + ' ').indexOf(' ' + role + ' ') !== -1;
  }

  function select(btn, focus){
    var role = btn.getAttribute('data-role');
    radios.forEach(function(r){
      var on = r === btn;
      r.setAttribute('aria-checked', on ? 'true' : 'false');
      r.tabIndex = on ? 0 : -1;
    });
    if (focus) btn.focus();

    items.forEach(function(el){
      var hit = matches(el, role);
      el.classList.toggle('role-dim', !hit);
      el.classList.toggle('role-match', role !== 'all' && hit);
    });
    if (note){
      note.textContent = role === 'all' ? '' :
        'Highlighting work relevant to ' + names[role] + ' roles. The rest is dimmed, not hidden.';
    }
  }

  radios.forEach(function(r, i){
    r.addEventListener('click', function(){ select(r, false); });
    r.addEventListener('keydown', function(e){
      var n = radios.length, next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = radios[(i + 1) % n];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = radios[(i - 1 + n) % n];
      else if (e.key === 'Home') next = radios[0];
      else if (e.key === 'End') next = radios[n - 1];
      if (next){ e.preventDefault(); select(next, true); }
    });
  });

  box.hidden = false;
})();
