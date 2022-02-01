import formatConfigUrl from './formatConfigUrl'

export default function formatTrackers(trackers) {
    if (!trackers) {
        return trackers
    }

    return trackers.map(({ wsUrl, httpUrl, ...t }) => ({
        ...t,
        ws: formatConfigUrl(wsUrl, {
            protocol: 'ws',
        }),
        http: formatConfigUrl(httpUrl),
    }))
}
