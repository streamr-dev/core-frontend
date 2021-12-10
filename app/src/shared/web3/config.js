// @flow

import type { SmartContractConfig } from '$shared/flowtype/web3-types'
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

const getConfig = (): Config => ({
    mainnet: {
        chainId: process.env.MAINNET_CHAIN_ID || '',
        rpcUrl: process.env.MAINNET_HTTP_PROVIDER || '',
        transactionConfirmationBlocks: parseInt(process.env.WEB3_TRANSACTION_CONFIRMATION_BLOCKS, 10) || 24,
        dataToken: {
            abi: tokenAbi,
            address: process.env.DATA_TOKEN_CONTRACT_ADDRESS || '',
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
        chainId: process.env.SIDECHAIN_CHAIN_ID || '',
        rpcUrl: process.env.SIDECHAIN_HTTP_PROVIDER || '',
        dataUnionAbi: dataUnionSidechainAbi,
    },
    metamask: {
        // local development values
        // Note: rpcUrls need to use HTTPS urls, otherwise adding the chain will fail
        [((process.env.MAINNET_CHAIN_ID || '8995'): string)]: {
            getParams: () => ({
                chainName: 'Mainchain (dev)',
                rpcUrls: [process.env.MAINNET_HTTP_PROVIDER || ''],
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                },
            }),
        },
        [((process.env.SIDECHAIN_CHAIN_ID || '8997'): string)]: {
            getParams: () => ({
                chainName: 'Sidechain (dev)',
                rpcUrls: [process.env.SIDECHAIN_HTTP_PROVIDER || ''],
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
})

export default getConfig
