import assert from 'assert-diff'
import sinon from 'sinon'
import moxios from 'moxios'
import moment from 'moment'

import * as all from '$mp/modules/purchase/services'
import * as utils from '$mp/utils/smartContract'
import * as productUtils from '$mp/utils/product'

const ONE_DAY = '86400'

describe('purchase - services', () => {
    let sandbox
    let oldStreamrApiUrl
    let oldDaiTokenAddress

    beforeEach(() => {
        moxios.install()
        sandbox = sinon.createSandbox()
        oldStreamrApiUrl = process.env.STREAMR_API_URL
        process.env.STREAMR_API_URL = ''
        oldDaiTokenAddress = process.env.DAI_TOKEN_CONTRACT_ADDRESS
        process.env.DAI_TOKEN_CONTRACT_ADDRESS = 'daiTokenAddress'
    })

    afterEach(() => {
        moxios.uninstall()
        sandbox.restore()
        process.env.STREAMR_API_URL = oldStreamrApiUrl
        process.env.DAI_TOKEN_CONTRACT_ADDRESS = oldDaiTokenAddress
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
        it('must call marketplaceContractMethods.buy when buying with DATA', () => {
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
        it('must call marketplaceContractMethods.buy when buying with ETH', () => {
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
        it('must call marketplaceContractMethods.buy when buying with DAI', () => {
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
        it('must call send with correct object when buying with DATA', (done) => {
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
        it('must call send with correct object when buying with ETH', (done) => {
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
        it('must call send with correct object when buying with DAI', (done) => {
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
        it('must return the result of send when buying with DATA', () => {
            sandbox.stub(utils, 'send').callsFake(() => 'test')
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    buy: () => {
                    },
                },
            }))
            assert.equal('test', all.buyProduct('1234', 1000, 'DATA', '4321'))
        })
        it('must return the result of send when buying with ETH', () => {
            sandbox.stub(utils, 'send').callsFake(() => 'test')
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    buyWithETH: () => {
                    },
                },
            }))
            assert.equal('test', all.buyProduct('1234', 1000, 'ETH', '4321'))
        })
        it('must return the result of send when buying with DAI', () => {
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
})
