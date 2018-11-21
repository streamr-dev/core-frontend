// @flow

import React, { Component, type Node } from 'react'
import { DropdownItem as RsDropdownItem } from 'reactstrap'
import classNames from 'classnames'

import styles from './dropdownItem.pcss'

/* eslint-disable react/no-unused-prop-types */

type Props = {
    children: Node,
    value: string,
    index?: number,
    selected?: boolean,
    onClick?: (index: number) => void,
}

const TickIcon = (props: any) => (
    <svg width="10" height="8" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M1.271 4.55l2.2 2.39 5.657-5.658"
            stroke="#323232"
            strokeWidth="1.5"
            fill="none"
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export default class DropdownItem extends Component<Props> {
    onClick = (e: SyntheticInputEvent<EventTarget>) => {
        const { onClick, index } = this.props

        e.preventDefault()
        if (index != null && onClick) {
            onClick(index)
        }
    }

    render() {
        const { children, selected } = this.props

        return (
            <RsDropdownItem
                tag="a"
                href="#"
                onClick={this.onClick}
                className={classNames(styles.dropdownItem, {
                    active: selected,
                })}
            >
                {children}
                {selected &&
                    <TickIcon className={styles.tickIcon} />
                }
            </RsDropdownItem>
        )
    }
}
