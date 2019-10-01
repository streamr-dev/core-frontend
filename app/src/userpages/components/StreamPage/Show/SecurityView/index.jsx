// @flow

import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import cx from 'classnames'

import type { Stream } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import { updateEditStream } from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'

import styles from './securityView.pcss'

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

const securityLevels = {
    basic: {
        title: 'userpages.streams.security.basic.title',
        shortDescription: 'userpages.streams.security.basic.shortDescription',
        longDescription: 'userpages.streams.security.basic.longDescription',
        config: {
            requireSignedData: false,
            requireEncryptedData: false,
        },
    },
    signed: {
        title: 'userpages.streams.security.signed.title',
        shortDescription: 'userpages.streams.security.signed.shortDescription',
        longDescription: 'userpages.streams.security.signed.longDescription',
        config: {
            requireSignedData: true,
            requireEncryptedData: false,
        },
    },
    encrypted: {
        title: 'userpages.streams.security.encrypted.title',
        shortDescription: 'userpages.streams.security.encrypted.shortDescription',
        longDescription: 'userpages.streams.security.encrypted.longDescription',
        config: {
            requireSignedData: true,
            requireEncryptedData: true,
        },
    },
}

/*
 * The security slider manipulates two boolean fields on the Stream object.
 * The slider setting maps to these booleans as follows:
 * Basic:
 * requireSignedData: false
 * requireEncryptedData: false
 * Signed:
 * requireSignedData: true
 * requireEncryptedData: false
 * Encrypted:
 * requireSignedData: true
 * requireEncryptedData: true
 *
 * Note that the missing combination (requireSignedData: false, requireEncryptedData: true)
 * does not make sense.
 * If such a combination is encountered by the frontend for any reason, it should display the slider in the “Encrypted” setting.
 */

function getSecurityLevel({ requireSignedData, requireEncryptedData }) {
    return Object.keys(securityLevels).find((level) => {
        const { config } = securityLevels[level]
        if (level === 'encrypted') {
            return config.requireEncryptedData === requireEncryptedData
        }
        return (
            config.requireSignedData === requireSignedData
            && config.requireEncryptedData === requireEncryptedData
        )
    }) || 'basic'
}

function setSecurityLevel(level) {
    const { config } = securityLevels[level]
    return config
}

function SecurityViewMaybe(props: Props) {
    const { stream } = props
    if (!stream) { return null }
    return <SecurityView {...props} />
}

export function SecurityView(props: Props) {
    const { stream, updateEditStream } = props
    // $FlowFixMe
    const level = getSecurityLevel(stream)
    const levelIndex = Object.keys(securityLevels).indexOf(level)
    const detail = securityLevels[level]
    const onChange = useCallback((event, newLevel) => {
        updateEditStream({
            ...stream,
            ...setSecurityLevel(newLevel),
        })
    }, [updateEditStream, stream])
    return (
        <div className={styles.root}>
            <p>
                <strong>{I18n.t(detail.shortDescription)}</strong>&nbsp;
                {I18n.t(detail.longDescription)}
            </p>
            <div className={styles.SecuritySlider}>
                {Object.keys(securityLevels).map((key, index) => (
                    <label
                        className={cx(styles.SecuritySliderItem, {
                            [styles.highlighted]: index <= levelIndex,
                            [styles.selected]: index === levelIndex,
                        })}
                    >
                        <span>{I18n.t(securityLevels[key].title)}</span>
                        <input type="radio" checked={index === levelIndex} onChange={(event) => onChange(event, key)} />
                    </label>
                ))}
            </div>
        </div>
    )
}

const mapStateToProps = (state: StoreState): StateProps => ({
    stream: selectEditedStream(state),
})

const mapDispatchToProps = { updateEditStream }

export default connect(mapStateToProps, mapDispatchToProps)(SecurityViewMaybe)
