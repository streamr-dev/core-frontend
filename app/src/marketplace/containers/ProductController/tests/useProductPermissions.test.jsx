import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

import * as productServices from '$mp/modules/product/services'
import * as usePending from '$shared/hooks/usePending'
import usePermissionContext, { Provider as PermissionContextProvider } from '../useProductPermissions'
import useController from '../useController'

jest.mock('../useController', () => ({
    __esModule: true,
    default: jest.fn(),
}))

describe('PermissionContext', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('fetches permissions on mount', async () => {
        useController.mockImplementation(() => ({
            product: {
                id: '1',
            },
        }))

        jest.spyOn(usePending, 'default').mockImplementation(() => ({
            wrap: async (fn) => {
                await fn()
            },
            isPending: false,
        }))
        let resolvePermissions
        jest.spyOn(productServices, 'getPermissions').mockImplementation(() => new Promise((resolve) => {
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

    it('does not fetch permissions on mount if flag is not set', async () => {
        useController.mockImplementation(() => ({
            product: {
                id: '1',
            },
        }))

        jest.spyOn(usePending, 'default').mockImplementation(() => ({
            wrap: async (fn) => {
                await fn()
            },
            isPending: false,
        }))
        const getPermissionsStub = jest.spyOn(productServices, 'getPermissions')

        let result
        function Test() {
            result = usePermissionContext()
            return null
        }

        act(() => {
            mount((
                <PermissionContextProvider autoLoadPermissions={false}>
                    <Test />
                </PermissionContextProvider>
            ))
        })

        expect(result.hasPermissions).toBe(false)
        expect(result.get).toBe(false)
        expect(result.edit).toBe(false)
        expect(result.del).toBe(false)
        expect(result.share).toBe(false)
        expect(getPermissionsStub).not.toBeCalled()
    })
})
