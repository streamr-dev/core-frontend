// @flow

import React, { useCallback, useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import type { Stream } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import { updateEditStream } from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'
import TextInput from '$shared/components/TextInput'
import SelectInput from '$shared/components/SelectInput'

import styles from './statusView.pcss'

type OwnProps = {
    disabled: boolean,
}

type StateProps = {
    stream: ?Stream,
}

type DispatchProps = {
    updateEditStream: (Stream) => void,
}

type Props = OwnProps & StateProps & DispatchProps

function hoursToUnits(value, units) {
    return units === 'days' ? value / 24 : value
}

function unitsToHours(value, units) {
    return units === 'days' ? value * 24 : value
}

function getUnits(value) {
    return (value !== 0 && value % 24 === 0) ? 'days' : 'hours'
}

function StatusView(props: Props) {
    const { disabled, stream, updateEditStream } = props
    // $FlowFixMe
    const { inactivityThresholdHours } = stream

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
        updateEditStream({
            ...stream,
            inactivityThresholdHours: Math.max(0, unitsToHours(numberValue, units)),
        })
    }, [stream, updateEditStream, inactivityThresholdHours, value, units])

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
                <TextInput
                    label={I18n.t('userpages.streams.inactivityLabel')}
                    type="number"
                    value={value}
                    min="0"
                    hideButtons
                    onChange={onChange}
                    onBlur={onCommit}
                    disabled={disabled}
                    preserveLabelSpace
                />
                <SelectInput
                    label=""
                    options={unitOptions}
                    value={unitOptions.find((o) => o.value === units)}
                    onChange={(o) => onChangeUnits(o.value)}
                    preserveLabelSpace
                    disabled={disabled}
                />
            </div>
        </div>
    )
}

/*
 * Renders nothing while stream not set up.
 * Prevents needless complication with hooks.
 */

function StatusViewMaybe(props: Props) {
    const { stream } = props
    // stream initially an empty object
    if (!stream || !Object.keys(stream).length) { return null }
    return <StatusView {...props} />
}

const mapStateToProps = (state: StoreState): StateProps => ({
    stream: selectEditedStream(state),
})

const mapDispatchToProps = { updateEditStream }

export default connect(mapStateToProps, mapDispatchToProps)(StatusViewMaybe)
