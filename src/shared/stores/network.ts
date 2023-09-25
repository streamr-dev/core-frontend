import { produce } from 'immer'
import moment from 'moment'
import { useEffect } from 'react'
import { create } from 'zustand'
import { growingValuesGenerator } from '~/components/NetworkUtils'
import { Operator } from '~/generated/gql/network'
import { getOperatorByOwnerAddress, getOperatorsByDelegation } from '~/getters'
import { OperatorParser, ParsedOperator } from '~/parsers/OperatorParser'
import { getSpotApy } from '~/utils/apy'
import { toBN, BN } from '~/utils/bn'
import { getDelegationAmountForAddress2 } from '~/utils/delegation'

interface SponsorshipManifest {
    streamId: string
    streamDescription: string
    apy: number
    payoutPerDay: string
    totalStake: string
    operators: number
    fundedUntil: string
    id: string
    active: boolean
    stakes: unknown[]
}

interface DelegationManifest {
    apy: number
    myShare: BN
    operatorId: string
    operatorsCut: number
    sponsorships: number
    totalStake: BN
}

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

interface DelegationStatsData {
    value: BN
    numOfOperators: number
    apyRange: [number, number]
}

type LoaderFunction = (options?: { signal?: AbortSignal }) => Promise<void>

interface NetworkStore {
    networkStats: Fetchable<NetworkStatsData>
    operatorStats: Fetchable<OperatorStatsData>
    delegationStats: Fetchable<DelegationStatsData>
    chartData: {
        operatorStake: Fetchable<XY[]>
        operatorEarnings: Fetchable<XY[]>
        delegationsValue: Fetchable<XY[]>
        delegationsEarnings: Fetchable<XY[]>
    }
    sponsorships: Fetchable<SponsorshipManifest[]>
    delegations: DelegationManifest[]
    owner: string
    operator: ParsedOperator | null | undefined
    setOwner: (address: string) => void
    loadNetworkStats: LoaderFunction
    loadOperatorStats: LoaderFunction
    loadDelegationsStats: LoaderFunction
    loadOperatorStakeData: LoaderFunction
    loadOperatorEarningsData: LoaderFunction
    loadDelegationsValueData: LoaderFunction
    loadDelegationsEarningsData: LoaderFunction
    loadSponsorships: LoaderFunction
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

        delegations: getEmptyDelegations({ dummy: true }),

        delegationStats: getEmptyDelegationStats(),

        networkStats: getEmptyNetworkStats(),

        operatorStats: getEmptyOperatorState(),

        sponsorships: getEmptySponsorships({ dummy: true }),

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

                draft.delegations = getEmptyDelegations({ dummy })

                draft.delegationStats = getEmptyDelegationStats()

                draft.networkStats = getEmptyNetworkStats()

                draft.operator = undefined

                draft.operatorStats = getEmptyOperatorState()

                draft.owner = addr

                draft.sponsorships = getEmptySponsorships({ dummy })
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

            setTimeout(async () => {
                try {
                    await get().loadDelegationsStats({ signal })
                } catch (e) {
                    console.warn('Failed to load delegations stats', e)
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

        async loadDelegationsStats({ signal } = {}) {
            const { owner: delegator } = get()

            if (!delegator) {
                return
            }

            const fetchable = prepFetchable((store) => store.delegationStats, {
                signal,
            })

            await fetchable.perform(async () => {
                const operators = await getOperatorsByDelegation({ address: delegator })

                if (signal?.aborted) {
                    return
                }

                const delegations = operators.map<DelegationManifest>((operator) => {
                    const {
                        delegators,
                        id: operatorId,
                        operatorsCut,
                        poolValue: totalStake,
                        stakes,
                    } = OperatorParser.parse(operator)

                    return {
                        apy: getSpotApy(totalStake, stakes),
                        myShare: getDelegationAmountForAddress2(delegator, delegators),
                        operatorId,
                        operatorsCut,
                        sponsorships: stakes.length,
                        totalStake,
                    }
                })

                const apyRange = { min: 1, max: 0 }

                delegations.forEach(({ apy }) => {
                    Object.assign(apyRange, {
                        max: Math.max(apyRange.max, apy),
                        min: Math.min(apyRange.min, apy),
                    })
                })

                if (apyRange.min > apyRange.max) {
                    Object.assign(apyRange, {
                        max: 0,
                        min: 0,
                    })
                }

                const value = delegations.reduce(
                    (sum, { myShare }) => sum.plus(myShare),
                    toBN(0),
                )

                setStore((draft) => {
                    draft.delegationStats.data = {
                        apyRange: [apyRange.min, apyRange.max],
                        numOfOperators: delegations.length,
                        value,
                    }

                    draft.delegations = delegations
                })
            })
        },

        async loadOperatorStakeData() {},

        async loadOperatorEarningsData() {},

        async loadDelegationsValueData() {},

        async loadDelegationsEarningsData() {},

        async loadSponsorships() {},
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

function getEmptyDelegationStats(): Fetchable<DelegationStatsData> {
    return {
        fetching: false,
        data: {
            value: toBN(0),
            numOfOperators: 0,
            apyRange: [0, 0],
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

function getEmptySponsorships({ dummy = false } = {}): Fetchable<SponsorshipManifest[]> {
    const data = dummy
        ? [
              {
                  streamId: 'jollygood.eth/my/funded/stream',
                  streamDescription: 'Price, volume data feed for the DATAUSD',
                  apy: 24.6,
                  payoutPerDay: '1200',
                  totalStake: '1500000',
                  operators: 54,
                  fundedUntil: moment().add(1, 'month').format('DD-mm-YYYY'),
                  id: '45c5027a-ce52-49e2-9787-7f5599ce85cf',
                  active: true,
                  stakes: [],
              },
              {
                  streamId: 'HSL/helsinki/trams',
                  streamDescription: 'Real-time location of Helsinki trams',
                  apy: 14.5,
                  payoutPerDay: '4347',
                  totalStake: '2300000',
                  operators: 10,
                  fundedUntil: moment().add(50, 'days').format('DD-mm-YYYY'),
                  id: 'add2771e-111d-451a-ae50-6fb93f5da616',
                  active: false,
                  stakes: [],
              },
          ]
        : []

    return {
        fetching: false,
        data,
    }
}

function getEmptyDelegations({ dummy = false } = {}): DelegationManifest[] {
    return dummy
        ? [
              '0x12e567661643698e7C86D3684e391D2C38950C0c',
              '0xc94E24B76DF0cF39af431c8569Ee2D45a032d680',
              '0xD59eC6CBFBe2Ee9C9c75ED7732d58d0FBeb99c1c',
              '0x304B171463A828577a39155923bbDb09c227C588',
              '0x91993A3dDD95e8b84E49B42ca1B0BA222B78477E',
              '0xAe755C61Ca8707Ca01f3EdC634C4dA5B8DA5127D',
              '0x86BBe0a84c68b2607C0830DFcDC11B7F9C880bEd',
              '0x4178812b528f88bf0B2e73EB6ba4f0C8c4cd186c',
              '0x93A717001d29cA011449C6CA1e5042c285c12f37',
          ].map((operatorId) => ({
              operatorId,
              apy: Math.round(40 * Math.random()),
              myShare: toBN(Math.round(3500000 * Math.random())),
              operatorsCut: Math.round(30 * Math.random()),
              sponsorships: Math.round(25 * Math.random()),
              totalStake: toBN(Math.round(15000000 * Math.random())),
          }))
        : []
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
