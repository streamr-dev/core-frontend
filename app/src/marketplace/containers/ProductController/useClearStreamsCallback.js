// @flow

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { clearStreamList } from '$mp/modules/streams/actions'

export default function useClearStreamsCallback() {
    const dispatch = useDispatch()

    return useCallback(() => (
        dispatch(clearStreamList())
    ), [dispatch])
}
