import React, { useReducer, createContext, useContext, useEffect, useRef, useMemo } from 'react'
import { getResourcePermissions } from '$userpages/modules/permission/services'
import useIsMounted from '$shared/hooks/useIsMounted'
import reducer, { initialState, SET_RESOURCE, SET_PERMISSIONS } from './utils/reducer'
import { useSelector } from 'react-redux'
import { selectUsername } from '$shared/modules/user/selectors'

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
                console.error(e)
            }
        }

        fetch()
    }, [resourceType, resourceId, isMounted])

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    )
}

export default PermissionsProvider
