// @flow

import { handleActions } from 'redux-actions'

import type { DataUnionState } from '../../flowtype/store-state'

import {
    GET_DATA_UNION_REQUEST,
    GET_DATA_UNION_SUCCESS,
    GET_DATA_UNION_FAILURE,
    GET_DATA_UNION_STATS_REQUEST,
    GET_DATA_UNION_STATS_SUCCESS,
    SET_DATA_UNION_SECRETS,
    ADD_DATA_UNION_SECRET,
    REMOVE_DATA_UNION_SECRET,
    GET_DATA_UNION_STATS_FAILURE,
    GET_ALL_DATA_UNION_STATS_REQUEST,
    RESET_DATA_UNION_STATS,
} from './constants'
import type {
    DataUnionIdAction,
    DataUnionIdsAction,
    DataUnionSecretsAction,
    DataUnionSecretAction,
} from './types'

export const initialState: DataUnionState = {
    id: null,
    fetching: false,
    requested: [],
    ready: [],
    fetchingStats: [],
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

    [GET_DATA_UNION_REQUEST]: (state: DataUnionState) => ({
        ...state,
        id: undefined,
        fetching: true,
    }),

    [GET_DATA_UNION_SUCCESS]: (state: DataUnionState, action: DataUnionIdAction) => ({
        ...state,
        id: action.payload.id,
        fetching: false,
    }),

    [GET_DATA_UNION_FAILURE]: (state: DataUnionState) => ({
        ...state,
        fetching: false,
    }),

    [GET_ALL_DATA_UNION_STATS_REQUEST]: (state: DataUnionState, action: DataUnionIdsAction) => ({
        ...state,
        requested: [...new Set(action.payload.ids)],
        fetchingStats: [...new Set(action.payload.ids)],
    }),

    [GET_DATA_UNION_STATS_REQUEST]: (state: DataUnionState, action: DataUnionIdAction) => ({
        ...state,
        requested: [...new Set([...state.requested, action.payload.id])],
        fetchingStats: [...new Set([...state.fetchingStats, action.payload.id])],
    }),

    [GET_DATA_UNION_STATS_SUCCESS]: (state: DataUnionState, action: DataUnionIdAction) => {
        const ready = [
            ...new Set([
                ...state.ready,
                action.payload.id,
            ]),
        ]
        const fetchingStats = new Set(state.fetchingStats)
        fetchingStats.delete(action.payload.id)

        return {
            ...state,
            ready: [...ready],
            fetchingStats: [...fetchingStats],
        }
    },

    [GET_DATA_UNION_STATS_FAILURE]: (state: DataUnionState, action: DataUnionIdAction) => {
        const fetchingStats = new Set(state.fetchingStats)
        fetchingStats.delete(action.payload.id)

        return {
            ...state,
            fetchingStats: [...fetchingStats],
        }
    },

    [RESET_DATA_UNION_STATS]: (state: DataUnionState) => ({
        ...state,
        requested: [],
        ready: [],
        fetchingStats: [],
    }),

}, initialState)

export default reducer
