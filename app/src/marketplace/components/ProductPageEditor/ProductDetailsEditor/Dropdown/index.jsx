// @flow

import React, { Component, type Node } from 'react'
import { Dropdown as DropdownContainer, DropdownToggle, DropdownMenu } from 'reactstrap'
import cx from 'classnames'
import dropdownStyles from '../../../../styles/pcss/dropdowns.pcss'
import styles from './dropdown.pcss'

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

export default class Dropdown extends Component<Props, State> {
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
            <DropdownContainer
                toggle={this.toggle}
                isOpen={this.state.open}
                onClick={this.onClick}
                className={cx(className, styles.root)}
            >
                <DropdownToggle
                    href="#"
                    tag="a"
                    {...toggleProps}
                    className={cx(dropdownStyles.textToggle, toggleClassName)}
                >
                    {title}
                    {!noCaret && <span className={dropdownStyles.caret}>&#9662;</span>}
                </DropdownToggle>
                <DropdownMenu
                    {...menuProps}
                    className={menuClassName}
                >
                    {children}
                </DropdownMenu>
            </DropdownContainer>
        )
    }
}
