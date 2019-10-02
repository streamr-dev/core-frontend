// @flow

import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import cx from 'classnames'

import type { Stream } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import { updateEditStream } from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'

import * as Icons from './Icons'

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
        icons: {
            normal: Icons.LockOutlineIcon,
            selected: Icons.LockOutlineIcon,
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
            normal: Icons.CheckBadgeOutlineIcon,
            selected: Icons.CheckBadgeIcon,
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
            normal: Icons.LockIcon,
            selected: Icons.LockIcon,
        },
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

function Slider({ index: selectedIndex = 0 } = {}) {
    const elRef = useRef()
    const [positions, setPositions] = useState()

    useLayoutEffect(() => {
        if (!elRef.current) { return }
        const target = elRef.current.parentElement
        const inputs = Array.from(target.querySelectorAll('input'))
        // $FlowFixMe
        const parent = target.getBoundingClientRect()
        const subtract = (a, b) => ({
            width: a.width,
            height: a.height,
            left: a.left - b.left,
            top: a.top - b.top,
        })
        setPositions(() => {
            const rects = inputs.map((input) => input.getBoundingClientRect())
            const positions = rects.map((rect) => subtract(rect, parent))
            const first = positions[0]
            const last = positions[positions.length - 1]
            const left = first.left + (first.width * 0.5)
            const width = (last.left + (last.width * 0.5)) - left

            return {
                positions,
                left,
                width,
            }
        })
    }, [])

    if (!positions) {
        // $FlowFixMe
        return <div className={styles.SliderBackground} ref={elRef} />
    }

    const selectedPosition = positions.positions[selectedIndex]
    console.log({ selectedPosition, positions })

    return (
        // $FlowFixMe
        <div className={styles.SecuritySlider} ref={elRef}>
            <div
                className={styles.SliderTrack}
                style={{
                    left: positions.left,
                    width: positions.width,
                }}
            >
                {positions.positions.map((p, index) => (
                    <div
                        key={p.left}
                        className={cx(styles.SliderStop, {
                            [styles.highlighted]: index <= selectedIndex,
                        })}
                        style={{
                            left: (p.left + (p.width * 0.5)) - positions.left,
                        }}
                    />
                ))}
            </div>
            <div
                className={cx(styles.SliderTrack, styles.SliderProgress)}
                style={{
                    left: positions.left,
                    width: (selectedPosition.left + (selectedPosition.width * 0.5)) - positions.left,
                }}
            >
                <div className={styles.SliderThumb}>
                    <div className={cx(styles.SliderStop, styles.highlighted)} />
                </div>
            </div>
        </div>
    )
}

function Icon({ level, selected, ...props }) {
    const { icons } = securityLevels[level]
    const CurrentIcon = selected ? icons.selected : icons.normal
    return <CurrentIcon className={styles.Icon} {...props} />
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
            {/* $FlowFixMe */}
            <div className={cx(styles.SecurityOptions, styles[level])}>
                <Slider index={levelIndex} />
                {Object.keys(securityLevels).map((key, index) => (
                    <label
                        key={key}
                        className={cx(styles.SecurityOption, {
                            [styles.highlighted]: index <= levelIndex,
                            [styles.selected]: index === levelIndex,
                        })}
                    >
                        <input
                            type="radio"
                            checked={index === levelIndex}
                            onChange={(event) => onChange(event, key)}
                        />
                        <Icon level={key} selected={index === levelIndex} />
                        <span>{I18n.t(securityLevels[key].title)}</span>
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
