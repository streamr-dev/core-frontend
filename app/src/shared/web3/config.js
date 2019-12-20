// @flow

import marketplaceAbi from './abis/marketplace'
import tokenAbi from './abis/token'
import uniswapAdaptorAbi from './abis/uniswapAdaptor'
import communityProductMetadata from './contracts/communityProduct'

import type { SmartContractConfig, SmartContractMetadata } from '$shared/flowtype/web3-types'

type Config = {
    networkId: string,
    publicNodeAddress: string,
    websocketAddress: string,
    transactionConfirmationBlocks: number,
    marketplace: SmartContractConfig,
    dataToken: SmartContractConfig,
    daiToken: SmartContractConfig,
    communityProduct: SmartContractMetadata,
    uniswapAdaptor: SmartContractConfig,
}

const getConfig = (): Config => ({
    networkId: process.env.WEB3_REQUIRED_NETWORK_ID || '',
    publicNodeAddress: process.env.WEB3_PUBLIC_HTTP_PROVIDER || '',
    websocketAddress: process.env.WEB3_PUBLIC_WS_PROVIDER || '',
    transactionConfirmationBlocks: parseInt(process.env.WEB3_TRANSACTION_CONFIRMATION_BLOCKS, 10) || 24,
    marketplace: {
        abi: marketplaceAbi,
        address: process.env.MARKETPLACE_CONTRACT_ADDRESS || '',
    },
    dataToken: {
        abi: tokenAbi,
        address: process.env.DATA_TOKEN_CONTRACT_ADDRESS || '',
    },
    daiToken: {
        abi: tokenAbi,
        address: process.env.DAI_TOKEN_CONTRACT_ADDRESS || '',
    },
    communityProduct: {
        abi: communityProductMetadata.abi,
        bytecode: communityProductMetadata.bytecode,
    },
    uniswapAdaptor: {
        abi: uniswapAdaptorAbi,
        address: process.env.UNISWAP_ADAPTOR_CONTRACT_ADDRESS || '',
    },
})

export default getConfig
