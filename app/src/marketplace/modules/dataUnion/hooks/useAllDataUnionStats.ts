import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    updateDataUnionStats,
    cancelDataUnionStatsFetch,
    resetDataUnionStats,
    updateDataUnionStatsByDataUnionId,
} from '$mp/modules/dataUnion/actions'
import {
    selectDeployedDataUnionStats,
    selectDataUnionRequestedIds,
    selectDataUnionFetchingIds,
    selectDataUnionDeployedIds,
} from '$mp/modules/dataUnion/selectors'
import { ProjectIdList, DataUnionId } from '$mp/types/project-types'

function useAllDataUnionStats() {
    const dispatch = useDispatch()
    const load = useCallback(
        (ids: ProjectIdList = []) => {
            dispatch(updateDataUnionStats(ids))
        },
        [dispatch],
    )
    const loadByDataUnionId = useCallback(
        (ids: Array<DataUnionId> = []) => {
            dispatch(updateDataUnionStatsByDataUnionId(ids))
        },
        [dispatch],
    )
    const stats = useSelector(selectDeployedDataUnionStats)
    const loadedIds = useSelector(selectDataUnionRequestedIds)
    const fetchingIds = useSelector(selectDataUnionFetchingIds)
    const deployedIds = useSelector(selectDataUnionDeployedIds)
    const members = useMemo(
        () =>
            (stats || []).reduce((result, { id, memberCount }) => {
                if (typeof memberCount === 'undefined') {
                    return result
                }

                return { ...result, [id.toLowerCase()]: memberCount.active }
            }, {}),
        [stats],
    )
    const reset = useCallback(() => {
        cancelDataUnionStatsFetch()
        dispatch(resetDataUnionStats())
    }, [dispatch])
    return useMemo(
        () => ({
            load,
            loadByDataUnionId,
            loadedIds,
            fetchingIds,
            deployedIds,
            stats,
            members,
            reset,
        }),
        [load, loadByDataUnionId, loadedIds, fetchingIds, deployedIds, stats, members, reset],
    )
}

export default useAllDataUnionStats
