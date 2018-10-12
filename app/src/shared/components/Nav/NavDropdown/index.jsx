// @flow

import * as React from 'react'
import classNames from 'classnames'

import NavLink from '../NavLink'
import navLinkStyles from '../NavLink/navLink.pcss'
import styles from './navDropdown.pcss'

type Props = {
    label?: React.Node,
    toggle?: React.Node,
    children: React.Node,
    align?: string,
    twoColumns?: boolean,
    noPointer?: boolean,
}

const NavDropdown = ({
    label,
    toggle,
    children,
    align,
    twoColumns,
    noPointer,
    ...props
}: Props) => (
    <div className={classNames(styles.dropdown, 'hidden-sm-down', navLinkStyles.navLinkParent)}>
        {toggle || (
            <NavLink {...props}>
                {label}
            </NavLink>
        )}
        <div
            className={classNames(styles.dropdownMenuWrapper, {
                [styles.centered]: !align || align === 'center',
                [styles.pullLeft]: align === 'left',
                [styles.pullRight]: align === 'right',
                [styles.withPointerWrapper]: !noPointer,
            })}
        >
            <ul
                className={classNames(styles.dropdownMenu, {
                    [styles.withPointer]: !noPointer,
                    [styles.twoColumns]: !!twoColumns,
                })}
            >
                {React.Children.map(children, (child) => (
                    <li>{child}</li>
                ))}
            </ul>
        </div>
    </div>
)

export default NavDropdown
