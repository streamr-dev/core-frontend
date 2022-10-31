import "core-js/stable"
import '$utils/setupSnippets'
import { xs, sm, md, lg } from '$app/scripts/breakpoints'

// To import the global styling
import '$shared/assets/stylesheets'
import '@ibm/plex/css/ibm-plex.css'

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

export const parameters = {
    viewport: {
        viewports,
    },
}
