// @flow

import type { SmartContractConfig } from '$shared/flowtype/web3-types'
import getMainChainId from '$app/src/getters/getMainChainId'
import getClientConfig from '$app/src/getters/getClientConfig'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import marketplaceAbi from './abis/marketplace'
import tokenAbi from './abis/token'
import uniswapAdaptorAbi from './abis/uniswapAdaptor'
import dataUnionAbi from './abis/dataunion'
import dataUnionSidechainAbi from './abis/dataunionSidechain'

type MainnetConfig = {
    chainId: string,
    rpcUrl: string,
    marketplace: SmartContractConfig,
    dataToken: SmartContractConfig,
    daiToken: SmartContractConfig,
    uniswapAdaptor: SmartContractConfig,
    dataUnionAbi: string,
    transactionConfirmationBlocks: number,
}

type DataUnionChainConfig = {
    chainId: string,
    rpcUrl: string,
    dataUnionAbi: string,
}

type SidechainConfig = {
    chainId: string,
    rpcUrl: string,
}

type Config = {
    mainnet: MainnetConfig,
    dataunionsChain: DataUnionChainConfig,
    streamsChain: SidechainConfig,
}

const getConfig = (): Config => {
    const { tokenAddress, dataUnionChainRPCs, mainChainRPCs, streamRegistryChainRPCs } = getClientConfig()

    // eslint-disable-next-line max-len
    const { daiTokenContractAddress: DAI, marketplaceContractAddress, uniswapAdaptorContractAddress, web3TransactionConfirmationBlocks } = getCoreConfig()

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
            daiToken: {
                abi: tokenAbi,
                address: DAI,
            },
            marketplace: {
                abi: marketplaceAbi,
                address: marketplaceContractAddress,
            },
            uniswapAdaptor: {
                abi: uniswapAdaptorAbi,
                address: uniswapAdaptorContractAddress,
            },
            dataUnionAbi,
        },
        dataunionsChain: {
            chainId: dataUnionChainRPCs.chainId,
            rpcUrl: dataUnionChainRPCs.rpcs[0].url,
            dataUnionAbi: dataUnionSidechainAbi,
        },
        streamsChain: {
            chainId: streamRegistryChainRPCs.chainId,
            rpcUrl: streamRegistryChainRPCs.rpcs[0].url,
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
                    chainName: 'Gnosis Chain',
                    rpcUrls: ['https://rpc.gnosischain.com'],
                    blockExplorerUrls: ['https://blockscout.com/xdai/mainnet/'],
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
