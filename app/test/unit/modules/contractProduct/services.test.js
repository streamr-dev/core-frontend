import assert from 'assert-diff'
import sinon from 'sinon'

import * as all from '../../../../src/modules/contractProduct/services'
import * as utils from '../../../../src/utils/smartContract'

describe('Product services', () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('getProductFromContract', () => {
        it('must weis to token', async () => {
            const getProductStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve({
                    pricePerSecond: '1000000000000000000',
                }),
            }))
            const getContractStub = sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    getProduct: getProductStub,
                },
            }))
            const result = await all.getProductFromContract('1234abcdef')
            assert.deepStrictEqual({
                priceCurrency: undefined,
                state: undefined,
                pricePerSecond: '1',
                id: '1234abcdef',
                name: undefined,
                ownerAddress: undefined,
                beneficiaryAddress: undefined,
                minimumSubscriptionInSeconds: 0,
            }, result)
            assert(getContractStub.calledOnce)
            assert(getProductStub.calledOnce)
            assert(getProductStub.calledWith('0x1234abcdef'))
        })
        it('must throw error if owner is 0', async (done) => {
            const getProductStub = sandbox.stub().callsFake(() => Promise.resolve({
                call: () => Promise.resolve({
                    owner: '0x000',
                    pricePerSecond: '0',
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
