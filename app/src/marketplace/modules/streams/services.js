export const getStreams = (client, params) => {
    const nextParams = {
        uiChannel: false,
        operation: 'STREAM_SHARE',
        ...(params || {}),
    }

    if (nextParams.max) {
        // query 1 extra element to determine if we should show "load more" button
        nextParams.max += 1
    }

    return client.listStreams({
        ...nextParams,
    })
        .then((streams) => ({
            streams: nextParams.max ? streams.splice(0, nextParams.max - 1) : streams,
            hasMoreResults: !!nextParams.max && streams.length > 0,
        }))
}

const STREAMS_PAGE_SIZE = 999

export async function* getPagedStreams(client, params) {
    let page = 0
    let hasMore = false

    do {
        // eslint-disable-next-line no-await-in-loop
        const { streams, hasMoreResults } = await getStreams(client, {
            ...(params || {}),
            max: STREAMS_PAGE_SIZE,
            offset: page * STREAMS_PAGE_SIZE,
        })
        page += 1
        hasMore = hasMoreResults

        yield streams
    } while (hasMore)
}

export async function getAllStreams(client, params = {}) {
    const streams = []

    // eslint-disable-next-line no-restricted-syntax, no-await-in-loop
    for await (const pagedStreams of getPagedStreams(client, params)) {
        streams.push(...pagedStreams)
    }

    return streams
}
