import React, { useMemo } from 'react'
import { Chain } from '~/shared/types/web3-types'
import getCoreConfig from '~/getters/getCoreConfig'
import { getConfigForChainByName } from '~/shared/web3/config'
import { SalePoint } from '~/shared/types'
import SalePointOption from './SalePointOption'
import { getEmptySalePoint } from '~/shared/stores/projectEditor'

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
        <>
            {availableChains.map(({ id: chainId, name: chainName }) => (
                <SalePointOption
                    key={chainId}
                    salePoint={salePoints[chainName] || getEmptySalePoint(chainId)}
                    onSalePointChange={onSalePointChange}
                />
            ))}
        </>
    )
}
