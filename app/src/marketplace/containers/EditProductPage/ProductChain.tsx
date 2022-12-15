import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import ChainSelector from '$shared/components/ChainSelector'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import { getApiStringFromChainId, getChainIdFromApiString } from '$shared/utils/chains'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import { projectTypes } from '$mp/utils/constants'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { getChainOptions } from './projectChain.utils'

const Section = styled.section`
    background: none;
`
type Props = {
    disabled?: boolean
}

const DEFAULT_CHAIN_ID = 137

const ProductChain = ({ disabled }: Props) => {
    const { state: product } = useEditableState()
    const { updateChain } = useEditableProductActions()
    const { marketplaceChains, dataunionChains } = getCoreConfig()
    const productType = product.type
    const productChain = product.chain
    const chainOptions = useMemo(() => {
        let options = []

        if (productType === projectTypes.DATAUNION) {
            options = getChainOptions(dataunionChains)
        } else {
            options = getChainOptions(marketplaceChains)
        }

        return options
    }, [productType, marketplaceChains, dataunionChains])
    // This is kind of a ugly hack but it's needed because API will return
    // ETHEREUM as default chain for new products and we don't support it anymore.
    useEffect(() => {
        const matchedOption = chainOptions.find((o) => o.id === getChainIdFromApiString(productChain))

        if (!productChain || matchedOption == null) {
            updateChain(getApiStringFromChainId(DEFAULT_CHAIN_ID))
        }
    }, [productChain, updateChain, chainOptions])
    return (
        <Section id="chain">
            <div>
                <h1>Select a chain</h1>
                <p>Please select a chain</p>
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
