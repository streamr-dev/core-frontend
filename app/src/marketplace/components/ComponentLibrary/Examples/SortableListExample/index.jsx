// @flow

import React from 'react'

import { arrayMove } from 'react-sortable-hoc'
import SortableList, { type SortProps } from '$shared/components/SortableList'

type State = {
    items: Array<string>,
}

class SortableListExample extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)

        this.state = {
            items: Array(5).fill(true).map((v, i): string => `Item #${i}`),
        }
    }

    onSortEnd = ({ newIndex, oldIndex }: SortProps) => {
        this.setState(({ items }) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }))
    }

    render() {
        const { items } = this.state

        return (
            <SortableList onSortEnd={this.onSortEnd} lockAxis="y">
                {items.map((item) => (
                    <span key={item}>{item}</span>
                ))}
            </SortableList>
        )
    }
}

export default SortableListExample
