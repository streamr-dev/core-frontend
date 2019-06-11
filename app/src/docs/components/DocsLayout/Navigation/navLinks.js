// @flow

import type { NavigationLink } from '../../../flowtype/navigation-types'
import links from '$shared/../links'

// navigationLinks Schema:
// 'rendered title': 'URL Address',
// ...

const navigationLinks: NavigationLink = {
    Introduction: links.docs.introduction,
    'Getting Started': links.docs.gettingStarted,
    Tutorials: links.docs.tutorials,
    'Visual Editor': links.docs.visualEditor,
    'Streamr Engine': links.docs.streamrEngine,
    Marketplace: links.docs.dataMarketplace,
    'User Pages': links.docs.userPage,
    'Streamr API': links.docs.api,
}

// subNav Schema:
// 'scrollable DOM ID': 'rendered title',
// ...

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
    userPages: {
        'introduction-user-pages': 'Introduction',
        'main-features': 'Main Features',
        'page-overview': 'Page Overview',
    },
    api: {
        'introduction-to-streamr-apis': 'Introduction',
        authentication: 'Authentication',
        'data-input': 'Data Input',
        'data-output': 'Data Output',
        'api-explorer': 'API Explorer',
    },
}

export default navigationLinks
