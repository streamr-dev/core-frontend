// @flow

import * as React from 'react'
import { SortableContainer } from 'react-sortable-hoc'

import SortableItem from './SortableItem'

export type SortProps = {
    oldIndex: number,
    newIndex: number,
}

type Props = {
    children: React.Node,
}

const SortableList = ({ children, ...props }: Props) => (
    <div {...props}>
        {React.Children.map(children, (child, index) => (
            <SortableItem index={index}>
                {child}
            </SortableItem>
        ))}
    </div>
)

export default SortableContainer(SortableList)
