import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getConfigForChainByName, getSymbolicChainName } from '~/shared/web3/config'

function getConfigForChainByNameWithFallback(chainName: string) {
    try {
        return getConfigForChainByName(chainName)
    } catch (_) {}

    return getConfigForChainByName('polygon')
}

export function getCurrentChain() {
    return getConfigForChainByNameWithFallback(
        new URLSearchParams(window.location.search).get('chain') || 'polygon',
    )
}

export function getCurrentChainId() {
    return getCurrentChain().id
}

export function useCurrentChain() {
    const chainName = useSearchParams()[0].get('chain') || 'polygon'

    return useMemo(() => getConfigForChainByNameWithFallback(chainName), [chainName])
}

export function useCurrentChainId() {
    return useCurrentChain().id
}

export function useCurrentChainSymbolicName() {
    const chainId = useCurrentChainId()

    return useMemo(() => getSymbolicChainName(chainId), [chainId])
}
