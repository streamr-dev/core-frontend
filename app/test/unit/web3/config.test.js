import getConfig from '$shared/web3/config'

jest.mock('$shared/web3/abis/token', () => (['t_test', 't_values', 't_only']))
jest.mock('$shared/web3/abis/marketplace', () => (['m_test', 'm_values', 'm_only']))
jest.mock('$shared/web3/abis/uniswapAdaptor', () => (['u_test', 'u_values', 'u_only']))
jest.mock('$shared/web3/abis/dataunion', () => (['d_test', 'd_values', 'd_only']))
jest.mock('$shared/web3/abis/dataunionSidechain', () => (['ds_test', 'ds_values', 'ds_only']))

const MOCK_TOKEN_ADDRESS = 'dataTokenAddress'

jest.mock('$app/src/getters/getDataTokenAddress', () => ({
    __esModule: true,
    default: () => MOCK_TOKEN_ADDRESS,
}))

jest.mock('$app/src/getters/getMainChainId', () => ({
    __esModule: true,
    default: () => '1',
}))

jest.mock('$app/src/getters/getMainChainConfig', () => {
    const { default: actual } = jest.requireActual('$app/src/getters/getMainChainConfig')

    return {
        __esModule: true,
        default: () => ({
            ...actual(),
            url: 'http://mainchainrpc:8545',
        }),
    }
})

jest.mock('$app/src/getters/getSideChainConfig', () => {
    const { default: actual } = jest.requireActual('$app/src/getters/getSideChainConfig')

    return {
        __esModule: true,
        default: () => ({
            ...actual(),
            chainId: '8995',
            url: 'http://sidechainrpc:8546',
        }),
    }
})

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

        it('gets the right mainnet config from env', () => {
            process.env.MARKETPLACE_CONTRACT_ADDRESS = 'mpAddress'
            process.env.DAI_TOKEN_CONTRACT_ADDRESS = 'daiTokenAddress'
            process.env.WEB3_TRANSACTION_CONFIRMATION_BLOCKS = 1337
            process.env.UNISWAP_ADAPTOR_CONTRACT_ADDRESS = 'uniAddress'

            const { mainnet } = getConfig()

            expect(mainnet).toStrictEqual({
                chainId: '1',
                rpcUrl: 'http://mainchainrpc:8545',
                transactionConfirmationBlocks: 1337,
                dataToken: {
                    abi: ['t_test', 't_values', 't_only'],
                    address: MOCK_TOKEN_ADDRESS,
                },
                daiToken: {
                    abi: ['t_test', 't_values', 't_only'],
                    address: 'daiTokenAddress',
                },
                marketplace: {
                    abi: ['m_test', 'm_values', 'm_only'],
                    address: 'mpAddress',
                },
                uniswapAdaptor: {
                    abi: ['u_test', 'u_values', 'u_only'],
                    address: 'uniAddress',
                },
                dataUnionAbi: ['d_test', 'd_values', 'd_only'],
            })
        })

        it('gets the right dataunions chain config from env', () => {
            process.env.DATAUNIONS_CHAIN_ID = '8995'
            process.env.DATAUNIONS_HTTP_PROVIDER = 'https://dataunionschain'

            const { dataunionsChain } = getConfig()

            expect(dataunionsChain).toStrictEqual({
                chainId: '8995',
                rpcUrl: 'https://dataunionschain',
                dataUnionAbi: ['ds_test', 'ds_values', 'ds_only'],
            })
        })

        it('gets the right streams chain config from env', () => {
            process.env.STREAMS_CHAIN_ID = '8996'
            process.env.STREAMS_HTTP_PROVIDER = 'https://streamschain'

            const { streamsChain } = getConfig()

            expect(streamsChain).toStrictEqual({
                chainId: '8996',
                rpcUrl: 'https://streamschain',
            })
        })

        it('gets metamask config', () => {
            process.env.MAINNET_CHAIN_ID = '8995'
            process.env.STREAMS_CHAIN_ID = '8996'
            process.env.DATAUNIONS_CHAIN_ID = '8997'

            const { metamask } = getConfig()

            const chainIds = Object.keys(metamask)

            expect(chainIds.length > 0).toBe(true)
            expect(chainIds.includes('8995')).toBe(true)
            expect(chainIds.includes('8996')).toBe(true)
            expect(chainIds.includes('8997')).toBe(true)

            chainIds.forEach((chainId) => {
                const { getParams } = metamask[chainId]

                expect(typeof getParams).toBe('function')
            })
        })
    })
})
