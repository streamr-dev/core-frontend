import React, { FunctionComponent, useCallback, useContext, useMemo } from 'react'
import { Chain } from '@streamr/config'
import TokenSelector from '~/marketplace/containers/ProjectEditing/TokenSelector'
import { PricingData } from '~/marketplace/types/project-types'
import { ProjectStateContext } from '~/marketplace/contexts/ProjectStateContext'
import { getConfigForChain } from '~/shared/web3/config'
import { useEditableProjectActions } from '~/marketplace/containers/ProductController/useEditableProjectActions'

export const DataUnionTokenSelector: FunctionComponent<{ editMode: boolean }> = ({
    editMode,
}) => {
    const { state: project } = useContext(ProjectStateContext)
    const { updateSalePoints } = useEditableProjectActions()

    const chain = useMemo<Chain | undefined>(() => {
        if (!project.dataUnionChainId) {
            return undefined
        }
        return getConfigForChain(project.dataUnionChainId)
    }, [project.dataUnionChainId])

    const handleChange = useCallback(
        (pricingData: PricingData) => {
            if (chain && pricingData) {
                updateSalePoints({
                    [chain.name]: {
                        chainId: chain.id,
                        pricingTokenAddress: pricingData.tokenAddress,
                        price: pricingData.price || undefined,
                        pricePerSecond: pricingData.pricePerSecond || undefined,
                        timeUnit: pricingData.timeUnit,
                        beneficiaryAddress: undefined,
                    },
                })
            }
        },
        [chain, updateSalePoints],
    )

    const pricingData = useMemo(() => {
        const currentChainSalePoint =
            chain && project.salePoints && project.salePoints[chain.name]
        if (currentChainSalePoint) {
            const result: PricingData = {
                tokenAddress: currentChainSalePoint.pricingTokenAddress,
                price: currentChainSalePoint.price,
                timeUnit: currentChainSalePoint.timeUnit ?? undefined,
                pricePerSecond: currentChainSalePoint.pricePerSecond,
                beneficiaryAddress: undefined,
            }
            return result
        }

        return undefined
    }, [chain, project.salePoints])

    return (
        <TokenSelector
            disabled={!project.dataUnionChainId}
            onChange={handleChange}
            chain={chain}
            validationFieldName={`salePoints.${chain?.name ?? 'no_chain_available'}`}
            tokenChangeDisabled={editMode}
            value={pricingData}
        />
    )
}