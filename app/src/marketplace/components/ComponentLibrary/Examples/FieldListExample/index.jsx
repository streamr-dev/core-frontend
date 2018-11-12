// @flow

import React from 'react'

import { arrayMove } from 'react-sortable-hoc'

import FieldList from '$shared/components/FieldList'
import FieldItem from '$shared/components/FieldList/FieldItem'
import { type SortProps } from '$shared/components/SortableList'

type State = {
    items: Array<string>,
}

class FieldListExample extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)

        this.state = {
            items: ['Name', 'Price', 'Comment', 'Created at', 'Updated at'],
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
            <FieldList onSortEnd={this.onSortEnd} lockAxis="y">
                {items.map((item) => (
                    <FieldItem key={item} name={item} />
                ))}
            </FieldList>
        )
    }
}

export default FieldListExample
