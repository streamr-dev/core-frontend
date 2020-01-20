// @flow

import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'

import type { Stream } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import { updateEditStream } from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'
import Numeric from '$shared/components/Input/Numeric'
import FormControlLabel from '$shared/components/FormControlLabel'

import styles from './partitionsView.pcss'
import routes from '$routes'

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

const MIN_PARTITIONS = 1
const MAX_PARTITIONS = 99

function PartitionsView(props: Props) {
    // $FlowFixMe `updateEditStream` not in OwnProps or StateProps.
    const { stream, updateEditStream, disabled } = props
    const { partitions } = stream

    const [value, setValue] = useState(String(partitions))

    const onCommit = useCallback(() => {
        let numberValue = Number.parseInt(value, 10)
        // if entered value is NaN use existing value
        numberValue = Number.isNaN(numberValue) ? partitions : numberValue
        numberValue = Math.max(MIN_PARTITIONS, Math.min(numberValue, MAX_PARTITIONS))
        setValue(String(numberValue))
        updateEditStream({
            ...stream,
            partitions: numberValue,
        })
    }, [stream, updateEditStream, partitions, value])

    const onChange = useCallback((event) => {
        setValue(event.target.value)
    }, [setValue])

    return (
        <div className={styles.root}>
            <p className={styles.description}>
                {I18n.t('userpages.streams.partitionsDescription')}
                <Link to={routes.docsStreamsPartitioning()}>
                    {I18n.t('userpages.streams.partitionsReadMore')}
                </Link>.
            </p>
            <div className={styles.PartitionsOptions}>
                <FormControlLabel>
                    {I18n.t('userpages.streams.partitionsLabel')}
                </FormControlLabel>
                <Numeric
                    min={MIN_PARTITIONS}
                    max={MAX_PARTITIONS}
                    value={value}
                    onChange={onChange}
                    onBlur={onCommit}
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

function PartitionsViewMaybe(props: Props) {
    const { stream } = props
    // stream initially an empty object
    if (!stream || !Object.keys(stream).length) { return null }
    return <PartitionsView {...props} />
}

const mapStateToProps = (state: StoreState): StateProps => ({
    stream: selectEditedStream(state),
})

const mapDispatchToProps = { updateEditStream }

export default connect(mapStateToProps, mapDispatchToProps)(PartitionsViewMaybe)
