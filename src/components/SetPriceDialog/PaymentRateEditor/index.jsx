// @flow

import React from 'react'
import { Row, Col } from '@streamr/streamr-layout'
import styles from './paymentRateEditor.pcss'
import classNames from 'classnames'
import type { Currency, TimeUnit } from '../../../flowtype/common-types'
import TimeUnitSelector from '../TimeUnitSelector'
import AmountEditor from '../AmountEditor'

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
    onAmountChange = (amount: number) => {
        this.props.onChange({
            amount,
        })
    }

    onTimeUnitChange = (timeUnit: TimeUnit) => {
        this.props.onChange({
            timeUnit,
        })
    }

    render() {
        const { className, timeUnit, amount, currency } = this.props

        return (
            <div className={classNames(styles.editor, className)}>
                <Row>
                    <Col xs={5}>
                        <AmountEditor
                            amount={amount}
                            currency={currency}
                            onChange={this.onAmountChange}
                        />
                    </Col>
                    <Col xs={2}>Per</Col>
                    <Col xs={5}>
                        <TimeUnitSelector
                            selected={timeUnit}
                            onChange={this.onTimeUnitChange}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default PaymentRateEditor
