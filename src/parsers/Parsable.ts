export class Parsable<P extends Record<string, unknown> = Record<string, never>> {
    private cache = {} as P

    private preparsed = {} as P

    constructor(protected readonly raw: unknown, protected readonly chainId: number) {
        this.preparsed = this.preparse()
    }

    protected preparse(): P {
        throw new Error('Not implemented')
    }

    getValue<K extends keyof P, R = P[K]>(key: K, parser?: (value: P[K]) => R) {
        const cachedValue = this.cache[key] as R

        if (key in this.cache) {
            return cachedValue
        }

        const value = parser ? parser(this.preparsed[key]) : (this.preparsed[key] as R)

        ;(this.cache as Record<typeof key, R>)[key] = value

        return value
    }
}
