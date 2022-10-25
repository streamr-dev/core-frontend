import React, { useCallback, useMemo, ReactElement } from 'react'
import styled from 'styled-components'
import Select from '$ui/Select'
type Chain = {
    id: number
    name: string
    icon: ReactElement | null | undefined
}
type Props = {
    chains: Chain[]
    selectedChainId: number | null | undefined
    onChainSelected: (chain: Chain) => void
    disabled: boolean
}

const mapChainForSelect = (chain: Chain) => ({
    label: chain.name,
    value: chain.id,
    icon: chain.icon,
})

const UnstyledChainSelector = ({ chains, selectedChainId, onChainSelected: onChainSelectedProp, disabled }: Props) => {
    const onChainSelected = useCallback(
        (chainId) => {
            if (onChainSelectedProp && typeof onChainSelectedProp === 'function') {
                onChainSelectedProp(chainId)
            }
        },
        [onChainSelectedProp],
    )
    const activeChain = useMemo(() => {
        const chain = chains.find(({ id }) => id === selectedChainId)

        if (chain) {
            return mapChainForSelect(chain)
        }

        return undefined
    }, [chains, selectedChainId])
    const chainOptions = useMemo(() => chains.map(mapChainForSelect), [chains])
    return (
        <Select
            options={chainOptions}
            value={activeChain}
            onChange={({ value }) => onChainSelected(value)}
            disabled={disabled}
        />
    )
}

const ChainSelector = styled(UnstyledChainSelector)``
export default ChainSelector
