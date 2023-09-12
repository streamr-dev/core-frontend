import { produce } from 'immer'
import { create } from 'zustand'
import { setOperatorNodeAddresses } from '~/services/operators'
import { OperatorElement } from '~/types/operator'
import { BN } from '~/utils/bn'

interface OperatorStore {
    operator: OperatorElement | null | undefined
    addedNodeAddresses: string[]
    removedNodeAddresses: string[]
    computed: {
        get nodeAddresses(): OperatorNodeAddress[]
    }
    setOperator: (operator: OperatorElement | null | undefined) => void
    addNodeAddress: (address: string) => void
    removeNodeAddress: (address: string) => void
    persistNodeAddresses: () => Promise<void>
}

type OperatorNodeAddress = {
    address: string
    isAdded: boolean
    isRemoved: boolean
    balance: BN
}

const useOperatorStore = create<OperatorStore>((set, get) => {
    return {
        operator: undefined,
        addedNodeAddresses: [],
        removedNodeAddresses: [],
        computed: {
            get nodeAddresses() {
                const { addedNodeAddresses, removedNodeAddresses, operator } = get()
                const addresses = [
                    ...(operator?.nodes ?? [])
                        .filter((a) => !removedNodeAddresses.includes(a))
                        .map((a) => ({
                            address: a,
                            isAdded: false,
                            isRemoved: false,
                            balance: BN(0),
                        })),
                    ...addedNodeAddresses.map((a) => ({
                        address: a,
                        isAdded: true,
                        isRemoved: false,
                        balance: BN(0),
                    })),
                    ...removedNodeAddresses.map((a) => ({
                        address: a,
                        isAdded: false,
                        isRemoved: true,
                        balance: BN(0),
                    })),
                ]
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
        },

        addNodeAddress(address: string) {
            set((current) =>
                produce(current, (next) => {
                    next.addedNodeAddresses.push(address)
                }),
            )
        },

        removeNodeAddress(address: string) {
            set((current) =>
                produce(current, (next) => {
                    next.removedNodeAddresses.push(address)
                }),
            )
        },

        async persistNodeAddresses() {
            const { addedNodeAddresses, removedNodeAddresses, operator } = get()
            if (operator) {
                const addresses = [...operator.nodes, ...addedNodeAddresses].filter(
                    (a) => !removedNodeAddresses.includes(a),
                )
                console.log('original', operator.nodes)
                console.log('added', addedNodeAddresses)
                console.log('removed', removedNodeAddresses)
                console.log('result', addresses)
                await setOperatorNodeAddresses(operator.id, addresses)
                set((current) =>
                    produce(current, (next) => {
                        next.removedNodeAddresses = []
                        next.addedNodeAddresses = []
                    }),
                )
            }
        },
    }
})

export { useOperatorStore }
