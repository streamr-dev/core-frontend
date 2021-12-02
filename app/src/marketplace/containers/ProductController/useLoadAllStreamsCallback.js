// @flow

import { useCallback } from 'react'
import { useClient } from 'streamr-client-react'

import usePending from '$shared/hooks/usePending'

import { getAllStreams } from '$mp/modules/streams/services'

export default function useLoadAllStreamsCallback({ setAllStreams }: {
    setAllStreams: Function,
}) {
    const { wrap } = usePending('streams.LOAD_ALL_STREAMS')
    const client = useClient()

    return useCallback(async (params: Object = {}) => (
        wrap(async () => {
            try {
                const streams = await getAllStreams(client, params)

                setAllStreams(streams)
            } catch (e) {
                console.warn(e)
            }
        })
    ), [wrap, setAllStreams, client])
}
