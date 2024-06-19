import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getConfigForChainByName, getSymbolicChainName } from '~/shared/web3/config'

export function useCurrentChain() {
    const chainName = useSearchParams()[0].get('chain') || 'polygon'

    return useMemo(() => {
        try {
            return getConfigForChainByName(chainName)
        } catch (_) {}

        return getConfigForChainByName('polygon')
    }, [chainName])
}

export function useCurrentChainId() {
    return useCurrentChain().id
}

export function useCurrentChainSymbolicName() {
    const chainId = useCurrentChainId()

    return useMemo(() => getSymbolicChainName(chainId), [chainId])
}
