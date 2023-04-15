import getCoreConfig from '$app/src/getters/getCoreConfig'
import address0 from '$utils/address0'
import { post } from '$shared/utils/api'

export type IndexerStream = {
    id: string,
    description: string | null | undefined,
    peerCount: number | null | undefined,
    messagesPerSecond: number | null | undefined,
    subscriberCount: number | null | undefined,
    publisherCount: number | null | undefined,
}

export type IndexerResult = {
    items: Array<IndexerStream>,
    cursor: string,
}

export const getStreamsFromIndexer = async (streamIds: Array<string>): Promise<Array<IndexerStream>> => {
    const { streamIndexerUrl } = getCoreConfig()

    if (streamIds.length === 0) {
        return []
    }

    const result = await post({
        url: streamIndexerUrl,
        data: {
            query: `
                {
                    streams(ids: [${streamIds.map((s) => `"${s}"`).join(',')}]) {
                        items {
                          id
                          description
                          peerCount
                          messagesPerSecond
                          subscriberCount
                          publisherCount
                        }
                    }
                }
            `,
        },
    })

    return result.data.streams.items
}

export type GlobalStreamStats = {
    streamCount: number,
    messagesPerSecond: number,
}

export const getGlobalStatsFromIndexer = async (): Promise<GlobalStreamStats> => {
    const { streamIndexerUrl } = getCoreConfig()

    const result = await post({
        url: streamIndexerUrl,
        data: {
            query: `
                {
                    summary {
                        streamCount
                        messagesPerSecond
                    }
                }
            `,
        },
    })

    return result.data.summary
}

const getGraphUrl = () => {
    const { theGraphUrl, streamsGraphName } = getCoreConfig()
    return `${theGraphUrl}/subgraphs/name/${streamsGraphName}`
}

const buildGraphStats = (permissions: any): TheGraphStreamStats[] => {
    const stats: Record<string, { subscriberCount: number | null, publisherCount: number | null}> = {}

    permissions.forEach((perm) => {
        if (perm.stream == null) {
            return
        }
        const streamId = perm.stream.id

        // Add new entry if it does not exist already
        if (stats[streamId] == null) {
            stats[streamId] = {
                subscriberCount: 0,
                publisherCount: 0,
            }
        }

        // If stream has public permissions (zero address), return null for counts which means that anyone can
        // publish or subscribe
        if (perm.userAddress === address0) {
            stats[streamId].subscriberCount = perm.subscribeExpiration >= Math.round(Date.now() / 1000) ? null : 0
            stats[streamId].publisherCount = perm.publishExpiration >= Math.round(Date.now() / 1000) ? null : 0
        }

        if (perm.subscribeExpiration >= Math.round(Date.now() / 1000) && stats[streamId].subscriberCount != null) {
            // @ts-expect-error 2531
            stats[streamId].subscriberCount += 1
        }

        if (perm.publishExpiration >= Math.round(Date.now() / 1000) && stats[streamId].publisherCount != null) {
            // @ts-expect-error 2531
            stats[streamId].publisherCount += 1
        }
    })

    return Object.entries(stats).map(([k, v]) => ({ id: k, ...v }))
}

export type TheGraphStreamStats = {
    id: string,
    subscriberCount: number | null,
    publisherCount: number | null,
}

export const getPublisherAndSubscriberCountForStreams = async (streamIds: Array<string>): Promise<TheGraphStreamStats[]> => {
    const theGraphUrl = getGraphUrl()

    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                {
                    permissions(
                        where: {
                            or: [
                                ${streamIds.map((s) => `{ stream: "${s}" }`).join(',')}
                            ]
                        }
                    ) {
                        userAddress
                        subscribeExpiration
                        publishExpiration
                        stream {
                          id
                        }
                    }
                }
            `,
        },
    })

    if (result && result.data && result.data.permissions.length > 0) {
        return buildGraphStats(result.data.permissions)
    }

    return []
}
