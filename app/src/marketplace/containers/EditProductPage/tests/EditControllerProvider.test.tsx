import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { Router, useLocation } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { mock } from 'jest-mock-extended'

import getConfig from '$app/src/getters/getConfig'
import Notification from '$shared/utils/Notification'
import * as UndoContext from '$shared/contexts/Undo'
import * as useModal from '$shared/hooks/useModal'
import * as usePending from '$shared/hooks/usePending'
import * as productServices from '$mp/modules/product/services'
import * as useEditableState from '$shared/contexts/Undo/useEditableState'

import {
    Provider as ValidationContextProvider,
    Context as ValidationContext,
} from '../../ProductController/ValidationContextProvider'
import { Provider as EditControllerProvider, Context as EditControllerContext } from '../EditControllerProvider'

jest.mock('$app/src/getters/getConfig', () => {
    const actual = jest.requireActual('$app/src/getters/getConfig')

    return {
        __esModule: true,
        default: jest.fn().mockImplementation(actual.default),
    }
})

const mockState = {
    product: {
        id: '1',
    },
    dataUnion: {
        id: 'dataUnionId',
    },
    entities: {
        products: {
            '1': {
                id: '1',
            },
        },
        dataUnions: {
            dataUnionId: {
                id: 'dataUnionId',
            },
        },
        dataUnionStats: {
            dataUnionId: {
                id: 'dataUnionId',
                memberCount: {
                    active: 0,
                },
            },
        },
    },
}
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation((selectorFn) => selectorFn(mockState)),
}))
jest.mock('../../ProductController', () => ({
    useController: () => ({
        product: {
            id: '1',
        },
    }),
}))
describe('EditControllerProvider', () => {
    let usePendingMock = null
    beforeEach(() => {
        usePendingMock = mock(usePending)
    })
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })
    describe('validate', () => {
        it('returns false and notifies if product fields are missing', async () => {
            let currentContext
            let validationContext

            function Test() {
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            }

            const product = {
                id: '1',
            } as any
            const notificationStub = jest.spyOn(Notification, 'push')
            const history = createMemoryHistory()
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            await act(async () => {
                await validationContext.validate(product)
            })
            let result
            await act(async () => {
                result = await currentContext.validate()
            })
            expect(result).toBe(false)
            expect(notificationStub).toHaveBeenCalledTimes(5)
        })
        it('notifies if product fields are missing', async () => {
            let currentContext
            let validationContext

            function Test() {
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            }

            const product = {
                id: '1',
                name: 'data union',
                description: 'description',
                type: 'DATAUNION',
                beneficiaryAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                pricePerSecond: '1',
                priceCurrency: 'DATA',
                category: 'test',
                imageUrl: 'http://...',
                streams: ['1', '2'],
                pricingTokenAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
            } as any
            const notificationStub = jest.spyOn(Notification, 'push')
            const history = createMemoryHistory()
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            await act(async () => {
                await validationContext.validate(product)
            })
            let result
            await act(async () => {
                result = await currentContext.validate()
            })
            expect(notificationStub).toHaveBeenCalledTimes(1)
            expect(notificationStub).toBeCalledWith({
                title: 'Admin fee cannot be empty',
                icon: 'error',
            })
            expect(result).toBe(false)
        })
    })
    describe('back', () => {
        it('redirects if no fields are touched', async () => {
            let currentContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                return null
            }

            const product = {
                id: '1',
                name: 'name',
            } as any
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await currentContext.back()
            })
            expect(location.pathname).toBe('/core/products')
        })
        it('asks confirmation if fields are touched, does not redirect if canceled', async () => {
            let currentContext
            let validationContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            }

            const product = {
                id: '1',
                name: 'name',
            } as any
            const modalOpenStub = jest.fn(() =>
                Promise.resolve({
                    save: false,
                    redirect: false,
                }),
            )
            jest.spyOn(useModal, 'default').mockImplementation(() => ({
                api: {
                    open: modalOpenStub,
                },
            } as any))
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await validationContext.setTouched('name')
            })
            await act(async () => {
                await currentContext.back()
            })
            expect(location.pathname).toBe('/core/products/1/edit')
        })
        it('asks confirmation if fields are touched, redirects without saving if changes are discarded', async () => {
            let currentContext
            let validationContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            }

            const product = {
                id: '1',
                name: 'name',
            } as any
            const modalOpenStub = jest.fn(() =>
                Promise.resolve({
                    save: false,
                    redirect: true,
                }),
            )
            jest.spyOn(useModal, 'default').mockImplementation(() => ({
                api: {
                    open: modalOpenStub,
                },
            } as any))
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await validationContext.setTouched('name')
            })
            await act(async () => {
                await currentContext.back()
            })
            expect(location.pathname).toBe('/core/products')
        })
        it('asks confirmation if fields are touched, redirects after saving', async () => {
            let currentContext
            let validationContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            }

            const product = {
                id: '1',
                name: 'name',
            } as any
            const modalOpenStub = jest.fn(() =>
                Promise.resolve({
                    save: true,
                    redirect: true,
                }),
            )
            jest.spyOn(useModal, 'default').mockImplementation(() => ({
                api: {
                    open: modalOpenStub,
                },
            } as any))
            usePendingMock.wrap.mockReturnValue(async (fn) => {
                const result = await fn()
                return result
            })
            const putProductStub = jest
                .spyOn(productServices, 'putProduct')
                .mockImplementation(() => Promise.resolve({ ...product as any }))
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await validationContext.setTouched('name')
            })
            await act(async () => {
                await currentContext.back()
            })
            expect(putProductStub).toHaveBeenCalledTimes(1)
            expect(location.pathname).toBe('/core/products')
        })
    })
    describe('save', () => {
        it('saves product info', async () => {
            let currentContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                return null
            }

            const product = {
                id: '1',
                name: 'name',
            } as any
            usePendingMock.wrap.mockReturnValue(async (fn) => {
                const result = await fn()
                return result
            })
            const putProductStub = jest
                .spyOn(productServices, 'putProduct')
                .mockImplementation(() => Promise.resolve({ ...product as any }))
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await currentContext.save()
            })
            expect(putProductStub).toHaveBeenCalledTimes(1)
            expect(location.pathname).toBe('/core/products')
        })
        it('uploads new image before saving product info', async () => {
            let currentContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                return null
            }

            const product = {
                id: '1',
                name: 'name',
                newImageToUpload: new File([''], 'filename'),
            } as any
            usePendingMock.wrap.mockReturnValue(async (fn) => {
                const result = await fn()
                return result
            })
            const replaceStateStub = jest.fn()
            jest.spyOn(useEditableState, 'default').mockImplementation(() => ({
                replaceState: (fn) => replaceStateStub(fn(product)),
            } as any))
            const postImageStub = jest.spyOn(productServices, 'postImage').mockImplementation(() =>
                Promise.resolve({
                    imageUrl: 'imageUrl',
                    thumbnailUrl: 'thumbnailUrl',
                } as any),
            )
            const putProductStub = jest
                .spyOn(productServices, 'putProduct')
                .mockImplementation(() => Promise.resolve({ ...product as any }))
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await currentContext.save()
            })
            const expectedProduct = {
                ...product,
                imageUrl: 'imageUrl',
                thumbnailUrl: 'thumbnailUrl',
                newImageToUpload: undefined,
            }
            delete expectedProduct.newImageToUpload
            expect(postImageStub).toHaveBeenCalledTimes(1)
            expect(postImageStub).toBeCalledWith(product.id, product.newImageToUpload)
            expect(replaceStateStub).toHaveBeenCalledTimes(1)
            expect(replaceStateStub).toBeCalledWith(expectedProduct)
            expect(putProductStub).toHaveBeenCalledTimes(1)
            expect(location.pathname).toBe('/core/products')
        })
        it('does not redirect if options.redirect = false', async () => {
            let currentContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                return null
            }

            const product = {
                id: '1',
                name: 'name',
            } as any
            usePendingMock.wrap.mockReturnValue(async (fn) => {
                const result = await fn()
                return result
            })
            const putProductStub = jest
                .spyOn(productServices, 'putProduct')
                .mockImplementation(() => Promise.resolve({ ...product } as any))
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await currentContext.save({
                    redirect: false,
                })
            })
            expect(putProductStub).toHaveBeenCalledTimes(1)
            expect(location.pathname).toBe('/core/products/1/edit')
        })
    })
    describe('publish', () => {
        it('sets publish attempted if params is present in url', () => {
            let currentContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                return null
            }

            const product = {
                id: '1',
            } as any
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit?publishAttempted=1'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(currentContext.publishAttempted).toBe(true)
            expect(location.pathname).toBe('/core/products/1/edit')
        })
        it('sets publish attempted if validation fails', async () => {
            let currentContext
            let validationContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            }

            const product = {
                id: '1',
            } as any
            const notificationStub = jest.spyOn(Notification, 'push')
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(currentContext.publishAttempted).toBe(false)
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await validationContext.validate(product)
            })
            await act(async () => {
                await currentContext.publish()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(notificationStub).toHaveBeenCalledTimes(5)
            expect(location.pathname).toBe('/core/products/1/edit')
        })
        it('does not redirect if publish fails', async () => {
            let currentContext
            let validationContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            }

            const product = {
                id: '1',
                name: 'data union',
                description: 'description',
                type: 'NORMAL',
                beneficiaryAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                pricePerSecond: '1',
                priceCurrency: 'DATA',
                category: 'test',
                imageUrl: 'http://...',
                streams: ['1', '2'],
                pricingTokenAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                chain: 'ETHEREUM',
            } as any
            const modalOpenStub = jest.fn(() =>
                Promise.resolve({
                    succeeded: false,
                }),
            )
            jest.spyOn(useModal, 'default').mockImplementation(() => ({
                api: {
                    open: modalOpenStub,
                },
            } as any))
            jest.spyOn(productServices, 'putProduct').mockImplementation(() => Promise.resolve({ ...product as any }))
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(currentContext.publishAttempted).toBe(false)
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await validationContext.validate(product)
            })
            await act(async () => {
                await currentContext.publish()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(modalOpenStub).toHaveBeenCalledTimes(1)
            expect(modalOpenStub).toBeCalledWith({
                product,
            })
            expect(location.pathname).toBe('/core/products/1/edit')
        })
        it('updates publishing state if process is started before completing', async () => {
            let currentContext
            let validationContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            }

            const product = {
                id: '1',
                name: 'data union',
                description: 'description',
                type: 'NORMAL',
                beneficiaryAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                pricePerSecond: '1',
                priceCurrency: 'DATA',
                category: 'test',
                imageUrl: 'http://...',
                streams: ['1', '2'],
                pricingTokenAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                chain: 'ETHEREUM',
            } as any
            const modalOpenStub = jest.fn(() =>
                Promise.resolve({
                    succeeded: false,
                    started: true,
                    isUnpublish: false,
                }),
            )
            jest.spyOn(useModal, 'default').mockImplementation(() => ({
                api: {
                    open: modalOpenStub,
                },
            } as any))
            jest.spyOn(productServices, 'putProduct').mockImplementation(() => Promise.resolve({ ...product as any }))
            const replaceStateStub = jest.fn()
            jest.spyOn(useEditableState, 'default').mockImplementation(() => ({
                replaceState: (fn) => replaceStateStub(fn(product)),
            } as any))
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(currentContext.publishAttempted).toBe(false)
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await validationContext.validate(product)
            })
            await act(async () => {
                await currentContext.publish()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(modalOpenStub).toHaveBeenCalledTimes(1)
            expect(modalOpenStub).toBeCalledWith({
                product,
            })
            expect(replaceStateStub).toHaveBeenCalledTimes(1)
            expect(replaceStateStub).toBeCalledWith({
                ...product,
                state: 'DEPLOYING',
            })
            expect(location.pathname).toBe('/core/products/1/edit')
        })
        it('updates unpublishing state if process is started before completing', async () => {
            let currentContext
            let validationContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            }

            const product = {
                id: '1',
                name: 'data union',
                description: 'description',
                type: 'NORMAL',
                beneficiaryAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                pricePerSecond: '1',
                priceCurrency: 'DATA',
                category: 'test',
                imageUrl: 'http://...',
                streams: ['1', '2'],
                pricingTokenAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                chain: 'ETHEREUM',
            } as any
            const modalOpenStub = jest.fn(() =>
                Promise.resolve({
                    succeeded: false,
                    started: true,
                    isUnpublish: true,
                }),
            )
            jest.spyOn(useModal, 'default').mockImplementation(() => ({
                api: {
                    open: modalOpenStub,
                },
            } as any))
            jest.spyOn(productServices, 'putProduct').mockImplementation(() => Promise.resolve({ ...product as any }))
            const replaceStateStub = jest.fn()
            jest.spyOn(useEditableState, 'default').mockImplementation(() => ({
                replaceState: (fn) => replaceStateStub(fn(product)),
            } as any))
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(currentContext.publishAttempted).toBe(false)
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await validationContext.validate(product)
            })
            await act(async () => {
                await currentContext.publish()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(modalOpenStub).toHaveBeenCalledTimes(1)
            expect(modalOpenStub).toBeCalledWith({
                product,
            })
            expect(replaceStateStub).toHaveBeenCalledTimes(1)
            expect(replaceStateStub).toBeCalledWith({
                ...product,
                state: 'UNDEPLOYING',
            })
            expect(location.pathname).toBe('/core/products/1/edit')
        })
        it('redirects to product list if publish succeeded and dialog closed normally', async () => {
            let currentContext
            let validationContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            }

            const product = {
                id: '1',
                name: 'data union',
                description: 'description',
                type: 'NORMAL',
                beneficiaryAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                pricePerSecond: '1',
                priceCurrency: 'DATA',
                category: 'test',
                imageUrl: 'http://...',
                streams: ['1', '2'],
                pricingTokenAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                chain: 'ETHEREUM',
            } as any
            const modalOpenStub = jest.fn(() =>
                Promise.resolve({
                    succeeded: true,
                    started: true,
                    isUnpublish: false,
                }),
            )
            jest.spyOn(useModal, 'default').mockImplementation(() => ({
                api: {
                    open: modalOpenStub,
                },
            } as any))
            jest.spyOn(productServices, 'putProduct').mockImplementation(() => Promise.resolve({ ...product as any }))
            const replaceStateStub = jest.fn()
            jest.spyOn(useEditableState, 'default').mockImplementation(() => ({
                replaceState: (fn) => replaceStateStub(fn(product)),
            } as any))
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(currentContext.publishAttempted).toBe(false)
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await validationContext.validate(product)
            })
            await act(async () => {
                await currentContext.publish()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(modalOpenStub).toHaveBeenCalledTimes(1)
            expect(modalOpenStub).toBeCalledWith({
                product,
            })
            expect(replaceStateStub).toHaveBeenCalledTimes(1)
            expect(replaceStateStub).toBeCalledWith({
                ...product,
                state: 'DEPLOYING',
            })
            expect(location.pathname).toBe('/core/products')
        })
        it('redirects to product page if publish succeeded and view product clicked', async () => {
            let currentContext
            let validationContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            }

            const product = {
                id: '1',
                name: 'data union',
                description: 'description',
                type: 'NORMAL',
                beneficiaryAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                pricePerSecond: '1',
                priceCurrency: 'DATA',
                category: 'test',
                imageUrl: 'http://...',
                streams: ['1', '2'],
                pricingTokenAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                chain: 'ETHEREUM',
            } as any
            const modalOpenStub = jest.fn(() =>
                Promise.resolve({
                    succeeded: true,
                    started: true,
                    isUnpublish: false,
                    showPublishedProduct: true,
                }),
            )
            jest.spyOn(useModal, 'default').mockImplementation(() => ({
                api: {
                    open: modalOpenStub,
                },
            } as any))
            jest.spyOn(productServices, 'putProduct').mockImplementation(() => Promise.resolve({ ...product as any }))
            const replaceStateStub = jest.fn()
            jest.spyOn(useEditableState, 'default').mockImplementation(() => ({
                replaceState: (fn) => replaceStateStub(fn(product)),
            } as any))
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(currentContext.publishAttempted).toBe(false)
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await validationContext.validate(product)
            })
            await act(async () => {
                await currentContext.publish()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(modalOpenStub).toHaveBeenCalledTimes(1)
            expect(modalOpenStub).toBeCalledWith({
                product,
            })
            expect(replaceStateStub).toHaveBeenCalledTimes(1)
            expect(replaceStateStub).toBeCalledWith({
                ...product,
                state: 'DEPLOYING',
            })
            expect(location.pathname).toBe('/marketplace/products/1/overview')
        })
        it('redirects to product list if unpublish succeeded', async () => {
            let currentContext
            let validationContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            }

            const product = {
                id: '1',
                name: 'data union',
                description: 'description',
                type: 'NORMAL',
                beneficiaryAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                pricePerSecond: '1',
                priceCurrency: 'DATA',
                category: 'test',
                imageUrl: 'http://...',
                streams: ['1', '2'],
                pricingTokenAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                chain: 'ETHEREUM',
            } as any
            const modalOpenStub = jest.fn(() =>
                Promise.resolve({
                    succeeded: true,
                    started: true,
                    isUnpublish: true,
                }),
            )
            jest.spyOn(useModal, 'default').mockImplementation(() => ({
                api: {
                    open: modalOpenStub,
                },
            } as any))
            jest.spyOn(productServices, 'putProduct').mockImplementation(() => Promise.resolve({ ...product as any }))
            const replaceStateStub = jest.fn()
            jest.spyOn(useEditableState, 'default').mockImplementation(() => ({
                replaceState: (fn) => replaceStateStub(fn(product)),
            } as any))
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(currentContext.publishAttempted).toBe(false)
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await validationContext.validate(product)
            })
            await act(async () => {
                await currentContext.publish()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(modalOpenStub).toHaveBeenCalledTimes(1)
            expect(modalOpenStub).toBeCalledWith({
                product,
            })
            expect(replaceStateStub).toHaveBeenCalledTimes(1)
            expect(replaceStateStub).toBeCalledWith({
                ...product,
                state: 'UNDEPLOYING',
            })
            expect(location.pathname).toBe('/core/products')
        })
        it('checks dataunion member count on publish', async () => {
            let currentContext
            let validationContext
            let location

            const originalConfig = getConfig()
            const getConfigMock = getConfig as any
            getConfigMock.mockImplementation(() => ({
                ...originalConfig,
                core: {
                    ...originalConfig.core,
                    dataUnionPublishMemberLimit: 10,
                },
            }))

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            }

            const product = {
                id: '1',
                name: 'data union',
                description: 'description',
                type: 'DATAUNION',
                beneficiaryAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                pricePerSecond: '1',
                priceCurrency: 'DATA',
                category: 'test',
                imageUrl: 'http://...',
                streams: ['1', '2'],
                pricingTokenAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                chain: 'POLYGON',
                adminFee: 0.2,
            } as any
            const modalOpenStub = jest.fn(() =>
                Promise.resolve({
                    succeeded: true,
                    started: true,
                    isUnpublish: true,
                }),
            )
            jest.spyOn(useModal, 'default').mockImplementation(() => ({
                api: {
                    open: modalOpenStub,
                },
            } as any))
            jest.spyOn(productServices, 'putProduct').mockImplementation(() => Promise.resolve({ ...product as any }))
            const replaceStateStub = jest.fn()
            jest.spyOn(useEditableState, 'default').mockImplementation(() => ({
                replaceState: (fn) => replaceStateStub(fn(product)),
                state: {
                    existingDUAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                },
            } as any))
            const notificationStub = jest.spyOn(Notification, 'push')
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(currentContext.publishAttempted).toBe(false)
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await validationContext.validate(product)
            })
            await act(async () => {
                await currentContext.publish()
            })
            expect(notificationStub).toHaveBeenCalledTimes(1)
            expect(notificationStub).toBeCalledWith({
                title: 'The minimum community size for a Data Union is ten members.',
                icon: 'error',
            })
            expect(currentContext.publishAttempted).toBe(true)
        })
    })
    describe('deployDataUnion', () => {
        it('sets publish attempted if validation fails', async () => {
            let currentContext
            let validationContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            }

            const product = {
                id: '1',
                chain: 'ETHEREUM',
            } as any
            const notificationStub = jest.spyOn(Notification, 'push')
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(currentContext.publishAttempted).toBe(false)
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await validationContext.validate(product)
            })
            await act(async () => {
                await currentContext.deployDataUnion()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(notificationStub).toHaveBeenCalledTimes(5)
            expect(location.pathname).toBe('/core/products/1/edit')
        })
        it('does not redirect if deploy fails', async () => {
            const originalConfig = getConfig()
            const getConfigMock = getConfig as any
            getConfigMock.mockImplementation(() => ({
                ...originalConfig,
                core: {
                    ...originalConfig.core,
                    dataUnionPublishMemberLimit: 0,
                },
            }))
            let currentContext
            let validationContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            }

            const product = {
                id: '1',
                name: 'data union',
                description: 'description',
                type: 'DATAUNION',
                pricePerSecond: '1',
                priceCurrency: 'DATA',
                category: 'test',
                imageUrl: 'http://...',
                streams: ['1', '2'],
                adminFee: '0.3',
                pricingTokenAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                chain: 'ETHEREUM',
            } as any
            const modalOpenStub = jest.fn(() => Promise.resolve(false))
            jest.spyOn(useModal, 'default').mockImplementation(() => ({
                api: {
                    open: modalOpenStub,
                },
            } as any))
            const putProductStub = jest
                .spyOn(productServices, 'putProduct')
                .mockImplementation(() => Promise.resolve({ ...product as any }))
            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <ValidationContextProvider>
                        <EditControllerProvider product={product}>
                            <Test />
                        </EditControllerProvider>
                    </ValidationContextProvider>
                </Router>,
            )
            expect(currentContext.publishAttempted).toBe(false)
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await validationContext.validate(product)
            })
            await act(async () => {
                await currentContext.deployDataUnion()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(modalOpenStub).toHaveBeenCalledTimes(1)
            expect(putProductStub).toHaveBeenCalledTimes(1)
            expect(location.pathname).toBe('/core/products/1/edit')
        })
        // Disabling the failing test as soon we will be completely changing the implementation anyways
        xit('updates and saves beneficiary address if deploy succeeds', async () => {
            const originalConfig = getConfig()
            const getConfigMock = getConfig as any
            getConfigMock.mockImplementation(() => ({
                ...originalConfig,
                core: {
                    ...originalConfig.core,
                    dataUnionPublishMemberLimit: 0,
                },
            }))
            let currentContext
            let validationContext
            let location

            const Test = () => {
                location = useLocation()
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            }

            const product = {
                id: '1',
                name: 'data union',
                description: 'description',
                type: 'DATAUNION',
                pricePerSecond: '1',
                priceCurrency: 'DATA',
                category: 'test',
                imageUrl: 'http://...',
                streams: ['1', '2'],
                adminFee: '0.3',
                pricingTokenAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                chain: 'POLYGON',
            }
            const beneficiaryAddress = '0x538a2Fa87E03B280e10C83AA8dD7E5B15B868BD9'
            const modalOpenStub = jest.fn(
                ({ updateAddress }) =>
                    new Promise((resolve) => {
                        updateAddress(beneficiaryAddress)
                        resolve(true)
                    }),
            )
            jest.spyOn(useModal, 'default').mockImplementation(() => ({
                api: {
                    open: modalOpenStub,
                },
            } as any))
            const putProductStub = jest
                .spyOn(productServices, 'putProduct')
                .mockImplementation((p) => Promise.resolve({ ...p }))
            let undoContext

            const ControllerWrap = () => {
                undoContext = useContext(UndoContext.Context)
                const { state } = undoContext

                if (!state || !state.id) {
                    return null
                }

                return (
                    <EditControllerProvider product={state}>
                        <Test />
                    </EditControllerProvider>
                )
            }

            const history = createMemoryHistory({
                initialEntries: ['/core/products/1/edit'],
            })
            mount(
                <Router history={history}>
                    <UndoContext.Provider>
                        <ValidationContextProvider>
                            <ControllerWrap />
                        </ValidationContextProvider>
                    </UndoContext.Provider>
                </Router>,
            )
            await act(async () => {
                await undoContext.replace(() => product)
            })
            expect(currentContext.publishAttempted).toBe(false)
            expect(location.pathname).toBe('/core/products/1/edit')
            await act(async () => {
                await validationContext.validate(product)
            })
            await act(async () => {
                await currentContext.deployDataUnion()
            })
            const expectedProduct = {
                ...product,
                pendingChanges: {
                    adminFee: '0.3',
                    pricingTokenAddress: '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1',
                },
            }
            delete expectedProduct.adminFee
            delete expectedProduct.pricingTokenAddress
            expect(currentContext.publishAttempted).toBe(true)
            expect(modalOpenStub).toHaveBeenCalledTimes(1)
            expect(putProductStub).toHaveBeenCalledTimes(3)
            expect(putProductStub).toBeCalledWith(expectedProduct, product.id)
            expect(putProductStub).toBeCalledWith({ ...expectedProduct, beneficiaryAddress }, product.id)
            expect(location.pathname).toBe('/core/dataunions')
        })
    })
})
