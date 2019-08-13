// @flow

const { formatExternalUrl } = require('$shared/utils/url')
const routes = require('$routes').default

const streamrRoot = process.env.STREAMR_URL || ''

module.exports = {
    streamrSite: streamrRoot,
    login: formatExternalUrl(streamrRoot, 'login/auth'),
    signup: formatExternalUrl(streamrRoot, 'register/signup'),
    whitepaper: formatExternalUrl(streamrRoot, 'whitepaper'),
    logout: formatExternalUrl(streamrRoot, 'logout'),
    site: {
        network: formatExternalUrl(streamrRoot, 'learn/network'),
    },
    faq: 'https://www.streamr.com/faq',
    aboutUs: 'https://www.streamr.com/about',
    howItWorks: 'https://www.streamr.com#howItWorks',
    streamrSystem: 'https://www.streamr.com#streamrSystem',
    tryTheEditor: 'https://www.streamr.com#tryTheEditor',
    contributionSummary: 'https://s3.amazonaws.com/streamr-public/Crowdcontribution+Information+Summary+(20170912).pdf',
    publisherTerms: 'https://s3.amazonaws.com/streamr-public/streamr-data-provider-agreement.pdf',
    allowanceInfo: 'https://tokenallowance.io',
    resetAllowanceInfo: 'https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729',
    // ---->
    blog: 'https://medium.com/streamrblog',
    blogPosts: {
        nodered: 'https://medium.com/streamrblog/streamr-node-red-integration-tutorial-b0b410496354', // referred to from docs
        spark: 'https://medium.com/streamrblog/integrating-streamr-with-apache-spark-4c049f2688a1', // referred to from docs
    },
    root: '/',
    internalLogin: '/login',
    marketplace: {
        main: '/marketplace',
        products: '/marketplace/products',
        createProduct: '/marketplace/products/create',
        createProductPreview: '/marketplace/products/preview',
    },
    docs: {
        api: routes.docsApi(),
        canvases: routes.docsCanvases(),
        canvasModules: routes.docsCanvasModules(),
        core: routes.docsCore(),
        dashboards: routes.docsDashboards(),
        dataToken: routes.docsDataToken(),
        gettingStarted: routes.docsGettingStarted(),
        introduction: routes.docsIntroduction(),
        main: routes.docs(),
        marketplace: routes.docsMarketplace(),
        products: routes.docsProducts(),
        // runningNode: routes.docsRunningNode(),
        SDKs: routes.docsSDKs(),
        streams: routes.docsStreams(),
        technicalNotes: routes.docsTechnicalNotes(),
        tutorials: routes.docsTutorials(),
    },
    userpages: {
        main: '/core',
        canvases: '/core/canvases',
        dashboards: '/core/dashboards',
        streams: '/core/streams',
        streamCreate: '/core/stream/show',
        streamShow: '/core/stream/show',
        streamPreview: '/core/stream/preview',
        profile: '/core/profile/edit',
        products: '/core/products',
        purchases: '/core/purchases',
        transactions: '/core/transactions',
        settings: '/core/settings',
    },
    editor: {
        canvasEditor: routes.canvasEditor(),
        canvasEmbed: routes.canvasEmbed(),
        dashboardEditor: routes.dashboardEditor(),
    },
    community: {
        trello: routes.communityTrello(),
        telegram: routes.communityTelegram(),
        reddit: routes.communityReddit(),
        twitter: routes.communityTwitter(),
        linkedin: routes.communityLinkedin(),
        youtube: routes.communityYoutube(),
        medium: routes.communityMedium(),
        github: routes.communityGithub(),
        devForum: 'https://forum.streamr.dev/',
    },
    contact: {
        general: 'mailto:contact@streamr.com',
        media: 'mailto:media@streamr.com',
        jobs: 'mailto:jobs@streamr.com',
        labs: 'mailto:labs@streamr.com',
    },
    external: {
        ethereum: 'https://www.ethereum.org',
        decentralizedWeb: 'https://blockchainhub.net/web3-decentralized-web/',
    },
}
