import React, { useMemo } from 'react'
import { Chain } from '~/shared/types/web3-types'
import getCoreConfig from '~/getters/getCoreConfig'
import { getConfigForChainByName } from '~/shared/web3/config'
import { SalePoint } from '~/shared/types'
import { timeUnits } from '~/shared/utils/timeUnit'
import SalePointOption from './SalePointOption'
import { getDataAddress } from '~/marketplace/utils/web3'
import styled from 'styled-components'

const initialSalePoint: SalePoint = {
    beneficiaryAddress: '',
    chainId: 1,
    enabled: false,
    price: '',
    pricePerSecond: '',
    pricingTokenAddress: '',
    readOnly: false,
    timeUnit: timeUnits.day,
}

export default function SalePointSelector({
    salePoints = {},
    onSalePointChange,
}: {
    salePoints?: Record<number, SalePoint | undefined>
    onSalePointChange?: (value: SalePoint) => void
}) {
    const availableChains = useMemo<Chain[]>(
        () => getCoreConfig().marketplaceChains.map(getConfigForChainByName),
        [],
    )

    return (
        <Root>
            {availableChains.map(({ id: chainId, name: chainName }) => (
                <SalePointOption
                    key={chainId}
                    salePoint={
                        salePoints[chainName] || {
                            ...initialSalePoint,
                            chainId,
                            pricingTokenAddress: getDataAddress(chainId).toLowerCase(),
                        }
                    }
                    onSalePointChange={onSalePointChange}
                />
            ))}
        </Root>
    )
}

const Root = styled.div`
    max-width: 728px;
`
