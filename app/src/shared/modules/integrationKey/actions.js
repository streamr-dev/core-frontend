// @flow

import { createAction } from 'redux-actions'

import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import type {
    IntegrationKeysActionCreator,
    IntegrationKeysErrorActionCreator,
} from './types'
import type { IntegrationKey, NewIntegrationKey, IntegrationKeyId, IntegrationKeyIdList } from '$shared/flowtype/integration-key-types'
import getWeb3 from '$userpages/utils/web3Provider'
import * as api from '$shared/utils/api'
import { integrationKeysSchema, integrationKeySchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'

import * as services from './services'
import {
    INTEGRATION_KEYS_REQUEST,
    INTEGRATION_KEYS_SUCCESS,
    INTEGRATION_KEYS_FAILURE,
    CREATE_INTEGRATION_KEY_REQUEST,
    DELETE_INTEGRATION_KEY_REQUEST,
    CREATE_INTEGRATION_KEY_SUCCESS,
    DELETE_INTEGRATION_KEY_SUCCESS,
    CREATE_INTEGRATION_KEY_FAILURE,
    DELETE_INTEGRATION_KEY_FAILURE,
    CREATE_IDENTITY_REQUEST,
    CREATE_IDENTITY_SUCCESS,
    CREATE_IDENTITY_FAILURE,
} from './constants'

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

const apiUrl = `${process.env.STREAMR_API_URL}/integration_keys`

const createIntegrationKeyRequest = () => ({
    type: CREATE_INTEGRATION_KEY_REQUEST,
})

const deleteIntegrationKeyRequest = (id: $ElementType<IntegrationKey, 'id'>) => ({
    type: DELETE_INTEGRATION_KEY_REQUEST,
    id,
})

const createIntegrationKeySuccess = (integrationKey: IntegrationKey) => ({
    type: CREATE_INTEGRATION_KEY_SUCCESS,
    integrationKey,
})

const deleteIntegrationKeySuccess = (id: $ElementType<IntegrationKey, 'id'>) => ({
    type: DELETE_INTEGRATION_KEY_SUCCESS,
    id,
})

const createIntegrationKeyFailure = (error: ErrorInUi) => ({
    type: CREATE_INTEGRATION_KEY_FAILURE,
    error,
})

const deleteIntegrationKeyFailure = (error: ErrorInUi) => ({
    type: DELETE_INTEGRATION_KEY_FAILURE,
    error,
})

const createIdentityRequest = () => ({
    type: CREATE_IDENTITY_REQUEST,
})

const createIdentitySuccess = (integrationKey: IntegrationKeyId) => ({
    type: CREATE_IDENTITY_SUCCESS,
    integrationKey,
})

const createIdentityFailure = (error: ErrorInUi) => ({
    type: CREATE_IDENTITY_FAILURE,
    error,
})

export const createIntegrationKey = (integrationKey: NewIntegrationKey) => (dispatch: Function) => {
    dispatch(createIntegrationKeyRequest())
    return api.post(apiUrl, integrationKey)
        .then((data) => dispatch(createIntegrationKeySuccess(data)))
        .catch((e) => {
            dispatch(createIntegrationKeyFailure(e))
            /* dispatch(errorNotification({
                title: e.message,
            })) */
            throw e
        })
}

export const deleteIntegrationKey = (id: $ElementType<IntegrationKey, 'id'>) => (dispatch: Function) => {
    if (!id) {
        throw new Error('No id!')
    }
    dispatch(deleteIntegrationKeyRequest(id))
    return api.del(`${apiUrl}/${id}`)
        .then(() => dispatch(deleteIntegrationKeySuccess(id)))
        .catch((e) => {
            dispatch(deleteIntegrationKeyFailure(e))
            /* dispatch(errorNotification({
                title: e.message,
            })) */
            throw e
        })
}

export const createIdentity = (integrationKey: NewIntegrationKey) => (dispatch: Function) => {
    const ownWeb3 = getWeb3()
    dispatch(createIdentityRequest())

    if (!ownWeb3.isEnabled()) {
        dispatch(createIdentityFailure({
            message: 'MetaMask browser extension is not installed',
        }))
        /* dispatch(errorNotification({
            title: 'Create identity failed',
            message: 'MetaMask browser extension is not installed',
        })) */
        return Promise.resolve()
    }

    return ownWeb3.getDefaultAccount()
        .then((account) => (
            api.post(`${process.env.STREAMR_API_URL}/login/challenge/${account}`)
                .then((response) => {
                    const challenge = response && response.challenge
                    return ownWeb3.eth.personal.sign(challenge, account)
                        .then((signature) => (
                            api.post(apiUrl, {
                                ...integrationKey,
                                challenge: response,
                                signature,
                                address: account,
                            })
                                .then(handleEntities(integrationKeySchema, dispatch))
                                .then((id) => {
                                    dispatch(createIdentitySuccess(id))
                                    /* dispatch(successNotification({
                                        title: 'Success!',
                                        message: 'New identity created',
                                    })) */
                                })
                        ))
                })
        ))
        .catch((err) => {
            dispatch(createIdentityFailure(err))
            /* dispatch(errorNotification({
                title: 'Create identity failed',
                message: err.message,
            })) */
            throw err
        })
}

// Fetch linked web3 accounts from integration keys
export const fetchIntegrationKeys = () => (dispatch: Function) => {
    dispatch(integrationKeysRequest())

    return services.getIntegrationKeys()
        .then((result) => {
            const ethereumIdentities: IntegrationKeyIdList = []
            const privateKeys: IntegrationKeyIdList = []

            const resultsWithAddress = result.map((key) => {
                if (key.service === 'ETHEREUM_ID' && key.id) {
                    ethereumIdentities.push(key.id)
                }

                if (key.service === 'ETHEREUM' && key.id) {
                    privateKeys.push(key.id)
                }

                return {
                    ...key,
                    address: key.json.address || '',
                }
            })

            dispatch(integrationKeysSuccess(ethereumIdentities, privateKeys))

            return resultsWithAddress
        })
        .then(handleEntities(integrationKeysSchema, dispatch), (error) => {
            dispatch(integrationKeysError(error))
        })
}
