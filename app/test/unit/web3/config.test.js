import getConfig from '$shared/web3/config'

jest.mock('$shared/web3/abis/token', () => (['t_test', 't_values', 't_only']))
jest.mock('$shared/web3/abis/marketplace', () => (['m_test', 'm_values', 'm_only']))
jest.mock('$shared/web3/abis/uniswapAdaptor', () => (['u_test', 'u_values', 'u_only']))
jest.mock('$shared/web3/abis/dataunion', () => (['d_test', 'd_values', 'd_only']))
jest.mock('$shared/web3/abis/dataunionSidechain', () => (['ds_test', 'ds_values', 'ds_only']))

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
            process.env.DATA_TOKEN_CONTRACT_ADDRESS = 'dataTokenAddress'
            process.env.DAI_TOKEN_CONTRACT_ADDRESS = 'daiTokenAddress'
            process.env.MAINNET_CHAIN_ID = '1'
            process.env.SIDECHAIN_CHAIN_ID = '8995'
            process.env.MAINNET_HTTP_PROVIDER = 'https://mainnet'
            process.env.SIDECHAIN_HTTP_PROVIDER = 'https://sidechain'
            process.env.WEB3_TRANSACTION_CONFIRMATION_BLOCKS = 1337
            process.env.UNISWAP_ADAPTOR_CONTRACT_ADDRESS = 'uniAddress'

            expect(getConfig()).toStrictEqual({
                mainnet: {
                    chainId: '1',
                    rpcUrl: 'https://mainnet',
                    transactionConfirmationBlocks: 1337,
                    dataToken: {
                        abi: ['t_test', 't_values', 't_only'],
                        address: 'dataTokenAddress',
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
                },
                sidechain: {
                    chainId: '8995',
                    rpcUrl: 'https://sidechain',
                    dataUnionAbi: ['ds_test', 'ds_values', 'ds_only'],
                },
            })
        })
    })
})
