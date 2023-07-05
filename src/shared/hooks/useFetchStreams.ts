import { useCallback, useEffect, useRef } from 'react'
import { useClient } from 'streamr-client-react'
import { Stream } from 'streamr-client'
import useInterrupt from '~/shared/hooks/useInterrupt'
import { useWalletAccount } from '~/shared/stores/wallet'

type FetchParameters = {
    batchSize?: number
    allowPublic?: boolean
    onlyCurrentUser?: boolean
}
type FetchCallbackType = (
    search?: string,
    params?: FetchParameters,
    resetSearch?: boolean,
) => Promise<[Stream[], boolean, boolean]>

export default function useFetchStreams(): FetchCallbackType {
    const client = useClient()
    const itp = useInterrupt()
    const searchRef = useRef<string>()
    const allowPublicRef = useRef<boolean>()
    const onlyCurrentUserRef = useRef<boolean>()
    const iteratorRef = useRef<AsyncIterable<Stream>>()
    const tailStreamRef = useRef<Stream>()

    const account = useWalletAccount()

    useEffect(() => {
        itp().interruptAll()
    }, [itp, client])

    return useCallback<FetchCallbackType>(
        async (
            search?: string,
            { batchSize = 1, allowPublic = false, onlyCurrentUser = true } = {},
            resetSearch = false,
        ) => {
            const { requireUninterrupted } = itp(search)

            if (
                searchRef.current !== search ||
                allowPublicRef.current !== allowPublic ||
                onlyCurrentUserRef.current !== onlyCurrentUser ||
                resetSearch
            ) {
                searchRef.current = search
                allowPublicRef.current = allowPublic
                onlyCurrentUserRef.current = onlyCurrentUser
                iteratorRef.current = undefined
            }

            if (typeof iteratorRef.current === 'undefined') {
                requireUninterrupted()
                tailStreamRef.current = undefined

                if (onlyCurrentUserRef.current) {
                    const user = account
                    if (!user) {
                        return [[], false, false]
                    }
                    iteratorRef.current = client.searchStreams(search, {
                        user,
                        allowPublic,
                    })
                } else {
                    iteratorRef.current = client.searchStreams(search, undefined)
                }
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
        [itp, client, account],
    )
}
