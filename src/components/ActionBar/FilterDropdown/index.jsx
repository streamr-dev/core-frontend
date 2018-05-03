// @flow

import React, { Component, type Node } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu } from '@streamr/streamr-layout'
import classNames from 'classnames'

import type { AnyFilter } from '../../../flowtype/product-types'
import FilterDropdownItem from '../FilterDropdownItem'

import styles from './filterDropdown.pcss'

type Props = {
    title: Node,
    children: Node,
    className?: string,
    onClear: (filter: ?AnyFilter) => void,
}

type State = {
    open: boolean,
}

export default class FilterDropdown extends Component<Props, State> {
    state = {
        open: false,
    }

    onClick = (e: SyntheticInputEvent<EventTarget>) => {
        e.preventDefault()
    }

    toggle = () => {
        this.setState({
            open: !this.state.open,
        })
    }

    render() {
        const { title, children, className } = this.props

        return (
            <Dropdown toggle={this.toggle} isOpen={this.state.open} onClick={this.onClick} className={classNames(className, styles.categoryDropdown)}>
                <DropdownToggle href="#" tag="a">
                    {title}
                </DropdownToggle>
                <DropdownMenu>
                    {children}
                    <FilterDropdownItem
                        value={null}
                        selected={false}
                        onSelect={this.props.onClear}
                        secondaryDropdown
                    >
                        Clear
                    </FilterDropdownItem>
                </DropdownMenu>
            </Dropdown>
        )
    }
}
