// @flow

import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { StreamId, StreamIdList } from '$shared/flowtype/stream-types'
import type { Filter } from '$userpages/flowtype/common-types'
import type { ResourceId } from '$userpages/flowtype/permission-types'

import { streamsSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import * as api from '$shared/utils/api'
import { getParamsForFilter } from '$userpages/utils/filters'
import { removeResourcePermissions } from '$userpages/modules/permission/actions'
import { getResourcePermissions } from '$userpages/modules/permission/services'
import routes from '$routes'

import * as services from './services'
import { selectPageSize, selectOffset } from './selectors'

export const GET_STREAMS_REQUEST = 'userpages/streams/GET_STREAMS_REQUEST'
export const GET_STREAMS_SUCCESS = 'userpages/streams/GET_STREAMS_SUCCESS'
export const GET_STREAMS_FAILURE = 'userpages/streams/GET_STREAMS_FAILURE'
export const CLEAR_STREAM_LIST = 'userpages/streams/CLEAR_STREAM_LIST'

export const CREATE_STREAM_REQUEST = 'userpages/streams/CREATE_STREAM_REQUEST'
export const CREATE_STREAM_SUCCESS = 'userpages/streams/CREATE_STREAM_SUCCESS'
export const CREATE_STREAM_FAILURE = 'userpages/streams/CREATE_STREAM_FAILURE'

export const DELETE_STREAM_REQUEST = 'userpages/streams/DELETE_STREAM_REQUEST'
export const DELETE_STREAM_SUCCESS = 'userpages/streams/DELETE_STREAM_SUCCESS'
export const DELETE_STREAM_FAILURE = 'userpages/streams/DELETE_STREAM_FAILURE'

const getStreamsRequest = () => ({
    type: GET_STREAMS_REQUEST,
})

const getStreamsSuccess = (streams: StreamIdList, hasMoreResults: boolean) => ({
    type: GET_STREAMS_SUCCESS,
    streams,
    hasMoreResults,
})

const getStreamsFailure = (error: ErrorInUi) => ({
    type: GET_STREAMS_FAILURE,
    error,
})

const deleteStreamRequest = () => ({
    type: DELETE_STREAM_REQUEST,
})

const deleteStreamSuccess = (id: StreamId) => ({
    type: DELETE_STREAM_SUCCESS,
    id,
})

const deleteStreamFailure = (error: ErrorInUi) => ({
    type: DELETE_STREAM_FAILURE,
    error,
})

const clearStreamsListAction = () => ({
    type: CLEAR_STREAM_LIST,
})

export const clearStreamsList = () => (dispatch: Function) => (
    dispatch(clearStreamsListAction())
)

type GetStreamParams = {
    replace?: boolean,
    filter?: Filter,
}

// eslint-disable-next-line max-len
export const getStreams = ({ replace = false, filter = {} }: GetStreamParams = {}) => (dispatch: Function, getState: Function) => {
    dispatch(getStreamsRequest())

    const state = getState()
    const params = getParamsForFilter(filter, {
        uiChannel: false,
        sortBy: 'lastUpdated',
    })
    const pageSize = selectPageSize(state)
    let offset = selectOffset(state)

    // If we are replacing, reset the offset before API call
    if (replace) {
        offset = 0
    }

    return services.getStreams(params, pageSize, offset)
        .then(({ streams, hasMoreResults }) => {
            const ids = handleEntities(streamsSchema, dispatch)(streams)
            if (replace) {
                dispatch(clearStreamsListAction())
            }
            dispatch(getStreamsSuccess(ids, hasMoreResults))
        })
        .catch((e) => {
            dispatch(getStreamsFailure(e))
            throw e
        })
}

export const deleteStream = (id: StreamId) => async (dispatch: Function): Promise<void> => {
    dispatch(deleteStreamRequest())
    try {
        const deleteStream = await api.del({
            url: routes.api.streams.show({
                id,
            }),
        })
        dispatch(deleteStreamSuccess(id))
        return deleteStream
    } catch (e) {
        dispatch(deleteStreamFailure(e))
        throw e
    }
}

export const removeStream = (id: StreamId, resourcePermissions: Array<ResourceId>) => async (dispatch: Function) => {
    dispatch(deleteStreamRequest())
    try {
        const removeStream = await dispatch(removeResourcePermissions('STREAM', id, resourcePermissions))
        dispatch(deleteStreamSuccess(id))
        return removeStream
    } catch (e) {
        dispatch(deleteStreamFailure(e))
        throw e
    }
}

export const deleteOrRemoveStream = (id: StreamId) => async (dispatch: Function) => {
    const resourcePermissions = await getResourcePermissions({
        resourceType: 'STREAM',
        resourceId: id,
        id: 'me',
    })

    const permissionIds = (resourcePermissions || []).reduce((result, { id, operation }) => ({
        ...result,
        [id]: operation,
    }), {})

    if (Object.values(permissionIds).includes('stream_delete')) {
        return dispatch(deleteStream(id))
    }

    return dispatch(removeStream(id, Object.keys(permissionIds)))
}
