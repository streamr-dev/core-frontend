// @flow

import React, { type Node } from 'react'
import classNames from 'classnames'
import styles from './navItem.pcss'
import screensToClassNames from '../screens'

type Props = {
    children: Node,
    opaqueNav?: boolean,
}

const NavItem = ({ children, opaqueNav }: Props) => {
    const child = React.Children.only(children)

    if (child.props.raw) {
        return child
    }

    const { mobile, desktop } = child.props
    return (
        <li className={classNames(styles.item, screensToClassNames(!!mobile, !!desktop))}>
            {React.cloneElement(child, {
                mobile: false,
                desktop: false,
                opaqueNav,
            })}
        </li>
    )
}

export default NavItem
