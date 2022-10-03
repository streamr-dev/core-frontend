// @flow

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import usePending from '$shared/hooks/usePending'

import type { DataUnionId } from '$mp/flowtype/product-types'
import { getDataUnionStats } from '$mp/modules/dataUnion/actions'

export default function useDataUnionStatsLoadCallback() {
    const dispatch = useDispatch()
    const { wrap } = usePending('dataUnion.LOAD_STATS')

    return useCallback(async (id: DataUnionId, chainId: number) => (
        wrap(async () => {
            try {
                await dispatch(getDataUnionStats(id, chainId))
            } catch (e) {
                // ignore error, stats might not respond if DU not yet deployed
                console.warn(e)
            }
        })
    ), [wrap, dispatch])
}
