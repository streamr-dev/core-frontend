// @flow

import React, { type Node } from 'react'
import classNames from 'classnames'
import NavLink from '../NavLink'
import navLinkStyles from '../NavLink/navLink.pcss'
import styles from '../../Dropdown/dropdown.pcss'

type Props = {
    label: Node,
    children: Node,
    opaqueNav?: boolean,
    pullLeft?: boolean,
    pullRight?: boolean,
}

const NavDropdown = ({
    label,
    children,
    opaqueNav,
    pullLeft,
    pullRight,
    ...props
}: Props) => (
    <div className={classNames(styles.dropdown, 'hidden-sm-down', navLinkStyles.navLinkParent)}>
        <NavLink opaqueNav {...props}>
            {label}
        </NavLink>
        <div
            className={classNames(styles.dropdownMenuWrapper, {
                [styles.opaqueNav]: opaqueNav,
                [styles.centered]: !pullLeft && !pullRight,
                [styles.pullLeft]: pullLeft,
                [styles.pullRight]: pullRight,
            })}
        >
            <ul className={classNames(styles.dropdownMenu, styles.withPointer)}>
                {React.Children.map(children, (child) => (
                    <li>{child}</li>
                ))}
            </ul>
        </div>
    </div>
)

export default NavDropdown
