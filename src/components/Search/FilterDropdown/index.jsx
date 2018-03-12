// @flow

import React, { Component, type Node } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu } from '@streamr/streamr-layout'
import classNames from 'classnames'

import styles from './filterDropdown.pcss'

type Props = {
    title: Node,
    children: Node,
    className?: string,
}

type State = {
    open: boolean,
}

export default class FilterDropdown extends Component<Props, State> {
    state = {
        open: false
    }

    toggle = () => {
        this.setState({
            open: !this.state.open
        })
    }

    render() {
        const { title, children, className } = this.props

        return (
            <Dropdown toggle={this.toggle} isOpen={this.state.open} className={classNames(className, styles.categoryDropdown)}>
                <DropdownToggle href="#" tag="a">
                    {title}
                </DropdownToggle>
                <DropdownMenu>
                    {children}
                </DropdownMenu>
            </Dropdown>
        )
    }
}
