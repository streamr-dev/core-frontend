// @flow

import React, { type Element } from 'react'
import { Popover } from 'reactstrap'
import cx from 'classnames'

import ContextMenuItem from './ContextMenuItem'
import styles from './contextMenu.pcss'

export type Props = {
    target: ?HTMLDivElement,
    placement: string,
    isOpen: boolean,
    children: Array<Element<typeof ContextMenuItem>>,
    className?: ?string,
}

class ContextMenu extends React.Component<Props> {
    static Item = ContextMenuItem

    render = () => {
        const {
            target,
            placement,
            isOpen,
            children,
            className,
        } = this.props

        return (
            <Popover
                isOpen={isOpen}
                placement={placement}
                target={target}
                className={cx(styles.menu, className)}
                hideArrow
            >
                {children}
            </Popover>
        )
    }
}

export default ContextMenu
