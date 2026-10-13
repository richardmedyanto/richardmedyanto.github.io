# My Website

This repository contains my personal website.

## How to Use This Repo

Run `hugo serve`.

To check on other devices, e.g. on mobile phone, check your local IP address and run  `hugo serve --bind 0.0.0.0 --baseURL http://[your local IP address]/`.

To customize this website, modify the contents in the following directories:

- **`content/`** - Update your page content and data
- **`static/`** - Add or modify static files and resources
- **`assets/`** - Replace images, icons, and other media files

After making your changes, rebuild and deploy the site according to your hosting setup.

## Edit pages

Pages are generated from Markdown under `content/page/`: `cv/index.md`, `archives/index.md`, and `search/index.md`. Their `index.zh-tw.md` and `index.zh-cn.md` files provide the Chinese translations. Both themes render the Markdown body, including any introduction added to Archives or Search. New ordinary pages can use the same `content/page/<name>/index.md` structure.

Keep `date` as the original publication date. When editing an existing page, update `lastmod` instead:

```yaml
date: 2025-07-16T15:54:20.532Z
lastmod: 2026-10-13T15:54:20.532Z
```

## Switch themes and palettes

The `theme` key near the top of `config.yaml` selects the complete theme:

```yaml
theme: material-cards # rounded cards and selective frosted glass
# theme: richard-cards # original shader-backed cards
```

For `material-cards`, change these settings under the existing `params` block:

```yaml
params:
  materialCards:
    palette: auto # or copper, sage, plum, petrol, oxblood, navy, ochre
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
    defaultAppearance: light # light, dark, or system
```

See `themes/material-cards/README.md` and `themes/richard-cards/README.md` for the theme controls and file locations. `hugo server --theme richard-cards` temporarily previews the old theme without editing the config.
