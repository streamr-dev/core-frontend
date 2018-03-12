// @flow

export type UserId = string

export type User = {
    id: UserId,
    name: string,
}

export type UserToken = {
    id: UserId,
    token: string,
}
