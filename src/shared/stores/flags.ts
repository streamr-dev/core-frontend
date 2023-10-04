import { produce } from 'immer'
import { create } from 'zustand'

const Flag = {
    isDelegatingFunds: (operatorId: string, wallet = '') => [
        operatorId,
        wallet.toLowerCase(),
    ],
    isUndelegatingFunds: (operatorId: string, wallet = '') => [
        operatorId,
        wallet.toLowerCase(),
    ],
}

type Flag = typeof Flag

type FlagKey = keyof Flag

export function flag<K extends FlagKey>(key: K, ...params: Parameters<Flag[K]>): string {
    return JSON.stringify([key, ...Flag[key].apply(null, params as any)])
}

type WrapFunction = <F extends () => any = () => void>(
    flag: string,
    fn: F,
) => Promise<Awaited<ReturnType<F>>>

const useFlagStore = create<{
    flags: Record<string, true | undefined>
    wrap: WrapFunction
}>((set, get) => {
    return {
        flags: {},

        async wrap(flag, fn) {
            if (get().flags[flag]) {
                throw new Error(`Already processing ${flag}`)
            }

            set((store) =>
                produce(store, ({ flags }) => {
                    flags[flag] = true
                }),
            )

            try {
                return await fn()
            } finally {
                set((store) =>
                    produce(store, ({ flags }) => {
                        delete flags[flag]
                    }),
                )
            }
        },
    }
})

export function useIsFlagged(flag: string | undefined) {
    const { flags } = useFlagStore()

    return typeof flag === 'string' && !!flags[flag]
}

export function useFlagger() {
    return useFlagStore().wrap
}
