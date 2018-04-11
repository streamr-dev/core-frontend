// @flow

import React from 'react'
import { Row, Col } from '@streamr/streamr-layout'
import { timeUnits, DATA_PER_USD, currencies } from '../../../utils/constants'
import styles from './paymentRateEditor.pcss'
import classNames from 'classnames'
import type { Currency, TimeUnit } from '../../../flowtype/common-types'
import TimeUnitButton from '../TimeUnitButton'
import { convert, sanitize } from '../../../utils/price'

export type PaymentRateChange = {
    amount?: ?number,
    timeUnit?: TimeUnit,
}

type Props = {
    amount: ?number,
    currency: Currency,
    timeUnit: TimeUnit,
    className?: string,
    onChange: (PaymentRateChange) => void,
}

type State = {
    amount: string,
    currency: Currency,
}

class PaymentRateEditor extends React.Component<Props, State> {
    state = {
        amount: '',
        currency: currencies.DATA,
    }

    componentWillMount() {
        const amount = (this.props.amount || 0).toString()
        const { currency } = this.props

        this.setState({
            amount,
            currency,
        })
    }

    onUsdAmountChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setAmount(e.target.value, currencies.USD)
    }

    onDataAmountChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setAmount(e.target.value, currencies.DATA)
    }

    onTimeUnitChange = (timeUnit: TimeUnit) => {
        this.props.onChange({
            timeUnit,
        })
    }

    setAmount = (amount: string, currency: Currency) => {
        this.setState({
            amount,
            currency,
        })

        this.props.onChange({
            amount: convert(sanitize(parseFloat(amount)), DATA_PER_USD, currency, this.props.currency),
        })
    }

    getLocalAmount = (currency: Currency) => {
        const { amount } = this.state

        if (currency === this.state.currency) {
            return amount
        }

        return convert(sanitize(parseFloat(amount)), DATA_PER_USD, this.state.currency, currency)
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
                                            value={this.getLocalAmount(currencies.DATA)}
                                            onChange={this.onDataAmountChange}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        {currencies.DATA}
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
                                            value={this.getLocalAmount(currencies.USD)}
                                            onChange={this.onUsdAmountChange}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        {currencies.USD}
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
