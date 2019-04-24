// @flow

import zxcvbn from '$utils/zxcvbn'
import { get, post, put, del } from '$shared/utils/api'
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

export const uploadProfileAvatar = (): Promise<void> => (
    new Promise((resolve) => {
        setTimeout(resolve, 1000) // do nothing
    })
)

export const deleteUserAccount = (): ApiResult<null> => del(formatApiUrl('users/me'))
