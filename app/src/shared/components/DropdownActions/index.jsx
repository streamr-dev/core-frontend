// @flow

import React, { Component, type Node } from 'react'
import { Dropdown as RsDropdown, DropdownItem as RsDropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap'
import cx from 'classnames'
import styles from './dropdownActions.pcss'

type Props = {
    title: Node,
    children: Node,
    className?: string,
    noCaret?: boolean,
    toggleProps: {
        className?: string,
    },
    menuProps: {
        className?: string,
    },
}

type State = {
    open: boolean,
}

export default class DropdownActions extends Component<Props, State> {
    static Item = RsDropdownItem

    static defaultProps = {
        toggleProps: {},
        menuProps: {},
    }

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
        const {
            title,
            children,
            className,
            noCaret,
            toggleProps: { className: toggleClassName, ...toggleProps },
            menuProps: { className: menuClassName, ...menuProps },
        } = this.props

        return (
            <RsDropdown
                toggle={this.toggle}
                isOpen={this.state.open}
                onClick={this.onClick}
                className={cx(className, styles.dropdown)}
            >
                <DropdownToggle
                    href="#"
                    tag="div"
                    {...toggleProps}
                    className={cx(styles.textToggle, toggleClassName)}
                >
                    {title}
                    {!noCaret && <span className={styles.caret}>&#9662;</span>}
                </DropdownToggle>
                <DropdownMenu
                    {...menuProps}
                    className={cx(styles.menu, menuClassName)}
                >
                    {children}
                </DropdownMenu>
            </RsDropdown>
        )
    }
}
