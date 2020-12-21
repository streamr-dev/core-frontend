// @flow

import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { updateDataUnionStats, cancelDataUnionStatsFetch, resetDataUnionStats } from '$mp/modules/dataUnion/actions'
import {
    selectDeployedDataUnionStats,
    selectDataUnionRequestedIds,
    selectDataUnionFetchingIds,
    selectDataUnionDeployedIds,
} from '$mp/modules/dataUnion/selectors'
import type { ProductIdList } from '$mp/flowtype/product-types'

function useAllDataUnionStats() {
    const dispatch = useDispatch()
    const load = useCallback((ids: ProductIdList = []) => {
        dispatch(updateDataUnionStats(ids))
    }, [dispatch])
    const stats = useSelector(selectDeployedDataUnionStats)
    const loadedIds = useSelector(selectDataUnionRequestedIds)
    const fetchingIds = useSelector(selectDataUnionFetchingIds)
    const deployedIds = useSelector(selectDataUnionDeployedIds)

    const members = useMemo(() => (
        (stats || []).reduce((result, { id, memberCount }) => {
            if (typeof memberCount === 'undefined') { return result }

            return {
                ...result,
                [id.toLowerCase()]: memberCount.active,
            }
        }, {})
    ), [stats])

    const reset = useCallback(() => {
        cancelDataUnionStatsFetch()
        dispatch(resetDataUnionStats())
    }, [dispatch])

    return useMemo(() => ({
        load,
        loadedIds,
        fetchingIds,
        deployedIds,
        stats,
        members,
        reset,
    }), [
        load,
        loadedIds,
        fetchingIds,
        deployedIds,
        stats,
        members,
        reset,
    ])
}

export default useAllDataUnionStats
