import {
    TokenInfo,
    getSponsorshipPaymentTokenAddress,
    getTokenInfo,
} from '~/utils/tokens'

export async function getSponsorshipTokenInfo(chainId: number): Promise<TokenInfo> {
    return getTokenInfo(getSponsorshipPaymentTokenAddress(chainId), chainId)
}
