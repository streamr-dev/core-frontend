import assert from 'assert-diff'
import sinon from 'sinon'
import moxios from 'moxios'
import moment from 'moment'

import * as all from '../../../../src/modules/purchase/services'
import * as utils from '../../../../src/utils/smartContract'

describe('purchase - services', () => {
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

    describe('addFreeProduct', () => {
        it('makes a POST request to subscribe to a free product', async () => {
            const productId = 1
            const endsAt = moment().add(1, 'year').unix()

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
        })
    })

    describe('buyProduct', () => {
        it('must call buy', () => {
            const buyStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    buy: buyStub,
                },
            }))
            all.buyProduct('1234', '1000')
            assert(buyStub.calledOnce)
            assert(buyStub.calledWith('0x1234', '1000'))
        })
        it('must call send with correct object', (done) => {
            sandbox.stub(utils, 'send').callsFake((a) => {
                assert.equal('test', a)
                done()
            })
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    buy: () => 'test',
                },
            }))
            all.buyProduct('aapeli', 1000)
        })
        it('must return the result of send', () => {
            sandbox.stub(utils, 'send').callsFake(() => 'test')
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    buy: () => {
                    },
                },
            }))
            assert.equal('test', all.buyProduct('aapeli', 1000))
        })
    })
})
