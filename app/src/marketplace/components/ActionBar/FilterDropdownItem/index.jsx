// @flow

import React, { Component, type Node } from 'react'
import { DropdownItem } from 'reactstrap'
import classNames from 'classnames'

import type { AnyFilter } from '../../../flowtype/product-types'

import styles from './filterDropdownItem.pcss'

type Props = {
    children: Node,
    value?: ?AnyFilter,
    selected: boolean,
    onSelect: (value: ?AnyFilter) => void,
    secondaryDropdown?: boolean,
}

export default class FilterDropdownItem extends Component<Props> {
    onClick = (e: SyntheticInputEvent<EventTarget>) => {
        e.preventDefault()
        this.props.onSelect(this.props.value)
    }

    render() {
        const { children, selected, secondaryDropdown } = this.props
        return (
            <DropdownItem
                onClick={this.onClick}
                className={classNames(styles.dropdownItem, {
                    active: selected,
                    [styles.secondary]: secondaryDropdown,
                })}
            >
                {children}
            </DropdownItem>
        )
    }
}
