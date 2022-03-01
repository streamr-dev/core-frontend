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

function normalize(rawPermissions) {
    const result = {}

    rawPermissions.forEach(({ user, permissions }) => {
        const u = user === 'public' ? address0 : user
        result[u] = [...(result[0] || []), ...permissions]
    })

    return {
        combinations: combine(result),
        raw: result,
    }
}

function norm(userId) {
    return typeof userId === 'string' ? userId.toLowerCase() : userId
}

export default function reducer(state, action) {
    // SET_PERMISSIONS is allowed despite the `locked` flag being up. Other actions are shielded off
    // by the "is locked" check. See below.
    if (action.type === SET_PERMISSIONS) {
        return Object.entries(state.changeset).reduce((memo, [user, value]) => (
            reducer(memo, {
                // Drop empty permissions from `changeset`, too (`combine` skips empty ones).
                removeEmpty: true,
                type: UPDATE_PERMISSION,
                user,
                value,
            })
        ), {
            ...state,
            ...normalize(action.permissions),
            errors: action.errors || {},
            locked: false,
        })
    }

    // Further actions require "unlocked" state.
    if (state.locked) {
        return state
    }

    let user

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
            user = norm(action.user)

            if (state.changeset[user] != null) {
                // Don't overwrite user changes.
                return state
            }

            if (state.combinations[user] && !({}).hasOwnProperty.call(state.changeset, user)) {
                // Don't overwrite pristine combinations.
                return state
            }

            return reducer(state, {
                type: UPDATE_PERMISSION,
                user: action.user,
                value: DEFAULTS[state.resourceType],
            })

        case REMOVE_PERMISSION:
            user = norm(action.user)

            if (state.combinations[user]) {
                return {
                    ...state,
                    changeset: {
                        ...state.changeset,
                        [user]: undefined,
                    },
                }
            }

            return reducer(state, {
                type: ABANDON_CHANGES,
                user: action.user,
            })

        case UPDATE_PERMISSION:
            // `removeEmpty` is false by default. That's how UI deals with it. This way we can unselect
            // all operations for a given `userId` without getting its entry removed from UI.
            if (action.value == null || (action.value === 0 && action.removeEmpty)) {
                return reducer(state, {
                    type: REMOVE_PERMISSION,
                    user: action.user,
                })
            }

            user = norm(action.user)

            if (action.value === state.combinations[user]) {
                return reducer(state, {
                    type: ABANDON_CHANGES,
                    user: action.user,
                })
            }

            return {
                ...state,
                changeset: {
                    ...state.changeset,
                    [user]: action.value,
                },
            }

        case ABANDON_CHANGES:
            user = norm(action.user)

            if (!({}).hasOwnProperty.call(state.changeset, user)) {
                return state
            }

            return {
                ...state,
                changeset: (({ [user]: _, ...changeset }) => (
                    changeset
                ))(state.changeset),
            }

        default:
            return state
    }
}
