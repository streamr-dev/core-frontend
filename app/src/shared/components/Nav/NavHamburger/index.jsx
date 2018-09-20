// @flow

import React from 'react'
import classNames from 'classnames'
import styles from './navHamburger.pcss'

type Props = {
    open?: boolean,
    onClick: (SyntheticInputEvent<EventTarget>) => void,
    opaqueNav?: boolean,
}

const NavHamburger = ({ open, onClick, opaqueNav }: Props) => (
    <a href="#" className={classNames(styles.link, (open ? styles.open : styles.closed))} onClick={onClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" className={styles.x}>
            <path
                fill="#323232"
                d="M10 5.5858l4.2426-4.2427 1.4143 1.4143L11.4142 7l4.2427 4.2426-1.4143
                1.4143L10 8.4142l-4.2426 4.2427-1.4143-1.4143L8.5858 7 4.3431 2.7574l1.4143-1.4143z"
            />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" className={styles.hamburger}>
            <path
                fill={opaqueNav ? '#323232' : '#ffffff'}
                fillRule="evenodd"
                d="M0 6h20v2H0V6zm0-6h20v2H0V0zm0 12h20v2H0v-2z"
            />
        </svg>
    </a>
)

export default NavHamburger
