import { produce } from 'immer'
import { useEffect } from 'react'
import { create } from 'zustand'
import { growingValuesGenerator } from '~/components/NetworkUtils'
import { getOperatorByOwnerAddress } from '~/getters'
import { OperatorParser, ParsedOperator } from '~/parsers/OperatorParser'
import { toBN, BN } from '~/utils/bn'

interface XY {
    x: number
    y: number
}

interface Fetchable<T = Record<string, never>> {
    fetching: boolean
    data: T
}

interface NetworkStatsData {
    totalStake: number
    numOfSponsorships: number
    numOfOperators: number
}

interface OperatorStatsData {
    value: BN
    numOfDelegators: number
    numOfSponsorships: number
}

type LoaderFunction = (options?: { signal?: AbortSignal }) => Promise<void>

type ChartDataLoaderFunction = (
    operatorId: string,
    options?: { signal?: AbortSignal },
) => Promise<void>

interface NetworkStore {
    networkStats: Fetchable<NetworkStatsData>
    operatorStats: Fetchable<OperatorStatsData>
    chartData: {
        operatorStake: Fetchable<XY[]>
        operatorEarnings: Fetchable<XY[]>
        delegationsValue: Fetchable<XY[]>
        delegationsEarnings: Fetchable<XY[]>
    }
    owner: string
    operator: ParsedOperator | null | undefined
    setOwner: (address: string) => void
    loadNetworkStats: LoaderFunction
    loadOperatorStats: LoaderFunction
    loadOperatorStakeData: ChartDataLoaderFunction
    loadOperatorEarningsData: ChartDataLoaderFunction
    loadDelegationsValueData: ChartDataLoaderFunction
    loadDelegationsEarningsData: ChartDataLoaderFunction
}

export const useNetworkStore = create<NetworkStore>((set, get) => {
    function setStore(updater: (draft: NetworkStore) => void) {
        set((store) => produce(store, updater))
    }

    function prepFetchable(
        getter: (draft: NetworkStore) => Fetchable<unknown>,
        { signal }: { signal?: AbortSignal } = {},
    ) {
        return {
            async perform(cb?: () => void | Promise<void>) {
                try {
                    setStore((draft) => {
                        getter(draft).fetching = true
                    })

                    await cb?.()
                } finally {
                    if (!signal?.aborted) {
                        setStore((draft) => {
                            getter(draft).fetching = false
                        })
                    }
                }
            },
        }
    }

    let ownerAbortController: AbortController | undefined

    let lastKnownOwner: undefined | string

    return {
        chartData: getEmptyChartData({ dummy: true }),

        networkStats: getEmptyNetworkStats(),

        operatorStats: getEmptyOperatorState(),

        owner: '',

        operator: undefined,

        setOwner(address) {
            const addr = address.toLowerCase()

            if (lastKnownOwner === addr || (!lastKnownOwner && !addr)) {
                return
            }

            lastKnownOwner = addr

            ownerAbortController?.abort()

            ownerAbortController = undefined

            setStore((draft) => {
                const dummy = !addr

                draft.chartData = getEmptyChartData({ dummy })

                draft.networkStats = getEmptyNetworkStats()

                draft.operator = undefined

                draft.operatorStats = getEmptyOperatorState()

                draft.owner = addr
            })

            if (!addr) {
                return
            }

            ownerAbortController = new AbortController()

            const signal = ownerAbortController.signal

            setTimeout(async () => {
                try {
                    await get().loadOperatorStats({ signal })
                } catch (e) {
                    console.warn('Failed to load operator stats', e)
                }
            })
        },

        async loadNetworkStats({ signal } = {}) {
            const fetchable = prepFetchable((store) => store.networkStats, {
                signal,
            })

            await fetchable.perform(async () => {
                /**
                 * @TODO Define the actual loading mechanism for netzwert stats.
                 */
                await new Promise((resolve) => void setTimeout(resolve, 5000))

                if (signal?.aborted) {
                    return
                }

                setStore(({ networkStats }) => {
                    networkStats.data = {
                        numOfOperators: 23,
                        numOfSponsorships: 32,
                        totalStake: 24000000,
                    }
                })
            })
        },

        async loadOperatorStats({ signal } = {}) {
            const { owner } = get()

            if (!owner) {
                return
            }

            const fetchable = prepFetchable((store) => store.operatorStats, {
                signal,
            })

            await fetchable.perform(async () => {
                const operator = await getOperatorByOwnerAddress(owner)

                if (signal?.aborted) {
                    return
                }

                const parsedOperator = operator ? OperatorParser.parse(operator) : null

                setStore((draft) => {
                    draft.operator = parsedOperator

                    if (!parsedOperator) {
                        return
                    }

                    const {
                        delegatorCount: numOfDelegators,
                        poolValue: value,
                        stakes,
                    } = parsedOperator

                    draft.operatorStats.data = {
                        numOfDelegators,
                        numOfSponsorships: stakes.length,
                        value,
                    }
                })
            })
        },

        async loadOperatorStakeData() {},

        async loadOperatorEarningsData() {},

        async loadDelegationsValueData() {},

        async loadDelegationsEarningsData() {},
    }
})

function getEmptyNetworkStats(): Fetchable<NetworkStatsData> {
    return {
        fetching: false,
        data: {
            totalStake: 0,
            numOfSponsorships: 0,
            numOfOperators: 0,
        },
    }
}

function getEmptyOperatorState(): Fetchable<OperatorStatsData> {
    return {
        fetching: true,
        data: {
            value: toBN(0),
            numOfDelegators: 0,
            numOfSponsorships: 0,
        },
    }
}

function getIncrementalValuesData(max: number, { days = 10 }): Fetchable<XY[]> {
    return {
        fetching: false,
        data: growingValuesGenerator(days, max).map(({ day: x, value: y }) => ({
            x,
            y,
        })),
    }
}

function getEmptyChartData({ dummy = false } = {}) {
    const days = dummy ? 10 : 0

    return {
        operatorStake: getIncrementalValuesData(24040218, { days }),
        operatorEarnings: getIncrementalValuesData(2000000, { days }),
        delegationsValue: getIncrementalValuesData(12300431, { days }),
        delegationsEarnings: getIncrementalValuesData(1400000, { days }),
    }
}

export function useLoadNetworkStatsEffect() {
    const { loadNetworkStats } = useNetworkStore()

    useEffect(() => {
        setTimeout(async () => {
            try {
                await loadNetworkStats()
            } catch (e) {
                console.warn('Failed to load network stats', e)
            }
        })
    }, [loadNetworkStats])
}
