import queryString from 'query-string'

export class RouteOptions {
    constructor(readonly searchParams: Record<string, any>, readonly hash: string) {}

    static from(
        searchParams:
            | Record<string, any>
            | ((searchParams: Record<string, any>) => Record<string, any>) = {},
        hash = '',
    ) {
        if (typeof searchParams === 'function') {
            return new RouteOptions(
                searchParams(queryString.parse(window.location.search)),
                hash,
            )
        }

        return new RouteOptions(searchParams, hash)
    }

    toString() {
        return ((qs, hash = '') => `${qs && `?${qs}`}${hash && `#${hash}`}`)(
            queryString.stringify(this.searchParams),
            this.hash,
        )
    }
}

type Def<T> = T extends string
    ? (options?: RouteOptions) => string
    : T extends (...args: infer P) => string
    ? (...args: [...P, ...[options?: RouteOptions]]) => string
    : never

function def<T>(fn: T) {
    return ((...args: any) => {
        const lastArg = args[args.length - 1]

        const [options, subargs] =
            lastArg instanceof RouteOptions
                ? [lastArg, args.slice(0, -1)]
                : [RouteOptions.from(), args]

        const path =
            typeof fn === 'string' ? fn : (fn as (...args: any) => string)(...subargs)

        return `${path}${options.toString()}`
    }) as Def<T>
}

/**
 * @todo simplify (use `def` inside `route`, not here.)
 */
const definitions = {
    root: def('/'),
    hub: def('/hub'),
    tos: () => 'https://s3.amazonaws.com/streamr-public/streamr-terms-of-use.pdf',
    privacyPolicy: () =>
        'https://s3.amazonaws.com/streamr-public/streamr-privacy-policy.pdf',
    giveFeedback: () => 'https://github.com/streamr-dev/streamr-platform/issues',
    publisherTerms: () =>
        'https://s3.amazonaws.com/streamr-public/streamr-data-provider-agreement.pdf',
    resetAllowanceInfo: () =>
        'https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729',
    allowanceInfo: () => 'https://tokenallowance.io',
    error: def('/error'),
    network: def('/hub/network'),
    networkExplorer: () => 'https://streamr.network/network-explorer',
    docs: (pathname?: string) => `https://docs.streamr.network${pathname ?? '/'}`,
    streams: def(`/hub/streams`),
    stream: def((id: string) => `/hub/streams/${encodeURIComponent(id)}`),
    'stream.overview': def(
        (id: string) => `/hub/streams/${encodeURIComponent(id)}/overview`,
    ),
    'stream.connect': def(
        (id: string) => `/hub/streams/${encodeURIComponent(id)}/connect`,
    ),
    'stream.liveData': def(
        (id: string) => `/hub/streams/${encodeURIComponent(id)}/live-data`,
    ),
    projects: def('/hub/projects'),
    project: def((id: string) => `/hub/projects/${encodeURIComponent(id)}`),
    'project.overview': def(
        (id: string) => `/hub/projects/${encodeURIComponent(id)}/overview`,
    ),
    'project.connect': def(
        (id: string) => `/hub/projects/${encodeURIComponent(id)}/connect`,
    ),
    'project.liveData': def(
        (id: string) => `/hub/projects/${encodeURIComponent(id)}/live-data`,
    ),
    'project.edit': def((id: string) => `/hub/projects/${encodeURIComponent(id)}/edit`),
    networkOverview: def('/hub/network/overview'),
    operators: def('/hub/network/operators'),
    operator: def((id: string) => `/hub/network/operators/${encodeURIComponent(id)}`),
    sponsorships: def('/hub/network/sponsorships'),
    sponsorship: def(
        (id: string) => `/hub/network/sponsorships/${encodeURIComponent(id)}`,
    ),
    createOperator: def('/hub/network/operators/new'),
    'contact.general': () => 'mailto:contact@streamr.com',
    'contact.jobs': () => 'mailto:jobs@streamr.com',
    'contact.labs': () => 'mailto:labs@streamr.com',
    'contact.media': () => 'mailto:media@streamr.com',
    'site.about': def('/about'),
    'site.design': def('/design'),
    'site.dataToken': def('/discover/data-token'),
    'site.marketplace': def('/discover/marketplace'),
    'site.network': def('/discover/network'),
    'site.dataUnions': def('/discover/data-unions'),
    'site.papers': def('/papers'),
    'site.ecosystem': def('/ecosystem'),
    'site.tokenMigration': def('/token-migration'),
    'site.roadmap': def('/roadmap'),
    'site.fund': def('/fund'),
    blog: () => 'https://blog.streamr.network/',
} as const satisfies Record<string, (...args: any) => string>

type Definitions = typeof definitions

type RouteKey = keyof Definitions

type RouteParameters<T> = T extends (...args: any) => any ? Parameters<T> : never[]

export function route<T extends RouteKey>(
    key: T,
    ...args: RouteParameters<Definitions[T]>
) {
    const fn = definitions[key]

    if (typeof fn === 'string') {
        return fn
    }

    return (fn as (...args: RouteParameters<Definitions[T]>) => string)(...args)
}
