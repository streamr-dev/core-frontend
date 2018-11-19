# Material Icons Bundle

_Material Design SVG icons as ES modules_

[![](./meta/poster.svg)](https://darosh.github.io/material-icons-bundle/)

## Browse Icons

Visit [Icon Browser](https://darosh.github.io/material-icons-bundle/) featuring:

- **Visually similar icons** (using per pixel compare)
- Simple bundle (icon selection) copy/paste editor
- Various view, filtering and grouping options
- Large preview with various 24&times;24 grids and keyline blueprints (click preview to switch backgrounds)
- Full screen preview (press <kbd>Esc</kbd> to open/close)
- Hold <kbd>Ctrl</kbd> to compare with previously selected icon
- Instant search

## Install

```bash
$ yarn add github:darosh/material-icons-bundle
```

## Usage

```javascript
export {
  signal_cellular_connected_no_internet_0_bar,
  keyboard_arrow_left,
  keyboard_arrow_right,
  keyboard_arrow_up
} from 'material-icons-bundle'
```

will produce object like:

```javascript
{
  signal_cellular_connected_no_internet_0_bar: '<path fill-opacity=".3" d="M22 8V2L2 22h16V8z"></path>...',
  keyboard_arrow_left: 'M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z',
  ...
}
```

where most of values are `<path>` `d` attribute data. Some data starting with `<` are svg inner elements, such icons are tagged as `multi-shape` in the [browser](https://darosh.github.io/material-icons-bundle/#/?group=All&search=multi-shape).

Icon aliases points to same `*.js` file for minimal build. 

Tree-shaking [rollup.js](https://rollupjs.org/#tree-shaking) or [webpack](https://webpack.js.org/guides/tree-shaking/) recommended.

_Here is some real usage [example](https://github.com/darosh/oax/commit/9856e4a2583871fc91ea6b62d2ec991b19b4cfa5#diff-72b3431e98e067995f113fd82497deae) (and previous _re-exporting version_ using another icon package.)_

## Sources

- Google icons [material.io/icons](https://material.io/icons/) from [google/material-design-icons](https://github.com/google/material-design-icons/)
- Community icons [materialdesignicons.com](https://materialdesignicons.com/) from [Templarian/MaterialDesign-SVG](https://github.com/Templarian/MaterialDesign-SVG) and [API](https://github.com/Templarian/MaterialDesign-Site/blob/master/src/content/api.md)

Sources are merged comparing rendered pixel with some additional auto tagging.
See [compare](https://darosh.github.io/material-icons-bundle/#/compare) table for more information.

## Metadata

Used by [Icon Browser](https://darosh.github.io/material-icons-bundle/):

- [meta.json](https://darosh.github.io/material-icons-bundle/meta.json)
- [similar.json](https://darosh.github.io/material-icons-bundle/similar.json)

## Poster generator

Leverages `pixels` and `frame` metadata in [meta.json](https://darosh.github.io/material-icons-bundle/meta.json).

- [online](https://darosh.github.io/material-icons-bundle/poster.html) 
- [source](./meta/poster.html)

## Development

__Note__: you may experience issues with installing material-design-icons package, it may be easier to download & unpack it manually

```text
yarn
yarn build
yarn export
```
