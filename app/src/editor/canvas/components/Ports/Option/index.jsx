// @flow

import React, { useCallback } from 'react'
import cx from 'classnames'
import styles from './option.pcss'

type Props = {
    activated?: boolean,
    className?: string,
    disabled?: boolean,
    onToggle?: ?(string) => void,
    name: 'drivingInput' | 'noRepeat',
}

const options = {
    drivingInput: {
        name: 'Driving Input',
        abbr: 'DI',
    },
    noRepeat: {
        name: 'No Repeat',
        abbr: 'NR',
    },
}

const Option = ({
    activated,
    className,
    disabled,
    name,
    onToggle,
}: Props) => {
    const onClick = useCallback(() => {
        if (onToggle) {
            onToggle(name)
        }
    }, [name, onToggle])

    return (
        <div
            className={cx(styles.root, className, {
                [styles.activated]: !!activated,
                [styles[name]]: true,
            })}
        >
            <div className={styles.inner}>
                <button
                    disabled={!!disabled}
                    onClick={onClick}
                    title={`${options[name].name}: ${activated ? 'On' : 'Off'}`}
                    type="button"
                >
                    {options[name].abbr}
                </button>
            </div>
        </div>
    )
}

export default Option
