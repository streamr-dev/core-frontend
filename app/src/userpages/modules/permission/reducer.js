// @flow

import type { PermissionState } from '../../flowtype/states/permission-state'
import type { PermissionAction } from '../../flowtype/actions/permission-actions'

import {
    GET_RESOURCE_PERMISSIONS_REQUEST,
    GET_RESOURCE_PERMISSIONS_SUCCESS,
    GET_RESOURCE_PERMISSIONS_FAILURE,
    RESET_RESOURCE_PERMISSIONS,
} from './actions'

const initialState = {
    byTypeAndId: {},
    error: null,
    fetching: false,
}

const newPermissions = (state, type, id, nextPermissions) => {
    const prevPermissions = (state.byTypeAndId[type] || {})[id]

    return (
        prevPermissions == null || prevPermissions.join(',') !== nextPermissions.join(',') ? (
            nextPermissions
        ) : (
            prevPermissions
        )
    )
}

export default function (state: PermissionState = initialState, action: PermissionAction): PermissionState {
    switch (action.type) {
        case GET_RESOURCE_PERMISSIONS_REQUEST:
            return {
                ...state,
                fetching: true,
            }

        case GET_RESOURCE_PERMISSIONS_SUCCESS:
            return {
                ...state,
                byTypeAndId: {
                    ...state.byTypeAndId,
                    [(action.resourceType: string)]: {
                        ...(state.byTypeAndId[action.resourceType] || {}),
                        [action.resourceId]: (
                            newPermissions(
                                state,
                                action.resourceType,
                                action.resourceId,
                                action.permissions.map(({ operation }) => operation).sort(),
                            )
                        ),
                    },
                },
                fetching: false,
                error: null,
            }

        case GET_RESOURCE_PERMISSIONS_FAILURE:
            return {
                ...state,
                fetching: false,
                error: action.error,
                byTypeAndId: {
                    ...state.byTypeAndId,
                    [(action.resourceType: string)]: {
                        ...(state.byTypeAndId[action.resourceType] || {}),
                        [action.resourceId]: (
                            newPermissions(
                                state,
                                action.resourceType,
                                action.resourceId,
                                [],
                            )
                        ),
                    },
                },
            }

        case RESET_RESOURCE_PERMISSIONS: {
            const newPermissions = {
                ...(state.byTypeAndId[action.resourceType] || {}),
            }
            delete newPermissions[action.resourceId]

            return {
                ...state,
                byTypeAndId: {
                    ...state.byTypeAndId,
                    [(action.resourceType: string)]: {
                        ...newPermissions,
                    },
                },
            }
        }

        default:
            return state
    }
}
