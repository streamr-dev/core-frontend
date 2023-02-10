import { useCallback, useEffect, useRef } from 'react'
import { useClient } from 'streamr-client-react'
import { getStreamsFromIndexer, IndexerStream } from '$app/src/services/streams'
import getClientAddress from '$app/src/getters/getClientAddress'
import useInterrupt from '$shared/hooks/useInterrupt'

type FetchParameters = {
    batchSize?: number,
    allowPublic?: boolean,
    onlyCurrentUser?: boolean,
}
type FetchCallbackType = (search?: string, params?: FetchParameters) =>
    Promise<[IndexerStream[], boolean, boolean]>

export default function useFetchStreamsFromIndexer(): FetchCallbackType {
    const client = useClient() // This is only needed for getting user address
    const itp = useInterrupt()
    const searchRef = useRef<string>()
    const onlyCurrentUserRef = useRef<boolean>()
    const cursorRef = useRef<string | undefined>()

    useEffect(() => {
        itp().interruptAll()
    }, [itp, client])

    const fetchStreams = useCallback<FetchCallbackType>(
        async (search?: string, { batchSize = 1, allowPublic = false, onlyCurrentUser = true } = {}) => {
            const { requireUninterrupted } = itp(search)

            if (searchRef.current !== search || onlyCurrentUserRef.current !== onlyCurrentUser) {
                searchRef.current = search
                onlyCurrentUserRef.current = onlyCurrentUser
                cursorRef.current = undefined
            }

            requireUninterrupted()

            let userAddress = null
            if (onlyCurrentUserRef.current === true) {
                userAddress = await getClientAddress(client, {
                    suppressFailures: true,
                })
            }

            const result = await getStreamsFromIndexer(batchSize + 1, cursorRef.current, userAddress, searchRef.current)

            let hasMore = false
            if (result.items.length > batchSize) {
                result.items.pop() // pop item from loadMore check
                hasMore = true
            }

            const isFirstBatch = typeof cursorRef.current === 'undefined'
            cursorRef.current = (Number.parseInt(result.cursor) - 1).toString() // -1 from loadMore check
            requireUninterrupted()

            return [result.items, hasMore, isFirstBatch]
        }, [client, itp])

    return fetchStreams
}
