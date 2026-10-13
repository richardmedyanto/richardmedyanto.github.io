# richard-cards

The original shader-backed blog theme, retained with its translucent cards, mesh and ambient wallpaper, and responsive sidebar. The language choices are now `EN`, `繁體`, and `简体`, beside an animated SVG sun/moon switch using the same motion as `material-cards`.

To use it, change the site's `config.yaml`:

```yaml
theme: richard-cards
```

The `params.materialCards` settings can remain in the config while this theme is active. This theme does not use them. Its colors and layout live in `assets/css/main.css`; wallpaper code lives in `assets/js/`. Theme switching preserves all existing content and translations.

Preview without changing the configured theme:

```sh
hugo server --theme richard-cards
```
