// @flow

import React, { Component, type Node } from 'react'
import { Dropdown as DropdownContainer, DropdownToggle, DropdownMenu } from 'reactstrap'
import classNames from 'classnames'
import dropdownStyles from '../../../../styles/pcss/dropdowns.pcss'
import styles from './dropdown.pcss'

type Props = {
    title: Node,
    children: Node,
    className?: string,
    noCaret?: boolean,
}

type State = {
    open: boolean,
}

export default class Dropdown extends Component<Props, State> {
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
        const { title, children, className, noCaret } = this.props

        return (
            <DropdownContainer
                toggle={this.toggle}
                isOpen={this.state.open}
                onClick={this.onClick}
                className={classNames(className, styles.root)}
            >
                <DropdownToggle href="#" tag="a" className={dropdownStyles.textToggle}>
                    {title}
                    {!noCaret && <span className={dropdownStyles.caret}>&#9662;</span>}
                </DropdownToggle>
                <DropdownMenu>
                    {children}
                </DropdownMenu>
            </DropdownContainer>
        )
    }
}
