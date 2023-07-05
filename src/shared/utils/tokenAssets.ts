import { Address } from '~/shared/types/web3-types'
const BASE_URL = 'https://streamr-public.s3.amazonaws.com/truswallet-assets/blockchains'
// Got from: https://api.coingecko.com/api/v3/asset_platforms
const chainIdToNetworkMap = new Map<number, string>([
    [1, 'ethereum'],
    [100, 'xdai'],
    [137, 'polygon'],
    [8995, 'ethereum'],
    [8997, 'ethereum'],
])
export const getTokenLogoUrl = (
    tokenContractAddress: Address,
    chainId: number,
): string => {
    const network = chainIdToNetworkMap.get(chainId)

    if (network == null) {
        throw new Error(`Could not map chainId to network: ${chainId}`)
    }
    return `${BASE_URL}/${network}/assets/${tokenContractAddress}/logo.png`
}
