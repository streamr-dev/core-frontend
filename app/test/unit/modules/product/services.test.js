import assert from 'assert-diff'
import sinon from 'sinon'
import moxios from 'moxios'
import { cloneDeep } from 'lodash'
import moment from 'moment'

import { existingProduct } from './mockData'

import * as all from '$mp/modules/product/services'
import * as utils from '$mp/utils/smartContract'
import * as getWeb3 from '$shared/web3/web3Provider'
import * as productUtils from '$mp/utils/product'

const mockFile = new File(['test'], 'test.jpg', {
    type: 'image/jpeg',
})

const ONE_DAY = '86400'

describe('product - services', () => {
    let sandbox
    let oldStreamrApiUrl
    let oldDaiTokenAddress

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        moxios.install()
        oldStreamrApiUrl = process.env.STREAMR_API_URL
        process.env.STREAMR_API_URL = ''
        oldDaiTokenAddress = process.env.DAI_TOKEN_CONTRACT_ADDRESS
        process.env.DAI_TOKEN_CONTRACT_ADDRESS = 'daiTokenAddress'
    })

    afterEach(() => {
        sandbox.restore()
        moxios.uninstall()
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

            const getIdSpy = sandbox.spy(productUtils, 'getValidId')
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'get')
                assert.equal(request.config.url, `${process.env.STREAMR_API_URL}/products/123`)
            })

            const result = await all.getProductById('123')
            assert.deepStrictEqual(result, data)
            assert(getIdSpy.calledOnce)
            assert(getIdSpy.calledWith('123', false))
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

            const getIdSpy = sandbox.spy(productUtils, 'getValidId')
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'get')
                assert.equal(request.config.url, `${process.env.STREAMR_API_URL}/products/123/streams`)
            })

            const result = await all.getStreamsByProductId('123')
            assert.deepStrictEqual(result, data)
            assert(getIdSpy.calledOnce)
            assert(getIdSpy.calledWith('123', false))
        })
    })

    describe('getMyProductSubscription', () => {
        it('works as intended', async () => {
            const accountStub = sandbox.stub().callsFake(() => Promise.resolve('testAccount'))
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: accountStub,
            }))
            const getProductStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve({
                    status: '0x1',
                    pricePerSecond: '0',
                }),
            }))
            const getSubscriptionStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve({
                    endTimestamp: '0',
                }),
            }))
            const getContractStub = sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    getProduct: getProductStub,
                    getSubscription: getSubscriptionStub,
                },
            }))
            const result = await all.getMyProductSubscription('1234abcdef')
            assert.deepStrictEqual({
                productId: '1234abcdef',
                endTimestamp: 0,
            }, result)
            assert(getProductStub.calledOnce)
            assert(getSubscriptionStub.calledOnce)
            assert(getContractStub.calledTwice)
            assert(getProductStub.calledWith('0x1234abcdef'))
            assert(getSubscriptionStub.calledWith('0x1234abcdef', 'testAccount'))
        })

        it('throws an error if no product was found', async (done) => {
            const accountStub = sandbox.stub().callsFake(() => Promise.resolve('testAccount'))
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: accountStub,
            }))
            const getProductStub = sandbox.stub().callsFake(() => Promise.resolve({
                call: () => Promise.resolve({
                    owner: '0x000',
                }),
            }))
            sandbox.stub(utils, 'getContract').callsFake(() => Promise.resolve({
                methods: {
                    getProduct: getProductStub,
                },
            }))
            try {
                await all.getProductFromContract('1234abcdef')
            } catch (e) {
                done()
            }
        })
    })

    describe('getUserProductPermissions', () => {
        it('gets product permissions', async () => {
            process.env.STREAMR_API_URL = 'TEST_STREAMR_API_URL'
            const productId = '1'
            const data = [
                {
                    id: 1,
                    user: 'tester1@streamr.com',
                    operation: 'read',
                },
                {
                    id: 2,
                    user: 'tester1@streamr.com',
                    operation: 'write',
                },
                {
                    id: 3,
                    user: 'tester1@streamr.com',
                    operation: 'share',
                },
            ]

            const getIdSpy = sandbox.spy(productUtils, 'getValidId')
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'get')
                assert.equal(request.config.url, `${process.env.STREAMR_API_URL}/products/${productId}/permissions/me`)
            })
            const expected = {
                read: true,
                write: true,
                share: true,
            }

            const result = await all.getUserProductPermissions(productId)
            assert.deepStrictEqual(result, expected)
            assert(getIdSpy.calledOnce)
            assert(getIdSpy.calledWith(productId, false))
        })

        it('gets anynymous permissions', async () => {
            process.env.STREAMR_API_URL = 'TEST_STREAMR_API_URL'
            const productId = '1'
            const data = [
                {
                    id: 3,
                    anonymous: true,
                },
            ]

            const getIdSpy = sandbox.spy(productUtils, 'getValidId')
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'get')
                assert.equal(request.config.url, `${process.env.STREAMR_API_URL}/products/${productId}/permissions/me`)
            })
            const expected = {
                read: true,
                write: false,
                share: false,
            }

            const result = await all.getUserProductPermissions(productId)
            assert.deepStrictEqual(result, expected)
            assert(getIdSpy.calledOnce)
            assert(getIdSpy.calledWith(productId, false))
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

            assert.equal(request.config.method, 'put')
            assert.equal(request.config.url, `${process.env.STREAMR_API_URL}/products/${data.id}`)
        })
        const result = await all.putProduct(data, data.id)
        assert.deepStrictEqual(result, expectedResult)
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

            assert.equal(request.config.method, 'post')
            assert.equal(request.config.url, `${process.env.STREAMR_API_URL}/products`)
        })
        const result = await all.postProduct(data)
        assert.deepStrictEqual(result, expectedResult)
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

            assert.equal(request.config.method, 'post')
            assert.equal(request.config.url, `${process.env.STREAMR_API_URL}/products/${data.id}/images`)
        })
        const result = await all.postImage(data.id, mockFile)
        assert.deepStrictEqual(result, expectedResult)
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

                assert.equal(request.config.method, 'post')
                assert.equal(request.config.url, `${process.env.STREAMR_API_URL}/products/${productId}/undeployFree`)
            })

            const result = await all.postUndeployFree(productId)
            assert.deepStrictEqual(result, data)
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

                assert.equal(request.config.method, 'post')
                assert.equal(request.config.url, `${process.env.STREAMR_API_URL}/products/${productId}/setUndeploying`)
                assert.equal(request.config.data, JSON.stringify({
                    transactionHash: txHash,
                }))
            })

            const result = await all.postSetUndeploying(productId, txHash)
            assert.deepStrictEqual(result, data)
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

                assert.equal(request.config.method, 'post')
                assert.equal(request.config.url, `${process.env.STREAMR_API_URL}/products/${productId}/deployFree`)
            })

            const result = await all.postDeployFree(productId)
            assert.deepStrictEqual(result, data)
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

                assert.equal(request.config.method, 'post')
                assert.equal(request.config.url, `${process.env.STREAMR_API_URL}/products/${productId}/setDeploying`)
                assert.equal(request.config.data, JSON.stringify({
                    transactionHash: txHash,
                }))
            })

            const result = await all.postSetDeploying(productId, txHash)
            assert.deepStrictEqual(result, data)
        })
    })

    describe('addFreeProduct', () => {
        it('makes a POST request to subscribe to a free product', async () => {
            const productId = '1'
            const endsAt = moment().add(1, 'year').unix()

            const getIdSpy = sandbox.spy(productUtils, 'getValidId')
            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: null,
                })
                assert.equal(request.config.method, 'post')
                assert.equal(request.config.url, '/subscriptions')
                assert.equal(request.config.data, JSON.stringify({
                    product: productId,
                    endsAt,
                }))
            })

            const result = await all.addFreeProduct(productId, endsAt)
            assert.deepStrictEqual(result, null)
            assert(getIdSpy.calledOnce)
            assert(getIdSpy.calledWith(productId, false))
        })
    })

    describe('buyProduct', () => {
        it('must call marketplaceContractMethods.buy when bying with DATA', () => {
            const buyStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))

            const getIdSpy = sandbox.spy(productUtils, 'getValidId')
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    buy: buyStub,
                },
            }))
            all.buyProduct('1234', '1000', 'DATA', '4321')
            assert(buyStub.calledOnce)
            assert(buyStub.calledWith('0x1234', '1000'))
            assert(getIdSpy.calledOnce)
            assert(getIdSpy.calledWith('1234'))
        })
        it('must call marketplaceContractMethods.buy when bying with ETH', () => {
            const buyStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))

            const getIdSpy = sandbox.spy(productUtils, 'getValidId')
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    buyWithETH: buyStub,
                },
            }))
            all.buyProduct('1234', '1000', 'ETH', '4321')
            assert(buyStub.calledOnce)
            assert(buyStub.calledWith('0x1234', '1000', ONE_DAY))
            assert(getIdSpy.calledOnce)
            assert(getIdSpy.calledWith('1234'))
        })
        it('must call marketplaceContractMethods.buy when bying with DAI', () => {
            const buyStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))

            const getIdSpy = sandbox.spy(productUtils, 'getValidId')
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    buyWithERC20: buyStub,
                },
            }))
            all.buyProduct('1234', '1000', 'DAI', '4321')
            assert(buyStub.calledOnce)
            assert(buyStub.calledWith('0x1234', '1000', ONE_DAY, process.env.DAI_TOKEN_CONTRACT_ADDRESS, '4321000000000000000000'))
            assert(getIdSpy.calledOnce)
            assert(getIdSpy.calledWith('1234'))
        })
        it('must call send with correct object when bying with DATA', (done) => {
            sandbox.stub(utils, 'send').callsFake((a) => {
                assert.equal('test', a)
                done()
            })
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    buy: () => 'test',
                },
            }))
            all.buyProduct('1234', 1000, 'DATA', '4321')
        })
        it('must call send with correct object when bying with ETH', (done) => {
            sandbox.stub(utils, 'send').callsFake((a) => {
                assert.equal('test', a)
                done()
            })
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    buyWithETH: () => 'test',
                },
            }))
            all.buyProduct('1234', 1000, 'ETH', '4321')
        })
        it('must call send with correct object when bying with DAI', (done) => {
            sandbox.stub(utils, 'send').callsFake((a) => {
                assert.equal('test', a)
                done()
            })
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    buyWithERC20: () => 'test',
                },
            }))
            all.buyProduct('1234', 1000, 'DAI', '4321')
        })
        it('must return the result of send when bying with DATA', () => {
            sandbox.stub(utils, 'send').callsFake(() => 'test')
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    buy: () => {
                    },
                },
            }))
            assert.equal('test', all.buyProduct('1234', 1000, 'DATA', '4321'))
        })
        it('must return the result of send when bying with ETH', () => {
            sandbox.stub(utils, 'send').callsFake(() => 'test')
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    buyWithETH: () => {
                    },
                },
            }))
            assert.equal('test', all.buyProduct('1234', 1000, 'ETH', '4321'))
        })
        it('must return the result of send when bying with DAI', () => {
            sandbox.stub(utils, 'send').callsFake(() => 'test')
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    buyWithERC20: () => {
                    },
                },
            }))
            assert.equal('test', all.buyProduct('1234', 1000, 'DAI', '4321'))
        })
    })

    describe('getMyDataAllowance', () => {
        it('must call the correct method', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const allowanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve('1000'),
            }))
            const getContractStub = sandbox.stub(utils, 'getContract').callsFake(({ abi }) => {
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
            await all.getMyDataAllowance()
            assert(allowanceStub.calledOnce)
            assert(getContractStub.calledTwice)
            assert.equal('testAccount', allowanceStub.getCall(0).args[0])
            assert.equal('marketplaceAddress', allowanceStub.getCall(0).args[1])
        })
        it('must transform the result from wei to tokens', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const allowanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve(('276000000000000000000').toString()),
            }))
            sandbox.stub(utils, 'getContract').callsFake(({ abi }) => {
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
            assert.equal(276, result)
        })
    })

    describe('setMyDataAllowance', () => {
        it('must call the correct method', async () => {
            const approveStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    approve: approveStub,
                },
                options: {
                    address: 'marketplaceAddress',
                },
            }))
            await all.setMyDataAllowance(100)
            assert(approveStub.calledOnce)
            assert(approveStub.calledWith('marketplaceAddress', '100000000000000000000'))
        })
        it('must not approve negative values', (done) => {
            try {
                all.setMyDataAllowance(-100)
            } catch (e) {
                assert.equal('negativeAmount', e.message)
                done()
            }
        })
        it('must return the result of send', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const approveStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            const balanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve('100000000000000000000'), // 100
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(({ abi }) => {
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
            assert.equal(result, 'test')
        })
    })
})
