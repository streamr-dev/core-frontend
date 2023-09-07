import React, { FC, useMemo } from 'react'
import { Chain } from '~/shared/types/web3-types'
import getCoreConfig from '~/getters/getCoreConfig'
import { getConfigForChainByName } from '~/shared/web3/config'
import { SalePoint } from '~/shared/types'
import SalePointOption, { OptionProps, PaidOption } from './SalePointOption'
import { getEmptySalePoint } from '~/shared/stores/projectEditor'

export default function SalePointSelector({
    salePoints = {},
    onSalePointChange,
    renderer = PaidOption,
}: {
    salePoints?: Record<number, SalePoint | undefined>
    onSalePointChange?: (value: SalePoint) => void
    renderer?: FC<OptionProps>
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
                    onSalePointChange={onSalePointChange}
                    renderer={renderer}
                    salePoint={salePoints[chainName] || getEmptySalePoint(chainId)}
                />
            ))}
        </>
    )
}
