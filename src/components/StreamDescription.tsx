import React, { useEffect, useState } from 'react'
import { getStreamDescription } from '~/getters'

export function StreamDescription({ streamId }: { streamId: string }) {
    const [desc, setDesc] = useState<string>()

    /**
     * @todo Refactor using `useQuery`.
     */
    useEffect(() => {
        let mounted = true

        setDesc(undefined)

        setTimeout(async () => {
            try {
                const description = await getStreamDescription(streamId)

                if (mounted) {
                    setDesc(description)
                }
            } catch (_) {
                /**
                 * We're only interested in the happy path here. Ok to ignore
                 * paths that are not so happy.
                 */
            }
        })

        return () => {
            mounted = false
        }
    }, [streamId])

    return <>{desc}</>
}
