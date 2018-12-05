// @flow

import { handleActions } from 'redux-actions'

import type { IntegrationKeyState } from '$shared/flowtype/store-state'

import type {
    IntegrationKeysAction,
    IntegrationKeysErrorAction,
} from './types'
import {
    INTEGRATION_KEYS_REQUEST,
    INTEGRATION_KEYS_SUCCESS,
    INTEGRATION_KEYS_FAILURE,
} from './constants'

export const initialState: IntegrationKeyState = {
    ethereumIdentities: null,
    privateKeys: null,
    fetchingIntegrationKeys: false,
    integrationKeysError: null,
}

const reducer: (IntegrationKeyState) => IntegrationKeyState = handleActions({
    [INTEGRATION_KEYS_REQUEST]: (state: IntegrationKeyState) => ({
        ...state,
        fetchingIntegrationKeys: true,
    }),

    [INTEGRATION_KEYS_SUCCESS]: (state: IntegrationKeyState, action: IntegrationKeysAction) => ({
        ...state,
        fetchingIntegrationKeys: false,
        ethereumIdentities: action.payload.ethereumIdentities,
        privateKeys: action.payload.privateKeys,
    }),

    [INTEGRATION_KEYS_FAILURE]: (state: IntegrationKeyState, action: IntegrationKeysErrorAction) => ({
        ...state,
        fetchingIntegrationKeys: false,
        integrationKeysError: action.payload.error,
    }),

}, initialState)

export default reducer
