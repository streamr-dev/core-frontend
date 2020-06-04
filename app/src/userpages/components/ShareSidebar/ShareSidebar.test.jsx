import { setupAuthorizationHeader } from '$editor/shared/tests/utils'
import * as Services from '$editor/canvas/services'
import { getUserData } from '$shared/modules/user/services'

import * as State from './state'

describe('ShareSidebar Permission Handling', () => {
    // TODO: make these tests ignorant of particular permission names
    let teardown
    let user
    let canvas
    let permissions
    const resourceType = 'CANVAS'

    beforeAll(async () => {
        teardown = await setupAuthorizationHeader()
    }, 60000)

    afterAll(async () => {
        await teardown()
    })

    beforeAll(async () => {
        user = await getUserData()
        canvas = await Services.create()
        permissions = await Services.getCanvasPermissions(canvas)
    })

    afterAll(async () => {
        if (!canvas) { return }
        await Services.deleteCanvas(canvas)
    })

    describe('usersFromPermissions', () => {
        it('creates dictionary of users + permissions', () => {
            const users = State.usersFromPermissions(resourceType, permissions)
            expect(users.anonymous).toBeTruthy() // anonymous user should be added
            expect(users[user.username]).toBeTruthy()
        })
    })

    it('can add/remove users', () => {
        const newUserId = 'test@test.com'
        let users = State.usersFromPermissions(resourceType, permissions)
        users = State.addUser(users, newUserId, {})
        expect(newUserId in users).toBeTruthy()
        users = State.removeUser(users, newUserId)
        expect(newUserId in users).not.toBeTruthy() // new user gone
        expect(user.username in users).toBeTruthy() // original user still around
    })

    it('can update permissions', () => {
        const newUserId = 'test@test.com'
        let users = State.usersFromPermissions(resourceType, permissions)
        users = State.addUser(users, newUserId)
        users = State.updatePermission(resourceType, users, newUserId, { get: true })
        expect(users[newUserId].get).toBeTruthy()
        users = State.updatePermission(resourceType, users, newUserId, { get: false })
        expect(users[newUserId].get).not.toBeTruthy() // read perm gone
        expect(users[user.username]).toBeTruthy() // original user still around
    })

    it('keeps order of keys', () => {
        let users = State.usersFromPermissions(resourceType, permissions)
        const expectedOrder = Object.keys(State.getEmptyPermissions(resourceType))
        users = State.updatePermission(resourceType, users, user.username, { get: true })
        expect(Object.keys(users[user.username])).toEqual(expectedOrder)
        users = State.updatePermission(resourceType, users, user.username, { get: false })
        expect(Object.keys(users[user.username])).toEqual(expectedOrder)
    })

    it('errors with bad userId', () => {
        const users = State.usersFromPermissions(resourceType, permissions)
        const badUserIds = [
            null,
            undefined,
            {},
            2,
            0,
            /asdasd/,
            false,
            true,
        ]

        badUserIds.forEach((badUserId) => {
            expect(() => State.addUser(users, badUserId)).toThrow(/Invalid/g)
            expect(() => State.removeUser(users, badUserId)).toThrow(/Invalid/g)
            expect(() => State.updatePermission(resourceType, users, badUserId, { get: false })).toThrow(/Invalid/g)
        })
    })

    describe('diff/hasPermissionsChanges', () => {
        const newUserId = 'test@test.com'

        it('handles no changes', () => {
            const users = State.usersFromPermissions(resourceType, permissions)
            const diff = State.diffUsersPermissions({
                newUsers: users,
                oldPermissions: permissions,
                resourceType,
            })

            expect(diff.added).toEqual([])
            expect(diff.removed).toEqual([])

            expect(State.hasPermissionsChanges({
                newUsers: users,
                oldPermissions: permissions,
                resourceType,
            })).toBe(false)
        })

        it('can detect added', () => {
            const users = State.usersFromPermissions(resourceType, permissions)
            const diff = State.diffUsersPermissions({
                newUsers: users,
                oldPermissions: [],
                resourceType,
            })
            expect(diff.added).toEqual(permissions.map(({ user, operation }) => ({
                // ignore id in permissions
                user,
                operation,
            })))
            expect(diff.removed).toEqual([])
            expect(State.hasPermissionsChanges({
                newUsers: users,
                oldPermissions: [],
                resourceType,
            })).toBeTruthy()
        })

        it('can detect removed', () => {
            const diff = State.diffUsersPermissions({
                newUsers: {},
                oldPermissions: permissions,
                resourceType,
            })
            expect(diff.added).toEqual([])
            expect(diff.removed).toEqual(permissions)
            expect(State.hasPermissionsChanges({
                newUsers: {},
                oldPermissions: permissions,
                resourceType,
            })).toBeTruthy()
        })

        it('can detect changed', () => {
            let users = State.usersFromPermissions(resourceType, permissions)
            users = State.addUser(users, newUserId, { get: true })
            const updatedPermissions = State.permissionsFromUsers(resourceType, users)
            const oldReadPerm = updatedPermissions.find(({ user, operation }) => user === newUserId && operation === 'canvas_get')
            expect(oldReadPerm).toBeTruthy()

            users = State.updatePermission(resourceType, users, newUserId, { get: false })
            const diff = State.diffUsersPermissions({
                newUsers: users,
                oldPermissions: updatedPermissions,
                resourceType,
            })
            expect(diff.added).toEqual([])
            expect(diff.removed).toEqual([oldReadPerm])

            expect(State.hasPermissionsChanges({
                newUsers: users,
                oldPermissions: updatedPermissions,
                resourceType,
            })).toBeTruthy()
        })

        it('can detect changed when multiple identical permissions', () => {
            let users = State.usersFromPermissions(resourceType, permissions)
            users = State.addUser(users, newUserId, { get: true })
            const updatedPermissions = State.permissionsFromUsers(resourceType, users)
            const oldReadPerm = updatedPermissions.find(({ user, operation }) => user === newUserId && operation === 'canvas_get')
            expect(oldReadPerm).toBeTruthy()
            const duplicateOldReadPermision = {
                ...oldReadPerm,
                id: Math.random(),
            }
            updatedPermissions.push(duplicateOldReadPermision)

            users = State.updatePermission(resourceType, users, newUserId, { get: false })
            const diff = State.diffUsersPermissions({
                newUsers: users,
                oldPermissions: updatedPermissions,
                resourceType,
            })
            expect(diff.added).toEqual([])
            expect(diff.removed).toEqual([oldReadPerm, duplicateOldReadPermision])

            expect(State.hasPermissionsChanges({
                newUsers: users,
                oldPermissions: updatedPermissions,
                resourceType,
            })).toBeTruthy()
        })
    })

    describe('permission group name detection', () => {
        State.getResourceTypes().slice(0, 1).forEach((resourceType) => {
            describe(`using ${resourceType}`, () => {
                it('defaults to default', () => {
                    const groups = State.getPermissionGroups(resourceType)
                    const p = State.getPermissionsForGroupName(resourceType, 'default')
                    const p1 = State.getPermissionsForGroupName(resourceType)
                    const p2 = State.getPermissionsForGroupName(resourceType, groups.default)
                    expect(p).toEqual(p1)
                    expect(p).toEqual(p2)
                })

                it('detects correct name from exact matching permissions', () => {
                    const groups = State.getPermissionGroups(resourceType)
                    Object.keys(groups).filter((name) => name !== 'default').forEach((expectedGroupName) => {
                        const p = State.getPermissionsForGroupName(resourceType, expectedGroupName)
                        expect(State.findPermissionGroupName(resourceType, p)).toEqual(expectedGroupName)
                    })
                })

                it('detects default group name correctly', () => {
                    const groups = State.getPermissionGroups(resourceType)
                    const defaultPermissions = State.getPermissionsForGroupName(resourceType, 'default')
                    expect(State.findPermissionGroupName(resourceType, defaultPermissions)).toEqual(groups.default) // i.e. not default
                })
            })
        })

        it('detects correct name + isCustom from similar matching permissions', () => {
            // for CANVAS, user/editor are dissimilar
            const GROUP_NAME = 'user'
            const p = State.getPermissionsForGroupName(resourceType, GROUP_NAME)
            expect(State.isCustom(resourceType, GROUP_NAME, p)).toBeFalsy()
            const newPermissions = Object.assign({}, p, {
                edit: true,
            })
            expect(State.findPermissionGroupName(resourceType, newPermissions)).toEqual(GROUP_NAME)
            expect(State.isCustom(resourceType, GROUP_NAME, newPermissions)).toBeTruthy()
        })
    })
})
