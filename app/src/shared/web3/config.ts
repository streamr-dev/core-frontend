import { Chain, Chains, RPCProtocol } from '@streamr/config'
import getMainChainId from '$app/src/getters/getMainChainId'
import formatConfigUrl from '$utils/formatConfigUrl'
import { defaultChainConfig } from '$app/src/getters/getChainConfig'

type MetamaskNetworkConfig = {
    chainName: string
    rpcUrls: string[]
    blockExplorerUrls: string[]
    nativeCurrency: {
        name: string
        symbol: string
        decimals: number
    }
}

type Config = {
    metamask: {
        [key: number]: {
            getParams: () => MetamaskNetworkConfig
        }
    }
}
const chainConfigs = Chains.load()

export const getConfigForChain = (chainId: number): Chain => {
    if (chainId == null) {
        throw new Error('ChainId must be provided!')
    }

    // $FlowFixMe: Object.entries loses type information
    const configEntry = Object.entries(chainConfigs).find(
        (c) => c[1].id.toString() === chainId.toString(),
    )

    if (configEntry == null) {
        throw new Error(`Could not find config for chainId ${chainId}`)
    }

    const config: Chain = configEntry[1]
    // Fix local rpc urls
    config.rpcEndpoints = config.rpcEndpoints.map((rpc) => {
        let { url } = rpc

        // Config contains references to local docker environment (10.200.10.1).
        // Use formatConfigUrl to make sure we are compatible with other docker hosts as well.
        if (url.includes('10.200.10.1')) {
            // Leave only port
            url = url.replace('http://10.200.10.1', '')
            url = formatConfigUrl(url)
        }

        return {
            url,
        }
    })
    return config
}
export const getConfigForChainByName = (chainName: string): Chain => {
    const configEntry = Object.entries(chainConfigs).find((c) => c[0] === chainName)

    if (configEntry == null) {
        throw new Error(`Could not find config for chain with name ${chainName}`)
    }

    const config: Chain = configEntry[1]
    return getConfigForChain(config.id)
}

const getConfig = (): Config => {
    const mainChainId = getMainChainId()
    return {
        metamask: {
            // local development values
            // Note: rpcUrls need to use HTTPS urls, otherwise adding the chain will fail
            [mainChainId]: {
                getParams: () => ({
                    chainName: 'Mainchain (dev)',
                    rpcUrls: defaultChainConfig
                        .getRPCEndpointsByProtocol(RPCProtocol.HTTP)
                        .map((endpoint) => endpoint.url),
                    blockExplorerUrls: [],
                    nativeCurrency: {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18,
                    },
                }),
            },
            /*[defaultChainConfig.id]: {
                getParams: () => ({
                    chainName: 'Streams chain (dev)',
                    rpcUrls: defaultChainConfig.getRPCEndpointsByProtocol(RPCProtocol.HTTP).map(endpoint => endpoint.url),
                    blockExplorerUrls: [],
                    nativeCurrency: {
                        name: 'xDAI',
                        symbol: 'xDAI',
                        decimals: 18,
                    },
                }),
            },*/
            // Real chain values
            // Note: urls are added to user's Metamask, do not use private RPC urls here
            '1': {
                getParams: () => {
                    throw new Error('Mainnet can not be added!')
                },
            },
            '100': {
                getParams: () => ({
                    chainName: 'Gnosis',
                    rpcUrls: ['https://rpc.gnosischain.com/'],
                    blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
                    nativeCurrency: {
                        name: 'xDAI',
                        symbol: 'xDAI',
                        decimals: 18,
                    },
                }),
            },
            '137': {
                getParams: () => ({
                    chainName: 'Polygon',
                    rpcUrls: ['https://polygon-rpc.com/'],
                    blockExplorerUrls: ['https://polygonscan.com/'],
                    nativeCurrency: {
                        name: 'MATIC',
                        symbol: 'MATIC',
                        decimals: 18,
                    },
                }),
            },
        },
    }
}

export default getConfig
