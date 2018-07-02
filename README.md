# streamr-layout

Common styling and components for Streamr sites.

## Installation

In order to install the module you have to be a member of the `streamr` organization on [npmjs.com](https://www.npmjs.com/).

```
npm install --save @streamr/streamr-layout
```

## Requirements

Make sure the following libraries are present in your project:

- [webpack](https://webpack.js.org/guides/getting-started/)
- [React](https://github.com/facebook/react)
- [ReactDOM](https://reactjs.org/docs/react-dom.html)
- [Postcss](https://github.com/postcss/postcss#usage)
- [Reactstrap](https://github.com/reactstrap/reactstrap)

## Configuration

### webpack

Make sure your setup knows how to load CSS files and selected font file formats:

```javascript
[
    {
        test: /\.css$/,
        loader: 'css-loader'
    },
    {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
    },
    {
        test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader'
    }
]
```

### postcss

Configure your postcss setup:

```javascript
// postcss.config.js
const vars = require('@streamr/streamr-layout/postcss-variables')

module.exports = {
    plugins: [
        // …,
        vars,
    ]
}
```

## Usage

### Styling

```javascript
import '@streamr/streamr-layout/sass/bootstrap'
import '@streamr/streamr-layout/dist/bundle.css'
import '@streamr/streamr-layout/css'
import '@streamr/streamr-layout/pcss'
// …
```

### Configuration

There's not many moving parts in the library. One that could possibly find your interest is `NavLink.Link` and `NavLogo.Link`. You can replace them with custom components.

```jsx
import { NavLink, NavLogo } from '@streamr/streamr-layout'
import { Link } from 'react-router-dom'

NavLogo.Link = (
    <a href="/home">
        This will get replaced with the Streamr logo.
    </a>
)
NavLink.Link = <Link />
```

Please note that these are actual instances of `<a>` and `<Link>`. The library manages required props on its own.

## Development

### Clone it.

```
git clone git@github.com:streamr-dev/streamr-layout.git
cd streamr-layout
```

### Build it.

`streamr-layout` depends on external libraries. Make sure that you installed all peer dependencies of the library locally with versions that match versions in your target project.

```
npm i --no-save classnames@<version> react@<version> react-dom@<version> reactstrap@<version>
```

Then you can run `npm run build`. There's also an option to watch files and update bundles as you go by running `npm start`.

### Link it.

```
npm link
cd /path/to/your/project
npm link @streamr/streamr-layout
```

### Configure

### Publish and reinstall.

Published a new version, right? Update your target project's `package.json` and reinstall. This will replace the linked instance with the actual module coming from the.. cloud.
