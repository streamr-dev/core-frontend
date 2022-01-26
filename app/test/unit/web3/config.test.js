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
            process.env.MAINNET_CHAIN_ID = '1'
            process.env.MAINNET_HTTP_PROVIDER = 'https://mainnet'
            process.env.WEB3_TRANSACTION_CONFIRMATION_BLOCKS = 1337
            process.env.UNISWAP_ADAPTOR_CONTRACT_ADDRESS = 'uniAddress'

            const { mainnet } = getConfig()

            expect(mainnet).toStrictEqual({
                chainId: '1',
                rpcUrl: 'https://mainnet',
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

        it('gets the right sidechain config from env', () => {
            process.env.SIDECHAIN_CHAIN_ID = '8995'
            process.env.SIDECHAIN_HTTP_PROVIDER = 'https://sidechain'

            const { sidechain } = getConfig()

            expect(sidechain).toStrictEqual({
                chainId: '8995',
                rpcUrl: 'https://sidechain',
                dataUnionAbi: ['ds_test', 'ds_values', 'ds_only'],
            })
        })

        it('gets metamask config', () => {
            process.env.SIDECHAIN_CHAIN_ID = '8997'
            process.env.MAINNET_CHAIN_ID = '8995'

            const { metamask } = getConfig()

            const chainIds = Object.keys(metamask)

            expect(chainIds.length > 0).toBe(true)

            chainIds.forEach((chainId) => {
                const { getParams } = metamask[chainId]

                expect(typeof getParams).toBe('function')
            })
        })
    })
})
