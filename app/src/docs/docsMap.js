import docsLinks from '../docsLinks'

// docsMap is used by the Docs UI Navigation and the Search Indexer script.
// All sections must contain a 'root' entry.
// N.B. Module references are indexed separately and thus only require the [path] property.

// [Section title] {   <-- Rendered navigation section title.
//     [Page Title] : {    <-- Rendered navigation page title.
//          [path]: Relative URL path,
//          [section]: Section title    <-- Property for the indexer
//          [title]: Page title     <-- Property for the indexer
//          [filePath]: Relative MDX file path     <-- Property for the indexer
//      }
// }

export const generateMap = ({ dataUnions: includeDataUnions = !!process.env.DATA_UNIONS_DOCS } = {}) => ({
    Introduction: {
        root: {
            path: docsLinks.introduction,
            section: 'Introduction',
            title: 'Introduction',
            filePath: 'introduction/introduction.mdx',
        },
    },
    'Getting Started': {
        root: {
            path: docsLinks.gettingStarted,
            section: 'Getting Started',
            title: 'Getting Started',
            filePath: 'gettingStarted/gettingStarted.mdx',
        },
    },
    Streams: {
        root: {
            path: docsLinks.streams,
            section: 'Streams',
            title: 'Intro to streams',
            filePath: 'streams/introToStreams.mdx',
        },
        'Intro to streams': {
            path: docsLinks.introToStreams,
            section: 'Streams',
            title: 'Intro to streams',
            filePath: 'streams/introToStreams.mdx',
        },
        'Streams in Core': {
            path: docsLinks.streamsInCore,
            section: 'Streams',
            title: 'Streams in Core',
            filePath: 'streams/usingStreamsInCore.mdx',
        },
        'Streams via SDKs': {
            path: docsLinks.streamsViaSdk,
            section: 'Streams',
            title: 'Streams via SDKs',
            filePath: 'streams/usingStreamsViaSdk.mdx',
        },
        'Streams via API': {
            path: docsLinks.streamsViaApi,
            section: 'Streams',
            title: 'Streams via API',
            filePath: 'streams/usingStreamsViaApi.mdx',
        },
        'Data signing & verification': {
            path: docsLinks.dataSigningAndVerification,
            section: 'Streams',
            title: 'Data signing & verification',
            filePath: 'streams/dataSigningAndVerification.mdx',
        },
        'End-to-end encryption': {
            path: docsLinks.endToEndEncryption,
            section: 'Streams',
            title: 'End-to-end encryption',
            filePath: 'streams/endToEndEncryption.mdx',
        },
        Partitioning: {
            path: docsLinks.partitioning,
            section: 'Streams',
            title: 'Partitioning',
            filePath: 'streams/partitioning.mdx',
        },
        'Integration Patterns': {
            path: docsLinks.integrationPatterns,
            section: 'Streams',
            title: 'Integration Patterns',
            filePath: 'streams/integrationPatterns.mdx',
        },
    },
    Canvases: {
        root: {
            path: docsLinks.canvases,
            section: 'Canvases',
            title: 'Intro to canvases',
            filePath: 'canvases/introToCanvases.mdx',
        },
        'Intro to canvases': {
            path: docsLinks.introToCanvases,
            section: 'Canvases',
            title: 'Intro to canvases',
            filePath: 'canvases/introToCanvases.mdx',
        },
        'Using Canvases': {
            path: docsLinks.usingCanvases,
            section: 'Canvases',
            title: 'Using Canvases',
            filePath: 'canvases/usingCanvasesInCore.mdx',
        },
        'Modules basics': {
            path: docsLinks.modulesBasics,
            section: 'Canvases',
            title: 'Modules basics',
            filePath: 'canvases/modulesBasics.mdx',
        },
        'Modules advanced': {
            path: docsLinks.modulesAdvanced,
            section: 'Canvases',
            title: 'Modules advanced',
            filePath: 'canvases/modulesAdvanced.mdx',
        },
    },
    'Module Reference': {
        root: {
            path: docsLinks.moduleReference,
        },
        Boolean: {
            path: docsLinks.moduleReferenceBoolean,
        },
        'Custom Modules': {
            path: docsLinks.moduleReferenceCustomModules,
        },
        Input: {
            path: docsLinks.moduleReferenceInput,
        },
        Integrations: {
            path: docsLinks.moduleReferenceIntegrations,
        },
        List: {
            path: docsLinks.moduleReferenceList,
        },
        Map: {
            path: docsLinks.moduleReferenceMap,
        },
        Streams: {
            path: docsLinks.moduleReferenceStreams,
        },
        Text: {
            path: docsLinks.moduleReferenceText,
        },
        'Time & Date': {
            path: docsLinks.moduleReferenceTimeAndDate,
        },
        'Time Series': {
            path: docsLinks.moduleReferenceTimeSeries,
        },
        Utils: {
            path: docsLinks.moduleReferenceUtils,
        },
        Visualizations: {
            path: docsLinks.moduleReferenceVisualizations,
        },
    },
    Dashboards: {
        root: {
            path: docsLinks.dashboards,
            section: 'Dashboards',
            title: 'Dashboards',
            filePath: 'dashboards/introToDashboards.mdx',
        },
    },
    Products: {
        root: {
            path: docsLinks.products,
            section: 'Products',
            title: 'Intro to products',
            filePath: 'products/introToProducts.mdx',
        },
        'Intro to products': {
            path: docsLinks.introToProducts,
            section: 'Products',
            title: 'Intro to products',
            filePath: 'products/introToProducts.mdx',
        },
        'Data Unions': {
            path: docsLinks.productsDataunions,
            section: 'Products',
            title: 'Data Unions',
            filePath: 'products/dataUnions.mdx',
        },
    },
    ...(includeDataUnions ? {
        'Data Unions': {
            root: {
                path: docsLinks.dataUnions,
                section: 'Data Unions',
                title: 'Intro to Data Unions',
                filePath: 'dataUnions/introToDataUnions.mdx',
            },
            'Intro to Data Unions': {
                path: docsLinks.introToDataUnions,
                section: 'Data Unions',
                title: 'Intro to products',
                filePath: 'dataUnions/introToDataUnions.mdx',
            },
            'Create a DU with Core': {
                path: docsLinks.dataUnionsInCore,
                section: 'Data Unions',
                title: 'Create a DU with Core',
                filePath: 'dataUnions/dataUnionsCore.mdx',
            },
            'Framework Roles': {
                path: docsLinks.frameworkRoles,
                section: 'Data Unions',
                title: 'Framework Roles',
                filePath: 'dataUnions/frameworkRoles.mdx',
            },
            'Auth & Identity': {
                path: docsLinks.authAndIdentity,
                section: 'Data Unions',
                title: 'Auth & Identity',
                filePath: 'dataUnions/authAndIdentity.mdx',
            },
            'Create & Monitor': {
                path: docsLinks.createAndMonitor,
                section: 'Data Unions',
                title: 'Create & Monitor',
                filePath: 'dataUnions/createAndMonitor.mdx',
            },
            'Join & Withdraw': {
                path: docsLinks.joinAndWithdraw,
                section: 'Data Unions',
                title: 'Join & Withdraw',
                filePath: 'dataUnions/joinAndWithdraw.mdx',
            },
            'UX Best Practices': {
                path: docsLinks.uxBestPractices,
                section: 'Data Unions',
                title: 'UX Best Practices',
                filePath: 'dataUnions/uxBestPractices.mdx',
            },
        },
    } : {}),
    Tutorials: {
        root: {
            path: docsLinks.tutorials,
            section: 'Tutorials',
            title: 'Simple pub/sub',
            filePath: 'tutorials/buildingPubSub.mdx',
        },
        'Simple pub/sub': {
            path: docsLinks.buildingPubSubTutorial,
            section: 'Tutorials',
            title: 'Simple pub/sub',
            filePath: 'tutorials/buildingPubSub.mdx',
        },
        'Custom modules': {
            path: docsLinks.customModuleTutorial,
            section: 'Tutorials',
            title: 'Custom modules',
            filePath: 'tutorials/buildingCustomModule.mdx',
        },
    },
    'DATA Token': {
        root: {
            path: docsLinks.dataToken,
            section: 'DATA Token',
            title: 'DATA Token',
            filePath: 'dataToken/dataToken.mdx',
        },
    },
    Core: {
        root: {
            path: docsLinks.core,
            section: 'Core',
            title: 'Intro to Core',
            filePath: 'core/introToCore.mdx',
        },
        'Intro to Core': {
            path: docsLinks.introToCore,
            section: 'Core',
            title: 'Intro to Core',
            filePath: 'core/introToCore.mdx',
        },
    },
    Marketplace: {
        root: {
            path: docsLinks.marketplace,
            section: 'Marketplace',
            title: 'Intro to the Marketplace',
            filePath: 'marketplace/introToMarketplace.mdx',
        },
        'Intro to the Marketplace': {
            path: docsLinks.introToMarketplace,
            section: 'Marketplace',
            title: 'Intro to the Marketplace',
            filePath: 'marketplace/introToMarketplace.mdx',
        },
        'Data Unions': {
            path: docsLinks.marketplaceDataunions,
            section: 'Marketplace',
            title: 'Data Unions',
            filePath: 'products/dataUnions.mdx',
        },
    },
    SDKs: {
        root: {
            path: docsLinks.sdk,
            section: 'SDKs',
            title: 'SDKs',
            filePath: 'sdk/overview.mdx',
        },
        'JavaScript SDK': {
            path: docsLinks.javascriptSdk,
            section: 'SDKs',
            title: 'JavaScript SDK',
            filePath: 'sdk/javascript.mdx',
        },
        'Java SDK': {
            path: docsLinks.javaSdk,
            section: 'SDKs',
            title: 'Java SDK',
            filePath: 'sdk/java.mdx',
        },
        'Python SDK': {
            path: docsLinks.pythonSdk,
            section: 'SDKs',
            title: 'Python SDK',
            filePath: 'sdk/python.mdx',
        },
    },
    API: {
        root: {
            path: docsLinks.api,
            section: 'API',
            title: 'API overview',
            filePath: 'api/overview.mdx',
        },
        'API overview': {
            path: docsLinks.apiOverview,
            section: 'API',
            title: 'API overview',
            filePath: 'api/overview.mdx',
        },
        Authentication: {
            path: docsLinks.authentication,
            section: 'API',
            title: 'Authentication',
            filePath: 'api/authentication.mdx',
        },
        'Streams via API': {
            path: docsLinks.apiStreamsViaApi,
            section: 'API',
            title: 'Work with streams via API',
            filePath: 'streams/usingStreamsViaApi.mdx',
        },
    },
    'API Explorer': {
        root: {
            path: docsLinks.apiExplorer,
            section: 'API Explorer',
            title: 'API Explorer',
            filePath: 'apiExplorer/apiExplorer.mdx',
        },
    },
    'Technical Notes': {
        root: {
            path: docsLinks.technicalNotes,
            section: 'Technical Notes',
            title: 'Technical Notes',
            filePath: 'technicalNotes/technicalNotes.mdx',
        },
    },
})

export default generateMap()
