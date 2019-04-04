// @flow

import zxcvbn from '$utils/zxcvbn'
import { get, post, put } from '$shared/utils/api'
import { formatApiUrl } from '$shared/utils/url'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { User, PasswordUpdate } from '$shared/flowtype/user-types'

export const getUserData = (): ApiResult<User> => get(formatApiUrl('users', 'me', {
    noCache: Date.now(),
}))

export const putUser = (user: User): ApiResult<User> => put(formatApiUrl('users', 'me'), {
    headers: {
        'Content-Type': 'application/json',
    },
    ...user,
})

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

export const uploadProfileAvatar = (image: File): Promise<void> => {
    const options = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }

    const data = new FormData()
    data.append('file', image, image.name)

    return post(formatApiUrl('users', 'me', 'image'), data, options)
}

export const deleteUserAccount = (): Promise<null> => (
    new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Deleting user account is not supported yet!'))
        }, 1000)
    })
)
