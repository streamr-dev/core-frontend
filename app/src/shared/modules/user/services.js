// @flow

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

export const postPasswordUpdate = (passwordUpdate: PasswordUpdate, userInputs?: Array<string> = []): ApiResult<null> => {
    const form = new FormData()
    form.append('username', userInputs[0])
    form.append('currentpassword', passwordUpdate.currentPassword)
    form.append('password', passwordUpdate.newPassword)
    form.append('password2', passwordUpdate.confirmNewPassword)

    return post(formatApiUrl('users', 'me', 'changePassword'), form, {
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

export const deleteUserAccount = (): Promise<null> => (
    new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Deleting user account is not supported yet!'))
        }, 1000)
    })
)
