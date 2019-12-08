// @flow

import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import cx from 'classnames'

import type { Stream } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import { updateEditStream } from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'
import SvgIcon from '$shared/components/SvgIcon'
import Slider from './Slider'

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

const securityLevels = {
    basic: {
        title: 'userpages.streams.security.basic.title',
        shortDescription: 'userpages.streams.security.basic.shortDescription',
        longDescription: 'userpages.streams.security.basic.longDescription',
        icons: {
            normal: 'lock',
            selected: 'lock',
            highlighted: 'lock',
        },
        config: {
            requireSignedData: false,
            requireEncryptedData: false,
        },
    },
    signed: {
        title: 'userpages.streams.security.signed.title',
        shortDescription: 'userpages.streams.security.signed.shortDescription',
        longDescription: 'userpages.streams.security.signed.longDescription',
        icons: {
            normal: 'checkBadgeOutline',
            selected: 'checkBadge',
            highlighted: 'checkBadge',
        },
        config: {
            requireSignedData: true,
            requireEncryptedData: false,
        },
    },
    encrypted: {
        title: 'userpages.streams.security.encrypted.title',
        shortDescription: 'userpages.streams.security.encrypted.shortDescription',
        longDescription: 'userpages.streams.security.encrypted.longDescription',
        icons: {
            normal: 'lockOutline',
            selected: 'lock',
            highlighted: 'lock',
        },
        config: {
            requireSignedData: true,
            requireEncryptedData: true,
        },
    },
}

/**
 * Map stream flags to a security level e.g. basic, signed, etc
 */
// $FlowFixMe
export function getSecurityLevel({ requireSignedData, requireEncryptedData }) {
    return Object.keys(securityLevels).find((level) => {
        const { config } = securityLevels[level]
        if (level === 'encrypted') {
            return config.requireEncryptedData === requireEncryptedData
        }
        return (
            config.requireSignedData === requireSignedData
            && config.requireEncryptedData === requireEncryptedData
        )
    })
}

export function getSecurityLevelTitle(stream: Stream) {
    if (!stream) { return '' }
    const level = getSecurityLevel(stream)
    if (!level) { return '' }
    const config = securityLevels[level]
    if (!config) { return '' }
    return I18n.t(config.title)
}

/**
 * Extracts config to be applied to stream for passed in current security level
 */

function setSecurityLevel(level) {
    const { config } = securityLevels[level]
    return config
}

// $FlowFixMe
type SecurityIconProps = {
    className?: string,
    level?: string,
    mode?: 'selected' | 'highlighted' | 'normal',
    hideBasic?: boolean,
}

export function SecurityIcon({
    className,
    level,
    mode = 'normal',
    hideBasic = false,
    ...props
}: SecurityIconProps = {}) {
    if (!!hideBasic && level === 'basic') { return null }
    if (!level) { return null }
    const { icons } = securityLevels[level]
    return (
        <SvgIcon
            {...props}
            title={I18n.t(securityLevels[level].title)}
            className={cx(styles.SecurityIcon, className, styles[level])}
            name={icons[mode]}
        />
    )
}

export function SecurityView(props: Props) {
    const { stream, updateEditStream } = props
    const level = getSecurityLevel(stream) || 'basic'
    const levelIndex = Object.keys(securityLevels).indexOf(level)
    const detail = securityLevels[level]
    const onChange = useCallback((event, newLevel) => {
        if (stream) {
            updateEditStream({
                ...stream,
                ...setSecurityLevel(newLevel),
            })
        }
    }, [updateEditStream, stream])
    return (
        <div className={styles.root}>
            <p className={styles.description}>
                <strong>{I18n.t(detail.shortDescription)}</strong>&nbsp;
                {I18n.t(detail.longDescription)}
            </p>
            {/* $FlowFixMe */}
            <div className={cx(styles.SecurityOptions, styles[level])}>
                <Slider index={levelIndex} selector="input[type=radio]" />
                {Object.keys(securityLevels).map((key, index) => {
                    const selected = index === levelIndex
                    const highlighted = index <= levelIndex
                    let mode = 'normal'
                    if (highlighted) { mode = 'highlighted' }
                    if (selected) { mode = 'selected' }
                    return (
                        <label
                            key={key}
                            className={cx(styles.SecurityOption, {
                                [styles.highlighted]: highlighted,
                                [styles.selected]: selected,
                            })}
                        >
                            <input
                                type="radio"
                                checked={index === levelIndex}
                                onChange={(event) => onChange(event, key)}
                            />
                            <SecurityIcon
                                className={styles.SecurityLevelIcon}
                                level={key}
                                mode={mode}
                            />
                            <span className={styles.Title}>{I18n.t(securityLevels[key].title)}</span>
                        </label>
                    )
                })}
            </div>
        </div>
    )
}

/*
 * Renders nothing while stream not set up.
 * Prevents needless complication with hooks.
 */

function SecurityViewMaybe(props: Props) {
    const { stream } = props
    // stream initially an empty object
    if (!stream || !Object.keys(stream).length) { return null }
    return <SecurityView {...props} />
}

const mapStateToProps = (state: StoreState): StateProps => ({
    stream: selectEditedStream(state),
})

const mapDispatchToProps = { updateEditStream }

export default connect(mapStateToProps, mapDispatchToProps)(SecurityViewMaybe)
