// @flow

import React from 'react'
import cx from 'classnames'
import styles from './hamburgerButton.pcss'

type Props = {
    className?: string,
}

const HamburgerButton = ({ className, ...props }: Props) => (
    <button
        className={cx(styles.root, className)}
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

export default HamburgerButton
