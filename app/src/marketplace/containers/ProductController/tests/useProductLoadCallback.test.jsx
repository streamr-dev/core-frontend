import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import BN from 'bignumber.js'

import * as UndoContext from '$shared/contexts/Undo'
import * as usePending from '$shared/hooks/usePending'
import * as productServices from '$mp/modules/product/services'
import * as dataUnionServices from '$mp/modules/dataUnion/services'
import * as loginInterceptor from '$auth/utils/loginInterceptor'
import * as entitiesUtils from '$shared/utils/entities'
import * as ProductController from '../'
import useProductLoadCallback from '../useProductLoadCallback'
import useController from '../useController'

jest.mock('../useController', () => ({
    __esModule: true,
    default: jest.fn(),
}))

describe('useProductLoadCallback', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('loads a product', async () => {
        useController.mockImplementation(() => ({
            setProduct: () => {},
        }))

        jest.spyOn(usePending, 'default').mockImplementation(() => ({
            wrap: async (fn) => {
                await fn()
            },
        }))
        jest.spyOn(productServices, 'getProductById').mockImplementation((id) => ({
            id,
            name: 'Product',
            chain: 'ETHEREUM',
        }))

        let loadProduct
        let product
        function Test() {
            loadProduct = useProductLoadCallback()
            const { state } = useContext(UndoContext.Context)
            product = state
            return null
        }

        mount((
            <UndoContext.Provider>
                <Test />
            </UndoContext.Provider>
        ))

        expect(product).toBeFalsy()

        await act(async () => {
            await loadProduct({
                productId: '1',
            })
        })

        expect(product).toMatchObject({
            id: '1',
            name: 'Product',
        })
    })

    it('throws an error', async () => {
        useController.mockImplementation(() => ({
            setProduct: () => {},
        }))

        jest.spyOn(usePending, 'default').mockImplementation(() => ({
            wrap: async (fn) => {
                await fn()
            },
        }))
        jest.spyOn(productServices, 'getProductById').mockImplementation(() => {
            throw new Error('something happened')
        })
        jest.spyOn(loginInterceptor, 'handleLoadError').mockImplementation(() => Promise.resolve())

        let loadProduct
        let product
        function Test() {
            loadProduct = useProductLoadCallback()
            const { state } = useContext(UndoContext.Context)
            product = state
            return null
        }

        mount((
            <UndoContext.Provider>
                <Test />
            </UndoContext.Provider>
        ))

        expect(product).toBeFalsy()

        await act(async () => {
            try {
                await loadProduct({
                    productId: '1',
                })
            } catch (e) {
                expect(e.message).toBe('something happened')
            }
        })

        expect(product).toBeFalsy()
    })

    it('loads the admin fee for data union products', async () => {
        useController.mockImplementation(() => ({
            setProduct: () => {},
        }))

        jest.spyOn(dataUnionServices, 'getAdminFee').mockImplementation(() => Promise.resolve('0.3'))
        jest.spyOn(usePending, 'default').mockImplementation(() => ({
            wrap: async (fn) => {
                await fn()
            },
        }))
        jest.spyOn(productServices, 'getProductById').mockImplementation((id) => ({
            id,
            name: 'Product',
            type: 'DATAUNION',
            beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
            chain: 'ETHEREUM',
        }))

        let loadProduct
        let product
        function Test() {
            loadProduct = useProductLoadCallback()
            const { state } = useContext(UndoContext.Context)
            product = state
            return null
        }

        mount((
            <UndoContext.Provider>
                <Test />
            </UndoContext.Provider>
        ))

        expect(product).toBeFalsy()

        await act(async () => {
            await loadProduct({
                productId: '1',
            })
        })

        expect(product).toMatchObject({
            id: '1',
            name: 'Product',
            type: 'DATAUNION',
            beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
            adminFee: '0.3',
            dataUnionDeployed: true,
        })
    })

    it('sets dataUnionDeployed = false for data union products if admin fee call fails', async () => {
        useController.mockImplementation(() => ({
            setProduct: () => {},
        }))

        jest.spyOn(dataUnionServices, 'getAdminFee').mockImplementation(() => {
            throw new Error('not found')
        })
        jest.spyOn(usePending, 'default').mockImplementation(() => ({
            wrap: async (fn) => {
                await fn()
            },
        }))
        jest.spyOn(productServices, 'getProductById').mockImplementation((id) => ({
            id,
            name: 'Product',
            type: 'DATAUNION',
            beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
            chain: 'ETHEREUM',
        }))

        let loadProduct
        let product
        function Test() {
            loadProduct = useProductLoadCallback()
            const { state } = useContext(UndoContext.Context)
            product = state
            return null
        }

        mount((
            <UndoContext.Provider>
                <Test />
            </UndoContext.Provider>
        ))

        expect(product).toBeFalsy()

        await act(async () => {
            await loadProduct({
                productId: '1',
            })
        })

        expect(product).toMatchObject({
            id: '1',
            name: 'Product',
            type: 'DATAUNION',
            beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
            chain: 'ETHEREUM',
            adminFee: undefined,
            dataUnionDeployed: false,
        })
    })

    it('loads a product and sets default values for data product', async () => {
        useController.mockImplementation(() => ({
            setProduct: () => {},
        }))

        jest.spyOn(usePending, 'default').mockImplementation(() => ({
            wrap: async (fn) => {
                await fn()
            },
        }))
        jest.spyOn(productServices, 'getProductById').mockImplementation((id) => ({
            id,
            name: 'Product',
            type: 'NORMAL',
            chain: 'ETHEREUM',
        }))

        let loadProduct
        let product
        function Test() {
            loadProduct = useProductLoadCallback()
            const { state } = useContext(UndoContext.Context)
            product = state
            return null
        }

        mount((
            <UndoContext.Provider>
                <Test />
            </UndoContext.Provider>
        ))

        expect(product).toBeFalsy()

        await act(async () => {
            await loadProduct({
                productId: '1',
            })
        })

        expect(product).toStrictEqual({
            id: '1',
            name: 'Product',
            type: 'NORMAL',
            chain: 'ETHEREUM',
            isFree: true,
            price: BN(0),
            priceCurrency: 'DATA',
            timeUnit: 'hour',
            adminFee: undefined,
            dataUnionDeployed: false,
            requiresWhitelist: undefined,
            pricingTokenAddress: undefined,
        })
    })

    it('loads a product with existing values', async () => {
        useController.mockImplementation(() => ({
            setProduct: () => {},
        }))

        jest.spyOn(usePending, 'default').mockImplementation(() => ({
            wrap: async (fn) => {
                await fn()
            },
        }))
        jest.spyOn(productServices, 'getProductById').mockImplementation((id) => ({
            id,
            name: 'Product',
            type: 'NORMAL',
            chain: 'ETHEREUM',
            isFree: false,
            pricePerSecond: BN(1),
            priceCurrency: 'DATA',
        }))

        let loadProduct
        let product
        function Test() {
            loadProduct = useProductLoadCallback()
            const { state } = useContext(UndoContext.Context)
            product = state
            return null
        }

        mount((
            <UndoContext.Provider>
                <Test />
            </UndoContext.Provider>
        ))

        expect(product).toBeFalsy()

        await act(async () => {
            await loadProduct({
                productId: '1',
            })
        })

        expect(product).toMatchObject({
            price: BN(3600),
            pricePerSecond: BN(1),
            priceCurrency: 'DATA',
            timeUnit: 'hour',
        })
    })

    it('sets the loaded product values to context without pending changes', async () => {
        const entityHandler = jest.fn()

        useController.mockImplementation(() => ({
            setProduct: entityHandler,
        }))

        jest.spyOn(usePending, 'default').mockImplementation(() => ({
            wrap: async (fn) => {
                await fn()
            },
        }))
        jest.spyOn(productServices, 'getProductById').mockImplementation((id) => ({
            id,
            name: 'Product',
            type: 'NORMAL',
            chain: 'ETHEREUM',
            isFree: false,
            pricePerSecond: BN(1),
            priceCurrency: 'DATA',
            pendingChanges: {
                name: 'New name',
                pricePerSecond: BN(10),
            },
        }))

        let loadProduct
        let product
        function Test() {
            loadProduct = useProductLoadCallback()
            const { state } = useContext(UndoContext.Context)
            product = state
            return null
        }

        mount((
            <UndoContext.Provider>
                <Test />
            </UndoContext.Provider>
        ))

        expect(product).toBeFalsy()

        await act(async () => {
            await loadProduct({
                productId: '1',
            })
        })
        expect(entityHandler).toHaveBeenCalledWith({
            id: '1',
            name: 'Product',
            type: 'NORMAL',
            chain: 'ETHEREUM',
            isFree: false,
            pricePerSecond: BN(1),
            price: BN(3600),
            timeUnit: 'hour',
            priceCurrency: 'DATA',
            adminFee: undefined,
            dataUnionDeployed: false,
            pendingChanges: null,
        })
    })

    it('sets the loaded product values with pending changes as the editable product data for published products', async () => {
        const entityHandler = jest.fn()
        jest.spyOn(entitiesUtils, 'handleEntities').mockImplementation(() => entityHandler)

        useController.mockImplementation(() => ({
            setProduct: () => {},
        }))

        jest.spyOn(usePending, 'default').mockImplementation(() => ({
            wrap: async (fn) => {
                await fn()
            },
        }))
        jest.spyOn(productServices, 'getProductById').mockImplementation((id) => ({
            id,
            name: 'Product',
            type: 'NORMAL',
            chain: 'ETHEREUM',
            isFree: false,
            pricePerSecond: BN(1),
            priceCurrency: 'DATA',
            pendingChanges: {
                name: 'New name',
                pricePerSecond: BN(10),
            },
            state: 'DEPLOYED',
        }))

        let loadProduct
        let product
        function Test() {
            loadProduct = useProductLoadCallback()
            const { state } = useContext(UndoContext.Context)
            product = state
            return null
        }

        mount((
            <UndoContext.Provider>
                <Test />
            </UndoContext.Provider>
        ))

        expect(product).toBeFalsy()

        await act(async () => {
            await loadProduct({
                productId: '1',
            })
        })
        expect(product).toMatchObject({
            name: 'New name',
            pricePerSecond: BN(10),
        })
    })
})
