import sinon from 'sinon'

import * as all from '$shared/utils/web3'
import * as getConfig from '$shared/web3/config'

describe('web3 utils', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
        sandbox.reset()
    })

    describe('checkEthereumNetworkIsCorrect', () => {
        it('must resolve if required network is the same as the actual network', async () => {
            sandbox.stub(getConfig, 'default').callsFake(() => ({
                networkId: '1',
            }))
            await all.checkEthereumNetworkIsCorrect({
                getEthereumNetwork: () => Promise.resolve(1),
            })
        })

        it('must fail if required network is not the same as the actual network', async (done) => {
            sandbox.stub(getConfig, 'default').callsFake(() => ({
                networkId: '2',
            }))
            try {
                await all.checkEthereumNetworkIsCorrect({
                    getEthereumNetwork: () => Promise.resolve(1),
                })
            } catch (e) {
                done()
            }
        })
    })
})
