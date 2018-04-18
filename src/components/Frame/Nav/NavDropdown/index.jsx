// @flow

import React, { type Node } from 'react'
import classNames from 'classnames'
import NavLink from '../NavLink'
import navLinkStyles from '../NavLink/navLink.pcss'
import styles from './navDropdown.pcss'

type Props = {
    label: string,
    children: Node,
    opaqueNav?: boolean,
}

const NavDropdown = ({ label, children, opaqueNav, ...props }: Props) => (
    <div className={classNames(styles.dropdown, 'hidden-sm-down', navLinkStyles.navLinkParent)}>
        <NavLink opaqueNav={opaqueNav} {...props}>
            {label}
        </NavLink>
        <div className={styles.dropdownMenuWrapper}>
            <ul className={classNames(styles.dropdownMenu)}>
                {React.Children.map(children, (child) => (
                    <li>{child}</li>
                ))}
            </ul>
        </div>
    </div>
)

export default NavDropdown
