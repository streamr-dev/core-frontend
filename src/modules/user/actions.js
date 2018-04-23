// @flow

import { createAction } from 'redux-actions'

import type { ReduxActionCreator, ErrorInUi } from '../../flowtype/common-types'
import type { LoginKey, User } from '../../flowtype/user-types'
import type { Web3AccountList } from '../../flowtype/web3-types'
import type { ProductId } from '../../flowtype/product-types'
import type {
    ProductIdActionCreator,
    ProductErrorActionCreator,
} from '../product/types'
import type {
    LoginKeyActionCreator,
    Web3AccountsActionCreator,
    UserErrorActionCreator,
    UserDataActionCreator,
} from './types'

import * as services from './services'
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGIN_KEYS_REQUEST,
    LOGIN_KEYS_SUCCESS,
    LOGIN_KEYS_FAILURE,
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
} from './constants'

// TODO: Login and logout are only for the mock api login
export const loginRequest: ReduxActionCreator = createAction(LOGIN_REQUEST)
export const loginSuccess: ReduxActionCreator = createAction(LOGIN_SUCCESS)
export const loginError: UserErrorActionCreator = createAction(LOGIN_FAILURE, (error: ErrorInUi) => ({
    error,
}))
export const logout: ReduxActionCreator = createAction(LOGOUT)

// Login keys
export const loginKeysRequest: ReduxActionCreator = createAction(LOGIN_KEYS_REQUEST)
export const loginKeysSuccess: LoginKeyActionCreator = createAction(LOGIN_KEYS_SUCCESS, (loginKey: LoginKey) => ({
    loginKey,
}))
export const loginKeysError: UserErrorActionCreator = createAction(LOGIN_KEYS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

// Linked web3 accounts
export const linkedWeb3AccountsRequest: ReduxActionCreator = createAction(LINKED_WEB3_ACCOUNTS_REQUEST)
export const linkedWeb3AccountsSuccess: Web3AccountsActionCreator = createAction(LINKED_WEB3_ACCOUNTS_SUCCESS, (accounts: Web3AccountList) => ({
    accounts,
}))
export const linkedWeb3AccountsError: UserErrorActionCreator = createAction(LINKED_WEB3_ACCOUNTS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

// Fetching user data
export const getUserDataRequest: ReduxActionCreator = createAction(USER_DATA_REQUEST)
export const getUserDataSuccess: UserDataActionCreator = createAction(USER_DATA_SUCCESS, (user: User) => ({
    user,
}))
export const getUserDataError: UserErrorActionCreator = createAction(USER_DATA_FAILURE, (error: ErrorInUi) => ({
    error,
}))

export const getUserProductPermissionsRequest: ProductIdActionCreator = createAction(
    GET_USER_PRODUCT_PERMISSIONS_REQUEST,
    (id: ProductId) => ({
        id,
    }),
)

export const getUserProductPermissionsSuccess = createAction(
    GET_USER_PRODUCT_PERMISSIONS_SUCCESS,
    (read: boolean, write: boolean, share: boolean) => ({
        read,
        write,
        share,
    }),
)

export const getUserProductPermissionsFailure: ProductErrorActionCreator = createAction(
    GET_USER_PRODUCT_PERMISSIONS_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

// Fetch linked web3 accounts from integration keys
export const fetchLinkedWeb3Accounts = () => (dispatch: Function) => {
    dispatch(linkedWeb3AccountsRequest())

    return services.getIntegrationKeys()
        .then((result) => {
            const linkedWallets = result
                .filter(({ service }) => (service === 'ETHEREUM'))
                .map(({ name, json }) => ({
                    address: json.address,
                    name,
                }))

            dispatch(linkedWeb3AccountsSuccess(linkedWallets))
        })
        .catch((error) => {
            dispatch(linkedWeb3AccountsError(error))
        })
}

// Fetch login keys, a token is saved to local storage and added to subsequent API calls
export const fetchLoginKeys = () => (dispatch: Function) => {
    dispatch(loginKeysRequest())

    return services.getMyKeys()
        .then((result) => {
            // TODO: using first key here, not sure if there are others
            const loginKey = result[0]

            dispatch(loginKeysSuccess(loginKey))

            localStorage.setItem('marketplace_user_id', loginKey.id)

            dispatch(fetchLinkedWeb3Accounts())
        })
        .catch((error) => {
            dispatch(loginKeysError(error))

            // Session was not found so logout from marketplace
            dispatch(logout())
        })
}

// Get user data for logged in user
export const getUserData = () => (dispatch: Function) => {
    dispatch(getUserDataRequest())

    return services.getUserData()
        .then((user) => dispatch(getUserDataSuccess(user)))
        .catch((error) => dispatch(getUserDataError(error)))
}

export const getUserDataAndKeys = () => (dispatch: Function) => {
    dispatch(getUserData())
    dispatch(fetchLoginKeys())
}

// TODO: The login process should happen in the engine/editor but fake it here with mock api
export const doLogin = () => (dispatch: Function) => {
    dispatch(loginRequest())

    return services.login()
        .then(() => {
            dispatch(loginSuccess())
            dispatch(fetchLoginKeys())
        })
        .catch((error) => dispatch(loginError(error)))
}

// TODO: logout from mock api
export const doLogout = () => (dispatch: Function) => {
    dispatch(logout())

    localStorage.removeItem('marketplace_user_id')

    // send logout call, don't care about the response since it's mock api
    return services.logout()
}

export const getUserProductPermissions = (id: ProductId) => (dispatch: Function) => {
    dispatch(getUserProductPermissionsRequest(id))
    return services
        .getUserProductPermissions(id)
        .then((result) => {
            const { read, write, share } = result.reduce((permissions, permission) => {
                if ('anonymous' in permission || !permission.operation) {
                    return permissions
                }
                return {
                    ...permissions,
                    ...{
                        [permission.operation]: true,
                    },
                }
            }, {})
            dispatch(getUserProductPermissionsSuccess(!!read, !!write, !!share))
        })
        .catch((error) => {
            dispatch(getUserProductPermissionsFailure(id, {
                message: error.message,
            }))
        })
}
