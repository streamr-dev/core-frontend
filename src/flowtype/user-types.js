// @flow

export type UserId = string

export type User = {
    name: string,
    username: string,
    timezone: string
}

export type LoginKey = {
    id: string,
    name?: string,
    user?: string,
}

export type IntegrationKey = {
    id?: ?number,
    name: string,
    service: string,
    json: Object,
}
