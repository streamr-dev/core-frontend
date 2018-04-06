// @flow

import React from 'react'
import type { Currency, TimeUnit } from '../../../flowtype/common-types'
import titleize from '../../../utils/titleize'

type Props = {
    amount: number,
    currency: Currency,
    timeUnit: TimeUnit,
    className?: string,
}

const PaymentRate = ({ amount, currency, timeUnit, className }: Props) => (
    <div className={className}>{amount} {currency} per {titleize(timeUnit)}</div>
)

export default PaymentRate
