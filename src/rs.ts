const definitions = {
    streams: '/hub/streams',
    stream: ({ id }: { id: string }) => `/hub/streams/${id}`,
    'stream.overview': ({ id }: { id: string }) => `/hub/streams/${id}/overview`,
    'stream.connect': ({ id }: { id: string }) => `/hub/streams/${id}/connect`,
    'stream.liveData': ({ id }: { id: string }) => `/hub/streams/${id}/live-data`,
} as const satisfies Record<string, string | ((params: any, ...args: any) => string)>

type Definitions = typeof definitions

type RouteKey = keyof Definitions

type Params<K extends RouteKey, D = Definitions[K]> = D extends (
    params: infer R,
    ...args: any
) => any
    ? R
    : never

type SearchParams<K extends RouteKey, D = Definitions[K]> = D extends (
    params: any,
    searchParams: infer R,
) => any
    ? R extends Record<string, any>
        ? [searchParams: R & Record<string, any>]
        : [searchParams?: Record<string, any>]
    : never

export const route = <K extends RouteKey>(
    key: K,
    params: Params<K>,
    ...args: SearchParams<K>
) => {
    const fn = definitions[key]

    const [searchParams] = args

    if (typeof fn === 'string') {
        return fn
    }

    return (fn as (params: any, searchParams: any) => string)(params, searchParams)
}

route('stream', { id: 'das' }, { chain: 123 })

function rr(id0: string, id1: string, { chain }: { chainId }) {}
