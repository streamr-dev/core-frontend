// @flow

import React from 'react'
import BN from 'bignumber.js'
import { Form, FormGroup } from 'reactstrap'
import { I18n } from 'react-redux-i18n'

import { toSeconds } from '$mp/utils/time'
import { dataToUsd, usdToData, formatDecimals } from '$mp/utils/price'
import { currencies } from '$shared/utils/constants'
import type { SmartContractProduct } from '$mp/flowtype/product-types'
import type { Currency, NumberString, TimeUnit } from '$shared/flowtype/common-types'
import Dialog from '$shared/components/Dialog'

import TimeUnitSelector from './TimeUnitSelector'
import style from './chooseAccessPeriod.pcss'

export type Props = {
    dataPerUsd: ?NumberString,
    contractProduct: SmartContractProduct,
    onNext: (time: NumberString, timeUnit: TimeUnit) => void | Promise<void>,
    onCancel: () => void,
}

type State = {
    time: NumberString,
    timeUnit: TimeUnit,
}

export class ChooseAccessPeriodDialog extends React.Component<Props, State> {
    static parsePrice = (time: NumberString | BN, timeUnit: TimeUnit, pricePerSecond: BN, currency: Currency) => {
        if (!BN(time).isNaN() && BN(time).isGreaterThan(0)) {
            return formatDecimals(toSeconds(time, timeUnit).multipliedBy(pricePerSecond), currency).toString()
        }
        return '-'
    }

    state = {
        time: '1',
        timeUnit: 'hour',
    }

    onTimeUnitChange = (timeUnit: TimeUnit) => {
        this.setState({
            timeUnit,
        })
    }

    render() {
        const { contractProduct, onNext, onCancel, dataPerUsd } = this.props
        const { time, timeUnit } = this.state
        const { pricePerSecond, priceCurrency } = contractProduct
        if (!dataPerUsd) {
            // is probably just loading
            return null
        }

        const pricePerSecondInData = priceCurrency === currencies.DATA ?
            pricePerSecond :
            usdToData(pricePerSecond, dataPerUsd)

        const pricePerSecondInUsd = priceCurrency === currencies.USD ?
            pricePerSecond :
            dataToUsd(pricePerSecond, dataPerUsd)

        return (
            <Dialog
                onClose={onCancel}
                title={I18n.t('modal.chooseAccessPeriod.title')}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        onClick: onCancel,
                        color: 'link',
                    },
                    next: {
                        title: I18n.t('modal.common.next'),
                        color: 'primary',
                        outline: true,
                        onClick: () => onNext(time, timeUnit),
                        disabled: BN(time).isNaN() || BN(time).isLessThanOrEqualTo(0),
                    },
                }}
            >
                <Form className={style.accessPeriodForm}>
                    <FormGroup className={style.accessPeriodNumberSelector}>
                        <input
                            className={style.accessPeriodNumber}
                            type="text"
                            name="time"
                            id="time"
                            min={1}
                            value={!BN(time).isNaN() ? time : ''}
                            onChange={(e: SyntheticInputEvent<EventTarget>) => this.setState({
                                time: e.target.value,
                            })}
                            onBlur={(e: SyntheticInputEvent<EventTarget>) => {
                                if (parseInt(e.target.value, 10) <= 1) {
                                    this.setState({
                                        time: '1',
                                    })
                                }
                            }}
                        />
                    </FormGroup>
                    <FormGroup tag="fieldset" className={style.timeUnitFieldset}>
                        <div className={style.timeUnitSelectionCol}>
                            <TimeUnitSelector timeUnit={this.state.timeUnit} onChange={this.onTimeUnitChange} />
                            <div className={style.priceLabels}>
                                <div className={style.priceColumn}>
                                    <span className={style.priceValue}>
                                        {ChooseAccessPeriodDialog.parsePrice(time, timeUnit, pricePerSecondInData, currencies.DATA)}
                                    </span>
                                    <span className={style.priceLabel}>
                                        {currencies.DATA}
                                    </span>
                                </div>
                                <div className={style.priceColumn}>
                                    <span className={style.priceValue}>
                                        ${ChooseAccessPeriodDialog.parsePrice(time, timeUnit, pricePerSecondInUsd, currencies.USD)}
                                    </span>
                                    <span className={style.priceLabel}>
                                        {currencies.USD}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </FormGroup>
                </Form>
            </Dialog>
        )
    }
}

export default ChooseAccessPeriodDialog
