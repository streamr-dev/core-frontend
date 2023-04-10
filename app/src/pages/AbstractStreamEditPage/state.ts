import { create } from 'zustand'
import StreamrClient from 'streamr-client'
import getTransactionalClient from '$app/src/getters/getTransactionalClient'

type Actions = {
    loadStreamStorageNodes: (streamId: string, client: StreamrClient) => Promise<string[]>,
    addStorageNode: (address: string) => void,
    removeStorageNode: (address: string) => void,
    calculateStorageNodeOperations:  () => Promise<void>,
    persistStorageNodes: (streamId: string) => Promise<void>,
    addPersistOperation: (operation: PersistOperation) => void,
    updatePersistOperation: (id: string, operation: Partial<PersistOperation>) => void,
    hasPersistOperations: () => boolean,
    clearPersistOperations: () => void,
    reset: () => void,
}

type PersistOperation = {
    id: string,
    name: string,
    type: 'stream' | 'storage' | 'permissions',
    state: 'notstarted' | 'inprogress' | 'complete' | 'error',
    data?: {
        address?: string,
        type?: 'add' | 'remove',
    },
}

type State = {
    storageNodes: string[], // this is the UI state
    streamStorageNodes: string[], // this is the stored state on Stream object
    streamSaveNeeded: boolean,
    permissionSaveNeeded: boolean,
    persistOperations: PersistOperation[],
    hasStorageNodeChanges: boolean,
}

const initialState: State = {
    storageNodes: [],
    streamStorageNodes: [],
    streamSaveNeeded: false,
    permissionSaveNeeded: false,
    persistOperations: [],
    hasStorageNodeChanges: false,
}

const areArraysEqual = (arr1: Array<string>, arr2: Array<string>) => {
    const set1 = new Set(arr1)
    const set2 = new Set(arr2)
    return arr1.every((item) => set2.has(item)) &&
        arr2.every((item) => set1.has(item))
}

export const useStreamEditorStore = create<State & Actions>()((set, get) => ({
    ...initialState,
    loadStreamStorageNodes: async (streamId, client) => {
        if (streamId && client) {
            const storageNodes = (await client.getStorageNodes(streamId)).map((a) => a.toLowerCase())
            set({ streamStorageNodes: storageNodes })
            return storageNodes
        }
        return []
    },
    addStorageNode: (address) => {
        if (get().storageNodes.includes(address.toLowerCase())) {
            return
        }
        set((state) => ({
            storageNodes: [...state.storageNodes, address.toLowerCase()],
        }))
        set({
            hasStorageNodeChanges: !areArraysEqual(get().streamStorageNodes, get().storageNodes),
        })
    },
    removeStorageNode: (address) => {
        set((state) => ({
            storageNodes: state.storageNodes.filter((node) => node !== address.toLowerCase()),
        }))
        set({
            hasStorageNodeChanges: !areArraysEqual(get().streamStorageNodes, get().storageNodes),
        })
    },
    calculateStorageNodeOperations: async () => {
        const currentNodes = get().streamStorageNodes
        const newNodes = get().storageNodes
        const addPersistOperation = get().addPersistOperation

        const toRemove = currentNodes.filter((n) => !newNodes.includes(n))
        const toAdd = newNodes.filter((n) => !currentNodes.includes(n))

        const ops = [
            ...toRemove.map(
                (addr) =>
                    ({
                        id: addr,
                        name: `Remove storage node ${addr}`,
                        state: 'notstarted',
                        type: 'storage',
                        data: { address: addr, type: 'remove' },
                    } as PersistOperation),
            ),
            ...toAdd.map(
                (addr) =>
                    ({
                        id: addr,
                        name: `Add storage node ${addr}`,
                        state: 'notstarted',
                        type: 'storage',
                        data: { address: addr, type: 'add' },
                    } as PersistOperation),
            ),
        ]
        for (let i = 0; i < ops.length; i++) {
            const op = ops[i]
            addPersistOperation(op)
        }
    },
    persistStorageNodes: async (streamId) => {
        const client = await getTransactionalClient()
        const updatePersistOperation = get().updatePersistOperation
        const ops = get().persistOperations.filter((op) => op.type === 'storage')

        for (let i = 0; i < ops.length; i++) {
            const operation = ops[i]

            updatePersistOperation(operation.id, { state: 'inprogress' })
            try {
                if (operation.data && operation.data.type === 'remove') {
                    await client.removeStreamFromStorageNode(streamId, operation.data.address)
                } else if (operation.data && operation.data.type === 'add') {
                    await client.addStreamToStorageNode(streamId, operation.data.address)
                }
                updatePersistOperation(operation.id, { state: 'complete' })
            } catch (e) {
                updatePersistOperation(operation.id, { state: 'error' })
                throw e
            }
        }
    },
    addPersistOperation: (operation) => {
        set((prev) => ({ persistOperations: [
            ...prev.persistOperations,
            operation,
        ]}))
    },
    updatePersistOperation: (id, operation) => {
        set((prev) => {
            const persistOperations = [...prev.persistOperations]
            const idx = persistOperations.findIndex((op) => op.id === id)
            if (idx >= 0) {
                persistOperations[idx] = {
                    ...persistOperations[idx],
                    ...operation,
                }
            }
            return { persistOperations }
        })
    },
    hasPersistOperations: () => {
        return get().persistOperations.length > 0
    },
    clearPersistOperations: () => {
        set({ persistOperations: [] })
    },
    reset: () => set(initialState),
}))
