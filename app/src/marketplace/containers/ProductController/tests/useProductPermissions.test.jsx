import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import * as permissionServices from '$userpages/modules/permission/services'
import * as usePending from '$shared/hooks/usePending'
import usePermissionContext, { Provider as PermissionContextProvider } from '../useProductPermissions'
import * as useProduct from '../useProduct'

describe('PermissionContext', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('fetches permissions on mount', async () => {
        jest.spyOn(useProduct, 'default').mockImplementation(() => ({
            id: '1',
        }))
        jest.spyOn(usePending, 'default').mockImplementation(() => ({
            wrap: async (fn) => {
                await fn()
            },
            isPending: false,
        }))
        let resolvePermissions
        jest.spyOn(permissionServices, 'getResourcePermissions').mockImplementation(() => new Promise((resolve) => {
            resolvePermissions = resolve
        }))

        let result
        function Test() {
            result = usePermissionContext()
            return null
        }

        act(() => {
            mount((
                <PermissionContextProvider>
                    <Test />
                </PermissionContextProvider>
            ))
        })

        expect(result.hasPermissions).toBe(false)
        expect(result.get).toBe(false)
        expect(result.edit).toBe(false)
        expect(result.del).toBe(false)
        expect(result.share).toBe(false)

        await act(async () => {
            resolvePermissions([{
                operation: 'product_get',
            }, {
                operation: 'product_delete',
            }, {
                operation: 'product_share',
            }])
        })

        expect(result.hasPermissions).toBe(true)
        expect(result.get).toBe(true)
        expect(result.edit).toBe(false)
        expect(result.del).toBe(true)
        expect(result.share).toBe(true)
    })
})
