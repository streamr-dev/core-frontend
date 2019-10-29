// @flow

import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import cx from 'classnames'

import type { Stream } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import { updateEditStream } from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'
import SplitControl from '$userpages/components/SplitControl'
import TextInput from '$shared/components/TextInput'
import Dropdown from '$shared/components/Dropdown'

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
    const { stream, updateEditStream } = props
    // $FlowFixMe
    const { disabled, inactivityThresholdHours } = stream

    // init units based on initial threshold value
    // don't calculate on the fly otherwise
    // user inputting 24 hours would immediately turn into 1 day
    const [units, setUnits] = useState(getUnits(inactivityThresholdHours))
    const [value, setValue] = useState(String(hoursToUnits(inactivityThresholdHours, units)))

    const onCommit = useCallback(() => {
        let numberValue = Number.parseInt(value, 10)
        // if entered value is NaN use existing value
        numberValue = Number.isNaN(numberValue) ? hoursToUnits(inactivityThresholdHours, units) : numberValue
        setValue(String(numberValue))
        updateEditStream({
            ...stream,
            inactivityThresholdHours: unitsToHours(numberValue, units),
        })
    }, [stream, updateEditStream, inactivityThresholdHours, value, units])

    const onChangeUnits = useCallback((newUnits) => {
        setUnits(newUnits)
    }, [setUnits])

    const onChange = useCallback((event) => {
        setValue(event.target.value)
    }, [setValue])

    return (
        <div className={styles.root}>
            <p className={styles.description}>
                {I18n.t('userpages.streams.inactivityDescription')}
            </p>
            <div className={cx(styles.InactivityOptions)}>
                <SplitControl>
                    <TextInput
                        label=""
                        type="number"
                        value={value}
                        onChange={onChange}
                        onBlur={onCommit}
                        disabled={disabled}
                    />
                    <Dropdown
                        title=""
                        selectedItem={units}
                        onChange={onChangeUnits}
                        className={styles.permissionsDropdown}
                        disabled={disabled}
                    >
                        <Dropdown.Item value="days">{I18n.t('userpages.streams.inactivityDays')}</Dropdown.Item>
                        <Dropdown.Item value="hours">{I18n.t('userpages.streams.inactivityHours')}</Dropdown.Item>
                    </Dropdown>
                </SplitControl>
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
