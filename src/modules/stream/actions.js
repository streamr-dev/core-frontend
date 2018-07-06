// @flow

import {
    error as errorNotification,
    success as successNotification,
} from 'react-notification-system-redux'

import type { ErrorInUi } from '../../flowtype/common-types'
import type { Stream, CSVImporterSchema } from '../../flowtype/stream-types'
import type { Permission } from '../../flowtype/permission-types'
import * as api from '../../utils/api'

type StreamId = $ElementType<Stream, 'id'>
type PermissionOperation = Array<$ElementType<Permission, 'operation'>>
type StreamFields = $ElementType<$ElementType<Stream, 'config'>, 'fields'>

export const GET_STREAM_REQUEST = 'GET_STREAM_REQUEST'
export const GET_STREAM_SUCCESS = 'GET_STREAM_SUCCESS'
export const GET_STREAM_FAILURE = 'GET_STREAM_FAILURE'

export const GET_MY_STREAM_PERMISSIONS_REQUEST = 'GET_MY_STREAM_PERMISSIONS_REQUEST'
export const GET_MY_STREAM_PERMISSIONS_SUCCESS = 'GET_MY_STREAM_PERMISSIONS_SUCCESS'
export const GET_MY_STREAM_PERMISSIONS_FAILURE = 'GET_MY_STREAM_PERMISSIONS_FAILURE'

export const CREATE_STREAM_REQUEST = 'CREATE_STREAM_REQUEST'
export const CREATE_STREAM_SUCCESS = 'CREATE_STREAM_SUCCESS'
export const CREATE_STREAM_FAILURE = 'CREATE_STREAM_FAILURE'

export const UPDATE_STREAM_REQUEST = 'UPDATE_STREAM_REQUEST'
export const UPDATE_STREAM_SUCCESS = 'UPDATE_STREAM_SUCCESS'
export const UPDATE_STREAM_FAILURE = 'UPDATE_STREAM_FAILURE'

export const DELETE_STREAM_REQUEST = 'DELETE_STREAM_REQUEST'
export const DELETE_STREAM_SUCCESS = 'DELETE_STREAM_SUCCESS'
export const DELETE_STREAM_FAILURE = 'DELETE_STREAM_FAILURE'

export const SAVE_STREAM_FIELDS_REQUEST = 'SAVE_STREAM_FIELDS_REQUEST'
export const SAVE_STREAM_FIELDS_SUCCESS = 'SAVE_STREAM_FIELDS_SUCCESS'
export const SAVE_STREAM_FIELDS_FAILURE = 'SAVE_STREAM_FIELDS_FAILURE'

export const UPLOAD_CSV_FILE_REQUEST = 'UPLOAD_CSV_FILE_REQUEST'
export const UPLOAD_CSV_FILE_SUCCESS = 'UPLOAD_CSV_FILE_SUCCESS'
export const UPLOAD_CSV_FILE_UNKNOWN_SCHEMA = 'UPLOAD_CSV_FILE_UNKNOWN_SCHEMA'
export const UPLOAD_CSV_FILE_FAILURE = 'UPLOAD_CSV_FILE_FAILURE'

export const CONFIRM_CSV_FILE_UPLOAD_REQUEST = 'CONFIRM_CSV_FILE_UPLOAD_REQUEST'
export const CONFIRM_CSV_FILE_UPLOAD_SUCCESS = 'CONFIRM_CSV_FILE_UPLOAD_SUCCESS'
export const CONFIRM_CSV_FILE_UPLOAD_FAILURE = 'CONFIRM_CSV_FILE_UPLOAD_FAILURE'

export const CANCEL_CSV_FILE_UPLOAD = 'CANCEL_CSV_FILE_UPLOAD'
export const OPEN_STREAM = 'OPEN_STREAM'

const apiUrl = `${process.env.STREAMR_API_URL}/streams`

