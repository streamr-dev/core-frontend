import React, { useReducer, createContext, useContext, useEffect, useRef, useMemo } from 'react'
import { getResourcePermissions } from '$userpages/modules/permission/services'
import useIsMounted from '$shared/hooks/useIsMounted'
import combine from './utils/combine'
import { DEFAULTS } from './groups'
import { useSelector } from 'react-redux'
import { selectUsername } from '$shared/modules/user/selectors'

const initialState = {
    changeset: {},
    errors: {},
    fetchCount: 0,
    locked: true,
    combinations: {},
    raw: {},
    resourceId: undefined,
    resourceType: undefined,
}

const ABANDON_CHANGES = 'abandon changes'

const REMOVE_PERMISSION = 'remove permission'

const SET_PERMISSIONS = 'set permissions'

const SET_RESOURCE = 'set resource'

export const ADD_PERMISSION = 'add permission'

export const PERSIST = 'persist'

export const REFETCH = 'refetch'

export const UNLOCK = 'unlock'

export const UPDATE_PERMISSION = 'update permission'

const reducer = (state, action) => {
    // SET_PERMISSIONS and REFETCH are allowed despite the `locked` flag being up. Other actions
    // are shielded off by the "is locked" check. See below.
    switch (action.type) {
        case SET_PERMISSIONS:
            return Object.entries(state.changeset).reduce((memo, [user, value]) => (
                reducer(memo, {
                    type: UPDATE_PERMISSION,
                    user,
                    value,
                })
            ), {
                ...state,
                locked: false,
                combinations: combine(action.permissions),
                raw: action.permissions,
            })

        case REFETCH:
            return {
                ...state,
                errors: action.errors,
                fetchCount: state.fetchCount + 1,
            }

        default:
            break
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

const DispatchContext = createContext(() => {})

export const usePermissionsDispatch = () => (
    useContext(DispatchContext)
)

const StateContext = createContext(initialState)

export const usePermissionsState = () => (
    useContext(StateContext)
)

const currentUserIds = (currentUserId, combinations, changeset) => (
    (
        combinations[currentUserId] != null && (!({}).hasOwnProperty.call(changeset, currentUserId) || changeset[currentUserId] != null)
    ) || (
        combinations[currentUserId] == null && changeset[currentUserId] != null
    ) ? [currentUserId] : []
)

const newUserIds = (combinations, changeset) => (
    Object.keys(changeset).filter((userId) => combinations[userId] == null)
)

const remainingUserIds = (combinations, changeset) => (
    Object.keys(combinations).filter((userId) => !({}).hasOwnProperty.call(changeset, userId) || changeset[userId] != null)
)

export const useEditableUserIds = () => {
    const { changeset, combinations } = usePermissionsState()

    const currentUserId = useSelector(selectUsername)

    return useMemo(() => {
        const set = new Set([
            ...currentUserIds(currentUserId, combinations, changeset),
            ...newUserIds(combinations, changeset),
            ...remainingUserIds(combinations, changeset),
        ])

        set.delete('anonymous')

        return [...set]
    }, [currentUserId, combinations, changeset])
}

const mountId = (resourceType, resourceId) => `${resourceType}/${resourceId}`

const PermissionsProvider = ({ resourceType, resourceId, children }) => {
    const [state, dispatch] = useReducer(reducer, {
        ...initialState,
        resourceId,
        resourceType,
    })

    const mountRef = useRef(mountId(resourceType, resourceId))

    useEffect(() => {
        dispatch({
            type: SET_RESOURCE,
            resourceId,
            resourceType,
        })

        mountRef.current = mountId(resourceType, resourceId)
    }, [resourceType, resourceId])

    const isMounted = useIsMounted()

    useEffect(() => {
        const fetch = async () => {
            try {
                const result = await getResourcePermissions({
                    resourceId,
                    resourceType,
                })

                if (!isMounted() || mountRef.current !== mountId(resourceType, resourceId)) {
                    return
                }

                dispatch({
                    permissions: result,
                    type: SET_PERMISSIONS,
                })
            } catch (e) {
                // eslint-disable-next-line no-console
                console.log('Wholesome error.', e)
            }
        }

        fetch()
    }, [resourceType, resourceId, isMounted, state.fetchCount])

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    )
}

export default PermissionsProvider
