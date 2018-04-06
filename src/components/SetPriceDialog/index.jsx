// @flow

import React from 'react'
import ModalDialog from '../ModalDialog'
import Steps from '../Steps'
import Step from '../Steps/Step'
import PaymentRate from './PaymentRate'
import PaymentRateEditor, { type PaymentRateChange } from './PaymentRateEditor'
import styles from './setPriceDialog.pcss'
import type { TimeUnit, Currency } from '../../flowtype/common-types'

type Props = {
    onClose: () => void,
}

type State = {
    amount: ?number,
    currency: Currency,
    timeUnit: TimeUnit,
}

class SetPriceDialog extends React.Component<Props, State> {
    state = {
        amount: 1,
        currency: 'DATA',
        timeUnit: 'hour',
    }

    onPaymentRateChange = (change: PaymentRateChange) => {
        this.setState(change)
    }

    render() {
        const { onClose } = this.props
        const { amount, currency, timeUnit } = this.state

        return (
            <ModalDialog onClose={onClose}>
                <Steps onCancel={onClose} onComplete={onClose}>
                    <Step title="Set your product's price">
                        <PaymentRate
                            currency={currency}
                            amount={amount || 0}
                            timeUnit={timeUnit}
                            className={styles.paymentRate}
                        />
                        <PaymentRateEditor
                            currency={currency}
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
