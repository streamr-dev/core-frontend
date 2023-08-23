import React, {
    FunctionComponent,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react'
import styled from 'styled-components'
import { REGULAR } from '~/shared/utils/styled'
import getCoreConfig from '~/getters/getCoreConfig'
import { PricingData, SalePoint } from '~/marketplace/types/project-types'
import { getConfigForChainByName } from '~/shared/web3/config'
import { ProjectStateContext } from '~/marketplace/contexts/ProjectStateContext'
import { useEditableProjectActions } from '~/marketplace/containers/ProductController/useEditableProjectActions'
import { toBN } from '~/utils/bn'
import { Chain } from '~/shared/types/web3-types'
import { PricingOption } from './PricingOption'

type Props = {
    nonEditableSalePointChains: number[] // array of chain ids
}
export const SalePointSelector: FunctionComponent<Props> = ({
    nonEditableSalePointChains,
}) => {
    const { marketplaceChains } = getCoreConfig()
    const chains: Chain[] = useMemo(
        () => marketplaceChains.map((chainName) => getConfigForChainByName(chainName)),
        [marketplaceChains],
    )
    const { state: project } = useContext(ProjectStateContext)
    const { salePoints } = project
    const { updateSalePoints } = useEditableProjectActions()
    const [firstToggleDone, setFirstToggleDone] = useState<boolean>(false)

    const handleSalePointChange = useCallback(
        (chainName: string, newSalePoint: SalePoint | null) => {
            const chain = getConfigForChainByName(chainName)
            if (nonEditableSalePointChains.includes(chain.id)) {
                return
            }
            // handle removal of sale point
            if (!newSalePoint) {
                // case when we are creating a new project and the components emit changes on mounting
                if (!salePoints || !Object.values(salePoints || {}).length) {
                    return
                }
                const newSalePointsObject = { ...salePoints }
                delete newSalePointsObject[chainName]
                updateSalePoints(newSalePointsObject)
                return
            }
            // handle updates & adding a new sale point
            const newSalePointsObject = {
                ...(salePoints || {}),
                [chainName]: newSalePoint,
            }
            updateSalePoints(newSalePointsObject)
        },
        [nonEditableSalePointChains, salePoints, updateSalePoints],
    )

    const handleToggle = useCallback(
        (chainName: string, salePoint: SalePoint) => {
            if (
                !firstToggleDone &&
                (!salePoints || (salePoints && !Object.values(salePoints).length))
            ) {
                updateSalePoints({ [chainName]: salePoint })
                setFirstToggleDone(true)
            }
        },
        [firstToggleDone, salePoints, updateSalePoints],
    )

    return (
        <SalePointSelectorContainer>
            <Heading>Select chains</Heading>
            <SubHeading>
                Access to the project data can be purchased on the selected chains. You
                can set the payment token, price, and beneficiary address on each chain
                separately.
            </SubHeading>
            {chains?.map((chain, index) => {
                const salePoint = salePoints && salePoints[chain.name]
                const salePointData: PricingData = salePoint
                    ? {
                          tokenAddress: salePoint.pricingTokenAddress,
                          price: salePoint.price ? toBN(salePoint.price) : undefined,
                          timeUnit: salePoint.timeUnit,
                          pricePerSecond: salePoint.pricePerSecond
                              ? toBN(salePoint.pricePerSecond)
                              : undefined,
                          beneficiaryAddress: salePoint.beneficiaryAddress,
                      }
                    : null
                return (
                    <PricingOption
                        key={chain.id}
                        chain={chain}
                        onChange={handleSalePointChange}
                        pricingData={salePointData}
                        onToggle={handleToggle}
                        editingSelectionAndTokenDisabled={nonEditableSalePointChains.includes(
                            chain.id,
                        )}
                    />
                )
            })}
        </SalePointSelectorContainer>
    )
}

const SalePointSelectorContainer = styled.div`
    max-width: 728px;
`

const Heading = styled.p`
    color: black;
    font-weight: ${REGULAR};
    font-size: 20px;
    margin-bottom: 24px;
`

const SubHeading = styled.p`
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 16px;
    color: black;
`
