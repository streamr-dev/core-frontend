// @flow

import type { NavigationLink } from '../../../flowtype/navigation-types'
import links from '$shared/../links'

// navigationLinks Schema:
// 'rendered title': 'URL Address',
// ...

const navigationLinks: NavigationLink = {
    Introduction: links.newdocs.introduction,
    'Getting Started': links.newdocs.gettingStarted,
    Streams: links.newdocs.streams,
    Canvases: links.newdocs.canvases,
    Dashboards: links.newdocs.dashboards,
    Products: links.newdocs.products,
    Tutorials: links.newdocs.tutorials,
    'Data Token': links.newdocs.dataToken,
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
    gettingStarted: {},
    streams: {
        'intro-to-streams': 'Intro to streams',
        'work-with-streams-in-core': 'Work with streams in Core',
        'work-with-streams-via-sdks': 'Work with streams via SDKs',
        'work-with-streams-via-api': 'Work with streams via API',
        'work-with-streams-via-mqtt': 'Work with streams via MQTT',
        'data-signing-and-verification': 'Data signing and verification',
        'end-to-end-encryption': 'End-to-end encryption',
    },
    canvases: {
        'intro-to-canvases': 'Intro to canvases',
        'work-with-canvases-in-core': 'Work with canvases in Core',
        'work-with-canvases-via-api': 'Work with canvases via API',
        'building-integrations': 'Building integrations',
        'ethereum-modules': 'Ethereum modules',
    },
    dashboards: {
        'intro-to-dashboards': 'Intro to dashboards',
        'work-with-dashboards-in-core': 'Work with dashboards in Core',
        'work-with-dashboards-via-api': 'Work with dashboards via API',
    },
    products: {
        'intro-to-products': 'Intro to products',
        'regular-products': 'Regular products',
        'community-products': 'Community products',
    },
    tutorials: {
        placeholder: 'First tutorial placeholder',
    },
    dataToken: {},
    core: {
        'intro-to-core': 'Intro to Core',
        'work-with-streams-in-core': 'Work with streams in Core',
        'work-with-canvases-in-core': 'Work with canvases in Core',
        'work-with-dashboards-in-core': 'Work with dashboards in Core',
    },
    marketplace: {},
    // runningNode: {},
    SDKs: {
        'sdks-overview': 'Overview',
        'javascript-sdk': 'Javascript SDK',
        'java-sdk': 'Java SDK',
        'python-sdk': 'Python SDK',
        'contribute-sdk': 'Contribute an SDK?',
    },
    api: {
        'api-overview': 'API overview',
        'work-with-streams-via-api': 'Work with streams via API',
        'work-with-canvases-via-api': 'Work with canvases via API',
        'work-with-dashboards-via-api': 'Work with dashboards via API',
        'api-explorer': 'API Explorer',
    },
    technicalNotes: {
        'how-to-contribute': 'How to contribute',
        'running-private-streamr-stack': 'Running a private Streamr stack',
        'streamr-protocol-spec': 'Streamr protocol spec',
    },
}

export default navigationLinks
