// @flow

import type { NavigationLink } from '../../../flowtype/navigation-types'
import links from '$shared/../links'
import { canvasModulesCategorised, toAnchor } from '../../DocsPages/CanvasModules/data'

// navigationLinks Schema:
// 'rendered title': 'URL Address',
// ...

const navigationLinks: NavigationLink = {
    Introduction: links.newdocs.introduction,
    'Getting Started': links.newdocs.gettingStarted,
    Streams: links.newdocs.streams,
    Canvases: links.newdocs.canvases,
    'Canvas Modules': links.newdocs.canvasModules,
    Dashboards: links.newdocs.dashboards,
    Products: links.newdocs.products,
    Tutorials: links.newdocs.tutorials,
    'DATA Token': links.newdocs.dataToken,
    Core: links.newdocs.core,
    Marketplace: links.newdocs.marketplace,
    // RunningNode: links.newdocs.runningNode,
    SDKs: links.newdocs.SDKs,
    API: links.newdocs.api,
    'Technical Notes': links.newdocs.technicalNotes,
}

// subNav Schema:
// 'scrollable DOM ID': 'rendered title',
// ...

export const subNav = {
    introduction: {},
    gettingStarted: {
        'get-api-keys': 'Get your API keys',
        'connecting-ethereum-identity': 'Connecting your Ethereum identity',
        'get-building': 'Get building',
        'useful-links': 'Useful links',
    },
    streams: {
        'intro-to-streams': 'Intro to streams',
        'work-with-streams-in-core': 'Work with streams in Core',
        'work-with-streams-via-sdks': 'Work with streams via SDKs',
        'work-with-streams-via-api': 'Work with streams via API',
        'data-signing-and-verification': 'Data signing and verification',
        'end-to-end-encryption': 'End-to-end encryption',
        partitioning: 'Partitioning',
    },
    canvases: {
        'intro-to-canvases': 'Intro to canvases',
        'work-with-canvases-in-core': 'Work with canvases in Core',
        'building-integrations': 'Building integrations',
        'ethereum-modules': 'Ethereum modules',
    },
    canvasModules: Object.keys(canvasModulesCategorised).sort().reduce((o, category) => Object.assign(o, {
        [toAnchor(category)]: category,
    }), {}),
    dashboards: {
        'intro-to-dashboards': 'Intro to dashboards',
        'work-with-dashboards-in-core': 'Work with dashboards in Core',
    },
    products: {
        'intro-to-products': 'Intro to products',
        'work-with-products-in-core': 'Work with products in Core',
        'community-products': 'Community products',
    },
    tutorials: {
        'building-a-simple-pub-sub-system': 'Building a simple pub/sub system',
    },
    dataToken: {},
    core: {
        'intro-to-core': 'Intro to Core',
        'work-with-streams-in-core': 'Work with streams in Core',
        'work-with-canvases-in-core': 'Work with canvases in Core',
        'work-with-dashboards-in-core': 'Work with dashboards in Core',
        'work-with-products-in-core': 'Work with products in Core',
    },
    marketplace: {
        'introduction-marketplace': 'Introduction to the Marketplace',
        'buying-data-marketplace': 'Buying data on the Marketplace',
        'selling-data-marketplace': 'Selling data on the Marketplace',
    },
    SDKs: {
        'sdks-overview': 'Overview',
        'javascript-sdk': 'Javascript SDK',
        'java-sdk': 'Java SDK',
        'python-sdk': 'Python SDK',
        'contribute-sdk': 'Contribute an SDK?',
    },
    api: {
        'api-overview': 'API overview',
        authentication: 'Authentication',
        'work-with-streams-via-api': 'Work with streams via API',
        'api-explorer': 'API Explorer',
    },
    technicalNotes: {
        'how-to-contribute': 'How to contribute',
        'running-private-streamr-stack': 'Running a private Streamr stack',
        'streamr-protocol-spec': 'Streamr protocol spec',
    },
}

export default navigationLinks
