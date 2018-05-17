// @flow

import React from 'react'
import { Row, Col } from '@streamr/streamr-layout'
import { currencies, DEFAULT_CURRENCY } from '../../../../utils/constants'
import type { Currency, NumberString } from '../../../../flowtype/common-types'
import { convert, sanitize, formatAmount, formatDecimals } from '../../../../utils/price'
import styles from './amountEditor.pcss'

type Props = {
    amount: ?NumberString,
    dataPerUsd: ?NumberString,
    currency: Currency,
    onChange: (NumberString) => void,
}

type State = {
    amount: NumberString,
    currency: Currency,
}

class AmountEditor extends React.Component<Props, State> {
    state = {
        amount: '',
        currency: DEFAULT_CURRENCY,
    }

    componentWillMount() {
        const { amount, currency } = this.props

        this.setState({
            amount: amount || '0',
            currency,
        })
    }

    onUsdAmountChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setAmount(e.target.value, currencies.USD)
    }

    onDataAmountChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setAmount(e.target.value, currencies.DATA)
    }

    setAmount = (amount: string, currency: Currency) => {
        this.setState({
            amount,
            currency,
        })

        this.props.onChange(convert(sanitize(parseFloat(amount)), this.props.dataPerUsd || 0, currency, this.props.currency).toString())
    }

    getLocalAmount = (currency: Currency) => {
        const { amount } = this.state

        if (currency === this.state.currency) {
            return amount
        }

        return convert(sanitize(parseFloat(amount)), this.props.dataPerUsd || 0, this.state.currency, currency)
    }

    render() {
        if (!this.props.dataPerUsd) {
            // is probably just loading
            return null
        }

        return (
            <Row>
                <Col xs={5}>
                    <Row className={styles.editorContainer}>
                        <Col xs={8} className={styles.editorInputContainer}>
                            <input
                                type="text"
                                value={formatAmount(this.getLocalAmount(currencies.DATA), 4)}
                                onChange={this.onDataAmountChange}
                            />
                        </Col>
                        <Col xs={4} className={styles.currencyLabel}>
                            {currencies.DATA}
                        </Col>
                    </Row>
                </Col>
                <Col xs={2} className={styles.equals}>
                    =
                </Col>
                <Col xs={5}>
                    <Row className={styles.editorContainer}>
                        <Col xs={8} className={styles.editorInputContainer}>
                            <input
                                type="text"
                                value={formatDecimals(this.getLocalAmount(currencies.USD), currencies.USD)}
                                onChange={this.onUsdAmountChange}
                            />
                        </Col>
                        <Col xs={4} className={styles.currencyLabel}>
                            {currencies.USD}
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}

export default AmountEditor
