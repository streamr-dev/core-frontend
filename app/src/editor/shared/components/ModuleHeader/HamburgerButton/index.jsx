// @flow

import React, { useCallback } from 'react'
import cx from 'classnames'
import styles from './hamburgerButton.pcss'

type Props = {
    className?: string,
    onFocus?: ?(e: SyntheticEvent<EventTarget>) => void,
}

const HamburgerButton = ({ className, onFocus: onFocusProp, ...props }: Props) => {
    const onFocus = useCallback((e: SyntheticEvent<EventTarget>) => {
        e.stopPropagation()

        if (onFocusProp) {
            onFocusProp(e)
        }
    }, [onFocusProp])

    return (
        <button
            className={cx(styles.root, className)}
            onFocus={onFocus}
            type="button"
            {...props}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g fill="none" fillRule="evenodd" stroke="#000000" strokeLinecap="round" strokeWidth="1.5">
                    <path d="M7 16h10M7 12h10M7 8h10" />
                </g>
            </svg>
        </button>
    )
}

export default HamburgerButton
