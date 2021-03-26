import moxios from 'moxios'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import BN from 'bignumber.js'

import * as all from '$mp/modules/product/services'
import * as utils from '$mp/utils/smartContract'
import * as getWeb3 from '$shared/web3/web3Provider'
import * as productUtils from '$mp/utils/product'
import { existingProduct } from './mockData'

const mockFile = new File(['test'], 'test.jpg', {
    type: 'image/jpeg',
})

const ONE_DAY = '86400'

describe('product - services', () => {
    let oldStreamrApiUrl
    let oldDaiTokenAddress

    beforeEach(() => {
        moxios.install()
        oldStreamrApiUrl = process.env.STREAMR_API_URL
        process.env.STREAMR_API_URL = ''
        oldDaiTokenAddress = process.env.DAI_TOKEN_CONTRACT_ADDRESS
        process.env.DAI_TOKEN_CONTRACT_ADDRESS = 'daiTokenAddress'
    })

    afterEach(() => {
        moxios.uninstall()
        jest.clearAllMocks()
        jest.restoreAllMocks()
        process.env.STREAMR_API_URL = oldStreamrApiUrl
        process.env.DAI_TOKEN_CONTRACT_ADDRESS = oldDaiTokenAddress
    })

    describe('getProductById', () => {
        it('gets product by id', async () => {
            process.env.STREAMR_API_URL = 'TEST_STREAMR_API_URL'
            const data = {
                id: '123',
                name: 'Product 123',
                pricePerSecond: '0',
            }

            const getIdSpy = jest.spyOn(productUtils, 'getValidId')
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                expect(request.config.method).toBe('get')
                expect(request.config.url).toBe(`${process.env.STREAMR_API_URL}/products/123`)
            })

            const result = await all.getProductById('123')
            expect(result).toStrictEqual(data)
            expect(getIdSpy).toHaveBeenCalledTimes(1)
            expect(getIdSpy).toBeCalledWith('123', false)
        })
    })

    describe('getStreamsByProductId', () => {
        it('gets streams by product id', async () => {
            process.env.STREAMR_API_URL = 'TEST_STREAMR_API_URL'
            const data = [
                {
                    id: '123',
                    name: 'Stream 123',
                },
                {
                    id: '111',
                    name: 'Stream 111',
                },
            ]

            const getIdSpy = jest.spyOn(productUtils, 'getValidId')
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                expect(request.config.method).toBe('get')
                expect(request.config.url).toBe(`${process.env.STREAMR_API_URL}/products/123/streams`)
            })

            const result = await all.getStreamsByProductId('123')
            expect(result).toStrictEqual(data)
            expect(getIdSpy).toHaveBeenCalledTimes(1)
            expect(getIdSpy).toBeCalledWith('123', false)
        })
    })

    describe('getMyProductSubscription', () => {
        it('works as intended', async () => {
            const accountStub = jest.fn(() => Promise.resolve('testAccount'))
            jest.spyOn(getWeb3, 'default').mockImplementation(() => ({
                getDefaultAccount: accountStub,
            }))
            const getProductStub = jest.fn(() => ({
                call: () => Promise.resolve({
                    status: '0x1',
                    pricePerSecond: '0',
                }),
            }))
            const getSubscriptionStub = jest.fn(() => ({
                call: () => Promise.resolve({
                    endTimestamp: '0',
                }),
            }))
            const getContractStub = jest.fn(() => ({
                methods: {
                    getProduct: getProductStub,
                    getSubscription: getSubscriptionStub,
                },
            }))
            jest.spyOn(utils, 'getContract').mockImplementation(getContractStub)
            const result = await all.getMyProductSubscription('1234abcdef')
            expect(result).toStrictEqual({
                productId: '1234abcdef',
                endTimestamp: 0,
            })
            expect(getProductStub).toHaveBeenCalledTimes(1)
            expect(getSubscriptionStub).toHaveBeenCalledTimes(1)
            expect(getContractStub).toHaveBeenCalledTimes(2)
            expect(getProductStub).toBeCalledWith('0x1234abcdef')
            expect(getSubscriptionStub).toBeCalledWith('0x1234abcdef', 'testAccount')
        })

        it('throws an error if no product was found', async (done) => {
            const accountStub = jest.fn(() => Promise.resolve('testAccount'))
            jest.spyOn(getWeb3, 'default').mockImplementation(() => ({
                getDefaultAccount: accountStub,
            }))
            const getProductStub = jest.fn(() => ({
                call: () => Promise.resolve({
                    owner: '0x000',
                }),
            }))
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    getProduct: getProductStub,
                },
            }))
            try {
                await all.getMyProductSubscription('1234abcdef')
            } catch (e) {
                expect(e.message).toMatch(/No product found/)
                done()
            }
        })
    })

    it('puts product', async () => {
        process.env.STREAMR_API_URL = 'TEST_API_URL'
        const data = cloneDeep(existingProduct)
        const expectedResult = cloneDeep(existingProduct)
        expectedResult.pricePerSecond = '1.898e-14'

        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data,
            })

            expect(request.config.method).toBe('put')
            expect(request.config.url).toBe(`${process.env.STREAMR_API_URL}/products/${data.id}`)
        })
        const result = await all.putProduct(data, data.id)
        expect(result).toStrictEqual(expectedResult)
    })

    it('posts product', async () => {
        process.env.STREAMR_API_URL = 'TEST_API_URL'
        const data = cloneDeep(existingProduct)
        const expectedResult = cloneDeep(existingProduct)
        expectedResult.pricePerSecond = '1.898e-14'

        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data,
            })

            expect(request.config.method).toBe('post')
            expect(request.config.url).toBe(`${process.env.STREAMR_API_URL}/products`)
        })
        const result = await all.postProduct(data)
        expect(result).toStrictEqual(expectedResult)
    })

    it('posts image', async () => {
        process.env.STREAMR_API_URL = 'TEST_API_URL'
        const data = cloneDeep(existingProduct)
        const expectedResult = cloneDeep(existingProduct)
        expectedResult.pricePerSecond = '1.898e-14'

        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data,
            })

            expect(request.config.method).toBe('post')
            expect(request.config.url).toBe(`${process.env.STREAMR_API_URL}/products/${data.id}/images`)
        })
        const result = await all.postImage(data.id, mockFile)
        expect(result).toStrictEqual(expectedResult)
    })

    describe('postUndeployFree', () => {
        it('makes a POST request to unpublish a free product', async () => {
            const productId = '1'
            const data = {
                id: '1',
                name: 'test product',
                pricePerSecond: '0',
            }

            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                expect(request.config.method).toBe('post')
                expect(request.config.url).toBe(`${process.env.STREAMR_API_URL}/products/${productId}/undeployFree`)
            })

            const result = await all.postUndeployFree(productId)
            expect(result).toStrictEqual(data)
        })
    })

    describe('postSetUndeploying', () => {
        it('makes a POST request to set product is being unpublished', async () => {
            const productId = '1'
            const txHash = '0x1234'
            const data = {
                id: '1',
                name: 'test product',
                pricePerSecond: '0',
            }

            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                expect(request.config.method).toBe('post')
                expect(request.config.url).toBe(`${process.env.STREAMR_API_URL}/products/${productId}/setUndeploying`)
                expect(request.config.data).toBe(JSON.stringify({
                    transactionHash: txHash,
                }))
            })

            const result = await all.postSetUndeploying(productId, txHash)
            expect(result).toStrictEqual(data)
        })
    })

    describe('postDeployFree', () => {
        it('makes a POST request to publish a free product', async () => {
            const productId = '1'
            const data = {
                id: '1',
                name: 'test product',
                pricePerSecond: '0',
            }

            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                expect(request.config.method).toBe('post')
                expect(request.config.url).toBe(`${process.env.STREAMR_API_URL}/products/${productId}/deployFree`)
            })

            const result = await all.postDeployFree(productId)
            expect(result).toStrictEqual(data)
        })
    })

    describe('postSetDeploying', () => {
        it('makes a POST request to set product is being published', async () => {
            const productId = '1'
            const txHash = '0x1234'
            const data = {
                id: '1',
                name: 'test product',
                pricePerSecond: '0',
            }

            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                expect(request.config.method).toBe('post')
                expect(request.config.url).toBe(`${process.env.STREAMR_API_URL}/products/${productId}/setDeploying`)
                expect(request.config.data).toBe(JSON.stringify({
                    transactionHash: txHash,
                }))
            })

            const result = await all.postSetDeploying(productId, txHash)
            expect(result).toStrictEqual(data)
        })
    })

    describe('addFreeProduct', () => {
        it('makes a POST request to subscribe to a free product', async () => {
            const productId = '1'
            const endsAt = moment().add(1, 'year').unix()

            const getIdSpy = jest.spyOn(productUtils, 'getValidId')
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: null,
                })
                expect(request.config.method).toBe('post')
                expect(request.config.url).toBe('/subscriptions')
                expect(request.config.data).toBe(JSON.stringify({
                    product: productId,
                    endsAt,
                }))
            })

            const result = await all.addFreeProduct(productId, endsAt)
            expect(result).toBe(null)
            expect(getIdSpy).toHaveBeenCalledTimes(1)
            expect(getIdSpy).toBeCalledWith(productId, false)
        })
    })

    describe('buyProduct', () => {
        it('must call marketplaceContractMethods.buy when bying with DATA', () => {
            const buyStub = jest.fn(() => ({
                send: () => 'test',
            }))

            const getIdSpy = jest.spyOn(productUtils, 'getValidId')
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    buy: buyStub,
                },
            }))
            all.buyProduct('1234', '1000', 'DATA', '4321')
            expect(buyStub).toHaveBeenCalledTimes(1)
            expect(buyStub).toBeCalledWith('0x1234', '1000')
            expect(getIdSpy).toHaveBeenCalledTimes(1)
            expect(getIdSpy).toBeCalledWith('1234')
        })
        it('must call marketplaceContractMethods.buy when bying with ETH', () => {
            const buyStub = jest.fn(() => ({
                send: () => 'test',
            }))

            const getIdSpy = jest.spyOn(productUtils, 'getValidId')
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    buyWithETH: buyStub,
                },
            }))
            all.buyProduct('1234', '1000', 'ETH', '4321')
            expect(buyStub).toHaveBeenCalledTimes(1)
            expect(buyStub).toBeCalledWith('0x1234', '1000', ONE_DAY)
            expect(getIdSpy).toHaveBeenCalledTimes(1)
            expect(getIdSpy).toBeCalledWith('1234')
        })
        it('must call marketplaceContractMethods.buy when bying with DAI', () => {
            const buyStub = jest.fn(() => ({
                send: () => 'test',
            }))

            const getIdSpy = jest.spyOn(productUtils, 'getValidId')
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    buyWithERC20: buyStub,
                },
            }))
            all.buyProduct('1234', '1000', 'DAI', '4321')
            expect(buyStub).toHaveBeenCalledTimes(1)
            expect(buyStub).toBeCalledWith('0x1234', '1000', ONE_DAY, process.env.DAI_TOKEN_CONTRACT_ADDRESS, '4321000000000000000000')
            expect(getIdSpy).toHaveBeenCalledTimes(1)
            expect(getIdSpy).toBeCalledWith('1234')
        })
        it('must call send with correct object when bying with DATA', (done) => {
            jest.spyOn(utils, 'send').mockImplementation((a) => {
                expect(a).toBe('test')
                done()
            })
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    buy: () => 'test',
                },
            }))
            all.buyProduct('1234', 1000, 'DATA', '4321')
        })
        it('must call send with correct object when bying with ETH', (done) => {
            jest.spyOn(utils, 'send').mockImplementation((a) => {
                expect(a).toBe('test')
                done()
            })
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    buyWithETH: () => 'test',
                },
            }))
            all.buyProduct('1234', 1000, 'ETH', '4321')
        })
        it('must call send with correct object when bying with DAI', (done) => {
            jest.spyOn(utils, 'send').mockImplementation((a) => {
                expect(a).toBe('test')
                done()
            })
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    buyWithERC20: () => 'test',
                },
            }))
            all.buyProduct('1234', 1000, 'DAI', '4321')
        })
        it('must return the result of send when bying with DATA', () => {
            jest.spyOn(utils, 'send').mockImplementation(() => 'test')
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    buy: () => {
                    },
                },
            }))
            expect(all.buyProduct('1234', 1000, 'DATA', '4321')).toBe('test')
        })
        it('must return the result of send when bying with ETH', () => {
            jest.spyOn(utils, 'send').mockImplementation(() => 'test')
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    buyWithETH: () => {
                    },
                },
            }))
            expect(all.buyProduct('1234', 1000, 'ETH', '4321')).toBe('test')
        })
        it('must return the result of send when bying with DAI', () => {
            jest.spyOn(utils, 'send').mockImplementation(() => 'test')
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    buyWithERC20: () => {
                    },
                },
            }))
            expect(all.buyProduct('1234', 1000, 'DAI', '4321')).toBe('test')
        })
    })

    describe('getMyDataAllowance', () => {
        it('must call the correct method', async () => {
            jest.spyOn(getWeb3, 'default').mockImplementation(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const allowanceStub = jest.fn(() => ({
                call: () => Promise.resolve('1000'),
            }))
            const getContractStub = jest.fn(({ abi }) => {
                if (abi.find((f) => f.name === 'allowance')) {
                    return {
                        methods: {
                            allowance: allowanceStub,
                        },
                    }
                }
                return {
                    options: {
                        address: 'marketplaceAddress',
                    },
                }
            })
            jest.spyOn(utils, 'getContract').mockImplementation(getContractStub)
            await all.getMyDataAllowance()
            expect(allowanceStub).toHaveBeenCalledTimes(1)
            expect(getContractStub).toHaveBeenCalledTimes(2)
            expect(allowanceStub.mock.calls[0][0]).toBe('testAccount')
            expect(allowanceStub.mock.calls[0][1]).toBe('marketplaceAddress')
        })
        it('must transform the result from wei to tokens', async () => {
            jest.spyOn(getWeb3, 'default').mockImplementation(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const allowanceStub = jest.fn(() => ({
                call: () => Promise.resolve(('276000000000000000000').toString()),
            }))
            jest.spyOn(utils, 'getContract').mockImplementation(({ abi }) => {
                if (abi.find((f) => f.name === 'allowance')) {
                    return {
                        methods: {
                            allowance: allowanceStub,
                        },
                    }
                }
                return {
                    options: {
                        address: 'marketplaceAddress',
                    },
                }
            })
            const result = await all.getMyDataAllowance()
            expect(result).toStrictEqual(BN(276))
        })
    })

    describe('setMyDataAllowance', () => {
        it('must call the correct method', async () => {
            const approveStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(getWeb3, 'default').mockImplementation(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    approve: approveStub,
                },
                options: {
                    address: 'marketplaceAddress',
                },
            }))
            await all.setMyDataAllowance(100)
            expect(approveStub).toHaveBeenCalledTimes(1)
            expect(approveStub).toBeCalledWith('marketplaceAddress', '100000000000000000000')
        })
        it('must not approve negative values', (done) => {
            try {
                all.setMyDataAllowance(-100)
            } catch (e) {
                expect(e.message).toBe('Amount must be non-negative!')
                done()
            }
        })
        it('must return the result of send', async () => {
            jest.spyOn(getWeb3, 'default').mockImplementation(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const approveStub = jest.fn(() => ({
                send: () => 'test',
            }))
            const balanceStub = jest.fn(() => ({
                call: () => Promise.resolve('100000000000000000000'), // 100
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(({ abi }) => {
                if (abi.find((f) => f.name === 'approve')) {
                    return {
                        methods: {
                            approve: approveStub,
                            balanceOf: balanceStub,
                        },
                    }
                }
                return {
                    options: {
                        address: 'marketplaceAddress',
                    },
                }
            })
            const result = await all.setMyDataAllowance(100)
            expect(result).toBe('test')
        })
    })
})
