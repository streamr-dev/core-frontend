// @flow

import links from '$shared/../links'
import type { DocsNav } from '$docs/flowtype/navigation-types'

const { docs: {
    streams,
    canvases,
    api,
    moduleReference,
    core,
    dashboards,
    dataToken,
    gettingStarted,
    introduction,
    marketplace,
    products,
    dataUnions,
    SDKs,
    technicalNotes,
    tutorials,
} } = links

// docsNav:
// - 'root' key is required for all sections.
// - Key = Rendered navigation title.
// - Value = Docs route.

type IncludeSections = {
    dataUnions?: boolean,
}

export const generateNav = ({ dataUnions: includeDataUnions = !!process.env.DATA_UNIONS }: IncludeSections = {}) => ({
    Introduction: {
        root: introduction.root,
    },
    'Getting Started': {
        root: gettingStarted.root,
    },
    Streams: {
        root: streams.root,
        'Intro to streams': streams.introToStreams,
        'Streams in Core': streams.usingStreamsInCore,
        'Streams via SDKs': streams.usingStreamsViaSDK,
        'Streams via API': streams.usingStreamsViaApi,
        'Data signing & verification': streams.dataSigningAndVerification,
        'End-to-end encryption': streams.endToEndEncryption,
        Partitioning: streams.partitioning,
        'Integration Patterns': streams.integrationPatterns,
    },
    Canvases: {
        root: canvases.root,
        'Intro to canvases': canvases.introToCanvases,
        'Using Canvases': canvases.usingCanvases,
        'Modules basics': canvases.modulesBasics,
        'Modules advanced': canvases.modulesAdvanced,
    },
    'Module Reference': {
        root: moduleReference.root,
        Boolean: moduleReference.boolean,
        'Custom Modules': moduleReference.customModules,
        Input: moduleReference.input,
        Integrations: moduleReference.integrations,
        List: moduleReference.list,
        Streams: moduleReference.streams,
        Text: moduleReference.text,
        'Time & Date': moduleReference.timeAndDate,
        'Time Series': moduleReference.timeSeries,
        Utils: moduleReference.utils,
        Visualizations: moduleReference.visualizations,
    },
    Dashboards: {
        root: dashboards.root,
    },
    Products: {
        root: products.root,
        'Intro to products': products.introToProducts,
        'Data Unions': products.dataUnions,
    },
    ...(includeDataUnions ? {
        'Data Unions': {
            root: dataUnions.root,
            'Intro to Data Unions': dataUnions.introToDataUnions,
            'Data Unions in Core': dataUnions.dataUnionsInCore,
            'Data Unions Integration': dataUnions.integration,
            'Build a Data Union': dataUnions.dataUnionsInSDK,
        },
    } : {}),
    Tutorials: {
        root: tutorials.root,
        'Simple pub/sub': tutorials.buildingPubSub,
        'Custom modules': tutorials.buildingCustomModule,
    },
    'DATA Token': {
        root: dataToken.root,
    },
    Core: {
        root: core.root,
        'Intro to Core': core.introToCore,
        // 'Streams in Core': core.streamsInCore,
        // 'Canvases in Core': core.canvasesInCore,
        // 'Dashboards in Core': core.dashboardsInCore,
        // 'Products in Core': core.productsInCore,
    },
    Marketplace: {
        root: marketplace.root,
        'Intro to the Marketplace': marketplace.introToMarketplace,
        'Data Unions': marketplace.dataUnions,
    },
    // 'Running a Node': {
    //     root: runningNode.root,
    // },
    SDKs: {
        root: SDKs.root,
    },
    API: {
        root: api.root,
        'API overview': api.apiOverview,
        Authentication: api.authentication,
        'Streams via API': api.usingStreamsViaApi,
        'API Explorer': api.apiExplorer,
    },
    'Technical Notes': {
        root: technicalNotes.root,
    },
})

export const docsNav: DocsNav = generateNav()
