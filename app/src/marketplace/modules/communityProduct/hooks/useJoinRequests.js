// @flow

import { useState, useCallback, useMemo } from 'react'
import { denormalize } from 'normalizr'

import useEntities from '$shared/hooks/useEntities'
import type { Filter } from '$userpages/flowtype/common-types'
import type { CommunityId } from '$mp/flowtype/product-types'
import type { Address } from '$shared/flowtype/web3-types'
import { joinRequestSchema, joinRequestsSchema } from '$shared/modules/entities/schema'
import { getJoinRequests, updateJoinRequest, addJoinRequest } from '$mp/modules/communityProduct/services'
import { getParamsForFilter } from '$userpages/utils/filters'

function useJoinRequests() {
    const { update, entities } = useEntities()
    const [ids, setIds] = useState([])
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState(undefined)

    const load = useCallback(async (communityId: CommunityId, filter: Filter) => {
        setFetching(true)
        setError(undefined)

        try {
            const params = getParamsForFilter(filter)
            const response = await getJoinRequests({
                communityId,
                params,
            })
            const result = update(response, joinRequestsSchema)
            setIds(result)
        } catch (e) {
            console.warn(e)
            setError(e)
        } finally {
            setFetching(false)
        }
    }, [update])

    const approve = useCallback(async (communityId: CommunityId, joinRequestId: string) => {
        try {
            const response = await updateJoinRequest({
                communityId,
                joinRequestId,
                state: 'ACCEPTED',
            })
            update(response, joinRequestSchema)
        } catch (e) {
            console.warn(e)
        }
    }, [update])

    const addRequest = useCallback(async (communityId: CommunityId, memberAddress: Address) => {
        try {
            const response = await addJoinRequest({
                communityId,
                memberAddress,
            })
            update(response, joinRequestSchema)
        } catch (e) {
            console.warn(e)
        }
    }, [update])

    const members = useMemo(() => denormalize(ids, joinRequestsSchema, entities), [ids, entities])

    return useMemo(() => ({
        load,
        fetching,
        ids,
        members,
        error,
        approve,
        addRequest,
    }), [
        load,
        fetching,
        ids,
        members,
        error,
        approve,
        addRequest,
    ])
}

export default useJoinRequests
