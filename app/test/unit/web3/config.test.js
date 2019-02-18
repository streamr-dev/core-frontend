import assert from 'assert-diff'
import getConfig from '$shared/web3/config'

jest.mock('$shared/web3/abis/token', () => (['t_test', 't_values', 't_only']))
jest.mock('$shared/web3/abis/marketplace', () => (['m_test', 'm_values', 'm_only']))

describe('config', () => {
    let oldEnv
    describe('building the config', () => {
        beforeEach(() => {
            oldEnv = {
                ...process.env,
            }
        })

        afterEach(() => {
            process.env = {
                ...oldEnv,
            }
        })

        it('gets the right config from env', () => {
            process.env.MARKETPLACE_CONTRACT_ADDRESS = 'mpAddress'
            process.env.TOKEN_CONTRACT_ADDRESS = 'tokenAddress'
            process.env.WEB3_REQUIRED_NETWORK_ID = '1'
            process.env.WEB3_PUBLIC_HTTP_PROVIDER = 'https://dummy'
            process.env.WEB3_PUBLIC_WS_PROVIDER = 'wss://dummy/ws'

            assert.deepStrictEqual(getConfig(), {
                networkId: '1',
                publicNodeAddress: 'https://dummy',
                websocketAddress: 'wss://dummy/ws',
                token: {
                    abi: ['t_test', 't_values', 't_only'],
                    address: 'tokenAddress',
                },
                marketplace: {
                    abi: ['m_test', 'm_values', 'm_only'],
                    address: 'mpAddress',
                },
            })
        })
    })
})
