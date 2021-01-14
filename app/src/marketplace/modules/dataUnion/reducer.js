// @flow

import { handleActions } from 'redux-actions'

import type { DataUnionState } from '../../flowtype/store-state'

import {
    GET_DATA_UNION_REQUEST,
    GET_DATA_UNION_SUCCESS,
    GET_DATA_UNION_FAILURE,
    GET_ALL_DATA_UNIONS_REQUEST,
    GET_ALL_DATA_UNIONS_SUCCESS,
    GET_ALL_DATA_UNIONS_FAILURE,
    SET_DATA_UNION_SECRETS,
    ADD_DATA_UNION_SECRET,
    REMOVE_DATA_UNION_SECRET,
} from './constants'
import type {
    DataUnionIdAction,
    DataUnionErrorAction,
    DataUnionIdsAction,
    DataUnionsErrorAction,
    DataUnionSecretsAction,
    DataUnionSecretAction,
} from './types'

export const initialState: DataUnionState = {
    id: null,
    fetching: false,
    error: null,
    fetchingStats: false,
    ids: [],
    statsError: null,
    secrets: [],
}

const reducer: (DataUnionState) => DataUnionState = handleActions({
    [SET_DATA_UNION_SECRETS]: (state: DataUnionState, action: DataUnionSecretsAction) => {
        const nextSecrets = new Set(action.payload.secrets)

        return {
            ...state,
            secrets: [...nextSecrets],
        }
    },

    [ADD_DATA_UNION_SECRET]: (state: DataUnionState, action: DataUnionSecretAction) => {
        const nextSecrets = new Set([...state.secrets, action.payload.secret])

        return {
            ...state,
            secrets: [...nextSecrets],
        }
    },

    [REMOVE_DATA_UNION_SECRET]: (state: DataUnionState, action: DataUnionSecretAction) => {
        const nextSecrets = new Set(state.secrets)
        nextSecrets.delete(action.payload.secret)

        return {
            ...state,
            secrets: [...nextSecrets],
        }
    },

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
