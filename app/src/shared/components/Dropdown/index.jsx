// @flow

import React, { Component, type Node, type Element } from 'react'
import {
    Dropdown as RsDropdown,
    DropdownToggle as RsDropdownToggle,
    DropdownMenu as RsDropdownMenu,
} from 'reactstrap'
import cx from 'classnames'

import DropdownItem from './DropdownItem'
import styles from './dropdown.pcss'

type Props = {
    title: Node,
    selectedValue: ?string,
    children: Array<Element<typeof DropdownItem>>,
    className?: string,
    onChange: (string) => void,
}

type State = {
    isOpen: boolean,
}

const CaretIcon = (props: any) => (
    <svg width="11" height="6" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M1 5.245L5.245 1l4.243 4.243"
            strokeWidth="1.5"
            fill="none"
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

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
        const { title, children, className, selectedValue } = this.props
        const { isOpen } = this.state
        const selectedIndex = children.findIndex((child) => child.props.value === selectedValue)
        const selectedItem = (selectedIndex >= 0 && React.Children.toArray(children)[selectedIndex].props.children) || null

        return (
            <RsDropdown
                toggle={this.toggle}
                isOpen={isOpen}
                onClick={this.onClick}
                className={cx(className, styles.dropdown, {
                    [styles.open]: isOpen,
                })}
            >
                <RsDropdownToggle href="#" tag="a" className={cx(styles.toggle)}>
                    {selectedItem || title}
                    <CaretIcon className={styles.caret} />
                </RsDropdownToggle>
                <RsDropdownMenu>
                    {React.Children.map(children, (child, index) => React.cloneElement(child, {
                        index,
                        key: index,
                        selected: child.props.value === selectedValue,
                        onClick: this.onItemClick,
                    }))}
                </RsDropdownMenu>
            </RsDropdown>
        )
    }
}
