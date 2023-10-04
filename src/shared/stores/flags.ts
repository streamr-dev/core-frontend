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
    isCreatingSponsorship: (wallet: string) => [wallet.toLowerCase()],
    isFundingSponsorship: (sponsorshipId: string, wallet: string) => [
        sponsorshipId,
        wallet.toLowerCase(),
    ],
    isJoiningSponsorshipAsOperator: (
        sponsorshipId: string,
        operatorId: string,
        streamId: string,
    ) => [sponsorshipId, operatorId, streamId],
    isEditingSponsorshipFunding: (sponsorshipId: string, operatorId: string) => [
        sponsorshipId,
        operatorId,
    ],
}

type Flag = typeof Flag

export function flagKey<K extends keyof typeof Flag>(
    key: K,
    ...params: Parameters<Flag[K]>
): string {
    const fn = Flag[key] as unknown as (...args: Parameters<Flag[K]>) => string

    return JSON.stringify([key, ...fn(...params)])
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

        async wrap(key, fn) {
            if (get().flags[key]) {
                throw new Error(`Already processing ${key}`)
            }

            set((store) =>
                produce(store, ({ flags }) => {
                    flags[key] = true
                }),
            )

            try {
                return await fn()
            } finally {
                set((store) =>
                    produce(store, ({ flags }) => {
                        delete flags[key]
                    }),
                )
            }
        },
    }
})

export function useIsFlagged(key: string | undefined) {
    const { flags } = useFlagStore()

    return typeof key === 'string' && !!flags[key]
}

export function useFlagger() {
    return useFlagStore().wrap
}
