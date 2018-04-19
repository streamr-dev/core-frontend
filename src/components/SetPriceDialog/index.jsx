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
import getWeb3 from '../../web3/web3Provider'

import PaymentRateEditor, { type PaymentRateChange } from './PaymentRateEditor'
import styles from './setPriceDialog.pcss'
import EthAddressField from './EthAddressField'

export type PriceDialogProps = {
    pricePerSecond: ?number,
    currency: Currency,
    beneficiaryAddress: ?Address,
    ownerAddress: ?Address,
    ownerAddressReadOnly?: boolean,
}

export type PriceDialogResult = {
    pricePerSecond: number,
    beneficiaryAddress: ?Address,
    ownerAddress: ?Address,
}

type Props = PriceDialogProps & {
    onClose: () => void,
    onResult: (PriceDialogResult) => void,
}

type State = {
    amount: ?number,
    timeUnit: TimeUnit,
    beneficiaryAddress: ?Address,
    ownerAddress: ?Address,
    showComplain: boolean,
}

const web3 = getWeb3()

class SetPriceDialog extends React.Component<Props, State> {
    state = {
        amount: null,
        timeUnit: timeUnits.hour,
        beneficiaryAddress: null,
        ownerAddress: null,
        showComplain: false,
    }

    componentWillMount() {
        const { pricePerSecond, beneficiaryAddress, ownerAddress } = this.props

        this.setState({
            amount: pricePerSecond,
            timeUnit: timeUnits.second,
            beneficiaryAddress,
            ownerAddress,
        })
    }

    onPaymentRateChange = (change: PaymentRateChange) => {
        this.setState(change)
    }

    onOwnerAddressChange = (ownerAddress: Address) => {
        this.setState({
            ownerAddress,
        })
    }

    onBeneficiaryAddressChange = (beneficiaryAddress: Address) => {
        this.setState({
            beneficiaryAddress,
        })
    }

    onComplete = () => {
        const { onClose, onResult } = this.props
        const { amount, timeUnit, beneficiaryAddress, ownerAddress } = this.state
        const pricePerSecond = (amount || 0) / toSeconds(1, timeUnit)

        if (pricePerSecond > 0 && !(web3.utils.isAddress(beneficiaryAddress) || web3.utils.isAddress(ownerAddress))) {
            this.setState({
                showComplain: true,
            })
        } else {
            onResult({
                pricePerSecond,
                beneficiaryAddress: pricePerSecond > 0 ? beneficiaryAddress : null,
                ownerAddress: pricePerSecond > 0 ? ownerAddress : null,
            })
            onClose()
        }
    }

    render() {
        const { onClose, currency, ownerAddressReadOnly } = this.props
        const {
            amount, timeUnit, beneficiaryAddress, ownerAddress, showComplain,
        } = this.state

        return (
            <ModalDialog onClose={onClose} className={styles.dialog}>
                <Steps onCancel={onClose} onComplete={this.onComplete}>
                    <Step title="Set your product's price" nextButtonLabel={!amount ? 'Finish' : ''}>
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
                    <Step title="Set Ethereum addresses" className={styles.addresses} disabled={!amount}>
                        <EthAddressField
                            id="ownerAddress"
                            label={`Your account Ethereum address ${ownerAddressReadOnly ? '(cannot be changed)' : ''} `}
                            value={ownerAddress || ''}
                            onChange={ownerAddressReadOnly ? undefined : this.onOwnerAddressChange}
                        />
                        <EthAddressField
                            id="beneficiaryAddress"
                            label="Ethereum address to receive Marketplace payments"
                            value={beneficiaryAddress || ''}
                            onChange={this.onBeneficiaryAddressChange}
                        />
                        <p>* These are required to publish your product</p>
                    </Step>
                </Steps>
                {showComplain && (
                    <div>
                        <p>
                            Found invalid/missing fields! <br />
                            If price is given, Your account Ethereum address and address to receive Marketplace payments needs to be valid.
                        </p>
                    </div>
                )}

            </ModalDialog>
        )
    }
}

export default SetPriceDialog
