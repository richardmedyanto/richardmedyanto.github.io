# Shader Theme for Hugo

Minimal blog theme with an interactive WebGL shader wallpaper (mesh gradient + ambient flow), light/dark mode, multilingual support.

## Install

```sh
# from your Hugo site root
git rm -rf themes/hugo-theme-stack      # remove old theme
cp -r /path/to/custom themes/custom
```

Then update `config.yaml`:

```yaml
theme: custom
```

## Directory structure this theme expects

```
your-site/
├── config.yaml
├── content/
│   ├── _index.md              # homepage
│   ├── curriculum-vitae/index.md
│   ├── archives/_index.md
│   └── p/
│       ├── hbt-tools/index.md
│       ├── optic-2025/index.md
│       └── ...
├── i18n/                       # translations (en.yaml, zh-tw.yaml, zh-cn.yaml)
├── static/img/avatar.jpg       # your avatar
└── themes/custom/
```

## Config reference

See `exampleSite/config.yaml` in this theme for a full working example.
