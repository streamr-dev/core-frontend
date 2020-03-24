import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { setupAuthorizationHeader } from '$editor/shared/tests/utils'
import { act } from 'react-dom/test-utils'
import * as Services from '$editor/canvas/services'
import { getUserData } from '$shared/modules/user/services'

import * as State from './state'

describe('ShareSidebar Permission Handling', () => {
    let teardown
    let user
    let canvas
    let permissions

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
            const users = State.usersFromPermissions(permissions)
            expect(users.anonymous).toBeTruthy()
            expect(users[user.username]).toBeTruthy()
        })
    })

    it('can add/remove users', () => {
        const newUserId = 'test@test.com'
        let users = State.usersFromPermissions(permissions)
        users = State.addUser(users, newUserId)
        expect(users[newUserId]).toBeTruthy()
        users = State.removeUser(users, newUserId)
        expect(users[newUserId]).not.toBeTruthy() // new user gone
        expect(users[user.username]).toBeTruthy() // original user still around
    })

    it('can update permissions', () => {
        const newUserId = 'test@test.com'
        let users = State.usersFromPermissions(permissions)
        users = State.addUser(users, newUserId)
        users = State.updatePermission(users, newUserId, { read: true })
        expect(users[newUserId].read).toBeTruthy()
        users = State.updatePermission(users, newUserId, { read: false })
        expect(users[newUserId].read).not.toBeTruthy() // read perm gone
        expect(users[user.username]).toBeTruthy() // original user still around
    })

    describe('diff', () => {
        const newUserId = 'test@test.com'
        it('can detect added', () => {
            const users = State.usersFromPermissions(permissions)
            const diff = State.diffUsersPermissions({
                newUsers: users,
                oldPermissions: [],
            })
            expect(diff.added).toEqual(permissions.map(({ user, operation }) => ({
                // ignore id in permissions
                user,
                operation,
            })))
            expect(diff.removed).toEqual([])
        })

        it('can detect removed', () => {
            const diff = State.diffUsersPermissions({
                newUsers: {},
                oldPermissions: permissions,
            })
            expect(diff.added).toEqual([])
            expect(diff.removed).toEqual(permissions)
        })

        it('can detect changed', () => {
            let users = State.usersFromPermissions(permissions)
            users = State.addUser(users, newUserId)
            const updatedPermissions = State.permissionsFromUsers(users)
            users = State.updatePermission(users, newUserId, { read: false })
            const diff = State.diffUsersPermissions({
                newUsers: users,
                oldPermissions: updatedPermissions,
            })
            const oldReadPerm = updatedPermissions.find(({ user, operation }) => user === newUserId && operation === 'read')
            expect(diff.added).toEqual([])
            expect(diff.removed).toEqual([oldReadPerm])
        })
    })
})
