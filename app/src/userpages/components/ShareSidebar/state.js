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
    },
    PRODUCT: {
        default: 'viewer',
        viewer: {
            get: true,
        },
        owner: getFullPermissions('PRODUCT'),
    },
}

export function getResourceTypes() {
    return Object.keys(PERMISSION_GROUPS)
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

function countMatching(userPermissions1 = {}, userPermissions2 = {}) {
    return [...new Set(Object.keys(userPermissions1), Object.keys(userPermissions2))].reduce((count, key) => (
        count + (userPermissions1[key] === userPermissions2[key] ? 1 : 0)
    ), 0)
}

export function isCustom(resourceType, groupName, userPermissions = {}) {
    return !isEqual(userPermissions, getPermissionsForGroupName(resourceType, groupName))
}

export function findPermissionGroupName(resourceType, userPermissions = {}) {
    const groups = getPermissionGroups(resourceType)
    let maxMatching = -Infinity
    return Object.keys(groups).filter((name) => name !== 'default').reduce((selectedGroup, groupName) => {
        const matching = countMatching(userPermissions, getPermissionsForGroupName(resourceType, groupName))
        if (matching > maxMatching) {
            maxMatching = matching
            return groupName
        }
        return selectedGroup
    }, '')
}

//
// CRUD Operations
//

function isValidUserId(userId) {
    if (!userId || typeof userId !== 'string') { return false }
    if (!userId.trim()) { return false }
    return true
}

function validateUserId(userId) {
    if (!isValidUserId(userId)) {
        throw new Error(`Invalid userId: ${userId}`)
    }
    return userId.trim()
}

export function addUser(users, userId, permissions = {}) {
    userId = validateUserId(userId)
    if (users[userId]) { return users } // already added
    return {
        ...users,
        [userId]: permissions,
    }
}

export function removeUser(users, userId) {
    userId = validateUserId(userId)
    if (!(userId in users)) { return users } // no user
    const nextUsers = Object.assign({}, users)
    delete nextUsers[userId]
    return nextUsers
}

export function updatePermission(users, userId, permissions = {}) {
    userId = validateUserId(userId)
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
        // anonymous users have no permissions by default
        users.anonymous = Object.assign({}, getEmptyPermissions(resourceType))
    }
    return users
}

/**
 * Convert userId + userPermissions to a permissions array
 */

export function userToPermissions(resourceType, userId, userPermissions) {
    userId = validateUserId(userId)
    return Object.entries(userPermissions).map(([operation, value]) => {
        if (!value) { return undefined }
        const operationValue = PERMISSIONS[resourceType][operation]
        return {
            user: userId,
            operation: operationValue,
        }
    }).filter(Boolean)
}

export function permissionsFromUsers(resourceType, users) {
    return Object.entries(users).map(([userId, userPermissions]) => (
        userToPermissions(resourceType, validateUserId(userId), userPermissions)
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
                    // note there could be multiple permissions of same operation + user, we want to remove them all
                    const matchingPermissions = oldPermissions.filter((p) => p.user === userId && p.operation === operation)
                    if (!matchingPermissions.length) { return }
                    matchingPermissions.forEach((p) => {
                        removed.push({
                            id: p.id,
                            user: userId,
                            operation,
                        })
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

/**
 * Convert server anonymous permission to look like a regular user permission.
 * Allows treating anonymous permission like regular user permission.
 * Noop if not anonymous user.
 * Use on permission data from server.
 * i.e. { anonymous: true, … } -> { user: 'anonymous', … }
 */

export function fromAnonymousPermission(anonymousPermission) {
    if (!anonymousPermission.anonymous) { return anonymousPermission }
    const permission = Object.assign({}, anonymousPermission)
    delete permission.anonymous
    permission.user = 'anonymous'
    return permission
}

/**
 * Convert regular user permission to server anonymous permission.
 * Noop if not anonymous user.
 * Use on permissions before sending to server.
 * i.e. { user: 'anonymous', … } -> { anonymous: true, … }
 */

export function toAnonymousPermission(permission) {
    if (permission.user !== 'anonymous') { return permission }
    const anonymousPermission = Object.assign({}, permission)
    delete anonymousPermission.user
    anonymousPermission.anonymous = true
    return anonymousPermission
}

/**
 * True for non-empty userIds other than currentUser and anonymous
 */

export function canShareToUser({ currentUser, userId }) {
    return isValidUserId(userId) && userId !== 'anonymous' && userId !== currentUser
}
