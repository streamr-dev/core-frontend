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
    const tailStreamRef = useRef<IndexerStream>()

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

            if (typeof cursorRef.current === 'undefined') {
                tailStreamRef.current = undefined
            }

            requireUninterrupted()
            const userAddress = onlyCurrentUserRef.current === true ? await getClientAddress(client, {
                suppressFailures: true,
            }) : null

            const result = await getStreamsFromIndexer(batchSize, cursorRef.current, userAddress, searchRef.current)

            const hasMore = true
            const isFirstBatch = true
            requireUninterrupted()

            return [result.items, hasMore, isFirstBatch]
        }, [client, itp])

    return fetchStreams
}
