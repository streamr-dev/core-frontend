import React, { FunctionComponent, useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { getStreamsOwnedBy, getStreamsFromIndexer, IndexerStream, TheGraphStream } from '$app/src/services/streams'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { useEditableProjectActions } from '$mp/containers/ProductController/useEditableProjectActions'
import { StreamSelectTable } from '$shared/components/StreamSelectTable'
import SearchBar from '$shared/components/SearchBar'
import { DESKTOP, TABLET } from '$shared/utils/styled'
import { ProjectType } from '$app/src/shared/types'
import { useWalletAccount } from '$shared/stores/wallet'

const PAGE_SIZE = 10

const Heading = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 16px;
  align-items: center;
  padding-bottom: 30px;

  @media ${TABLET} {
    padding-bottom: 45px
  }

  @media ${DESKTOP} {
    padding-bottom: 55px;
  }
`

const Title = styled.div`
  font-size: 34px;
  line-height: 48px;
  color: black;
`

export const StreamSelector: FunctionComponent = () => {
    const {state: project} = useContext(ProjectStateContext)
    const {updateStreams} = useEditableProjectActions()
    const [search, setSearch] = useState<string>('')
    const [streams, setStreams] = useState<Array<TheGraphStream>>([])
    const [streamStats, setStreamStats] = useState<Record<string, IndexerStream>>({})
    const projectType = project?.type
    const [page, setPage] = useState(0)
    const account = useWalletAccount()

    const visibleStreams = useMemo(
        () => streams.slice(0, (page + 1) * PAGE_SIZE),
        [streams, page],
    )

    const hasMore = useMemo(
        () => streams.length > visibleStreams.length,
        [streams.length, visibleStreams.length],
    )

    useEffect(() => {
        const load = async () => {
            const res = await getStreamsOwnedBy(account, search, projectType === ProjectType.OpenData)
            setStreams(res)
        }

        load()
    }, [account, projectType, search])

    useEffect(() => {
        const loadStats = async () => {
            try {
                const start = page * PAGE_SIZE
                const end = start + PAGE_SIZE
                const newPageStreams = streams.slice(start, end)
                const stats = await getStreamsFromIndexer(newPageStreams.map((s) => s.id))

                if (stats && stats.length > 0) {
                    setStreamStats((prev) => ({
                        ...prev,
                        ...Object.fromEntries(stats.map((is) => [is.id, is]))
                    }))
                }
            } catch (e) {
                console.warn('Fetching stream stats failed', e)
            }
        }

        loadStats()
    }, [page, streams])

    useEffect(() => {
        // Reset current page when needed
        setPage(0)
    }, [search, projectType, account])

    return <div>
        <Heading>
            <Title>Add Streams</Title>
        </Heading>
        <SearchBar
            placeholder={'Search stream'}
            value={search}
            onChange={(value) => {
                setSearch(value)
            }}
        />
        <StreamSelectTable
            streams={visibleStreams}
            streamStats={streamStats}
            loadMore={() => setPage((prev) => prev + 1)}
            hasMoreResults={hasMore}
            onSelectionChange={updateStreams}
            selected={project?.streams ?? []}
        />
    </div>
}
