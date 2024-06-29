import { useQuery } from '@tanstack/react-query'
import { getERC20TokenContract } from '~/getters'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'
import { getQueryClient } from '.'

export interface TokenInfo {
    decimals: number
    name: string
    symbol: string
}

export async function getTokenInfo(
    tokenAddress: string | undefined,
    chainId: number | undefined,
): Promise<TokenInfo> {
    return getQueryClient().fetchQuery(tokenInfoQueryParams(chainId, tokenAddress))
}

export function useTokenInfo(
    tokenAddress: string | undefined,
    chainId: number | undefined,
) {
    return useQuery(tokenInfoQueryParams(chainId, tokenAddress)).data
}

function tokenInfoQueryParams(
    chainId: number | undefined,
    tokenAddress: string | undefined,
) {
    return {
        queryKey: ['tokenInfo', chainId, tokenAddress],
        queryFn: async () => {
            if (chainId == null || !tokenAddress) {
                return null
            }

            const contact = getERC20TokenContract({
                tokenAddress,
                provider: getPublicWeb3Provider(chainId),
            })

            const result = {
                decimals: Number(await contact.decimals()),
                name: await contact.name(),
                symbol: await contact.symbol(),
            }

            return result
        },
        staleTime: Infinity,
        cacheTime: Infinity,
    }
}

export function getCachedTokenInfo(
    tokenAddress: string | undefined,
    chainId: number | undefined,
) {
    if (!tokenAddress || chainId == null) {
        return null
    }

    return getQueryClient().getQueryData(
        tokenInfoQueryParams(chainId, tokenAddress).queryKey,
    ) as TokenInfo | null | undefined
}
