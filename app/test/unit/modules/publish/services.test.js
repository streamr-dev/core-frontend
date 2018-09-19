import assert from 'assert-diff'
import sinon from 'sinon'
import moxios from 'moxios'

import * as all from '../../../../src/marketplace/modules/publish/services'
import * as utils from '../../../../src/marketplace/utils/smartContract'

describe('publish - services', () => {
    let sandbox
    let oldStreamrApiUrl

    beforeEach(() => {
        moxios.install()
        sandbox = sinon.createSandbox()
        oldStreamrApiUrl = process.env.STREAMR_API_URL
        process.env.STREAMR_API_URL = ''
    })

    afterEach(() => {
        moxios.uninstall()
        sandbox.restore()
        process.env.STREAMR_API_URL = oldStreamrApiUrl
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
                assert.equal(request.config.url, `/products/${productId}/deployFree`)
            })

            const result = await all.postDeployFree(productId)
            assert.deepStrictEqual(result, data)
        })
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
                assert.equal(request.config.url, `/products/${productId}/undeployFree`)
            })

            const result = await all.postUndeployFree(productId)
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
                assert.equal(request.config.url, `/products/${productId}/setDeploying`)
                assert.equal(request.config.data, JSON.stringify({
                    transactionHash: txHash,
                }))
            })

            const result = await all.postSetDeploying(productId, txHash)
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
                assert.equal(request.config.url, `/products/${productId}/setUndeploying`)
                assert.equal(request.config.data, JSON.stringify({
                    transactionHash: txHash,
                }))
            })

            const result = await all.postSetUndeploying(productId, txHash)
            assert.deepStrictEqual(result, data)
        })
    })

    describe('redeployProduct', () => {
        it('calls redeployProduct contract method', async () => {
            const redeployProductStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    redeployProduct: redeployProductStub,
                },
            }))
            await all.redeployProduct('1')
            assert(redeployProductStub.calledWith('0x1'))
            assert(redeployProductStub.calledOnce)
        })
    })

    describe('deleteProduct', () => {
        it('calls deleteProduct contract method', async () => {
            const deleteProductStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    deleteProduct: deleteProductStub,
                },
            }))
            await all.deleteProduct('1')
            assert(deleteProductStub.calledWith('0x1'))
            assert(deleteProductStub.calledOnce)
        })
    })
})
