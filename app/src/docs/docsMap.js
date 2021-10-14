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
        'DATA tokenomics': {
            path: docsLinks.tokenomics,
            section: 'Learn',
            title: 'DATA tokenomics',
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
        'Creating data products': {
            path: docsLinks.creatingDataProducts,
            section: 'Marketplace',
            title: 'Creating data products',
            filePath: 'marketplace/creatingDataProducts.mdx',
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
        'Creating a Data Union': {
            path: docsLinks.creatingADataUnion,
            section: 'Data Unions',
            title: 'Creating a Data Union',
            filePath: 'dataUnions/creatingADataUnion.mdx',
        },
        'Roles & responsibilities': {
            path: docsLinks.rolesAndResponsibilities,
            section: 'Data Unions',
            title: 'Roles & responsibilities',
            filePath: 'dataUnions/rolesAndResponsibilities.mdx',
        },
        'Wallet management': {
            path: docsLinks.walletManagement,
            section: 'Data Unions',
            title: 'Wallet management',
            filePath: 'dataUnions/walletManagement.mdx',
        },
        'Joining and parting members': {
            path: docsLinks.joiningAndPartingMembers,
            section: 'Data Unions',
            title: 'Joining and parting members',
            filePath: 'dataUnions/joiningAndPartingMembers.mdx',
        },
        'Withdrawing earnings': {
            path: docsLinks.withdrawingEarnings,
            section: 'Data Unions',
            title: 'Withdrawing earnings',
            filePath: 'dataUnions/withdrawingEarnings.mdx',
        },
        'UX best practices': {
            path: docsLinks.uxBestPractices,
            section: 'Data Unions',
            title: 'UX best practices',
            filePath: 'dataUnions/uxBestPractices.mdx',
        },
    },
})

export default generateMap()
