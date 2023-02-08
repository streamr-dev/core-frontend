import { useCallback, useMemo } from 'react'
import { Stream } from 'streamr-client'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import { post } from '../utils/api'

export type StreamStats = {
    stats: any,
}

const load = async (first: number, skip: number, owner?: string, search?: string) => {
    const { streamIndexerUrl } = getCoreConfig()

    const ownerFilter = owner != null ? `owner: "${owner}"` : null
    const searchFilter = search != null ? `searchTerm: "${search}"` : null
    const allFilters = [ownerFilter, searchFilter].join(',')

    const result = await post({
        url: streamIndexerUrl,
        data: {
            query: `
                {
                    streams(
                        pageSize: ${first},
                        ${allFilters},
                    ) {
                        items {
                          id
                          description
                          peerCount
                          messagesPerSecond
                          subscriberCount
                          publisherCount
                        }
                        cursor
                    }
                }
            `,
        },
        useAuthorization: false,
    })

    return result.data.streams.items
}

export const useStreamStats = (streams: Array<Stream>): StreamStats => {
    const loadStats = useCallback(async () => {
        const res = await load(1, 0)
        console.log(res)
    }, [])

    const stats = useMemo(() => {
        console.log('Streams changed', streams)
        loadStats()
        return []
    }, [streams, loadStats])

    return {
        stats,
    }
}
