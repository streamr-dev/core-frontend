import getConfig from '$shared/web3/config'

jest.mock('$shared/web3/abis/token', () => (['t_test', 't_values', 't_only']))

jest.mock('$shared/web3/abis/marketplace', () => (['m_test', 'm_values', 'm_only']))

jest.mock('$shared/web3/abis/uniswapAdaptor', () => (['u_test', 'u_values', 'u_only']))

jest.mock('$shared/web3/abis/dataunion', () => (['d_test', 'd_values', 'd_only']))

jest.mock('$shared/web3/abis/dataunionSidechain', () => (['ds_test', 'ds_values', 'ds_only']))

jest.mock('$app/src/getters/getConfig', () => {
    const { default: gc } = jest.requireActual('$app/src/getters/getConfig')

    const actualConfig = gc()

    return {
        __esModule: true,
        default: () => ({
            ...actualConfig,
            core: {
                ...actualConfig.core,
                uniswapAdaptorContractAddress: 'uniAddress',
                web3TransactionConfirmationBlocks: 1337,
            },
            client: {
                ...actualConfig.client,
                mainchain: {
                    ...actualConfig.client.mainchain,
                    chainId: 9999,
                    dataTokenAddress: 'tokenAddress',
                    rpc: {
                        ...actualConfig.client.mainchain.rpc,
                        rpcs: [{
                            url: 'http://mainchainrpc:8545',
                        }],
                    },
                },
                dataUnionChain: {
                    ...actualConfig.client.dataUnionChain,
                    rpc: {
                        ...actualConfig.client.dataUnionChain.rpc,
                        chainId: 8995,
                        rpcs: [{
                            url: 'https://dataunionschain',
                        }],
                    },
                },
                streamRegistryChain: {
                    ...actualConfig.client.streamRegistryChain,
                    rpc: {
                        ...actualConfig.client.streamRegistryChain.rpc,
                        chainId: 8996,
                        rpcs: [{
                            url: 'https://streamschain',
                        }],
                    },
                },
            },
        }),
    }
})

describe('config', () => {
    describe('building the config', () => {
        it('gets the right mainnet config from env', () => {
            const { mainnet } = getConfig()

            expect(mainnet).toStrictEqual({
                chainId: 9999,
                rpcUrl: 'http://mainchainrpc:8545',
                transactionConfirmationBlocks: 1337,
                dataToken: {
                    abi: ['t_test', 't_values', 't_only'],
                    address: 'tokenAddress',
                },
                dataUnionAbi: ['d_test', 'd_values', 'd_only'],
            })
        })

        it('gets the right dataunions chain config from env', () => {
            const { dataunionsChain } = getConfig()

            expect(dataunionsChain).toStrictEqual({
                chainId: 8995,
                rpcUrl: 'https://dataunionschain',
                dataUnionAbi: ['ds_test', 'ds_values', 'ds_only'],
            })
        })

        it('gets metamask config', () => {
            const { metamask } = getConfig()

            const chainIds = Object.keys(metamask)

            expect(chainIds.length > 0).toBe(true)
            expect(chainIds.includes('9999')).toBe(true)
            expect(chainIds.includes('8995')).toBe(true)
            expect(chainIds.includes('8996')).toBe(true)

            chainIds.forEach((chainId) => {
                const { getParams } = metamask[chainId]

                expect(typeof getParams).toBe('function')
            })
        })
    })
})
