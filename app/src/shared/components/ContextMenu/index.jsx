// @flow

import React, { type ElementType } from 'react'
import { Popover } from 'reactstrap'

import ContextMenuItem from './ContextMenuItem'
import styles from './contextMenu.pcss'

export type Props = {
    target: ElementType,
    placement: string,
    isOpen: boolean,
    children: Array<ContextMenuItem>,
}

class ContextMenu extends React.Component<Props> {
    static Item = ContextMenuItem

    render = () => {
        const { target, placement, isOpen, children } = this.props
        return (
            <Popover
                isOpen={isOpen}
                placement={placement}
                target={target}
                className={styles.menu}
                hideArrow
            >
                {children}
            </Popover>
        )
    }
}

export default ContextMenu
