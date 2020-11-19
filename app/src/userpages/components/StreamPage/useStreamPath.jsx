import { useMemo } from 'react'

export default function useStreamPath(streamId) {
    return useMemo(() => {
        const firstSlashPos = streamId.indexOf('/')

        if (firstSlashPos < 0) {
            return {
                domain: undefined,
                pathname: streamId,
            }
        }

        return {
            domain: streamId.slice(0, firstSlashPos),
            pathname: streamId.slice(firstSlashPos + 1),
        }
    }, [streamId])
}
