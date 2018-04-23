// @flow

import React from 'react'
import classNames from 'classnames'

import { Form, FormGroup, Label } from '@streamr/streamr-layout'

import { toSeconds } from '../../../utils/time'
import { dataToUsd, usdToData } from '../../../utils/price'
import { currencies, timeUnits } from '../../../utils/constants'
import type { Product } from '../../../flowtype/product-types'
import type { TimeUnit } from '../../../flowtype/common-types'
import Dialog from '../Dialog'

import style from './choose-access-period.pcss'

export type Props = {
    dataPerUsd: ?number,
    product: Product,
    onNext: (time: number, timeUnit: TimeUnit) => void,
    onCancel: () => void,
}

type State = {
    time: number,
    timeUnit: TimeUnit,
}

class ChooseAccessPeriod extends React.Component<Props, State> {
    static parsePrice = (time: number, timeUnit: TimeUnit, pricePerSecond: number) => (
        !Number.isNaN(time) ? toSeconds(time, timeUnit) * pricePerSecond : '-'
    )

    state = {
        time: 1,
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
                title="Choose your access period"
                actions={{
                    cancel: {
                        title: 'Cancel',
                        onClick: onCancel,
                    },
                    next: {
                        title: 'Next',
                        color: 'primary',
                        onClick: () => onNext(time, timeUnit),
                        disabled: Number.isNaN(time),
                    },
                }}
            >
                <Form>

                    <FormGroup className={style.accessPeriodNumberSelector}>
                        <div>
                            <input
                                className={style.accessPeriodNumber}
                                type="text"
                                name="time"
                                id="time"
                                min={1}
                                value={!Number.isNaN(time) ? time : ''}
                                onChange={(e: SyntheticInputEvent<EventTarget>) => this.setState({
                                    time: parseInt(e.target.value, 10),
                                })}
                                onBlur={(e: SyntheticInputEvent<EventTarget>) => {
                                    if (parseInt(e.target.value, 10) <= 1) {
                                        this.setState({
                                            time: 1,
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
                                        {!Number.isNaN(time) ?
                                            (toSeconds(time, timeUnit) * product.pricePerSecond).toFixed(2) :
                                            '-'
                                        }
                                    </span>
                                    DATA
                                </div>

                                <div>
                                    <span>
                                        {!Number.isNaN(time) ?
                                            `$${(dataToUsd(toSeconds(time, timeUnit) * product.pricePerSecond, 1)).toFixed(2)}`
                                            : '-'
                                        }
                                    </span>
                                    USD
                                </div>

                            </div>
                        </div>
                    </FormGroup>
                </Form>

            </Dialog>
        )
        /*
        return (
            <Dialog
                title="Choose your access period"
                actions={{
                    cancel: {
                        title: 'Cancel',
                        onClick: onCancel,
                    },
                    next: {
                        title: 'Next',
                        color: 'primary',
                        onClick: () => onNext(time, timeUnit),
                        disabled: Number.isNaN(time),
                    },
                }}
            >
                <Form>
                    <FormGroup row>

                        <Col sm={10}>
                            <Input
                                type="number"
                                name="time"
                                id="time"
                                min={1}
                                value={!Number.isNaN(time) ? time : ''}
                                onChange={(e: SyntheticInputEvent<EventTarget>) => this.setState({
                                    time: parseInt(e.target.value, 10),
                                })}
                                onBlur={(e: SyntheticInputEvent<EventTarget>) => {
                                    if (parseInt(e.target.value, 10) <= 1) {
                                        this.setState({
                                            time: 1,
                                        })
                                    }
                                }}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="timeUnit" sm={2}>Time unit</Label>
                        <Col sm={10}>
                            <Input
                                type="select"
                                name="timeUnit"
                                id="timeUnit"
                                value={timeUnit}
                                onChange={(e: SyntheticInputEvent<EventTarget>) => this.setState({
                                    timeUnit: (((e.target.value): any): TimeUnit),
                                })}
                            >
                                {Object.keys(timeUnits).map((unit) => (
                                    <option key={unit} value={unit}>{timeUnits[unit]}</option>
                                ))}
                            </Input>
                        </Col>
                    </FormGroup>
                    <Row>
                        <Col
                            sm={{
                                size: 4,
                                offset: 2,
                            }}
                        >
                            {ChooseAccessPeriod.parsePrice(time, timeUnit, pricePerSecondInData)} DATA
                        </Col>
                        <Col sm={6}>
                            {ChooseAccessPeriod.parsePrice(time, timeUnit, pricePerSecondInUsd)} USD
                        </Col>
                    </Row>
                </Form>
            </Dialog>
        )
        */
    }
}

export default ChooseAccessPeriod
