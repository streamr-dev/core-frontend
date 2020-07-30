import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import sinon from 'sinon'

import usePermissionContext, { Provider as PermissionContextProvider } from '../useProductPermissions'
import * as permissionServices from '$userpages/modules/permission/services'
import * as useProduct from '../useProduct'
import * as usePending from '$shared/hooks/usePending'

describe('PermissionContext', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('fetches permissions on mount', async () => {
        sandbox.stub(useProduct, 'default').callsFake(() => ({
            id: '1',
        }))
        sandbox.stub(usePending, 'default').callsFake(() => ({
            wrap: async (fn) => {
                await fn()
            },
            isPending: false,
        }))
        let resolvePermissions
        sandbox.stub(permissionServices, 'getResourcePermissions').callsFake(() => new Promise((resolve) => {
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
