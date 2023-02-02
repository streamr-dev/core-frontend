import moxios from 'moxios'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import BN from 'bignumber.js'
import * as all from '$mp/modules/product/services'
import * as utils from '$mp/utils/smartContract'
import * as productUtils from '$mp/utils/product'
import * as web3Utils from '$mp/utils/web3'
import setTempEnv from '$app/test/test-utils/setTempEnv'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import { Project } from '$mp/types/project-types'
import { existingProduct } from './mockData'
jest.mock('$utils/web3/getDefaultWeb3Account', () => ({
    __esModule: true,
    default: jest.fn(() => Promise.reject(new Error('Not implemented'))),
}))

function mockDefaultAccount(defaultAccount) {
    return (getDefaultWeb3Account as any).mockImplementation(() => Promise.resolve(defaultAccount))
}

jest.mock('$app/src/getters/getConfig', () => {
    const { default: gc } = jest.requireActual('$app/src/getters/getConfig')
    const actualConfig = gc()
    return {
        __esModule: true,
        default: () => ({ ...actualConfig, core: { ...actualConfig.core } }),
    }
})
const mockFile = new File(['test'], 'test.jpg', {
    type: 'image/jpeg',
})
const ONE_DAY = '86400'
describe('product - services', () => {
    setTempEnv({
        STREAMR_DOCKER_DEV_HOST: 'localhost',
    })
    beforeEach(() => {
        moxios.install()
    })
    afterEach(() => {
        moxios.uninstall()
        jest.clearAllMocks()
        jest.restoreAllMocks();
        (getDefaultWeb3Account as any).mockReset()
    })
    describe('getProductById', () => {
        it('gets product by id', async () => {
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
                expect(request.config.url).toBe('http://localhost/api/v2/products/123')
            })
            const result = await all.getProductById('123')
            expect(result).toStrictEqual(data)
            expect(getIdSpy).toHaveBeenCalledTimes(1)
            expect(getIdSpy).toBeCalledWith('123', false)
        })
    })
    describe('getMyProductSubscription', () => {
        it('works as intended', async () => {
            mockDefaultAccount('testAccount')
            const getProductStub = jest.fn(() => ({
                call: () =>
                    Promise.resolve({
                        status: '0x1',
                        pricePerSecond: '0',
                    }),
            }))
            const getSubscriptionStub = jest.fn(() => ({
                call: () =>
                    Promise.resolve({
                        endTimestamp: '0',
                    }),
            }))
            const getDecimalsStub = jest.fn(() => ({
                call: () => Promise.resolve(18),
            }))
            const getContractStub = jest.fn(() => ({
                methods: {
                    getProduct: getProductStub,
                    getSubscription: getSubscriptionStub,
                    decimals: getDecimalsStub,
                },
            }))
            jest.spyOn(utils, 'getContract').mockImplementation(getContractStub as any)
            const result = await all.getMyProductSubscription('1234abcdef', 8995)
            expect(result).toStrictEqual({
                productId: '1234abcdef',
                endTimestamp: 0,
            })
            expect(getProductStub).toHaveBeenCalledTimes(1)
            expect(getSubscriptionStub).toHaveBeenCalledTimes(1)
            expect(getContractStub).toHaveBeenCalledTimes(3)
            expect(getProductStub).toBeCalledWith('0x1234abcdef')
            expect(getSubscriptionStub).toBeCalledWith('0x1234abcdef', 'testAccount')
        })
        it('throws an error if no product was found', async () => {
            mockDefaultAccount('testAccount')
            const getProductStub = jest.fn(() => ({
                call: () =>
                    Promise.resolve({
                        owner: '0x000',
                    }),
            }))
            jest.spyOn(utils, 'getContract').mockImplementation((): any => ({
                methods: {
                    getProduct: getProductStub,
                },
            }))

            try {
                await all.getMyProductSubscription('1234abcdef', 8995)
            } catch (e) {
                expect(e.message).toMatch(/No product found/)
            }
        })
    })
    it('puts product', async () => {
        const data: Project = cloneDeep(existingProduct)
        const expectedResult = cloneDeep(existingProduct)
        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data,
            })
            expect(request.config.method).toBe('put')
            expect(request.config.url).toBe(`http://localhost/api/v2/products/${data.id}`)
        })
        const result = await all.putProduct(data, data.id)
        expect(result).toStrictEqual(expectedResult)
    })
    it('posts product', async () => {
        const data = cloneDeep(existingProduct)
        const expectedResult = cloneDeep(existingProduct)
        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data,
            })
            expect(request.config.method).toBe('post')
            expect(request.config.url).toBe('http://localhost/api/v2/products')
        })
        const result = await all.postProduct(data)
        expect(result).toStrictEqual(expectedResult)
    })
    it('posts image', async () => {
        const data = cloneDeep(existingProduct)
        const expectedResult = cloneDeep(existingProduct)
        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: data,
            })
            expect(request.config.method).toBe('post')
            expect(request.config.url).toBe(`http://localhost/api/v2/products/${data.id}/images`)
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
                expect(request.config.url).toBe(`http://localhost/api/v2/products/${productId}/undeployFree`)
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
                expect(request.config.url).toBe(`http://localhost/api/v2/products/${productId}/setUndeploying`)
                expect(request.config.data).toBe(
                    JSON.stringify({
                        transactionHash: txHash,
                    }),
                )
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
                expect(request.config.url).toBe(`http://localhost/api/v2/products/${productId}/deployFree`)
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
                expect(request.config.url).toBe(`http://localhost/api/v2/products/${productId}/setDeploying`)
                expect(request.config.data).toBe(
                    JSON.stringify({
                        transactionHash: txHash,
                    }),
                )
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
                expect(request.config.url).toBe('http://localhost/api/v2/subscriptions')
                expect(request.config.data).toBe(
                    JSON.stringify({
                        product: productId,
                        endsAt,
                    }),
                )
            })
            const result = await all.addFreeProduct(productId, endsAt)
            expect(result).toBe(null)
            expect(getIdSpy).toHaveBeenCalledTimes(1)
            expect(getIdSpy).toBeCalledWith(productId, false)
        })
    })

    // TODO - refactor - too much of repeated test code

    describe('buyProduct', () => {
        it('must call marketplaceContractMethods.buy when bying with DATA', () => {
            const buyStub = jest.fn(() => ({
                send: () => 'test',
            }))
            const getIdSpy = jest.spyOn(productUtils, 'getValidId')
            jest.spyOn(utils, 'send').mockImplementation((method: any): any => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation((): any => ({
                methods: {
                    buy: buyStub,
                },
            }))
            all.buyProduct('1234', 8995, '1000', 'DATA', new BN('4321'))
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
            jest.spyOn(utils, 'send').mockImplementation((method: any) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation((): any => ({
                methods: {
                    buyWithETH: buyStub,
                },
            }))
            all.buyProduct('1234', 8995, '1000', 'ETH', new BN('4321'))
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
            jest.spyOn(utils, 'send').mockImplementation((method: any) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation((): any => ({
                methods: {
                    buyWithERC20: buyStub,
                },
            }))
            all.buyProduct('1234', 8995, '1000', 'DAI', new BN('4321'))
            expect(buyStub).toHaveBeenCalledTimes(1)
            expect(buyStub).toBeCalledWith(
                '0x1234',
                '1000',
                ONE_DAY,
                web3Utils.getDaiAddress(8995),
                '4321000000000000000000',
            )
            expect(getIdSpy).toHaveBeenCalledTimes(1)
            expect(getIdSpy).toBeCalledWith('1234')
        })
        it('must call send with correct object when bying with DATA', (done) => {
            jest.spyOn(utils, 'send').mockImplementation((a): any => {
                expect(a).toBe('test')
                done()
            })
            jest.spyOn(utils, 'getContract').mockImplementation((): any => ({
                methods: {
                    buy: () => 'test',
                },
            }))
            all.buyProduct('1234', 8995, new BN(1000), 'DATA', new BN('4321'))
        })
        it('must call send with correct object when bying with ETH', (done) => {
            jest.spyOn(utils, 'send').mockImplementation((a): any => {
                expect(a).toBe('test')
                done()
            })
            jest.spyOn(utils, 'getContract').mockImplementation((): any => ({
                methods: {
                    buyWithETH: () => 'test',
                },
            }))
            all.buyProduct('1234', 8995, new BN(1000), 'ETH', new BN('4321'))
        })
        it('must call send with correct object when bying with DAI', (done) => {
            jest.spyOn(utils, 'send').mockImplementation((a): any => {
                expect(a).toBe('test')
                done()
            })
            jest.spyOn(utils, 'getContract').mockImplementation((): any => ({
                methods: {
                    buyWithERC20: () => 'test',
                },
            }))
            all.buyProduct('1234', 8995, new BN(1000), 'DAI', new BN('4321'))
        })
        it('must return the result of send when bying with DATA', () => {
            jest.spyOn(utils, 'send').mockImplementation((): any => 'test')
            jest.spyOn(utils, 'getContract').mockImplementation((): any => ({
                methods: {
                    buy: () => {},
                },
            }))
            expect(all.buyProduct('1234', 8995, new BN(1000), 'DATA', new BN('4321'))).toBe('test')
        })
        it('must return the result of send when bying with ETH', () => {
            jest.spyOn(utils, 'send').mockImplementation((): any => 'test')
            jest.spyOn(utils, 'getContract').mockImplementation((): any => ({
                methods: {
                    buyWithETH: () => {},
                },
            }))
            expect(all.buyProduct('1234', 8995, new BN(1000), 'ETH', new BN('4321'))).toBe('test')
        })
        it('must return the result of send when bying with DAI', () => {
            jest.spyOn(utils, 'send').mockImplementation((): any => 'test')
            jest.spyOn(utils, 'getContract').mockImplementation((): any => ({
                methods: {
                    buyWithERC20: () => {},
                },
            }))
            expect(all.buyProduct('1234', 8995, new BN(1000), 'DAI', new BN('4321'))).toBe('test')
        })
    })
    describe('getMyDataAllowance', () => {
        it('must call the correct method', async () => {
            mockDefaultAccount('testAccount')
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
            jest.spyOn(utils, 'getContract').mockImplementation(getContractStub as any)
            await all.getMyDataAllowance(8995)
            expect(allowanceStub).toHaveBeenCalledTimes(1)
            expect(getContractStub).toHaveBeenCalledTimes(2)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(allowanceStub.mock.calls[0][0]).toBe('testAccount')
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(allowanceStub.mock.calls[0][1]).toBe('marketplaceAddress')
        })
        it('must transform the result from wei to tokens', async () => {
            mockDefaultAccount('testAccount')
            const allowanceStub = jest.fn(() => ({
                call: () => Promise.resolve('276000000000000000000'.toString()),
            }))
            jest.spyOn(utils, 'getContract').mockImplementation(({ abi }): any => {
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
            const result = await all.getMyDataAllowance(8995)
            expect(result).toStrictEqual(new BN(276))
        })
    })
    describe('setMyDataAllowance', () => {
        it('must call the correct method', async () => {
            mockDefaultAccount('testAccount')
            const approveStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method: any): any => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation((): any => ({
                methods: {
                    approve: approveStub,
                },
                options: {
                    address: 'marketplaceAddress',
                },
            }))
            await all.setMyDataAllowance('100', 8995)
            expect(approveStub).toHaveBeenCalledTimes(1)
            expect(approveStub).toBeCalledWith('marketplaceAddress', '100000000000000000000')
        })
        it('must not approve negative values', (done) => {
            try {
                all.setMyDataAllowance('-100', 8995)
            } catch (e) {
                expect(e.message).toBe('Amount must be non-negative!')
                done()
            }
        })
        it('must return the result of send', async () => {
            mockDefaultAccount('testAccount')
            const approveStub = jest.fn(() => ({
                send: () => 'test',
            }))
            const balanceStub = jest.fn(() => ({
                call: () => Promise.resolve('100000000000000000000'), // 100
            }))
            jest.spyOn(utils, 'send').mockImplementation((method: any) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(({ abi }): any => {
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
            const result = await all.setMyDataAllowance('100', 8995)
            expect(result).toBe('test')
        })
    })
})
