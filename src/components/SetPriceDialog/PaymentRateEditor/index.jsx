// @flow

import React from 'react'
import { Row, Col } from '@streamr/streamr-layout'
import { timeUnits } from '../../../utils/constants'
import styles from './paymentRateEditor.pcss'
import classNames from 'classnames'
import type { Currency, TimeUnit } from '../../../flowtype/common-types'
import TimeUnitButton from '../TimeUnitButton'
import { dataToUsd, usdToData } from '../../../utils/price'

export type PaymentRateChange = {
    amount?: ?number,
    currency?: Currency,
    timeUnit?: TimeUnit,
}

type Props = {
    amount: ?number,
    currency: Currency,
    timeUnit: TimeUnit,
    className?: string,
    onChange: (PaymentRateChange) => void,
}

class PaymentRateEditor extends React.Component<Props> {
    onUsdAmountChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setAmount(e.target.value, 'USD')
    }

    onDataAmountChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setAmount(e.target.value, 'DATA')
    }

    onTimeUnitChange = (timeUnit: TimeUnit) => {
        this.props.onChange({
            timeUnit,
        })
    }

    setAmount = (value: string, currency: Currency) => {
        const amount = parseFloat(value)

        this.props.onChange({
            amount: Number.isNaN(amount) ? null : amount,
            currency,
        })
    }

    getAmountFor = (currency: Currency) => {
        const amount = this.props.amount || ''
        const method = currency === 'DATA' ? usdToData : dataToUsd
        if (currency === this.props.currency) {
            return amount
        }
        return method(amount || 0, 11)
    }

    render() {
        const { className, timeUnit } = this.props

        return (
            <div className={classNames(styles.editor, className)}>
                <Row>
                    <Col xs={5}>
                        <Row>
                            <Col xs={5}>
                                <Row>
                                    <Col xs={8}>
                                        <input
                                            type="text"
                                            value={this.getAmountFor('DATA')}
                                            onChange={this.onDataAmountChange}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        DATA
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={2}>
                                =
                            </Col>
                            <Col xs={5}>
                                <Row>
                                    <Col xs={8}>
                                        <input
                                            type="text"
                                            value={this.getAmountFor('USD')}
                                            onChange={this.onUsdAmountChange}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        USD
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={2}>Per</Col>
                    <Col xs={5}>
                        <div className={styles.timeUnits}>
                            {Object.keys(timeUnits).map((unit) => (
                                <TimeUnitButton
                                    key={unit}
                                    active={unit === timeUnit}
                                    value={unit}
                                    onClick={this.onTimeUnitChange}
                                    className={styles.timeUnit}
                                />
                            ))}
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default PaymentRateEditor
