// @flow

export type UserId = string

export type User = {
    id?: number,
    email: string,
    name: string,
    username: string,
    imageUrlSmall: string,
    imageUrlLarge: string,
}

export type PasswordUpdate = {
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
}
