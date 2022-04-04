// @flow

import React from 'react'
import styled from 'styled-components'

import ChainSelector from '$shared/components/ChainSelector'
import NetworkIcon from '$shared/components/NetworkIcon'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import useEditableProductActions from '../ProductController/useEditableProductActions'

const Section = styled.section`
    background: none;
`

type Props = {
    disabled?: boolean,
}

const chainOptions = [{
    id: 1,
    name: 'Ethereum',
    icon: <NetworkIcon chainId={1} />,
}, {
    id: 100,
    name: 'Gnosis Chain',
    icon: <NetworkIcon chainId={100} />,
}, {
    id: 137,
    name: 'Polygon',
    icon: <NetworkIcon chainId={137} />,
}]

// Match case with API-defined enum
const apiChainMapping = {
    ETHEREUM: 1,
    XDAI: 100,
    POLYGON: 137,
    BSC: 56,
    AVALANCHE: 43114,
}

const mapFromApi = (name: string) => {
    const found = Object.entries(apiChainMapping).find((val) => val[0].toLowerCase() === name.toLowerCase())
    if (found) {
        return found[1]
    }
    throw Error(`Unknown chain name ${name}`)
}

const mapToApi = (id: number) => {
    const found = Object.entries(apiChainMapping).find((val) => val[1] === id)
    if (found) {
        return found[0]
    }
    throw Error(`Unknown chain id ${id}`)
}

const ProductChain = ({ disabled }: Props) => {
    const { state: product } = useEditableState()
    const { updateChain } = useEditableProductActions()

    return (
        <Section id="chain">
            <div>
                <h1>Select a chain</h1>
                <p>
                    Please select a chain
                </p>
                <ChainSelector
                    chains={chainOptions}
                    selectedChainId={mapFromApi(product.chain)}
                    onChainSelected={(nextChainId) => updateChain(mapToApi(nextChainId))}
                    disabled={disabled}
                />
            </div>
        </Section>
    )
}

export default ProductChain
