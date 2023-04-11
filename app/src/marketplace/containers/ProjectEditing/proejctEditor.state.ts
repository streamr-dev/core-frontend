import {create} from "zustand"
import {PersistOperation} from "$shared/types/common-types"

type Actions = {
    addPersistOperation: (operation: PersistOperation) => void,
    updatePersistOperation: (id: string, operation: Partial<PersistOperation>) => void,
    hasPersistOperations: () => boolean,
    clearPersistOperations: () => void,
}

type State = {
    persistOperations: PersistOperation[],
}

const initialState: State = {
    persistOperations: []
}

export const useProjectEditorStore = create<State & Actions>()((set, get) => ({
    ...initialState,
    hasPersistOperations: () => (get().persistOperations.length > 0),
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
    clearPersistOperations: () => {
        set({ persistOperations: [] })
    },
}))
