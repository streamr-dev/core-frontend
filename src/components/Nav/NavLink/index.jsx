// @flow

import * as React from 'react'
import classNames from 'classnames'

import screensToClassNames from '../screens'
import buttonStyles from '../../Button/button.pcss'
import styles from './navLink.pcss'

type Props = {
    children: React.Node,
    opaqueNav?: boolean,
    desktop?: boolean,
    mobile?: boolean,
    outline?: boolean,
    noDecorate?: boolean,
    className?: string,
    closeNav?: () => void,
    onClick?: (SyntheticInputEvent<EventTarget>) => void,
    href?: string,
    to?: string,
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
            desktop,
            outline,
            noDecorate,
            closeNav,
            ...props
        } = this.props

        return React.cloneElement(NavLink.Link, {
            className: classNames(NavLink.Link.props.className, className, styles.navLink, {
                [styles.opaqueNav]: opaqueNav,
                [styles.outline]: outline,
                [buttonStyles.btn]: outline,
                [buttonStyles.btnSecondary]: outline,
            }, screensToClassNames(!!mobile, !!desktop)),
            onClick: this.onClick,
            ...props,
            children: (
                <span className={classNames(styles.inner, {
                    [styles.underlined]: !outline && !noDecorate,
                })}
                >
                    {children}
                </span>
            ),
        })
    }
}

NavLink.Link = (
    <a href="#">
        {/* placeholder */}
    </a>
)

export default NavLink
