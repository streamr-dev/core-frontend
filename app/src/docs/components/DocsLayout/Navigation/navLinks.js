// @flow

import type { NavigationLink } from '../../../flowtype/navigation-types'
import links from '$shared/../links'

const navigationLinks: NavigationLink = {
    Introduction: links.docs.introduction,
    'Getting Started': links.docs.main,
    Tutorials: links.docs.tutorials,
    'Visual Editor': links.docs.visualEditor,
    'Streamr Engine': links.docs.streamrEngine,
    Marketplace: links.docs.dataMarketplace,
    'Streamr API': links.docs.api,
}

export const subNav = {
    introduction: {},
    gettingStarted: {
        'create-a-stream': 'Create a Stream',
        'publish-to-a-stream': 'Publish to a Stream',
        'subscribe-to-data': 'Subscribe to data',
        'patterns-for-data-integration': 'Patterns for data integration',
    },
    tutorials: {
        'weather-station': 'Weather Station with Ruuvi Sensors',
        'cold-chain-monitoring': 'Cold Chain Monitoring',
        'integrating-google-fitness': 'Integrating Google Fitness',
    },
    visualEditor: {
        introduction: 'Introduction',
        streams: 'Streams',
        modules: 'Modules',
        canvases: 'Canvases',
        extensions: 'Extensions',
    },
    streamrEngine: {},
    marketplace: {
        'create-a-product': 'Create a Product',
    },
    api: {
        'introduction-to-streamr-apis': 'Introduction to Streamr APIs',
        authentication: 'Authentication',
        'data-input': 'Data Input',
        'data-output': 'Data Output',
        'api-explorer': 'API Explorer',
    },
}

export default navigationLinks
