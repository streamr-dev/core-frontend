import { produce } from 'immer'
import { create } from 'zustand'
import { fromDecimals } from '~/marketplace/utils/math'
import { getNativeTokenBalance } from '~/marketplace/utils/web3'
import { setOperatorNodeAddresses } from '~/services/operators'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { BN } from '~/utils/bn'
import { defaultChainConfig } from '~/getters/getChainConfig'
import { getEarningsForSponsorships } from '~/services/sponsorships'

interface OperatorStore {
    operator: ParsedOperator | null | undefined
    addedNodeAddresses: string[]
    removedNodeAddresses: string[]
    nodeBalances: Record<string, BN>
    uncollectedEarnings: Record<string, BN>
    isBusy: boolean
    computed: {
        get nodeAddresses(): OperatorNodeAddress[]
    }
    setOperator: (operator: ParsedOperator | null | undefined) => void
    addNodeAddress: (address: string) => void
    removeNodeAddress: (address: string) => void
    cancelAdd: (address: string) => void
    cancelRemove: (address: string) => void
    persistNodeAddresses: () => Promise<void>
    updateNodeBalances: () => Promise<void>
    updateUncollectedEarnings: () => Promise<void>
}

type OperatorNodeAddress = {
    address: string
    isAdded: boolean
    isRemoved: boolean
    balance: BN | undefined
}

const useOperatorStore = create<OperatorStore>((set, get) => {
    return {
        operator: undefined,
        addedNodeAddresses: [],
        removedNodeAddresses: [],
        nodeBalances: {},
        uncollectedEarnings: {},
        isBusy: false,
        computed: {
            get nodeAddresses() {
                const {
                    addedNodeAddresses,
                    removedNodeAddresses,
                    operator,
                    nodeBalances,
                } = get()
                const addresses = [
                    ...(operator?.nodes ?? [])
                        .filter((a) => !removedNodeAddresses.includes(a))
                        .map((a) => ({
                            address: a,
                            isAdded: false,
                            isRemoved: false,
                            balance: nodeBalances[a],
                        })),
                    ...addedNodeAddresses.map((a) => ({
                        address: a,
                        isAdded: true,
                        isRemoved: false,
                        balance: nodeBalances[a],
                    })),
                    ...removedNodeAddresses.map((a) => ({
                        address: a,
                        isAdded: false,
                        isRemoved: true,
                        balance: nodeBalances[a],
                    })),
                ].sort((a, b) => a.address.localeCompare(b.address))
                return addresses
            },
        },

        setOperator(operator: ParsedOperator | null | undefined) {
            set((current) =>
                produce(current, (next) => {
                    next.operator = operator

                    if (current.operator?.id != operator?.id) {
                        next.addedNodeAddresses = []
                        next.removedNodeAddresses = []
                    }
                }),
            )

            get().updateNodeBalances()
            get().updateUncollectedEarnings()
        },

        addNodeAddress(address: string) {
            set((current) =>
                produce(current, (next) => {
                    if (
                        !current.addedNodeAddresses.includes(address) &&
                        !current.operator?.nodes.includes(address)
                    ) {
                        next.addedNodeAddresses.push(address.toLowerCase())
                    }
                }),
            )
            get().updateNodeBalances()
        },

        removeNodeAddress(address: string) {
            set((current) =>
                produce(current, (next) => {
                    next.removedNodeAddresses.push(address.toLowerCase())
                }),
            )
            get().updateNodeBalances()
        },

        cancelAdd(address: string) {
            set((current) =>
                produce(current, (next) => {
                    next.addedNodeAddresses = current.addedNodeAddresses.filter(
                        (a) => a != address.toLowerCase(),
                    )
                }),
            )
        },

        cancelRemove(address: string) {
            set((current) =>
                produce(current, (next) => {
                    next.removedNodeAddresses = current.removedNodeAddresses.filter(
                        (a) => a != address.toLowerCase(),
                    )
                }),
            )
        },

        async persistNodeAddresses() {
            const { addedNodeAddresses, removedNodeAddresses, operator } = get()
            if (operator) {
                const addresses = [...operator.nodes, ...addedNodeAddresses].filter(
                    (a) => !removedNodeAddresses.includes(a),
                )

                set((current) =>
                    produce(current, (next) => {
                        next.isBusy = true
                    }),
                )

                try {
                    /**
                     * @TODO async called this way won't block. that ok? we can't assume this'll
                     * succeed, plus try…catch here is useless.
                     */
                    setOperatorNodeAddresses(operator.id, addresses)
                    set((current) =>
                        produce(current, (next) => {
                            next.removedNodeAddresses = []
                            next.addedNodeAddresses = []

                            // This is kinda hacky but waiting for The Graph to index
                            // our event and reloading operator is not optimal either.
                            // Just fake that we loaded new addresses from The Graph.
                            if (next.operator != null) {
                                next.operator.nodes = addresses
                            }
                        }),
                    )
                } finally {
                    set((current) =>
                        produce(current, (next) => {
                            next.isBusy = false
                        }),
                    )
                }
            }
        },

        async updateNodeBalances() {
            const chainId = defaultChainConfig.id
            const addresses = get().computed.nodeAddresses
            const balances = addresses.map(async (node) => ({
                address: node.address,
                balance: await getNativeTokenBalance(node.address, chainId),
            }))
            const result = await Promise.allSettled(balances)
            set((current) =>
                produce(current, (next) => {
                    next.nodeBalances = result.reduce((map, obj) => {
                        if (obj.status === 'fulfilled') {
                            // Native token should have 18 decimals in EVM
                            map[obj.value.address] = fromDecimals(obj.value.balance, 18)
                        }
                        return map
                    }, {})
                }),
            )
        },

        async updateUncollectedEarnings() {
            const operator = get().operator
            if (operator) {
                try {
                    const earnings = await getEarningsForSponsorships(operator.id)
                    set((current) =>
                        produce(current, (next) => {
                            next.uncollectedEarnings = earnings
                        }),
                    )
                } catch (e) {
                    console.error('Could not update earnings', e)
                }
            }
        },
    }
})

export { useOperatorStore }
