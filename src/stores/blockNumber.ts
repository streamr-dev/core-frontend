import { produce } from 'immer'
import { create } from 'zustand'
import { blockObserver } from '~/utils/blocks'

interface Store {
    blockNumber: number | undefined
    dependencies: Record<string, number | undefined>
    setDependency: (blockNumber: number, key: unknown[] | string) => void
}

function getFinalKey(key: unknown[] | string) {
    return typeof key === 'string' ? key : JSON.stringify(key)
}

const useBlockNumberDependenciesStore = create<Store>((set) => {
    blockObserver.onAny((blockNumber) => {
        set({ blockNumber })
    })

    return {
        blockNumber: undefined,

        dependencies: {},

        setDependency(blockNumber, key) {
            const finalKey = getFinalKey(key)

            set((store) =>
                produce(store, (draft) => {
                    draft.dependencies[finalKey] = blockNumber
                }),
            )

            blockObserver.onSpecific(blockNumber, () => {
                set((store) =>
                    produce(store, (draft) => {
                        if (draft.dependencies[finalKey] !== blockNumber) {
                            /**
                             * Apparently the awaited block number for the given key has changed.
                             * Usually it's a result of… scheduling a wait for a newer block.
                             */
                            return
                        }

                        delete draft.dependencies[finalKey]
                    }),
                )
            })
        },
    }
})

export function useBlockNumber() {
    return useBlockNumberDependenciesStore().blockNumber
}

export function useIsWaitingForBlockNumber(key: unknown[] | string): boolean {
    const blockNumber = useBlockNumber()

    const awaitedBlockNumber =
        useBlockNumberDependenciesStore().dependencies[getFinalKey(key)]

    if (typeof awaitedBlockNumber === 'undefined') {
        return false
    }

    return typeof blockNumber === 'undefined' || blockNumber < awaitedBlockNumber
}

export function useSetBlockDependency() {
    return useBlockNumberDependenciesStore().setDependency
}
