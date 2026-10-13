(function (root) {
  const DAY_MS = 86400000;
  const UTC_OFFSET_MS = 8 * 3600000;
  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const weeklyDefaults = {monday: 'sage', tuesday: 'petrol', wednesday: 'plum', thursday: 'copper', friday: 'oxblood', saturday: 'navy', sunday: 'ochre'};

  function dateState(timestamp) {
    const shifted = new Date(timestamp + UTC_OFFSET_MS);
    return {
      day: shifted.toISOString().slice(0, 10),
      weekday: weekdays[shifted.getUTCDay()],
      midnightDelay: DAY_MS - ((timestamp + UTC_OFFSET_MS) % DAY_MS)
    };
  }

  function resolvePalette(configuration, selection, timestamp) {
    const date = dateState(timestamp);
    const available = configuration.available;
    const validChoice = value => value === 'auto' || available.includes(value);
    const saved = selection && selection.day === date.day && validChoice(selection.choice);
    const requested = saved ? selection.choice : configuration.palette;
    const choice = validChoice(requested) ? requested : 'auto';
    const scheduled = configuration.weeklyPalettes?.[date.weekday] || weeklyDefaults[date.weekday];
    const automaticPalette = available.includes(scheduled) ? scheduled : (available.includes(weeklyDefaults[date.weekday]) ? weeklyDefaults[date.weekday] : available[0]);
    return {...date, choice, automatic: choice === 'auto', palette: choice === 'auto' ? automaticPalette : choice};
  }

  const api = {dateState, resolvePalette};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MaterialPalettes = api;
})(typeof window !== 'undefined' ? window : globalThis);
