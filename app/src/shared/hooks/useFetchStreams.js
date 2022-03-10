import { useCallback, useEffect, useRef } from 'react'
import { useClient } from 'streamr-client-react'
import getClientAddress from '$app/src/getters/getClientAddress'
import useInterrupt from '$shared/hooks/useInterrupt'

export default function useFetchStreams() {
    const client = useClient()

    const itp = useInterrupt()

    const searchRef = useRef()

    const iteratorRef = useRef()

    const tailStreamRef = useRef()

    useEffect(() => {
        itp().interruptAll()
    }, [itp, client])

    return useCallback(async (search, { batchSize = 1 } = {}) => {
        const { requireUninterrupted } = itp(search)

        if (searchRef.current !== search) {
            searchRef.current = search
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
            })
        }

        let i = 0

        const batch = []

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
            return [[prevTailStream, ...batch], hasMore]
        }

        return [batch, hasMore, !prevTailStream]
    }, [itp, client])
}
