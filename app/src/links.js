// @flow

import { formatExternalUrl } from '$shared/utils/url'

const streamrRoot = process.env.STREAMR_URL || ''

module.exports = {
    streamrSite: streamrRoot,
    login: formatExternalUrl(streamrRoot, 'login/auth'),
    signup: formatExternalUrl(streamrRoot, 'register/signup'),
    whitepaper: formatExternalUrl(streamrRoot, 'whitepaper'),
    logout: formatExternalUrl(streamrRoot, 'logout'),
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
    root: '/',
    internalLogin: '/login',
    marketplace: {
        main: '/marketplace',
        products: '/marketplace/products',
        createProduct: '/marketplace/products/create',
        createProductPreview: '/marketplace/products/preview',
    },
    docs: {
        main: '/docs',
        introduction: '/docs/introduction',
        tutorials: '/docs/tutorials',
        visualEditor: '/docs/visual-editor',
        streamrEngine: '/docs/streamr-engine',
        dataMarketplace: '/docs/data-marketplace',
        api: '/docs/streamr-api',
    },
    userpages: {
        main: '/u',
        canvases: '/u/canvases',
        dashboards: '/u/dashboards',
        streams: '/u/streams',
        streamCreate: '/u/stream/show',
        streamShow: '/u/stream/show',
        streamPreview: 'u/stream/preview',
        profile: '/u/profile/edit',
        products: '/u/products',
        purchases: '/u/purchases',
        transactions: '/u/transactions',
        settings: '/u/settings',
    },
    editor: {
        canvasEditor: '/canvas/editor',
        dashboardEditor: '/dashboard/editor',
    },
    community: {
        trello: 'https://trello.com/b/j24hxvjg/streamr-milestone-1',
        telegram: 'https://t.me/streamrdata',
        reddit: 'https://reddit.com/r/streamr',
        twitter: 'https://twitter.com/streamr',
        linkedin: 'https://www.linkedin.com/company/streamr-ltd-/',
        youtube: 'https://www.youtube.com/channel/UCGWEA61RueG-9DV53s-ZyJQ',
        medium: 'https://medium.com/streamrblog',
        github: 'https://github.com/streamr-dev',
    },
    contact: {
        general: 'mailto:contact@streamr.com',
        media: 'mailto:media@streamr.com',
        jobs: 'mailto:jobs@streamr.com',
        labs: 'mailto:labs@streamr.com',
    },
}
