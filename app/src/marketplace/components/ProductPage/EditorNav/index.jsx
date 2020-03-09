// @flow

import React, { useMemo, useState, useEffect } from 'react'
import cx from 'classnames'
import findLastIndex from 'lodash/findLastIndex'

import Icons from './Icons'

import styles from './editorNav.pcss'

export const statuses = {
    EMPTY: 'empty',
    VALID: 'valid',
    ERROR: 'error',
    UNPUBLISHED: 'unpublished',
}

const statusIcons = {
    [statuses.EMPTY]: 'default',
    [statuses.VALID]: 'valid',
    [statuses.ERROR]: 'error',
    [statuses.UNPUBLISHED]: 'unpublished',
}

type Section = {
    // eslint-disable-next-line react/no-unused-prop-types
    id: string,
    heading: string,
    onClick?: Function,
    href?: string,
    status: $Values<typeof statuses>,
    seen?: boolean,
    active?: boolean,
}

const isSet = (status) => !!status && status !== statuses.EMPTY

const isError = (status) => !!status && status === statuses.ERROR

const NavSection = ({
    heading,
    onClick,
    href,
    status = statuses.EMPTY,
    seen = false,
    active = false,
}: Section) => {
    const iconName = useMemo(() => {
        if (seen) {
            if (active) {
                return isError(status) ? 'activeError' : 'active'
            }
            if (!isSet(status)) {
                return 'seen'
            }
        }

        return statusIcons[status] || 'default'
    }, [status, seen, active])

    return (
        <div
            className={cx(styles.navSection, {
                [styles.active]: !!active,
            })}
            aria-label={heading}
        >
            <div className={styles.heading}>
                {!!href && (
                    <a href={href} onClick={onClick}>{heading}</a>
                )}
                {!href && (
                    <button type="button" onClick={onClick}>{heading}</button>
                )}
            </div>
            <div className={styles.status}>
                <div className={styles.marker}>
                    <Icons name={iconName} className={styles.icon} />
                </div>
            </div>
        </div>
    )
}

type Props = {
    sections: Array<Section>,
    activeSection?: string,
    showValidation?: boolean,
    trackScrolling?: boolean,
    className?: string,
}

const EditorNav = ({
    sections,
    activeSection,
    showValidation,
    trackScrolling,
    className,
}: Props) => {
    const [highestSeenSection, setHighestSeenSection] = useState(-1)

    useEffect(() => setHighestSeenSection((prev) => {
        if (!trackScrolling) { return sections.length - 1 }

        const highest = findLastIndex(sections, ({ id, status }) => id === activeSection || isSet(status))

        return Math.min(highest > prev ? highest : prev, sections.length - 1)
    }), [trackScrolling, sections, activeSection])

    return (
        <div className={cx(styles.root, styles.EditorNav, className)}>
            <div className={styles.progressBar}>
                <div className={styles.baseTrack} />
                <div
                    className={styles.progressTrack}
                    style={{
                        height: !trackScrolling ? '100%' : `${(Math.max(0, highestSeenSection) / Math.max(1, sections.length - 1)) * 100}%`,
                    }}
                />
            </div>
            {sections.map(({ id, status, ...rest }, index) => (
                <NavSection
                    {...rest}
                    key={id}
                    id={id}
                    status={(showValidation || status === statuses.UNPUBLISHED) ? status : statuses.EMPTY}
                    active={id === activeSection}
                    seen={highestSeenSection >= index}
                />
            ))}
        </div>
    )
}

export default EditorNav
