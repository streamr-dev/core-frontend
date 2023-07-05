import formatConfigUrl from './formatConfigUrl'
// TODO add typing
export default function formatTrackers(trackers: any): any {
    if (!trackers) {
        return trackers
    }

    return trackers.map((t: any) => {
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
