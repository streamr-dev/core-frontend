// @flow

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import usePending from '$shared/hooks/usePending'

import { getStreams } from '$mp/modules/streams/actions'

export default function useLoadStreamsCallback() {
    const dispatch = useDispatch()
    const { wrap } = usePending('streams.LOAD')

    return useCallback(async (params: Object = {}) => (
        wrap(async () => {
            await dispatch(getStreams(params))
        })
    ), [wrap, dispatch])
}
