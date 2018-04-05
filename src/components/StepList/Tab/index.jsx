// @flow

import React, { type Node } from 'react'
import classNames from 'classnames'
import styles from './tab.pcss'

type Props = {
    children: Node,
    active: boolean,
    onClick: (number) => void,
    index: number,
}

class Tab extends React.Component<Props> {
    onClick = (e: SyntheticInputEvent<EventTarget>) => {
        const { onClick, index } = this.props
        e.preventDefault()
        onClick(index)
    }

    render() {
        const { children, active, index } = this.props
        return (
            <a href="#" onClick={this.onClick} className={classNames(active && styles.active)}>
                Step {index + 1} | {children}
            </a>
        )
    }
}

export default Tab
