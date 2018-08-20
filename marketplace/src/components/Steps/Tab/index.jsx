// @flow

import React, { type Node } from 'react'
import classNames from 'classnames'
import { Translate } from '@streamr/streamr-layout'

import styles from './tab.pcss'

type Props = {
    children: Node,
    active: boolean,
    onClick: (number) => void,
    index: number,
    disabled: boolean,
}

class Tab extends React.Component<Props> {
    onClick = (e: SyntheticInputEvent<EventTarget>) => {
        const { onClick, index, disabled, active } = this.props
        e.preventDefault()

        if (!disabled && !active) {
            onClick(index)
        }
    }

    render() {
        const { children, active, index, disabled } = this.props
        return (
            <a href="#" onClick={this.onClick} className={classNames(styles.tab, active && styles.active, disabled && styles.disabled)}>
                <Translate value="steps.step" number={index + 1} /> | {children}
            </a>
        )
    }
}

export default Tab
