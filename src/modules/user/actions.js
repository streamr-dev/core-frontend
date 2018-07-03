// @flow

import { createAction } from 'redux-actions'

import type { ReduxActionCreator, ErrorInUi } from '../../flowtype/common-types'
import type { ApiKey, User } from '../../flowtype/user-types'
import type { Web3AccountList } from '../../flowtype/web3-types'
import type { ProductId } from '../../flowtype/product-types'
import type {
    ProductIdActionCreator,
    ProductErrorActionCreator,
} from '../product/types'
import type {
    ApiKeyActionCreator,
    Web3AccountsActionCreator,
    UserErrorActionCreator,
    UserDataActionCreator,
} from './types'

import * as services from './services'
import {
    API_KEYS_REQUEST,
    API_KEYS_SUCCESS,
    API_KEYS_FAILURE,
    LINKED_WEB3_ACCOUNTS_REQUEST,
    LINKED_WEB3_ACCOUNTS_SUCCESS,
    LINKED_WEB3_ACCOUNTS_FAILURE,
    LOGOUT,
    USER_DATA_REQUEST,
    USER_DATA_SUCCESS,
    USER_DATA_FAILURE,
    GET_USER_PRODUCT_PERMISSIONS_REQUEST,
    GET_USER_PRODUCT_PERMISSIONS_SUCCESS,
    GET_USER_PRODUCT_PERMISSIONS_FAILURE,
    EXTERNAL_LOGIN_START,
    EXTERNAL_LOGIN_END,
} from './constants'

export const logout: ReduxActionCreator = createAction(LOGOUT)

// Login keys
const apiKeysRequest: ReduxActionCreator = createAction(API_KEYS_REQUEST)
const apiKeysSuccess: ApiKeyActionCreator = createAction(API_KEYS_SUCCESS, (apiKey: ApiKey) => ({
    apiKey,
}))
const apiKeysError: UserErrorActionCreator = createAction(API_KEYS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

// Linked web3 accounts
const linkedWeb3AccountsRequest: ReduxActionCreator = createAction(LINKED_WEB3_ACCOUNTS_REQUEST)
const linkedWeb3AccountsSuccess: Web3AccountsActionCreator = createAction(LINKED_WEB3_ACCOUNTS_SUCCESS, (accounts: Web3AccountList) => ({
    accounts,
}))
const linkedWeb3AccountsError: UserErrorActionCreator = createAction(LINKED_WEB3_ACCOUNTS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

// Fetching user data
const getUserDataRequest: ReduxActionCreator = createAction(USER_DATA_REQUEST)
const getUserDataSuccess: UserDataActionCreator = createAction(USER_DATA_SUCCESS, (user: User) => ({
    user,
}))
const getUserDataError: UserErrorActionCreator = createAction(USER_DATA_FAILURE, (error: ErrorInUi) => ({
    error,
}))

const getUserProductPermissionsRequest: ProductIdActionCreator = createAction(
    GET_USER_PRODUCT_PERMISSIONS_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

const getUserProductPermissionsSuccess = createAction(
    GET_USER_PRODUCT_PERMISSIONS_SUCCESS,
    (read: boolean, write: boolean, share: boolean) => ({
        read,
        write,
        share,
    }),
)

const getUserProductPermissionsFailure: ProductErrorActionCreator = createAction(
    GET_USER_PRODUCT_PERMISSIONS_FAILURE,
    (id: ProductId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

// Fetch linked web3 accounts from integration keys
export const fetchLinkedWeb3Accounts = () => (dispatch: Function) => {
    dispatch(linkedWeb3AccountsRequest())

    return services.getIntegrationKeys()
        .then((result) => (
            result
                .filter(({ service }) => (service === 'ETHEREUM' || service === 'ETHEREUM_ID'))
                .map(({ name, json }) => ({
                    address: json.address,
                    name,
                }))
        ))
        .then((linkedWallets) => {
            dispatch(linkedWeb3AccountsSuccess(linkedWallets))
        }, (error) => {
            dispatch(linkedWeb3AccountsError(error))
        })
}

// Fetch login keys, a token is saved to local storage and used when needed (eg. in StreamLivePreview)
export const getApiKeys = () => (dispatch: Function) => {
    dispatch(apiKeysRequest())

    return services.getMyKeys()
        .then(([apiKey]) => {
            // TODO: using first key here, not sure if there are others
            dispatch(apiKeysSuccess(apiKey))
            dispatch(fetchLinkedWeb3Accounts())
        }, (error) => {
            dispatch(apiKeysError(error))
            // Session was not found so logout from marketplace
            dispatch(logout())
        })
}

// Get user data for logged in user
export const getUserData = () => (dispatch: Function) => {
    dispatch(getUserDataRequest())

    return services.getUserData()
        .then((user) => {
            dispatch(getUserDataSuccess(user))
        }, (error) => {
            dispatch(getUserDataError(error))
        })
}

export const getUserProductPermissions = (id: ProductId) => (dispatch: Function) => {
    dispatch(getUserProductPermissionsRequest(id))
    return services
        .getUserProductPermissions(id)
        .then((result) => {
            const p = result.reduce((permissions, permission) => {
                if (permission.anonymous) {
                    return {
                        ...permissions,
                        read: true,
                    }
                }
                if (!permission.operation) {
                    return permissions
                }
                return {
                    ...permissions,
                    [permission.operation]: true,
                }
            }, {})
            const canRead = !!p.read || false
            const canWrite = !!p.write || false
            const canShare = !!p.share || false
            dispatch(getUserProductPermissionsSuccess(canRead, canWrite, canShare))
        }, (error) => {
            dispatch(getUserProductPermissionsFailure(id, {
                message: error.message,
            }))
        })
}

export const startExternalLogin: ReduxActionCreator = createAction(EXTERNAL_LOGIN_START)
export const endExternalLogin: ReduxActionCreator = createAction(EXTERNAL_LOGIN_END)
