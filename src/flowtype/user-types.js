// @flow

export type User = {
    id: string,
    name: string,
}

export type UserId = $ElementType<User, 'id'>

export type UserToken = {
    id: UserId,
    token: string,
}
