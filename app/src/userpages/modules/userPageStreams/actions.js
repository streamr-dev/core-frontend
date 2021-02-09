// @flow

import set from 'lodash/set'

import uuid from 'uuid'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Stream, StreamId, StreamIdList, StreamFieldList } from '$shared/flowtype/stream-types'
import type { Filter } from '$userpages/flowtype/common-types'
import type { ResourceId } from '$userpages/flowtype/permission-types'

import { streamsSchema, streamSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import * as api from '$shared/utils/api'
import { getParamsForFilter } from '$userpages/utils/filters'
import { removeResourcePermissions } from '$userpages/modules/permission/actions'
import { getResourcePermissions } from '$userpages/modules/permission/services'
import routes from '$routes'

import * as services from './services'
import { selectOpenStream, selectPageSize, selectOffset } from './selectors'

export const GET_STREAM_REQUEST = 'userpages/streams/GET_STREAM_REQUEST'
export const GET_STREAM_SUCCESS = 'userpages/streams/GET_STREAM_SUCCESS'
export const GET_STREAM_FAILURE = 'userpages/streams/GET_STREAM_FAILURE'

export const GET_STREAMS_REQUEST = 'userpages/streams/GET_STREAMS_REQUEST'
export const GET_STREAMS_SUCCESS = 'userpages/streams/GET_STREAMS_SUCCESS'
export const GET_STREAMS_FAILURE = 'userpages/streams/GET_STREAMS_FAILURE'
export const CLEAR_STREAM_LIST = 'userpages/streams/CLEAR_STREAM_LIST'

export const CREATE_STREAM_REQUEST = 'userpages/streams/CREATE_STREAM_REQUEST'
export const CREATE_STREAM_SUCCESS = 'userpages/streams/CREATE_STREAM_SUCCESS'
export const CREATE_STREAM_FAILURE = 'userpages/streams/CREATE_STREAM_FAILURE'

export const UPDATE_STREAM_REQUEST = 'userpages/streams/UPDATE_STREAM_REQUEST'
export const UPDATE_STREAM_SUCCESS = 'userpages/streams/UPDATE_STREAM_SUCCESS'
export const UPDATE_STREAM_FAILURE = 'userpages/streams/UPDATE_STREAM_FAILURE'

export const DELETE_STREAM_REQUEST = 'userpages/streams/DELETE_STREAM_REQUEST'
export const DELETE_STREAM_SUCCESS = 'userpages/streams/DELETE_STREAM_SUCCESS'
export const DELETE_STREAM_FAILURE = 'userpages/streams/DELETE_STREAM_FAILURE'

export const OPEN_STREAM = 'userpages/streams/OPEN_STREAM'

export const STREAM_FIELD_AUTODETECT_REQUEST = 'userpages/streams/STREAM_FIELD_AUTODETECT_REQUEST'
export const STREAM_FIELD_AUTODETECT_SUCCESS = 'userpages/streams/STREAM_FIELD_AUTODETECT_SUCCESS'
export const STREAM_FIELD_AUTODETECT_FAILURE = 'userpages/streams/STREAM_FIELD_AUTODETECT_FAILURE'

const getStreamFieldAutodetectRequest = () => ({
    type: STREAM_FIELD_AUTODETECT_REQUEST,
})

const getStreamFieldAutodetectSuccess = (fields: StreamFieldList) => ({
    type: STREAM_FIELD_AUTODETECT_SUCCESS,
    fields,
})

const getStreamFieldAutodetectFailure = (error: ErrorInUi) => ({
    type: STREAM_FIELD_AUTODETECT_FAILURE,
    error,
})

const getStreamRequest = () => ({
    type: GET_STREAM_REQUEST,
})

const getStreamSuccess = (stream: Stream) => ({
    type: GET_STREAM_SUCCESS,
    stream,
})

const getStreamFailure = (error: ErrorInUi) => ({
    type: GET_STREAM_FAILURE,
    error,
})

const getStreamsRequest = () => ({
    type: GET_STREAMS_REQUEST,
})

const getStreamsSuccess = (streams: StreamIdList, hasMoreResults: boolean) => ({
    type: GET_STREAMS_SUCCESS,
    streams,
    hasMoreResults,
})

const getStreamsFailure = (error: ErrorInUi) => ({
    type: GET_STREAM_FAILURE,
    error,
})

const updateStreamRequest = () => ({
    type: UPDATE_STREAM_REQUEST,
})

const updateStreamSuccess = (id: StreamId) => ({
    type: UPDATE_STREAM_SUCCESS,
    id,
})

const updateStreamFailure = (error: ErrorInUi) => ({
    type: UPDATE_STREAM_FAILURE,
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

const createStreamRequest = () => ({
    type: CREATE_STREAM_REQUEST,
})

const createStreamSuccess = (stream: Stream) => ({
    type: CREATE_STREAM_SUCCESS,
    stream,
})

const createStreamFailure = (error: ErrorInUi) => ({
    type: CREATE_STREAM_FAILURE,
    error,
})

const clearStreamsListAction = () => ({
    type: CLEAR_STREAM_LIST,
})

export const clearStreamsList = () => (dispatch: Function) => (
    dispatch(clearStreamsListAction())
)

const mapStreamFields = (stream: Stream): Stream => {
    const { config } = stream

    if (!config || !config.fields) {
        return stream
    }

    return {
        ...stream,
        config: {
            ...config,
            fields: (config.fields || []).map((field) => ({
                ...field,
                id: field.id ? field.id : uuid(),
            })),
        },
    }
}

export const getStream = (id: StreamId) => (dispatch: Function) => {
    dispatch(getStreamRequest())
    return services.getStream(id)
        .then(mapStreamFields)
        .then(handleEntities(streamSchema, dispatch))
        .then((id) => dispatch(getStreamSuccess(id)))
        .catch((e) => {
            dispatch(getStreamFailure(e))
            throw e
        })
}

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

export const createStream = (options: { id: string, description: ?string }) => (dispatch: Function): Promise<StreamId> => {
    dispatch(createStreamRequest())
    return new Promise((resolve, reject) => {
        services.postStream(options)
            .then(handleEntities(streamSchema, dispatch))
            .then((id) => {
                dispatch(createStreamSuccess(id))
                resolve(id)
            })
            .catch((e) => {
                dispatch(createStreamFailure(e))
                reject(e)
            })
    })
}

export const updateStream = (stream: Stream) => (dispatch: Function) => {
    dispatch(updateStreamRequest())
    return services.putStream(stream.id, stream)
        .then(() => handleEntities(streamSchema, dispatch)(stream))
        .then(() => {
            dispatch(updateStreamSuccess(stream.id))
        })
        .catch((e) => {
            dispatch(updateStreamFailure(e))
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

export const updateEditStream = (stream: ?Stream) => (dispatch: Function, getState: Function) => {
    const state = getState()
    const { id } = selectOpenStream(state) || {}

    if (id) {
        handleEntities(streamSchema, dispatch)({
            id,
            ...stream,
        })
    }
}

export const updateEditStreamField = (field: string, data: any) => (dispatch: Function, getState: Function) => {
    const state = getState()
    const stream = selectOpenStream(state)

    set(stream, field, data)

    handleEntities(streamSchema, dispatch)(stream)
}

export const streamFieldsAutodetect = (id: StreamId) => (dispatch: Function) => {
    dispatch(getStreamFieldAutodetectRequest())
    return services.autodetectStreamfields(id)
        .then((data) => ({
            id,
            config: {
                fields: data.config.fields,
            },
        }))
        .then(({ config: { fields } }) => {
            if (fields) {
                dispatch(updateEditStreamField('config.fields', fields))
                dispatch(getStreamFieldAutodetectSuccess(fields))
            }
        }, (err) => {
            if (err) {
                dispatch(getStreamFieldAutodetectFailure(err))
                throw err
            }
        })
}

export const openStream = (id: ?StreamId) => ({
    type: OPEN_STREAM,
    id,
})

export const closeStream = () => openStream(null)
