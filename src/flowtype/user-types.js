// @flow

import type { ErrorInUi } from './common-types'

export type UserId = string

export type User = {
    name: string,
    username: string,
    timezone: string,
}

export type ApiKey = {
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

export type UserProductPermissionList = {
    id?: number,
    user?: string,
    operation?: string,
    anonymous?: boolean,
}

export type ProductPermissions = {
    read: boolean,
    write: boolean,
    share: boolean,
    fetchingPermissions: boolean,
    permissionsError: ?ErrorInUi,
}
