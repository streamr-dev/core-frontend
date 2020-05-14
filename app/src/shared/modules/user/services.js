// @flow

import { get, post, put, del } from '$shared/utils/api'
import routes from '$routes'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { User, PasswordUpdate } from '$shared/flowtype/user-types'

export const getUserData = (): ApiResult<User> => get({
    url: routes.api.me.index({
        noCache: Date.now(),
    }),
})

export const putUser = (user: User): ApiResult<User> => put({
    url: routes.api.me.index(),
    data: user,
})

export const postPasswordUpdate = (passwordUpdate: PasswordUpdate, username: string): ApiResult<null> => {
    const form = new FormData()
    form.append('username', username)
    form.append('currentpassword', passwordUpdate.currentPassword)
    form.append('password', passwordUpdate.newPassword)
    form.append('password2', passwordUpdate.confirmNewPassword)

    return post({
        url: routes.api.me.changePassword(),
        data: form,
        options: {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
            },
        },
    })
}

export const uploadProfileAvatar = (image: File): Promise<void> => {
    const options = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }

    const data = new FormData()
    data.append('file', image, image.name)

    return post({
        url: routes.api.me.image(),
        data,
        options,
    })
}

export const deleteUserAccount = (): ApiResult<null> => del({
    url: routes.api.me.index(),
})
