// @flow

import React, { useMemo } from 'react'
import styled from 'styled-components'

import ChainSelector from '$shared/components/ChainSelector'
import NetworkIcon from '$shared/components/NetworkIcon'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import { getChainIdFromApiString, getApiStringFromChainId } from '$shared/utils/chains'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import { productTypes } from '$mp/utils/constants'
import { getConfigForChainByName } from '$shared/web3/config'
import useEditableProductActions from '../ProductController/useEditableProductActions'

const Section = styled.section`
    background: none;
`

type Props = {
    disabled?: boolean,
}

// TODO: Would be nice to have this in @streamr/config package
const configChainNameMapping = {
    dev0: 'Docker mainchain',
    dev1: 'Docker sidechain',
    ethereum: 'Ethereum',
    gnosis: 'Gnosis Chain',
    binance: 'Binance Smart Chain',
    polygon: 'Polygon',
}

const getChainOptions = (chains: Array<string>) => (
    chains.map((c) => {
        const config = getConfigForChainByName(c)
        const chainId = config.id
        return {
            id: chainId,
            name: configChainNameMapping[c],
            icon: <NetworkIcon chainId={chainId} />,
        }
    })
)

const ProductChain = ({ disabled }: Props) => {
    const { state: product } = useEditableState()
    const { updateChain } = useEditableProductActions()
    const { marketplaceChains, dataunionChains } = getCoreConfig()
    const productType = product.type

    const chainOptions = useMemo(() => {
        let options = []
        if (productType === productTypes.DATAUNION) {
            options = getChainOptions(dataunionChains)
        } else {
            options = getChainOptions(marketplaceChains)
        }
        return options
    }, [productType, marketplaceChains, dataunionChains])

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
