# Awesomeverse Universal Navigation

Intended for use on fontawesome.com, docs.fontawesome.com, webawesome.com, 11ty.dev, blog.fontawesome.com, and (aspirationally) podcastawesome.com.

Compatible with Font Awesome web font `<i>` icons, `<svg>` embedded icons (and Build Awesome’s icon plugin), and Web Awesome’s `<wa-icon>`.

Relevant assets:

- `awesome-nav.css`
- `awesome-nav.js`

## Browser Support Minimums

- CSS Nesting
- `:has()`
- WOFF2 for brand wordmarks (Cera Round Pro, aggressively subset to A-Z uppercase)

## Current Limitations

- **Not yet published on `npm`**
- Tooltip on active primary tab is not shown at small viewports.
- Dark mode is specific to `prefers-color-scheme: dark` media query.
- Build Awesome icon is not yet available in Font Awesome core. Examples will be updated when this ships.

## Scratchpad

- Used `npx datauri-cli assets/cera-round-pro-black.woff2 | pbcopy` to create Data URI for CSS file.