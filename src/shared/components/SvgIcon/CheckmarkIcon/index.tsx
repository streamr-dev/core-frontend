import React from 'react'
import classNames from 'classnames'
import styles from './checkmarkIcon.pcss'
export type IconSize = 'small' | 'large'
type Props = {
    size?: IconSize
    className?: string
}

const CheckmarkIcon = ({ size, className }: Props) => (
    <svg
        className={classNames(className, styles[size], styles.checkmark)}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
    >
        <g fill="none" fillRule="evenodd">
            <circle cx="10" cy="10" r="10" fill="#2AC437" />
            <path
                stroke="#FFF"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M6.271 10.55l2.2 2.39 5.657-5.658"
            />
        </g>
    </svg>
)

CheckmarkIcon.defaultProps = {
    size: 'small',
}
export default CheckmarkIcon
