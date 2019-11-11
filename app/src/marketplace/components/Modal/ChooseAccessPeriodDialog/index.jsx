// @flow

import React, { useState, useCallback, useMemo } from 'react'
import BN from 'bignumber.js'
import { Form, FormGroup } from 'reactstrap'
import { I18n } from 'react-redux-i18n'

import { toSeconds } from '$mp/utils/time'
import { dataToUsd, usdToData, formatDecimals } from '$mp/utils/price'
import { currencies } from '$shared/utils/constants'
import type { Product } from '$mp/flowtype/product-types'
import type { Currency, NumberString, TimeUnit } from '$shared/flowtype/common-types'
import Dialog from '$shared/components/Dialog'

import TimeUnitSelector from './TimeUnitSelector'
import style from './chooseAccessPeriod.pcss'

export type Props = {
    dataPerUsd: ?NumberString,
    pricePerSecond: $ElementType<Product, 'pricePerSecond'>,
    priceCurrency: $ElementType<Product, 'priceCurrency'>,
    onNext: (time: NumberString, timeUnit: TimeUnit) => Promise<void>,
    onCancel: () => void,
}

const parsePrice = (time: NumberString | BN, timeUnit: TimeUnit, pricePerSecond: BN, currency: Currency) => {
    if (!BN(time).isNaN() && BN(time).isGreaterThan(0)) {
        return formatDecimals(toSeconds(time, timeUnit).multipliedBy(pricePerSecond), currency).toString()
    }
    return '-'
}

export const ChooseAccessPeriodDialog = ({
    pricePerSecond,
    priceCurrency,
    onNext: onNextProp,
    onCancel,
    dataPerUsd,
}: Props) => {
    const [time, setTime] = useState('1')
    const [timeUnit, setTimeUnit] = useState('hour')
    const [waiting, setWaiting] = useState(false)

    const [priceinData, priceInUsd] = useMemo(() => {
        const pricePerSecondInData = priceCurrency === currencies.DATA ?
            pricePerSecond :
            usdToData(pricePerSecond, dataPerUsd)

        const pricePerSecondInUsd = priceCurrency === currencies.USD ?
            pricePerSecond :
            dataToUsd(pricePerSecond, dataPerUsd)

        return [
            parsePrice(time, timeUnit, pricePerSecondInData, currencies.DATA),
            parsePrice(time, timeUnit, pricePerSecondInUsd, currencies.USD),
        ]
    }, [dataPerUsd, priceCurrency, pricePerSecond, time, timeUnit])

    const onNext = useCallback(async (selectedTime: NumberString | BN, selectedTimeUnit: TimeUnit) => {
        setWaiting(true)

        await onNextProp(selectedTime, selectedTimeUnit)
    }, [onNextProp])

    return (
        <Dialog
            onClose={onCancel}
            title={I18n.t('modal.chooseAccessPeriod.title')}
            actions={{
                cancel: {
                    title: I18n.t('modal.common.cancel'),
                    onClick: onCancel,
                    type: 'link',
                },
                next: {
                    title: I18n.t('modal.common.next'),
                    type: 'primary',
                    outline: true,
                    onClick: () => onNext(time, timeUnit),
                    disabled: BN(time).isNaN() || BN(time).isLessThanOrEqualTo(0) || waiting,
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
                        onChange={(e: SyntheticInputEvent<EventTarget>) => setTime(e.target.value)}
                        onBlur={(e: SyntheticInputEvent<EventTarget>) => {
                            if (parseInt(e.target.value, 10) <= 1) {
                                setTime('1')
                            }
                        }}
                    />
                </FormGroup>
                <FormGroup tag="fieldset" className={style.timeUnitFieldset}>
                    <div className={style.timeUnitSelectionCol}>
                        <TimeUnitSelector timeUnit={timeUnit} onChange={setTimeUnit} />
                        <div className={style.priceLabels}>
                            <div className={style.priceColumn}>
                                <span className={style.priceValue}>
                                    {priceinData}
                                </span>
                                <span className={style.priceLabel}>
                                    {currencies.DATA}
                                </span>
                            </div>
                            <div className={style.priceColumn}>
                                <span className={style.priceValue}>
                                    ${priceInUsd}
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

export default ChooseAccessPeriodDialog
