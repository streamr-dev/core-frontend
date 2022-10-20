import { createAction } from 'redux-actions'
import * as yup from 'yup'
import BN from 'bignumber.js'
import type { ErrorInUi, ReduxActionCreator } from '$shared/types/common-types'
import type { User, Balances } from '$shared/types/user-types'
import { BalanceType } from '$shared/types/user-types'
import { selectUserData } from '$shared/modules/user/selectors'
import { clearStorage } from '$shared/utils/storage'
import type { Address } from '$shared/types/web3-types'
import { isEthereumAddress } from '$mp/utils/validate'
import { selectEthereumNetworkId } from '$mp/modules/global/selectors'
import type { UserErrorActionCreator, UserDataActionCreator, SetBalanceActionCreator } from './types'
import * as services from './services'
import {
    USER_DATA_REQUEST,
    USER_DATA_SUCCESS,
    USER_DATA_FAILURE,
    SAVE_CURRENT_USER_REQUEST,
    SAVE_CURRENT_USER_SUCCESS,
    SAVE_CURRENT_USER_FAILURE,
    UPDATE_CURRENT_USER,
    UPDATE_AVATAR_REQUEST,
    UPDATE_AVATAR_SUCCESS,
    UPDATE_AVATAR_FAILURE,
    RESET_USER_DATA,
    DELETE_USER_ACCOUNT_REQUEST,
    DELETE_USER_ACCOUNT_SUCCESS,
    DELETE_USER_ACCOUNT_FAILURE,
    SET_BALANCE,
} from './constants'
// Logout
export const resetUserData: ReduxActionCreator = createAction(RESET_USER_DATA)
export const logout = () => (dispatch: (...args: Array<any>) => any) => {
    clearStorage()
    dispatch(resetUserData())
}
// Fetching user data
const getUserDataRequest: ReduxActionCreator = createAction(USER_DATA_REQUEST)
const getUserDataSuccess: UserDataActionCreator = createAction(USER_DATA_SUCCESS, (user: User) => ({
    user,
}))
const getUserDataError: UserErrorActionCreator = createAction(USER_DATA_FAILURE, (error: ErrorInUi) => ({
    error,
}))
// save current user
const saveCurrentUserRequest: ReduxActionCreator = createAction(SAVE_CURRENT_USER_REQUEST)
const saveCurrentUserSuccess: UserDataActionCreator = createAction(SAVE_CURRENT_USER_SUCCESS, (user: User) => ({
    user,
}))
const saveCurrentUserFailure: UserErrorActionCreator = createAction(SAVE_CURRENT_USER_FAILURE, (error: ErrorInUi) => ({
    error,
}))

// Update user avatar
const updateAvatarRequest = () => ({
    type: UPDATE_AVATAR_REQUEST,
})

const updateAvatarSuccess = () => ({
    type: UPDATE_AVATAR_SUCCESS,
})

const updateAvatarFailure = (error: ErrorInUi) => ({
    type: UPDATE_AVATAR_FAILURE,
    error,
})

// remove user account
const deleteUserAccountRequest: ReduxActionCreator = createAction(DELETE_USER_ACCOUNT_REQUEST)
const deleteUserAccountSuccess: ReduxActionCreator = createAction(DELETE_USER_ACCOUNT_SUCCESS)
const deleteUserAccountFailure: UserErrorActionCreator = createAction(
    DELETE_USER_ACCOUNT_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)
// Get user data for logged in user
export const getUserData = () => (dispatch: (...args: Array<any>) => any) => {
    dispatch(getUserDataRequest())
    return services.getUserData().then(
        (user) => {
            dispatch(getUserDataSuccess(user))
            return user
        },
        (error) => {
            dispatch(getUserDataError(error))
        },
    )
}
const updateCurrentUser: UserDataActionCreator = createAction(UPDATE_CURRENT_USER, (user: User) => ({
    user,
}))
export const updateCurrentUserName =
    (name: string) => (dispatch: (...args: Array<any>) => any, getState: (...args: Array<any>) => any) => {
        const user = selectUserData(getState())

        if (user) {
            dispatch(updateCurrentUser({ ...user, name }))
        }
    }
export const updateCurrentUserEmail =
    (email: string) => (dispatch: (...args: Array<any>) => any, getState: (...args: Array<any>) => any) => {
        const user = selectUserData(getState())

        if (user) {
            dispatch(updateCurrentUser({ ...user, email }))
        }
    }
export const updateCurrentUserImage =
    (image: File | null | undefined) =>
        (dispatch: (...args: Array<any>) => any, getState: (...args: Array<any>) => any) => {
            dispatch(updateAvatarRequest())
            const user = selectUserData(getState())

            if (!user || !image) {
                throw new Error('Invalid user data or uploaded image')
            }

            return services
                .uploadProfileAvatar(image)
                .then((avatar) => {
                    dispatch(updateAvatarSuccess())
                    dispatch(updateCurrentUser({ ...user, ...avatar }))
                })
                .catch((e) => {
                    dispatch(updateAvatarFailure(e))
                    throw e
                })
        }
const emailValidator = yup.string().trim().email()
export const saveCurrentUser =
    () => async (dispatch: (...args: Array<any>) => any, getState: (...args: Array<any>) => any) => {
        dispatch(saveCurrentUserRequest())
        const user = selectUserData(getState())

        if (!user) {
            throw new Error('Invalid user data')
        }

        if (!!user.email && !emailValidator.isValidSync(user.email)) {
            throw new Error('Please enter a valid email address')
        }

        return services
            .putUser(user)
            .then((data) => {
                dispatch(saveCurrentUserSuccess(data))
            })
            .catch((e) => {
                dispatch(saveCurrentUserFailure(e))
                throw e
            })
    }
export const deleteUserAccount = () => (dispatch: (...args: Array<any>) => any) => {
    dispatch(deleteUserAccountRequest())
    return services.deleteUserAccount().then(
        () => {
            dispatch(deleteUserAccountSuccess())
        },
        (error) => {
            dispatch(
                deleteUserAccountFailure({
                    message: error.message,
                }),
            )
            throw error
        },
    )
}
// account balances
const setBalance: SetBalanceActionCreator = createAction(SET_BALANCE, (balances: Balances) => ({
    balances,
}))
export const updateBalance =
    (account: Address) => async (dispatch: (...args: Array<any>) => any, getState: (...args: Array<any>) => any) => {
        const state = getState()
        const chainId = selectEthereumNetworkId(state)
        let accountEthBalance = new BN(0)
        let accountDataBalance = new BN(0)

        try {
            accountEthBalance = await services.getBalance({
                address: account,
                type: BalanceType.ETH,
                usePublicNode: true,
                chainId,
            })
        } catch (e) {
            console.warn(e)
        }

        try {
            accountDataBalance = await services.getBalance({
                address: account,
                type: BalanceType.DATA,
                usePublicNode: true,
                chainId,
            })
        } catch (e) {
            console.warn(e)
        }

        dispatch(
            setBalance({
                [BalanceType.ETH]: accountEthBalance.toString(),
                [BalanceType.DATA]: accountDataBalance.toString(),
            }),
        )
    }
export const updateBalances =
    () => (dispatch: (...args: Array<any>) => any, getState: (...args: Array<any>) => any) => {
        const state = getState()
        const { username } = selectUserData(state) || {}

        if (!!username && isEthereumAddress(username)) {
            dispatch(updateBalance(username))
        }
    }
