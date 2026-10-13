# material-cards

Rounded article cards, a compact profile, a frosted mobile bar, and animated SVG sun/moon controls. Home shows Pages and Categories as labeled pill groups. Social links sit on the left and language choices on the right on mobile home. Other mobile pages use a navigation drawer. Post cards and category pills have separate, keyboard-accessible links.

Select this theme in the site's `config.yaml`:

```yaml
theme: material-cards

params:
  materialCards:
    palette: auto
    weeklyPalettes:
      monday: sage
      tuesday: petrol
      wednesday: plum
      thursday: copper
      friday: oxblood
      saturday: navy
      sunday: ochre
    frost: 30
    cardRadius: 26
    defaultAppearance: light
```

Keep the other existing `params` fields (author, avatar, socials). `defaultAppearance` accepts `light`, `dark`, or `system`. Light/dark preferences are remembered independently of the color palette.

| Palette key | Name | Default day (UTC+8) |
| --- | --- | --- |
| `sage` | Limestone & sage | Monday |
| `petrol` | Mist & petrol | Tuesday |
| `plum` | Pearl & plum | Wednesday |
| `copper` | Charcoal & copper | Thursday |
| `oxblood` | Ivory & oxblood | Friday |
| `navy` | Cloud & indigo | Saturday |
| `ochre` | Linen & ochre | Sunday |

`palette: auto` follows `weeklyPalettes` at midnight **UTC+8**, regardless of the visitor's local timezone. The page selects the correct palette before paint, updates if it remains open at midnight, and refreshes the selection after returning to a sleeping/background tab. Set `palette` to any palette key for a fixed configured default.

The Appearance disclosure contains **Automatic** and seven palette pills. A visitor's choice is remembered across navigation until the next UTC+8 midnight. Clicking Automatic immediately resumes the weekly schedule. Legacy frosting preferences are ignored; frosting comes only from configuration, at 30% by default, with no slider.

Every palette includes light and dark colors. Body, secondary, and accent text contrast against the main surfaces is at least **4.67:1**. The mobile title has no separate background plate. Frosting affects the controls and mobile bar; article surfaces stay opaque. Card corners accept 20–32px.

Edit `data/materialPalettes.json` for colors, `assets/css/main.css` for layout and motion, and `assets/icons/theme-sun.svg` / `theme-moon.svg` for SVG geometry. This theme is independent of `richard-cards`.

Preview and verify the UTC+8 schedule:

```sh
hugo server --theme material-cards
node --test themes/material-cards/tests/palette-runtime.test.js
```
