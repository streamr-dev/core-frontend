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
    const { tokenAddress, dataUnionChainRPC, mainChainRPC, streamRegistryChainRPC } = getClientConfig()

    // eslint-disable-next-line max-len
    const { daiTokenContractAddress: DAI, marketplaceContractAddress, uniswapAdaptorContractAddress, web3TransactionConfirmationBlocks } = getCoreConfig()

    const mainChainId = getMainChainId()

    return {
        mainnet: {
            chainId: mainChainId,
            rpcUrl: mainChainRPC.url,
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
            chainId: dataUnionChainRPC.chainId,
            rpcUrl: dataUnionChainRPC.url,
            dataUnionAbi: dataUnionSidechainAbi,
        },
        streamsChain: {
            chainId: streamRegistryChainRPC.chainId,
            rpcUrl: streamRegistryChainRPC.url,
        },
        metamask: {
            // local development values
            // Note: rpcUrls need to use HTTPS urls, otherwise adding the chain will fail
            [mainChainId]: {
                getParams: () => ({
                    chainName: 'Mainchain (dev)',
                    rpcUrls: [mainChainRPC.url],
                    nativeCurrency: {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18,
                    },
                }),
            },
            [dataUnionChainRPC.chainId]: {
                getParams: () => ({
                    chainName: 'Dataunions chain (dev)',
                    rpcUrls: [dataUnionChainRPC.url],
                    nativeCurrency: {
                        name: 'xDAI',
                        symbol: 'xDAI',
                        decimals: 18,
                    },
                }),
            },
            [streamRegistryChainRPC.chainId]: {
                getParams: () => ({
                    chainName: 'Streams chain (dev)',
                    rpcUrls: [streamRegistryChainRPC.url],
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
        },
    }
}

export default getConfig
