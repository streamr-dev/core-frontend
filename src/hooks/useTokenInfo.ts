import { useEffect, useState } from 'react'
import { getERC20TokenContract } from '~/getters'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'

export interface TokenInfo {
    symbol: string
    decimals: number
    name: string
}

function entryKey(tokenAddress: string, chainId: number) {
    return `${chainId}-${tokenAddress}`
}

const tokenInfoCache: Record<string, TokenInfo | null | Promise<TokenInfo> | undefined> =
    {}

export async function getTokenInfo(
    tokenAddress: string,
    chainId: number,
): Promise<TokenInfo> {
    const key = entryKey(tokenAddress, chainId)

    const current = tokenInfoCache[key]

    if (current === null) {
        throw new Error('Not an ERC-20 token')
    }

    if (typeof current === 'undefined') {
        const contract = getERC20TokenContract({
            tokenAddress,
            provider: getPublicWeb3Provider(chainId),
        })

        const promise = new Promise<TokenInfo>((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const symbol = await contract.symbol()

                    if (!symbol) {
                        throw new Error('Not an ERC-20 token')
                    }

                    const name = await contract.name()

                    const decimals = await contract.decimals()

                    resolve({
                        decimals,
                        name,
                        symbol,
                    })
                } catch (e) {
                    reject(e)
                }
            })
        })

        tokenInfoCache[key] = promise

        setTimeout(async () => {
            let next: TokenInfo | null = null

            try {
                next = await promise
            } catch (e) {
                /**
                 * If we get a rejection from the above promise we simply
                 * cache `null`. Not the bestest of ways, but we can
                 * improve as we go forward.
                 */
            }

            tokenInfoCache[key] = next
        })

        return promise
    }

    return current
}

export function getCachedTokenInfo(
    tokenAddress: string | undefined,
    chainId: number | undefined,
): TokenInfo | null | undefined {
    const key =
        tokenAddress && typeof chainId !== 'undefined'
            ? entryKey(tokenAddress, chainId)
            : null

    return key
        ? tokenInfoCache[key] instanceof Promise
            ? undefined
            : (tokenInfoCache[key] as TokenInfo | null | undefined)
        : null
}

/**
 * A hook that fetches and returns a `TokenInfo` object for a given pair of token address and chain id.
 * @param tokenAddress Address of the ERC-20 token contract.
 * @param chainId Chain/network id.
 * @returns nullish value or a `TokenInfo` object.
 * - `null` if the info has been fetched and the result indicated it's not an ERC-20 token,
 * - `undefined` if the info hasn't been fetched yet (or is being fetched), and
 * - `TokenInfo` object otherwise.
 */
export default function useTokenInfo(
    tokenAddress: string | undefined,
    chainId: number | undefined,
): TokenInfo | null | undefined {
    const [tokenInfo, setTokenInfo] = useState(getCachedTokenInfo(tokenAddress, chainId))

    useEffect(() => {
        setTokenInfo(getCachedTokenInfo(tokenAddress, chainId))
    }, [tokenAddress, chainId])

    /**
     * Undefined token info causes a fetch *attempt*. Since we cache either the values
     * or their pending promises there's no redundant loading.
     */
    const shouldFetch = typeof tokenInfo === 'undefined'

    useEffect(() => {
        let mounted = true

        let result: TokenInfo | null = null

        if (shouldFetch) {
            setTimeout(async () => {
                try {
                    if (!tokenAddress) {
                        throw new Error('Missing token address')
                    }

                    if (typeof chainId === 'undefined') {
                        throw new Error('Missing chain id')
                    }

                    result = await getTokenInfo(tokenAddress, chainId)
                } catch (e) {
                    console.warn(
                        `Failed to load token information for ${tokenAddress}`,
                        e,
                    )
                }

                if (mounted) {
                    setTokenInfo(result)
                }
            })
        }

        return () => {
            mounted = false
        }
    }, [shouldFetch, tokenAddress, chainId])

    return tokenInfo
}
