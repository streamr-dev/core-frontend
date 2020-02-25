// @flow

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import usePending from '$shared/hooks/usePending'

import type { DataUnionId } from '$mp/flowtype/product-types'
import { getDataUnionStats } from '$mp/modules/dataUnion/actions'

export default function useDataUnionStatsLoadCallback() {
    const dispatch = useDispatch()
    const { wrap } = usePending('dataUnion.LOAD_STATS')

    return useCallback(async (id: DataUnionId) => (
        wrap(async () => {
            await dispatch(getDataUnionStats(id))
        })
    ), [wrap, dispatch])
}
