import { useQuery } from '@tanstack/react-query'
import { getERC20TokenContract } from '~/getters'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'
import { getQueryClient } from '.'

export interface TokenInfo {
    decimals: number
    name: string
    symbol: string
}

export async function getTokenInfo(tokenAddress: string, chainId: number) {
    const tokenInfo = await getQueryClient().fetchQuery(
        tokenInfoQueryParams(chainId, tokenAddress),
    )

    if (!tokenInfo || !tokenInfo.symbol) {
        throw new Error('Not an ERC-20 token')
    }

    return tokenInfo
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

            return {
                decimals: Number(await contact.decimals()),
                name: await contact.name(),
                symbol: await contact.symbol(),
            }
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

    return getQueryClient().getQueryData<TokenInfo>(
        tokenInfoQueryParams(chainId, tokenAddress).queryKey,
    )
}
