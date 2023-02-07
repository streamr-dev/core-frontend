import { useCallback, useMemo } from 'react'
import { Stream } from 'streamr-client'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import { post } from '../utils/api'

export type StreamStats = {
    stats: any,
}

const load = async () => {
    const { theGraphUrl, theHubGraphName } = getCoreConfig()
    const pageSize = 10

    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                query {
                    streams(
                        pageSize: ${pageSize},
                        skip: ${skip},
                        text: "${search}",
                    ) {
                        ${projectFields}
                    }
                }
            `,
        },
        useAuthorization: false,
    })

    return result.data.projectSearch
}

export const useStreamStats = (streams: Array<Stream>): StreamStats => {
    const loadStats = useCallback(() => {

    }, [])

    const stats = useMemo(() => {
        console.log('Streams changed', streams)
        return []
    }, [streams])

    return {
        stats,
    }
}
