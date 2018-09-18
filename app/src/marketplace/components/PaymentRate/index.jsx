// @flow

import React from 'react'
import BN from 'bignumber.js'
import type { Currency, TimeUnit } from '../../flowtype/common-types'
import { formatPrice } from '../../utils/price'

type Props = {
    amount: BN,
    currency: Currency,
    timeUnit: TimeUnit,
    className?: string,
}

const PaymentRate = (props: Props) => {
    const { amount,
        currency,
        timeUnit,
        className } = props

    return (
        <div className={className}>{formatPrice(amount, currency, timeUnit)}</div>
    )
}

export default PaymentRate
