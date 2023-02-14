import React, { useReducer, createContext, useContext, useEffect, useRef, useMemo } from 'react'
import { useClient } from 'streamr-client-react'
import address0 from '$utils/address0'
import useIsMounted from '$shared/hooks/useIsMounted'
import {useAuthController} from "$auth/hooks/useAuthController"
import reducer, { initialState, SET_RESOURCE, SET_PERMISSIONS } from './utils/reducer'

const DispatchContext = createContext(() => {})
export const usePermissionsDispatch = () => useContext(DispatchContext)
const StateContext = createContext(initialState)
export const usePermissionsState = () => useContext(StateContext)

const currentUserIds = (currentUserId, combinations, changeset) =>
    (combinations[currentUserId] != null &&
        (!{}.hasOwnProperty.call(changeset, currentUserId) || changeset[currentUserId] != null)) ||
    (combinations[currentUserId] == null && changeset[currentUserId] != null)
        ? [currentUserId]
        : []

const newUserIds = (combinations, changeset) => Object.keys(changeset).filter((userId) => combinations[userId] == null)

const remainingUserIds = (combinations, changeset) =>
    Object.keys(combinations).filter(
        (userId) => !{}.hasOwnProperty.call(changeset, userId) || changeset[userId] != null,
    )

export const useEditableUserIds = () => {
    const { changeset, combinations } = usePermissionsState()
    const {currentAuthSession} = useAuthController()
    return useMemo(() => {
        const set = new Set([
            ...currentUserIds(currentAuthSession.address, combinations, changeset),
            ...newUserIds(combinations, changeset),
            ...remainingUserIds(combinations, changeset),
        ])
        set.delete(address0)
        return [...set]
    }, [currentAuthSession, combinations, changeset])
}

const mountId = (resourceType, resourceId) => `${resourceType}/${resourceId}`

const PermissionsProvider = ({ resourceType, resourceId, children }) => {
    const client = useClient()
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
                const stream = await client.getStream(resourceId)
                const result = await stream.getPermissions()

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
    }, [resourceType, resourceId, isMounted, client])
    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>{children}</StateContext.Provider>
        </DispatchContext.Provider>
    )
}

export default PermissionsProvider
