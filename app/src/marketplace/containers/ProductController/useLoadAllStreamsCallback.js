// @flow

import { useCallback } from 'react'

import usePending from '$shared/hooks/usePending'

import { getAllStreams } from '$mp/modules/streams/services'

export default function useLoadAllStreamsCallback({ setAllStreams }: {
    setAllStreams: Function,
}) {
    const { wrap } = usePending('streams.LOAD_ALL_STREAMS')

    return useCallback(async (params: Object = {}) => (
        wrap(async () => {
            try {
                const streams = await getAllStreams(params)

                setAllStreams(streams)
            } catch (e) {
                console.warn(e)
            }
        })
    ), [wrap, setAllStreams])
}
