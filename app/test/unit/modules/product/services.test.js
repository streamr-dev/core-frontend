import assert from 'assert-diff'
import sinon from 'sinon'
import moxios from 'moxios'
import { cloneDeep } from 'lodash'

import { existingProduct } from './mockData'

import * as all from '$mp/modules/product/services'
import * as utils from '$mp/utils/smartContract'
import * as getWeb3 from '$shared/web3/web3Provider'
import * as productUtils from '$mp/utils/product'

const mockFile = new File(['test'], 'test.jpg', {
    type: 'image/jpeg',
})

describe('product - services', () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.createSandbox()
        moxios.install()
    })

    afterEach(() => {
        sandbox.restore()
        moxios.uninstall()
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
                    operation: 'product_get',
                },
                {
                    id: 2,
                    user: 'tester1@streamr.com',
                    operation: 'product_edit',
                },
                {
                    id: 3,
                    user: 'tester1@streamr.com',
                    operation: 'product_delete',
                },
                {
                    id: 4,
                    user: 'tester1@streamr.com',
                    operation: 'product_share',
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
                get: true,
                edit: true,
                share: true,
                del: true,
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
                get: true,
                edit: false,
                share: false,
                del: false,
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
})
