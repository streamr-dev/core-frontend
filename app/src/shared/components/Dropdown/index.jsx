// @flow

import React, { Component, type Node, type Element, type ChildrenArray } from 'react'
import {
    Dropdown as RsDropdown,
    DropdownToggle as RsDropdownToggle,
    DropdownMenu as RsDropdownMenu,
} from 'reactstrap'
import cx from 'classnames'

import SvgIcon from '$shared/components/SvgIcon'

import DropdownItem from './DropdownItem'
import styles from './dropdown.pcss'

type ToggleStyle = 'normal' | 'small'

type Props = {
    title: Node,
    selectedItem?: ?string,
    children: ChildrenArray<Element<typeof DropdownItem>>,
    className?: string,
    toggleStyle?: ToggleStyle,
    onChange: (string) => void,
    disabled?: boolean,
}

type State = {
    isOpen: boolean,
}

export default class Dropdown extends Component<Props, State> {
    static Item = DropdownItem

    state = {
        isOpen: false,
    }

    onClick = (e: SyntheticInputEvent<EventTarget>) => {
        e.preventDefault()
    }

    onItemClick = (index: number) => {
        const { children } = this.props
        const { value } = React.Children.toArray(children)[index].props
        this.props.onChange(value)
    }

    getOnItemClick = (index: number) => (event: SyntheticInputEvent<EventTarget>) => {
        event.preventDefault()
        return this.onItemClick(index)
    }

    open = () => {
        this.setState({
            isOpen: true,
        })
    }

    close = () => {
        this.setState({
            isOpen: false,
        })
    }

    toggle = () => {
        if (this.state.isOpen) {
            this.close()
        } else {
            this.open()
        }
    }

    render() {
        const {
            title,
            children,
            className,
            toggleStyle,
            selectedItem,
            disabled,
        } = this.props
        const { isOpen } = this.state
        const childrenArray = React.Children.toArray(children)
        const selectedIndex = childrenArray.findIndex((child) => child.props.value === selectedItem)
        const currentItem = (selectedIndex >= 0 && childrenArray[selectedIndex].props.children) || null

        return (
            <RsDropdown
                toggle={this.toggle}
                isOpen={isOpen}
                onClick={this.onClick}
                className={cx(className, styles.dropdown, {
                    [styles.open]: isOpen,
                })}
                disabled={disabled}
            >
                <RsDropdownToggle className={toggleStyle === 'small' ? styles.toggleSmall : styles.toggle} disabled={disabled}>
                    {currentItem || title}
                    <SvgIcon name="caretUp" className={styles.caret} />
                </RsDropdownToggle>
                <RsDropdownMenu>
                    {React.Children.map(children, (child, index) => React.cloneElement(child, {
                        active: child.props.value === selectedItem,
                        onClick: this.getOnItemClick(index),
                    }))}
                </RsDropdownMenu>
            </RsDropdown>
        )
    }
}
