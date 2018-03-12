// @flow

import React, { Component, type Node } from 'react'
import { DropdownItem } from '@streamr/streamr-layout'
import classNames from 'classnames'

import type { CategoryFilter } from '../../../flowtype/product-types'

type Value = CategoryFilter

type Props = {
    children: Node,
    value: Value,
    selected: boolean,
    onSelect: (value: Value) => void,
}

export default class FilterDropdownItem extends Component<Props> {
    onClick = (e: SyntheticInputEvent<EventTarget>) => {
        e.preventDefault()
        this.props.onSelect(this.props.value)
    }

    render() {
        const { children, selected } = this.props
        return (
            <DropdownItem tag="a" href="#" onClick={this.onClick} className={classNames(selected && 'active')}>
                {children}
            </DropdownItem>
        )
    }
}
