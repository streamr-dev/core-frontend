// @flow

import React from 'react'
import { Row, Col } from 'reactstrap'
import { contractCurrencies as currencies, DEFAULT_CURRENCY } from '$shared/utils/constants'
import type { ContractCurrency, NumberString } from '$shared/flowtype/common-types'
import { convert, sanitize, formatDecimals } from '$mp/utils/price'
import styles from './amountEditor.pcss'

type Props = {
    amount: ?NumberString,
    dataPerUsd: ?NumberString,
    currency: ContractCurrency,
    onChange: (NumberString) => void,
}

type State = {
    amount: NumberString,
    currency: ContractCurrency,
}

class AmountEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        const { amount, currency } = this.props
        this.state = {
            amount: (amount && formatDecimals(amount, currency)) || '0',
            currency: currency || DEFAULT_CURRENCY,
        }
    }

    onUsdAmountChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setLocalAmount(e.target.value, currencies.USD)
    }

    onDataAmountChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setLocalAmount(e.target.value, currencies.DATA)
    }

    setLocalAmount = (amount: string, currency: ContractCurrency) => {
        this.setState({
            amount,
            currency,
        })
        this.setProductAmount(amount, currency)
    }

    setProductAmount = (amount: string, currency: ContractCurrency) => {
        if (currency === this.props.currency) {
            this.props.onChange(amount)
        } else {
            const productAmount = formatDecimals(convert(
                sanitize(parseFloat(amount))
                , this.props.dataPerUsd || 0, currency, this.props.currency,
            ), this.props.currency)
            this.props.onChange(productAmount)
        }
    }

    getLocalAmount = (currency: ContractCurrency) => {
        const { amount } = this.state

        if (currency === this.state.currency) {
            return amount
        }

        return formatDecimals(convert(sanitize(parseFloat(amount)), this.props.dataPerUsd || 0, this.state.currency, currency), currency)
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
                                type="number"
                                min="0"
                                value={this.getLocalAmount(currencies.DATA)}
                                onChange={this.onDataAmountChange}
                                className={styles.dataInput}
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
                                value={this.getLocalAmount(currencies.USD)}
                                onChange={this.onUsdAmountChange}
                                className={styles.usdInput}
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
