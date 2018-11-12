// @flow

import * as React from 'react'
import { SortableContainer } from 'react-sortable-hoc'

import List from '../List'
import SortableItem from './SortableItem'

export type SortProps = {
    oldIndex: number,
    newIndex: number,
}

type Props = {
    children: React.Node,
}

const SortableList = ({ children }: Props) => (
    <List zeroized>
        {React.Children.map(children, (child, index) => (
            <SortableItem key={`item-${index}`} index={index}>
                {child}
            </SortableItem>
        ))}
    </List>
)

export default SortableContainer(SortableList)
