import React from 'react'
import { contractCurrencies as currencies } from '~/shared/utils/constants'
import { formatPrice } from '~/marketplace/utils/price'
import { TimeUnit } from '~/shared/utils/timeUnit'
import { BNish, toBN } from '~/utils/bn'
import { useTokenInfo } from '~/utils/tokens'

interface Options {
    amount?: BNish
    pricingTokenAddress?: string
    chainId: number
    timeUnit: TimeUnit
}

export default function FormattedPaymentRate({
    amount = 0,
    pricingTokenAddress,
    chainId,
    timeUnit,
}: Options) {
    const { symbol = currencies.DATA, decimals = 18 } =
        useTokenInfo(pricingTokenAddress, chainId) || {}

    return (
        <>
            {formatPrice(
                toBN(amount),
                currencies.PRODUCT_DEFINED,
                toBN(decimals),
                timeUnit,
                symbol,
            )}
        </>
    )
}
