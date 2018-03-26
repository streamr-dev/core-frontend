import assert from 'assert-diff'
import FakeProvider from 'web3-fake-provider'
import * as getWeb3 from '../../web3/web3Provider'
import InputDataDecoder from 'ethereum-input-data-decoder'
import {StringDecoder} from 'string_decoder'
import sinon from 'sinon'
import config from '../../web3/web3Config'

const inputDataDecoder = new InputDataDecoder(config.smartContracts.marketplace.abi)
const stringDecoder = new StringDecoder('utf8')

const decodeData = (payload) => payload.params.map(p => inputDataDecoder.decodeData(p.data))
const decodeString = (buffer) => stringDecoder.write(buffer).replace(/\0/g, '')
const decodeNumber = (bn) => bn.toNumber()

import {marketplaceContract} from '../../web3/smartContracts'

const injectTransaction = (provider, result, validation) => {
    provider.injectResult(['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855'])
    provider.injectValidation(({method}) => {
        assert.equal(method, 'eth_accounts')
    })
    provider.injectResult(1000000000)
    provider.injectValidation(({method}) => {
        assert.equal(method, 'eth_gasPrice')
    })
    provider.injectResult(result)
    provider.injectValidation((payload) => {
        assert.equal(payload.method, 'eth_sendTransaction')
        return validation(payload)
    })
}

const injectCall = (provider, result, validation) => {
    provider.injectResult(result)
    provider.injectValidation((payload) => {
        assert.equal(payload.method, 'eth_call')
        return validation(payload)
    })
}

/*
    Results can be encoded/decoded eg. using https://adibas03.github.io/online-ethereum-abi-encoder-decoder
 */

describe('SmartContracts integration test', () => {
    let provider
    let sandbox
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
        provider = new FakeProvider()
        getWeb3.default().setProvider(provider)
    })
    afterEach(() => {
        provider = null
        sandbox.reset()
        sandbox.restore()
    })
    describe('Marketplace Smart Contract', () => {
        describe('getProduct', () => {
            it('must call correct method', async () => {
                const id = 'x'
                const result = '0x00000000000000000000000000000000000000000000000000000000000000e00000000000000000000000003f2da479b77cb583c3462577dcd2e89b965fe9870000000000000000000000008e491ab499d45b8eb44f0f099bf86f7719ec53c6000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000047465737400000000000000000000000000000000000000000000000000000000'
                injectCall(provider, result, (payload) => {
                    const [data] = decodeData(payload)
                    assert.equal(id, decodeString(data.inputs[0]))
                })
                const product = await marketplaceContract.getProduct(id)
                assert.equal('0x8e491Ab499D45b8Eb44F0f099bF86F7719Ec53C6', product.beneficiary)
                assert.equal('0', product.currency)
                assert.equal('1', product.minimumSubscriptionSeconds)
                assert.equal('test', product.name)
                assert.equal('0x3F2dA479B77cB583C3462577DCD2e89B965fe987', product.owner)
                assert.equal('1', product.pricePerSecond)
                assert.equal('1', product.state)
            })
            it('must handle failure right', async (done) => {
                const id = 'x'
                const result = '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
                injectCall(provider, result, (payload) => {
                    const [data] = decodeData(payload)
                    assert.equal(id, decodeString(data.inputs[0]))
                })
                try {
                    await marketplaceContract.getProduct(id)
                } catch (e) {
                    assert(e.message.match(/no product found with id x/i))
                    done()
                }
            })
        })
        describe('buy', () => {
            it('must call correct method', (done) => {
                const id = 'x'
                const timeInSeconds = 1000
                injectTransaction(provider, null, (payload) => {
                    assert.equal(payload.method, 'eth_sendTransaction')
                    const [data] = decodeData(payload)
                    assert.equal(id, decodeString(data.inputs[0]))
                    assert.equal(timeInSeconds, decodeNumber(data.inputs[1]))
                    done()
                })
                marketplaceContract.buy('x', 1000)
            })
            it('must handle failure before hash right', (done) => {
                const web3 = getWeb3.default()
                web3.setProvider(null)
                // No provider
                marketplaceContract.buy('x', 1000)
                    .on('error', (e) => {
                        assert.equal('Provider not set or invalid', e.message)
                        done()
                    })
            })
            it('must handle failure with transaction right', () => {

            })
        })
    })
})
