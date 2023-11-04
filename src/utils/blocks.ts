import EventEmitter from 'events'
import {
    GetMetadataDocument,
    GetMetadataQuery,
    GetMetadataQueryVariables,
} from '~/generated/gql/network'
import getGraphClient from '~/getters/getGraphClient'
import { sleep } from '~/utils'

let lastKnownBlockNumber = -1

const pending: Record<number, true> = {}

const emitter = new EventEmitter()

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

                emitter.emit('block', blockNumber)

                Object.keys(pending).forEach((key) => {
                    if (Number(key) > blockNumber) {
                        return
                    }

                    delete pending[key]

                    emitter.emit(`block:${key}`)
                })
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

export const blockObserver = Object.freeze({
    onAny(fn: (blockNumber: number) => void, { once = false } = {}) {
        if (once) {
            emitter.once('block', fn)
        } else {
            emitter.on('block', fn)
        }

        return () => void emitter.off('block', fn)
    },

    onSpecific(blockNumber: number, fn: () => void) {
        pending[blockNumber] = true

        emitter.once(`block:${blockNumber}`, fn)

        return () => void emitter.off(`block:${blockNumber}`, fn)
    },
})
