// @flow

import React from 'react'
import classNames from 'classnames'
import BN from 'bignumber.js'
import { Form, FormGroup, Label } from '@streamr/streamr-layout'

import { toSeconds } from '../../../utils/time'
import { dataToUsd, usdToData } from '../../../utils/price'
import { currencies, timeUnits } from '../../../utils/constants'
import type { Product } from '../../../flowtype/product-types'
import type { NumberString, TimeUnit } from '../../../flowtype/common-types'

import Dialog from '../Dialog'

import style from './choose-access-period.pcss'

export type Props = {
    dataPerUsd: ?NumberString,
    product: Product,
    onNext: (time: NumberString, timeUnit: TimeUnit) => void,
    onCancel: () => void,
}

type State = {
    time: NumberString,
    timeUnit: TimeUnit,
}

class ChooseAccessPeriod extends React.Component<Props, State> {
    static parsePrice = (time: NumberString | BN, timeUnit: TimeUnit, pricePerSecond: BN) => (
        (!BN(time).isNaN() && BN(time).isGreaterThan(0)) ? toSeconds(time, timeUnit).multipliedBy(pricePerSecond).toString() : '-'
    )

    state = {
        time: '1',
        timeUnit: 'hour',
    }

    render() {
        const { product, onNext, onCancel, dataPerUsd } = this.props
        const { time, timeUnit } = this.state
        if (!dataPerUsd) {
            // is probably just loading
            return null
        }

        const pricePerSecondInData = product.priceCurrency === currencies.DATA ?
            product.pricePerSecond :
            usdToData(product.pricePerSecond, dataPerUsd)

        const pricePerSecondInUsd = product.priceCurrency === currencies.USD ?
            product.pricePerSecond :
            dataToUsd(product.pricePerSecond, dataPerUsd)

        return (
            <Dialog
                onClose={onCancel}
                title="Choose your access period"
                actions={{
                    cancel: {
                        title: 'Cancel',
                        onClick: onCancel,
                        outline: true,
                    },
                    next: {
                        title: 'Next',
                        color: 'primary',
                        outline: true,
                        onClick: () => onNext(time, timeUnit),
                        disabled: BN(time).isNaN() || BN(time).isLessThanOrEqualTo(0),
                    },
                }}
            >
                <Form className={style.accessPeriodForm}>
                    <FormGroup className={style.accessPeriodNumberSelector}>
                        <div>
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
                        </div>
                    </FormGroup>
                    <FormGroup tag="fieldset" className={style.timeUnitFieldset}>
                        <div className={style.timeUnitSelectionCol}>
                            {['hour', 'day', 'week', 'month'].map((unit) => (
                                <Label
                                    className={
                                        classNames({
                                            [style.timeUnitSelection]: true,
                                            [style.timeUnitSelectionActive]: this.state.timeUnit === unit,
                                        })
                                    }
                                    check
                                    key={unit}
                                >
                                    <input
                                        className={style.hiddenRadioButton}
                                        type="radio"
                                        name="timeUnit"
                                        value={unit}
                                        onChange={(e: SyntheticInputEvent<EventTarget>) => this.setState({
                                            timeUnit: (((e.target.value): any): TimeUnit),
                                        })}
                                    />
                                    {timeUnits[unit]}
                                </Label>
                            ))}
                            <div className={style.priceLabels}>
                                <div>
                                    <span>
                                        {ChooseAccessPeriod.parsePrice(time, timeUnit, pricePerSecondInData)}
                                    </span>
                                    DATA
                                </div>
                                <div>
                                    <span>
                                        ${ChooseAccessPeriod.parsePrice(time, timeUnit, pricePerSecondInUsd)}
                                    </span>
                                    USD
                                </div>
                            </div>
                        </div>
                    </FormGroup>
                </Form>
            </Dialog>
        )
    }
}

export default ChooseAccessPeriod
