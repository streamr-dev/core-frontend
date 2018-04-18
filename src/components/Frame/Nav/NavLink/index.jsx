// @flow

import React, { type Node } from 'react'
import classNames from 'classnames'
import screensToClassNames from '../screens'
import styles from './navLink.pcss'

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
        if (closeNav) {
            closeNav()
        }
        if (onClick) {
            onClick(e)
        }
    }

    render() {
        const {
            className,
            children,
            opaqueNav,
            mobile,
            closeNav,
            desktop,
            ...props
        } = this.props

        return (
            <a
                href="#"
                className={classNames(className, styles.navLink, opaqueNav && styles.opaqueNav, screensToClassNames(!!mobile, !!desktop))}
                onClick={this.onClick}
                {...props}
            >
                <span className={styles.inner}>
                    {children}
                </span>
            </a>
        )
    }
}

export default NavLink
