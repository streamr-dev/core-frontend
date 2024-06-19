import queryString from 'query-string'

interface RouteOptions {
    search?: Record<'chain', string> & Record<string, any>
    hash?: string
}

function withSuffix<P extends string>(pathname: P, options: RouteOptions = {}) {
    return ((qs = '', hash = '') => `${pathname}${qs && `?${qs}`}${hash && `#${hash}`}`)(
        options.search && queryString.stringify(options.search),
        options.hash,
    ) as `${P}[?search][#hash]`
}

export const Route = {
    allowanceInfo() {
        return 'https://tokenallowance.io' as const
    },
    blog() {
        return 'https://blog.streamr.network/' as const
    },
    contactGeneral() {
        return 'mailto:contact@streamr.com' as const
    },
    contactJobs() {
        return 'mailto:jobs@streamr.com' as const
    },
    contactLabs() {
        return 'mailto:labs@streamr.com' as const
    },
    contactMedia() {
        return 'mailto:media@streamr.com' as const
    },
    createOperator(options?: RouteOptions) {
        return withSuffix('/hub/network/operators/new', options)
    },
    docs<T extends string = '/'>(pathname?: T) {
        return `https://docs.streamr.network${(pathname ?? '/') as T}` as const
    },
    error(options?: RouteOptions) {
        return withSuffix('/error', options)
    },
    giveFeedback() {
        return 'https://github.com/streamr-dev/streamr-platform/issues' as const
    },
    hub(options?: RouteOptions) {
        return withSuffix('/hub', options)
    },
    network(options?: RouteOptions) {
        return withSuffix('/hub/network', options)
    },
    networkExplorer() {
        return 'https://streamr.network/network-explorer' as const
    },
    networkOverview(options?: RouteOptions) {
        return withSuffix('/hub/network/overview', options)
    },
    operator(id: string, options?: RouteOptions) {
        return withSuffix(
            `/hub/network/operators/${encodeURIComponent(id) as ':id'}`,
            options,
        )
    },
    operators(options?: RouteOptions) {
        return withSuffix('/hub/network/operators', options)
    },
    privacyPolicy() {
        return 'https://s3.amazonaws.com/streamr-public/streamr-privacy-policy.pdf' as const
    },
    project(id: string, options?: RouteOptions) {
        return withSuffix(`/hub/projects/${encodeURIComponent(id) as ':id'}`, options)
    },
    projectConnect(id: string, options?: RouteOptions) {
        return withSuffix(
            `/hub/projects/${encodeURIComponent(id) as ':id'}/connect`,
            options,
        )
    },
    projectEdit(id: string, options?: RouteOptions) {
        return withSuffix(
            `/hub/projects/${encodeURIComponent(id) as ':id'}/edit`,
            options,
        )
    },
    projectLiveData(id: string, options?: RouteOptions) {
        return withSuffix(
            `/hub/projects/${encodeURIComponent(id) as ':id'}/live-data`,
            options,
        )
    },
    projectOverview(id: string, options?: RouteOptions) {
        return withSuffix(
            `/hub/projects/${encodeURIComponent(id) as ':id'}/overview`,
            options,
        )
    },
    projects(options?: RouteOptions) {
        return withSuffix('/hub/projects', options)
    },
    publisherTerms() {
        return 'https://s3.amazonaws.com/streamr-public/streamr-data-provider-agreement.pdf' as const
    },
    resetAllowanceInfo() {
        return 'https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729' as const
    },
    root() {
        return '/' as const
    },
    siteAbout() {
        return '/about'
    },
    siteDataToken() {
        return '/discover/data-token' as const
    },
    siteDataUnions() {
        return '/discover/data-unions' as const
    },
    siteDesign() {
        return '/design' as const
    },
    siteEcosystem() {
        return '/ecosystem' as const
    },
    siteFund() {
        return '/fund' as const
    },
    siteMarketplace() {
        return '/discover/marketplace' as const
    },
    siteNetwork() {
        return '/discover/network' as const
    },
    sitePapers() {
        return '/papers' as const
    },
    siteRoadmap() {
        return '/roadmap' as const
    },
    siteTokenMigration() {
        return '/token-migration' as const
    },
    stream(id: string, options?: RouteOptions) {
        return withSuffix(`/hub/streams/${encodeURIComponent(id) as ':id'}`, options)
    },
    streamConnect(id: string, options?: RouteOptions) {
        return withSuffix(
            `/hub/streams/${encodeURIComponent(id) as ':id'}/connect`,
            options,
        )
    },
    streamLiveData(id: string, options?: RouteOptions) {
        return withSuffix(
            `/hub/streams/${encodeURIComponent(id) as ':id'}/live-data`,
            options,
        )
    },
    streamOverview(id: string, options?: RouteOptions) {
        return withSuffix(
            `/hub/streams/${encodeURIComponent(id) as ':id'}/overview`,
            options,
        )
    },
    streams(options?: RouteOptions) {
        return withSuffix(`/hub/streams`, options)
    },
    sponsorship(id: string, options?: RouteOptions) {
        return withSuffix(
            `/hub/network/sponsorships/${encodeURIComponent(id) as ':id'}`,
            options,
        )
    },
    sponsorships(options?: RouteOptions) {
        return withSuffix('/hub/network/sponsorships', options)
    },
    tos() {
        return 'https://s3.amazonaws.com/streamr-public/streamr-terms-of-use.pdf' as const
    },
}
