import { getChainConfig } from '~/utils/chains'

const BASE_URL = 'https://streamr-public.s3.amazonaws.com/truswallet-assets/blockchains'

export const getTokenLogoUrl = (
    tokenContractAddress: string,
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
                return getChainConfig(chainId).name
        }
    })()

    /**
     * For more details see:
     * https://api.coingecko.com/api/v3/asset_platforms
     */
    return `${BASE_URL}/${network}/assets/${tokenContractAddress}/logo.png`
}
