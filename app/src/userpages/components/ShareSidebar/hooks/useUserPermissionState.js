import { useMemo, useState, useCallback } from 'react'
import * as State from '../state'
import filterPermissions from '../utils/filterPermissions'
import canShareToUserId from '$shared/utils/sharing/canShareToUserId'

/**
 * Handling of permission state updates, selection & new user list
 * Factored out mainly to give main component some space.
 */

export default function useUserPermissionState(props) {
    const { resourceType, permissions: propPermissions } = props
    const permissions = useMemo(() => filterPermissions(propPermissions), [propPermissions])
    const users = useMemo(() => State.usersFromPermissions(resourceType, permissions), [resourceType, permissions])
    const [currentUsers, setCurrentUsers] = useState(users) // state of user permissions to save to server
    const [newUserIdList, setNewUserIdList] = useState([]) // users added since last save
    const [selectedUserId, setSelectedUserId] = useState() // currently selected user

    /* CRUD APIs */

    const addUser = useCallback((userId) => {
        if (!canShareToUserId(userId)) { return }
        setSelectedUserId(userId) // select new user on add
        setCurrentUsers((prevUsers) => (
            State.addUser(prevUsers, userId, State.getPermissionsForGroupName(resourceType, 'default'))
        ))
        // add/move user to start of new users. Remove before adding to start if already in array
        setNewUserIdList((ids) => [userId, ...ids.filter((id) => id !== userId)])
    }, [setCurrentUsers, resourceType])

    const removeUser = useCallback((userId) => {
        if (!canShareToUserId(userId)) { return }
        setNewUserIdList((ids) => ids.filter((id) => id !== userId)) // remove user from new users list
        setCurrentUsers((prevUsers) => State.removeUser(prevUsers, userId))
    }, [setCurrentUsers])

    const updatePermission = useCallback((userId, permissions) => {
        setCurrentUsers((prevUsers) => State.updatePermission(resourceType, prevUsers, userId, permissions))
    }, [setCurrentUsers, resourceType])

    // 'who has access' handler
    const onAnonymousAccessChange = useCallback(({ value }) => {
        const permissions = value === 'withLink'
            ? State.getPermissionsForGroupName(resourceType, 'default')
            : State.getEmptyPermissions(resourceType) // i.e. remove all permissions for anonymous
        updatePermission('anonymous', permissions)
    }, [updatePermission, resourceType])

    // return everything

    return useMemo(() => ({
        permissions,
        currentUsers,
        addUser,
        removeUser,
        updatePermission,
        onAnonymousAccessChange,
        newUserIdList,
        setNewUserIdList,
        selectedUserId,
        setSelectedUserId,
    }), [
        permissions,
        currentUsers,
        addUser,
        removeUser,
        updatePermission,
        onAnonymousAccessChange,
        newUserIdList,
        setNewUserIdList,
        selectedUserId,
        setSelectedUserId,
    ])
}
