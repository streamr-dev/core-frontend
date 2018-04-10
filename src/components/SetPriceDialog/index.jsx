// @flow

import React from 'react'
import ModalDialog from '../ModalDialog'
import Steps from '../Steps'
import Step from '../Steps/Step'
import PaymentRate from '../PaymentRate'
import PaymentRateEditor, { type PaymentRateChange } from './PaymentRateEditor'
import styles from './setPriceDialog.pcss'
import type { TimeUnit, Currency } from '../../flowtype/common-types'
import EthAddressField from './EthAddressField'
import type { Address } from '../../flowtype/web3-types'
import { toSeconds } from '../../utils/time'

type Props = {
    onClose: () => void,
    pricePerSecond: ?number,
    currency: Currency,
    beneficiaryAddress: ?Address,
    ownerAddress: ?Address,
    setProperty: (string, any) => void,
}

type State = {
    amount: ?number,
    timeUnit: TimeUnit,
    beneficiaryAddress: ?Address,
}

class SetPriceDialog extends React.Component<Props, State> {
    state = {
        amount: null,
        timeUnit: 'hour',
        beneficiaryAddress: null,
    }

    componentWillMount() {
        const { pricePerSecond, beneficiaryAddress } = this.props

        this.setState({
            amount: pricePerSecond,
            timeUnit: 'second',
            beneficiaryAddress,
        })
    }

    onPaymentRateChange = (change: PaymentRateChange) => {
        this.setState(change)
    }

    onAddressChange = (beneficiaryAddress: Address) => {
        this.setState({
            beneficiaryAddress,
        })
    }

    onComplete = () => {
        const { setProperty, onClose } = this.props
        const { amount, timeUnit, beneficiaryAddress } = this.state
        const pricePerSecond = (amount || 0) / toSeconds(1, timeUnit)

        setProperty('beneficiaryAddress', beneficiaryAddress)
        setProperty('pricePerSecond', pricePerSecond)
        onClose()
    }

    render() {
        const { onClose, currency, ownerAddress } = this.props
        const { amount, timeUnit, beneficiaryAddress } = this.state

        return (
            <ModalDialog onClose={onClose} className={styles.dialog}>
                <Steps onCancel={onClose} onComplete={this.onComplete}>
                    <Step title="Set your product's price">
                        <PaymentRate
                            currency={currency}
                            amount={amount || 0}
                            timeUnit={timeUnit}
                            className={styles.paymentRate}
                            maxDigits={4}
                        />
                        <PaymentRateEditor
                            currency={currency}
                            amount={amount}
                            timeUnit={timeUnit}
                            className={styles.paymentRateEditor}
                            onChange={this.onPaymentRateChange}
                        />
                    </Step>
                    <Step title="Set Ethereum addresses" className={styles.addresses}>
                        <EthAddressField
                            id="ownerAddress"
                            label="Your account Ethereum address"
                            value={ownerAddress || ''}
                        />
                        <EthAddressField
                            id="beneficiaryAddress"
                            label="Ethereum address to receive Marketplace payments"
                            value={beneficiaryAddress || ''}
                            onChange={this.onAddressChange}
                        />
                        <p>* These are required to publish your product</p>
                    </Step>
                </Steps>
            </ModalDialog>
        )
    }
}

export default SetPriceDialog
