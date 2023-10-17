import { Address } from '~/shared/types/web3-types'
import { getConfigForChain } from '~/shared/web3/config'

const BASE_URL = 'https://streamr-public.s3.amazonaws.com/truswallet-assets/blockchains'

export const getTokenLogoUrl = (
    tokenContractAddress: Address,
    chainId: number,
): string => {
    const network = (() => {
        switch (chainId) {
            case 100:
                return 'xdai'
            case 8995:
            case 8996:
                return 'ethereum'
            default:
                return getConfigForChain(chainId).name
        }
    })()

    /**
     * For more details see:
     * https://api.coingecko.com/api/v3/asset_platforms
     */
    return `${BASE_URL}/${network}/assets/${tokenContractAddress}/logo.png`
}
