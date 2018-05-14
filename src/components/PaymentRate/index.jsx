// @flow

import React from 'react'
import BN from 'bignumber.js'
import type { Currency, TimeUnit } from '../../flowtype/common-types'
import { formatPrice } from '../../utils/price'
import { currencies } from '../../utils/constants'

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
    const maxDigits = (currency === currencies.DATA) ? 4 : 2

    return (
        <div className={className}>{formatPrice(amount, currency, maxDigits, timeUnit)}</div>
    )
}

export default PaymentRate
