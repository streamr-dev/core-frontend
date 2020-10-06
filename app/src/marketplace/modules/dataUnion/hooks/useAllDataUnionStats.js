// @flow

import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { updateDataUnionStats } from '$mp/modules/dataUnion/actions'
import { selectDataUnions, selectFetchingDataUnionStats } from '$mp/modules/dataUnion/selectors'
import type { ProductIdList } from '$mp/flowtype/product-types'

function useAllDataUnionStats() {
    const dispatch = useDispatch()
    const load = useCallback((ids: ProductIdList = []) => {
        dispatch(updateDataUnionStats(ids))
    }, [dispatch])
    const stats = useSelector(selectDataUnions)
    const fetching = useSelector(selectFetchingDataUnionStats)

    const members = useMemo(() => (
        (stats || []).reduce((result, { id, memberCount }) => {
            if (typeof memberCount === 'undefined') { return result }

            return {
                ...result,
                [id.toLowerCase()]: memberCount.total,
            }
        }, {})
    ), [stats])

    return useMemo(() => ({
        load,
        fetching,
        stats,
        members,
    }), [
        load,
        fetching,
        stats,
        members,
    ])
}

export default useAllDataUnionStats
