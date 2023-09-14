import { produce } from 'immer'
import { create } from 'zustand'
import { setOperatorNodeAddresses } from '~/services/operators'
import { OperatorElement } from '~/types/operator'
import { BN } from '~/utils/bn'
import { toastedOperation } from '~/utils/toastedOperation'

interface OperatorStore {
    operator: OperatorElement | null | undefined
    addedNodeAddresses: string[]
    removedNodeAddresses: string[]
    nodeBalances: Record<string, BN>
    isBusy: boolean
    computed: {
        get nodeAddresses(): OperatorNodeAddress[]
    }
    setOperator: (operator: OperatorElement | null | undefined) => void
    addNodeAddress: (address: string) => void
    removeNodeAddress: (address: string) => void
    cancelAdd: (address: string) => void
    cancelRemove: (address: string) => void
    persistNodeAddresses: () => Promise<void>
    updateNodeBalances: () => Promise<void>
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

        setOperator(operator: OperatorElement | null | undefined) {
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
                    await toastedOperation('Save node addresses', () =>
                        setOperatorNodeAddresses(operator.id, addresses),
                    )
                    set((current) =>
                        produce(current, (next) => {
                            next.removedNodeAddresses = []
                            next.addedNodeAddresses = []
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
            console.log('TODO: update node balances')
        },
    }
})

export { useOperatorStore }
