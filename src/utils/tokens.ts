import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { getERC20TokenContract } from '~/getters'
import { getQueryClient } from '~/utils'
import { getPublicProvider } from '~/utils/providers'

export interface TokenInfo {
    decimals: bigint
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

            const provider = await getPublicProvider(chainId)

            const contact = getERC20TokenContract({
                tokenAddress,
                provider,
            })

            try {
                return {
                    decimals: await contact.decimals(),
                    name: await contact.name(),
                    symbol: await contact.symbol(),
                }
            } catch (e) {
                console.warn(`Failed to fetch token info for ${tokenAddress}`, e)
            }

            return null
        },
        staleTime: Infinity,
        gcTime: Infinity,
    } satisfies UseQueryOptions
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
