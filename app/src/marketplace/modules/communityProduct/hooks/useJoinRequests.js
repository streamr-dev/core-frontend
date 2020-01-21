// @flow

import { useState, useCallback, useMemo } from 'react'
import { denormalize } from 'normalizr'

import useEntities from '$shared/hooks/useEntities'
import type { Filter } from '$userpages/flowtype/common-types'
import type { CommunityId } from '$mp/flowtype/product-types'
import type { Address } from '$shared/flowtype/web3-types'
import { joinRequestSchema, joinRequestsSchema } from '$shared/modules/entities/schema'
import {
    getJoinRequests,
    updateJoinRequest,
    addJoinRequest,
    removeJoinRequest,
} from '$mp/modules/communityProduct/services'
import { getParamsForFilter } from '$userpages/utils/filters'

type LoadParams = {
    communityId: CommunityId,
    filter: Filter,
}

type AddParams = {
    communityId: CommunityId,
    memberAddress: Address,
}

type UpdateParams = {
    communityId: CommunityId,
    joinRequestId: string,
}

function useJoinRequests() {
    const { update, entities } = useEntities()
    const [ids, setIds] = useState([])
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState(undefined)

    const load = useCallback(async ({ communityId, filter }: LoadParams) => {
        setFetching(true)
        setError(undefined)

        try {
            const params = getParamsForFilter(filter)
            const response = await getJoinRequests({
                communityId,
                params,
            })
            const result = update({
                data: response,
                schema: joinRequestsSchema,
            })
            setIds(result)
        } catch (e) {
            console.warn(e)
            setError(e)
        } finally {
            setFetching(false)
        }
    }, [update])

    const approve = useCallback(async ({ communityId, joinRequestId }: UpdateParams) => {
        try {
            const response = await updateJoinRequest({
                communityId,
                joinRequestId,
                state: 'ACCEPTED',
            })
            update({
                data: response,
                schema: joinRequestSchema,
            })
        } catch (e) {
            console.warn(e)
        }
    }, [update])

    const addRequest = useCallback(async ({ communityId, memberAddress }: AddParams) => {
        try {
            const response = await addJoinRequest({
                communityId,
                memberAddress,
            })
            update({
                data: response,
                schema: joinRequestSchema,
            })
        } catch (e) {
            console.warn(e)
        }
    }, [update])

    const remove = useCallback(async ({ communityId, joinRequestId }: UpdateParams) => {
        try {
            await removeJoinRequest({
                communityId,
                joinRequestId,
            })
        } catch (e) {
            console.warn(e)
        }
    }, [])

    const members = useMemo(() => denormalize(ids, joinRequestsSchema, entities), [ids, entities])

    return useMemo(() => ({
        load,
        fetching,
        ids,
        members,
        error,
        approve,
        addRequest,
        remove,
    }), [
        load,
        fetching,
        ids,
        members,
        error,
        approve,
        addRequest,
        remove,
    ])
}

export default useJoinRequests
