// @flow

import request from '$shared/utils/request'
import type { Address } from '$shared/flowtype/web3-types'

const BASE_URL = 'https://api.coingecko.com/api/v3'

// Got from: https://api.coingecko.com/api/v3/asset_platforms
const chainIdToNetworkMapping = {
    '100': 'xdai',
    '137': 'polygon-pos',
}

export const getUsdRate = async (tokenContractAddress: Address, chainId: number) => {
    const vsCurrency = 'usd' // https://api.coingecko.com/api/v3/simple/supported_vs_currencies
    let contractAddress = tokenContractAddress
    let network = chainIdToNetworkMapping[chainId.toString()]

    // Fallback to mainnet
    if (network == null) {
        network = 'ethereum'
        contractAddress = '0x8f693ca8D21b157107184d29D398A8D082b38b76'
        console.warn('CoinGecko: Fallback to mainnet DATA contract because network is unsupported')
    }

    const url = `${BASE_URL}/simple/token_price/${network}?contract_addresses=${contractAddress}&vs_currencies=${vsCurrency}`
    const result = await request({
        method: 'get',
        url,
    })
    const rate = result[contractAddress.toLowerCase()][vsCurrency.toLowerCase()] || 0
    return rate
}
