// @flow

import React from 'react'
import classNames from 'classnames'
import { Row, Col } from '@streamr/streamr-layout'

import TimeUnitSelector from '../TimeUnitSelector'
import AmountEditor from '../AmountEditor'
import { currencies } from '../../../../utils/constants'
import type { Currency, NumberString, TimeUnit } from '../../../../flowtype/common-types'
import FixedPriceSelector from './FixedPriceSelector'

import styles from './paymentRateEditor.pcss'

export type PaymentRateChange = {
    amount?: ?NumberString,
    timeUnit?: TimeUnit,
}

type Props = {
    amount: ?NumberString,
    dataPerUsd: NumberString,
    timeUnit: TimeUnit,
    priceCurrency: Currency,
    className?: string,
    onPriceChange: (NumberString) => void,
    onPriceUnitChange: (TimeUnit) => void,
    onPriceCurrencyChange: (Currency) => void,
}

const PaymentRateEditor = ({
    className,
    timeUnit,
    amount,
    dataPerUsd,
    priceCurrency,
    onPriceChange,
    onPriceCurrencyChange,
    onPriceUnitChange,
}: Props) => (
    <div className={classNames(styles.editor, className)}>
        <Row>
            <Col xs={5}>
                <AmountEditor
                    amount={amount}
                    dataPerUsd={dataPerUsd}
                    currency={priceCurrency}
                    onChange={onPriceChange}
                />
                <FixedPriceSelector
                    onValue={currencies.USD}
                    offValue={currencies.DATA}
                    value={priceCurrency}
                    onChange={onPriceCurrencyChange}
                />
            </Col>
            <Col xs={2}>Per</Col>
            <Col xs={5}>
                <TimeUnitSelector
                    selected={timeUnit}
                    onChange={onPriceUnitChange}
                />
            </Col>
        </Row>
    </div>
)

export default PaymentRateEditor
