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
- [Postcss](https://github.com/postcss/postcss#usage)

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
module.exports = {
    // …,
    plugins: [
        // …,
        require('@streamr/streamr-layout/postcss-variables'),
    ]
}
```

## Usage

### Styling

```javascript
// Inject common CSS code into <head>
import '@streamr/streamr-layout/css'

// Inject bootstrap CSS
import '@streamr/streamr-layout/bootstrap'

// etc.
```

### Components

The module exposes reactstrap's components as if they're our own. We will soon
start replacing them with our own code, and eventually get rid of most of bootstrap.

```javascript
import { Button, Nav } from '@streamr/streamr-layout'
```

## Development

### Clone it.

```
git clone git@github.com:streamr-dev/streamr-layout.git
```

### Link it.

```
cd streamr-layout
npm link
cd /path/to/your/project
npm link @streamr/streamr-layout
```

From here your project uses the local instance of the module. Make changes and test them in your main app. At some point we may want to turn it into more of a independent entity, developeable on its own. That's future.

### Publish and reinstall.

Published a new version, right? Update your project's `package.json` and reinstall. This will replace the linked instance with the actual module coming from the.. cloud.
