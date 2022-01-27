// @flow

import type { SmartContractConfig } from '$shared/flowtype/web3-types'
import getDataTokenAddress from '$app/src/getters/getDataTokenAddress'
import getMainChainConfig from '$app/src/getters/getMainChainConfig'
import getMainChainId from '$app/src/getters/getMainChainId'
import getSideChainConfig from '$app/src/getters/getSideChainConfig'
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

type SidechainConfig = {
    chainId: string,
    rpcUrl: string,
    dataUnionAbi: string,
}

type Config = {
    mainnet: MainnetConfig,
    sidechain: SidechainConfig,
}

const getConfig = (): Config => {
    const mainChainConfig = getMainChainConfig()

    const sideChainConfig = getSideChainConfig()

    const mainChainId = getMainChainId()

    return {
        mainnet: {
            chainId: mainChainId,
            rpcUrl: mainChainConfig.url,
            transactionConfirmationBlocks: parseInt(process.env.WEB3_TRANSACTION_CONFIRMATION_BLOCKS, 10) || 24,
            dataToken: {
                abi: tokenAbi,
                address: getDataTokenAddress(),
            },
            daiToken: {
                abi: tokenAbi,
                address: process.env.DAI_TOKEN_CONTRACT_ADDRESS || '',
            },
            marketplace: {
                abi: marketplaceAbi,
                address: process.env.MARKETPLACE_CONTRACT_ADDRESS || '',
            },
            uniswapAdaptor: {
                abi: uniswapAdaptorAbi,
                address: process.env.UNISWAP_ADAPTOR_CONTRACT_ADDRESS || '',
            },
            dataUnionAbi,
        },
        sidechain: {
            chainId: sideChainConfig.chainId,
            rpcUrl: sideChainConfig.url,
            dataUnionAbi: dataUnionSidechainAbi,
        },
        metamask: {
            // local development values
            // Note: rpcUrls need to use HTTPS urls, otherwise adding the chain will fail
            [mainChainId]: {
                getParams: () => ({
                    chainName: 'Mainchain (dev)',
                    rpcUrls: [mainChainConfig.url || ''],
                    nativeCurrency: {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18,
                    },
                }),
            },
            [sideChainConfig.chainId]: {
                getParams: () => ({
                    chainName: 'Sidechain (dev)',
                    rpcUrls: [sideChainConfig.url || ''],
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
