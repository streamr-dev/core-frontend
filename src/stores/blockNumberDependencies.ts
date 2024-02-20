import { produce } from 'immer'
import { create } from 'zustand'
import { useCurrentChainId } from '~/shared/stores/chain'
import { onIndexedBlock } from '~/utils/blocks'

interface Store {
    dependencies: Record<string, number | undefined>
    setDependency: (chainId: number, blockNumber: number, key: unknown[]) => void
}

function getFinalKey(chainId: number, key: unknown[]) {
    return JSON.stringify([chainId, ...key])
}

const useBlockNumberDependenciesStore = create<Store>((set) => {
    return {
        dependencies: {},

        setDependency(chainId, blockNumber, key) {
            const finalKey = getFinalKey(chainId, key)

            set((store) =>
                produce(store, (draft) => {
                    draft.dependencies[finalKey] = blockNumber
                }),
            )

            onIndexedBlock(chainId, blockNumber, () => {
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

export function useIsWaitingForBlockNumber(key: unknown[]): boolean {
    const chainId = useCurrentChainId()

    const {
        dependencies: { [getFinalKey(chainId, key)]: awaitedBlockNumber },
    } = useBlockNumberDependenciesStore()

    return awaitedBlockNumber != null
}

export function useSetBlockDependency() {
    return useBlockNumberDependenciesStore().setDependency
}
