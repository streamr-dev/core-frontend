import formatConfigUrl from './formatConfigUrl'

export default function formatTrackers(trackers) {
    if (!trackers) {
        return trackers
    }

    return trackers.map((t) => {
        if (!t || typeof t !== 'object') {
            return t
        }

        const { wsUrl, httpUrl, ...u } = t

        return {
            ...u,
            ws: formatConfigUrl(wsUrl, {
                protocol: 'ws',
            }),
            http: formatConfigUrl(httpUrl),
        }
    })
}
