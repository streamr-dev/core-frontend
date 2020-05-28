// @flow

import type { PermissionState } from '../../flowtype/states/permission-state'
import type { PermissionAction } from '../../flowtype/actions/permission-actions'

import {
    GET_RESOURCE_PERMISSIONS_REQUEST,
    GET_RESOURCE_PERMISSIONS_SUCCESS,
    GET_RESOURCE_PERMISSIONS_FAILURE,
} from './actions'

const initialState = {
    byTypeAndId: {},
    error: null,
    fetching: false,
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
                        [action.resourceId]: action.permissions.map((permission) => ({
                            ...permission,
                            new: false,
                            fetching: false,
                            removed: false,
                            error: null,
                        })),
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
            }

        default:
            return state
    }
}
