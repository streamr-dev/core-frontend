import React, { useReducer, createContext, useContext, useEffect, useRef, useMemo } from 'react'
import { getResourcePermissions } from '$userpages/modules/permission/services'
import useIsMounted from '$shared/hooks/useIsMounted'
import { combineMany } from './packer'
import { DEFAULTS } from './groups'
import { useSelector } from 'react-redux'
import { selectUsername } from '$shared/modules/user/selectors'

const initialState = {
    changeset: {},
    errors: {},
    locked: true,
    permissions: {},
    raw: {},
    resourceId: undefined,
    resourceType: undefined,
    fetchCount: 0,
}

const SET_RESOURCE = 'set resource'

const SET_PERMISSIONS = 'set permissions'

export const ADD_PERMISSION = 'add permission'

export const REMOVE_PERMISSION = 'remove permission'

export const UPDATE_PERMISSION = 'update permission'

export const UNLOCK = 'unlock'

export const PERSIST = 'persist'

export const REFETCH = 'refetch'

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
                permissions: combineMany(action.permissions),
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
                resourceType: action.resourceType,
                resourceId: action.resourceId,
            }

        case ADD_PERMISSION:
            if (state.changeset[action.user] != null) {
                // Don't overwrite user changes.
                return state
            }

            if (state.permissions[action.user] && !({}).hasOwnProperty.call(state.changeset, action.user)) {
                // Don't overwrite pristine permissions.
                return state
            }

            return reducer(state, {
                type: UPDATE_PERMISSION,
                user: action.user,
                value: DEFAULTS[state.resourceType],
            })

        case REMOVE_PERMISSION:
            if (state.permissions[action.user] != null) {
                return {
                    ...state,
                    changeset: {
                        ...state.changeset,
                        [action.user]: undefined,
                    },
                }
            }

            return {
                ...state,
                changeset: (({ [action.user]: _, ...changeset }) => (
                    changeset
                ))(state.changeset),
            }

        case UPDATE_PERMISSION:
            if (action.value == null) {
                return reducer(state, {
                    type: REMOVE_PERMISSION,
                    user: action.user,
                })
            }

            if (action.value === state.permissions[action.user]) {
                return {
                    ...state,
                    changeset: (({ [action.user]: _, ...changeset }) => (
                        changeset
                    ))(state.changeset),
                }
            }

            return {
                ...state,
                changeset: {
                    ...state.changeset,
                    [action.user]: action.value,
                },
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

const currentUserIds = (currentUserId, permissions, changeset) => (
    (
        permissions[currentUserId] != null && (!({}).hasOwnProperty.call(changeset, currentUserId) || changeset[currentUserId] != null)
    ) || (
        permissions[currentUserId] == null && changeset[currentUserId] != null
    ) ? [currentUserId] : []
)

const newUserIds = (permissions, changeset) => (
    Object.keys(changeset).filter((userId) => permissions[userId] == null)
)

const remainingUserIds = (permissions, changeset) => (
    Object.keys(permissions).filter((userId) => !({}).hasOwnProperty.call(changeset, userId) || changeset[userId] != null)
)

export const useEditableUserIds = () => {
    const { changeset, permissions } = usePermissionsState()

    const currentUserId = useSelector(selectUsername)

    return useMemo(() => {
        const set = new Set([
            ...currentUserIds(currentUserId, permissions, changeset),
            ...newUserIds(permissions, changeset),
            ...remainingUserIds(permissions, changeset),
        ])

        set.delete('anonymous')

        return [...set]
    }, [currentUserId, permissions, changeset])
}

const mountId = (resourceType, resourceId) => `${resourceType}/${resourceId}`

const PermissionsProvider = ({ resourceType, resourceId, children }) => {
    const [state, dispatch] = useReducer(reducer, {
        ...initialState,
        resourceType,
        resourceId,
    })

    useEffect(() => {
        // eslint-disable-next-line no-console
        console.log('ERRORS', state.errors)
        // eslint-disable-next-line no-console
        console.log('CHANGESET', state.changeset)
    }, [state.changeset, state.errors])

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
                    resourceType,
                    resourceId,
                })

                if (!isMounted() && mountRef.current !== mountId(resourceType, resourceId)) {
                    return
                }

                dispatch({
                    type: SET_PERMISSIONS,
                    permissions: result,
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
