// @flow

import { useState, useCallback, useMemo } from 'react'
import { denormalize } from 'normalizr'

import useEntities from '$shared/hooks/useEntities'
import type { Filter } from '$userpages/flowtype/common-types'
import type { DataUnionId } from '$mp/flowtype/product-types'
import type { Address } from '$shared/flowtype/web3-types'
import { joinRequestSchema, joinRequestsSchema } from '$shared/modules/entities/schema'
import {
    getJoinRequests,
    updateJoinRequest,
    addJoinRequest,
    removeJoinRequest,
} from '$mp/modules/dataUnion/services'
import { getParamsForFilter } from '$userpages/utils/filters'

type LoadParams = {
    dataUnionId: DataUnionId,
    filter: Filter,
}

type AddParams = {
    dataUnionId: DataUnionId,
    memberAddress: Address,
}

type UpdateParams = {
    dataUnionId: DataUnionId,
    joinRequestId: string,
}

function useJoinRequests() {
    const { update, entities } = useEntities()
    const [ids, setIds] = useState([])
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState(undefined)

    const load = useCallback(async ({ dataUnionId, filter }: LoadParams) => {
        setFetching(true)
        setError(undefined)

        try {
            const params = getParamsForFilter(filter)
            const response = await getJoinRequests({
                dataUnionId,
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

    const approve = useCallback(async ({ dataUnionId, joinRequestId }: UpdateParams) => {
        try {
            const response = await updateJoinRequest({
                dataUnionId,
                joinRequestId,
                state: 'ACCEPTED',
            })
            update({
                data: response,
                schema: joinRequestSchema,
            })
        } catch (e) {
            console.warn(e)
            throw e
        }
    }, [update])

    const addRequest = useCallback(async ({ dataUnionId, memberAddress }: AddParams) => {
        try {
            const response = await addJoinRequest({
                dataUnionId,
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

    const remove = useCallback(async ({ dataUnionId, joinRequestId }: UpdateParams) => {
        try {
            await removeJoinRequest({
                dataUnionId,
                joinRequestId,
            })
        } catch (e) {
            console.warn(e)
            throw e
        }
    }, [])

    const members = useMemo(() => (
        denormalize(ids, joinRequestsSchema, entities)
            .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
    ), [ids, entities])

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
