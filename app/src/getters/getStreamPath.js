import { truncate } from '$shared/utils/text'

export default function getStreamPath(streamId) {
    const firstSlashPos = streamId.indexOf('/')

    if (firstSlashPos === -1) {
        return {
            domain: undefined,
            pathname: streamId,
            truncatedId: streamId,
            truncatedDomain: undefined,
        }
    }

    const domain = streamId.slice(0, firstSlashPos)
    const pathname = streamId.slice(firstSlashPos + 1)
    const truncatedDomain = truncate(domain)
    const truncatedId = [truncatedDomain, pathname].filter(Boolean).join('/')

    return {
        domain,
        pathname,
        truncatedId,
        truncatedDomain,
    }
}
