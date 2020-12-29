// @flow

import { handleActions } from 'redux-actions'

import type { DataUnionState } from '../../flowtype/store-state'

import {
    GET_DATA_UNION_SECRETS_REQUEST,
    GET_DATA_UNION_SECRETS_SUCCESS,
    GET_DATA_UNION_SECRETS_FAILURE,
    GET_DATA_UNION_REQUEST,
    GET_DATA_UNION_SUCCESS,
    GET_DATA_UNION_FAILURE,
    GET_ALL_DATA_UNIONS_REQUEST,
    GET_ALL_DATA_UNIONS_SUCCESS,
    GET_ALL_DATA_UNIONS_FAILURE,

} from './constants'
import type {
    DataUnionIdAction,
    DataUnionErrorAction,
    DataUnionIdsAction,
    DataUnionsErrorAction,
    DataUnionSecretsAction,
} from './types'

export const initialState: DataUnionState = {
    id: null,
    fetching: false,
    error: null,
    fetchingStats: false,
    ids: [],
    statsError: null,
    secrets: [],
    fetchingSecrets: false,
    secretsError: null,
}

const reducer: (DataUnionState) => DataUnionState = handleActions({
    [GET_DATA_UNION_SECRETS_REQUEST]: (state: DataUnionState) => ({
        ...state,
        secrets: [],
        fetchingSecrets: true,
        secretsError: null,
    }),

    [GET_DATA_UNION_SECRETS_SUCCESS]: (state: DataUnionState, action: DataUnionSecretsAction) => ({
        ...state,
        secrets: action.payload.secrets,
        fetchingSecrets: false,
        secretsError: null,
    }),

    [GET_DATA_UNION_SECRETS_FAILURE]: (state: DataUnionState, action: DataUnionErrorAction) => ({
        ...state,
        fetchingSecrets: false,
        secretsError: action.payload.error,
    }),

    [GET_DATA_UNION_REQUEST]: (state: DataUnionState, action: DataUnionIdAction) => ({
        ...state,
        id: action.payload.id,
        fetching: true,
        error: null,
    }),

    [GET_DATA_UNION_SUCCESS]: (state: DataUnionState) => ({
        ...state,
        fetching: false,
    }),

    [GET_DATA_UNION_FAILURE]: (state: DataUnionState, action: DataUnionErrorAction) => ({
        ...state,
        error: action.payload.error,
        fetching: false,
    }),

    [GET_ALL_DATA_UNIONS_REQUEST]: (state: DataUnionState) => ({
        ...state,
        fetchingStats: true,
        statsError: null,
    }),

    [GET_ALL_DATA_UNIONS_SUCCESS]: (state: DataUnionState, action: DataUnionIdsAction) => ({
        ...state,
        fetchingStats: false,
        ids: action.payload.ids,
    }),

    [GET_ALL_DATA_UNIONS_FAILURE]: (state: DataUnionState, action: DataUnionsErrorAction) => ({
        ...state,
        fetchingStats: false,
        statsError: action.payload.error,
    }),

}, initialState)

export default reducer
