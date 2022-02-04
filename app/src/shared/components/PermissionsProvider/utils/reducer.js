import address0 from '$utils/address0'
import { DEFAULTS } from '../groups'
import combine from './combine'

const ABANDON_CHANGES = 'abandon changes'

const REMOVE_PERMISSION = 'remove permission'

export const SET_PERMISSIONS = 'set permissions'

export const SET_RESOURCE = 'set resource'

export const ADD_PERMISSION = 'add permission'

export const PERSIST = 'persist'

export const UPDATE_PERMISSION = 'update permission'

export const initialState = {
    changeset: {},
    errors: {},
    locked: false,
    combinations: {},
    raw: {},
    resourceId: undefined,
    resourceType: undefined,
}

function sanitizeAddress0(rawPermissions) {
    const sanitized = (() => {
        if (!Object.prototype.hasOwnProperty.call(rawPermissions, 'public')) {
            return rawPermissions
        }

        const { public: pub, ...permissions } = rawPermissions

        return {
            ...permissions,
            [address0]: pub,
        }
    })()

    return {
        combinations: combine(sanitized),
        raw: sanitized,
    }
}

export default function reducer(state, action) {
    // SET_PERMISSIONS is allowed despite the `locked` flag being up. Other actions are shielded off
    // by the "is locked" check. See below.
    if (action.type === SET_PERMISSIONS) {
        return Object.entries(state.changeset).reduce((memo, [user, value]) => (
            reducer(memo, {
                type: UPDATE_PERMISSION,
                user,
                value,
            })
        ), {
            ...state,
            ...sanitizeAddress0(action.permissions),
            errors: action.errors || {},
            locked: false,
        })
    }

    // Further actions require "unlocked" state.
    if (state.locked) {
        return state
    }

    switch (action.type) {
        case PERSIST:
            return {
                ...state,
                locked: true,
            }

        case SET_RESOURCE:
            if (state.resourceType === action.resourceType && state.resourceId === action.resourceId) {
                return state
            }

            return {
                ...initialState,
                resourceId: action.resourceId,
                resourceType: action.resourceType,
            }

        case ADD_PERMISSION:
            if (state.changeset[action.user] != null) {
                // Don't overwrite user changes.
                return state
            }

            if (state.combinations[action.user] && !({}).hasOwnProperty.call(state.changeset, action.user)) {
                // Don't overwrite pristine combinations.
                return state
            }

            return reducer(state, {
                type: UPDATE_PERMISSION,
                user: action.user,
                value: DEFAULTS[state.resourceType],
            })

        case REMOVE_PERMISSION:
            if (state.combinations[action.user] != null) {
                return {
                    ...state,
                    changeset: {
                        ...state.changeset,
                        [action.user]: undefined,
                    },
                }
            }

            return reducer(state, {
                type: ABANDON_CHANGES,
                user: action.user,
            })

        case UPDATE_PERMISSION:
            if (action.value == null) {
                return reducer(state, {
                    type: REMOVE_PERMISSION,
                    user: action.user,
                })
            }

            if (action.value === state.combinations[action.user]) {
                return reducer(state, {
                    type: ABANDON_CHANGES,
                    user: action.user,
                })
            }

            return {
                ...state,
                changeset: {
                    ...state.changeset,
                    [action.user]: action.value,
                },
            }

        case ABANDON_CHANGES:
            if (!({}).hasOwnProperty.call(state.changeset, action.user)) {
                return state
            }

            return {
                ...state,
                changeset: (({ [action.user]: _, ...changeset }) => (
                    changeset
                ))(state.changeset),
            }

        default:
            return state
    }
}
