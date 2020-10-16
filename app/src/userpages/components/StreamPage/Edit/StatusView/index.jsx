// @flow

import React, { useCallback, useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import type { Stream } from '$shared/flowtype/stream-types'
import { updateEditStream } from '$userpages/modules/userPageStreams/actions'
import Text from '$ui/Text'
import Select from '$ui/Select'
import Label from '$ui/Label'

import styles from './statusView.pcss'

type Props = {
    disabled: boolean,
    stream: Stream,
}

function hoursToUnits(value, units) {
    return units === 'days' ? value / 24 : value
}

function unitsToHours(value, units) {
    return units === 'days' ? value * 24 : value
}

function getUnits(value) {
    return (value !== 0 && value % 24 === 0) ? 'days' : 'hours'
}

export function StatusView({ disabled, stream }: Props) {
    const { inactivityThresholdHours } = stream || {}
    const dispatch = useDispatch()

    // init units based on initial threshold value
    // don't calculate on the fly otherwise
    // user inputting 24 hours would immediately turn into 1 day
    const [units, setUnits] = useState(getUnits(inactivityThresholdHours))
    const [value, setValue] = useState(String(hoursToUnits(inactivityThresholdHours, units)))

    const unitOptions: Array<any> = [
        {
            value: 'days',
            label: I18n.t('userpages.streams.inactivityDays'),
        },
        {
            value: 'hours',
            label: I18n.t('userpages.streams.inactivityHours'),
        },
    ]

    const onCommit = useCallback(() => {
        let numberValue = Number.parseInt(value, 10)
        // if entered value is NaN use existing value
        numberValue = Number.isNaN(numberValue) ? hoursToUnits(inactivityThresholdHours, units) : numberValue
        setValue(String(numberValue))
        dispatch(updateEditStream({
            ...stream,
            inactivityThresholdHours: Math.max(0, unitsToHours(numberValue, units)),
        }))
    }, [stream, dispatch, inactivityThresholdHours, value, units])

    const onChangeUnits = useCallback((newUnits) => {
        setUnits(newUnits)
    }, [setUnits])

    const onCommitRef = useRef(onCommit)
    onCommitRef.current = onCommit
    // commit when units change
    useEffect(() => {
        onCommitRef.current()
    }, [units])

    const onChange = useCallback((event) => {
        setValue(event.target.value)
    }, [setValue])

    return (
        <div>
            <p>
                {I18n.t('userpages.streams.inactivityDescription')}
            </p>
            <div className={styles.container}>
                <Label htmlFor="inactivityValue">
                    {I18n.t('userpages.streams.inactivityLabel')}
                </Label>
                <div className={styles.inner}>
                    <Text
                        id="inactivityValue"
                        value={value}
                        onChange={onChange}
                        onBlur={onCommit}
                        disabled={disabled}
                        name="inactivityValue"
                    />
                    <Select
                        options={unitOptions}
                        value={unitOptions.find((o) => o.value === units)}
                        onChange={(o) => onChangeUnits(o.value)}
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    )
}

export default StatusView
