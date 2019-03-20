// @flow

import React, { type Node } from 'react'
import { Tooltip as RsTooltip } from 'reactstrap'

import styles from './tooltip.pcss'

type Props = {
    value: Node,
    children?: Node,
}
type State = {
    id: number,
    open: boolean,
}

let counter = 0

class Tooltip extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        counter += 1

        this.state = {
            open: false,
            id: counter + 1,
        }
    }

    toggle = () => {
        this.setState(({ open }) => ({
            open: !open,
        }))
    }

    render() {
        const { open, id } = this.state
        const { value, children, ...otherProps } = this.props
        return (
            <div id={`tooltip-${id}`} className={styles.tooltipContainer}>
                {children}
                <RsTooltip
                    innerClassName={styles.tooltip}
                    hideArrow
                    placement="top"
                    delay={{
                        show: 300,
                        hide: 250,
                    }}
                    {...otherProps}
                    isOpen={open}
                    target={`tooltip-${id}`}
                    toggle={this.toggle}
                >
                    {value}
                </RsTooltip>
            </div>
        )
    }
}

export default Tooltip
