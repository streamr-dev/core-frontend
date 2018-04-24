// @flow

import React from 'react'
import classNames from 'classnames'
import { Row, Col } from '@streamr/streamr-layout'

import TimeUnitSelector from '../TimeUnitSelector'
import AmountEditor from '../AmountEditor'
import type { Currency, TimeUnit } from '../../../flowtype/common-types'
import FixedPriceSelector from './FixedPriceSelector'

import styles from './paymentRateEditor.pcss'

export type PaymentRateChange = {
    amount?: ?number,
    timeUnit?: TimeUnit,
}

type Props = {
    amount: ?number,
    dataPerUsd: number,
    currency: Currency,
    timeUnit: TimeUnit,
    fixedToUsd: boolean,
    className?: string,
    onPricePerSecondChange: (number) => void,
    onPriceUnitChange: (TimeUnit) => void,
    onFixedPriceChange: (boolean) => void,
}

const PaymentRateEditor = ({
    className,
    timeUnit,
    amount,
    currency,
    dataPerUsd,
    fixedToUsd,
    onPricePerSecondChange,
    onFixedPriceChange,
    onPriceUnitChange,
}: Props) => (
    <div className={classNames(styles.editor, className)}>
        <Row>
            <Col xs={5}>
                <AmountEditor
                    amount={amount}
                    dataPerUsd={dataPerUsd}
                    currency={currency}
                    onChange={onPricePerSecondChange}
                />
                <FixedPriceSelector
                    value={fixedToUsd}
                    onChange={onFixedPriceChange}
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
