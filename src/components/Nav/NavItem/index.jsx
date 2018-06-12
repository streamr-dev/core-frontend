// @flow

import * as React from 'react'
import classNames from 'classnames'
import screensToClassNames from '../screens'
import styles from './navItem.pcss'

type Props = {
    children: React.Node,
    opaqueNav?: boolean,
    className?: string,
}

const NavItem = ({ children, opaqueNav, className }: Props) => {
    const child = React.Children.only(children)

    if (child.props.raw) {
        return child
    }

    const { mobile, desktop, outline } = child.props
    return (
        <li className={classNames(styles.item, className, {
            [styles.outline]: outline,
        }, screensToClassNames(!!mobile, !!desktop))}
        >
            {React.cloneElement(child, {
                mobile: false,
                desktop: false,
                opaqueNav,
            })}
        </li>
    )
}

export default NavItem
