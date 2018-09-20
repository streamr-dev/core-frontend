import assert from 'assert-diff'
import sinon from 'sinon'
import moxios from 'moxios'

import * as all from '../../../../src/marketplace/modules/product/services'
import * as utils from '../../../../src/marketplace/utils/smartContract'
import * as getWeb3 from '../../../../src/marketplace/web3/web3Provider'
import * as productUtils from '../../../../src/marketplace/utils/product'

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
})
