// @flow

export type UserId = string

export type User = {
    id?: number,
    email: string,
    name: string,
    username: string,
    timezone: string,
}

export type ApiKey = {
    id: string,
    name?: string,
    user?: string,
}

export type PasswordUpdate = {
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
}
