// @flow

import React, { type Node } from 'react'
import classNames from 'classnames'
import styles from './navLink.pcss'
import screensToClassNames from '../screens'
import Link from '../../../Link'

type Props = {
    children: Node,
    opaqueNav?: boolean,
    desktop?: boolean,
    mobile?: boolean,
    className?: string,
    closeNav?: () => void,
    onClick?: (SyntheticInputEvent<EventTarget>) => void,
}

class NavLink extends React.Component<Props> {
    onClick = (e: SyntheticInputEvent<EventTarget>) => {
        const { onClick, closeNav } = this.props
        closeNav && closeNav()
        onClick && onClick(e)
    }

    render() {
        const { className, children, opaqueNav, mobile, desktop, ...props } = this.props

        return (
            <Link
                className={classNames(className, styles.navLink, opaqueNav && styles.opaqueNav, screensToClassNames(!!mobile, !!desktop))}
                onClick={this.onClick}
                {...props}
            >
                <span className={styles.inner}>
                    {children}
                </span>
            </Link>
        )
    }
}

export default NavLink
