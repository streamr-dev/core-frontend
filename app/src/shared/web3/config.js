// @flow

import marketplaceAbi from './abis/marketplace'
import marketplaceAbiOld from './abis/marketplace_old'
import tokenAbi from './abis/token'
import communityProductMetadata from './contracts/communityProduct'
import type { SmartContractConfig, SmartContractMetadata } from '$shared/flowtype/web3-types'

type Config = {
    networkId: string,
    publicNodeAddress: string,
    websocketAddress: string,
    transactionConfirmationBlocks: number,
    marketplace: SmartContractConfig,
    token: SmartContractConfig,
    communityProduct: SmartContractMetadata,
}

const MARKETPLACE_CONTRACT_ADDRESS = process.env.NEW_MP_CONTRACT ?
    process.env.MARKETPLACE_CONTRACT_ADDRESS
    : process.env.MARKETPLACE_CONTRACT_ADDRESS_OLD

const getConfig = (): Config => ({
    networkId: process.env.WEB3_REQUIRED_NETWORK_ID || '',
    publicNodeAddress: process.env.WEB3_PUBLIC_HTTP_PROVIDER || '',
    websocketAddress: process.env.WEB3_PUBLIC_WS_PROVIDER || '',
    transactionConfirmationBlocks: parseInt(process.env.WEB3_TRANSACTION_CONFIRMATION_BLOCKS, 10) || 24,
    marketplace: {
        abi: process.env.NEW_MP_CONTRACT ? marketplaceAbi : marketplaceAbiOld,
        address: MARKETPLACE_CONTRACT_ADDRESS || '',
    },
    token: {
        abi: tokenAbi,
        address: process.env.TOKEN_CONTRACT_ADDRESS || '',
    },
    communityProduct: {
        abi: communityProductMetadata.abi,
        bytecode: communityProductMetadata.bytecode,
    },
})

export default getConfig
