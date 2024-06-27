import React from 'react'
import { formatPrice } from '~/marketplace/utils/price'
import { contractCurrencies as currencies } from '~/shared/utils/constants'
import { TimeUnit } from '~/shared/utils/timeUnit'
import { useTokenInfo } from '~/utils/tokens'

interface Options {
    amount?: bigint
    pricingTokenAddress?: string
    chainId: number
    timeUnit: TimeUnit
}

export default function FormattedPaymentRate({
    amount = 0n,
    pricingTokenAddress,
    chainId,
    timeUnit,
}: Options) {
    const { symbol = currencies.DATA, decimals = 18n } =
        useTokenInfo(pricingTokenAddress, chainId) || {}

    return (
        <>{formatPrice(amount, currencies.PRODUCT_DEFINED, decimals, timeUnit, symbol)}</>
    )
}
