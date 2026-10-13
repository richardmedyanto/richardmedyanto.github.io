(() => {
  function init() {
    const root = document.documentElement;
    const switches = [...document.querySelectorAll('.theme-switch')];
    function reflectTheme() {
      switches.forEach(button => button.setAttribute('aria-checked', String(root.dataset.theme === 'dark')));
    }
    switches.forEach(button => button.addEventListener('click', () => {
      const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = theme;
      try { localStorage.setItem(root.dataset.themeStorage, theme); } catch (_) {}
      reflectTheme();
      window.dispatchEvent(new CustomEvent('site:themechange', {detail: {theme}}));
    }));
    reflectTheme();
    const sidebar = document.getElementById('site-sidebar');
    const hamburger = document.getElementById('hamburger');
    const backdrop = document.getElementById('sidebar-backdrop');
    const main = document.querySelector('main.main');
    const mobile = window.matchMedia('(max-width: 860px)');
    const home = document.body.classList.contains('is-home');
    if (!sidebar || !hamburger || !backdrop || home) return;
    function setMenu(open, restoreFocus = true) {
      sidebar.classList.toggle('open', open);
      backdrop.classList.toggle('visible', open);
      backdrop.setAttribute('aria-hidden', String(!open));
      backdrop.inert = !open;
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('sidebar-open', open);
      sidebar.inert = mobile.matches && !open;
      main.inert = mobile.matches && open;
      if (open) sidebar.querySelector('button, a')?.focus();
      else if (restoreFocus) hamburger.focus();
    }
    hamburger.addEventListener('click', () => setMenu(!sidebar.classList.contains('open')));
    backdrop.addEventListener('click', () => setMenu(false));
    sidebar.querySelector('.sidebar-close')?.addEventListener('click', () => setMenu(false));
    document.addEventListener('keydown', event => {
      if (!sidebar.classList.contains('open')) return;
      if (event.key === 'Escape') { event.preventDefault(); setMenu(false); }
      if (event.key !== 'Tab') return;
      const focusable = [...sidebar.querySelectorAll('a, button, input, select, summary')].filter(el => el.getClientRects().length && !el.disabled);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    });
    mobile.addEventListener('change', () => setMenu(false, false));
    setMenu(false, false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
