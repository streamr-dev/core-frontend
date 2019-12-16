// @flow

import React, { useState, useCallback } from 'react'
import cx from 'classnames'

import Checkbox from '$shared/components/Checkbox'

import styles from './confirmCheckbox.pcss'

type Props = {
    title: string,
    subtitle: string,
    onToggle: (boolean) => void,
    className?: string
}

export const ConfirmCheckbox = ({ title, subtitle, onToggle: onToggleProp, className }: Props) => {
    const [confirmed, setConfirmed] = useState(false)

    const onToggle = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        setConfirmed(e.target.checked)
        onToggleProp(e.target.checked)
    }, [onToggleProp])

    return (
        <div
            className={cx(styles.root, styles.ConfirmCheckbox, className)}
        >
            <Checkbox value={confirmed} onChange={onToggle} />
            <div>
                <div className={styles.title}>{title}</div>
                <div className={styles.subtitle}>{subtitle}</div>
            </div>
        </div>
    )
}

export default ConfirmCheckbox
