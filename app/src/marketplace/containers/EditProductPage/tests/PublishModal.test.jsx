import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import sinon from 'sinon'
import BN from 'bignumber.js'

import * as productServices from '$mp/modules/product/services'
import * as useWeb3Status from '$shared/hooks/useWeb3Status'
import * as contractProductServices from '$mp/modules/contractProduct/services'
import * as dataUnionServices from '$mp/modules/dataUnion/services'

import { PublishOrUnpublishModal } from '../PublishModal'

jest.mock('react-redux', () => ({
    useDispatch: jest.fn().mockImplementation(() => (action) => action),
}))
jest.mock('$shared/components/ModalPortal', () => ({
    __esModule: true,
    default: ({ children }) => children || null,
}))

// eslint-disable-next-line react/prop-types
function MockDialog({ children }) {
    return <div>{children}</div>
}

jest.mock('$shared/components/Dialog', () => ({
    __esModule: true,
    default: (props) => <MockDialog {...props} />,
}))

describe('Publish modal', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('Error states', () => {
        it('shows an error if product fetching fails', async () => {
            sandbox.stub(useWeb3Status, 'default').callsFake(() => ({
                web3Error: undefined,
                checkingWeb3: false,
                account: null,
            }))

            const error = new Error('product fetch failed')
            sandbox.stub(productServices, 'getProductById').callsFake(() => {
                throw error
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                        }}
                        api={{}}
                    />
                ))
            })

            el.update()
            expect(el.find('ErrorDialog').exists()).toBe(true)
            expect(el.find('ErrorDialog').contains(error.message)).toBe(true)
        })

        it('renders null if product is being loaded', async () => {
            sandbox.stub(useWeb3Status, 'default').callsFake(() => ({
                web3Error: undefined,
                checkingWeb3: false,
                account: null,
            }))
            const product = {
                id: '1',
                state: 'NOT_DEPLOYED',
                isFree: false,
                pricePerSecond: BN(1),
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
            }

            let productResolver
            sandbox.stub(productServices, 'getProductById').callsFake(() => new Promise((resolve) => {
                productResolver = resolve
            }))
            sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => {
                throw new Error('no contract product')
            })
            sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => {
                throw new Error('no admin fee')
            })
            sandbox.stub(dataUnionServices, 'getDataUnionOwner').callsFake(() => {
                throw new Error('no owner')
            })

            let el
            act(() => {
                el = mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                        }}
                        api={{}}
                    />
                ))
            })

            el.update()
            expect(el.html()).toBeFalsy()

            await act(async () => {
                await productResolver(product)
            })

            el.update()
            expect(el.find('ReadyToPublishDialog').exists()).toBe(true)
        })

        it('shows a loading screen if web3 is required and wallet is being checked', async () => {
            sandbox.stub(useWeb3Status, 'default').callsFake(() => ({
                web3Error: undefined,
                checkingWeb3: true,
                account: null,
            }))
            const product = {
                id: '1',
                state: 'NOT_DEPLOYED',
                isFree: false,
                pricePerSecond: BN(1),
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
            }

            sandbox.stub(productServices, 'getProductById').callsFake(() => Promise.resolve(product))
            sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => {
                throw new Error('no contract product')
            })
            sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => {
                throw new Error('no admin fee')
            })
            sandbox.stub(dataUnionServices, 'getDataUnionOwner').callsFake(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                        }}
                        api={{}}
                    />
                ))
            })

            el.update()
            expect(el.find('ReadyToPublishDialog').exists()).toBe(true)
            expect(el.find('ReadyToPublishDialog').prop('waiting')).toBeTruthy()
        })

        it('shows an error screen if web3 is required and wallet is locked', async () => {
            const error = new Error('walletLocked')
            sandbox.stub(useWeb3Status, 'default').callsFake(() => ({
                web3Error: error,
                checkingWeb3: false,
                account: null,
            }))
            const product = {
                id: '1',
                state: 'NOT_DEPLOYED',
                isFree: false,
                pricePerSecond: BN(1),
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
            }

            sandbox.stub(productServices, 'getProductById').callsFake(() => Promise.resolve(product))
            sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => {
                throw new Error('no contract product')
            })
            sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => {
                throw new Error('no admin fee')
            })
            sandbox.stub(dataUnionServices, 'getDataUnionOwner').callsFake(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                        }}
                        api={{}}
                    />
                ))
            })

            el.update()
            expect(el.find('Web3ErrorDialog').exists()).toBe(true)
            expect(el.find('Web3ErrorDialog').prop('waiting')).toBeFalsy()
            expect(el.find('Web3ErrorDialog').contains(error.message)).toBe(true)
        })
    })

    describe('Publish', () => {
        it('shows the confirm screen', async () => {
            sandbox.stub(useWeb3Status, 'default').callsFake(() => ({
                web3Error: undefined,
                checkingWeb3: false,
                account: null,
            }))
            const product = {
                id: '1',
                state: 'NOT_DEPLOYED',
            }

            let resolveProduct
            sandbox.stub(productServices, 'getProductById').callsFake(() => new Promise((resolve) => {
                resolveProduct = resolve
            }))
            sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => {
                throw new Error('no contract product')
            })
            sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => {
                throw new Error('no admin fee')
            })
            sandbox.stub(dataUnionServices, 'getDataUnionOwner').callsFake(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                        }}
                        api={{}}
                    />
                ))
            })

            expect(el.html()).toBeFalsy()

            await act(async () => {
                await resolveProduct(product)
            })

            el.update()

            expect(el.find('ReadyToPublishDialog').exists()).toBe(true)
        })

        it('shows the confirm screen if a specific owner is required and correct account is selected', async () => {
            sandbox.stub(useWeb3Status, 'default').callsFake(() => ({
                web3Error: undefined,
                checkingWeb3: false,
                account: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
            }))

            const product = {
                id: '1',
                state: 'NOT_DEPLOYED',
                isFree: false,
                pricePerSecond: BN(2),
                beneficiaryAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                priceCurrency: 'EUR',
            }

            sandbox.stub(productServices, 'getProductById').callsFake(() => Promise.resolve(product))
            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }
            sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve(contractProduct))
            sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => {
                throw new Error('no admin fee')
            })
            sandbox.stub(dataUnionServices, 'getDataUnionOwner').callsFake(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                        }}
                        api={{}}
                    />
                ))
            })

            el.update()
            expect(el.find('ReadyToPublishDialog').exists()).toBe(true)
        })

        it('asks to unlock the wallet if a specific owner is required (no account available)', async () => {
            sandbox.stub(useWeb3Status, 'default').callsFake(() => ({
                web3Error: undefined,
                checkingWeb3: false,
                account: null,
            }))

            const product = {
                id: '1',
                state: 'NOT_DEPLOYED',
                isFree: false,
                pricePerSecond: BN(2),
                beneficiaryAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                priceCurrency: 'EUR',
            }

            sandbox.stub(productServices, 'getProductById').callsFake(() => Promise.resolve(product))
            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }
            sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve(contractProduct))
            sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => {
                throw new Error('no admin fee')
            })
            sandbox.stub(dataUnionServices, 'getDataUnionOwner').callsFake(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                        }}
                        api={{}}
                    />
                ))
            })

            el.update()
            expect(el.find('UnlockWalletDialog').exists()).toBe(true)
            expect(el.find('UnlockWalletDialog').prop('requiredAddress')).toBe(contractProduct.ownerAddress)
        })

        it('asks to unlock the wallet if a specific owner is required (wrong account selected)', async () => {
            sandbox.stub(useWeb3Status, 'default').callsFake(() => ({
                web3Error: undefined,
                checkingWeb3: false,
                account: '0x13581255eE2D20e780B0cD3D07fac018241B5E03',
            }))

            const product = {
                id: '1',
                state: 'NOT_DEPLOYED',
                isFree: false,
                pricePerSecond: BN(2),
                beneficiaryAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                priceCurrency: 'EUR',
            }

            sandbox.stub(productServices, 'getProductById').callsFake(() => Promise.resolve(product))
            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }
            sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve(contractProduct))
            sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => {
                throw new Error('no admin fee')
            })
            sandbox.stub(dataUnionServices, 'getDataUnionOwner').callsFake(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                        }}
                        api={{}}
                    />
                ))
            })

            el.update()
            expect(el.find('UnlockWalletDialog').exists()).toBe(true)
            expect(el.find('UnlockWalletDialog').prop('requiredAddress')).toBe(contractProduct.ownerAddress)
        })
    })

    describe('Unpublish', () => {
        it('shows the confirm screen', async () => {
            sandbox.stub(useWeb3Status, 'default').callsFake(() => ({
                web3Error: undefined,
                checkingWeb3: false,
                account: null,
            }))
            const product = {
                id: '1',
                state: 'DEPLOYED',
            }

            let resolveProduct
            sandbox.stub(productServices, 'getProductById').callsFake(() => new Promise((resolve) => {
                resolveProduct = resolve
            }))
            sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => {
                throw new Error('no contract product')
            })
            sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => {
                throw new Error('no admin fee')
            })
            sandbox.stub(dataUnionServices, 'getDataUnionOwner').callsFake(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                        }}
                        api={{}}
                    />
                ))
            })

            expect(el.html()).toBeFalsy()

            await act(async () => {
                await resolveProduct(product)
            })

            el.update()

            expect(el.find('ReadyToUnpublishDialog').exists()).toBe(true)
        })

        it('shows the confirm screen if owner is required and correct account is selected', async () => {
            sandbox.stub(useWeb3Status, 'default').callsFake(() => ({
                web3Error: undefined,
                checkingWeb3: false,
                account: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
            }))

            const product = {
                id: '1',
                state: 'DEPLOYED',
                isFree: false,
                pricePerSecond: BN(2),
                beneficiaryAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                priceCurrency: 'EUR',
            }

            sandbox.stub(productServices, 'getProductById').callsFake(() => Promise.resolve(product))
            const contractProduct = {
                id: '1',
                state: 'DEPLOYED',
                isFree: false,
                pricePerSecond: BN(2),
                beneficiaryAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                priceCurrency: 'EUR',
            }
            sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve(contractProduct))
            sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => {
                throw new Error('no admin fee')
            })
            sandbox.stub(dataUnionServices, 'getDataUnionOwner').callsFake(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                        }}
                        api={{}}
                    />
                ))
            })

            el.update()
            expect(el.find('ReadyToUnpublishDialog').exists()).toBe(true)
        })

        it('asks to unlock the wallet if a specific owner is required (no account selected)', async () => {
            sandbox.stub(useWeb3Status, 'default').callsFake(() => ({
                web3Error: undefined,
                checkingWeb3: false,
                account: undefined,
            }))

            const product = {
                id: '1',
                state: 'DEPLOYED',
                isFree: false,
                pricePerSecond: BN(2),
                beneficiaryAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                priceCurrency: 'EUR',
            }

            sandbox.stub(productServices, 'getProductById').callsFake(() => Promise.resolve(product))
            const contractProduct = {
                id: '1',
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
            }
            sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve(contractProduct))
            sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => {
                throw new Error('no admin fee')
            })
            sandbox.stub(dataUnionServices, 'getDataUnionOwner').callsFake(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                        }}
                        api={{}}
                    />
                ))
            })

            el.update()
            expect(el.find('UnlockWalletDialog').exists()).toBe(true)
            expect(el.find('UnlockWalletDialog').prop('requiredAddress')).toBe(contractProduct.ownerAddress)
        })

        it('asks to unlock the wallet if a specific owner is required (wrong account selected)', async () => {
            sandbox.stub(useWeb3Status, 'default').callsFake(() => ({
                web3Error: undefined,
                checkingWeb3: false,
                account: '0x13581255eE2D20e780B0cD3D07fac018241B5E03',
            }))

            const product = {
                id: '1',
                state: 'DEPLOYED',
                isFree: false,
                pricePerSecond: BN(2),
                beneficiaryAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                priceCurrency: 'EUR',
            }

            sandbox.stub(productServices, 'getProductById').callsFake(() => Promise.resolve(product))
            const contractProduct = {
                id: '1',
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
            }
            sandbox.stub(contractProductServices, 'getProductFromContract').callsFake(() => Promise.resolve(contractProduct))
            sandbox.stub(dataUnionServices, 'getAdminFee').callsFake(() => {
                throw new Error('no admin fee')
            })
            sandbox.stub(dataUnionServices, 'getDataUnionOwner').callsFake(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                        }}
                        api={{}}
                    />
                ))
            })

            el.update()
            expect(el.find('UnlockWalletDialog').exists()).toBe(true)
            expect(el.find('UnlockWalletDialog').prop('requiredAddress')).toBe(contractProduct.ownerAddress)
        })
    })
})
