// @flow

import React from 'react'
import cx from 'classnames'

import type { PaymentCurrency } from '$shared/flowtype/common-types'
import SvgIcon from '$shared/components/SvgIcon'
import { paymentCurrencies } from '$shared/utils/constants'

import styles from './currencySelector.pcss'

type Props = {
    onChange: (currency: PaymentCurrency) => void,
    paymentCurrency: PaymentCurrency,
    availableCurrencies: Array<PaymentCurrency>,
    tokenSymbol: string,
}

const CurrencySelector = ({ onChange, paymentCurrency, availableCurrencies, tokenSymbol }: Props) => (
    <div className={styles.root}>
        {availableCurrencies.map((currency: PaymentCurrency, index) => {
            const iconName = currency === paymentCurrencies.PRODUCT_DEFINED ? 'unknownToken' : currency.toString()

            return (
                <CurrencyButton
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    currency={currency}
                    onChange={onChange}
                    selected={currency === paymentCurrency}
                    iconName={iconName}
                    tokenSymbol={tokenSymbol}
                />
            )
        })}
    </div>
)

type CurrencyButtonProps = {
    onChange: (currency: PaymentCurrency) => void,
    selected: boolean,
    currency: PaymentCurrency,
    iconName: string,
    tokenSymbol: string,
}

const CurrencyButton = ({
    currency,
    selected,
    onChange,
    iconName,
    tokenSymbol,
}: CurrencyButtonProps) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
        key={currency}
        className={cx(styles.currencyButton, {
            [styles.selected]: selected,
        })}
        onClick={() => onChange(currency)}
    >
        {/* $FlowFixMe: what */}
        <SvgIcon name={iconName} className={styles.currencyIcon} />
        <span className={styles.name}>{currency === paymentCurrencies.PRODUCT_DEFINED ? tokenSymbol : currency}</span>
    </div>
)

export default CurrencySelector
