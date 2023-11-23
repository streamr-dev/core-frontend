import { produce } from 'immer'
import { useCallback, useEffect } from 'react'
import { create } from 'zustand'
import { getEarningsForSponsorships } from '~/services/sponsorships'
import { BN, toBN } from '~/utils/bn'

interface Earnings {
    fetching: boolean
    values: Record<string, BN | undefined>
}

interface Store {
    earnings: Record<string, undefined | Earnings>
    fetch: (operatorId: string) => Promise<void>
}

export const useUncollectedEarningsStore = create<Store>((set, get) => {
    function updateEarnings(operatorId: string, fn: (draft: Earnings) => void) {
        set((store) =>
            produce(store, ({ earnings }) => {
                const draft = earnings[operatorId] || {
                    values: {},
                    fetching: false,
                }

                earnings[operatorId] = produce(draft, fn)
            }),
        )
    }

    return {
        earnings: {},

        async fetch(operatorId) {
            const { fetching = false } = get().earnings[operatorId] || {}

            if (fetching) {
                return
            }

            updateEarnings(operatorId, (draft) => {
                draft.fetching = true
            })

            try {
                const values = await getEarningsForSponsorships(operatorId)

                updateEarnings(operatorId, (draft) => {
                    draft.values = values
                })
            } finally {
                updateEarnings(operatorId, (draft) => {
                    draft.fetching = false
                })
            }
        },
    }
})

export function useUncollectedEarnings(
    operatorId: string | undefined,
    sponsorshipId: string,
) {
    const { earnings, fetch } = useUncollectedEarningsStore()

    useEffect(() => {
        void (async () => {
            if (!operatorId) {
                return
            }

            try {
                await fetch(operatorId)
            } catch (e) {
                console.error(`Could not update earnings for "${operatorId}"`, e)
            }
        })()
    }, [operatorId, fetch])

    if (!operatorId) {
        return null
    }

    if (earnings[operatorId]?.fetching) {
        return undefined
    }

    return earnings[operatorId]?.values[sponsorshipId] || null
}

export function useCanCollectEarningsCallback() {
    const { earnings } = useUncollectedEarningsStore()

    return useCallback(
        (operatorId: string, sponsorshipId: string) => {
            if (earnings[operatorId]?.fetching) {
                return false
            }

            return (earnings[operatorId]?.values[sponsorshipId] || toBN(0)).isGreaterThan(
                0,
            )
        },
        [earnings],
    )
}
