// @flow

import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { getAllCommunityStats } from '$mp/modules/communityProduct/actions'
import { selectCommunityProducts, selectFetchingCommunityStats } from '$mp/modules/communityProduct/selectors'

function useCommunityStats() {
    const dispatch = useDispatch()
    const load = useCallback(() => {
        dispatch(getAllCommunityStats())
    }, [dispatch])
    const stats = useSelector(selectCommunityProducts)
    const fetching = useSelector(selectFetchingCommunityStats)

    const members = useMemo(() => (
        (stats || []).reduce((result, { id, memberCount }) => {
            if (!memberCount) { return result }

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

export default useCommunityStats
