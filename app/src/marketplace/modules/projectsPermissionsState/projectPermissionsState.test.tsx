import React, {useReducer} from "react"
import {act, render} from "@testing-library/react"
import {
    projectsPermissionsReducer,
    ProjectsPermissionsState
} from "$mp/modules/projectsPermissionsState/projectsPermissionsState"
import {ProjectPermissions} from "$app/src/services/projects"

describe('projectPermissionsState', () => {
    let state: ProjectsPermissionsState
    let dispach

    const prepareTest = (initialState: ProjectsPermissionsState) => {
        const TestComponent = () => {
            const [projectsPermissions, dispatchPermissionsUpdate] = useReducer(projectsPermissionsReducer, initialState)
            state = projectsPermissions
            dispach = dispatchPermissionsUpdate
            return <></>
        }
        render(<TestComponent/>)
    }

    it('should add permissions to empty state', () => {
        prepareTest({})
        const permissions: ProjectPermissions = {
            canEdit: false,
            canBuy: true,
            canDelete: false,
            canGrant: false
        }
        act(() => {
            dispach({projectId: 'prjct', userAddress: '0xa', permissions})
        })
        expect(state).toStrictEqual({prjct: {'0xa': permissions}})
    })

    it('should add permissions for another project', () => {
        const permissions1: ProjectPermissions = {
            canEdit: false,
            canBuy: true,
            canDelete: false,
            canGrant: false
        }
        const permissions2: ProjectPermissions = {
            canEdit: true,
            canBuy: true,
            canDelete: true,
            canGrant: true
        }
        prepareTest({prjct1: {'0xaaaa': permissions1}})
        act(() => {
            dispach({projectId: 'prjct2', userAddress: '0x812', permissions: permissions2})
        })
        expect(state).toStrictEqual({
            prjct1: {'0xaaaa': permissions1},
            prjct2: {'0x812': permissions2}
        })
    })

    it('should add permissions for another user in the same project', () => {
        const permissions1: ProjectPermissions = {
            canEdit: false,
            canBuy: true,
            canDelete: false,
            canGrant: false
        }
        const permissions2: ProjectPermissions = {
            canEdit: true,
            canBuy: true,
            canDelete: true,
            canGrant: true
        }
        prepareTest({prjct: {'0xc': permissions1}})
        act(() => {
            dispach({projectId: 'prjct', userAddress: '0xd', permissions: permissions2})
        })
        expect(state).toStrictEqual({
            prjct: {'0xc': permissions1, '0xd': permissions2}
        })
    })

    it('should add override user permissions', () => {
        const permissions1: ProjectPermissions = {
            canEdit: false,
            canBuy: true,
            canDelete: false,
            canGrant: false
        }
        const permissions2: ProjectPermissions = {
            canEdit: true,
            canBuy: true,
            canDelete: true,
            canGrant: true
        }
        prepareTest({prjct: {'0x1': permissions1}})
        act(() => {
            dispach({projectId: 'prjct', userAddress: '0x1', permissions: permissions2})
        })
        expect(state).toStrictEqual({
            prjct: {'0x1': permissions2}
        })
    })
})
