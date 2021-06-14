// @flow

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { resetDataUnion } from '$mp/modules/dataUnion/actions'

export default function useResetDataUnionCallback() {
    const dispatch = useDispatch()

    return useCallback(() => (
        dispatch(resetDataUnion())
    ), [dispatch])
}
