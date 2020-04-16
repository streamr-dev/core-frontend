// @flow

import React from 'react'
import cx from 'classnames'

import { paymentCurrencies } from '$shared/utils/constants'
import type { PaymentCurrency } from '$shared/flowtype/common-types'
import SvgIcon from '$shared/components/SvgIcon'

import styles from './currencySelector.pcss'

type Props = {
    onChange: (currency: PaymentCurrency) => void,
    paymentCurrency: PaymentCurrency,
}

const availableCurrencies = [
    paymentCurrencies.DATA,
    paymentCurrencies.ETH,
    paymentCurrencies.DAI,
]

const CurrencySelector = ({ onChange, paymentCurrency }: Props) => (
    <div className={styles.root}>
        {availableCurrencies.map((currency, index) => // eslint-disable-next-line react/no-array-index-key
            <CurrencyButton key={index} currency={currency} onChange={onChange} selected={currency === paymentCurrency} />)}
    </div>
)

type CurrencyButtonProps = {
    onChange: (currency: PaymentCurrency) => void,
    selected: boolean,
    currency: PaymentCurrency,
}

const CurrencyButton = ({ currency, selected, onChange }: CurrencyButtonProps) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
        key={currency}
        className={cx(styles.currencyButton, {
            [styles.selected]: selected,
        })}
        onClick={() => onChange(currency)}
    >
        <SvgIcon name={currency} className={styles.currencyIcon} />
        <span className={styles.name}>{currency}</span>
    </div>
)

export default CurrencySelector
