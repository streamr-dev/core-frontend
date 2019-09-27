// @flow

import type { NavigationLink } from '../../../flowtype/navigation-types'
import links from '$shared/../links'
import { canvasModulesCategorised, toAnchor } from '../../DocsPages/CanvasModules/data'

// navigationLinks Schema:
// 'rendered title': 'URL Address',
// ...

const navigationLinks: NavigationLink = {
    Introduction: links.docs.introduction,
    'Getting Started': links.docs.gettingStarted,
    Streams: links.docs.streams,
    Canvases: links.docs.canvases,
    'Canvas Modules': links.docs.canvasModules,
    Dashboards: links.docs.dashboards,
    Products: links.docs.products,
    Tutorials: links.docs.tutorials,
    'DATA Token': links.docs.dataToken,
    Core: links.docs.core,
    Marketplace: links.docs.marketplace,
    // RunningNode: links.docs.runningNode,
    SDKs: links.docs.SDKs,
    API: links.docs.api,
    'Technical Notes': links.docs.technicalNotes,
}

// subNav Schema:
// 'scrollable DOM ID': 'rendered title',
// ...

export const subNav = {
    introduction: {},
    gettingStarted: {
        'get-api-keys': 'Get your API keys',
        'ethereum-identity': 'Ethereum identity',
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
        'integration-patterns': 'Integration Patterns',
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
        'building-custom-canvas-module': 'Building a custom canvas module',
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
