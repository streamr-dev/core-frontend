import getCoreConfig from '$app/src/getters/getCoreConfig'
import address0 from '$utils/address0'
import { post } from '$shared/utils/api'

const getGraphUrl = () => {
    const { theGraphUrl, streamsGraphName } = getCoreConfig()
    return `${theGraphUrl}/subgraphs/name/${streamsGraphName}`
}

export enum TheGraphOrderBy {
    Id = 'id',
    CreatedAt = 'createdAt',
    UpdatedAt = 'updatedAt',
}

export enum TheGraphOrderDirection {
    Asc = 'asc',
    Desc = 'desc',
}

export type TheGraphStreamPermission = {
    userAddress: string
    canEdit: boolean
    canGrant: boolean
    canDelete: boolean
    subscribeExpiration: number
    publishExpiration: number
}

export type TheGraphStreamMetadata = {
    description?: string
}

export type TheGraphStream = {
    id: string
    metadata?: TheGraphStreamMetadata
    subscriberCount: number | null | undefined
    publisherCount: number | null | undefined
    permissions: TheGraphStreamPermission[]
}

export type TheGraphStreamResult = {
    streams: Array<TheGraphStream>
    hasNextPage: boolean
    lastId: string | null
}

const calculatePubSubCount = (permissions: TheGraphStreamPermission[]) => {
    let publisherCount: number | null = 0
    let subscriberCount: number | null = 0

    permissions.forEach((perm) => {
        // If stream has public permissions (zero address), return null for counts which means that anyone can
        // publish or subscribe
        if (perm.userAddress === address0) {
            if (perm.subscribeExpiration >= Math.round(Date.now() / 1000)) {
                subscriberCount = null
            }
            if (perm.publishExpiration >= Math.round(Date.now() / 1000)) {
                publisherCount = null
            }
        }

        if (
            perm.subscribeExpiration >= Math.round(Date.now() / 1000) &&
            subscriberCount != null
        ) {
            subscriberCount += 1
        }

        if (
            perm.publishExpiration >= Math.round(Date.now() / 1000) &&
            publisherCount != null
        ) {
            publisherCount += 1
        }
    })

    return {
        publisherCount,
        subscriberCount,
    }
}

const mapStream = (stream: TheGraphStream): TheGraphStream => {
    const result = { ...stream }

    // Get publisher and subscriber counts
    const counts = calculatePubSubCount(stream.permissions)
    result.publisherCount = counts.publisherCount
    result.subscriberCount = counts.subscriberCount

    // Try to parse metadata JSON
    if (stream.metadata != null) {
        try {
            const metadata = JSON.parse(stream.metadata as string)
            result.metadata = metadata
        } catch (e) {
            console.error(`Could not parse metadata for stream ${stream.id}`, e)
            result.metadata = {}
        }
    }

    return result
}

const prepareStreamResult = (
    result: TheGraphStream[],
    pageSize: number,
): TheGraphStreamResult => {
    let hasNextPage = false

    const streams: TheGraphStream[] = result.map((p) => mapStream(p))
    if (streams.length > pageSize) {
        hasNextPage = true
        // Remove last item
        streams.splice(pageSize, 1)
    }

    return {
        streams,
        hasNextPage,
        lastId: streams[streams.length - 1]?.id,
    }
}

