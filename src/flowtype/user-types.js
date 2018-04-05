// @flow

export type UserId = string

export type LoginKey = {
    id: string,
    name?: string,
    user?: string,
}

export type LoginKeys = Array<LoginKey>
