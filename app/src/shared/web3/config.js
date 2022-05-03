// @flow

import { Chains } from '@streamr/config'
import getMainChainId from '$app/src/getters/getMainChainId'
import getClientConfig from '$app/src/getters/getClientConfig'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import tokenAbi from './abis/token'
import dataUnionAbi from './abis/dataunion'
import dataUnionSidechainAbi from './abis/dataunionSidechain'

type MainnetConfig = {
    chainId: string,
    rpcUrl: string,
    dataUnionAbi: string,
    transactionConfirmationBlocks: number,
}

type DataUnionChainConfig = {
    chainId: string,
    rpcUrl: string,
    dataUnionAbi: string,
}

type Config = {
    mainnet: MainnetConfig,
    dataunionsChain: DataUnionChainConfig,
}

let chainConfigs = []
if (process.env.NODE_ENV === 'production') {
    chainConfigs = Chains.load('production')
} else {
    // Use development for tests too
    chainConfigs = Chains.load('development')
}

export const getConfigForChain = (chainId: number) => {
    if (chainId == null) {
        throw new Error('ChainId must be provided!')
    }

    // $FlowFixMe: Object.entries loses type information
    const configEntry = Object.entries(chainConfigs).find((c) => c[1].id.toString() === chainId.toString())

    if (configEntry == null) {
        throw new Error(`Could not find config for chainId ${chainId}`)
    }

    const config: any = configEntry[1]
    return config
}

const getConfig = (): Config => {
    const { tokenAddress, dataUnionChainRPCs, mainChainRPCs, streamRegistryChainRPCs } = getClientConfig()

    // eslint-disable-next-line max-len
    const { web3TransactionConfirmationBlocks } = getCoreConfig()

    const mainChainId = getMainChainId()

    return {
        mainnet: {
            chainId: mainChainId,
            rpcUrl: mainChainRPCs.rpcs[0].url,
            transactionConfirmationBlocks: web3TransactionConfirmationBlocks || 24,
            dataToken: {
                abi: tokenAbi,
                address: tokenAddress,
            },
            dataUnionAbi,
        },
        dataunionsChain: {
            chainId: dataUnionChainRPCs.chainId,
            rpcUrl: dataUnionChainRPCs.rpcs[0].url,
            dataUnionAbi: dataUnionSidechainAbi,
        },
        metamask: {
            // local development values
            // Note: rpcUrls need to use HTTPS urls, otherwise adding the chain will fail
            [mainChainId]: {
                getParams: () => ({
                    chainName: 'Mainchain (dev)',
                    rpcUrls: [mainChainRPCs.rpcs[0].url],
                    nativeCurrency: {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18,
                    },
                }),
            },
            [dataUnionChainRPCs.chainId]: {
                getParams: () => ({
                    chainName: 'Dataunions chain (dev)',
                    rpcUrls: [dataUnionChainRPCs.rpcs[0].url],
                    nativeCurrency: {
                        name: 'xDAI',
                        symbol: 'xDAI',
                        decimals: 18,
                    },
                }),
            },
            [streamRegistryChainRPCs.chainId]: {
                getParams: () => ({
                    chainName: 'Streams chain (dev)',
                    rpcUrls: [streamRegistryChainRPCs.rpcs[0].url],
                    nativeCurrency: {
                        name: 'xDAI',
                        symbol: 'xDAI',
                        decimals: 18,
                    },
                }),
            },
            // Real chain values
            // Note: urls are added to user's Metamask, do not use private RPC urls here
            '1': {
                getParams: () => {
                    throw new Error('Mainnet can not be added!')
                },
            },
            '100': {
                getParams: () => ({
                    chainName: 'xDAI',
                    rpcUrls: ['https://rpc.xdaichain.com/'],
                    blockExplorerUrls: ['https://blockscout.com/poa/xdai'],
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
