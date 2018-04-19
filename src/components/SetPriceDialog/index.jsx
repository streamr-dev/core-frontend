// @flow

import React from 'react'

import ModalDialog from '../ModalDialog'
import Steps from '../Steps'
import Step from '../Steps/Step'
import PaymentRate from '../PaymentRate'
import type { TimeUnit, Currency } from '../../flowtype/common-types'
import type { Address } from '../../flowtype/web3-types'
import { toSeconds } from '../../utils/time'
import { timeUnits } from '../../utils/constants'

import PaymentRateEditor, { type PaymentRateChange } from './PaymentRateEditor'
import styles from './setPriceDialog.pcss'
import EthAddressField from './EthAddressField'

export type PriceDialogProps = {
    pricePerSecond: ?number,
    currency: Currency,
    beneficiaryAddress: ?Address,
    ownerAddress: ?Address,
}

export type PriceDialogResult = {
    pricePerSecond: number,
    beneficiaryAddress: ?Address,
}

type Props = PriceDialogProps & {
    onClose: () => void,
    onResult: (PriceDialogResult) => void,
}

type State = {
    amount: ?number,
    timeUnit: TimeUnit,
    beneficiaryAddress: ?Address,
}

class SetPriceDialog extends React.Component<Props, State> {
    state = {
        amount: null,
        timeUnit: timeUnits.hour,
        beneficiaryAddress: null,
    }

    componentWillMount() {
        const { pricePerSecond, beneficiaryAddress, ownerAddress } = this.props

        this.setState({
            amount: pricePerSecond,
            timeUnit: timeUnits.second,
            beneficiaryAddress: beneficiaryAddress || ownerAddress,
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
        const { onClose, onResult } = this.props
        const { amount, timeUnit, beneficiaryAddress } = this.state
        const pricePerSecond = (amount || 0) / toSeconds(1, timeUnit)

        onResult({
            pricePerSecond,
            beneficiaryAddress,
        })
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
