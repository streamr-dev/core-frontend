// @flow

import { get, post, put, del } from '$shared/utils/api'
import routes from '$routes'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { User, PasswordUpdate } from '$shared/flowtype/user-types'

export const getUserData = (): ApiResult<User> => get({
    url: routes.api.currentUser.index({
        noCache: Date.now(),
    }),
})

export const putUser = (user: User): ApiResult<User> => put({
    url: routes.api.currentUser.index(),
    data: user,
})

export const postPasswordUpdate = (passwordUpdate: PasswordUpdate, username: string): ApiResult<null> => post({
    url: routes.api.currentUser.changePassword(),
    data: {
        username,
        currentpassword: passwordUpdate.currentPassword,
        password: passwordUpdate.newPassword,
        password2: passwordUpdate.confirmNewPassword,
    },
})

export const uploadProfileAvatar = (image: File): Promise<void> => {
    const options = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }

    const data = new FormData()
    data.append('file', image, image.name)

    return post({
        url: routes.api.currentUser.image(),
        data,
        options,
    })
}

export const deleteUserAccount = (): ApiResult<null> => del({
    url: routes.api.currentUser.index(),
})
