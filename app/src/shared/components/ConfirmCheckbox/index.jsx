// @flow

import React, { useState, useCallback } from 'react'
import cx from 'classnames'

import Checkbox from '$shared/components/Checkbox'

import styles from './confirmCheckbox.pcss'

type Props = {
    title: string,
    subtitle: string,
    onToggle: (boolean) => void,
    className?: string,
    disabled?: boolean,
}

export const ConfirmCheckbox = ({
    title,
    subtitle,
    onToggle: onToggleProp,
    className,
    disabled,
}: Props) => {
    const [confirmed, setConfirmed] = useState(false)

    const onToggle = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        setConfirmed(e.target.checked)
        onToggleProp(e.target.checked)
    }, [onToggleProp])

    return (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label
            className={cx(styles.root, styles.ConfirmCheckbox, {
                [styles.disabled]: !!disabled,
            }, className)}
        >
            <Checkbox value={confirmed} onChange={onToggle} disabled={disabled} />
            <div>
                <div className={styles.title}>{title}</div>
                <div className={styles.subtitle}>{subtitle}</div>
            </div>
        </label>
    )
}

export default ConfirmCheckbox
