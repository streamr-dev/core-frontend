import { produce } from 'immer'
import { useCallback, useEffect } from 'react'
import { create } from 'zustand'
import { Minute } from '~/consts'
import { SponsorshipEarnings, getEarningsForSponsorships } from '~/services/sponsorships'
import { toBigInt } from '~/utils/bn'
import { useCurrentChainId } from '~/utils/chains'

interface Earnings {
    fetching: boolean
    values: Partial<Record<string, SponsorshipEarnings>>
    lastUpdatedTimestamp: number | undefined
    lastSyncTimestamp: number | undefined
}

interface Store {
    earnings: Partial<Record<string, Earnings>>
    fetch(chainId: number, operatorId: string): Promise<void>
    tick(chainId: number, operatorId: string): Promise<void>
}

const FULL_SYNC_INTERVAL_MS = 3 * Minute

export const useUncollectedEarningsStore = create<Store>((set, get) => {
    function updateEarnings(operatorId: string, fn: (draft: Earnings) => void) {
        set((store) =>
            produce(store, ({ earnings }) => {
                const draft = earnings[operatorId] || {
                    values: {},
                    fetching: false,
                    lastUpdatedTimestamp: undefined,
                    lastSyncTimestamp: undefined,
                }

                earnings[operatorId] = produce(draft, fn)
            }),
        )
    }

    return {
        earnings: {},

        async fetch(chainId, operatorId) {
            const { fetching = false } = get().earnings[operatorId] || {}

            if (fetching) {
                return
            }

            updateEarnings(operatorId, (draft) => {
                draft.fetching = true
            })

            try {
                const values = await getEarningsForSponsorships(chainId, operatorId)

                updateEarnings(operatorId, (draft) => {
                    draft.values = values
                    draft.lastUpdatedTimestamp = performance.now()
                    draft.lastSyncTimestamp = performance.now()
                })
            } finally {
                updateEarnings(operatorId, (draft) => {
                    draft.fetching = false
                })
            }
        },

        async tick(chainId, operatorId) {
            const now = performance.now()

            const { earnings, fetch } = get()

            const operatorEarnings = earnings[operatorId]

            if (operatorEarnings != null) {
                const { lastSyncTimestamp } = operatorEarnings
                // Every once in a while we need to sync with blockchain state to get
                // correct earnings rate. It may have changed because of other operators
                // staking and unstaking.
                if (
                    lastSyncTimestamp != null &&
                    now - lastSyncTimestamp > FULL_SYNC_INTERVAL_MS
                ) {
                    await fetch(chainId, operatorId)
                }
            }

            set((store) =>
                produce(store, ({ earnings }) => {
                    const draft = earnings[operatorId]

                    if (draft != null) {
                        const elapsedInSeconds = toBigInt(
                            (now - (draft.lastUpdatedTimestamp ?? now)) / 1000,
                        )

                        for (const sponsorshipId of Object.keys(draft.values)) {
                            const sponsorshipEarnings = draft.values[sponsorshipId]

                            if (!sponsorshipEarnings) {
                                continue
                            }

                            sponsorshipEarnings.uncollectedEarnings =
                                sponsorshipEarnings.uncollectedEarnings +
                                sponsorshipEarnings.changePerSecond * elapsedInSeconds
                        }

                        draft.lastUpdatedTimestamp = now
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

    const chainId = useCurrentChainId()

    useEffect(() => {
        /**
         * @todo Let's use `useQuery` instead.
         */

        void (async () => {
            if (!operatorId) {
                return
            }

            try {
                await fetch(chainId, operatorId)
            } catch (e) {
                console.error(`Could not update earnings for "${operatorId}"`, e)
            }
        })()
    }, [operatorId, fetch, chainId])

    useEffect(() => {
        const timeoutId = setInterval(tick, 1000, chainId, operatorId)

        return () => {
            clearInterval(timeoutId)
        }
    }, [chainId, operatorId, tick])

    if (!operatorId) {
        return null
    }

    // Show spinner when fetching AND we don't have changePerSecond ready.
    // Otherwise just keep the earnings updating and let the full sync catch up.
    if (
        earnings[operatorId]?.fetching &&
        earnings[operatorId]?.values[sponsorshipId]?.changePerSecond == null
    ) {
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
                (earnings[operatorId]?.values[sponsorshipId]?.uncollectedEarnings || 0n) >
                0n
            )
        },
        [earnings],
    )
}
