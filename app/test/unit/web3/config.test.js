import assert from 'assert-diff'
import getConfig from '$mp/web3/config'

jest.mock('$mp/web3/token.config', () => ({
    abi: ['t_test', 't_values', 't_only'],
    environments: {
        env1: {
            address: 'tokenEnv1',
        },
        env2: {
            address: 'tokenEnv2',
        },
    },
}))

jest.mock('$mp/web3/marketplace.config', () => ({
    abi: ['m_test', 'm_values', 'm_only'],
    environments: {
        env1: {
            address: 'mpEnv1',
        },
        env2: {
            address: 'mpEnv2',
        },
    },
}))

jest.mock('$mp/web3/common.config', () => ({
    environments: {
        env1: {
            networkId: '1',
            publicNodeAddress: 'env1',
        },
        env2: {
            networkId: '2',
            publicNodeAddress: 'env2',
        },
    },
}))

describe('config', () => {
    let oldNodeEnv
    let oldSmartContractEnv
    describe('building the config', () => {
        beforeEach(() => {
            oldNodeEnv = process.env.NODE_ENV
            oldSmartContractEnv = process.env.SMART_CONTRACT_ENV
        })

        afterEach(() => {
            process.env.NODE_ENV = oldNodeEnv
            process.env.SMART_CONTRACT_ENV = oldSmartContractEnv
        })

        it('gets the right config by env', () => {
            process.env.NODE_ENV = 'env1'
            let config = getConfig()
            assert.deepStrictEqual(config, {
                token: {
                    abi: ['t_test', 't_values', 't_only'],
                    address: 'tokenEnv1',
                },
                marketplace: {
                    abi: ['m_test', 'm_values', 'm_only'],
                    address: 'mpEnv1',
                },
                networkId: '1',
                publicNodeAddress: 'env1',
            })
            process.env.SMART_CONTRACT_ENV = ''
            process.env.NODE_ENV = 'env2'
            config = getConfig()
            assert.deepStrictEqual(config, {
                token: {
                    abi: ['t_test', 't_values', 't_only'],
                    address: 'tokenEnv2',
                },
                marketplace: {
                    abi: ['m_test', 'm_values', 'm_only'],
                    address: 'mpEnv2',
                },
                networkId: '2',
                publicNodeAddress: 'env2',
            })
        })

        it('prioritizes SMART_CONTRACT_ENV if defined', () => {
            process.env.SMART_CONTRACT_ENV = 'env1'
            process.env.NODE_ENV = 'env2'
            let config = getConfig()
            assert.deepStrictEqual(config, {
                token: {
                    abi: ['t_test', 't_values', 't_only'],
                    address: 'tokenEnv1',
                },
                marketplace: {
                    abi: ['m_test', 'm_values', 'm_only'],
                    address: 'mpEnv1',
                },
                networkId: '1',
                publicNodeAddress: 'env1',
            })
            process.env.SMART_CONTRACT_ENV = 'env2'
            process.env.NODE_ENV = 'env1'
            config = getConfig()
            assert.deepStrictEqual(config, {
                token: {
                    abi: ['t_test', 't_values', 't_only'],
                    address: 'tokenEnv2',
                },
                marketplace: {
                    abi: ['m_test', 'm_values', 'm_only'],
                    address: 'mpEnv2',
                },
                networkId: '2',
                publicNodeAddress: 'env2',
            })
        })
    })
})
