import { setAddon, configure } from '@storybook/react'
import { setOptions } from '@storybook/addon-options'
import JSXAddon from 'storybook-addon-jsx'

import '$mp/components/App/globalStyles' // To import the global styling

setAddon(JSXAddon)

// https://www.npmjs.com/package/@storybook/addon-options
setOptions({
    name: 'Streamr Storybook',
    addonPanelInRight: true,
    sortStoriesByKind: true,
})

// Automatically import all files ending in *.stories.js and *.stories.jsx
const req = require.context('../stories', true, /\.stories\.jsx?$/)
function loadStories() {
    req.keys().forEach(req)
}

configure(loadStories, module)
