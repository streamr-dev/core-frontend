import React from 'react'
import cx from 'classnames'
import styles from './meatball.pcss'
type Props = {
    alt: string
    blue?: boolean
    gray?: boolean
    gray2?: boolean
    white?: boolean
    disabled?: boolean
    vertical?: boolean
}

const Meatball = ({ alt, blue, gray, gray2, white, disabled, vertical }: Props) => (
    <div
        className={cx(styles.root, {
            [styles.blue]: !!blue,
            [styles.gray]: !!gray,
            [styles.gray2]: !!gray2,
            [styles.white]: !!white,
            [styles.disabled]: !!disabled,
        })}
        data-test-hook="meatball"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={vertical ? '0 0 4 20' : '0 0 20 4'}
            width={vertical ? '4' : '20'}
            height={vertical ? '20' : '4'}
            data-alt={alt}
        >
            <circle cx="2" cy="2" r="2" />
            <circle cx={vertical ? '2' : '10'} cy={vertical ? '10' : '2'} r="2" />
            <circle cx={vertical ? '2' : '18'} cy={vertical ? '18' : '2'} r="2" />
        </svg>
    </div>
)

export default Meatball
