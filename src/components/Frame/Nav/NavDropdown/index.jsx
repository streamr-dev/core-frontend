// @flow

import React, { type Node } from 'react'
import classNames from 'classnames'
import NavLink from '../NavLink'
import navLinkStyles from '../NavLink/navLink.pcss'
import styles from '../../Dropdown/dropdown.pcss'

type Props = {
    label: Node,
    children: Node,
    align?: string,
}

const NavDropdown = ({ label, children, align, ...props }: Props) => (
    <div className={classNames(styles.dropdown, 'hidden-sm-down', navLinkStyles.navLinkParent)}>
        <NavLink {...props}>
            {label}
        </NavLink>
        <div
            className={classNames(styles.dropdownMenuWrapper, {
                [styles.centered]: !align || align === 'center',
                [styles.pullLeft]: align === 'left',
                [styles.pullRight]: align === 'right',
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
