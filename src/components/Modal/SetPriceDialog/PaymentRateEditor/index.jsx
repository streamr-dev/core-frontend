// @flow

import React from 'react'
import classNames from 'classnames'
import { Row, Col } from '@streamr/streamr-layout'

import TimeUnitSelector from '../TimeUnitSelector'
import AmountEditor from '../AmountEditor'
import type { Currency, TimeUnit } from '../../../../flowtype/common-types'

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
        const {
            className,
            timeUnit,
            amount,
            currency,
            dataPerUsd,
        } = this.props

        return (
            <div className={classNames(styles.editor, className)}>
                <Row>
                    <Col xs={5}>
                        <AmountEditor
                            amount={amount}
                            dataPerUsd={dataPerUsd}
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
