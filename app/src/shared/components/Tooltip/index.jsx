// @flow

import React, { type Node } from 'react'
import { Tooltip as RsTooltip } from 'reactstrap'

import styles from './tooltip.pcss'

type Props = {
    value: Node,
    children?: Node,
    container?: any,
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
        const { value, children, container, ...otherProps } = this.props
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
                    // uninitialised ref.current values are null.
                    // null crashes this plugin if passed as container
                    // gloss over this by passing undefined instead
                    container={container || undefined}
                >
                    {value}
                </RsTooltip>
            </div>
        )
    }
}

export default Tooltip
