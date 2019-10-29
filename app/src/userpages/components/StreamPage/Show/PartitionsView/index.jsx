// @flow

import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import type { Stream } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import { updateEditStream } from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'
import SplitControl from '$userpages/components/SplitControl'
import TextInput from '$shared/components/TextInput'
import Dropdown from '$shared/components/Dropdown'

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

function PartitionsView(props: Props) {
    const { stream, updateEditStream, disabled } = props
    // $FlowFixMe
    const { partitions } = stream

    const [value, setValue] = useState(String(partitions))

    const onCommit = useCallback(() => {
        let numberValue = Number.parseInt(value, 10)
        // if entered value is NaN use existing value
        numberValue = Number.isNaN(numberValue) ? partitions : numberValue
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
                <Link to={`${routes.docsStreams()}#partitioning`}>
                    {I18n.t('userpages.streams.partitionsReadMore')}
                </Link>.
            </p>
            <div className={cx(styles.InactivityOptions)}>
                <TextInput
                    label=""
                    type="number"
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
