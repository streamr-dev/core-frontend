// @flow

import { useCallback } from 'react'
import { useClient } from 'streamr-client-react'

import usePending from '$shared/hooks/usePending'

export default function useLoadAllStreamsCallback({ setAllStreams }: {
    setAllStreams: Function,
}) {
    const { wrap } = usePending('streams.LOAD_ALL_STREAMS')
    const client = useClient()

    return useCallback(async () => (
        wrap(async () => {
            try {
                const gen = await client.getAllStreams()
                const streams = []

                // eslint-disable-next-line no-restricted-syntax
                for await (const stream of gen) {
                    streams.push(stream)
                }

                setAllStreams(streams)
            } catch (e) {
                console.warn(e)
            }
        })
    ), [wrap, setAllStreams, client])
}
