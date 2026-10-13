const test = require('node:test');
const assert = require('node:assert/strict');
const {dateState, resolvePalette} = require('../assets/js/palette-runtime.js');
const palettes = require('../data/materialPalettes.json');
const configuration = {palette: 'auto', available: Object.keys(palettes), weeklyPalettes: {}};

test('UTC+8 midnight changes the day independently of the host timezone', () => {
  const before = dateState(Date.parse('2026-10-12T15:59:59.999Z'));
  const after = dateState(Date.parse('2026-10-12T16:00:00.000Z'));
  assert.equal(before.day, '2026-10-12');
  assert.equal(before.weekday, 'monday');
  assert.equal(before.midnightDelay, 1);
  assert.equal(after.day, '2026-10-13');
  assert.equal(after.weekday, 'tuesday');
  assert.equal(after.midnightDelay, 86400000);
});

test('a complete week selects seven distinct available palettes', () => {
  const expected = ['sage', 'petrol', 'plum', 'copper', 'oxblood', 'navy', 'ochre'];
  const mondayNoon = Date.parse('2026-10-12T04:00:00Z');
  const actual = expected.map((_, day) => resolvePalette(configuration, null, mondayNoon + day * 86400000).palette);
  assert.deepEqual(actual, expected);
  assert.equal(new Set(actual).size, 7);
  actual.forEach(key => assert.ok(palettes[key].light && palettes[key].dark));
});

test('configured weekday assignments take precedence over defaults', () => {
  const customized = {...configuration, weeklyPalettes: {tuesday: 'navy'}};
  assert.equal(resolvePalette(customized, null, Date.parse('2026-10-13T04:00:00Z')).palette, 'navy');
});

test('a manual choice persists through navigation and expires at UTC+8 midnight', () => {
  const selected = {choice: 'plum', day: '2026-10-12'};
  const before = resolvePalette(configuration, selected, Date.parse('2026-10-12T15:59:59Z'));
  const after = resolvePalette(configuration, selected, Date.parse('2026-10-12T16:00:00Z'));
  assert.equal(before.palette, 'plum');
  assert.equal(before.automatic, false);
  assert.equal(after.palette, 'petrol');
  assert.equal(after.choice, 'auto');
  assert.equal(after.automatic, true);
});

test('the Automatic pill resumes daily colors even with a fixed configured palette', () => {
  const fixed = {...configuration, palette: 'copper'};
  const now = Date.parse('2026-10-13T04:00:00Z');
  assert.equal(resolvePalette(fixed, null, now).palette, 'copper');
  const automatic = resolvePalette(fixed, {choice: 'auto', day: '2026-10-13'}, now);
  assert.equal(automatic.palette, 'petrol');
  assert.equal(automatic.automatic, true);
});

test('invalid saved choices and weekday mappings fall back to an available color', () => {
  const invalid = {...configuration, weeklyPalettes: {tuesday: 'missing'}};
  const state = resolvePalette(invalid, {choice: 'missing', day: '2026-10-13'}, Date.parse('2026-10-13T04:00:00Z'));
  assert.equal(state.palette, 'petrol');
  assert.equal(state.choice, 'auto');
});
