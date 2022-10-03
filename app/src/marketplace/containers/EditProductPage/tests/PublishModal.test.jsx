import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
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

jest.mock('$shared/components/Dialog', () => ({
    __esModule: true,
    default: ({ children }) => children,
}))

describe('Publish modal', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('Error states', () => {
        it('shows an error if product fetching fails', async () => {
            jest.spyOn(useWeb3Status, 'default').mockImplementation(() => ({
                web3Error: undefined,
                checkingWeb3: false,
                account: null,
            }))

            const error = new Error('product fetch failed')
            jest.spyOn(productServices, 'getProductById').mockImplementation(() => {
                throw error
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                            chain: 'ETHEREUM',
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
            jest.spyOn(useWeb3Status, 'default').mockImplementation(() => ({
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
                chain: 'ETHEREUM',
            }

            let productResolver
            jest.spyOn(productServices, 'getProductById').mockImplementation(() => new Promise((resolve) => {
                productResolver = resolve
            }))
            jest.spyOn(contractProductServices, 'getProductFromContract').mockImplementation(() => {
                throw new Error('no contract product')
            })
            jest.spyOn(dataUnionServices, 'getAdminFee').mockImplementation(() => {
                throw new Error('no admin fee')
            })
            jest.spyOn(dataUnionServices, 'getDataUnionOwner').mockImplementation(() => {
                throw new Error('no owner')
            })

            let el
            act(() => {
                el = mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                            chain: 'ETHEREUM',
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
            jest.spyOn(useWeb3Status, 'default').mockImplementation(() => ({
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
                chain: 'ETHEREUM',
            }

            jest.spyOn(productServices, 'getProductById').mockImplementation(() => Promise.resolve(product))
            jest.spyOn(contractProductServices, 'getProductFromContract').mockImplementation(() => {
                throw new Error('no contract product')
            })
            jest.spyOn(dataUnionServices, 'getAdminFee').mockImplementation(() => {
                throw new Error('no admin fee')
            })
            jest.spyOn(dataUnionServices, 'getDataUnionOwner').mockImplementation(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                            chain: 'ETHEREUM',
                        }}
                        api={{}}
                    />
                ))
            })

            el.update()
            expect(el.find('ReadyToPublishDialog').exists()).toBe(true)
            expect(el.find('ReadyToPublishDialog').prop('disabled')).toBeTruthy()
        })

        it('shows an error screen if web3 is required and wallet is locked', async () => {
            const error = new Error('walletLocked')
            jest.spyOn(useWeb3Status, 'default').mockImplementation(() => ({
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
                chain: 'ETHEREUM',
            }

            jest.spyOn(productServices, 'getProductById').mockImplementation(() => Promise.resolve(product))
            jest.spyOn(contractProductServices, 'getProductFromContract').mockImplementation(() => {
                throw new Error('no contract product')
            })
            jest.spyOn(dataUnionServices, 'getAdminFee').mockImplementation(() => {
                throw new Error('no admin fee')
            })
            jest.spyOn(dataUnionServices, 'getDataUnionOwner').mockImplementation(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                            chain: 'ETHEREUM',
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
            jest.spyOn(useWeb3Status, 'default').mockImplementation(() => ({
                web3Error: undefined,
                checkingWeb3: false,
                account: null,
            }))
            const product = {
                id: '1',
                state: 'NOT_DEPLOYED',
                chain: 'ETHEREUM',
            }

            let resolveProduct
            jest.spyOn(productServices, 'getProductById').mockImplementation(() => new Promise((resolve) => {
                resolveProduct = resolve
            }))
            jest.spyOn(contractProductServices, 'getProductFromContract').mockImplementation(() => {
                throw new Error('no contract product')
            })
            jest.spyOn(dataUnionServices, 'getAdminFee').mockImplementation(() => {
                throw new Error('no admin fee')
            })
            jest.spyOn(dataUnionServices, 'getDataUnionOwner').mockImplementation(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                            chain: 'ETHEREUM',
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
            jest.spyOn(useWeb3Status, 'default').mockImplementation(() => ({
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
                chain: 'ETHEREUM',
            }

            jest.spyOn(productServices, 'getProductById').mockImplementation(() => Promise.resolve(product))
            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }
            jest.spyOn(contractProductServices, 'getProductFromContract').mockImplementation(() => Promise.resolve(contractProduct))
            jest.spyOn(dataUnionServices, 'getAdminFee').mockImplementation(() => {
                throw new Error('no admin fee')
            })
            jest.spyOn(dataUnionServices, 'getDataUnionOwner').mockImplementation(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                            chain: 'ETHEREUM',
                        }}
                        api={{}}
                    />
                ))
            })

            el.update()
            expect(el.find('ReadyToPublishDialog').exists()).toBe(true)
        })

        it('asks to unlock the wallet if a specific owner is required (no account available)', async () => {
            jest.spyOn(useWeb3Status, 'default').mockImplementation(() => ({
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
                chain: 'ETHEREUM',
            }

            jest.spyOn(productServices, 'getProductById').mockImplementation(() => Promise.resolve(product))
            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }
            jest.spyOn(contractProductServices, 'getProductFromContract').mockImplementation(() => Promise.resolve(contractProduct))
            jest.spyOn(dataUnionServices, 'getAdminFee').mockImplementation(() => {
                throw new Error('no admin fee')
            })
            jest.spyOn(dataUnionServices, 'getDataUnionOwner').mockImplementation(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                            chain: 'ETHEREUM',
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
            jest.spyOn(useWeb3Status, 'default').mockImplementation(() => ({
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
                chain: 'ETHEREUM',
            }

            jest.spyOn(productServices, 'getProductById').mockImplementation(() => Promise.resolve(product))
            const contractProduct = {
                id: '1',
                pricePerSecond: BN(1),
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                beneficiaryAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: '0',
            }
            jest.spyOn(contractProductServices, 'getProductFromContract').mockImplementation(() => Promise.resolve(contractProduct))
            jest.spyOn(dataUnionServices, 'getAdminFee').mockImplementation(() => {
                throw new Error('no admin fee')
            })
            jest.spyOn(dataUnionServices, 'getDataUnionOwner').mockImplementation(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                            chain: 'ETHEREUM',
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
            jest.spyOn(useWeb3Status, 'default').mockImplementation(() => ({
                web3Error: undefined,
                checkingWeb3: false,
                account: null,
            }))
            const product = {
                id: '1',
                state: 'DEPLOYED',
                chain: 'ETHEREUM',
            }

            let resolveProduct
            jest.spyOn(productServices, 'getProductById').mockImplementation(() => new Promise((resolve) => {
                resolveProduct = resolve
            }))
            jest.spyOn(contractProductServices, 'getProductFromContract').mockImplementation(() => {
                throw new Error('no contract product')
            })
            jest.spyOn(dataUnionServices, 'getAdminFee').mockImplementation(() => {
                throw new Error('no admin fee')
            })
            jest.spyOn(dataUnionServices, 'getDataUnionOwner').mockImplementation(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                            chain: 'ETHEREUM',
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
            jest.spyOn(useWeb3Status, 'default').mockImplementation(() => ({
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
                chain: 'ETHEREUM',
            }

            jest.spyOn(productServices, 'getProductById').mockImplementation(() => Promise.resolve(product))
            const contractProduct = {
                id: '1',
                state: 'DEPLOYED',
                isFree: false,
                pricePerSecond: BN(2),
                beneficiaryAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                priceCurrency: 'EUR',
            }
            jest.spyOn(contractProductServices, 'getProductFromContract').mockImplementation(() => Promise.resolve(contractProduct))
            jest.spyOn(dataUnionServices, 'getAdminFee').mockImplementation(() => {
                throw new Error('no admin fee')
            })
            jest.spyOn(dataUnionServices, 'getDataUnionOwner').mockImplementation(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                            chain: 'ETHEREUM',
                        }}
                        api={{}}
                    />
                ))
            })

            el.update()
            expect(el.find('ReadyToUnpublishDialog').exists()).toBe(true)
        })

        it('asks to unlock the wallet if a specific owner is required (no account selected)', async () => {
            jest.spyOn(useWeb3Status, 'default').mockImplementation(() => ({
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
                chain: 'ETHEREUM',
            }

            jest.spyOn(productServices, 'getProductById').mockImplementation(() => Promise.resolve(product))
            const contractProduct = {
                id: '1',
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
            }
            jest.spyOn(contractProductServices, 'getProductFromContract').mockImplementation(() => Promise.resolve(contractProduct))
            jest.spyOn(dataUnionServices, 'getAdminFee').mockImplementation(() => {
                throw new Error('no admin fee')
            })
            jest.spyOn(dataUnionServices, 'getDataUnionOwner').mockImplementation(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                            chain: 'ETHEREUM',
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
            jest.spyOn(useWeb3Status, 'default').mockImplementation(() => ({
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
                chain: 'ETHEREUM',
            }

            jest.spyOn(productServices, 'getProductById').mockImplementation(() => Promise.resolve(product))
            const contractProduct = {
                id: '1',
                ownerAddress: '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0',
            }
            jest.spyOn(contractProductServices, 'getProductFromContract').mockImplementation(() => Promise.resolve(contractProduct))
            jest.spyOn(dataUnionServices, 'getAdminFee').mockImplementation(() => {
                throw new Error('no admin fee')
            })
            jest.spyOn(dataUnionServices, 'getDataUnionOwner').mockImplementation(() => {
                throw new Error('no owner')
            })

            let el
            await act(async () => {
                el = await mount((
                    <PublishOrUnpublishModal
                        product={{
                            id: '1',
                            chain: 'ETHEREUM',
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
