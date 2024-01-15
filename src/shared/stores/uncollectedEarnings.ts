import { produce } from 'immer'
import { useCallback, useEffect } from 'react'
import { create } from 'zustand'
import { SponsorshipEarnings, getEarningsForSponsorships } from '~/services/sponsorships'
import { toBN } from '~/utils/bn'

interface Earnings {
    fetching: boolean
    values: Record<string, SponsorshipEarnings>
    lastUpdatedTimestamp: number | undefined
}

interface Store {
    earnings: Record<string, undefined | Earnings>
    fetch: (operatorId: string) => Promise<void>
    tick: () => void
}

export const useUncollectedEarningsStore = create<Store>((set, get) => {
    function updateEarnings(operatorId: string, fn: (draft: Earnings) => void) {
        set((store) =>
            produce(store, ({ earnings }) => {
                const draft = earnings[operatorId] || {
                    values: {},
                    fetching: false,
                    lastUpdatedTimestamp: undefined,
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
                    draft.lastUpdatedTimestamp = performance.now()
                })
            } finally {
                updateEarnings(operatorId, (draft) => {
                    draft.fetching = false
                })
            }
        },

        async tick() {
            set((store) =>
                produce(store, ({ earnings }) => {
                    const now = performance.now()

                    for (const draft of Object.values(earnings)) {
                        if (draft != null) {
                            for (const sponsorshipId of Object.keys(draft.values)) {
                                const sponsorship = draft.values[sponsorshipId]
                                const timeDiffSec =
                                    (now - (draft.lastUpdatedTimestamp ?? now)) / 1000
                                const ratePerSec = sponsorship?.rateOfChangePerSec

                                if (
                                    ratePerSec != null &&
                                    sponsorship.uncollectedEarnings != null
                                ) {
                                    draft.values[sponsorshipId].uncollectedEarnings =
                                        sponsorship.uncollectedEarnings.plus(
                                            ratePerSec.multipliedBy(timeDiffSec),
                                        )
                                    console.log(
                                        'Earnings added',
                                        draft.values[
                                            sponsorshipId
                                        ].uncollectedEarnings.toString(),
                                        timeDiffSec,
                                    )
                                }

                                draft.lastUpdatedTimestamp = now
                            }
                        }
                    }
                }),
            )
        },
    }
})

export function useUncollectedEarnings(
    operatorId: string | undefined,
    sponsorshipId: string,
) {
    const { earnings, fetch, tick } = useUncollectedEarningsStore()

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

    useEffect(() => {
        const timeoutId = setInterval(tick, 1000)
        return () => clearInterval(timeoutId)
    })

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

            return (
                earnings[operatorId]?.values[sponsorshipId].uncollectedEarnings || toBN(0)
            ).isGreaterThan(0)
        },
        [earnings],
    )
}
