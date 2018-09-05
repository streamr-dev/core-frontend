# streamr-layout

Common styling and components for Streamr sites.

## Installation

```
npm install --save @streamr/streamr-layout
```

## Requirements

Make sure that project that you install this module into meets all peer dependency requirements. Then you should be good to go. :)

## Configuration

### webpack

If you want to use styling coming with this module you have to set up proper loaders in your `webpack.config.js`. Example:

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

We also expose a bunch of `.pcss` files for direct use. Using them requires including our postcss config snippet into your postcss config file. Example:

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

Run `npm run build` to get the `dist` directory populated with bundles.

Run `npm start` if you want to make changes and immediately see the effect. It runs webpack in _watch_ mode so you don't have to manually build things yourself. Cheers!

### Link it.

```
npm link
cd /path/to/your/project
npm link @streamr/streamr-layout
```

### Publish it.

Please refer to [`npm version`](https://docs.npmjs.com/cli/version) manual on how to bump up the version string.

Usually it ends up being something like this (for a patch):

```
npm version patch
```

It turns `0.0.1` into `0.0.2`. :)

Then, once everything is in place you `npm publish`.

It is good to push the version to our git repo too, for future generations. Please include the tag.

```
git push origin <branch> <tag>
```

### Post-publish fun.

Published a new version, right? At this point you may not want the linked module in your system. Got to your project and `npm unlink @streamr/streamr-layout`. Then in this module's directory call `npm unlink`. The air is clear!

Now got to your project's `package.json` and point to the current version of `@streamr/streamr-layout`. Run `npm i`. Done!

Cheers!
