// @flow

import React, { useCallback } from 'react'
import { I18n } from 'react-redux-i18n'
import cx from 'classnames'

import type { Stream } from '$shared/flowtype/stream-types'
import SvgIcon from '$shared/components/SvgIcon'
import Slider from './Slider'

import styles from './securityView.pcss'

type Props = {
    disabled: boolean,
    stream: Stream,
    updateStream?: Function,
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

const securityLevels = {
    basic: {
        title: 'userpages.streams.security.basic.title',
        shortDescription: 'userpages.streams.security.basic.shortDescription',
        longDescription: 'userpages.streams.security.basic.longDescription',
        icons: {
            normal: 'lock',
            selected: 'lock',
            highlighted: 'lock',
            small: 'lock',
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
            small: 'checkBadgeHD',
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
            small: 'lock',
        },
        config: {
            requireSignedData: true,
            requireEncryptedData: true,
        },
    },
}

type SecurityLevelSymbol = $Keys<typeof securityLevels>

/**
 * Map stream flags to a security level e.g. basic, signed, etc
 */
export function getSecurityLevel({ requireSignedData, requireEncryptedData }: any) {
    return Object.keys(securityLevels).find((level: SecurityLevelSymbol) => {
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

export const getSecurityLevelConfig = (stream: any) => (
    securityLevels[getSecurityLevel(stream) || 'basic']
)

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

function setSecurityLevel(level: SecurityLevelSymbol) {
    const { config } = securityLevels[level]
    return config
}

type SecurityIconProps = {
    className?: string,
    level?: SecurityLevelSymbol,
    mode?: 'selected' | 'highlighted' | 'normal' | 'small',
    hideBasic?: boolean,
    hideSigned?: boolean,
}

export function SecurityIcon({
    className,
    level,
    mode = 'normal',
    hideBasic = false,
    hideSigned = false,
    ...props
}: SecurityIconProps = {}) {
    if (!!hideBasic && level === 'basic') { return null }
    if (!!hideSigned && level === 'signed') { return null }
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

export function SecurityView({ stream, disabled, updateStream }: Props) {
    const level = getSecurityLevel(stream) || 'basic'
    const levelIndex = Object.keys(securityLevels).indexOf(level)
    const detail = securityLevels[level]

    const onChange = useCallback((event, newLevel) => {
        if (typeof updateStream === 'function') {
            updateStream(setSecurityLevel(newLevel))
        }
    }, [updateStream])

    return (
        <div className={styles.root}>
            <p className={styles.description}>
                <strong>{I18n.t(detail.shortDescription)}</strong>&nbsp;
                {I18n.t(detail.longDescription)}
            </p>
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
                            data-hook={`level-${index}`}
                            key={key}
                            className={cx(styles.SecurityOption, {
                                [styles.disabled]: disabled,
                                [styles.highlighted]: highlighted,
                                [styles.selected]: selected,
                            })}
                        >
                            <input
                                type="radio"
                                checked={index === levelIndex}
                                onChange={(event) => onChange(event, key)}
                                disabled={disabled}
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

export default SecurityView
