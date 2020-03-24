import groupBy from 'lodash/groupBy'
import isEqual from 'lodash/isEqual'
import mapValues from 'lodash/mapValues'

const ALL_PERMISSIONS = [
    'read',
    'write',
    'share',
]

const EMPTY_PERMISSIONS = ALL_PERMISSIONS.reduce((r, p) => {
    r[p] = false
    return r
}, {})

export const DEFAULT_PERMISSIONS = Object.assign({}, EMPTY_PERMISSIONS, {
    read: true,
})

export function addUser(users, userId) {
    return {
        ...users,
        [userId]: users[userId] || DEFAULT_PERMISSIONS,
    }
}

export function removeUser(users, userId) {
    if (!users[userId]) { return users }
    const nextUsers = Object.assign({}, users)
    delete nextUsers[userId]
    return nextUsers
}

export function updatePermission(users, userId, permisssions = {}) {
    return {
        ...users,
        [userId]: {
            ...(users[userId] || DEFAULT_PERMISSIONS),
            ...permisssions,
        },
    }
}

export function usersFromPermissions(permissions) {
    const users = mapValues(groupBy(permissions, 'user'), (value) => {
        const r = Object.assign({}, EMPTY_PERMISSIONS)
        value.forEach((v) => {
            r[v.operation] = true
        })
        return r
    })

    if (!users.anonymous) {
        users.anonymous = EMPTY_PERMISSIONS
    }
    return users
}

export function userToPermissions(userId, userPermissions) {
    return Object.entries(userPermissions).map(([operation, value]) => {
        if (!value) { return undefined }
        return {
            user: userId,
            operation,
        }
    }).filter(Boolean)
}

export function permissionsFromUsers(users) {
    return Object.entries(users).map(([userId, userPermissions]) => (
        userToPermissions(userId, userPermissions)
    )).flat()
}

export function diffUsersPermissions({ oldPermissions, newUsers } = {}) {
    const oldUsers = usersFromPermissions(oldPermissions)
    const prevUserIds = new Set(Object.keys(oldUsers))
    const newUserIds = new Set(Object.keys(newUsers))
    const allUserIds = new Set([...newUserIds, ...prevUserIds])
    const addedIds = new Set([...allUserIds].filter((u) => !prevUserIds.has(u)))
    const removedIds = new Set([...allUserIds].filter((u) => !newUserIds.has(u)))
    const maybeChangedIds = [...allUserIds].filter((u) => !addedIds.has(u) && !removedIds.has(u))
    const changedIds = new Set(maybeChangedIds.filter((u) => !isEqual(newUsers[u], oldUsers[u])))

    const added = []
    const removed = []
    allUserIds.forEach((userId) => {
        if (addedIds.has(userId)) {
            const userPermissions = newUsers[userId]
            added.push(...userToPermissions(userId, userPermissions))
        } else if (removedIds.has(userId)) {
            removed.push(...oldPermissions.filter((p) => p.user === userId))
        } else if (changedIds.has(userId)) {
            const prev = oldUsers[userId]
            const curr = newUsers[userId]
            const allOperations = new Set([...Object.keys(curr), ...Object.keys(prev)])
            allOperations.forEach((operation) => {
                if (!prev[operation] && curr[operation]) {
                    added.push({
                        user: userId,
                        operation,
                    })
                } else if (prev[operation] && !curr[operation]) {
                    const p = oldPermissions.find((p) => p.user === userId && p.operation === operation)
                    if (!p) { return }
                    removed.push({
                        id: p.id,
                        user: userId,
                        operation,
                    })
                }
            })
        }
    })

    return {
        added,
        removed,
    }
}
