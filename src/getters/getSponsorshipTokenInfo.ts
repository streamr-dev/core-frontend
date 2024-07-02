import { getContractAddress } from '~/utils/contracts'
import { TokenInfo, getTokenInfo } from '~/utils/tokens'

export async function getSponsorshipTokenInfo(chainId: number): Promise<TokenInfo> {
    return getTokenInfo(getContractAddress('sponsorshipPaymentToken', chainId), chainId)
}
