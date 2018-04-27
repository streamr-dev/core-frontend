// @flow

import React, { type Node } from 'react'
import classNames from 'classnames'
import NavLink from '../NavLink'
import navLinkStyles from '../NavLink/navLink.pcss'
import styles from '../../Dropdown/dropdown.pcss'

type Props = {
    label: Node,
    children: Node,
    opaqueNav?: boolean
}

const NavDropdown = ({ label, children, opaqueNav, ...props }: Props) => (
    <div className={classNames(styles.dropdown, 'hidden-sm-down', navLinkStyles.navLinkParent)}>
        <NavLink opaqueNav {...props}>
            {label}
        </NavLink>
        <div
            className={classNames(styles.dropdownMenuWrapper, styles.centered, {
                [styles.opaqueNav]: opaqueNav,
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
