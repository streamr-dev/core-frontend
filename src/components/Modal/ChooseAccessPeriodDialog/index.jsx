// @flow

import React from 'react'
import classNames from 'classnames'
import BN from 'bignumber.js'
import { Form, FormGroup, Label } from 'reactstrap'

import { toSeconds } from '../../../utils/time'
import { dataToUsd, usdToData, formatDecimals } from '../../../utils/price'
import { currencies } from '../../../utils/constants'
import type { Product } from '../../../flowtype/product-types'
import type { Currency, NumberString, TimeUnit } from '../../../flowtype/common-types'
import withI18n from '../../../containers/WithI18n'

import Dialog from '../Dialog'

import style from './chooseAccessPeriod.pcss'

export type Props = {
    dataPerUsd: ?NumberString,
    product: Product,
    onNext: (time: NumberString, timeUnit: TimeUnit) => void,
    onCancel: () => void,
    translate: (key: string, options: any) => string,
}

type State = {
    time: NumberString,
    timeUnit: TimeUnit,
}

class ChooseAccessPeriod extends React.Component<Props, State> {
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

    render() {
        const {
            product,
            onNext,
            onCancel,
            dataPerUsd,
            translate,
        } = this.props
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
                title={translate('modal.chooseAccessPeriod.title')}
                actions={{
                    cancel: {
                        title: translate('modal.common.cancel'),
                        onClick: onCancel,
                        outline: true,
                    },
                    next: {
                        title: translate('modal.common.next'),
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
                                    {translate(`modal.chooseAccessPeriod.${unit}`)}
                                </Label>
                            ))}
                            <div className={style.priceLabels}>
                                <div>
                                    <span>
                                        {ChooseAccessPeriod.parsePrice(time, timeUnit, pricePerSecondInData, currencies.DATA)}
                                    </span>
                                    DATA
                                </div>
                                <div>
                                    <span>
                                        ${ChooseAccessPeriod.parsePrice(time, timeUnit, pricePerSecondInUsd, currencies.USD)}
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

export default withI18n(ChooseAccessPeriod)
