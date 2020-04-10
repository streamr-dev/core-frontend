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
        it('creates dictionary of users + permissions', async () => {
            const users = State.usersFromPermissions(resourceType, permissions)
            expect(users.anonymous).toBeTruthy()
            expect(users[user.username]).toBeTruthy()
        })
    })

    it('can add/remove users', () => {
        const newUserId = 'test@test.com'
        let users = State.usersFromPermissions(resourceType, permissions)
        users = State.addUser(users, newUserId, {})
        expect(users[newUserId]).toBeTruthy()
        users = State.removeUser(users, newUserId)
        expect(users[newUserId]).not.toBeTruthy() // new user gone
        expect(users[user.username]).toBeTruthy() // original user still around
    })

    it('can update permissions', () => {
        const newUserId = 'test@test.com'
        let users = State.usersFromPermissions(resourceType, permissions)
        users = State.addUser(users, newUserId)
        users = State.updatePermission(users, newUserId, { get: true })
        expect(users[newUserId].get).toBeTruthy()
        users = State.updatePermission(users, newUserId, { get: false })
        expect(users[newUserId].get).not.toBeTruthy() // read perm gone
        expect(users[user.username]).toBeTruthy() // original user still around
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

            users = State.updatePermission(users, newUserId, { get: false })
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
    })
})
