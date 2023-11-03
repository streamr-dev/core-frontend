import { produce } from 'immer'
import { useCallback } from 'react'
import { create } from 'zustand'
import {
    GetMetadataDocument,
    GetMetadataQuery,
    GetMetadataQueryVariables,
} from '~/generated/gql/network'
import getGraphClient from '~/getters/getGraphClient'
import { sleep } from '~/utils'

interface Store {
    blockNumber: number | undefined
    dependencies: Record<string, number | undefined>
    setDependency: (blockNumber: number, key: unknown[] | string) => void
}

function getFinalKey(key: unknown[] | string) {
    return typeof key === 'string' ? key : JSON.stringify(key)
}

const useBlockNumberStore = create<Store>((set, get) => {
    void (async () => {
        let failureCount = 0

        let idleCount = 0

        let consecutiveChangeCount = 0

        const client = getGraphClient()

        let lastFlushAt = 0

        function clearDependencies(blockNumber: number) {
            set((store) =>
                produce(store, (draft) => {
                    const keys = Object.keys(draft.dependencies)

                    for (const key in keys) {
                        const awaitedBlockNumber = draft.dependencies[key]

                        if (
                            typeof awaitedBlockNumber === 'number' &&
                            awaitedBlockNumber > blockNumber
                        ) {
                            continue
                        }

                        delete draft.dependencies[key]
                    }
                }),
            )
        }

        while (1) {
            try {
                const {
                    data: { _meta: meta },
                } = await client.query<GetMetadataQuery, GetMetadataQueryVariables>({
                    query: GetMetadataDocument,
                    fetchPolicy: 'network-only',
                })

                const blockNumber = meta?.block.number

                if (blockNumber == null) {
                    throw new Error('Invalid block number')
                }

                failureCount = 0

                if (blockNumber === get().blockNumber) {
                    consecutiveChangeCount = 0

                    idleCount = Math.min(25, idleCount + 1)
                } else {
                    consecutiveChangeCount += 1

                    set({ blockNumber })
                }

                if (lastFlushAt < blockNumber - 10) {
                    lastFlushAt = blockNumber

                    clearDependencies(blockNumber)
                }

                if (consecutiveChangeCount === 3) {
                    /**
                     * After 3 different values in a row try a lower
                     * idleCount. We may not have to wait that long.
                     */
                    idleCount = Math.max(0, idleCount - 1)

                    consecutiveChangeCount = 0
                }

                /**
                 * We don't reset idleCount. The idea is to limit the
                 * number of request we make to what's reasonable.
                 */
                await sleep(500 + idleCount * 100)

                continue
            } catch (_) {
                failureCount = Math.min(40, failureCount + 1)

                await sleep(250 * failureCount)
            }
        }
    })()

    return {
        blockNumber: undefined,

        dependencies: {},

        setDependency(blockNumber, key) {
            set((store) =>
                produce(store, (draft) => {
                    draft.dependencies[getFinalKey(key)] = blockNumber
                }),
            )
        },
    }
})

export function useBlockNumber() {
    return useBlockNumberStore().blockNumber
}

export function useIsWaitingForBlock(key: unknown[] | string): boolean {
    const blockNumber = useBlockNumber()

    const awaitedBlockNumber = useBlockNumberStore().dependencies[getFinalKey(key)]

    return (
        typeof awaitedBlockNumber === 'undefined' ||
        (typeof blockNumber === 'number' && blockNumber > awaitedBlockNumber)
    )
}

export function useSetBlockDependency() {
    return useBlockNumberStore().setDependency
}
