// @flow

import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'

import type { Stream } from '$shared/flowtype/stream-types'
import Text from '$ui/Text'
import Select from '$ui/Select'
import Label from '$ui/Label'

type Props = {
    disabled: boolean,
    stream: Stream,
    updateStream?: Function,
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

const Description = styled.p`
    margin-bottom: 3rem;
`

const InputContainer = styled.div`
    display: grid;
    grid-template-columns: 5rem 11rem;
    grid-column-gap: 1rem;
`

export function StatusView({ disabled, stream, updateStream }: Props) {
    const { inactivityThresholdHours = 0 } = stream || {}

    // init units based on initial threshold value
    // don't calculate on the fly otherwise
    // user inputting 24 hours would immediately turn into 1 day
    const [units, setUnits] = useState(getUnits(inactivityThresholdHours))
    const [value, setValue] = useState(String(hoursToUnits(inactivityThresholdHours, units)))

    const unitOptions: Array<any> = useMemo(() => ([
        {
            value: 'days',
            label: 'Days',
        },
        {
            value: 'hours',
            label: 'Hours',
        },
    ]), [])

    const onCommit = useCallback(() => {
        let numberValue = Number.parseInt(value, 10)
        // if entered value is NaN use existing value
        numberValue = Number.isNaN(numberValue) ? hoursToUnits(inactivityThresholdHours, units) : numberValue
        setValue(String(numberValue))

        if (typeof updateStream === 'function') {
            updateStream({
                inactivityThresholdHours: Math.max(0, unitsToHours(numberValue, units)),
            })
        }
    }, [updateStream, inactivityThresholdHours, value, units])

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
            <Description>
                If no new data is published to this stream, it will be shown as inactive after this period of time.
                {' '}
                Adjust the threshold to an appropriate period for your stream&apos;s frequency.
            </Description>
            <Label htmlFor="inactivityValue">
                Inactivity threshold
            </Label>
            <InputContainer>
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
            </InputContainer>
        </div>
    )
}

export default StatusView
