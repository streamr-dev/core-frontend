// @flow

const { formatExternalUrl } = require('$shared/utils/url')
const routes = require('$routes').default

const streamrRoot = process.env.STREAMR_URL || ''

export default {
    streamrSite: streamrRoot,
    login: formatExternalUrl(streamrRoot, 'login/auth'),
    signup: formatExternalUrl(streamrRoot, 'register/signup'),
    whitepaper: formatExternalUrl(streamrRoot, 'whitepaper'),
    logout: formatExternalUrl(streamrRoot, 'logout'),
    site: {
        network: formatExternalUrl(streamrRoot, 'learn/network'),
    },
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
        products2: '/marketplace/products2',
        createProduct: '/marketplace/products/create',
        createProductPreview: '/marketplace/products/preview',
    },
    userpages: {
        main: '/core',
        canvases: '/core/canvases',
        dashboards: '/core/dashboards',
        streams: '/core/streams',
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
        trello: routes.community.trello(),
        telegram: routes.community.telegram(),
        reddit: routes.community.reddit(),
        twitter: routes.community.twitter(),
        linkedin: routes.community.linkedin(),
        youtube: routes.community.youtube(),
        medium: routes.community.medium(),
        github: routes.community.github(),
        devForum: routes.community.devForum(),
    },
    external: {
        ethereum: 'https://www.ethereum.org',
        decentralizedWeb: 'https://blockchainhub.net/web3-decentralized-web/',
    },
}
