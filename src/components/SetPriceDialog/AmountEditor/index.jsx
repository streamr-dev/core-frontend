// @flow

import React from 'react'
import { Row, Col } from '@streamr/streamr-layout'
import { currencies } from '../../../utils/constants'
import type { Currency } from '../../../flowtype/common-types'
import { convert, sanitize } from '../../../utils/price'

type Props = {
    amount: ?number,
    dataPerUsd: number,
    currency: Currency,
    onChange: (number) => void,
}

type State = {
    amount: string,
    currency: Currency,
}

class AmountEditor extends React.Component<Props, State> {
    state = {
        amount: '',
        currency: currencies.DATA,
    }

    componentWillMount() {
        const { amount, currency } = this.props

        this.setState({
            amount: (amount || 0).toString(),
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

        this.props.onChange(convert(sanitize(parseFloat(amount)), this.props.dataPerUsd, currency, this.props.currency))
    }

    getLocalAmount = (currency: Currency) => {
        const { amount } = this.state

        if (currency === this.state.currency) {
            return amount
        }

        return convert(sanitize(parseFloat(amount)), this.props.dataPerUsd, this.state.currency, currency)
    }

    render() {
        return (
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
        )
    }
}

export default AmountEditor
