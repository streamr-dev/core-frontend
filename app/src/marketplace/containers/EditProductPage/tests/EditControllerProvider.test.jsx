import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import sinon from 'sinon'
import { MemoryRouter, withRouter } from 'react-router-dom'

import Notification from '$shared/utils/Notification'

import { Provider as EditControllerProvider, Context as EditControllerContext } from '../EditControllerProvider'
import { Provider as ValidationContextProvider, Context as ValidationContext } from '../../ProductController/ValidationContextProvider'
import { Provider as RouterContextProvider } from '$shared/contexts/Router'
import * as UndoContext from '$shared/contexts/Undo'
import * as useModal from '$shared/hooks/useModal'
import * as usePending from '$shared/hooks/usePending'
import * as productServices from '$mp/modules/product/services'
import * as useEditableProductUpdater from '$mp/containers/ProductController/useEditableProductUpdater'

const mockState = {
    product: {
        id: '1',
    },
    dataUnion: {
        id: 'dataUnionId',
    },
    global: {
        dataPerUsd: 10,
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

describe('EditControllerProvider', () => {
    let sandbox
    let oldMemberLimit

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        oldMemberLimit = process.env.DATA_UNION_PUBLISH_MEMBER_LIMIT
    })

    afterEach(() => {
        sandbox.restore()
        process.env.DATA_UNION_PUBLISH_MEMBER_LIMIT = oldMemberLimit
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
            }

            const notificationStub = sandbox.stub(Notification, 'push')
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {},
            }))

            mount((
                <ValidationContextProvider>
                    <EditControllerProvider product={product}>
                        <Test />
                    </EditControllerProvider>
                </ValidationContextProvider>
            ))

            await act(async () => {
                await validationContext.validate(product)
            })

            let result
            await act(async () => {
                result = await currentContext.validate()
            })
            expect(result).toBe(false)
            expect(notificationStub.callCount).toBe(5)
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
                adminFee: '0.3',
            }

            const notificationStub = sandbox.stub(Notification, 'push')
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {},
            }))

            mount((
                <ValidationContextProvider>
                    <EditControllerProvider product={product}>
                        <Test />
                    </EditControllerProvider>
                </ValidationContextProvider>
            ))

            await act(async () => {
                await validationContext.validate(product)
            })

            process.env.DATA_UNION_PUBLISH_MEMBER_LIMIT = 10
            let result
            await act(async () => {
                result = await currentContext.validate()
            })
            expect(result).toBe(false)
            expect(notificationStub.callCount).toBe(1)
            expect(notificationStub.calledWith({
                title: 'notEnoughMembers',
                icon: 'error',
            })).toBe(true)
        })
    })

    describe('back', () => {
        it('redirects if no fields are touched', async () => {
            let currentContext
            let props
            const Test = withRouter((nextProps) => {
                props = nextProps
                currentContext = useContext(EditControllerContext)
                return null
            })

            const product = {
                id: '1',
                name: 'name',
            }

            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {},
            }))

            mount((
                <MemoryRouter initialEntries={['/core/products/1/edit']}>
                    <RouterContextProvider>
                        <ValidationContextProvider>
                            <EditControllerProvider product={product}>
                                <Test />
                            </EditControllerProvider>
                        </ValidationContextProvider>
                    </RouterContextProvider>
                </MemoryRouter>
            ))

            expect(props.location.pathname).toBe('/core/products/1/edit')

            await act(async () => {
                await currentContext.back()
            })

            expect(props.location.pathname).toBe('/core/products')
        })

        it('asks confirmation if fields are touched, does not redirect if canceled', async () => {
            let currentContext
            let validationContext
            let props
            const Test = withRouter((nextProps) => {
                props = nextProps
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            })

            const product = {
                id: '1',
                name: 'name',
            }

            const openStub = sandbox.stub().callsFake(() => Promise.resolve({
                save: false,
                redirect: false,
            }))
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {
                    open: openStub,
                },
            }))

            mount((
                <MemoryRouter initialEntries={['/core/products/1/edit']}>
                    <RouterContextProvider>
                        <ValidationContextProvider>
                            <EditControllerProvider product={product}>
                                <Test />
                            </EditControllerProvider>
                        </ValidationContextProvider>
                    </RouterContextProvider>
                </MemoryRouter>
            ))

            expect(props.location.pathname).toBe('/core/products/1/edit')

            await act(async () => {
                await validationContext.touch('name')
            })

            await act(async () => {
                await currentContext.back()
            })

            expect(props.location.pathname).toBe('/core/products/1/edit')
        })

        it('asks confirmation if fields are touched, redirects without saving if changes are discarded', async () => {
            let currentContext
            let validationContext
            let props
            const Test = withRouter((nextProps) => {
                props = nextProps
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            })

            const product = {
                id: '1',
                name: 'name',
            }

            const openStub = sandbox.stub().callsFake(() => Promise.resolve({
                save: false,
                redirect: true,
            }))
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {
                    open: openStub,
                },
            }))

            mount((
                <MemoryRouter initialEntries={['/core/products/1/edit']}>
                    <RouterContextProvider>
                        <ValidationContextProvider>
                            <EditControllerProvider product={product}>
                                <Test />
                            </EditControllerProvider>
                        </ValidationContextProvider>
                    </RouterContextProvider>
                </MemoryRouter>
            ))

            expect(props.location.pathname).toBe('/core/products/1/edit')

            await act(async () => {
                await validationContext.touch('name')
            })

            await act(async () => {
                await currentContext.back()
            })

            expect(props.location.pathname).toBe('/core/products')
        })

        it('asks confirmation if fields are touched, redirects after saving', async () => {
            let currentContext
            let validationContext
            let props
            const Test = withRouter((nextProps) => {
                props = nextProps
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            })

            const product = {
                id: '1',
                name: 'name',
            }

            const openStub = sandbox.stub().callsFake(() => Promise.resolve({
                save: true,
                redirect: true,
            }))
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {
                    open: openStub,
                },
            }))
            sandbox.stub(usePending, 'default').callsFake(() => ({
                wrap: async (fn) => {
                    const result = await fn()
                    return result
                },
            }))
            const putProductStub = sandbox.stub(productServices, 'putProduct').callsFake(() => Promise.resolve({
                ...product,
            }))

            mount((
                <MemoryRouter initialEntries={['/core/products/1/edit']}>
                    <RouterContextProvider>
                        <ValidationContextProvider>
                            <EditControllerProvider product={product}>
                                <Test />
                            </EditControllerProvider>
                        </ValidationContextProvider>
                    </RouterContextProvider>
                </MemoryRouter>
            ))

            expect(props.location.pathname).toBe('/core/products/1/edit')

            await act(async () => {
                await validationContext.touch('name')
            })

            await act(async () => {
                await currentContext.back()
            })

            expect(putProductStub.calledOnce).toBe(true)
            expect(props.location.pathname).toBe('/core/products')
        })
    })

    describe('save', () => {
        it('saves product info', async () => {
            let currentContext
            let props
            const Test = withRouter((nextProps) => {
                props = nextProps
                currentContext = useContext(EditControllerContext)
                return null
            })

            const product = {
                id: '1',
                name: 'name',
            }
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {},
            }))
            sandbox.stub(usePending, 'default').callsFake(() => ({
                wrap: async (fn) => {
                    const result = await fn()
                    return result
                },
            }))
            const putProductStub = sandbox.stub(productServices, 'putProduct').callsFake(() => Promise.resolve({
                ...product,
            }))

            mount((
                <MemoryRouter initialEntries={['/core/products/1/edit']}>
                    <RouterContextProvider>
                        <ValidationContextProvider>
                            <EditControllerProvider product={product}>
                                <Test />
                            </EditControllerProvider>
                        </ValidationContextProvider>
                    </RouterContextProvider>
                </MemoryRouter>
            ))

            expect(props.location.pathname).toBe('/core/products/1/edit')

            await act(async () => {
                await currentContext.save()
            })

            expect(putProductStub.calledOnce).toBe(true)
            expect(props.location.pathname).toBe('/core/products')
        })

        it('uploads new image before saving product info', async () => {
            let currentContext
            let props
            const Test = withRouter((nextProps) => {
                props = nextProps
                currentContext = useContext(EditControllerContext)
                return null
            })

            const product = {
                id: '1',
                name: 'name',
                newImageToUpload: new File([''], 'filename'),
            }
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {},
            }))
            sandbox.stub(usePending, 'default').callsFake(() => ({
                wrap: async (fn) => {
                    const result = await fn()
                    return result
                },
            }))
            const replaceProductStub = sandbox.stub()
            sandbox.stub(useEditableProductUpdater, 'default').callsFake(() => ({
                replaceProduct: (fn) => replaceProductStub(fn(product)),
            }))
            const postImageStub = sandbox.stub(productServices, 'postImage').callsFake(() => Promise.resolve({
                imageUrl: 'imageUrl',
                thumbnailUrl: 'thumbnailUrl',
            }))
            const putProductStub = sandbox.stub(productServices, 'putProduct').callsFake(() => Promise.resolve({
                ...product,
            }))

            mount((
                <MemoryRouter initialEntries={['/core/products/1/edit']}>
                    <RouterContextProvider>
                        <ValidationContextProvider>
                            <EditControllerProvider product={product}>
                                <Test />
                            </EditControllerProvider>
                        </ValidationContextProvider>
                    </RouterContextProvider>
                </MemoryRouter>
            ))

            expect(props.location.pathname).toBe('/core/products/1/edit')

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

            expect(postImageStub.calledOnce).toBe(true)
            expect(postImageStub.calledWith(product.id, product.newImageToUpload)).toBe(true)
            expect(replaceProductStub.calledOnce).toBe(true)
            expect(replaceProductStub.calledWith(expectedProduct)).toBe(true)
            expect(putProductStub.calledOnce).toBe(true)
            expect(props.location.pathname).toBe('/core/products')
        })

        it('does not redirect if options.redirect = false', async () => {
            let currentContext
            let props
            const Test = withRouter((nextProps) => {
                props = nextProps
                currentContext = useContext(EditControllerContext)
                return null
            })

            const product = {
                id: '1',
                name: 'name',
            }
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {},
            }))
            sandbox.stub(usePending, 'default').callsFake(() => ({
                wrap: async (fn) => {
                    const result = await fn()
                    return result
                },
            }))
            const putProductStub = sandbox.stub(productServices, 'putProduct').callsFake(() => Promise.resolve({
                ...product,
            }))

            mount((
                <MemoryRouter initialEntries={['/core/products/1/edit']}>
                    <RouterContextProvider>
                        <ValidationContextProvider>
                            <EditControllerProvider product={product}>
                                <Test />
                            </EditControllerProvider>
                        </ValidationContextProvider>
                    </RouterContextProvider>
                </MemoryRouter>
            ))

            expect(props.location.pathname).toBe('/core/products/1/edit')

            await act(async () => {
                await currentContext.save({
                    redirect: false,
                })
            })

            expect(putProductStub.calledOnce).toBe(true)
            expect(props.location.pathname).toBe('/core/products/1/edit')
        })
    })

    describe('publish', () => {
        it('sets publish attempted if validation fails', async () => {
            let currentContext
            let validationContext
            let props
            const Test = withRouter((nextProps) => {
                props = nextProps
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            })

            const product = {
                id: '1',
            }

            const notificationStub = sandbox.stub(Notification, 'push')
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {},
            }))

            mount((
                <MemoryRouter initialEntries={['/core/products/1/edit']}>
                    <RouterContextProvider>
                        <ValidationContextProvider>
                            <EditControllerProvider product={product}>
                                <Test />
                            </EditControllerProvider>
                        </ValidationContextProvider>
                    </RouterContextProvider>
                </MemoryRouter>
            ))

            expect(currentContext.publishAttempted).toBe(false)
            expect(props.location.pathname).toBe('/core/products/1/edit')

            await act(async () => {
                await validationContext.validate(product)
            })

            await act(async () => {
                await currentContext.publish()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(notificationStub.callCount).toBe(5)
            expect(props.location.pathname).toBe('/core/products/1/edit')
        })

        it('does not redirect if publish fails', async () => {
            let currentContext
            let validationContext
            let props
            const Test = withRouter((nextProps) => {
                props = nextProps
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            })

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
            }

            const modalOpenStub = sandbox.stub().callsFake(() => Promise.resolve({
                succeeded: false,
            }))
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {
                    open: modalOpenStub,
                },
            }))
            sandbox.stub(productServices, 'putProduct').callsFake(() => Promise.resolve({
                ...product,
            }))

            mount((
                <MemoryRouter initialEntries={['/core/products/1/edit']}>
                    <RouterContextProvider>
                        <ValidationContextProvider>
                            <EditControllerProvider product={product}>
                                <Test />
                            </EditControllerProvider>
                        </ValidationContextProvider>
                    </RouterContextProvider>
                </MemoryRouter>
            ))

            expect(currentContext.publishAttempted).toBe(false)
            expect(props.location.pathname).toBe('/core/products/1/edit')

            await act(async () => {
                await validationContext.validate(product)
            })

            await act(async () => {
                await currentContext.publish()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(modalOpenStub.calledOnce).toBe(true)
            expect(modalOpenStub.calledWith({
                product,
            })).toBe(true)
            expect(props.location.pathname).toBe('/core/products/1/edit')
        })

        it('updates publishing state if process is started before completing', async () => {
            let currentContext
            let validationContext
            let props
            const Test = withRouter((nextProps) => {
                props = nextProps
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            })

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
            }

            const modalOpenStub = sandbox.stub().callsFake(() => Promise.resolve({
                succeeded: false,
                started: true,
                isUnpublish: false,
            }))
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {
                    open: modalOpenStub,
                },
            }))
            sandbox.stub(productServices, 'putProduct').callsFake(() => Promise.resolve({
                ...product,
            }))
            const replaceProductStub = sandbox.stub()
            sandbox.stub(useEditableProductUpdater, 'default').callsFake(() => ({
                replaceProduct: (fn) => replaceProductStub(fn(product)),
            }))

            mount((
                <MemoryRouter initialEntries={['/core/products/1/edit']}>
                    <RouterContextProvider>
                        <ValidationContextProvider>
                            <EditControllerProvider product={product}>
                                <Test />
                            </EditControllerProvider>
                        </ValidationContextProvider>
                    </RouterContextProvider>
                </MemoryRouter>
            ))

            expect(currentContext.publishAttempted).toBe(false)
            expect(props.location.pathname).toBe('/core/products/1/edit')

            await act(async () => {
                await validationContext.validate(product)
            })

            await act(async () => {
                await currentContext.publish()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(modalOpenStub.calledOnce).toBe(true)
            expect(modalOpenStub.calledWith({
                product,
            })).toBe(true)
            expect(replaceProductStub.calledOnce).toBe(true)
            expect(replaceProductStub.calledWith({
                ...product,
                state: 'DEPLOYING',
            })).toBe(true)
            expect(props.location.pathname).toBe('/core/products/1/edit')
        })

        it('updates unpublishing state if process is started before completing', async () => {
            let currentContext
            let validationContext
            let props
            const Test = withRouter((nextProps) => {
                props = nextProps
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            })

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
            }

            const modalOpenStub = sandbox.stub().callsFake(() => Promise.resolve({
                succeeded: false,
                started: true,
                isUnpublish: true,
            }))
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {
                    open: modalOpenStub,
                },
            }))
            sandbox.stub(productServices, 'putProduct').callsFake(() => Promise.resolve({
                ...product,
            }))
            const replaceProductStub = sandbox.stub()
            sandbox.stub(useEditableProductUpdater, 'default').callsFake(() => ({
                replaceProduct: (fn) => replaceProductStub(fn(product)),
            }))

            mount((
                <MemoryRouter initialEntries={['/core/products/1/edit']}>
                    <RouterContextProvider>
                        <ValidationContextProvider>
                            <EditControllerProvider product={product}>
                                <Test />
                            </EditControllerProvider>
                        </ValidationContextProvider>
                    </RouterContextProvider>
                </MemoryRouter>
            ))

            expect(currentContext.publishAttempted).toBe(false)
            expect(props.location.pathname).toBe('/core/products/1/edit')

            await act(async () => {
                await validationContext.validate(product)
            })

            await act(async () => {
                await currentContext.publish()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(modalOpenStub.calledOnce).toBe(true)
            expect(modalOpenStub.calledWith({
                product,
            })).toBe(true)
            expect(replaceProductStub.calledOnce).toBe(true)
            expect(replaceProductStub.calledWith({
                ...product,
                state: 'UNDEPLOYING',
            })).toBe(true)
            expect(props.location.pathname).toBe('/core/products/1/edit')
        })

        it('redirects to product list if publish succeeded and dialog closed normally', async () => {
            let currentContext
            let validationContext
            let props
            const Test = withRouter((nextProps) => {
                props = nextProps
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            })

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
            }

            const modalOpenStub = sandbox.stub().callsFake(() => Promise.resolve({
                succeeded: true,
                started: true,
                isUnpublish: false,
            }))
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {
                    open: modalOpenStub,
                },
            }))
            sandbox.stub(productServices, 'putProduct').callsFake(() => Promise.resolve({
                ...product,
            }))
            const replaceProductStub = sandbox.stub()
            sandbox.stub(useEditableProductUpdater, 'default').callsFake(() => ({
                replaceProduct: (fn) => replaceProductStub(fn(product)),
            }))

            mount((
                <MemoryRouter initialEntries={['/core/products/1/edit']}>
                    <RouterContextProvider>
                        <ValidationContextProvider>
                            <EditControllerProvider product={product}>
                                <Test />
                            </EditControllerProvider>
                        </ValidationContextProvider>
                    </RouterContextProvider>
                </MemoryRouter>
            ))

            expect(currentContext.publishAttempted).toBe(false)
            expect(props.location.pathname).toBe('/core/products/1/edit')

            await act(async () => {
                await validationContext.validate(product)
            })

            await act(async () => {
                await currentContext.publish()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(modalOpenStub.calledOnce).toBe(true)
            expect(modalOpenStub.calledWith({
                product,
            })).toBe(true)
            expect(replaceProductStub.calledOnce).toBe(true)
            expect(replaceProductStub.calledWith({
                ...product,
                state: 'DEPLOYING',
            })).toBe(true)
            expect(props.location.pathname).toBe('/core/products')
        })

        it('redirects to product page if publish succeeded and view product clicked', async () => {
            let currentContext
            let validationContext
            let props
            const Test = withRouter((nextProps) => {
                props = nextProps
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            })

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
            }

            const modalOpenStub = sandbox.stub().callsFake(() => Promise.resolve({
                succeeded: true,
                started: true,
                isUnpublish: false,
                showPublishedProduct: true,
            }))
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {
                    open: modalOpenStub,
                },
            }))
            sandbox.stub(productServices, 'putProduct').callsFake(() => Promise.resolve({
                ...product,
            }))
            const replaceProductStub = sandbox.stub()
            sandbox.stub(useEditableProductUpdater, 'default').callsFake(() => ({
                replaceProduct: (fn) => replaceProductStub(fn(product)),
            }))

            mount((
                <MemoryRouter initialEntries={['/core/products/1/edit']}>
                    <RouterContextProvider>
                        <ValidationContextProvider>
                            <EditControllerProvider product={product}>
                                <Test />
                            </EditControllerProvider>
                        </ValidationContextProvider>
                    </RouterContextProvider>
                </MemoryRouter>
            ))

            expect(currentContext.publishAttempted).toBe(false)
            expect(props.location.pathname).toBe('/core/products/1/edit')

            await act(async () => {
                await validationContext.validate(product)
            })

            await act(async () => {
                await currentContext.publish()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(modalOpenStub.calledOnce).toBe(true)
            expect(modalOpenStub.calledWith({
                product,
            })).toBe(true)
            expect(replaceProductStub.calledOnce).toBe(true)
            expect(replaceProductStub.calledWith({
                ...product,
                state: 'DEPLOYING',
            })).toBe(true)
            expect(props.location.pathname).toBe('/marketplace/products/1')
        })

        it('redirects to product list if unpublish succeeded', async () => {
            let currentContext
            let validationContext
            let props
            const Test = withRouter((nextProps) => {
                props = nextProps
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            })

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
            }

            const modalOpenStub = sandbox.stub().callsFake(() => Promise.resolve({
                succeeded: true,
                started: true,
                isUnpublish: true,
            }))
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {
                    open: modalOpenStub,
                },
            }))
            sandbox.stub(productServices, 'putProduct').callsFake(() => Promise.resolve({
                ...product,
            }))
            const replaceProductStub = sandbox.stub()
            sandbox.stub(useEditableProductUpdater, 'default').callsFake(() => ({
                replaceProduct: (fn) => replaceProductStub(fn(product)),
            }))

            mount((
                <MemoryRouter initialEntries={['/core/products/1/edit']}>
                    <RouterContextProvider>
                        <ValidationContextProvider>
                            <EditControllerProvider product={product}>
                                <Test />
                            </EditControllerProvider>
                        </ValidationContextProvider>
                    </RouterContextProvider>
                </MemoryRouter>
            ))

            expect(currentContext.publishAttempted).toBe(false)
            expect(props.location.pathname).toBe('/core/products/1/edit')

            await act(async () => {
                await validationContext.validate(product)
            })

            await act(async () => {
                await currentContext.publish()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(modalOpenStub.calledOnce).toBe(true)
            expect(modalOpenStub.calledWith({
                product,
            })).toBe(true)
            expect(replaceProductStub.calledOnce).toBe(true)
            expect(replaceProductStub.calledWith({
                ...product,
                state: 'UNDEPLOYING',
            })).toBe(true)
            expect(props.location.pathname).toBe('/core/products')
        })
    })

    describe('deployDataUnion', () => {
        it('sets publish attempted if validation fails', async () => {
            let currentContext
            let validationContext
            let props
            const Test = withRouter((nextProps) => {
                props = nextProps
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            })

            const product = {
                id: '1',
            }

            const notificationStub = sandbox.stub(Notification, 'push')
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {},
            }))

            mount((
                <MemoryRouter initialEntries={['/core/products/1/edit']}>
                    <RouterContextProvider>
                        <ValidationContextProvider>
                            <EditControllerProvider product={product}>
                                <Test />
                            </EditControllerProvider>
                        </ValidationContextProvider>
                    </RouterContextProvider>
                </MemoryRouter>
            ))

            expect(currentContext.publishAttempted).toBe(false)
            expect(props.location.pathname).toBe('/core/products/1/edit')

            await act(async () => {
                await validationContext.validate(product)
            })

            await act(async () => {
                await currentContext.deployDataUnion()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(notificationStub.callCount).toBe(5)
            expect(props.location.pathname).toBe('/core/products/1/edit')
        })

        it('does not redirect if deploy fails', async () => {
            process.env.DATA_UNION_PUBLISH_MEMBER_LIMIT = 0

            let currentContext
            let validationContext
            let props
            const Test = withRouter((nextProps) => {
                props = nextProps
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            })

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
            }

            const modalOpenStub = sandbox.stub().callsFake(() => Promise.resolve(false))
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {
                    open: modalOpenStub,
                },
            }))
            const putProductStub = sandbox.stub(productServices, 'putProduct').callsFake(() => Promise.resolve({
                ...product,
            }))

            mount((
                <MemoryRouter initialEntries={['/core/products/1/edit']}>
                    <RouterContextProvider>
                        <ValidationContextProvider>
                            <EditControllerProvider product={product}>
                                <Test />
                            </EditControllerProvider>
                        </ValidationContextProvider>
                    </RouterContextProvider>
                </MemoryRouter>
            ))

            expect(currentContext.publishAttempted).toBe(false)
            expect(props.location.pathname).toBe('/core/products/1/edit')

            await act(async () => {
                await validationContext.validate(product)
            })

            await act(async () => {
                await currentContext.deployDataUnion()
            })
            expect(currentContext.publishAttempted).toBe(true)
            expect(modalOpenStub.calledOnce).toBe(true)
            expect(putProductStub.calledOnce).toBe(true)
            expect(props.location.pathname).toBe('/core/products/1/edit')
        })

        it('updates and saves beneficiary address if deploy succeeds', async () => {
            process.env.DATA_UNION_PUBLISH_MEMBER_LIMIT = 0

            let currentContext
            let validationContext
            let props
            const Test = withRouter((nextProps) => {
                props = nextProps
                currentContext = useContext(EditControllerContext)
                validationContext = useContext(ValidationContext)
                return null
            })

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
            }

            const beneficiaryAddress = '0x538a2Fa87E03B280e10C83AA8dD7E5B15B868BD9'
            const modalOpenStub = sandbox.stub().callsFake(({ updateAddress }) => new Promise((resolve) => {
                updateAddress(beneficiaryAddress)
                resolve(true)
            }))
            sandbox.stub(useModal, 'default').callsFake(() => ({
                api: {
                    open: modalOpenStub,
                },
            }))
            const putProductStub = sandbox.stub(productServices, 'putProduct').callsFake((p) => (
                Promise.resolve({
                    ...p,
                })
            ))

            let undoContext
            const ControllerWrap = () => {
                undoContext = useContext(UndoContext.Context)
                const { state } = undoContext

                if (!state || !state.id) { return null }

                return (
                    <EditControllerProvider product={state}>
                        <Test />
                    </EditControllerProvider>
                )
            }

            mount((
                <MemoryRouter initialEntries={['/core/products/1/edit']}>
                    <UndoContext.Provider>
                        <RouterContextProvider>
                            <ValidationContextProvider>
                                <ControllerWrap />
                            </ValidationContextProvider>
                        </RouterContextProvider>
                    </UndoContext.Provider>
                </MemoryRouter>
            ))

            await act(async () => {
                await undoContext.replace(() => product)
            })

            expect(currentContext.publishAttempted).toBe(false)
            expect(props.location.pathname).toBe('/core/products/1/edit')

            await act(async () => {
                await validationContext.validate(product)
            })
            await act(async () => {
                await currentContext.deployDataUnion()
            })

            const expectedProduct = {
                ...product,
            }
            delete expectedProduct.adminFee

            expect(currentContext.publishAttempted).toBe(true)
            expect(modalOpenStub.calledOnce).toBe(true)
            expect(putProductStub.calledTwice).toBe(true)
            expect(putProductStub.calledWith(expectedProduct, product.id)).toBe(true)
            expect(putProductStub.calledWith({
                ...expectedProduct,
                beneficiaryAddress,
            }, product.id)).toBe(true)
            expect(props.location.pathname).toBe('/core/products')
        })
    })
})
