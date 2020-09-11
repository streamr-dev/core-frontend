// @flow

import cloneDeep from 'lodash/cloneDeep'
import { I18n } from 'react-redux-i18n'

import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Stream, StreamId, StreamIdList, StreamFieldList, StreamStatus } from '$shared/flowtype/stream-types'
import type { Filter } from '$userpages/flowtype/common-types'
import type { ResourceId } from '$userpages/flowtype/permission-types'

import Notification from '$shared/utils/Notification'
import Activity, { actionTypes, resourceTypes } from '$shared/utils/Activity'
import { NotificationIcon } from '$shared/utils/constants'
import { streamsSchema, streamSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import * as api from '$shared/utils/api'
import { getParamsForFilter } from '$userpages/utils/filters'
import routes from '$routes'
import { removeResourcePermissions } from '$userpages/modules/permission/actions'
import { getResourcePermissions } from '$userpages/modules/permission/services'

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

export const SAVE_STREAM_FIELDS_REQUEST = 'userpages/streams/SAVE_STREAM_FIELDS_REQUEST'
export const SAVE_STREAM_FIELDS_SUCCESS = 'userpages/streams/SAVE_STREAM_FIELDS_SUCCESS'
export const SAVE_STREAM_FIELDS_FAILURE = 'userpages/streams/SAVE_STREAM_FIELDS_FAILURE'

export const OPEN_STREAM = 'userpages/streams/OPEN_STREAM'
export const UPDATE_EDIT_STREAM = 'userpages/streams/UPDATE_EDIT_STREAM'
export const UPDATE_EDIT_STREAM_FIELD = 'userpages/streams/UPDATE_EDIT_STREAM_FIELD'

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

const saveFieldsRequest = () => ({
    type: SAVE_STREAM_FIELDS_REQUEST,
})

const saveFieldsSuccess = (id: StreamId) => ({
    type: SAVE_STREAM_FIELDS_SUCCESS,
    id,
})

const saveFieldsFailure = (error: ErrorInUi) => ({
    type: SAVE_STREAM_FIELDS_FAILURE,
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

export const getStream = (id: StreamId) => (dispatch: Function) => {
    dispatch(getStreamRequest())
    return services.getStream(id)
        .then(handleEntities(streamSchema, dispatch))
        .then((id) => dispatch(getStreamSuccess(id)))
        .catch((e) => {
            dispatch(getStreamFailure(e))
            throw e
        })
}

export const updateStreamStatus = (id: StreamId) => (dispatch: Function) => (
    services.getStreamStatus(id)
        .then(({ ok, date }: StreamStatus) => ({
            id,
            streamStatus: ok ? 'ok' : 'error',
            lastData: date,
        }))
        .then(handleEntities(streamSchema, dispatch))
        .catch((e) => {
            // not sure if we want to spam the user with errors, for now, console log
            /* eslint-disable no-console */
            console.log('stream status issue: ', id)
            console.log(e)
            throw e
        })
)

export const updateStreamStatuses = (ids: StreamIdList) => (dispatch: Function) => {
    let cancelled = false

    const fetchStatuses = async () => {
        for (let index = 0; index < ids.length && !cancelled; index += 1) {
            try {
                // eslint-disable-next-line no-await-in-loop
                await dispatch(updateStreamStatus(ids[index]))
            } catch (e) {
                // ignore error and continue, updateStreamStatus() already logs the issue
            }
        }
    }

    fetchStatuses()

    return () => {
        cancelled = true
    }
}

let streamStatusCancel = () => null

export const cancelStreamStatusFetch = () => {
    streamStatusCancel()
}

type GetStreamParams = {
    replace?: boolean,
    filter?: Filter,
    updateStatus?: boolean,
}

// eslint-disable-next-line max-len
export const getStreams = ({ replace = false, filter = {}, updateStatus = true }: GetStreamParams = {}) => (dispatch: Function, getState: Function) => {
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

    streamStatusCancel()

    return services.getStreams(params, pageSize, offset)
        .then(({ streams, hasMoreResults }) => {
            const ids = handleEntities(streamsSchema, dispatch)(streams.map((stream) => ({
                ...stream,
                streamStatus: 'inactive',
            })))
            if (replace) {
                dispatch(clearStreamsListAction())
            }
            dispatch(getStreamsSuccess(ids, hasMoreResults))

            if (updateStatus) {
                streamStatusCancel = dispatch(updateStreamStatuses(ids))
            }
        })
        .catch((e) => {
            dispatch(getStreamsFailure(e))
            Notification.push({
                title: e.message,
                icon: NotificationIcon.ERROR,
            })
            throw e
        })
}

export const getStreamStatus = (id: StreamId) => (dispatch: Function) => {
    handleEntities(streamSchema, dispatch)({
        id,
        streamStatus: 'inactive',
        lastData: null,
    })
    return dispatch(updateStreamStatus(id))
}

export const createStream = (options: { name: string, description: ?string }) => (dispatch: Function): Promise<StreamId> => {
    dispatch(createStreamRequest())
    return new Promise((resolve, reject) => {
        services.postStream(options)
            .then((data: Stream) => {
                Notification.push({
                    title: 'Stream created successfully!',
                    icon: NotificationIcon.CHECKMARK,
                })
                Activity.push({
                    action: actionTypes.CREATE,
                    resourceId: data.id,
                    resourceType: resourceTypes.STREAM,
                })
                return data
            })
            .then(handleEntities(streamSchema, dispatch))
            .then((id) => {
                dispatch(createStreamSuccess(id))
                resolve(id)
            })
            .catch((e) => {
                dispatch(createStreamFailure(e))
                Notification.push({
                    title: e.message,
                    icon: NotificationIcon.ERROR,
                })
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
            Notification.push({
                title: I18n.t('userpages.streams.actions.saveStreamSuccess'),
                icon: NotificationIcon.CHECKMARK,
            })
        })
        .catch((e) => {
            dispatch(updateStreamFailure(e))
            Notification.push({
                title: e.message,
                icon: NotificationIcon.ERROR,
            })
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

export const saveFields = (id: StreamId, fields: StreamFieldList) => (dispatch: Function) => {
    dispatch(saveFieldsRequest())
    return api.post({
        url: `${process.env.STREAMR_API_URL}/streams/${id}/fields`,
        data: fields,
    })
        .then((data) => ({
            id,
            config: {
                fields: data,
            },
        }))
        .then(handleEntities(streamSchema, dispatch))
        .then((id) => {
            dispatch(saveFieldsSuccess(id))
            Notification.push({
                title: 'Fields saved successfully',
                icon: NotificationIcon.CHECKMARK,
            })
        })
        .catch((e) => {
            dispatch(saveFieldsFailure(e))
            Notification.push({
                title: e.message,
                icon: NotificationIcon.ERROR,
            })
            throw e
        })
}

export const updateEditStream = (stream: ?Stream) => ({
    type: UPDATE_EDIT_STREAM,
    stream,
})

export const updateEditStreamField = (field: string, data: any) => ({
    type: UPDATE_EDIT_STREAM_FIELD,
    field,
    data,
})

export const initEditStream = () => (dispatch: Function, getState: Function) => {
    const stream = selectOpenStream(getState())
    if (stream) {
        dispatch(updateEditStream({
            id: stream.id || '',
            name: stream.name || '',
            description: stream.description || '',
            config: cloneDeep(stream.config) || {},
            lastUpdated: stream.lastUpdated || 0,
            autoConfigure: stream.autoConfigure || false,
            partitions: stream.partitions || 1,
            requireSignedData: stream.requireSignedData || false,
            requireEncryptedData: stream.requireEncryptedData || false,
            inactivityThresholdHours: stream.inactivityThresholdHours || 0,
            uiChannel: stream.uiChannel || false,
            storageDays: stream.storageDays !== undefined ? stream.storageDays : 365,
            streamStatus: stream.streamStatus,
        }))
    }
}

export const initNewStream = (initData: ?any) => (dispatch: Function) => {
    dispatch(updateEditStream(Object.assign({}, {
        id: '',
        name: '',
        description: '',
        config: {},
        lastUpdated: 0,
        autoConfigure: false,
        partitions: 1,
        inactivityThresholdHours: 0,
        requireSignedData: false,
        requireEncryptedData: false,
        storageDays: 365,
        uiChannel: false,
    }, initData)))
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
                dispatch(getStreamFieldAutodetectSuccess(fields))
                Notification.push({
                    title: 'Fields autodetected!',
                    icon: NotificationIcon.CHECKMARK,
                })
            }
        }, (err) => {
            if (err) {
                dispatch(getStreamFieldAutodetectFailure(err))
                Notification.push({
                    title: err.message,
                    icon: NotificationIcon.ERROR,
                })
            }
        })
}

export const openStream = (id: ?StreamId) => ({
    type: OPEN_STREAM,
    id,
})

export const closeStream = () => openStream(null)
