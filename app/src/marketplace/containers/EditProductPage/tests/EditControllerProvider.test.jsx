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
import * as editProductServices from '$mp/modules/deprecated/editProduct/services'
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
            const putProductStub = sandbox.stub(editProductServices, 'putProduct').callsFake(() => Promise.resolve({
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
            const putProductStub = sandbox.stub(editProductServices, 'putProduct').callsFake((p) => (
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
