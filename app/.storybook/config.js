import '@babel/polyfill'
import 'storybook-chromatic'
import { setAddon, configure, addDecorator } from '@storybook/react'
import { setOptions } from '@storybook/addon-options'
import JSXAddon from 'storybook-addon-jsx'
import { addParameters } from '@storybook/react'
import { xs, sm, md, lg } from '$app/scripts/breakpoints'

// To import the global styling
import '$shared/assets/stylesheets'

setAddon(JSXAddon)

const viewports = {
    xs: {
        name: 'Mobile (xs)',
        styles: {
            width: `${xs.max}px`,
            height: '100%',
        },
        type: 'mobile',
    },
    sm: {
        name: 'Mobile (sm)',
        styles: {
            width: `${sm.max}px`,
            height: '100%',
        },
        type: 'mobile',
    },
    md: {
        name: 'Tablet (md)',
        styles: {
            width: `${md.max}px`,
            height: '100%',
        },
        type: 'tablet',
    },
    lg: {
        name: 'Desktop (lg)',
        styles: {
            width: `${lg.max}px`,
            height: '100%',
        },
        type: 'desktop',
    },
}

addParameters({
    viewport: {
        defaultViewport: 'responsive',
        viewports,
    },
})

// https://www.npmjs.com/package/@storybook/addon-options
setOptions({
    name: 'Streamr Storybook',
    addonPanelInRight: true,
    sortStoriesByKind: true,
})

const importAll = (r) => {
    r.keys().forEach(r)
}

configure(() => {
    // Automatically import all files ending in *.stories.js and *.stories.jsx
    importAll(require.context('../stories/', true, /\.stories\.jsx?$/))
    importAll(require.context('../src/', true, /\.stories\.jsx?$/))
}, module)
