// @flow

import zxcvbn from '$utils/zxcvbn'
import { get, post } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { User, IntegrationKey, ApiKey, PasswordUpdate } from '$shared/flowtype/user-types'
// import routes from '$routes'

export const getMyKeys = (): ApiResult<Array<ApiKey>> => get(formatApiUrl('users', 'me', 'keys', {
    noCache: Date.now(),
}))

export const getIntegrationKeys = (): ApiResult<Array<IntegrationKey>> => get(formatApiUrl('integration_keys'))

export const getUserData = (): ApiResult<User> => get(formatApiUrl('users', 'me', {
    noCache: Date.now(),
}))

export const postUser = (user: User): ApiResult<User> => {
    const form = new FormData()
    Object.keys(user).forEach((key: string) => {
        form.append(key, user[key])
    })
    return post(formatApiUrl('profile', 'update'), form, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
}

const MIN_PASSWORD_LENGTH = 8
const FORBIDDEN_PASSWORDS = ['algocanvas', 'streamr']

export const postPasswordUpdate = async (passwordUpdate: PasswordUpdate, userInputs?: Array<string> = []): ApiResult<null> => {
    const result = (await zxcvbn())(passwordUpdate.newPassword, [
        ...FORBIDDEN_PASSWORDS,
        ...userInputs,
    ])

    let passwordStrength = result.score
    if (passwordUpdate.newPassword.length < MIN_PASSWORD_LENGTH) {
        passwordStrength = 0
    }
    const form = new FormData()
    form.append('currentpassword', passwordUpdate.currentPassword)
    form.append('password', passwordUpdate.newPassword)
    form.append('password2', passwordUpdate.confirmNewPassword)
    form.append('pwdStrength', String(passwordStrength))

    return post(formatApiUrl('profile', 'changePwd'), form, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
        },
    })
}

/**
 * Sends a logout request.
 */
export const logout = (): Promise<any> => (
    // get(routes.externalLogout(), {
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    // })
    // NOTE: Replace the following line with the code above when the backend
    //       auth stuff is fixed. — Mariusz
    Promise.resolve('')
)

