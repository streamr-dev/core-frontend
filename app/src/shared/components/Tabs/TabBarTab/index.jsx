// @flow

import React, { type Node } from 'react'
import classNames from 'classnames'

import styles from './tabBarTab.pcss'

type Props = {
    children: Node,
    active: boolean,
    onClick: (number) => void,
    index: number,
    disabled?: boolean,
}

class TabBarTab extends React.Component<Props> {
    onClick = (e: SyntheticInputEvent<EventTarget>) => {
        const { onClick, index, disabled, active } = this.props
        e.preventDefault()

        if (!disabled && !active) {
            onClick(index)
        }
    }

    render() {
        const { children, active, disabled } = this.props
        return (
            <a href="#" onClick={this.onClick} className={classNames(styles.tab, active && styles.active, disabled && styles.disabled)}>
                {children}
            </a>
        )
    }
}

export default TabBarTab
