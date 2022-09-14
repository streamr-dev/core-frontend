// @flow

import type { Address } from '$shared/flowtype/web3-types'

const BASE_URL = 'https://streamr-public.s3.amazonaws.com/truswallet-assets/blockchains'

// Got from: https://api.coingecko.com/api/v3/asset_platforms
const chainIdToNetworkMapping = {
    '1': 'ethereum',
    '100': 'xdai',
    '137': 'polygon',
    '8995': 'ethereum',
}

export const getTokenLogoUrl = (tokenContractAddress: Address, chainId: number) => {
    const network = chainIdToNetworkMapping[chainId.toString()]

    if (network == null) {
        throw new Error(`Could not map chainId to network: ${chainId}`)
    }

    const url = `${BASE_URL}/${network}/assets/${tokenContractAddress}/logo.png`
    return url
}
