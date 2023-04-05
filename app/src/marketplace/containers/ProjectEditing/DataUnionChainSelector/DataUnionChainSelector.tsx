import React, { FunctionComponent, useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { Chain } from '@streamr/config'
import { REGULAR } from '$shared/utils/styled'
import getCoreConfig from '$app/src/getters/getCoreConfig'
import {
    DataUnionChainSelectorContext,
    DataUnionChainSelectorContextProvider
} from '$mp/containers/ProjectEditing/DataUnionChainSelector/DataUnionChainSelectorContext'
import { getConfigForChainByName } from '$shared/web3/config'
import { DataUnionChainOption } from '$mp/containers/ProjectEditing/DataUnionChainSelector/DataUnionChainOption'
import { Address } from '$shared/types/web3-types'
import { useEditableProjectActions } from '$mp/containers/ProductController/useEditableProjectActions'

const getChainOptions = (chains: Array<string>): Chain[] =>
    chains.map((c) => getConfigForChainByName(c))

const DUChainSelector: FunctionComponent<{editMode: boolean}> = ({editMode}) => {
    const [currentlySelectedIndex, setCurrentlySelectedIndex] = useContext(DataUnionChainSelectorContext)
    const { dataunionChains } = getCoreConfig()
    const chainOptions: Chain[] = useMemo(() => {
        return getChainOptions(dataunionChains)
    }, [dataunionChains])
    const {updateDataUnionChainId, updateExistingDUAddress, updateSalePoints, updateIsDeployingNewDU } = useEditableProjectActions()

    const handleDataUnionOptionChange = useCallback((
        index: number,
        chain: Chain,
        deployNewDU: boolean,
        existingDUAddress?: Address
    ) => {
        if (currentlySelectedIndex !== index) {
            setCurrentlySelectedIndex(index)
        }
        if (!editMode) {
            updateIsDeployingNewDU(deployNewDU)
        }
        updateDataUnionChainId(chain.id)
        updateSalePoints({[chain.name]: {
            chainId: chain.id,
            timeUnit: undefined,
            beneficiaryAddress: undefined,
            price: undefined,
            pricingTokenAddress: undefined,
            pricePerSecond: undefined
        }})
        updateExistingDUAddress(deployNewDU ? undefined : existingDUAddress)
    }, [
        currentlySelectedIndex,
        editMode,
        setCurrentlySelectedIndex,
        updateDataUnionChainId,
        updateExistingDUAddress,
        updateIsDeployingNewDU,
        updateSalePoints
    ])

    return <Container>
        <Heading>Select chain</Heading>
        <SubHeading>Select the chain for your Data Union.</SubHeading>
        {chainOptions && chainOptions.length && chainOptions.map((chain, index) => {
            return <DataUnionChainOption
                key={index}
                index={index}
                chain={chain}
                onChange={(chainSelection) => {
                    handleDataUnionOptionChange(index, chain, chainSelection.deployNewDU, chainSelection.existingDUAddress)
                }}
            />
        })}
    </Container>
}

export const DataUnionChainSelector: FunctionComponent<{editMode: boolean}> = ({editMode}) => {
    return <DataUnionChainSelectorContextProvider>
        <DUChainSelector editMode={editMode}/>
    </DataUnionChainSelectorContextProvider>
}

const Container = styled.div`
  max-width: 728px;
`

const Heading = styled.p`
  color: black;
  font-weight: ${REGULAR};
  font-size: 34px;
  margin-bottom: 44px;
`

const SubHeading = styled.p`
  font-size: 16px;
  margin-bottom: 24px;
  color: black;
`
