const definitions = {
    'streams.index': '/streams/',
    'streams.show': (streamId: string) => `/streams/${streamId}`,
} satisfies Record<string, string | ((...args: any[]) => string)>

type RouteKey = keyof typeof definitions

type RouteParams<T extends RouteKey, D = (typeof definitions)[T]> = D extends (
    ...args: infer P
) => string
    ? P
    : never[]

export function route<T extends RouteKey, P extends RouteParams<T>>(key: T, ...args: P) {
    const fn = definitions[key]

    if (typeof fn === 'string') {
        return fn
    }

    return (fn as (...args: P) => string)(...args)
}
