// @flow

import * as React from 'react'
import cx from 'classnames'
import LinkItem from '../LinkItem'
import styles from './dropdownItem.pcss'

type Props = {
    label?: React.Node,
    toggle?: React.Node,
    children: React.Node,
    align?: string,
    noPointer?: boolean,
}

const DropdownItem = ({
    label,
    toggle,
    children,
    align,
    noPointer,
    ...props
}: Props) => (
    <div className={cx(styles.dropdown, LinkItem.styles.parent)}>
        {toggle || (
            <LinkItem {...props}>
                {label || null}
            </LinkItem>
        )}
        <div
            className={cx(styles.dropdownMenuWrapper, {
                [styles.centered]: !align || align === 'center',
                [styles.pullLeft]: align === 'left',
                [styles.pullRight]: align === 'right',
            })}
        >
            <ul
                className={styles.dropdownMenu}
            >
                {React.Children.map(children, (child) => (child ? (
                    <li>{child}</li>
                ) : (
                    <li className={styles.separator} />
                )))}
            </ul>
        </div>
    </div>
)

export default DropdownItem
