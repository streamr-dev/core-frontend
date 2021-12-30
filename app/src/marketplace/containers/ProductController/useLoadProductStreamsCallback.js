import { useCallback } from 'react'
import { useClient } from 'streamr-client-react'

import usePending from '$shared/hooks/usePending'

export default function useLoadProductStreamsCallback({ setProductStreams }) {
    const { wrap } = usePending('product.LOAD_PRODUCT_STREAMS')
    const client = useClient()

    return useCallback(async (streamIds) => (
        wrap(async () => {
            const streams = await Promise.allSettled((streamIds || []).map(async (id) => {
                try {
                    const stream = await client.getStream(id)

                    return stream.toObject()
                } catch (e) {
                    console.warn(e)
                }

                return {
                    id,
                    description: undefined,
                }
            }))

            setProductStreams(streams.map(({ value }) => value).filter(Boolean))
        })
    ), [wrap, setProductStreams, client])
}
