import { configure } from '@storybook/react'

import '$mp/components/App/globalStyles' // To import the global styling

// Automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/)
function loadStories() {
    req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
