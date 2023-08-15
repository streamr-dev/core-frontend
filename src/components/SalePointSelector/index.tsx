import React, { useMemo } from 'react'
import { Chain } from '@streamr/config'
import getCoreConfig from '~/getters/getCoreConfig'
import { getConfigForChainByName } from '~/shared/web3/config'
import { SalePoint } from '~/shared/types'
import { timeUnits } from '~/shared/utils/timeUnit'
import SalePointOption from './SalePointOption'
import styled from 'styled-components'
import { COLORS, REGULAR } from '~/shared/utils/styled'
import { getDataAddress } from '~/marketplace/utils/web3'

const initialSalePoint: SalePoint = {
    chainId: 1,
    beneficiaryAddress: '',
    pricePerSecond: '',
    timeUnit: timeUnits.day,
    price: '',
    pricingTokenAddress: '',
}

export default function SalePointSelector({
    salePoints = {},
    onSalePointsChange,
    selectedChainIds = {},
    onSelectedChainIdsChange,
}: {
    salePoints?: Record<number, SalePoint | undefined>
    onSalePointsChange?: (value: Record<number, SalePoint | undefined>) => void
    selectedChainIds?: Record<number, boolean | undefined>
    onSelectedChainIdsChange?: (value: Record<number, boolean | undefined>) => void
}) {
    const availableChains = useMemo<Chain[]>(
        () => getCoreConfig().marketplaceChains.map(getConfigForChainByName),
        [],
    )

    return (
        <Root>
            <h4>Select chains</h4>
            <p>
                Access to the project data can be purchased on the selected chains. You
                can set the payment token, price, and beneficiary address on each chain
                separately.
            </p>
            {availableChains.map(({ id: chainId }) => (
                <SalePointOption
                    key={chainId}
                    salePoint={
                        salePoints[chainId] || {
                            ...initialSalePoint,
                            chainId,
                            pricingTokenAddress: getDataAddress(chainId).toLowerCase(),
                        }
                    }
                    selected={selectedChainIds[chainId]}
                    onToggle={(_, selected) => {
                        onSelectedChainIdsChange?.({
                            ...selectedChainIds,
                            [chainId]: selected,
                        })
                    }}
                    onSalePointChange={(value) => {
                        onSalePointsChange?.({
                            ...salePoints,
                            [chainId]: value,
                        })
                    }}
                />
            ))}
        </Root>
    )
}

const Root = styled.div`
    color: ${COLORS.primary};
    max-width: 728px;

    h4 {
        font-weight: ${REGULAR};
        font-size: 20px;
        margin: 0;
    }

    h4 + p {
        font-size: 16px;
        margin: 16px 0 28px;
        line-height: 1.5em;
    }
`
