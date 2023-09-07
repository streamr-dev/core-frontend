import { produce } from 'immer'
import { create } from 'zustand'

interface OperatorStore {
    addedNodeAddresses: string[]
    removedNodeAddresses: string[]
    addNodeAddress: (address: string) => void
    removeNodeAddress: (address: string) => void
    isNodeAddressAdded: (address: string) => boolean
    isNodeAddressRemoved: (address: string) => boolean
}

const useOperatorStore = create<OperatorStore>((set, get) => {
    function addNodeAddress(address: string) {
        set((current) =>
            produce(current, (next) => {
                next.addedNodeAddresses.push(address)
            }),
        )
    }

    function removeNodeAddress(address: string) {
        set((current) =>
            produce(current, (next) => {
                next.removedNodeAddresses.push(address)
            }),
        )
    }

    function isNodeAddressAdded(address: string) {
        return get().addedNodeAddresses.includes(address)
    }

    function isNodeAddressRemoved(address: string) {
        return get().addedNodeAddresses.includes(address)
    }

    return {
        addedNodeAddresses: [],
        removedNodeAddresses: [],
        addNodeAddress,
        removeNodeAddress,
        isNodeAddressAdded,
        isNodeAddressRemoved,
    }
})

export { useOperatorStore }
