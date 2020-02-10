// @flow

import cloneDeep from 'lodash/cloneDeep'
import { I18n } from 'react-redux-i18n'

import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { Stream, StreamId, StreamIdList, StreamFieldList, CSVImporterSchema, StreamStatus } from '$shared/flowtype/stream-types'
import type { Operation } from '$userpages/flowtype/permission-types'
import type { Filter } from '$userpages/flowtype/common-types'

import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { streamsSchema, streamSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import * as api from '$shared/utils/api'
import { getError } from '$shared/utils/request'
import { selectUserData } from '$shared/modules/user/selectors'
import { getParamsForFilter } from '$userpages/utils/filters'
import CsvSchemaError from '$shared/errors/CsvSchemaError'
import { formatApiUrl } from '$shared/utils/url'

import * as services from './services'
import { selectOpenStream, selectPageSize, selectOffset } from './selectors'

export const GET_STREAM_REQUEST = 'userpages/streams/GET_STREAM_REQUEST'
export const GET_STREAM_SUCCESS = 'userpages/streams/GET_STREAM_SUCCESS'
export const GET_STREAM_FAILURE = 'userpages/streams/GET_STREAM_FAILURE'

export const GET_STREAMS_REQUEST = 'userpages/streams/GET_STREAMS_REQUEST'
export const GET_STREAMS_SUCCESS = 'userpages/streams/GET_STREAMS_SUCCESS'
export const GET_STREAMS_FAILURE = 'userpages/streams/GET_STREAMS_FAILURE'
export const CLEAR_STREAM_LIST = 'userpages/streams/CLEAR_STREAM_LIST'

export const GET_MY_STREAM_PERMISSIONS_REQUEST = 'userpages/streams/GET_MY_STREAM_PERMISSIONS_REQUEST'
export const GET_MY_STREAM_PERMISSIONS_SUCCESS = 'userpages/streams/GET_MY_STREAM_PERMISSIONS_SUCCESS'
export const GET_MY_STREAM_PERMISSIONS_FAILURE = 'userpages/streams/GET_MY_STREAM_PERMISSIONS_FAILURE'

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

export const UPLOAD_CSV_FILE_REQUEST = 'userpages/streams/UPLOAD_CSV_FILE_REQUEST'
export const UPLOAD_CSV_FILE_SUCCESS = 'userpages/streams/UPLOAD_CSV_FILE_SUCCESS'
export const UPLOAD_CSV_FILE_UNKNOWN_SCHEMA = 'userpages/streams/UPLOAD_CSV_FILE_UNKNOWN_SCHEMA'
export const UPLOAD_CSV_FILE_FAILURE = 'userpages/streams/UPLOAD_CSV_FILE_FAILURE'

export const CONFIRM_CSV_FILE_UPLOAD_REQUEST = 'userpages/streams/CONFIRM_CSV_FILE_UPLOAD_REQUEST'
export const CONFIRM_CSV_FILE_UPLOAD_SUCCESS = 'userpages/streams/CONFIRM_CSV_FILE_UPLOAD_SUCCESS'
export const CONFIRM_CSV_FILE_UPLOAD_FAILURE = 'userpages/streams/CONFIRM_CSV_FILE_UPLOAD_FAILURE'

export const DELETE_DATA_UP_TO_REQUEST = 'userpages/streams/DELETE_DATA_UP_TO_REQUEST'
export const DELETE_DATA_UP_TO_SUCCESS = 'userpages/streams/DELETE_DATA_UP_TO_SUCCESS'
export const DELETE_DATA_UP_TO_FAILURE = 'userpages/streams/DELETE_DATA_UP_TO_FAILURE'

export const CANCEL_CSV_FILE_UPLOAD = 'userpages/streams/CANCEL_CSV_FILE_UPLOAD'
export const OPEN_STREAM = 'userpages/streams/OPEN_STREAM'
export const UPDATE_EDIT_STREAM = 'userpages/streams/UPDATE_EDIT_STREAM'
export const UPDATE_EDIT_STREAM_FIELD = 'userpages/streams/UPDATE_EDIT_STREAM_FIELD'
export const GET_STREAM_RANGE_REQUEST = 'userpages/streams/GET_STREAM_RANGE_REQUEST'

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

const getMyStreamPermissionsRequest = () => ({
    type: GET_MY_STREAM_PERMISSIONS_REQUEST,
})

const getMyStreamPermissionsSuccess = (id: StreamId, permissions: Array<Operation>) => ({
    type: GET_MY_STREAM_PERMISSIONS_SUCCESS,
    id,
    permissions,
})

const getMyStreamPermissionsFailure = (error: ErrorInUi) => ({
    type: GET_MY_STREAM_PERMISSIONS_FAILURE,
    error,
})

export const cancelCsvFileUpload = () => ({
    type: CANCEL_CSV_FILE_UPLOAD,
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

const uploadCsvFileRequest = () => ({
    type: UPLOAD_CSV_FILE_REQUEST,
})

const uploadCsvFileSuccess = (id: StreamId, fileUrl: string, schema: CSVImporterSchema) => ({
    type: UPLOAD_CSV_FILE_SUCCESS,
    streamId: id,
    fileUrl,
    schema,
})

const uploadCsvFileFailure = (error: ErrorInUi) => ({
    type: UPLOAD_CSV_FILE_FAILURE,
    error,
})

const uploadCsvFileUnknownSchema = (id: StreamId, fileUrl: string, schema: CSVImporterSchema) => ({
    type: UPLOAD_CSV_FILE_UNKNOWN_SCHEMA,
    streamId: id,
    fileUrl,
    schema,
})

const confirmCsvFileUploadRequest = () => ({
    type: CONFIRM_CSV_FILE_UPLOAD_REQUEST,
})

const confirmCsvFileUploadSuccess = () => ({
    type: CONFIRM_CSV_FILE_UPLOAD_SUCCESS,
})

const confirmCsvFileUploadFailure = (error: ErrorInUi) => ({
    type: CONFIRM_CSV_FILE_UPLOAD_FAILURE,
    error,
})

const deleteDataUpToRequest = () => ({
    type: DELETE_DATA_UP_TO_REQUEST,
})

const deleteDataUpToSuccess = () => ({
    type: DELETE_DATA_UP_TO_SUCCESS,
})

const deleteDataUpToFailure = (error: ErrorInUi) => ({
    type: DELETE_DATA_UP_TO_FAILURE,
    error,
})

const getStreamRangeRequest = () => ({
    type: GET_STREAM_RANGE_REQUEST,
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
            Notification.push({
                title: e.message,
                icon: NotificationIcon.ERROR,
            })
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
            // eslint-disable-next-line no-await-in-loop
            await dispatch(updateStreamStatus(ids[index]))
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
}

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
            streamStatusCancel = dispatch(updateStreamStatuses(ids))
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

export const getMyStreamPermissions = (id: StreamId) => (dispatch: Function, getState: Function) => {
    dispatch(getMyStreamPermissionsRequest())
    return services.getMyStreamPermissions(id)
        .then((data) => {
            const currentUser = selectUserData(getState()) || {}
            return dispatch(getMyStreamPermissionsSuccess(
                id,
                data
                    .filter((item) => item.user === currentUser.username)
                    .map((item) => item.operation),
            ))
        })
        .catch((e) => {
            dispatch(getMyStreamPermissionsFailure(e))
            Notification.push({
                title: e.message,
                icon: NotificationIcon.ERROR,
            })
            throw e
        })
}

export const createStream = (options: { name: string, description: ?string }) => (dispatch: Function): Promise<StreamId> => {
    dispatch(createStreamRequest())
    return new Promise((resolve, reject) => {
        services.postStream(options)
            .then((data: Stream) => {
                Notification.push({
                    title: `Stream ${data.name} created successfully!`,
                    icon: NotificationIcon.CHECKMARK,
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
            url: formatApiUrl('streams', id),
        })
        dispatch(deleteStreamSuccess(id))
        Notification.push({
            title: I18n.t('userpages.streams.actions.deleteStreamSuccess'),
            icon: NotificationIcon.CHECKMARK,
        })
        return deleteStream
    } catch (e) {
        dispatch(deleteStreamFailure(e))
        Notification.push({
            title: e.message,
            icon: NotificationIcon.ERROR,
        })
    }
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

export const uploadCsvFile = (id: StreamId, file: File) => (dispatch: Function) => {
    dispatch(uploadCsvFileRequest())
    return services.uploadCsvFile(id, file)
        .then(({ fileId, schema }) => {
            if (schema.timestampColumnIndex == null) {
                dispatch(uploadCsvFileUnknownSchema(id, fileId, schema))
                throw new CsvSchemaError('Could not parse timestamp column!')
            }
            dispatch(uploadCsvFileSuccess(id, fileId, schema))
            Notification.push({
                title: 'CSV file imported successfully',
                icon: NotificationIcon.CHECKMARK,
            })
        })
        .catch((error) => {
            const e = getError(error)
            dispatch(uploadCsvFileFailure(e))
            throw error
        })
}

export const confirmCsvFileUpload = (id: StreamId, fileUrl: string, dateFormat: string, timestampColumnIndex: number) => (dispatch: Function) => {
    dispatch(confirmCsvFileUploadRequest())
    return services.confirmCsvFileUpload(id, fileUrl, dateFormat, timestampColumnIndex)
        .then(() => {
            dispatch(confirmCsvFileUploadSuccess())
            Notification.push({
                title: 'CSV file imported successfully',
                icon: NotificationIcon.CHECKMARK,
            })
        })
        .catch((e) => {
            dispatch(confirmCsvFileUploadFailure(e))
            throw e
        })
}

export const getRange = (id: StreamId) => (dispatch: Function) => {
    dispatch(getStreamRangeRequest())
    return services.getRange(id)
}

export const deleteDataUpTo = (id: StreamId, date: Date) => (dispatch: Function) => {
    dispatch(deleteDataUpToRequest())
    return services.deleteDataUpTo(id, date)
        .then(() => {
            dispatch(deleteDataUpToSuccess())
            Notification.push({
                title: 'Data deleted succesfully',
                icon: NotificationIcon.CHECKMARK,
            })
        })
        .catch((error) => {
            const e = getError(error)
            dispatch(deleteDataUpToFailure(e))
            Notification.push({
                title: e.message,
                icon: NotificationIcon.ERROR,
            })
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
            ownPermissions: cloneDeep(stream.ownPermissions) || [],
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
        ownPermissions: [],
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

export const openStream = (id: ?StreamId, isNew: ?boolean = false) => ({
    type: OPEN_STREAM,
    id,
    isNew,
})

export const closeStream = () => openStream(null)
