// @flow

import React, { Component, type Node } from 'react'
import { Dropdown, DropdownToggle } from 'reactstrap'
import classNames from 'classnames'
import MediaQuery from 'react-responsive'
import { breakpoints } from 'streamr-layout/dist/bundle'

import type { AnyFilter } from '../../../../../../marketplace/src/flowtype/product-types'

import dropdownStyles from '../../../../../../marketplace/src/styles/pcss/dropdowns.pcss'
import styles from './filterSelector.pcss'
import FilterModal from './FilterModal/index'
import FilterDropdown from './FilterDropdown/index'

const { sm } = breakpoints

type Props = {
    title: Node,
    selected: Node,
    children: Node,
    className?: string,
    onClear: (filter: ?AnyFilter) => void,
}

type State = {
    open: boolean,
}

export default class FilterSelector extends Component<Props, State> {
    state = {
        open: false,
    }

    onClick = (e: SyntheticInputEvent<EventTarget>) => {
        e.preventDefault()
    }

    open = () => {
        this.setState({
            open: true,
        })
    }

    close = () => {
        this.setState({
            open: false,
        })
    }

    toggle = () => {
        if (this.state.open) {
            this.close()
        } else {
            this.open()
        }
    }

    render() {
        const {
            title, selected, children, className, onClear,
        } = this.props
        const { open } = this.state

        return (
            <MediaQuery maxWidth={sm.max}>
                {(isMobile: boolean) => (
                    <Dropdown
                        toggle={this.toggle}
                        isOpen={this.state.open}
                        onClick={this.onClick}
                        className={classNames(className, styles.filterDropdown)}
                    >
                        <DropdownToggle href="#" tag="a" className={dropdownStyles.textToggle}>
                            {selected || title}
                            <span className={dropdownStyles.caret}>&#9662;</span>
                        </DropdownToggle>
                        {(isMobile && open) ? (
                            <FilterModal title={title} onClear={onClear} onClose={this.close}>
                                {children}
                            </FilterModal>
                        ) : (
                            <FilterDropdown onClear={onClear}>
                                {children}
                            </FilterDropdown>
                        )}
                    </Dropdown>
                )}
            </MediaQuery>
        )
    }
}
