(() => {
  function init() {
    const root = document.documentElement;
    const buttons = [...document.querySelectorAll('.palette-choice')];
    const status = document.querySelector('.palette-status');
    const configuration = window.materialCardsConfiguration;
    let selection, midnightTimer;
    try { selection = JSON.parse(localStorage.getItem(root.dataset.settingsStorage) || 'null'); } catch (_) {}

    function sync() {
      const state = MaterialPalettes.resolvePalette(configuration, selection, Date.now());
      if (selection && selection.day !== state.day) {
        selection = null;
        try { localStorage.removeItem(root.dataset.settingsStorage); } catch (_) {}
      }
      root.dataset.palette = state.palette;
      root.dataset.paletteChoice = state.choice;
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.choice === state.choice)));
      if (status) {
        const paletteName = buttons.find(button => button.dataset.choice === state.palette)?.textContent.trim() || state.palette;
        status.textContent = state.automatic ? status.dataset.automaticLabel + ' ' + paletteName : status.dataset.manualLabel;
      }
      clearTimeout(midnightTimer);
      midnightTimer = setTimeout(sync, state.midnightDelay + 50);
    }

    buttons.forEach(button => button.addEventListener('click', () => {
      selection = {choice: button.dataset.choice, day: MaterialPalettes.dateState(Date.now()).day};
      try { localStorage.setItem(root.dataset.settingsStorage, JSON.stringify(selection)); } catch (_) {}
      sync();
    }));
    document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
    window.addEventListener('pageshow', sync);
    window.addEventListener('storage', event => {
      if (event.key !== root.dataset.settingsStorage) return;
      try { selection = JSON.parse(event.newValue); } catch (_) { selection = null; }
      sync();
    });
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
