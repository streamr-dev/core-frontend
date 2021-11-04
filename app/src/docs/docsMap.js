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
        overview: {
            path: docsLinks.overview,
            section: 'Learn',
            title: 'Overview',
            filePath: 'learn/overview.mdx',
        },
        identity: {
            path: docsLinks.identity,
            section: 'Learn',
            title: 'Identity',
            filePath: 'learn/identity.mdx',
        },
        useCases: {
            path: docsLinks.useCases,
            section: 'Learn',
            title: 'Use cases',
            filePath: 'learn/useCases.mdx',
        },
        tokenomics: {
            path: docsLinks.tokenomics,
            section: 'Learn',
            title: 'DATA tokenomics',
            filePath: 'learn/tokenomics.mdx',
        },
        networkExplorer: {
            path: docsLinks.networkExplorer,
            section: 'Learn',
            title: 'Network Explorer',
            filePath: 'learn/networkExplorer.mdx',
        },
        glossary: {
            path: docsLinks.glossary,
            section: 'Learn',
            title: 'Glossary',
            filePath: 'learn/glossary.mdx',
        },
        howToContribute: {
            path: docsLinks.howToContribute,
            section: 'Learn',
            title: 'How to contribute',
            filePath: 'learn/howToContribute.mdx',
        },
    },
    'Streamr Network': {
        root: {
            path: docsLinks.streamrNetwork,
            section: 'Streamr Network',
            title: 'Intro to the Streamr Network',
            filePath: 'streamrNetwork/introToStreamrNetwork.mdx',
        },
        introToStreamrNetwork: {
            path: docsLinks.introToStreamrNetwork,
            section: 'Streamr Network',
            title: 'Intro to the Streamr Network',
            filePath: 'streamrNetwork/introToStreamrNetwork.mdx',
        },
        usingALightNode: {
            path: docsLinks.usingALightNode,
            section: 'Streamr Network',
            title: 'Using a light node',
            filePath: 'streamrNetwork/usingALightNode.mdx',
        },
        installingABrokerNode: {
            path: docsLinks.installingABrokerNode,
            section: 'Streamr Network',
            title: 'Installing a Broker node',
            filePath: 'streamrNetwork/installingABrokerNode.mdx',
        },
        updatingABrokerNode: {
            path: docsLinks.updatingABrokerNode,
            section: 'Streamr Network',
            title: 'Updating a Broker node',
            filePath: 'streamrNetwork/updatingABrokerNode.mdx',
        },
        connectingApplications: {
            path: docsLinks.connectingApplications,
            section: 'Streamr Network',
            title: 'Connecting applications',
            filePath: 'streamrNetwork/connectingApplications.mdx',
        },
        mining: {
            path: docsLinks.mining,
            section: 'Streamr Network',
            title: 'Mining',
            filePath: 'streamrNetwork/mining.mdx',
        },
    },
    Streams: {
        root: {
            path: docsLinks.streams,
            section: 'Streams',
            title: 'Intro to streams',
            filePath: 'streams/introToStreams.mdx',
        },
        introToStreams: {
            path: docsLinks.introToStreams,
            section: 'Streams',
            title: 'Intro to streams',
            filePath: 'streams/introToStreams.mdx',
        },
        creatingStreams: {
            path: docsLinks.creatingStreams,
            section: 'Streams',
            title: 'Creating streams',
            filePath: 'streams/creatingStreams.mdx',
        },
        managingYourStreams: {
            path: docsLinks.managingYourStreams,
            section: 'Streams',
            title: 'Managing your streams',
            filePath: 'streams/managingYourStreams.mdx',
        },
        publishAndSubscribe: {
            path: docsLinks.publishAndSubscribe,
            section: 'Streams',
            title: 'Publish and subscribe',
            filePath: 'streams/publishAndSubscribe.mdx',
        },
        accessControl: {
            path: docsLinks.accessControl,
            section: 'Streams',
            title: 'Access control',
            filePath: 'streams/accessControl.mdx',
        },
        storage: {
            path: docsLinks.storage,
            section: 'Streams',
            title: 'Storage',
            filePath: 'streams/storage.mdx',
        },
        dataSigningAndVerification: {
            path: docsLinks.dataSigningAndVerification,
            section: 'Streams',
            title: 'Data signing & verification',
            filePath: 'streams/dataSigningAndVerification.mdx',
        },
        endToEndEncryption: {
            path: docsLinks.endToEndEncryption,
            section: 'Streams',
            title: 'End-to-end encryption',
            filePath: 'streams/endToEndEncryption.mdx',
        },
        partitioning: {
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
        introToMarketplace: {
            path: docsLinks.introToMarketplace,
            section: 'Marketplace',
            title: 'Intro to the Marketplace',
            filePath: 'marketplace/introToMarketplace.mdx',
        },
        creatingDataProducts: {
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
        introToDataUnions: {
            path: docsLinks.introToDataUnions,
            section: 'Data Unions',
            title: 'Intro to Data Unions',
            filePath: 'dataUnions/introToDataUnions.mdx',
        },
        creatingADataUnion: {
            path: docsLinks.creatingADataUnion,
            section: 'Data Unions',
            title: 'Creating a Data Union',
            filePath: 'dataUnions/creatingADataUnion.mdx',
        },
        rolesAndResponsibilities: {
            path: docsLinks.rolesAndResponsibilities,
            section: 'Data Unions',
            title: 'Roles & responsibilities',
            filePath: 'dataUnions/rolesAndResponsibilities.mdx',
        },
        walletManagement: {
            path: docsLinks.walletManagement,
            section: 'Data Unions',
            title: 'Wallet management',
            filePath: 'dataUnions/walletManagement.mdx',
        },
        joiningAndPartingMembers: {
            path: docsLinks.joiningAndPartingMembers,
            section: 'Data Unions',
            title: 'Joining and parting members',
            filePath: 'dataUnions/joiningAndPartingMembers.mdx',
        },
        withdrawingEarnings: {
            path: docsLinks.withdrawingEarnings,
            section: 'Data Unions',
            title: 'Withdrawing earnings',
            filePath: 'dataUnions/withdrawingEarnings.mdx',
        },
        uxBestPractices: {
            path: docsLinks.uxBestPractices,
            section: 'Data Unions',
            title: 'UX best practices',
            filePath: 'dataUnions/uxBestPractices.mdx',
        },
    },
})

export default generateMap()
