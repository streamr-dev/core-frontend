// @flow

import React, { useEffect, useState } from 'react'
import BN from 'bignumber.js'
import type { TimeUnit } from '$shared/flowtype/common-types'
import { contractCurrencies as currencies } from '$shared/utils/constants'
import { formatPrice } from '$mp/utils/price'
import { getTokenInformation } from '$mp/utils/web3'
import useIsMounted from '$shared/hooks/useIsMounted'

type Props = {
    amount: BN,
    pricingTokenAddress: string,
    chainId: number,
    timeUnit: TimeUnit,
    className?: string,
}

const PaymentRate = (props: Props) => {
    const {
        amount,
        pricingTokenAddress,
        chainId,
        timeUnit,
        className,
    } = props
    const [currency, setCurrency] = useState(currencies.PRODUCT_DEFINED)
    const [symbol, setSymbol] = useState(currencies.DATA)
    const [decimals, setDecimals] = useState(BN(18))
    const isMounted = useIsMounted()

    useEffect(() => {
        const check = async () => {
            if (pricingTokenAddress != null) {
                const info = await getTokenInformation(pricingTokenAddress, chainId)
                if (isMounted() && info) {
                    setCurrency(currencies.PRODUCT_DEFINED)
                    setSymbol(info.symbol)
                    setDecimals(info.decimals)
                }
            }
        }
        check()
    }, [pricingTokenAddress, chainId, isMounted])

    return (
        <div className={className}>{formatPrice(amount, currency, decimals, timeUnit, symbol)}</div>
    )
}

export default PaymentRate