export const openStream = (id: StreamId) => ({
    type: OPEN_STREAM,
    id,
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

const getMyStreamPermissionsRequest = () => ({
    type: GET_MY_STREAM_PERMISSIONS_REQUEST,
})

const getMyStreamPermissionsSuccess = (id: StreamId, permissions: PermissionOperation) => ({
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

const saveFieldsSuccess = (id: StreamId, fields: StreamFields) => ({
    type: SAVE_STREAM_FIELDS_SUCCESS,
    id,
    fields,
})

const saveFieldsFailure = (error: ErrorInUi) => ({
    type: SAVE_STREAM_FIELDS_FAILURE,
    error,
})

const updateStreamRequest = () => ({
    type: UPDATE_STREAM_REQUEST,
})

const updateStreamSuccess = (stream: Stream) => ({
    type: UPDATE_STREAM_SUCCESS,
    stream,
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

const uploadCsvFileSuccess = () => ({
    type: UPLOAD_CSV_FILE_SUCCESS,
})

const uploadCsvFileFailure = (error: ErrorInUi) => ({
    type: UPLOAD_CSV_FILE_FAILURE,
    error,
})

const uploadCsvFileUnknownSchema = (id: $ElementType<Stream, 'id'>, fileUrl: string, schema: CSVImporterSchema) => ({
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

export const getStream = (id: StreamId) => (dispatch: Function) => {
    dispatch(getStreamRequest())
    return api.get(`${apiUrl}/${id}`)
        .then((data: Stream) => dispatch(getStreamSuccess(data)))
        .catch((e) => {
            dispatch(getStreamFailure(e))
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            throw e
        })
}

export const getMyStreamPermissions = (id: StreamId) => (dispatch: Function, getState: Function) => {
    dispatch(getMyStreamPermissionsRequest())
    return api.get(`${apiUrl}/${id}/permissions/me`)
        .then((data) => {
            const currentUser = getState().user
            return dispatch(getMyStreamPermissionsSuccess(
                id,
                data
                    .filter((item) => item.user === currentUser.username)
                    .map((item) => item.operation),
            ))
        })
        .catch((e) => {
            dispatch(getMyStreamPermissionsFailure(e))
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            throw e
        })
}

export const createStream = (options: { name: string, description: string }) => (dispatch: Function): Promise<Stream> => {
    dispatch(createStreamRequest())
    return new Promise((resolve, reject) => {
        api.post(apiUrl, options)
            .then((data: Stream) => {
                dispatch(createStreamSuccess(data))
                dispatch(successNotification({
                    title: 'Success!',
                    message: `Stream ${data.name} created successfully!`,
                }))
                resolve(data)
            })
            .catch((e) => {
                dispatch(createStreamFailure(e))
                dispatch(errorNotification({
                    title: 'Error!',
                    message: e.message,
                }))
                reject(e)
            })
    })
}

export const updateStream = (stream: Stream) => (dispatch: Function) => {
    dispatch(updateStreamRequest())
    return api.put(`${apiUrl}/${stream.id}`, stream)
        .then((data) => {
            dispatch(updateStreamSuccess(data))
            dispatch(successNotification({
                title: 'Success!',
                message: 'Stream saved successfully',
            }))
        })
        .catch((e) => {
            dispatch(updateStreamFailure(e))
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            throw e
        })
}

export const deleteStream = (stream: Stream) => (dispatch: Function): Promise<void> => {
    dispatch(deleteStreamRequest())
    return api.del(`${apiUrl}/${stream.id}`)
        .then(() => {
            dispatch(deleteStreamSuccess(stream.id))
            dispatch(successNotification({
                title: 'Success!',
                message: 'Stream deleted successfully',
            }))
        })
        .catch((e) => {
            dispatch(deleteStreamFailure(e))
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            throw e
        })
}

export const saveFields = (id: StreamId, fields: StreamFields) => (dispatch: Function) => {
    dispatch(saveFieldsRequest())
    return api.post(`${apiUrl}/${id}/fields`, fields)
        .then((data) => {
            dispatch(saveFieldsSuccess(id, data))
            dispatch(successNotification({
                title: 'Success!',
                message: 'Fields saved successfully',
            }))
        })
        .catch((e) => {
            dispatch(saveFieldsFailure(e))
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            throw e
        })
}

export const uploadCsvFile = (id: StreamId, file: File) => (dispatch: Function) => {
    const formData = new FormData()
    formData.append('file', file)
    dispatch(uploadCsvFileRequest())
    return api.post(`${apiUrl}/${id}/uploadCsvFile`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(() => {
            dispatch(uploadCsvFileSuccess())
            dispatch(successNotification({
                title: 'Success!',
                message: 'CSV file imported successfully',
            }))
        })
        .catch((e) => {
            if (e.code === 'CSV_PARSE_UNKNOWN_SCHEMA') {
                dispatch(uploadCsvFileUnknownSchema(id, e.response.data.fileUrl, e.response.data.schema))
            } else {
                dispatch(uploadCsvFileFailure(e))
                dispatch(errorNotification({
                    title: 'Error!',
                    message: e.message,
                }))
            }
            throw e
        })
}

export const confirmCsvFileUpload = (id: StreamId, fileUrl: string, dateFormat: string, timestampColumnIndex: number) => (dispatch: Function) => {
    dispatch(confirmCsvFileUploadRequest())
    return api.post(`${apiUrl}/${id}/confirmCsvFileUpload`, {
        fileUrl,
        dateFormat,
        timestampColumnIndex,
    })
        .then(() => {
            dispatch(confirmCsvFileUploadSuccess())
            dispatch(successNotification({
                title: 'Success!',
                message: 'CSV file imported successfully',
            }))
        })
        .catch((e) => {
            dispatch(confirmCsvFileUploadFailure(e))
            dispatch(errorNotification({
                title: 'Error!',
                message: e.message,
            }))
            throw e
        })
}