export const getStreams = async (streamIds: Array<string>): Promise<TheGraphStream[]> => {
    const theGraphUrl = getGraphUrl()

    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                {
                    streams(
                        where: { id_in: [${streamIds.map((s) => `"${s}"`).join(',')}] }
                    ) {
                        id
                        metadata
                        permissions {
                            userAddress
                            canEdit
                            canGrant
                            canDelete
                            subscribeExpiration
                            publishExpiration
                        }
                    }
                }
            `,
        },
    })

    if (result && result.data && result.data.streams && result.data.streams.length > 0) {
        return result.data.streams.map((s) => mapStream(s))
    }

    return []
}

export const getPagedStreams = async (
    first: number,
    lastId?: string,
    owner?: string,
    search?: string,
    orderBy?: TheGraphOrderBy,
    orderDirection?: TheGraphOrderDirection,
): Promise<TheGraphStreamResult> => {
    const theGraphUrl = getGraphUrl()

    // NOTE: Stream name fulltext search is done through subentity "permissions" because we cannot
    // use "id_contains" in query as it's not technically stored as a string on The Graph.
    const searchFilter =
        search != null && search.length > 0 ? `stream_contains: "${search}"` : null
    const ownerFilter =
        owner != null ? `userAddress: "${owner.toLowerCase()}", canGrant: true` : null
    const allPermissionFilters = [ownerFilter, searchFilter]
        .filter((filter) => !!filter)
        .join(',')
    const permissionFilter =
        allPermissionFilters.length > 0 && `permissions_: { ${allPermissionFilters} }`
    const comparisonOperator = orderDirection === TheGraphOrderDirection.Asc ? 'gt' : 'lt'
    const cursorFilter = lastId != null ? `id_${comparisonOperator}: "${lastId}"` : null
    const allFilters = [cursorFilter, permissionFilter]
        .filter((filter) => !!filter)
        .join(',')

    const result = await post({
        url: theGraphUrl,
        data: {
            query: `
                {
                    streams(
                        first: ${first + 1},
                        orderBy: ${orderBy?.toString() ?? TheGraphOrderBy.Id.toString()},
                        orderDirection: ${
                            orderDirection?.toString() ??
                            TheGraphOrderDirection.Asc.toString()
                        },
                        ${allFilters != null ? `where: { ${allFilters} }` : ''},
                    ) {
                        id
                        metadata
                        permissions {
                            userAddress
                            canEdit
                            canGrant
                            canDelete
                            subscribeExpiration
                            publishExpiration
                        }
                    }
                }
            `,
        },
    })

    if (result && result.data && result.data.streams && result.data.streams.length > 0) {
        return prepareStreamResult(result.data.streams, first)
    }

    return {
        streams: [],
        hasNextPage: false,
        lastId: null,
    }
}

export enum IndexerOrderBy {
    Id = 'ID',
    Description = 'DESCRIPTION',
    PeerCount = 'PEER_COUNT',
    MsgPerSecond = 'MESSAGES_PER_SECOND',
    SubscriberCount = 'SUBSCRIBER_COUNT',
    PublisherCount = 'PUBLISHER_COUNT',
}

export enum IndexerOrderDirection {
    Asc = 'ASC',
    Desc = 'DESC',
}

export type IndexerStream = {
    id: string
    description: string | null | undefined
    peerCount: number | null | undefined
    messagesPerSecond: number | null | undefined
    subscriberCount: number | null | undefined
    publisherCount: number | null | undefined
}

export type IndexerResult = {
    streams: Array<IndexerStream>
    cursor: string | null | undefined
    hasNextPage: boolean
}

export const getPagedStreamsFromIndexer = async (
    first: number,
    cursor?: string,
    owner?: string,
    search?: string,
    orderBy?: IndexerOrderBy,
    orderDirection?: IndexerOrderDirection,
): Promise<IndexerResult> => {
    const { streamIndexerUrl } = getCoreConfig()

    const ownerFilter = owner != null ? `owner: "${owner}"` : null
    const searchFilter =
        search != null && search.length > 0 ? `searchTerm: "${search}"` : null
    const cursorFilter = cursor != null ? `cursor: "${cursor}"` : null
    const allFilters = [ownerFilter, searchFilter, cursorFilter]
        .filter((filter) => !!filter)
        .join(',')

    const result = await post({
        url: streamIndexerUrl,
        data: {
            query: `
                {
                    streams(
                        pageSize: ${first},
                        orderBy: ${
                            orderBy?.toString() ?? IndexerOrderBy.MsgPerSecond.toString()
                        },
                        orderDirection: ${
                            orderDirection?.toString() ??
                            IndexerOrderDirection.Desc.toString()
                        },
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
        options: {
            timeout: 2000, // apply timeout so we fall back to using The Graph faster
        },
    })

    const resultObj = result.data.streams
    if (resultObj) {
        return {
            streams: resultObj.items,
            cursor: resultObj.cursor,
            hasNextPage: resultObj.cursor != null,
        }
    }

    return {
        streams: [],
        cursor: null,
        hasNextPage: false,
    }
}

export const getStreamsFromIndexer = async (
    streamIds: Array<string>,
): Promise<Array<IndexerStream>> => {
    const { streamIndexerUrl } = getCoreConfig()

    if (streamIds == null || streamIds.length === 0) {
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
    streamCount: number
    messagesPerSecond: number
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

export const getStreamsOwnedBy = async (
    owner?: string,
    search?: string,
    onlyPublic?: boolean,
): Promise<TheGraphStream[]> => {
    const allOwnedStreams = await getPagedStreams(
        999,
        undefined,
        owner,
        search,
        TheGraphOrderBy.Id,
        TheGraphOrderDirection.Asc,
    )

    let result = allOwnedStreams.streams

    if (onlyPublic) {
        result = result.filter(
            (s) =>
                s.permissions.find(
                    (p) => p.userAddress.toLowerCase() === address0.toLowerCase(),
                ) != null,
        )
    }

    return result
}
