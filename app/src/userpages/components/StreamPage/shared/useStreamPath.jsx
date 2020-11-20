import { useMemo } from 'react'

import { truncate } from '$shared/utils/text'
import { isEthereumAddress } from '$mp/utils/validate'

export default function useStreamPath(streamId) {
    return useMemo(() => {
        const firstSlashPos = streamId.indexOf('/')

        if (firstSlashPos < 0) {
            return {
                domain: undefined,
                pathname: streamId,
                truncatedId: streamId,
                truncatedDomain: undefined,
            }
        }

        const domain = streamId.slice(0, firstSlashPos)
        const pathname = streamId.slice(firstSlashPos + 1)
        let truncatedDomain = domain
        let truncatedId = streamId

        if (isEthereumAddress(domain)) {
            truncatedDomain = truncate(domain, { maxLength: 15 })
            truncatedId = `${truncatedDomain}/${pathname}`
        }

        return {
            domain,
            pathname,
            truncatedId,
            truncatedDomain,
        }
    }, [streamId])
}
