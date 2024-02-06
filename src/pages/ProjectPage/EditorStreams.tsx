import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    IndexerStream,
    TheGraphStream,
    getStreamsFromIndexer,
    getStreamsOwnedBy,
} from '~/services/streams'
import SearchBar from '~/shared/components/SearchBar'
import { StreamSelectTable } from '~/shared/components/StreamSelectTable'
import {
    useIsProjectDraftBusy,
    useProject,
    useUpdateProject,
} from '~/stores/projectDraft'
import { useWalletAccount } from '~/shared/stores/wallet'
import { ProjectType } from '~/shared/types'
import { address0 } from '~/consts'
import { useCurrentChainId } from '~/shared/stores/chain'

const PageSize = 10

const EmptyStreams = []

export default function EditorStreams() {
    const {
        type: projectType = ProjectType.OpenData,
        streams: projectStreams = EmptyStreams,
    } = useProject({ hot: true }) || {}

    const busy = useIsProjectDraftBusy()

    const [searchValue, setSearchValue] = useState('')

    const account = useWalletAccount() || address0

    const [foundStreams, setFoundStreams] = useState<TheGraphStream[]>([])

    const [page, setPage] = useState(0)

    const streams = foundStreams.slice(0, (page + 1) * PageSize)

    const [streamStats, setStreamStats] = useState<Record<string, IndexerStream>>({})

    const hasMore = foundStreams.length > streams.length

    const abortControllerRef = useRef<AbortController>()

    const update = useUpdateProject()

    const chainId = useCurrentChainId()

    /**
     * @todo Refactor to use `useInfiniteQuery`
     */
    const search = useCallback(
        (phrase: string) => {
            abortControllerRef.current?.abort()

            const abortController = new AbortController()

            abortControllerRef.current = abortController

            setTimeout(async () => {
                try {
                    const foundStreams = await getStreamsOwnedBy(
                        chainId,
                        account,
                        phrase,
                        projectType === ProjectType.OpenData,
                    )

                    /**
                     * If the signal got aborted we ignore the rest of the
                     * flow. Aborting happens in a couple of reasonable places
                     * throughout this components.
                     */
                    if (abortController.signal.aborted) {
                        return
                    }

                    setFoundStreams(foundStreams)

                    setPage(0)
                } catch (e) {
                    console.warn('Faild to load streams', e)
                }
            })

            return () => {
                abortController.abort()
            }
        },
        [account, projectType, chainId],
    )

    /**
     * Keep a ref for the search value to avoid triggering the below "auto-search"
     * `useEffect`. Searching directly associated with the search value changes gets
     * triggered from within SearchBar's `onChange` callback. See below.
     */
    const searchValueRef = useRef(searchValue)

    useEffect(() => {
        /**
         * `search` returns a cancel/abort callback which we use as the teardown
         * callback of this effect. It's important.
         */
        return search(searchValueRef.current)
    }, [search])

    useEffect(() => {
        /**
         * This effect aborts the ongoing search on unmount. We aim mainly at the searches
         * initiated by the `SearchBar`. Searches initiated by the "auto-search" `useEffect`
         * above get aborted automatically by the hook.
         */

        const { current: abortController } = abortControllerRef

        return () => {
            abortController?.abort()
        }
    }, [])

    useEffect(() => {
        let mounted = true

        const startAt = page * PageSize

        const streamIds = foundStreams
            .slice(startAt, startAt + PageSize)
            .map(({ id }) => id)

        setTimeout(async () => {
            try {
                const stats = await getStreamsFromIndexer(streamIds)

                if (!mounted || !stats.length) {
                    return
                }

                setStreamStats((prev) => ({
                    ...prev,
                    ...Object.fromEntries(stats.map((is) => [is.id, is])),
                }))
            } catch (e) {
                console.warn('Fetching stream stats failed', e)
            }
        })

        return () => {
            mounted = false
        }
    }, [page, foundStreams])

    return (
        <>
            <SearchBar
                disabled={busy}
                placeholder="Search stream"
                value={searchValue}
                onChange={(value) => {
                    setSearchValue(value)

                    searchValueRef.current = value

                    /**
                     * Each new value triggers a search. Previous searches are
                     * cancelled via the `abortControllerRef`.
                     */
                    search(value)
                }}
            />
            <StreamSelectTable
                disabled={busy}
                streams={streams}
                streamStats={streamStats}
                loadMore={() => {
                    setPage((p) => p + 1)
                }}
                hasMoreResults={hasMore}
                onSelectionChange={(streamIds) => {
                    update((project) => {
                        project.streams = streamIds.sort()
                    })
                }}
                selected={projectStreams}
            />
        </>
    )
}
