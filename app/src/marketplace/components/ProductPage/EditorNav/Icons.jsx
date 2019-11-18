// @flow

import React from 'react'
import cx from 'classnames'

import styles from './icons.pcss'

type Props = {
    name: string,
}

const InnerIcon = ({ name }: Props) => {
    switch (name) {
        case 'default':
        case 'seen':
        case 'active':
        case 'activeError':
            return (
                <circle
                    cx="8"
                    cy="8"
                    r="4"
                    className={cx(styles.inner, {
                        [styles.innerActive]: name === 'active',
                        [styles.innerError]: name === 'activeError',
                    })}
                />
            )

        case 'valid':
            return (
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.306 8.19l1.65 1.792 4.243-4.243" />
            )

        case 'error':
            return (
                <path d="M8 5v3.918M7.986 10.904l.014.014" strokeLinecap="round" />
            )

        case 'unpublished':
            return (
                <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3">
                    <path d="M10.762 5.612a3.638 3.638 0 00-6.35 2.426v.304M5.34 10.464a3.638 3.638 0 006.348-2.425v-.303" />
                    <path d="M10.779 8.644l.91-.91.909.91M5.322 7.431l-.91.91-.909-.91" />
                </g>
            )

        default:
            return null
    }
}

const Icons = ({ name, ...props }: Props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
        <g
            fill="currentFill"
            fillRule="evenodd"
            strokeWidth="1.5"
            stroke="currentStroke"
            className={cx(styles.outer, {
                [styles.outerActive]: !!(name && name !== 'default'),
                [styles.outerError]: !!(name === 'activeError' || name === 'error'),
            })}
        >
            <circle
                cx="8"
                cy="8"
                r="7.25"
            />
            <InnerIcon name={name} />
        </g>
    </svg>
)

export default Icons
