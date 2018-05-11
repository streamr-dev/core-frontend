// @flow

import React from 'react'
import BN from 'bignumber.js'
import omit from 'lodash/omit'
import { Container, Col, Row } from '@streamr/streamr-layout'

import ModalDialog from '../../ModalDialog'
import Steps from '../../Steps'
import Step from '../../Steps/Step'
import PaymentRate from '../../PaymentRate'
import type { TimeUnit, Currency, NumberString } from '../../../flowtype/common-types'
import type { Address } from '../../../flowtype/web3-types'
import { DEFAULT_CURRENCY, timeUnits } from '../../../utils/constants'
import { convert, pricePerSecondFromTimeUnit } from '../../../utils/price'
import { priceDialogValidator } from '../../../validators'
import PaymentRateEditor from './PaymentRateEditor'
import styles from './setPriceDialog.pcss'
import EthAddressField from './EthAddressField'

export type PriceDialogProps = {
    startingAmount: ?NumberString,
    currency: Currency,
    beneficiaryAddress: ?Address,
    ownerAddress: ?Address,
    ownerAddressReadOnly?: boolean,
}

export type PriceDialogResult = {
    amount: NumberString,
    timeUnit: TimeUnit,
    beneficiaryAddress: ?Address,
    ownerAddress: ?Address,
    priceCurrency: Currency,
}

type Props = PriceDialogProps & {
    dataPerUsd: NumberString,
    onClose: () => void,
    onResult: (PriceDialogResult) => void,
    isFree?: boolean,
}

type State = {
    amount: ?NumberString,
    timeUnit: TimeUnit,
    beneficiaryAddress: ?Address,
    ownerAddress: ?Address,
    priceCurrency: Currency,
    errors: ?{
        [string]: string,
    }
}

class SetPriceDialog extends React.Component<Props, State> {
    state = {
        amount: null,
        priceCurrency: DEFAULT_CURRENCY,
        timeUnit: timeUnits.hour,
        beneficiaryAddress: null,
        ownerAddress: null,
        errors: null,
    }

    componentWillMount() {
        const { startingAmount, beneficiaryAddress, ownerAddress, currency } = this.props

        this.setState({
            amount: startingAmount,
            timeUnit: timeUnits.hour,
            ownerAddress,
            beneficiaryAddress: beneficiaryAddress || ownerAddress,
            priceCurrency: currency,
        })
    }

    onPriceChange = (amount: NumberString) => {
        this.setState({
            amount,
            errors: omit(this.state.errors, 'price'),
        })
    }

    onPriceUnitChange = (timeUnit: TimeUnit) => {
        this.setState({
            timeUnit,
        })
    }

    onPriceCurrencyChange = (priceCurrency: Currency) => {
        this.onPriceChange(convert(this.state.amount || '0', this.props.dataPerUsd, this.state.priceCurrency, priceCurrency))
        this.setState({
            priceCurrency,
        })
    }

    onOwnerAddressChange = (ownerAddress: Address) => {
        this.setState({
            ownerAddress,
            errors: omit(this.state.errors, 'ownerAddress'),
        })
    }

    onBeneficiaryAddressChange = (beneficiaryAddress: Address) => {
        this.setState({
            beneficiaryAddress,
            errors: omit(this.state.errors, 'beneficiaryAddress'),
        })
    }

    onComplete = () => {
        const { onClose, onResult, isFree } = this.props
        const {
            amount, timeUnit, beneficiaryAddress, ownerAddress, priceCurrency,
        } = this.state
        const actualAmount = BN(amount || 0)

        priceDialogValidator({
            amount: actualAmount.toString(),
            timeUnit,
            priceCurrency: priceCurrency || DEFAULT_CURRENCY,
            beneficiaryAddress,
            ownerAddress,
            isFree,
        }).then((result) => {
            if (result) {
                onResult(result)
                onClose()
            }
        }, (errors) => {
            this.setState({
                errors,
            })
        })
    }

    render() {
        const { onClose, ownerAddressReadOnly, dataPerUsd } = this.props
        const {
            amount,
            timeUnit,
            beneficiaryAddress,
            ownerAddress,
            priceCurrency,
        } = this.state
        const BNAmout = BN(amount)
        return (
            <ModalDialog onClose={onClose} className={styles.dialog} backdropClassName={styles.backdrop}>
                <Container>
                    <Col
                        sm={12}
                        xl={{
                            size: 8,
                            offset: 2,
                        }}
                    >
                        <Row noGutters>
                            <Steps onCancel={onClose} onComplete={this.onComplete}>
                                <Step title="Set your product's price" nextButtonLabel={BNAmout.isEqualTo(0) ? 'Finish' : ''}>
                                    <PaymentRate
                                        currency={priceCurrency}
                                        amount={pricePerSecondFromTimeUnit(BNAmout, timeUnit)}
                                        timeUnit={timeUnits.hour}
                                        className={styles.paymentRate}
                                        maxDigits={4}
                                    />
                                    <PaymentRateEditor
                                        dataPerUsd={dataPerUsd}
                                        amount={amount}
                                        timeUnit={timeUnit}
                                        priceCurrency={priceCurrency}
                                        className={styles.paymentRateEditor}
                                        onPriceChange={this.onPriceChange}
                                        onPriceUnitChange={this.onPriceUnitChange}
                                        onPriceCurrencyChange={this.onPriceCurrencyChange}
                                    />
                                </Step>
                                <Step title="Set Ethereum addresses" className={styles.addresses} disabled={BNAmout.isEqualTo(0)}>
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
                                        hasError={!!(this.state.errors && this.state.errors.beneficiaryAddress)}
                                    />
                                    <p className={styles.info}>* These are required to publish your product</p>
                                </Step>
                            </Steps>
                        </Row>
                    </Col>
                </Container>
            </ModalDialog>
        )
    }
}

export default SetPriceDialog
