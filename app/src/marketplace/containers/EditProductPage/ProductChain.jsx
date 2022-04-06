// @flow

import React from 'react'
import styled from 'styled-components'

import ChainSelector from '$shared/components/ChainSelector'
import NetworkIcon from '$shared/components/NetworkIcon'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import { getChainIdFromApiString, getApiStringFromChainId } from '$shared/utils/chains'
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
                    selectedChainId={getChainIdFromApiString(product.chain)}
                    onChainSelected={(nextChainId) => updateChain(getApiStringFromChainId(nextChainId))}
                    disabled={disabled}
                />
            </div>
        </Section>
    )
}

export default ProductChain
