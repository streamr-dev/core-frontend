import '@babel/polyfill'
import 'storybook-chromatic'
import { setAddon, configure, addDecorator } from '@storybook/react'
import { setOptions } from '@storybook/addon-options'
import JSXAddon from 'storybook-addon-jsx'
import { addParameters } from '@storybook/react'
import { xs, sm, md, lg } from '$app/scripts/breakpoints'

// To import the global styling
import '$shared/assets/stylesheets'
import '@ibm/plex/css/ibm-plex.css'

setAddon(JSXAddon)

const viewports = {
    iPhone: {
        name: 'iPhone',
        styles: {
            width: `375px`,
            height: '100%',
        },
        type: 'mobile',
    },
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
    options: {
        storySort: (a, b) =>
        a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
    },
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
