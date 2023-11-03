import {
    GetMetadataDocument,
    GetMetadataQuery,
    GetMetadataQueryVariables,
} from '~/generated/gql/network'
import getGraphClient from '~/getters/getGraphClient'
import { sleep } from '~/utils'

export const blocks = (() => {
    let lastKnownBlockNumber = -1

    let listeners: Record<number, (() => void)[]> = {}

    function trigger() {
        const blockNumbers = Object.keys(listeners).map(Number)

        const lastKnown = lastKnownBlockNumber

        for (const blockNumber of blockNumbers) {
            if (blockNumber > lastKnown) {
                continue
            }

            const fns = listeners[blockNumber] || []

            delete listeners[blockNumber]

            for (const fn of fns) {
                setTimeout(fn)
            }
        }
    }

    void (async () => {
        let failureCount = 0

        let idleCount = 0

        let consecutiveChangeCount = 0

        const client = getGraphClient()

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

                if (blockNumber === lastKnownBlockNumber) {
                    consecutiveChangeCount = 0

                    idleCount = Math.min(25, idleCount + 1)
                } else {
                    consecutiveChangeCount += 1

                    lastKnownBlockNumber = blockNumber

                    trigger()
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

    return (blockNumber: number, fn: () => void) => {
        if (blockNumber <= lastKnownBlockNumber) {
            return void fn()
        }

        void (listeners[blockNumber] || (listeners[blockNumber] = [])).push(fn)
    }
})()
