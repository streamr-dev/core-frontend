// @flow

import React from 'react'
import type { Currency, TimeUnit } from '../../flowtype/common-types'
import { formatPrice } from '../../utils/price'

type Props = {
    amount: number,
    currency: Currency,
    timeUnit: TimeUnit,
    className?: string,
    maxDigits?: number,
}

const PaymentRate = (props: Props) => {
    const {
        amount,
        currency,
        timeUnit,
        className,
        maxDigits,
    } = props

    return (
        <div className={className}>{formatPrice(amount, currency, maxDigits, timeUnit)}</div>
    )
}

export default PaymentRate
