import docsLinks from '../docsLinks'

// docsMap is used by the Docs UI Navigation and the Search Indexer script.
// All sections must contain a 'root' entry.

// [Section title] {   <-- Rendered navigation section title.
//     [Page Title] : {    <-- Rendered navigation page title.
//          [path]: Relative URL path,
//          [section]: Section title    <-- Property for the indexer
//          [title]: Page title     <-- Property for the indexer
//          [filePath]: Relative MDX file path     <-- Property for the indexer
//      }
// }

export const generateMap = () => ({
    Welcome: {
        root: {
            path: docsLinks.welcome,
            section: 'Welcome',
            title: 'Welcome',
            filePath: 'welcome/welcome.mdx',
        },
    },
    Learn: {
        root: {
            path: docsLinks.learn,
            section: 'Learn',
            title: 'Overview',
            filePath: 'learn/overview.mdx',
        },
        Overview: {
            path: docsLinks.overview,
            section: 'Learn',
            title: 'Overview',
            filePath: 'learn/overview.mdx',
        },
        Identity: {
            path: docsLinks.identity,
            section: 'Learn',
            title: 'Identity',
            filePath: 'learn/identity.mdx',
        },
        'Use cases': {
            path: docsLinks.useCases,
            section: 'Learn',
            title: 'Use cases',
            filePath: 'learn/useCases.mdx',
        },
        Tokenomics: {
            path: docsLinks.tokenomics,
            section: 'Learn',
            title: 'Tokenomics',
            filePath: 'learn/tokenomics.mdx',
        },
        'Network Explorer': {
            path: docsLinks.networkExplorer,
            section: 'Learn',
            title: 'Network Explorer',
            filePath: 'learn/networkExplorer.mdx',
        },
        Glossary: {
            path: docsLinks.glossary,
            section: 'Learn',
            title: 'Glossary',
            filePath: 'learn/glossary.mdx',
        },
        'How to contribute': {
            path: docsLinks.howToContribute,
            section: 'Learn',
            title: 'How to contribute',
            filePath: 'learn/howToContribute.mdx',
        },
    },
    'Streamr nodes': {
        root: {
            path: docsLinks.streamrNodes,
            section: 'Streamr nodes',
            title: 'Intro to Streamr nodes',
            filePath: 'streamrNodes/introToStreamrNodes.mdx',
        },
        'Intro to Streamr nodes': {
            path: docsLinks.introToStreamrNodes,
            section: 'Streamr nodes',
            title: 'Intro to Streamr nodes',
            filePath: 'streamrNodes/introToStreamrNodes.mdx',
        },
        'Using a light node': {
            path: docsLinks.usingALightNode,
            section: 'Streamr nodes',
            title: 'Using a light node',
            filePath: 'streamrNodes/usingALightNode.mdx',
        },
        'Installing a Broker node': {
            path: docsLinks.installingABrokerNode,
            section: 'Streamr nodes',
            title: 'Installing a Broker node',
            filePath: 'streamrNodes/installingABrokerNode.mdx',
        },
        'Updating a Broker node': {
            path: docsLinks.updatingABrokerNode,
            section: 'Streamr nodes',
            title: 'Updating a Broker node',
            filePath: 'streamrNodes/updatingABrokerNode.mdx',
        },
        'Connecting applications': {
            path: docsLinks.connectingApplications,
            section: 'Streamr nodes',
            title: 'Connecting applications',
            filePath: 'streamrNodes/connectingApplications.mdx',
        },
        Mining: {
            path: docsLinks.mining,
            section: 'Streamr nodes',
            title: 'Mining',
            filePath: 'streamrNodes/mining.mdx',
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
        'Creating streams': {
            path: docsLinks.creatingStreams,
            section: 'Streams',
            title: 'Creating streams',
            filePath: 'streams/creatingStreams.mdx',
        },
        'Managing your streams': {
            path: docsLinks.managingYourStreams,
            section: 'Streams',
            title: 'Managing your streams',
            filePath: 'streams/managingYourStreams.mdx',
        },
        'Publish and subscribe': {
            path: docsLinks.publishAndSubscribe,
            section: 'Streams',
            title: 'Publish and subscribe',
            filePath: 'streams/publishAndSubscribe.mdx',
        },
        'Access control': {
            path: docsLinks.accessControl,
            section: 'Streams',
            title: 'Access control',
            filePath: 'streams/accessControl.mdx',
        },
        Storage: {
            path: docsLinks.storage,
            section: 'Streams',
            title: 'Storage',
            filePath: 'streams/storage.mdx',
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
    },
    'Data Products': {
        root: {
            path: docsLinks.products,
            section: 'Data Products',
            title: 'Create a Product',
            filePath: 'products/createDataProduct.mdx',
        },
        'Create a Product': {
            path: docsLinks.createProduct,
            section: 'Data Products',
            title: 'Create a Product',
            filePath: 'products/createDataProduct.mdx',
        },
    },
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
            title: 'Intro to Data Unions',
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
        'Sharing resources in Core': {
            path: docsLinks.sharingResourcesInCore,
            section: 'Core',
            title: 'Sharing resources in Core',
            filePath: 'core/sharingResourcesInCore.mdx',
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
    },
    SDKs: {
        root: {
            path: docsLinks.sdk,
            section: 'SDKs',
            title: 'SDKs',
            filePath: 'sdk/overview.mdx',
        },
        Overview: {
            path: docsLinks.sdkOverview,
            section: 'SDKs',
            title: 'Overview',
            filePath: 'sdk/overview.mdx',
        },
        JavaScript: {
            path: docsLinks.javascriptSdk,
            section: 'SDKs',
            title: 'JavaScript',
            filePath: 'sdk/javascript.mdx',
        },
        Java: {
            path: docsLinks.javaSdk,
            section: 'SDKs',
            title: 'Java',
            filePath: 'sdk/java.mdx',
        },
        Python: {
            path: docsLinks.pythonSdk,
            section: 'SDKs',
            title: 'Python',
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
