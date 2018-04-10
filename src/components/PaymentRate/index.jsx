// @flow

import React from 'react'
import type { Currency, TimeUnit } from '../../flowtype/common-types'
import titleize from '../../utils/titleize'

type Props = {
    amount: number,
    currency: Currency,
    timeUnit: TimeUnit,
    className?: string,
    maxDigits?: number,
}

const formatAmount = (value: number, maxDigits: ?number) => {
    if (typeof maxDigits === 'number' && maxDigits >= 0) {
        return parseFloat(value.toFixed(maxDigits))
    }
    return value
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
        <div className={className}>{formatAmount(amount, maxDigits)} {currency} per {titleize(timeUnit)}</div>
    )
}

export default PaymentRate
