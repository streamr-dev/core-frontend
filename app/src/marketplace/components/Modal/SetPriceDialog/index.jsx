// @flow

import React from 'react'
import BN from 'bignumber.js'
import omit from 'lodash/omit'
import { Container, Col, Row } from 'reactstrap'
import { Translate, I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import ModalDialog from '$shared/components/ModalDialog'
import Steps from '$mp/components/Steps'
import Step from '$mp/components/Steps/Step'
import PaymentRate from '$mp/components/PaymentRate'
import type { TimeUnit, ContractCurrency as Currency, NumberString } from '$shared/flowtype/common-types'
import type { Address } from '$shared/flowtype/web3-types'
import { DEFAULT_CURRENCY, timeUnits } from '$shared/utils/constants'
import { convert, pricePerSecondFromTimeUnit, isPriceValid } from '$mp/utils/price'
import { priceDialogValidator } from '$mp/validators'

import PaymentRateEditor from './PaymentRateEditor'
import styles from './setPriceDialog.pcss'
import EthAddressField from './EthAddressField'

export type PriceDialogResult = {
    amount: NumberString,
    timeUnit: TimeUnit,
    beneficiaryAddress: ?Address,
    ownerAddress: ?Address,
    priceCurrency: Currency,
}

export type OwnProps = {
    onClose: () => void,
    onResult: (PriceDialogResult) => void,
    isFree?: boolean,
    startingAmount: ?NumberString,
    currency: Currency,
    beneficiaryAddress: ?Address,
}

type Props = OwnProps & {
    accountId: ?Address,
    dataPerUsd: NumberString,
}

type State = {
    amount: ?NumberString,
    timeUnit: TimeUnit,
    beneficiaryAddress: ?Address,
    priceCurrency: Currency,
    errors: ?{
        [string]: string,
    },
}

class SetPriceDialog extends React.Component<Props, State> {
    state = {
        amount: this.props.startingAmount,
        timeUnit: timeUnits.hour,
        beneficiaryAddress: this.props.beneficiaryAddress || this.props.accountId,
        priceCurrency: this.props.currency || DEFAULT_CURRENCY,
        errors: {},
    }

    onPriceChange = (amount: NumberString) => {
        this.setState({
            amount,
            errors: {
                ...this.state.errors,
                price: isPriceValid(amount) ? '' : I18n.t('validation.invalidPrice'),
                pricePerSecond: '',
            },
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

    onBeneficiaryAddressChange = (beneficiaryAddress: Address) => {
        this.setState({
            beneficiaryAddress,
            errors: omit(this.state.errors, 'beneficiaryAddress'),
        })
    }

    onComplete = () => {
        const { onClose, onResult, isFree, accountId } = this.props
        const { amount, timeUnit, beneficiaryAddress, priceCurrency } = this.state
        const actualAmount = BN(amount || 0)

        priceDialogValidator({
            amount: actualAmount.toString(),
            timeUnit,
            priceCurrency: priceCurrency || DEFAULT_CURRENCY,
            beneficiaryAddress,
            ownerAddress: accountId,
            isFree,
        }).then(
            (result) => {
                if (result) {
                    onResult(result)
                    onClose()
                }
            },
            (errors) => {
                this.setState({
                    errors,
                })
            },
        )
    }

    getErrors = (): Array<string> => (Object.values(this.state.errors || {}): Array<any>).filter((a) => a)

    isBNAmountValid = (BNAmount: any) => !BNAmount.isNaN() && BNAmount.isPositive()

    render() {
        const { onClose, dataPerUsd, accountId } = this.props
        const { amount,
            timeUnit,
            beneficiaryAddress,
            priceCurrency } = this.state
        const BNAmount = BN(amount)
        return (
            <ModalPortal>
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
                                <Steps
                                    onCancel={onClose}
                                    onComplete={this.onComplete}
                                    isDisabled={this.getErrors().length > 0}
                                    errors={this.getErrors()}
                                >
                                    <Step
                                        title={I18n.t('modal.setPrice.setPrice')}
                                        nextButtonLabel={BNAmount.isEqualTo(0) ? I18n.t('modal.setPrice.finish') : ''}
                                    >
                                        <PaymentRate
                                            currency={priceCurrency}
                                            amount={pricePerSecondFromTimeUnit(BNAmount, timeUnit)}
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
                                    <Step
                                        title={I18n.t('modal.setPrice.setAddresses')}
                                        className={styles.addresses}
                                        disabled={BNAmount.isEqualTo(0)}
                                    >
                                        <EthAddressField
                                            id="ownerAddress"
                                            label={I18n.t('modal.setPrice.ownerAddress')}
                                            value={accountId || ''}
                                        />
                                        <EthAddressField
                                            id="beneficiaryAddress"
                                            label={I18n.t('modal.setPrice.beneficiaryAddress')}
                                            value={beneficiaryAddress || ''}
                                            onChange={this.onBeneficiaryAddressChange}
                                            hasError={!!(this.state.errors && this.state.errors.beneficiaryAddress)}
                                        />
                                        <p className={styles.info}><Translate value="modal.setPrice.required" /></p>
                                    </Step>
                                </Steps>
                            </Row>
                        </Col>
                    </Container>
                </ModalDialog>
            </ModalPortal>
        )
    }
}

export default SetPriceDialog
