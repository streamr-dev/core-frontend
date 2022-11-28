import { useCallback, useEffect, useRef } from 'react'
import { useClient } from 'streamr-client-react'
import type { Stream } from 'streamr-client'
import getClientAddress from '$app/src/getters/getClientAddress'
import useInterrupt from '$shared/hooks/useInterrupt'

type FetchCallbackType = (search: string, { batchSize = 1, allowPublic = false }) => Promise<[Stream[], boolean, boolean]>

export default function useFetchStreams(): FetchCallbackType {
    const client = useClient()
    const itp = useInterrupt()
    const searchRef = useRef<string>()
    const allowPublicRef = useRef<boolean>()
    const iteratorRef = useRef<AsyncIterable<Stream>>()
    const tailStreamRef = useRef<Stream>()

    useEffect(() => {
        itp().interruptAll()
    }, [itp, client])

    return useCallback<FetchCallbackType>(
        async (search: string, { batchSize = 1, allowPublic = false } = {}) => {
            const { requireUninterrupted } = itp(search)

            if (searchRef.current !== search || allowPublicRef.current !== allowPublic) {
                searchRef.current = search
                allowPublicRef.current = allowPublic
                iteratorRef.current = undefined
            }

            if (typeof iteratorRef.current === 'undefined') {
                const user = await getClientAddress(client, {
                    suppressFailures: true,
                })
                requireUninterrupted()
                tailStreamRef.current = undefined
                iteratorRef.current = client.searchStreams(search, {
                    user,
                    allowPublic,
                })
            }

            let i = 0
            const batch: Array<Stream> = []
            let hasMore = false
            const { current: iterator } = iteratorRef
            // We load 1 extra entry to determine if we show "Load more" button.
            const effectiveBatchSize = batchSize + Number(!tailStreamRef.current)

            while (i < effectiveBatchSize) {
                // eslint-disable-next-line no-await-in-loop
                const { value, done } = await iterator.next()
                requireUninterrupted()
                hasMore = !done

                if (value) {
                    batch.push(value)
                }

                if (done) {
                    break
                }

                i += 1
            }

            const prevTailStream = tailStreamRef.current

            if (batch.length === effectiveBatchSize) {
                tailStreamRef.current = batch.pop()
            }

            if (prevTailStream) {
                return [[prevTailStream, ...batch], hasMore, false]
            }

            return [batch, hasMore, !prevTailStream]
        },
        [itp, client],
    )
}
