// @flow

import { createAction } from 'redux-actions'

import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import type { Address } from '$shared/flowtype/web3-types'
import type {
    IntegrationKeyIdActionCreator,
    IntegrationKeysActionCreator,
    IntegrationKeysErrorActionCreator,
} from './types'
import type { IntegrationKeyId, IntegrationKeyIdList } from '$shared/flowtype/integration-key-types'
import { integrationKeysSchema, integrationKeySchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import { integrationKeyServices } from '$shared/utils/constants'

import * as services from './services'
import {
    INTEGRATION_KEYS_REQUEST,
    INTEGRATION_KEYS_SUCCESS,
    INTEGRATION_KEYS_FAILURE,
    CREATE_INTEGRATION_KEY_REQUEST,
    DELETE_INTEGRATION_KEY_REQUEST,
    EDIT_INTEGRATION_KEY_REQUEST,
    CREATE_INTEGRATION_KEY_SUCCESS,
    DELETE_INTEGRATION_KEY_SUCCESS,
    EDIT_INTEGRATION_KEY_SUCCESS,
    CREATE_INTEGRATION_KEY_FAILURE,
    DELETE_INTEGRATION_KEY_FAILURE,
    EDIT_INTEGRATION_KEY_FAILURE,
    CREATE_IDENTITY_REQUEST,
    CREATE_IDENTITY_SUCCESS,
    CREATE_IDENTITY_FAILURE,
} from './constants'

// get integration keys
const integrationKeysRequest: ReduxActionCreator = createAction(INTEGRATION_KEYS_REQUEST)
const integrationKeysSuccess: IntegrationKeysActionCreator = createAction(
    INTEGRATION_KEYS_SUCCESS,
    (ethereumIdentities: IntegrationKeyIdList, privateKeys: IntegrationKeyIdList) => ({
        ethereumIdentities,
        privateKeys,
    }),
)
const integrationKeysError: IntegrationKeysErrorActionCreator = createAction(INTEGRATION_KEYS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

// delete integration key
const deleteIntegrationKeyRequest: ReduxActionCreator = createAction(DELETE_INTEGRATION_KEY_REQUEST)
const deleteIntegrationKeySuccess: IntegrationKeyIdActionCreator = createAction(
    DELETE_INTEGRATION_KEY_SUCCESS,
    (id: IntegrationKeyId) => ({
        id,
    }),
)
const deleteIntegrationKeyFailure: IntegrationKeysErrorActionCreator = createAction(
    DELETE_INTEGRATION_KEY_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

// create integration key
const createIntegrationKeyRequest: ReduxActionCreator = createAction(CREATE_INTEGRATION_KEY_REQUEST)
const createIntegrationKeySuccess: IntegrationKeyIdActionCreator = createAction(
    CREATE_INTEGRATION_KEY_SUCCESS,
    (id: IntegrationKeyId) => ({
        id,
    }),
)
const createIntegrationKeyFailure: IntegrationKeysErrorActionCreator = createAction(
    CREATE_INTEGRATION_KEY_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

// edit integration key
const editIntegrationKeyRequest: ReduxActionCreator = createAction(EDIT_INTEGRATION_KEY_REQUEST)
const editIntegrationKeySuccess: IntegrationKeyIdActionCreator = createAction(
    EDIT_INTEGRATION_KEY_SUCCESS,
    (keyName: string) => ({
        name: keyName,
    }),
)
const editIntegrationKeyFailure: IntegrationKeysErrorActionCreator = createAction(
    EDIT_INTEGRATION_KEY_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

// create identity
const createIdentityRequest: ReduxActionCreator = createAction(CREATE_IDENTITY_REQUEST)
const createIdentitySuccess: IntegrationKeyIdActionCreator = createAction(
    CREATE_IDENTITY_SUCCESS,
    (id: IntegrationKeyId) => ({
        id,
    }),
)
const createIdentityFailure: IntegrationKeysErrorActionCreator = createAction(
    CREATE_IDENTITY_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

// Fetch linked web3 accounts from integration keys
export const fetchIntegrationKeys = () => (dispatch: Function) => {
    dispatch(integrationKeysRequest())

    return services.getIntegrationKeys()
        .then((result) => {
            handleEntities(integrationKeysSchema, dispatch)(result)

            const ethereumIdentities: IntegrationKeyIdList = []
            const privateKeys: IntegrationKeyIdList = []

            result.forEach((key) => {
                if (key.service === integrationKeyServices.ETHEREREUM_IDENTITY && key.id) {
                    ethereumIdentities.push(key.id)
                }

                if (key.service === integrationKeyServices.PRIVATE_KEY && key.id) {
                    privateKeys.push(key.id)
                }
            })

            dispatch(integrationKeysSuccess(ethereumIdentities, privateKeys))
        }, (error) => {
            dispatch(integrationKeysError({
                message: error.message,
            }))
            throw error
        })
}

export const createIntegrationKey = (name: string, privateKey: Address) => (dispatch: Function) => {
    dispatch(createIntegrationKeyRequest())
    return services.createPrivateKey(name, privateKey)
        .then(handleEntities(integrationKeySchema, dispatch))
        .then((result) => dispatch(createIntegrationKeySuccess(result)))
        .catch((error) => {
            dispatch(createIntegrationKeyFailure({
                message: error.message,
            }))
            throw error
        })
}

export const deleteIntegrationKey = (id: IntegrationKeyId) => (dispatch: Function) => {
    if (!id) {
        throw new Error('No id!')
    }
    dispatch(deleteIntegrationKeyRequest())
    return services.deleteIntegrationKey(id)
        .then(() => dispatch(deleteIntegrationKeySuccess(id)))
        .catch((error) => {
            dispatch(deleteIntegrationKeyFailure({
                message: error.message,
            }))
            throw error
        })
}

export const editIntegrationKey = (id: IntegrationKeyId, keyName: string) => (dispatch: Function) => {
    if (!id) {
        throw new Error('No id!')
    }
    dispatch(editIntegrationKeyRequest())
    return services.editIntegrationKey(id, keyName)
        .then(() => {
            dispatch(editIntegrationKeySuccess(keyName))
            dispatch(fetchIntegrationKeys())
        })
        .catch((error) => {
            dispatch(editIntegrationKeyFailure({
                message: error.message,
            }))
            throw error
        })
}

export const createIdentity = (name: string) => (dispatch: Function) => {
    dispatch(createIdentityRequest())
    return services.createIdentity(name)
        .then(handleEntities(integrationKeySchema, dispatch))
        .then((id) => {
            dispatch(createIdentitySuccess(id))
        })
        .catch((error) => {
            dispatch(createIdentityFailure({
                message: error.message,
                code: error.code,
            }))
            throw error
        })
}
