// @flow

import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { getAllDataUnions } from '$mp/modules/dataUnion/actions'
import { selectDataUnions, selectFetchingDataUnionStats } from '$mp/modules/dataUnion/selectors'

function useMemberStats() {
    const dispatch = useDispatch()
    const load = useCallback(() => {
        dispatch(getAllDataUnions())
    }, [dispatch])
    const stats = useSelector(selectDataUnions)
    const fetching = useSelector(selectFetchingDataUnionStats)

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

export default useMemberStats
