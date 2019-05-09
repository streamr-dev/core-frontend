// @flow

import * as React from 'react'
import cx from 'classnames'
import LinkItem from '../LinkItem'
import styles from './dropdownItem.pcss'

type Props = {
    align?: string,
    children: React.Node,
    eatPadding?: boolean,
    label?: React.Node,
    noPointer?: boolean,
    toggle?: React.Node,
}

const DropdownItem = ({
    align,
    children,
    eatPadding,
    label,
    noPointer,
    toggle,
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
                [styles.eatPadding]: eatPadding,
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

DropdownItem.defaultProps = {
    eatPadding: true,
}

DropdownItem.styles = styles

export default DropdownItem
