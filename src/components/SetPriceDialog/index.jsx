// @flow

import React from 'react'
import ModalDialog from '../ModalDialog'
import Steps from '../Steps'
import Step from '../Steps/Step'
import PaymentRate from './PaymentRate'
import PaymentRateEditor, { type PaymentRateChange } from './PaymentRateEditor'
import styles from './setPriceDialog.pcss'
import type { TimeUnit } from '../../flowtype/common-types'
import type { Product } from '../../flowtype/product-types'

type Props = {
    onClose: () => void,
    product: Product,
}

type State = {
    amount: ?number,
    timeUnit: TimeUnit,
}

class SetPriceDialog extends React.Component<Props, State> {
    state = {
        amount: null,
        timeUnit: 'hour',
    }

    componentWillMount() {
        const { product: { pricePerSecond } } = this.props

        this.setState({
            amount: pricePerSecond,
            timeUnit: 'second',
        })
    }

    onPaymentRateChange = (change: PaymentRateChange) => {
        this.setState(change)
    }

    render() {
        const { onClose, product: { priceCurrency } } = this.props
        const { amount, timeUnit } = this.state

        return (
            <ModalDialog onClose={onClose}>
                <Steps onCancel={onClose} onComplete={onClose}>
                    <Step title="Set your product's price">
                        <PaymentRate
                            currency={priceCurrency}
                            amount={amount || 0}
                            timeUnit={timeUnit}
                            className={styles.paymentRate}
                        />
                        <PaymentRateEditor
                            currency={priceCurrency}
                            amount={amount}
                            timeUnit={timeUnit}
                            className={styles.paymentRateEditor}
                            onChange={this.onPaymentRateChange}
                        />
                    </Step>
                    <Step title="Set Ethereum addresses">
                        Step 2
                    </Step>
                </Steps>
            </ModalDialog>
        )
    }
}

export default SetPriceDialog
