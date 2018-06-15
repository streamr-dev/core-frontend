import assert from 'assert-diff'
import sinon from 'sinon'
import moxios from 'moxios'

import * as all from '../../../../src/modules/product/services'
import * as utils from '../../../../src/utils/smartContract'
import * as getWeb3 from '../../../../src/web3/web3Provider'

describe('product - services', () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
        moxios.install()
    })

    afterEach(() => {
        sandbox.restore()
        moxios.uninstall()
    })

    describe('getProductById', () => {
        it('gets product by id', async () => {
            process.env.MARKETPLACE_API_URL = 'TEST_MARKETPLACE_API_URL'
            const data = {
                id: '123',
                name: 'Product 123',
                pricePerSecond: 0,
            }

            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'get')
                assert.equal(request.config.url, `${process.env.MARKETPLACE_API_URL}/products/123`)
            })

            const result = await all.getProductById('123')
            assert.deepEqual(result, data)
        })
    })

    describe('getStreamsByProductId', () => {
        it('gets streams by product id', async () => {
            process.env.MARKETPLACE_API_URL = 'TEST_MARKETPLACE_API_URL'
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

            moxios.wait(() => {
                const request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: data,
                })

                assert.equal(request.config.method, 'get')
                assert.equal(request.config.url, `${process.env.MARKETPLACE_API_URL}/products/123/streams`)
            })

            const result = await all.getStreamsByProductId('123')
            assert.deepEqual(result, data)
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
