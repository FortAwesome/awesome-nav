# Awesomeverse Universal Navigation

Used on fontawesome.com, webawesome.com, 11ty.dev, blog.fontawesome.com, and (aspirationally) podcastawesome.com.

Compatible with Font Awesome web font `<i>` icons, `<svg>` embedded icons (and Build Awesome’s icon plugin), and Web Awesome’s `<wa-icon>`.

Relevant assets:

- `awesome-nav.css`
- `awesome-nav.js`
- `awesome-navbar-subset.woff2`

## Browser Support Minimums

- CSS Nesting
- WOFF2 for brand wordmarks (Cera Round Pro, aggressively subset to A-Z uppercase)
- Enhancement: [`descent-override`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/descent-override) to enable emulated web font metric compatibility for reduced layout shift

## Current Limitations

- Tooltip on active primary tab is not shown at small viewports.
- Dark mode is specific to `prefers-color-scheme: dark` media query.
- Build Awesome icon is not yet available in Font Awesome core. Examples will be updated when this ships.