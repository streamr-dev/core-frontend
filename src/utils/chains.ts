import { config as configs } from '@streamr/config'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Chain } from '~/types'

function getPreferredChainName(chainName: string) {
    if (/amoy/i.test(chainName)) {
        return 'amoy'
    }

    return chainName.toLowerCase()
}

function getChainConfigWithFallback(chainName: string): Chain {
    try {
        return getChainConfig(chainName)
    } catch (_) {}

    return getChainConfig('polygon')
}

export function getCurrentChain() {
    return getChainConfigWithFallback(
        new URLSearchParams(window.location.search).get('chain') || 'polygon',
    )
}

export function getCurrentChainId() {
    return getCurrentChain().id
}

export function useCurrentChain() {
    const chainName = useSearchParams()[0].get('chain') || 'polygon'

    return useMemo(() => getChainConfigWithFallback(chainName), [chainName])
}

export function useCurrentChainId() {
    return useCurrentChain().id
}

export function useCurrentChainSymbolicName() {
    const chainId = useCurrentChainId()

    return useMemo(() => getSymbolicChainName(chainId), [chainId])
}

let chainEntriesByIdOrName:
    | undefined
    | Partial<Record<string | number, { symbolicName: string; config: Chain }>> =
    undefined

function getChainEntry(chainIdOrName: string | number) {
    if (!chainEntriesByIdOrName) {
        chainEntriesByIdOrName = {}

        for (const [rawSymbolicName, config] of Object.entries(configs)) {
            const symbolicName = getPreferredChainName(rawSymbolicName)

            chainEntriesByIdOrName[config.id] = {
                symbolicName,
                config,
            }

            chainEntriesByIdOrName[symbolicName] = {
                symbolicName,
                config,
            }
        }

        console.log(chainEntriesByIdOrName)
    }

    const entry =
        chainEntriesByIdOrName[
            typeof chainIdOrName === 'string'
                ? getPreferredChainName(chainIdOrName)
                : chainIdOrName
        ]

    if (!entry) {
        throw new Error(
            `Could not find config for "${chainIdOrName}" (${
                typeof chainIdOrName === 'string' ? 'chain name' : 'chain id'
            })`,
        )
    }

    return entry
}

export function getChainConfig(chainIdOrSymbolicName: string | number): Chain {
    return getChainEntry(chainIdOrSymbolicName).config
}

export function getSymbolicChainName(chainId: number) {
    return getChainEntry(chainId).symbolicName
}
