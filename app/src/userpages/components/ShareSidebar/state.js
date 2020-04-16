import groupBy from 'lodash/groupBy'
import isEqual from 'lodash/isEqual'
import mapValues from 'lodash/mapValues'

// List of all permissions
// TODO: this should probably come from backend
const PERMISSIONS = [
    'stream_get',
    'stream_edit',
    'stream_delete',
    'stream_publish',
    'stream_subscribe',
    'stream_share',
    'canvas_get',
    'canvas_edit',
    'canvas_delete',
    'canvas_startstop',
    'canvas_interact',
    'canvas_share',
    'dashboard_get',
    'dashboard_edit',
    'dashboard_delete',
    'dashboard_interact',
    'dashboard_share',
    'product_get',
    'product_edit',
    'product_delete',
    'product_share',
].reduce((o, key) => {
    // assumes resourceType_name convention
    let [resourceType, name] = key.split('_') // eslint-disable-line prefer-const
    resourceType = resourceType.toUpperCase()
    o[resourceType] = {
        ...o[resourceType],
        [name]: key,
    }
    return o
}, {})

function validateResourceType(resourceType) {
    if (!resourceType) { throw new Error('resourceType required') }
    if (!PERMISSIONS[resourceType]) { throw new Error(`Unknown resourceType: ${resourceType}`) }
}

function getOperation(resourceType, name) {
    validateResourceType(resourceType)
    return PERMISSIONS[resourceType][name]
}

export function getEmptyPermissions(resourceType) {
    validateResourceType(resourceType)
    return Object.keys(PERMISSIONS[resourceType]).reduce((r, p) => {
        r[p] = false
        return r
    }, {})
}

export function getFullPermissions(resourceType) {
    validateResourceType(resourceType)
    return Object.keys(PERMISSIONS[resourceType]).reduce((r, p) => {
        r[p] = true
        return r
    }, {})
}

const PERMISSION_GROUPS = {
    CANVAS: {
        default: 'user',
        user: {
            get: true,
            interact: true,
        },
        editor: {
            get: true,
            edit: true,
            interact: true,
            startstop: true,
        },
        owner: getFullPermissions('CANVAS'),
        custom: {},
    },
    STREAM: {
        default: 'subscriber',
        subscriber: {
            get: true,
            subscribe: true,
        },
        publisher: {
            get: true,
            publish: true,
        },
        editor: {
            get: true,
            subscribe: true,
            edit: true,
            publish: true,
        },
        owner: getFullPermissions('STREAM'),
        custom: {},
    },
    DASHBOARD: {
        default: 'user',
        user: {
            get: true,
            interact: true,
        },
        editor: {
            get: true,
            edit: true,
            interact: true,
        },
        owner: getFullPermissions('DASHBOARD'),
        custom: {},
    },
    PRODUCT: {
        default: 'viewer',
        viewer: {
            get: true,
        },
        owner: getFullPermissions('PRODUCT'),
        custom: {},
    },
}

export function getPermissionGroups(resourceType) {
    validateResourceType(resourceType)
    return PERMISSION_GROUPS[resourceType]
}

export function getPermissionsForGroupName(resourceType, groupName = 'default') {
    const groups = getPermissionGroups(resourceType)
    if (groupName === 'default') {
        groupName = groups.default
    }
    return {
        ...getEmptyPermissions(resourceType),
        ...groups[groupName],
    }
}

export function findPermissionGroupName(resourceType, userPermissions = {}) {
    const groups = getPermissionGroups(resourceType)
    return Object.keys(groups).filter((name) => name !== 'default').find((groupName) => (
        isEqual(userPermissions, getPermissionsForGroupName(resourceType, groupName))
    )) || 'custom'
}

//
// CRUD Operations
//

export function addUser(users, userId, permissions = {}) {
    if (users[userId]) { return users } // already added
    return {
        ...users,
        [userId]: permissions,
    }
}

export function removeUser(users, userId) {
    if (!(userId in users)) { return users } // no user
    const nextUsers = Object.assign({}, users)
    delete nextUsers[userId]
    return nextUsers
}

export function updatePermission(users, userId, permissions = {}) {
    return {
        ...users,
        [userId]: {
            ...users[userId],
            ...permissions,
        },
    }
}

//
// Conversion to/from permissions array from server
//

export function usersFromPermissions(resourceType, permissions) {
    if (!resourceType) { throw new Error('resourceType required') }
    const users = mapValues(groupBy(permissions, 'user'), (value) => {
        const r = Object.assign({}, getEmptyPermissions(resourceType))
        value.forEach((v) => {
            const [, operation] = v.operation.split('_')
            r[operation] = true
        })
        return r
    })

    if (!users.anonymous) {
        users.anonymous = Object.assign({}, getPermissionsForGroupName(resourceType, 'default'))
    }
    return users
}

/**
 * Convert userId + userPermissions to a permissions array
 */

export function userToPermissions(resourceType, userId, userPermissions) {
    return Object.entries(userPermissions).map(([operation, value]) => {
        if (!value) { return undefined }
        return {
            user: userId,
            operation: PERMISSIONS[resourceType][operation],
        }
    }).filter(Boolean)
}

export function permissionsFromUsers(resourceType, users) {
    return Object.entries(users).map(([userId, userPermissions]) => (
        userToPermissions(resourceType, userId, userPermissions)
    )).flat()
}

export function diffUsersPermissions({ oldPermissions, newUsers, resourceType } = {}) {
    const oldUsers = usersFromPermissions(resourceType, oldPermissions)
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
            added.push(...userToPermissions(resourceType, userId, userPermissions))
        } else if (removedIds.has(userId)) {
            removed.push(...oldPermissions.filter((p) => p.user === userId))
        } else if (changedIds.has(userId)) {
            const prev = oldUsers[userId]
            const curr = newUsers[userId]
            const allOperations = new Set([...Object.keys(curr), ...Object.keys(prev)])
            allOperations.forEach((name) => {
                const operation = getOperation(resourceType, name)
                if (!prev[name] && curr[name]) {
                    added.push({
                        user: userId,
                        operation,
                    })
                } else if (prev[name] && !curr[name]) {
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

export function hasPermissionsChanges({ oldPermissions, newUsers, resourceType } = {}) {
    const diff = diffUsersPermissions({
        oldPermissions,
        newUsers,
        resourceType,
    })
    return !!(diff.added.length || diff.removed.length)
}
